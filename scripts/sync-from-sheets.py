#!/usr/bin/env python3
"""
Sync Google Sheets tabs into the NEPA-PRO Dialer.

Reads sheets-config.json, fetches each tab as CSV, parses & dedupes the rows,
writes leads-{category}.js, and updates leads-manifest.json.

Auth modes:
  1. Public sheet (default)
     Set the spreadsheet sharing to "Anyone with the link → Viewer" and the
     CSV export URL works without any credentials.
  2. Service account
     Set GOOGLE_SERVICE_ACCOUNT_JSON env var to the JSON of a Google Cloud
     service account that has been granted Viewer access on the sheet.
  3. API key
     Set GOOGLE_SHEETS_API_KEY env var with a Google Cloud Sheets API key.
     Sheet must still be public for API key access.

Usage:
  python3 scripts/sync-from-sheets.py            # uses sheets-config.json
  python3 scripts/sync-from-sheets.py --auto     # auto-discover all tabs (needs auth)
  python3 scripts/sync-from-sheets.py --dry-run  # show changes without writing
"""

from __future__ import annotations
import argparse
import csv
import io
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "sheets-config.json"
MANIFEST = ROOT / "leads-manifest.json"

# ----- Helpers -----------------------------------------------------------

def digits(s: str) -> str:
    return re.sub(r"\D", "", s or "")

def parse_address(addr: str) -> dict:
    """Pull city/state/zip from a US address string."""
    out = {"a": addr or "", "c": "", "s": "PA", "z": ""}
    if not addr:
        return out
    m = re.search(r",\s*([^,]+),\s*([A-Z]{2})\s*(\d{5})?\s*$", addr)
    if m:
        out["c"] = m.group(1).strip()
        out["s"] = m.group(2).strip()
        out["z"] = (m.group(3) or "").strip()
    return out

def http_get(url: str, headers: dict | None = None, timeout: int = 30) -> bytes:
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()

def slugify(s: str) -> str:
    s = (s or "").lower().strip()
    s = re.sub(r"&", " and ", s)
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")

# Map common sheet-tab names to canonical dialer category IDs
CATEGORY_ALIASES = {
    "pizza": "pizza", "pizzeria": "pizza", "pizzerias": "pizza",
    "nails": "nail-salons", "nail-salons": "nail-salons", "nail-salon": "nail-salons", "nail": "nail-salons", "manicure": "nail-salons",
    "hair": "hair", "hair-salons": "hair", "hair-salon": "hair", "salons": "hair", "salon": "hair",
    "barber": "barber", "barbers": "barber", "barbershops": "barber", "barbershop": "barber",
    "lashes": "lashes", "lash": "lashes", "brows": "lashes", "lashes-and-brows": "lashes", "lashes-brows": "lashes",
    "roofers": "roofers", "roofer": "roofers", "roofing": "roofers",
    "plumbers": "plumbers", "plumber": "plumbers", "plumbing": "plumbers",
    "hvac": "hvac", "heating": "hvac", "cooling": "hvac", "hvac-r": "hvac",
    "electricians": "electricians", "electrician": "electricians", "electric": "electricians", "electrical": "electricians",
    "handyman": "handyman", "handymen": "handyman", "handy": "handyman",
    "pet-services": "pet-services", "pets": "pet-services", "pet": "pet-services", "vet": "pet-services", "vets": "pet-services", "veterinary": "pet-services", "groomers": "pet-services", "grooming": "pet-services",
    "home-services": "home-services", "home": "home-services", "cleaning": "home-services", "landscaping": "home-services", "lawn-care": "home-services",
    "food-makers": "food-makers", "food": "food-makers", "bakers": "food-makers", "bakery": "food-makers", "caterers": "food-makers", "catering": "food-makers", "restaurants": "food-makers"
}

VALID_CATEGORIES = {
    "pizza", "nail-salons", "hair", "barber", "lashes", "roofers",
    "plumbers", "hvac", "electricians", "handyman", "pet-services",
    "home-services", "food-makers"
}


# ----- CSV header detection ---------------------------------------------

def find_header_index(headers: list[str], *names: str) -> int:
    """Find the first matching header (case-insensitive) from a list of candidates."""
    norm = [h.strip().lower() for h in headers]
    for n in names:
        n = n.lower()
        if n in norm:
            return norm.index(n)
    # also try contains (e.g. "Phone (Website)" matches "phone")
    for i, h in enumerate(norm):
        for n in names:
            if h == n.lower():
                return i
    return -1

def header_map(headers: list[str]) -> dict:
    """Map common column names to indices."""
    return {
        "name":     find_header_index(headers, "name", "business", "business name", "company", "shop"),
        "category": find_header_index(headers, "category", "categories"),
        "address":  find_header_index(headers, "address", "full address", "location", "street address"),
        "phone":    find_header_index(headers, "phone", "phone number", "telephone", "tel"),
        "email":    find_header_index(headers, "email", "e-mail", "email address"),
        "website":  find_header_index(headers, "website", "web", "url", "site"),
        "rating":   find_header_index(headers, "rating", "stars", "google rating"),
        "reviews":  find_header_index(headers, "reviews", "review count", "review", "# of reviews", "number of reviews"),
        "year":     find_header_index(headers, "year", "year from business", "established", "since"),
        "city":     find_header_index(headers, "city", "town"),
        "state":    find_header_index(headers, "state"),
        "zip":      find_header_index(headers, "zip", "zipcode", "postal", "postal code"),
        "facebook": find_header_index(headers, "facebook", "facebook (web)", "fb"),
        "instagram":find_header_index(headers, "instagram", "instagram (web)", "ig"),
        "twitter":  find_header_index(headers, "twitter", "twitter (web)", "x"),
    }

def get_cell(row: list[str], idx: int) -> str:
    if idx < 0 or idx >= len(row):
        return ""
    return (row[idx] or "").strip()


# ----- Lead extraction --------------------------------------------------

def parse_csv_to_leads(csv_text: str, category: str) -> list[dict]:
    rows = list(csv.reader(io.StringIO(csv_text)))
    if len(rows) < 2:
        return []
    headers = rows[0]
    H = header_map(headers)

    seen_keys: set[tuple[str, str]] = set()
    leads: list[dict] = []

    for r in rows[1:]:
        if not any(c.strip() for c in r):
            continue
        name = get_cell(r, H["name"])
        if not name:
            continue
        if "CLOSED" in name.upper():
            continue
        phone_d = digits(get_cell(r, H["phone"]))
        if len(phone_d) != 10:
            # Skip rows without a clean US phone — can't dial anyway
            continue
        key = (name.lower().strip(), phone_d)
        if key in seen_keys:
            continue
        seen_keys.add(key)

        addr = get_cell(r, H["address"])
        loc = parse_address(addr)
        # Prefer explicit columns when present
        city = get_cell(r, H["city"]) or loc["c"]
        state = get_cell(r, H["state"]) or loc["s"]
        zipc = get_cell(r, H["zip"]) or loc["z"]

        rating_s = get_cell(r, H["rating"])
        try:
            rating = float(rating_s) if rating_s else None
        except ValueError:
            rating = None
        reviews_s = get_cell(r, H["reviews"])
        try:
            reviews = int(reviews_s) if reviews_s else 0
        except ValueError:
            reviews = 0

        lead = {
            "n": name,
            "p": phone_d,
            "e": get_cell(r, H["email"]),
            "w": get_cell(r, H["website"]),
            "a": addr,
            "c": city,
            "s": state,
            "z": zipc,
            "r": rating,
            "v": reviews,
            "y": get_cell(r, H["year"]),
        }
        # Optional socials — only include if set so we don't bloat the JSON
        fb = get_cell(r, H["facebook"])
        ig = get_cell(r, H["instagram"])
        tw = get_cell(r, H["twitter"])
        if fb: lead["fb"] = fb
        if ig: lead["ig"] = ig
        if tw: lead["tw"] = tw

        leads.append(lead)

    leads.sort(key=lambda l: ((l["c"] or "").lower(), l["n"].lower()))
    return leads


# ----- Fetchers ---------------------------------------------------------

def fetch_csv_public(spreadsheet_id: str, gid: str) -> str:
    """Public CSV export. Sheet must be 'Anyone with link → Viewer'."""
    url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv&gid={gid}"
    body = http_get(url, headers={"User-Agent": "nepa-dialer-sync/1.0"})
    text = body.decode("utf-8", errors="replace")
    if "<html" in text[:500].lower() and "Sign in" in text:
        raise RuntimeError("Sheet requires authentication. Either share it as 'Anyone with link → Viewer', or set GOOGLE_SERVICE_ACCOUNT_JSON / GOOGLE_SHEETS_API_KEY.")
    return text

def fetch_csv_with_api_key(spreadsheet_id: str, sheet_name: str, api_key: str) -> str:
    """Use Sheets API v4 with API key. Sheet must still be public."""
    url = (f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/"
           f"{urllib.parse.quote(sheet_name)}?key={api_key}")
    raw = json.loads(http_get(url).decode("utf-8"))
    if "values" not in raw:
        raise RuntimeError(f"Sheets API returned no values: {raw}")
    out = io.StringIO()
    csv.writer(out).writerows(raw["values"])
    return out.getvalue()

def fetch_csv_with_service_account(spreadsheet_id: str, sheet_name: str, sa_json: str) -> str:
    """Use a service account. Most secure for private sheets."""
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        sys.exit("Service account mode requires:  pip install google-auth google-api-python-client")
    sa_info = json.loads(sa_json)
    creds = service_account.Credentials.from_service_account_info(
        sa_info, scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"])
    svc = build("sheets", "v4", credentials=creds, cache_discovery=False)
    res = svc.spreadsheets().values().get(spreadsheetId=spreadsheet_id, range=sheet_name).execute()
    values = res.get("values", [])
    out = io.StringIO()
    csv.writer(out).writerows(values)
    return out.getvalue()

def list_sheets_metadata(spreadsheet_id: str, api_key: str | None, sa_json: str | None) -> list[dict]:
    """List all tabs in the spreadsheet. Returns [{title, gid, index}]."""
    if sa_json:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        sa_info = json.loads(sa_json)
        creds = service_account.Credentials.from_service_account_info(
            sa_info, scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"])
        svc = build("sheets", "v4", credentials=creds, cache_discovery=False)
        meta = svc.spreadsheets().get(spreadsheetId=spreadsheet_id, fields="sheets(properties(title,sheetId,index))").execute()
    elif api_key:
        url = f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}?fields=sheets.properties&key={api_key}"
        meta = json.loads(http_get(url).decode("utf-8"))
    else:
        raise RuntimeError("--auto requires GOOGLE_SHEETS_API_KEY or GOOGLE_SERVICE_ACCOUNT_JSON.")
    out = []
    for s in meta.get("sheets", []):
        p = s.get("properties", {})
        out.append({"title": p.get("title", ""), "gid": str(p.get("sheetId", "")), "index": p.get("index", 0)})
    out.sort(key=lambda x: x["index"])
    return out


# ----- Output -----------------------------------------------------------

def write_leads_js(category: str, leads: list[dict], dest: Path) -> None:
    payload = json.dumps(leads, ensure_ascii=False, separators=(",", ":"))
    dest.write_text(
        f"/* NEPA-PRO Dialer — {category} leads. Generated by sync-from-sheets.py. */\n"
        f"window.LEADS = window.LEADS || {{}};\n"
        f"window.LEADS[{json.dumps(category)}] = {payload};\n",
        encoding="utf-8"
    )

def write_manifest(categories: list[dict], spreadsheet_url: str, dest: Path) -> None:
    data = {
        "lastUpdated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": spreadsheet_url,
        "categories": categories
    }
    dest.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


# ----- Main -------------------------------------------------------------

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--auto", action="store_true", help="Auto-discover all tabs in the spreadsheet (requires API key or service account).")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--config", default=str(CONFIG))
    args = ap.parse_args()

    cfg = json.loads(Path(args.config).read_text())
    spreadsheet_id = cfg["spreadsheetId"]
    spreadsheet_url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit"

    api_key = os.environ.get("GOOGLE_SHEETS_API_KEY")
    sa_json = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")

    # --- Determine the list of (category, gid|name) we'll fetch ---
    if args.auto:
        tabs_meta = list_sheets_metadata(spreadsheet_id, api_key, sa_json)
        tabs = []
        for t in tabs_meta:
            cat = CATEGORY_ALIASES.get(slugify(t["title"]))
            if not cat:
                print(f"  ↷ skipping unmapped tab: {t['title']!r}")
                continue
            tabs.append({"category": cat, "gid": t["gid"], "label": t["title"], "_sheet_name": t["title"]})
    else:
        tabs = list(cfg.get("tabs", []))

    if not tabs:
        print("No tabs to sync.")
        return 0

    print(f"Sheet: https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit")
    print(f"Auth:  {'service account' if sa_json else 'API key' if api_key else 'public CSV (anyone-with-link)'}")
    print()

    manifest_categories: list[dict] = []

    # Always preserve already-existing pizza data (it's the embedded sample)
    pizza_file = ROOT / "leads-pizza.js"
    if pizza_file.exists() and not any(t["category"] == "pizza" for t in tabs):
        # Count rows in existing leads-pizza.js
        try:
            txt = pizza_file.read_text()
            m = re.search(r"window\.LEADS\['?\"?pizza'?\"?\]\s*=\s*(\[.*?\])\s*;", txt, re.S)
            count = len(json.loads(m.group(1))) if m else 0
        except Exception:
            count = 0
        manifest_categories.append({"id": "pizza", "count": count, "file": "leads-pizza.js"})

    # Fetch each configured tab
    for t in tabs:
        cat = t["category"]
        if cat not in VALID_CATEGORIES:
            print(f"  ⚠ skipping unknown category: {cat}")
            continue
        print(f"→ {cat}  (gid={t.get('gid')}  label={t.get('label','?')})")
        try:
            if sa_json:
                # service account uses sheet name; if we don't have it from --auto, fall back to public-style
                name = t.get("_sheet_name") or t.get("label") or cat
                csv_text = fetch_csv_with_service_account(spreadsheet_id, name, sa_json)
            elif api_key:
                name = t.get("_sheet_name") or t.get("label") or cat
                csv_text = fetch_csv_with_api_key(spreadsheet_id, name, api_key)
            else:
                csv_text = fetch_csv_public(spreadsheet_id, t["gid"])
        except Exception as e:
            print(f"  ✗ fetch failed: {e}")
            continue

        leads = parse_csv_to_leads(csv_text, cat)
        print(f"  parsed {len(leads)} clean leads")
        if not leads:
            continue

        out = ROOT / f"leads-{cat}.js"
        if args.dry_run:
            print(f"  (dry-run) would write {out.name}")
        else:
            write_leads_js(cat, leads, out)
            print(f"  wrote {out.name}")

        manifest_categories.append({"id": cat, "count": len(leads), "file": f"leads-{cat}.js"})
        time.sleep(0.4)  # be nice to Google's CDN

    # Sort by category list order so the dialer renders consistently
    order = ["pizza", "nail-salons", "hair", "barber", "lashes", "roofers",
             "plumbers", "hvac", "electricians", "handyman", "pet-services",
             "home-services", "food-makers"]
    manifest_categories.sort(key=lambda c: order.index(c["id"]) if c["id"] in order else 999)

    if args.dry_run:
        print("\n(dry-run) manifest preview:")
        print(json.dumps({"categories": manifest_categories}, indent=2))
        return 0

    write_manifest(manifest_categories, spreadsheet_url, MANIFEST)
    print(f"\n✓ manifest updated → {MANIFEST.name}")
    print(f"  categories: {[c['id']+'='+str(c['count']) for c in manifest_categories]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
