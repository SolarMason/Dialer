# NEPA-PRO Dialer & CRM

iOS-style phone dialer + lightweight CRM + multi-category lead lists, with **automatic sync from Google Sheets**.
Veteran owned & operated · NEPA region · 100% client-side, fully offline-capable PWA.

**Live:** [dialer.nepa-pro.com](https://dialer.nepa-pro.com)
**Phone:** (570) 677-7971 · **Email:** service@nepa-pro.com

---

## What it does

- **Native-feeling iOS keypad** — large rounded buttons, T9 letters, long-press 0 for `+`, haptic feedback, keyboard support on desktop, live contact match while dialing
- **Recents** with grouped repeat-calls, contact lookup, swipe-to-clear
- **Contacts** — alphabetical, search, full CRUD, status pipeline (new / contacted / qualified / customer / lost)
- **Lead Lists organized by 13 categories** (pizza, nail salons, hair, barber, lashes, roofers, plumbers, hvac, electricians, handyman, pet services, home services, food makers)
- **Auto-sync from Google Sheets** — new tabs in the sheet show up in the dialer automatically, no code changes
- **Pipeline view** — stats, conversion %, status grouping
- **Business Card** — share via Web Share API, vCard download (`.vcf`), QR code (MECARD)
- **CSV import/export** for both contacts AND lead lists (manual fallback)
- **Installable PWA** — Add to Home Screen on iOS/Android, install on desktop
- **100% local data** — all data stored in your browser's localStorage. No server, no tracking, no account.

---

## Auto-sync: Google Sheets → Dialer

The dialer is wired to a Google Sheets workbook. Each **tab** in that workbook becomes a **lead category** in the dialer. The mapping is automatic — name a tab `Nails` and it ends up in the **Nail Salons** category; `Roofers` → Roofers; etc.

### How it flows

```
Google Sheet  →  GitHub Action (daily at 7AM EST)  →  sync-from-sheets.py
                 ↓
                 Generates leads-{category}.js + updates leads-manifest.json
                 ↓
                 Commits to main → GitHub Pages redeploys → Dialer shows new data
```

### One-time setup

You need to pick **one** of these auth methods so the sync can read your sheet:

#### Option A: Public sheet (simplest, ~30 seconds)

1. Open your Google Sheet
2. **Share** → Change to "Anyone with the link" → "Viewer" → Done
3. That's it — no credentials needed. The sync uses the public CSV-export URL.

#### Option B: API key (still needs sheet to be public)

1. [console.cloud.google.com](https://console.cloud.google.com) → enable **Google Sheets API**
2. **APIs & Services → Credentials → Create credentials → API key**
3. (Recommended) restrict the key to the Sheets API
4. In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**
5. Name: `GOOGLE_SHEETS_API_KEY`, value: paste the key
6. With this set, the sync will **auto-discover all tabs** in the sheet — you don't have to maintain `sheets-config.json` anymore.

#### Option C: Service account (private sheet, most secure)

1. [console.cloud.google.com](https://console.cloud.google.com) → enable **Google Sheets API**
2. **APIs & Services → Credentials → Create credentials → Service account**
3. After creating: open the service account → **Keys → Add key → JSON** → download
4. Open your Google Sheet → **Share** → paste the service account email (looks like `dialer-sync@your-project.iam.gserviceaccount.com`) → Viewer
5. In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**
6. Name: `GOOGLE_SERVICE_ACCOUNT_JSON`, value: paste the entire JSON file contents
7. With this set, the sync also **auto-discovers all tabs**.

### Sheet tab → category mapping

Tab names get normalized (lowercase, dashes for spaces) and matched to canonical category IDs:

| Tab name examples                       | Maps to        |
|------------------------------------------|----------------|
| `Pizza`, `Pizzeria`, `Pizzerias`         | `pizza`        |
| `Nails`, `Nail`, `Nail Salons`, `Manicure` | `nail-salons` |
| `Hair`, `Hair Salons`, `Salons`          | `hair`         |
| `Barber`, `Barbers`, `Barbershops`       | `barber`       |
| `Lashes`, `Brows`, `Lashes & Brows`      | `lashes`       |
| `Roofers`, `Roofing`                     | `roofers`      |
| `Plumbers`, `Plumbing`                   | `plumbers`     |
| `HVAC`, `Heating`, `Cooling`             | `hvac`         |
| `Electricians`, `Electric`, `Electrical` | `electricians` |
| `Handyman`, `Handymen`                   | `handyman`     |
| `Pets`, `Vets`, `Veterinary`, `Grooming` | `pet-services` |
| `Home`, `Cleaning`, `Landscaping`        | `home-services`|
| `Food`, `Bakery`, `Catering`             | `food-makers`  |

Tabs that don't match any of these are quietly skipped (so you can keep notes/scratch tabs in the sheet without polluting the dialer).

### Sheet column requirements

The sync auto-detects these column headers (case-insensitive). Only `Name` and `Phone` are required — everything else is optional.

| Field    | Accepted column headers |
|----------|--------------------------|
| Name     | `Name`, `Business`, `Business Name`, `Company`, `Shop` |
| Phone    | `Phone`, `Phone Number`, `Telephone`, `Tel` |
| Email    | `Email`, `E-mail`, `Email Address` |
| Website  | `Website`, `Web`, `URL`, `Site` |
| Address  | `Address`, `Full Address`, `Location`, `Street Address` |
| Rating   | `Rating`, `Stars`, `Google Rating` |
| Reviews  | `Reviews`, `Review Count`, `# of Reviews` |
| Year     | `Year`, `Year from Business`, `Established`, `Since` |
| City     | `City`, `Town` |
| State    | `State` |
| ZIP      | `Zip`, `Zipcode`, `Postal`, `Postal Code` |
| Facebook | `Facebook`, `Facebook (Web)`, `FB` |
| Instagram| `Instagram`, `Instagram (Web)`, `IG` |
| Twitter  | `Twitter`, `Twitter (Web)`, `X` |

Rows with `CLOSED` in the name and rows without a 10-digit phone are filtered out automatically. Duplicates (same name + phone) are deduped.

### Running the sync manually

```bash
# Public sheet mode (no auth)
python3 scripts/sync-from-sheets.py

# API key mode (auto-discovers all tabs)
GOOGLE_SHEETS_API_KEY=AIza... python3 scripts/sync-from-sheets.py --auto

# Service account mode
GOOGLE_SERVICE_ACCOUNT_JSON="$(cat sa.json)" python3 scripts/sync-from-sheets.py --auto

# Preview without writing files
python3 scripts/sync-from-sheets.py --dry-run
```

### Triggering the GitHub Action manually

GitHub repo → **Actions** tab → **Sync leads from Google Sheets** → **Run workflow**

It runs daily at 7 AM EST automatically.

---

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo (e.g., `NEPA-PRO/dialer`)
2. Repo → **Settings → Pages → Source: GitHub Actions**
3. The included `.github/workflows/deploy.yml` will deploy on every push to main
4. The `CNAME` file maps to `dialer.nepa-pro.com` — add a CNAME DNS record:
   - `dialer` → `<your-github-username>.github.io`
5. Wait 1–10 min for the cert to provision

---

## Local testing

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

Service worker registers and works offline after the first load.

---

## File structure

```
.
├── index.html                  # Shell + CSS + markup
├── app.js                      # All app logic
├── leads-manifest.json         # Lists which leads-*.js to load (auto-generated)
├── leads-pizza.js              # 246 NEPA pizza leads
├── leads-nail-salons.js        # (created on next sync)
├── ...                         # one per active category
├── manifest.json               # PWA manifest
├── sw.js                       # Service worker
├── sheets-config.json          # Sheet ID + tab→category mapping
├── scripts/
│   └── sync-from-sheets.py     # Pulls Sheets, generates leads-*.js + manifest
├── .github/workflows/
│   ├── deploy.yml              # Pushes to GitHub Pages on main commits
│   └── sync-sheets.yml         # Daily 7 AM EST sync from Google Sheets
├── CNAME                       # → dialer.nepa-pro.com
├── .nojekyll
└── icons/                      # All PWA icons + 1200×630 OG share card
```

---

## Privacy & Data

- **No backend.** Nothing leaves the browser. All app state lives in `localStorage` under `nepaDialerData_v1`.
- **No analytics, no tracking, no ads.**
- The QR Code modal calls `api.qrserver.com` (only when you tap QR). Swap in a local QR lib to be 100% offline.

---

## License

Proprietary — NEPA-PRO LLC. Built for internal NEPA-PRO operations.

**Questions?** service@nepa-pro.com · (570) 677-7971
