/* NEPA-PRO Dialer — Sales Resources Hub
 *
 * All sales scripts, compliance docs, and templates the call center needs on file.
 * Each doc is self-contained, branded, and cross-checked against the others to
 * eliminate overlap. Keep the source of truth here; the dialer renders straight
 * from window.DOCS and any updates flow through automatically.
 */
window.DOCS = (function(){

// Reusable HTML fragments
const NEPA_LOGO_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#3FE56A"/><stop offset="100%" stop-color="#28A848"/>
  </linearGradient></defs>
  <g transform="translate(100 100) rotate(-30) translate(-50 -50)">
    <path d="M88.6 73.3L74.4 65.5c-2.5-1.4-5.7-0.7-7.4 1.6l-4.4 5.7c-13-6.5-23.5-17-30-30l5.7-4.4c2.3-1.7 3-4.9 1.6-7.4L31.7 16.4c-1.4-2.5-4.4-3.4-7-2.1L9.5 22.5c-2.4 1.2-3.7 3.9-3.1 6.5C12.5 60.4 39.6 87.5 71 93.6c2.6 0.5 5.3-0.7 6.5-3.1l8.2-15.2c1.3-2.6 0.4-5.6-2.1-7z" fill="url(#g)"/>
  </g>
</svg>`;

function header(title, subtitle){
  return `<div class="doc-header">
    <div class="doc-brand">
      <div class="doc-logo">${NEPA_LOGO_SVG}</div>
      <div>
        <div class="doc-org">NEPA-PRO LLC</div>
        <div class="doc-tag">★ Veteran Owned & Operated · NEPA Region</div>
      </div>
    </div>
    <h1 class="doc-title">${title}</h1>
    <div class="doc-meta">${subtitle}</div>
  </div>`;
}
function footer(){
  return `<div class="doc-footer">
    <strong>NEPA-PRO LLC</strong> · (570) 677-7971 · service@nepa-pro.com · nepa-pro.com<br>
    Confidential internal document · For sales team use only
  </div>`;
}

// Reusable section: TCPA-required identification line, used by all sales scripts
const ID_LINE = `<div class="doc-callout doc-warn">
  <strong>Required identification (TCPA):</strong> the first thing out of your mouth on every call must be your name, that you are calling from NEPA-PRO LLC, and the purpose of the call. Failure to identify violates federal law.
</div>`;

// ===========================================================================
// COMPLIANCE: TCPA + Internal DNC Policy (combined into one master doc)
// ===========================================================================

const TCPA = header('TCPA Compliance & Internal Do Not Call Policy', 'v1.0 · Effective May 2026 · Owner: Operations') + `
<div class="doc-toc">
  <div class="doc-toc-title">Sections</div>
  <a href="#tcpa-1">1. What is TCPA</a>
  <a href="#tcpa-2">2. Calling hours</a>
  <a href="#tcpa-3">3. Required identification</a>
  <a href="#tcpa-4">4. Internal Do Not Call list</a>
  <a href="#tcpa-5">5. National DNC Registry</a>
  <a href="#tcpa-6">6. Honoring opt-outs</a>
  <a href="#tcpa-7">7. Litigator screening</a>
  <a href="#tcpa-8">8. Recording disclosure</a>
  <a href="#tcpa-9">9. Penalties &amp; enforcement</a>
</div>

<div class="doc-section" id="tcpa-1">
  <h2 class="doc-h2">1. What is TCPA</h2>
  <p class="doc-p">The Telephone Consumer Protection Act (TCPA, 47 U.S.C. § 227) is the federal law governing telemarketing and unsolicited commercial calls in the United States. It is enforced by the FCC and FTC, and includes a private right of action — meaning <strong>individuals can sue you directly</strong>.</p>
  <div class="doc-callout doc-info"><strong>Why this matters to NEPA-PRO:</strong> we make outbound B2B calls from a list. Even though we are calling businesses (not consumers), the moment a wireless number is involved or a phone is registered as residential, TCPA applies. Treat every number as if it were protected.</div>
</div>

<div class="doc-section" id="tcpa-2">
  <h2 class="doc-h2">2. Calling hours</h2>
  <p class="doc-p">Federal rules prohibit telemarketing calls before 8:00 AM or after 9:00 PM in the <em>recipient's</em> local time zone — not yours. Pennsylvania state law mirrors the federal rule.</p>
  <div class="doc-callout doc-success"><strong>Operational rule:</strong> NEPA-PRO calls only between <strong>9:00 AM and 7:00 PM local time</strong>, Monday–Saturday. We do not call on Sundays or federal holidays. This is stricter than the law requires; we set it that way for tone, not just compliance.</div>
</div>

<div class="doc-section" id="tcpa-3">
  <h2 class="doc-h2">3. Required identification</h2>
  <p class="doc-p">Federal law (16 CFR § 310.4(d)) requires telemarketers to disclose, promptly and clearly, four things at the start of every outbound sales call:</p>
  <ol class="doc-ol">
    <li>The caller's identity (your name)</li>
    <li>That the purpose of the call is to sell goods or services</li>
    <li>The nature of those goods or services</li>
    <li>The seller's identity (NEPA-PRO LLC)</li>
  </ol>
  <div class="doc-script">
    <div class="doc-script-line">
      <span class="doc-script-actor">YOU</span>
      <span class="doc-script-text">"Hi, this is <strong>[your first name]</strong> calling from <strong>NEPA-PRO</strong>, a Northeast PA construction and tech company. I'm reaching out today because we build websites and mobile apps for [their industry] businesses — do you have 30 seconds?"</span>
    </div>
  </div>
  <p class="doc-p muted">That single sentence covers all four requirements. Use it verbatim. Variations are fine; omissions are not.</p>
</div>

<div class="doc-section" id="tcpa-4">
  <h2 class="doc-h2">4. Internal Do Not Call list</h2>
  <p class="doc-p">Federal law requires every business making telemarketing calls to maintain its own internal DNC list and to honor opt-out requests for at least <strong>5 years</strong>. NEPA-PRO maintains this list inside the dialer (Leads → Pipeline → Do Not Call card, or My Card → Do Not Call List).</p>
  <p class="doc-p"><strong>When to add a number:</strong></p>
  <ul class="doc-checklist">
    <li>Anyone who says "do not call me again," "remove me from your list," "stop calling," or any equivalent</li>
    <li>Anyone who says they have a no-soliciting policy</li>
    <li>Wrong numbers (so we don't redial)</li>
    <li>Numbers that ring through to a known TCPA litigator (see Section 7)</li>
    <li>Confirmed business closures</li>
  </ul>
  <div class="doc-callout doc-danger"><strong>Hard rule:</strong> if a request to be removed comes in via any channel — phone, email, text, voicemail — that number is added to DNC the same day. Not "next sync." Same day.</div>
</div>

<div class="doc-section" id="tcpa-5">
  <h2 class="doc-h2">5. National DNC Registry</h2>
  <p class="doc-p">The FTC's National Do Not Call Registry (<a href="https://www.donotcall.gov" target="_blank" style="color:var(--link)">donotcall.gov</a>) is a separate list of numbers that consumers have asked never to receive telemarketing calls on. As a B2B-focused operation calling business landlines, our exposure is lower — but anyone using a wireless line as their business line is still on the registry.</p>
  <p class="doc-p">Once business operations grow, NEPA-PRO will subscribe to the registry directly and scrub our lead lists against it before each outbound campaign. Until then, we err on the side of internal-list hygiene and treat every "remove me" request as binding for 5+ years.</p>
</div>

<div class="doc-section" id="tcpa-6">
  <h2 class="doc-h2">6. Honoring opt-outs</h2>
  <p class="doc-p">When someone asks to be removed:</p>
  <ol class="doc-ol">
    <li><strong>Acknowledge it on the call.</strong> "Of course — I've removed you from our list. You won't hear from us again. Have a good day."</li>
    <li><strong>Mark Do Not Call</strong> in the dialer immediately, while still on the call. Pick the appropriate reason in the action sheet.</li>
    <li><strong>Do not argue, do not pitch, do not offer discounts.</strong> Comply, end the call politely, move on.</li>
    <li>If they call us back later wanting service, they have to opt back in. Do not assume.</li>
  </ol>
  <div class="doc-callout doc-success">The dialer's DNC system is designed to make compliance the path of least resistance. The "Mark Do Not Call" button is one tap away from any lead or contact, and dialing a flagged number triggers a hard-stop warning before it connects.</div>
</div>

<div class="doc-section" id="tcpa-7">
  <h2 class="doc-h2">7. Litigator screening</h2>
  <p class="doc-p">A small population of individuals make a hobby — and sometimes a livelihood — of provoking TCPA violations to extract settlements. Common patterns:</p>
  <ul class="doc-ul">
    <li>They press hard on technical details: "Are you recording this call? What's your DNC policy? Where can I see your written procedure?"</li>
    <li>They steer toward an unambiguous violation: asking you to call them again to confirm something, then claiming they didn't consent.</li>
    <li>They file complaints in clusters under a small handful of names and PO boxes.</li>
  </ul>
  <p class="doc-p"><strong>If a call feels like a setup:</strong> politely thank them for their time, mark Do Not Call with reason "Litigator / TCPA risk," and end the call. Do not engage further. Do not call back.</p>
</div>

<div class="doc-section" id="tcpa-8">
  <h2 class="doc-h2">8. Recording disclosure</h2>
  <p class="doc-p">Pennsylvania is a <strong>two-party consent state</strong>. If we ever record a call for training or QA, both parties must agree before the recording starts. Until NEPA-PRO formally rolls out call recording with a disclosure script, do not record any sales calls — phone, voicemail, or otherwise.</p>
</div>

<div class="doc-section" id="tcpa-9">
  <h2 class="doc-h2">9. Penalties &amp; enforcement</h2>
  <div class="doc-stats">
    <div class="doc-pull"><div class="doc-pull-num">$500</div><div class="doc-pull-lbl">per call · negligent violation</div></div>
    <div class="doc-pull"><div class="doc-pull-num">$1,500</div><div class="doc-pull-lbl">per call · willful violation</div></div>
  </div>
  <p class="doc-p">These are statutory damages — they apply per call, not per claimant. A litigator who receives 8 calls from a non-compliant operation can collect $4,000–$12,000 in a single complaint. Keep the dialer's DNC list clean and current; it is our single best defense.</p>
</div>

<div class="doc-section">
  <h2 class="doc-h2">Quick reference</h2>
  <table class="doc-table">
    <tr><th>Situation</th><th>Action</th></tr>
    <tr><td>Calling hours</td><td>9 AM – 7 PM local time, Mon–Sat only</td></tr>
    <tr><td>Opens with "what is this about?"</td><td>Run the 4-part disclosure (Section 3)</td></tr>
    <tr><td>"Take me off your list"</td><td>Mark DNC same call, no pitch, polite exit</td></tr>
    <tr><td>Wrong number</td><td>Mark DNC with reason "Wrong number"</td></tr>
    <tr><td>Voicemail</td><td>Use Voicemail Script doc; never claim to be calling back</td></tr>
    <tr><td>Caller asks if recorded</td><td>"No, this is not being recorded."</td></tr>
    <tr><td>Caller asks for written policy</td><td>"I can email it — what's the best address?" Send the public-facing one-pager.</td></tr>
  </table>
</div>
` + footer();

// ===========================================================================
// VOICEMAIL SCRIPT
// ===========================================================================

const VOICEMAIL = header('Voicemail Script', 'v1.0 · Use after the dialer marks an LVM call') + `
<div class="doc-section">
  <h2 class="doc-h2">When to leave one</h2>
  <p class="doc-p">Leave a voicemail on the <strong>first attempt</strong> if it goes to voicemail — never on consecutive attempts. Two LVMs back-to-back read as harassment; one LVM and a follow-up email reads as professional persistence.</p>
  <p class="doc-p">After leaving the voicemail, mark the lead <strong>LVM</strong> in the dialer. The system timestamps it so you know when to follow up.</p>
</div>

<div class="doc-section">
  <h2 class="doc-h2">The script — under 25 seconds</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hi, this message is for the owner of <strong>[business name]</strong>. My name is <strong>[your first name]</strong>, I'm calling from <strong>NEPA-PRO</strong> — we're a veteran-owned construction and tech company in Northeast PA, and we just spun up a new platform that builds websites and mobile apps specifically for <strong>[industry]</strong> businesses like yours."</span></div>
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"I'd love to show you what it looks like — takes about three minutes. Give me a call back at <strong>(570) 677-7971</strong> when it works for you, or shoot me an email at <strong>service@nepa-pro.com</strong>. Either way, thanks for your time. Have a good one."</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">Do, don't, and why</h2>
  <table class="doc-table">
    <tr><th>Do</th><th>Why</th></tr>
    <tr><td>State your name and our name</td><td>TCPA identification requirement applies to voicemail too</td></tr>
    <tr><td>Mention the industry by name</td><td>Anchors that this isn't a generic spam blast</td></tr>
    <tr><td>Give the call-back number twice if voicemail allows</td><td>People miss the first one</td></tr>
    <tr><td>End on something warm</td><td>You may never speak to them, but they'll hear your tone</td></tr>
  </table>
  <table class="doc-table" style="margin-top:14px">
    <tr><th>Don't</th><th>Why</th></tr>
    <tr><td>Say "I'm following up on…"</td><td>You're not — first call shouldn't pretend otherwise</td></tr>
    <tr><td>Drop pricing or specifics</td><td>That's the discovery call's job</td></tr>
    <tr><td>Promise to call back</td><td>Makes them ignore your second attempt</td></tr>
    <tr><td>Leave more than 25 seconds</td><td>They'll skip; you've trained them to ignore future calls</td></tr>
  </table>
</div>

<div class="doc-section">
  <h2 class="doc-h2">Follow-up rhythm</h2>
  <ul class="doc-checklist">
    <li>Day 0 — first call, voicemail (mark <strong>LVM</strong>)</li>
    <li>Day 0, +30 min — short follow-up email (use the Email Follow-up template)</li>
    <li>Day 3 — second call attempt at a different time of day</li>
    <li>Day 7 — short text (use the Text Follow-up template)</li>
    <li>Day 14 — final call attempt; if no response, mark <strong>Lost</strong> with reason "no answer ×4"</li>
  </ul>
</div>
` + footer();

// ===========================================================================
// EMAIL FOLLOW-UP TEMPLATE
// ===========================================================================

const EMAIL = header('Email Follow-up Template', 'v1.0 · Send within 30 minutes of an LVM') + `
<div class="doc-section">
  <h2 class="doc-h2">Subject line</h2>
  <p class="doc-p">Use the business name. Plain language wins; "Re:" prefixes get filtered.</p>
  <ul class="doc-ul">
    <li><strong>[Business name] — quick voicemail follow-up</strong></li>
    <li><strong>For [Owner first name] at [Business name]</strong></li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">Body</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor note">SUBJ</span><span class="doc-script-text">[Business name] — quick voicemail follow-up</span></div>
    <div class="doc-script-line"><span class="doc-script-actor">BODY</span><span class="doc-script-text">Hi [Owner first name if known, else "there"],<br><br>
I just left you a quick voicemail. I run sales for <strong>NEPA-PRO</strong>, a veteran-owned construction and tech company based in Clarks Summit, PA. We've started a new platform — <strong>app.nepa-pro.com</strong> — that builds websites and installable mobile apps (PWAs) tailored to <strong>[industry]</strong> businesses across NEPA.<br><br>
A few things we typically help [industry] owners with:<br>
• [bullet 1 — pull from category script]<br>
• [bullet 2]<br>
• [bullet 3]<br><br>
If any of that sounds useful, I'd love a 10-minute call to walk you through what we'd build. My calendar is wide open this week — just reply with a time that works, or call me back at <strong>(570) 677-7971</strong>.<br><br>
Either way, thanks for your time.<br><br>
[Your full name]<br>
NEPA-PRO LLC · (570) 677-7971<br>
service@nepa-pro.com · nepa-pro.com</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">Rules</h2>
  <ul class="doc-checklist">
    <li>One email after the LVM. Not two.</li>
    <li>No attachments — they trigger spam filters and clipboards.</li>
    <li>Plain text > fancy HTML. We sell the platform; the email isn't a demo.</li>
    <li>If they reply asking for info, send the public one-pager and book the discovery call. Don't sell over email.</li>
    <li>If they reply "remove me" or any equivalent — mark DNC same day, send a one-line acknowledgment ("Confirmed, removed. Have a good one."), do not follow up.</li>
  </ul>
</div>
` + footer();

// ===========================================================================
// TEXT FOLLOW-UP TEMPLATE
// ===========================================================================

const TEXT = header('Text Follow-up Template', 'v1.0 · Day 7 of the follow-up rhythm') + `
<div class="doc-callout doc-warn">
  <strong>Pre-flight check:</strong> only text business numbers that have been published publicly (Google Business Profile, the business's own website, etc.). If the only number you have was scraped from a residential context, do not text it — call instead.
</div>

<div class="doc-section">
  <h2 class="doc-h2">Texts to use</h2>
  <p class="doc-p">All under 320 characters (one SMS segment). Identify yourself in the first six words. Sign off with "—Name, NEPA-PRO" so they know it's not a stranger.</p>

  <h3 class="doc-h3">Variant A — first text after no response</h3>
  <div class="doc-script"><div class="doc-script-line"><span class="doc-script-actor">SMS</span><span class="doc-script-text">Hey [Name] — [Your name] from NEPA-PRO. Left you a voicemail and email last week about building a website + app for [Business name]. No pressure, just figured I'd try once more in case those got buried. Want me to send a 2-minute walkthrough? — [Your name]</span></div></div>

  <h3 class="doc-h3">Variant B — they engaged but went quiet</h3>
  <div class="doc-script"><div class="doc-script-line"><span class="doc-script-actor">SMS</span><span class="doc-script-text">[Name] — [Your name] @ NEPA-PRO again. We talked briefly about a new site for [Business name]. Still want me to put together a quick mockup, or is timing not right this quarter? Either answer is fine, just don't want to bug you. — [Your name]</span></div></div>

  <h3 class="doc-h3">Variant C — final touch before marking Lost</h3>
  <div class="doc-script"><div class="doc-script-line"><span class="doc-script-actor">SMS</span><span class="doc-script-text">Last note from NEPA-PRO — closing the loop on [Business name]. If now's not the right time, no problem; I'll stop reaching out. If anything changes down the road: (570) 677-7971. Wishing you a great rest of the year. — [Your name]</span></div></div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">Compliance</h2>
  <ul class="doc-checklist">
    <li>If they reply <strong>STOP</strong>, <strong>UNSUBSCRIBE</strong>, <strong>QUIT</strong>, <strong>END</strong>, or <strong>CANCEL</strong> (case-insensitive) — mark DNC immediately, do not text again, do not call again.</li>
    <li>Replies to a sales text are not consent for ongoing texting. One reply, one response, then back to the calendar.</li>
    <li>Do not use shortened links from public URL shorteners — carriers filter them. Use the full app.nepa-pro.com URL.</li>
  </ul>
</div>
` + footer();

// ===========================================================================
// OBJECTION HANDLING LIBRARY
// ===========================================================================

const OBJECTIONS = header('Objection Handling Library', 'v1.0 · The 12 most common pushbacks and how to navigate them') + `
<div class="doc-section">
  <h2 class="doc-h2">The general framework</h2>
  <p class="doc-p">Every objection follows the same arc: <strong>acknowledge → reframe → ask</strong>. We never argue. We never overcome. We help them think out loud.</p>
  <div class="doc-callout doc-info"><strong>If you find yourself "fighting" an objection</strong>, you've already lost. Drop the script, listen, and either make a real recommendation that fits their situation — or mark Lost with a clean reason and move on. The dialer has thousands of leads. Your time is the scarce resource.</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">1. "We already have a website."</h2>
  <p class="doc-p"><strong>Reframe:</strong> not all websites are equal. Most small-business sites built before 2020 fail mobile speed checks and don't install as apps.</p>
  <div class="doc-quote">"That's awesome — most of the businesses I talk to do. The reason I called is half of those sites don't pass Google's mobile speed test anymore, which quietly tanks their search ranking. Mind if I take 60 seconds to look up yours and tell you where you stand? No commitment."</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">2. "We already pay [Wix / Squarespace / GoDaddy / Yelp Pages]."</h2>
  <p class="doc-p"><strong>Reframe:</strong> those are templates, not platforms. They don't install on phones, don't push notifications, don't own the customer data.</p>
  <div class="doc-quote">"Totally fair — those are great for getting up fast. The thing they don't do is turn into an app on your customer's phone. That's the piece we add: when somebody loads your site once, it offers to install. After that you can ping them with a push notification when there's a special, no app store needed. Want to see it?"</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">3. "I'm not interested."</h2>
  <p class="doc-p"><strong>Reframe:</strong> they don't know what they're saying no to yet. Buy 30 more seconds.</p>
  <div class="doc-quote">"Completely respect that. Quick question before I let you go — is it that you don't need a website at all, or that you've been pitched this kind of thing too many times and they all sound the same? Because if it's the second one, I think we're actually different."</div>
  <p class="doc-p muted">If they still say no after this, mark <strong>Lost</strong> with reason "not interested." Do not push.</p>
</div>

<div class="doc-section">
  <h2 class="doc-h2">4. "Send me an email."</h2>
  <p class="doc-p"><strong>Reframe:</strong> "send me an email" usually means "go away." Convert it into a real callback or take the no.</p>
  <div class="doc-quote">"Happy to. So I send something useful and not generic — what's the one thing about your current website (or lack of one) that bugs you the most? I'll tailor it to that and reply within the hour."</div>
  <p class="doc-p muted">If they answer the question → send a tailored email (use the Email Follow-up template, customize the bullets). If they dodge → "Got it, I'll keep it short. What's the best email?"</p>
</div>

<div class="doc-section">
  <h2 class="doc-h2">5. "How much does it cost?"</h2>
  <p class="doc-p"><strong>Reframe:</strong> price without scope is meaningless. Don't anchor before you know what they need.</p>
  <div class="doc-quote">"Honest answer: I don't know yet, because what we'd build for a [their industry] runs different from a typical website. We have a one-time build fee plus a small monthly that covers hosting, updates, and the app. The build fee depends on how custom we go. Is it OK if I ask three questions about what you'd want, and then I'll give you a number?"</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">6. "I don't have time right now."</h2>
  <p class="doc-p"><strong>Reframe:</strong> that's the truth — they're running a business. Respect it and bank a callback.</p>
  <div class="doc-quote">"Totally get it, you sound slammed. Real quick — is mornings or afternoons usually better for a 10-minute call later this week? I'll text you a reminder so you don't have to remember."</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">7. "I'm too small for this."</h2>
  <p class="doc-p"><strong>Reframe:</strong> small businesses are who this is built for. The big ones already have an in-house team.</p>
  <div class="doc-quote">"That's actually exactly why I called you. Big chains have full-time IT departments. Independent [their type] like yours don't, and that's where most of the money in our market goes — to platforms that get rich on top of you. We built this so the owner of a single shop has the same tools the chain across town has. Mind if I show you?"</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">8. "I tried this with someone else and it didn't work."</h2>
  <p class="doc-p"><strong>Reframe:</strong> learn from their bad experience and differentiate. Lots of agencies build sites and disappear.</p>
  <div class="doc-quote">"Sorry to hear that — happens way more than it should. Quick question: did they ghost you after launch, did the site get slow, or did the leads just not come in? I want to make sure we don't repeat whatever went wrong before I even pitch you anything."</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">9. "Email it to my partner / spouse / accountant."</h2>
  <p class="doc-p"><strong>Reframe:</strong> they're handing you off. The decision-maker isn't here.</p>
  <div class="doc-quote">"Of course — what's their email? And quick: are they the right person to make the call on something like this, or do they usually just relay it back to you?"</div>
  <p class="doc-p muted">If the prospect is the actual buyer, this surfaces it. If not, you've identified the real decision-maker and can ask for an intro call.</p>
</div>

<div class="doc-section">
  <h2 class="doc-h2">10. "How did you get my number?"</h2>
  <p class="doc-p"><strong>Reframe:</strong> tell the truth, briefly. The truth is usually more comforting than they fear.</p>
  <div class="doc-quote">"Public listing — it's on your Google Business Profile and the directory at [yellowpages.com / whatever]. If you'd rather we don't reach out again, no problem at all, I'll take you off our list right now."</div>
  <p class="doc-p muted">If they ask to be removed, do it. <strong>Mark DNC</strong> with reason "Asked to be removed" same call.</p>
</div>

<div class="doc-section">
  <h2 class="doc-h2">11. "What's NEPA-PRO?"</h2>
  <p class="doc-p"><strong>Reframe:</strong> credibility in two sentences. Don't recite the website.</p>
  <div class="doc-quote">"We're a veteran-owned construction and property maintenance company in Clarks Summit, PA. We started building software internally for our own crews — scheduling, customer-facing portals — and the tools turned out to be useful for other small businesses, so we spun up a sales arm. Everything we sell, we run ourselves first."</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">12. "Take me off your list / Don't call me again."</h2>
  <p class="doc-p"><strong>Action:</strong> stop. The script ends here.</p>
  <div class="doc-quote">"Of course. I've taken you off our list right now — you won't hear from us again. Have a great day."</div>
  <div class="doc-callout doc-danger"><strong>Mandatory:</strong> mark <strong>Do Not Call</strong> in the dialer before ending the call. Do not pitch. Do not offer a discount. Do not "let me just send you one thing." Comply, exit, move on. This is non-negotiable and TCPA-binding (see Compliance doc).</div>
</div>
` + footer();

// ===========================================================================
// SALES SCRIPTS — one per active lead category
//
// Each script follows the same arc:
//   1. Pre-call (research checklist)
//   2. Opening (TCPA-compliant identification + 5-second hook)
//   3. Discovery (3 questions)
//   4. Value prop (industry-specific)
//   5. Pricing/CTA
//   6. Top objections (cross-references the Objection Library)
//
// Anything generic (DNC, voicemail, follow-up rhythm) is referenced — not duplicated.
// ===========================================================================

// ----- Pizza ---------------------------------------------------------------

const SCRIPT_PIZZA = header('Sales Script — Pizza Shops', 'v1.0 · For NEPA-region pizzerias') + `
<div class="doc-section">
  <h2 class="doc-h2">Why this market</h2>
  <div class="doc-stats">
    <div class="doc-pull"><div class="doc-pull-num">15–30%</div><div class="doc-pull-lbl">third-party fee per order on DoorDash / Uber Eats / Grubhub</div></div>
    <div class="doc-pull"><div class="doc-pull-num">~20%</div><div class="doc-pull-lbl">average uplift in ticket size when ordering on the restaurant's own site</div></div>
  </div>
  <p class="doc-p">Independent pizzerias are squeezed at both ends: third-party delivery apps take a heavy cut on every order they bring, and most owners don't have the technical setup to take orders on their own site. That spread — what they're paying to platforms vs. what they could keep — is the wedge for our pitch.</p>
  <div class="doc-callout doc-info"><strong>Industry signal:</strong> the National Restaurant Association and successive industry surveys consistently show that customers prefer to order directly from a restaurant when given an easy option. The friction is the website, not the desire.</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">1. Pre-call research (60 seconds)</h2>
  <ul class="doc-checklist">
    <li>Open the lead detail in the dialer — note the name and city</li>
    <li>Google "<em>[business name]</em> pizza" — do they appear with a website? Order online button?</li>
    <li>Click their Google Business Profile — do photos look fresh? Is online ordering enabled?</li>
    <li>Open their existing site (if any) on a phone-sized window — is it slow? Do you bounce?</li>
  </ul>
  <p class="doc-p muted">You're looking for the <strong>specific gap</strong>: no site, ugly site, or no online ordering. That's your opening hook.</p>
</div>

<div class="doc-section">
  <h2 class="doc-h2">2. Opening</h2>
  ${ID_LINE}
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hi, this is <strong>[your first name]</strong> calling from <strong>NEPA-PRO</strong> — we're a veteran-owned shop in Clarks Summit. I'm reaching out today because we just spun up a platform that helps NEPA pizzerias take orders on their own site instead of giving up 30% to DoorDash. Real quick — do you currently take online orders on your own website, or is most of it through the apps?"</span></div>
    <div class="doc-script-line"><span class="doc-script-actor note">PURPOSE</span><span class="doc-script-text">The closing question is doing two things: confirming compliance (we declared it's a sales call) and qualifying their real situation in 4 seconds.</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">3. Discovery — three questions</h2>
  <ol class="doc-ol">
    <li><strong>"What percent of your orders come through DoorDash, Uber Eats, or Grubhub?"</strong> <em>If high → pain point #1 confirmed. If low → they're missing the modern channel entirely; different pitch.</em></li>
    <li><strong>"When was your website last updated?"</strong> <em>"Years ago" or "I don't know" → big opportunity. "We have one through Wix" → reframe to what they don't get from Wix.</em></li>
    <li><strong>"If you could push out a notification to your last 200 customers tonight saying 'large pies are $12 until 9 PM,' would that be useful to you?"</strong> <em>This is the imagination question. If they say yes — and they will — the rest of the call writes itself.</em></li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">4. Value pitch — pizza-specific</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Here's what we'd build for [shop name] — a website that doubles as an installable app on your customer's phone. They tap 'Order' once and it lives on their home screen forever, no app store needed."</span></div>
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Three things it does that your current setup doesn't:"</span></div>
  </div>
  <ol class="doc-ol">
    <li><strong>Online ordering on your own domain</strong> — keeps the full margin instead of giving 15–30% to DoorDash. Stripe-powered checkout, prints to your kitchen the same way third-party orders do.</li>
    <li><strong>SMS &amp; push notifications</strong> — when business is slow on a Tuesday at 4, blast your customer list with a flash deal. Most customers respond within an hour.</li>
    <li><strong>Loyalty / rewards built in</strong> — every 10th pizza free, birthday coupons, etc. Owned by you, not a third party.</li>
  </ol>
  <p class="doc-p muted">Optional, if relevant: catering quote forms, party-size menus, gift cards, fundraiser nights for local sports teams.</p>
</div>

<div class="doc-section">
  <h2 class="doc-h2">5. Pricing &amp; CTA</h2>
  <p class="doc-p">We don't quote on the discovery call. The goal of this call is to book the <strong>10-minute walkthrough</strong> on Zoom or in person.</p>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Best way to do this is I share my screen for 10 minutes and walk you through what we'd build for [shop name] specifically. I'll prep the screens before the call. Is Wednesday or Thursday this week better, mornings or afternoons?"</span></div>
  </div>
  <div class="doc-callout doc-success"><strong>Assumed close.</strong> Don't ask "would you like to schedule a call?" — ask which time. Half-pricing the cognitive cost of saying yes is half the battle.</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">6. Top pizza-specific objections</h2>
  <table class="doc-table">
    <tr><th>They say</th><th>You say</th></tr>
    <tr><td>"DoorDash brings me business I wouldn't get otherwise."</td><td>"Totally true — keep DoorDash. We're not replacing it, we're adding a channel where you keep 100%. Repeat customers move to your site once they know it exists. New customers still come from the apps."</td></tr>
    <tr><td>"My customers don't order online, they call."</td><td>"Some do, sure. The question is whether you want to be the place that <em>only</em> takes phone orders in 2026. Even your loyal regulars miss your specials when they're not driving by."</td></tr>
    <tr><td>"I don't want to deal with another POS / printer / setup."</td><td>"Hear that a lot. Our system prints to your existing kitchen the same way DoorDash does. Setup is on us, you don't touch a thing — we run a parallel test for two weeks before you flip the switch."</td></tr>
    <tr><td>"I had a site, nobody used it."</td><td>"That's almost always because nobody was driving traffic to it. We tie the site to your Google Business Profile, your social, and the door receipts so customers actually find it. Want to see what that looks like?"</td></tr>
  </table>
</div>

${section_after_call_generic()}
` + footer();

// ----- Nail Salons ---------------------------------------------------------

const SCRIPT_NAILS = header('Sales Script — Nail Salons', 'v1.0 · For PA-region nail salons') + `
<div class="doc-section">
  <h2 class="doc-h2">Why this market</h2>
  <div class="doc-stats">
    <div class="doc-pull"><div class="doc-pull-num">~75%</div><div class="doc-pull-lbl">of consumers research a salon online before booking, per industry surveys</div></div>
    <div class="doc-pull"><div class="doc-pull-num">~30%</div><div class="doc-pull-lbl">typical reduction in no-shows when 24-hour reminder texts are enabled</div></div>
  </div>
  <p class="doc-p">Nail salon margins live and die on chair utilization and no-shows. Most independent shops in PA still book by phone — which means missed bookings during business hours, no off-hours capture, and zero automated reminders. The pitch is straightforward: 24/7 booking + automated reminders + a portfolio that closes new clients on first visit.</p>
</div>

<div class="doc-section">
  <h2 class="doc-h2">1. Pre-call research</h2>
  <ul class="doc-checklist">
    <li>Find them on Instagram — most salons live there. Are photos current? Lots of followers?</li>
    <li>Check Google Business Profile — is "Book online" enabled? Hours up to date?</li>
    <li>Try to book an appointment from your phone — does it work? How many taps?</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">2. Opening</h2>
  ${ID_LINE}
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hi, this is <strong>[your first name]</strong> from <strong>NEPA-PRO</strong> — we're a veteran-owned shop in Clarks Summit. I'm calling because we built a booking and customer platform specifically for nail salons in PA, and I noticed [salon name] doesn't have 24-hour online booking yet. Got 30 seconds for me to explain why that matters?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">3. Discovery</h2>
  <ol class="doc-ol">
    <li><strong>"How are most appointments booked today — phone, walk-in, Instagram DM, or online?"</strong></li>
    <li><strong>"What's the no-show rate look like in a typical week?"</strong> <em>If they say "couple a week" → that's $200–$600/week in lost revenue. Math it later in the pitch.</em></li>
    <li><strong>"When somebody books at 10 PM on a Sunday because they want their nails done before Monday morning — does that booking happen, or do they book at the salon down the street?"</strong></li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">4. Value pitch — nail-specific</h2>
  <ol class="doc-ol">
    <li><strong>24/7 online booking</strong> — calendar synced to your existing schedule, so customers can book any time. Half the bookings come outside business hours.</li>
    <li><strong>Automated SMS reminders</strong> — 24-hour and 2-hour reminders cut no-shows roughly in half across the industry. Real money back per chair.</li>
    <li><strong>Photo portfolio that converts</strong> — every set you finish, the customer can view your work right from the booking app. Loyalty, retention, and new-client closing all rise.</li>
    <li><strong>Customer text marketing</strong> — slow Tuesday at 1 PM? Send a flash discount to your last 100 clients. Two or three of them will rebook by the end of the day.</li>
    <li><strong>Loyalty program</strong> — 10th set free, birthday discounts, friend-referral credit. Owned by you, not Mindbody or Booksy.</li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">5. Pricing &amp; CTA</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Here's what I'd love to do — give me 10 minutes on Zoom and I'll show you mockups built for [salon name] specifically. If it's not a fit, no harm done. Tuesday or Thursday this week, mornings or afternoons?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">6. Nail-specific objections</h2>
  <table class="doc-table">
    <tr><th>They say</th><th>You say</th></tr>
    <tr><td>"My customers just text me on Instagram."</td><td>"That works — but it means you're checking DMs while you're trying to do nails. We pull all of that into one calendar so you don't have to context-switch all day."</td></tr>
    <tr><td>"I use Booksy / Mindbody / Vagaro."</td><td>"Cool, those are good. The piece they don't do — or charge a lot extra for — is the website that doubles as a customer-facing app. Most owners on those platforms still don't have a real site."</td></tr>
    <tr><td>"I don't want to deal with another login."</td><td>"Hear that. Setup is on us; you log in twice — once to see your calendar, once to see your customer list. After that it's invisible."</td></tr>
    <tr><td>"My techs handle their own books."</td><td>"Got it — we can set up booking per tech with their own page, photos, and calendar. They keep their flow, you get the salon-level reporting."</td></tr>
  </table>
</div>

${section_after_call_generic('Qualified', 'LVM', 'Lost', 'Do Not Call')}
` + footer();

// Helper used by all sales scripts so we don't repeat the same after-call checklist
function section_after_call_generic(){
  return `<div class="doc-section">
    <h2 class="doc-h2">7. After the call</h2>
    <ul class="doc-checklist">
      <li>If booked → calendar invite within 5 minutes, mark <strong>Qualified</strong></li>
      <li>If LVM → use the Voicemail Script doc, mark <strong>LVM</strong>, send Email Follow-up</li>
      <li>If "not interested" → polite exit, mark <strong>Lost</strong></li>
      <li>If "remove me" → mark <strong>Do Not Call</strong> immediately, no follow-up</li>
    </ul>
    <p class="doc-p muted">For pricing, "send me an email," and other generic pushback, see the <strong>Objection Handling Library</strong>.</p>
  </div>`;
}

// ----- Hair Salons ---------------------------------------------------------

const SCRIPT_HAIR = header('Sales Script — Hair Salons', 'v1.0 · For PA-region hair salons') + `
<div class="doc-section">
  <h2 class="doc-h2">Why this market</h2>
  <p class="doc-p">Hair salons share the same booking and reminder mechanics as nail salons, but the brand and portfolio piece carries even more weight — clients shop on visuals first, location second, price third. The pitch leans heavier on photo portfolio and stylist-level branding.</p>
  <div class="doc-stats">
    <div class="doc-pull"><div class="doc-pull-num">2–3×</div><div class="doc-pull-lbl">higher new-client conversion when stylists have individual portfolio pages</div></div>
    <div class="doc-pull"><div class="doc-pull-num">~$80</div><div class="doc-pull-lbl">average ticket — every recovered no-show is real money</div></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">1. Pre-call research</h2>
  <ul class="doc-checklist">
    <li>Their Instagram — does each stylist have their own work shown, or is it all one feed?</li>
    <li>Google Business Profile — photos current? Booking link?</li>
    <li>Look for stylist-personal-brand signals: are any of them building independent followings?</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">2. Opening</h2>
  ${ID_LINE}
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hi, this is <strong>[your first name]</strong> from <strong>NEPA-PRO</strong> — we're a veteran-owned shop in Clarks Summit. I'm reaching out because we built a booking and portfolio platform for hair salons across PA, and I noticed [salon name] could use one consolidated place where customers see your stylists' work and book them. Got a minute for me to explain?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">3. Discovery</h2>
  <ol class="doc-ol">
    <li><strong>"How do new clients usually find you — Instagram, Google, walk-in, referral?"</strong></li>
    <li><strong>"Do your stylists each have their own following, or is the salon brand the main draw?"</strong></li>
    <li><strong>"When you raise prices on a service, how do customers find out — walking in, or do they get a heads-up first?"</strong></li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">4. Value pitch — hair-specific</h2>
  <ol class="doc-ol">
    <li><strong>Per-stylist booking pages</strong> — each stylist gets their own portfolio, calendar, and direct-link card. Stylists love this; salon owners benefit from the unified backend.</li>
    <li><strong>Photo-first homepage</strong> — color, cuts, transformations. Visual first, copy second.</li>
    <li><strong>24/7 booking + reminders</strong> — same no-show reduction story as nails.</li>
    <li><strong>Service menu with pricing</strong> — clear, current, never out of date in your window display.</li>
    <li><strong>Loyalty + referral credit</strong> — friend referrals are how salons grow; reward them automatically.</li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">5. Pricing &amp; CTA</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Best thing is for me to share my screen for 10 minutes — I'll have mockups ready for [salon name] specifically. Wednesday or Friday this week, mornings or afternoons?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">6. Hair-specific objections</h2>
  <table class="doc-table">
    <tr><th>They say</th><th>You say</th></tr>
    <tr><td>"My stylists are independent — they each do their own thing."</td><td>"That's actually our sweet spot. We give each one their own page and calendar but bring it all under your salon brand. They get tools they wouldn't pay for individually, you get visibility."</td></tr>
    <tr><td>"I don't trust online booking — I want to talk to clients first."</td><td>"Totally fair. We can flag any first-time booking to require your approval before it's confirmed — same effect as a phone call, fewer interruptions."</td></tr>
    <tr><td>"My Instagram is enough."</td><td>"Instagram drives discovery, but it's a rented platform. They change the algorithm and your reach gets cut overnight. Your own site is the asset you actually own — Instagram drives traffic <em>to</em> it."</td></tr>
  </table>
</div>

${section_after_call_generic()}
` + footer();

// ----- Barbershops ---------------------------------------------------------

const SCRIPT_BARBER = header('Sales Script — Barbershops', 'v1.0 · For PA-region barbershops') + `
<div class="doc-section">
  <h2 class="doc-h2">Why this market</h2>
  <p class="doc-p">Barbershops are walk-in heavy and cash-heavy, with strong brand loyalty per barber. The two pain points are <strong>queue / wait-time visibility</strong> and <strong>capturing repeat customers' contact info</strong>. The pitch leans into both.</p>
  <div class="doc-stats">
    <div class="doc-pull"><div class="doc-pull-num">~2/3</div><div class="doc-pull-lbl">of male grooming customers research online before their first visit, per industry surveys</div></div>
    <div class="doc-pull"><div class="doc-pull-num">$25–$45</div><div class="doc-pull-lbl">average cut + tip — high-frequency repeat business is the model</div></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">1. Pre-call research</h2>
  <ul class="doc-checklist">
    <li>Google Business Profile — photos? Hours? Reviews recent?</li>
    <li>Search "barbershop near [city]" — where do they rank?</li>
    <li>Walk-in friendly or appointment-only? Different pitch for each.</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">2. Opening</h2>
  ${ID_LINE}
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hi, this is <strong>[your first name]</strong> from <strong>NEPA-PRO</strong> — we're a veteran-owned shop in Clarks Summit. I'm calling because we built a platform that lets barbershops show their wait time live, take appointments, and remember regulars without you having to ask their name twice. Got 30 seconds?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">3. Discovery</h2>
  <ol class="doc-ol">
    <li><strong>"Walk-in shop, appointment-only, or both?"</strong></li>
    <li><strong>"How do regulars know if you're busy on a Saturday — they just show up and hope?"</strong></li>
    <li><strong>"Do you have a way to text your customers, or is everybody just hoping their next cut shows up?"</strong></li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">4. Value pitch — barber-specific</h2>
  <ol class="doc-ol">
    <li><strong>Live queue display</strong> — customers see "20 min wait" on the website / app before they leave the house. Cuts dead-time grumbling and walk-aways.</li>
    <li><strong>Take-a-number system</strong> — they tap "Get in line," you see them on the queue, they get a text when it's almost their turn.</li>
    <li><strong>Customer database</strong> — every customer who books or queues hands you their contact info. After 6 months you have a reachable list of regulars.</li>
    <li><strong>SMS marketing</strong> — slow Tuesday at 11? Push out a $5-off cut for the next two hours. Phones ping in pockets across town.</li>
    <li><strong>Loyalty</strong> — 10th cut free, build a referral system that rewards the regulars who bring their friends.</li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">5. Pricing &amp; CTA</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"I'd love to show you what this would look like for [shop name]. Quick 10-minute screenshare. Better for you mornings before you open, or afternoons in your slow window?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">6. Barber-specific objections</h2>
  <table class="doc-table">
    <tr><th>They say</th><th>You say</th></tr>
    <tr><td>"All my regulars know when to come in."</td><td>"Sure, the regulars do. The piece you're missing is the new guy who almost walked in but saw 6 chairs full through the window and went somewhere else. The queue display is for him."</td></tr>
    <tr><td>"I run cash — I don't want a computer in the way."</td><td>"Got it. The system runs on a tablet you mount on the counter or your phone. Nothing changes about how you take payment. Customers self-checkin; you keep cutting."</td></tr>
    <tr><td>"My barbers don't want to be tracked."</td><td>"That's not what this is. Each barber gets their own page and queue. They don't lose autonomy, they gain a way for first-time customers to specifically ask for them."</td></tr>
  </table>
</div>

${section_after_call_generic()}
` + footer();

// ----- Roofers -------------------------------------------------------------

const SCRIPT_ROOFERS = header('Sales Script — Roofers', 'v1.0 · For PA-region residential roofing contractors') + `
<div class="doc-section">
  <h2 class="doc-h2">Why this market</h2>
  <div class="doc-stats">
    <div class="doc-pull"><div class="doc-pull-num">~80%</div><div class="doc-pull-lbl">of homeowners research a roofer online before calling</div></div>
    <div class="doc-pull"><div class="doc-pull-num">$50–$100+</div><div class="doc-pull-lbl">cost per lead from Angi / HomeAdvisor / Networx — and the lead is shared with 3–4 competitors</div></div>
  </div>
  <p class="doc-p">Roofing is a high-ticket, trust-driven trade. Most independent roofers in PA pay heavily for shared leads from third parties and have weak (or no) websites of their own. The pitch is two-fold: <strong>(1)</strong> own your lead generation instead of renting it, and <strong>(2)</strong> close more of the leads you do get with a credibility-first website that includes before/after galleries, reviews, and instant estimate forms.</p>
</div>

<div class="doc-section">
  <h2 class="doc-h2">1. Pre-call research</h2>
  <ul class="doc-checklist">
    <li>Google "roofer in [their city]" — do they show up? Where? Any reviews?</li>
    <li>Their website if any — does it load? Mobile-friendly? Have photos of actual jobs?</li>
    <li>Are they on HomeAdvisor / Angi / Networx? (They almost certainly are.)</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">2. Opening</h2>
  ${ID_LINE}
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hi, this is <strong>[your first name]</strong> from <strong>NEPA-PRO</strong> — we're a veteran-owned construction company in Clarks Summit. I'm calling because we built a website and app platform specifically for roofers, and most contractors I talk to are paying $50 or more per lead to Angi or HomeAdvisor for leads that get shared with three other companies. Quick question — does that sound like your situation?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">3. Discovery</h2>
  <ol class="doc-ol">
    <li><strong>"What percentage of your leads come from third-party platforms vs. your own website or referrals?"</strong></li>
    <li><strong>"When a homeowner finds you online, what's the next step they take — call you, fill out a form, or just disappear?"</strong></li>
    <li><strong>"Do you offer financing, and if so, do customers know about it before they call you?"</strong> <em>Financing visibility increases close rate substantially in roofing — many contractors offer it but never advertise it.</em></li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">4. Value pitch — roofer-specific</h2>
  <ol class="doc-ol">
    <li><strong>Lead-capture website that ranks</strong> — local SEO so you show up in "roofer in [city]" searches. Your leads, exclusive to you, free after build.</li>
    <li><strong>Before/after gallery</strong> — drag-and-drop from your phone after every job. Trust is the #1 factor in winning roofing bids; pictures are how you win it.</li>
    <li><strong>Instant estimate form</strong> — homeowner fills out roof age, square footage, photos. You get a qualified lead with the data you need to quote, before you even pick up the phone.</li>
    <li><strong>Financing front-and-center</strong> — if you offer it, surface it. "$0 down, payments from $X/mo" doubles inbound on most contractors who turn it on.</li>
    <li><strong>Review collection automated</strong> — every completed job triggers a review request. Most roofers have 5 reviews and 50 happy customers. We close that gap.</li>
    <li><strong>Storm-response landing pages</strong> — when a hailstorm comes through your service area, we push a tailored page. Insurance-claim assistance, free inspection — captures the surge.</li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">5. Pricing &amp; CTA</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Best thing I can do is show you mockups for [their company]. Give me 15 minutes on Zoom — I'll have your branding, your service area, your competitors' positioning all ready. Tuesday or Wednesday this week?"</span></div>
  </div>
  <div class="doc-callout doc-info">Roofers are higher-ticket prospects. <strong>Allocate 15 minutes</strong> for the discovery call instead of 10. Bring a one-page proposal — they expect it.</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">6. Roofer-specific objections</h2>
  <table class="doc-table">
    <tr><th>They say</th><th>You say</th></tr>
    <tr><td>"Angi works fine for me."</td><td>"Most contractors I talk to feel that way until they realize what they're spending. Quick math: how many leads a month, average price per lead, and your close rate? Let's see what that's costing per closed job — usually it's eye-opening."</td></tr>
    <tr><td>"Word-of-mouth is my main channel."</td><td>"Best channel there is — and we don't replace it, we amplify it. When a happy customer mentions you, the next person Googles you. If your site is bad or doesn't exist, that referral leaks. We plug the leak."</td></tr>
    <tr><td>"I have a website my nephew built."</td><td>"Love that. Quick favor — pull it up on your phone right now. Tell me how long it takes to load. Bet it's longer than 4 seconds. That's where the homeowner bounces."</td></tr>
    <tr><td>"Roofing is seasonal — slow in winter."</td><td>"Right, which is exactly when winter storm-response and inspection-booking pages earn their keep. We build the off-season into the system, not against it."</td></tr>
    <tr><td>"I don't need more leads, I need better ones."</td><td>"Same thing. Lead quality comes from your site doing the qualifying upfront — square footage, roof age, photos. By the time they hit submit, they're a real prospect, not a shopper."</td></tr>
  </table>
</div>

${section_after_call_generic()}
` + footer();

// ----- HVAC ----------------------------------------------------------------

const SCRIPT_HVAC = header('Sales Script — HVAC Contractors', 'v1.0 · For PA-region heating, cooling & mechanical contractors') + `
<div class="doc-section">
  <h2 class="doc-h2">Why this market</h2>
  <div class="doc-stats">
    <div class="doc-pull"><div class="doc-pull-num">~$2K</div><div class="doc-pull-lbl">federal tax credit on qualifying heat pump installs (Inflation Reduction Act)</div></div>
    <div class="doc-pull"><div class="doc-pull-num">$8K–$15K</div><div class="doc-pull-lbl">typical residential system replacement — financing visibility moves the needle</div></div>
  </div>
  <p class="doc-p">HVAC is emergency-driven (AC fails in a heatwave, furnace fails in a cold snap) and high-ticket for replacements. Two pain points run the industry: <strong>(1)</strong> after-hours and overflow calls go to voicemail and convert into a competitor's job, and <strong>(2)</strong> the contractor's website rarely surfaces financing or rebates that would otherwise close more replacements. The pitch addresses both directly.</p>
  <div class="doc-callout doc-info"><strong>Industry signal:</strong> federal tax credits under the Inflation Reduction Act and PA-specific utility rebates (PPL, PECO, etc.) are real money on the table that most contractor websites don't surface. Helping owners advertise these correctly is a quick value-add that pays for the build several times over.</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">1. Pre-call research</h2>
  <ul class="doc-checklist">
    <li>Google "HVAC [city] PA" — where do they rank? Who beats them?</li>
    <li>Pull up their website on a phone-sized window — does it have a "Request Service" form? A finance link?</li>
    <li>Check Google Business Profile — recent reviews? Photos of crews/installs?</li>
    <li>Are they a Trane / Carrier / Lennox dealer? Most are; surface that as credibility on their own site.</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">2. Opening</h2>
  ${ID_LINE}
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hi, this is <strong>[your first name]</strong> from <strong>NEPA-PRO</strong> — we're a veteran-owned shop in Clarks Summit. I'm calling because we built a website and emergency-dispatch platform specifically for HVAC contractors in PA. Quick question first — when somebody calls you at 9 PM in a heatwave because their AC died, does that call ring through, or does it go to voicemail?"</span></div>
    <div class="doc-script-line"><span class="doc-script-actor note">PURPOSE</span><span class="doc-script-text">The opening question isolates the most painful real-world failure mode. Almost everyone says "voicemail" or "depends." Either answer is your wedge.</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">3. Discovery</h2>
  <ol class="doc-ol">
    <li><strong>"What percentage of your service calls come in after hours, and how many of those convert?"</strong> <em>Most contractors don't track this. The answer reveals their setup; the question makes them think about it.</em></li>
    <li><strong>"When you quote a $12,000 system replacement, how do customers find out you offer financing?"</strong> <em>Almost always: "I tell them on the call." Reframe: that means anyone who didn't call yet doesn't know.</em></li>
    <li><strong>"Do you have a maintenance program — and is it visible on your website?"</strong> <em>Recurring revenue is the biggest under-leveraged asset most contractors have. We'll surface it.</em></li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">4. Value pitch — HVAC-specific</h2>
  <ol class="doc-ol">
    <li><strong>24/7 emergency request capture</strong> — homeowner fills out a form when you can't pick up; you get a text and an email instantly. No more lost emergencies.</li>
    <li><strong>Financing visibility front-and-center</strong> — "Replace your system from $X/mo, $0 down" right on the homepage. We integrate with whatever finance partner you already use (Synchrony, GreenSky, Wells Fargo).</li>
    <li><strong>Rebate &amp; tax credit calculator</strong> — homeowner enters their existing system age and equipment type; the page shows them what they'd save with current PA rebates and federal credits. Closes replacements that would otherwise be "let me think about it."</li>
    <li><strong>Maintenance plan signup</strong> — recurring revenue with a self-service signup. Tiers (silver/gold/platinum), automatic credit card billing, scheduled reminders for spring/fall tune-ups.</li>
    <li><strong>Live tech ETA</strong> — once dispatched, customer sees "Dave will arrive between 2:15 and 2:45 PM, here's a photo of him so you know who's at the door." Massive trust builder.</li>
    <li><strong>Branded service-area pages</strong> — local SEO for every town you serve. "HVAC repair Clarks Summit," "AC installation Scranton," etc. Each ranks individually.</li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">5. Pricing &amp; CTA</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Best thing is for me to share my screen for 15 minutes — I'll have mockups built for [their company] specifically with your service area, your finance terms, and the rebates you'd qualify customers for. Tuesday or Thursday this week, mornings or afternoons?"</span></div>
  </div>
  <div class="doc-callout doc-info">HVAC owners book in shoulder seasons (spring/fall). If you're calling in peak summer or peak winter, lean on "I know you're slammed — let me lock in 15 minutes for next week." They'll respect the awareness.</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">6. HVAC-specific objections</h2>
  <table class="doc-table">
    <tr><th>They say</th><th>You say</th></tr>
    <tr><td>"My answering service handles after-hours."</td><td>"Got it — keep them. We add the form on top so the homeowner has options. Some prefer typing details at 11 PM over explaining their broken AC to a third-party operator. Both channels feed the same dispatch."</td></tr>
    <tr><td>"Financing is on my paperwork — customers see it when I quote."</td><td>"Right. The piece they're missing is seeing 'starts at $189/mo' before they even called you. That's how the homeowner who would've called the cheap guy decides to call you instead."</td></tr>
    <tr><td>"I'm not interested in maintenance plans, too much hassle."</td><td>"Hear that. The reason it's been a hassle is the manual billing. We make signup self-service and charge cards automatically every quarter. You set the price tiers; the system runs itself."</td></tr>
    <tr><td>"I get most of my work from referrals."</td><td>"Best channel. The site doesn't replace referrals — it converts them. When somebody mentions you, the next thing they do is Google you. If your site looks weak or doesn't load on phones, you lose half those referrals before they call."</td></tr>
    <tr><td>"I tried Google Ads, didn't work."</td><td>"Google Ads without a site that converts is just renting traffic that bounces. Fix the site first, ads come second. Want to see what 'site that converts' actually means?"</td></tr>
  </table>
</div>

${section_after_call_generic()}
` + footer();

// ----- Plumbers ------------------------------------------------------------

const SCRIPT_PLUMBERS = header('Sales Script — Plumbing Contractors', 'v1.0 · For PA-region residential & commercial plumbers') + `
<div class="doc-section">
  <h2 class="doc-h2">Why this market</h2>
  <div class="doc-stats">
    <div class="doc-pull"><div class="doc-pull-num">~80%</div><div class="doc-pull-lbl">of inbound plumbing calls are time-sensitive: leak, clog, no hot water, sewer backup</div></div>
    <div class="doc-pull"><div class="doc-pull-num">$5K–$15K</div><div class="doc-pull-lbl">sewer line replacement — the job financing visibility moves most</div></div>
  </div>
  <p class="doc-p">Plumbing is the most emergency-driven trade we sell to. Customers Google "emergency plumber near me" at 2 AM with a flooding basement. The plumber who picks up first wins; the plumber whose website doesn't load or doesn't have a 24/7 contact form loses regardless of skill or price. The pitch focuses on <strong>capture rate</strong> (form submissions when you can't pick up) and <strong>trust signals</strong> (reviews, license display, financing) that close the bigger jobs.</p>
</div>

<div class="doc-section">
  <h2 class="doc-h2">1. Pre-call research</h2>
  <ul class="doc-checklist">
    <li>Google "emergency plumber [their city]" — do they show up?</li>
    <li>Test their website on mobile — does it load fast? Is there a giant phone number? An emergency form?</li>
    <li>Yelp and Google reviews — recent? Responses to bad ones?</li>
    <li>Are they licensed PA contractor? Most are; surface that prominently as a trust signal.</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">2. Opening</h2>
  ${ID_LINE}
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hi, this is <strong>[your first name]</strong> from <strong>NEPA-PRO</strong> — we're a veteran-owned shop in Clarks Summit. I'm calling because we built a website and emergency dispatch platform specifically for plumbers in PA. Real quick: when someone has a flooded basement at 11 PM and Googles 'emergency plumber near me,' is there any path for them to reach you besides hoping you pick up the phone?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">3. Discovery</h2>
  <ol class="doc-ol">
    <li><strong>"What percentage of your inbound is true emergency vs. scheduled service?"</strong></li>
    <li><strong>"How are you handling after-hours calls today — answering service, voicemail, your cell?"</strong></li>
    <li><strong>"When you quote a $7,000 sewer line replacement, do customers know you offer financing before they hear the number?"</strong></li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">4. Value pitch — plumbing-specific</h2>
  <ol class="doc-ol">
    <li><strong>24/7 emergency request form</strong> — captures the homeowner who can't reach you. Texts and emails you instantly with their address, problem, and best callback number.</li>
    <li><strong>"We're 14 minutes away" service-area map</strong> — shows the homeowner you're local before they call. Plumbers within 20 minutes win against cheaper plumbers an hour out.</li>
    <li><strong>License + insurance + bond display</strong> — front-and-center. PA homeowners are wary; visible credentials close the trust gap immediately.</li>
    <li><strong>Financing for big jobs</strong> — sewer lines, water heaters, repipes. "Starts at $X/mo, $0 down" — same wedge as HVAC, even bigger impact.</li>
    <li><strong>Live review aggregation</strong> — your Google + Yelp + Facebook reviews pulled together on the homepage. Most plumbers have 50+ reviews scattered; nobody sees them all in one place.</li>
    <li><strong>Drain cleaning + maintenance subscriptions</strong> — annual sewer scope inspections, water-heater flushes. Recurring revenue, churn-resistant.</li>
    <li><strong>Branded follow-ups after every job</strong> — automatic review request via text 24 hours after work is completed. Most plumbers do great work; few systematically capture the social proof.</li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">5. Pricing &amp; CTA</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Best thing I can do is give you 15 minutes on Zoom — I'll have mockups for [their company] with your service area mapped, your license displayed, and the financing positioning we'd recommend. Tuesday or Wednesday this week?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">6. Plumbing-specific objections</h2>
  <table class="doc-table">
    <tr><th>They say</th><th>You say</th></tr>
    <tr><td>"My phone never stops ringing — I don't need more leads."</td><td>"Got it. Then this isn't a lead-gen pitch. It's a quality-of-life pitch. The form filters the easy stuff (hours, service area, basic price) so when you do call back, you're already past the qualifying step."</td></tr>
    <tr><td>"I have an answering service."</td><td>"Keep them. The form runs in parallel — homeowners who'd rather type their problem at midnight do, and your service handles the rest. You don't lose either channel."</td></tr>
    <tr><td>"My techs handle Yelp / reviews."</td><td>"Most owners think their guys are doing it. Almost none are doing it consistently. We automate the ask — text goes out 24 hours after every job, completed by you in our system. Reviews come in automatically."</td></tr>
    <tr><td>"My customers are old, they don't use websites."</td><td>"Their kids do. The kid who's helping mom find a plumber Googles you. Make sure what they find tells the story you want them to read."</td></tr>
    <tr><td>"I work mostly through Service Titan / commercial accounts."</td><td>"That's awesome — keep all that. The site is for the residential side and the new commercial leads finding you cold. Service Titan stays your back office."</td></tr>
  </table>
</div>

${section_after_call_generic()}
` + footer();

// ----- Electricians --------------------------------------------------------

const SCRIPT_ELECTRICIANS = header('Sales Script — Electrical Contractors', 'v1.0 · For PA-region residential & commercial electricians') + `
<div class="doc-section">
  <h2 class="doc-h2">Why this market</h2>
  <div class="doc-stats">
    <div class="doc-pull"><div class="doc-pull-num">$30%+</div><div class="doc-pull-lbl">federal tax credit (up to $1,000) on EV charger installs through 2032</div></div>
    <div class="doc-pull"><div class="doc-pull-num">$3K–$15K</div><div class="doc-pull-lbl">typical residential service-panel upgrade — financing visibility moves the needle</div></div>
  </div>
  <p class="doc-p">Electricians have two booming sub-markets that most contractor websites barely surface: <strong>EV charger installs</strong> (every new EV owner needs one and Googles for help) and <strong>panel upgrades</strong> driven by heat pumps, EV adoption, and aging service. The pitch focuses on capturing those high-intent searches.</p>
  <div class="doc-callout doc-info"><strong>Industry signal:</strong> federal Inflation Reduction Act tax credits cover 30% of EV charger installation cost (up to $1,000) through 2032, plus utility-specific rebates. Most contractor sites don't mention any of this — easy value-add to surface.</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">1. Pre-call research</h2>
  <ul class="doc-checklist">
    <li>Google "electrician [their city] PA" — where do they rank?</li>
    <li>Their site (if any) — does it mention EV chargers? Panel upgrades? 24/7 emergency service?</li>
    <li>License visible? PA requires HICPA registration for residential — is theirs prominent?</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">2. Opening</h2>
  ${ID_LINE}
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hi, this is <strong>[your first name]</strong> from <strong>NEPA-PRO</strong> — we're a veteran-owned shop in Clarks Summit. I'm calling because we built a website platform specifically for electricians in PA, and most contractors I talk to are losing the EV charger and panel-upgrade work to bigger guys with better-positioned websites. Quick question — does your current site even mention EV charger installs?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">3. Discovery</h2>
  <ol class="doc-ol">
    <li><strong>"How many EV charger installs are you doing per month, and where do those leads come from?"</strong></li>
    <li><strong>"Service panel upgrades — are most of those tied to a specific reason (EV, heat pump, kitchen remodel) or just aging service?"</strong></li>
    <li><strong>"When somebody Googles 'emergency electrician [your city]' at 11 PM, are they finding you?"</strong></li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">4. Value pitch — electrician-specific</h2>
  <ol class="doc-ol">
    <li><strong>EV charger landing page</strong> — separate dedicated page that ranks for "Tesla charger installation [city]," shows pricing tiers, surfaces the 30% federal tax credit and PA utility rebates.</li>
    <li><strong>Panel upgrade calculator</strong> — homeowner enters their existing amperage and what they want to add; the page shows them whether they need an upgrade. Self-qualifies the lead.</li>
    <li><strong>24/7 emergency form</strong> — captures storm-damage and electrical-hazard calls when you can't pick up. Texts and emails you instantly.</li>
    <li><strong>License + bond + insurance display</strong> — front and center. PA homeowners are wary; visible credentials close the trust gap.</li>
    <li><strong>Service-area pages</strong> — local SEO for every town you serve. "Electrician Clarks Summit," "Panel upgrade Scranton."</li>
    <li><strong>Commercial vs. residential split</strong> — separate pathways so commercial property managers don't navigate residential pages and vice versa.</li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">5. Pricing &amp; CTA</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Best thing is for me to share my screen for 15 minutes — I'll have mockups for [their company] specifically with your service area, your license, and the EV/rebate positioning. Tuesday or Thursday this week?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">6. Electrician-specific objections</h2>
  <table class="doc-table">
    <tr><th>They say</th><th>You say</th></tr>
    <tr><td>"I get most of my work from GCs / referrals."</td><td>"Best channel. We don't replace it — we make sure when those referrals Google you, what they find closes the deal. Half of referred customers shop you online before they call."</td></tr>
    <tr><td>"EV chargers — too much warranty hassle."</td><td>"Hear that. We position you as Tesla / ChargePoint / EnergyStar certified (whatever you actually are) so the customer's expectations match what you install. Warranty issues drop when they understand who they hired."</td></tr>
    <tr><td>"My phone never stops, I don't need leads."</td><td>"Then this isn't lead-gen. It's a quality-of-life pitch — the form pre-qualifies before you call back, so you spend less time on calls that go nowhere."</td></tr>
    <tr><td>"Electrical isn't really an online-search business."</td><td>"It used to not be. EV charger installs change that — anyone with a new Tesla searches. Same with panel upgrades for heat pumps. The market shifted in the last 3 years."</td></tr>
  </table>
</div>

${section_after_call_generic()}
` + footer();

// ----- Handymen ------------------------------------------------------------

const SCRIPT_HANDYMAN = header('Sales Script — Handymen', 'v1.0 · For PA-region handyman & home-repair contractors') + `
<div class="doc-section">
  <h2 class="doc-h2">Why this market</h2>
  <p class="doc-p">Handyman is the most fragmented trade in our pipeline — most operators are 1–3 person shops doing small jobs ($150–$2,000) where job velocity matters more than ticket size. Two pain points: <strong>(1)</strong> they're competing against TaskRabbit / Thumbtack / Angi which take 15–30% per lead, and <strong>(2)</strong> they have no website to capture the customer who already loves them and would refer friends.</p>
  <div class="doc-stats">
    <div class="doc-pull"><div class="doc-pull-num">15–30%</div><div class="doc-pull-lbl">platform fee per lead on Thumbtack / Angi / TaskRabbit</div></div>
    <div class="doc-pull"><div class="doc-pull-num">$300+</div><div class="doc-pull-lbl">average ticket — 5–10 jobs/week is the volume target</div></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">1. Pre-call research</h2>
  <ul class="doc-checklist">
    <li>Are they a one-person op or a small crew? Different pitch.</li>
    <li>Google "handyman [their city]" — do they rank?</li>
    <li>Are they on Thumbtack / Angi / TaskRabbit? (Almost always.)</li>
    <li>License — PA requires HICPA registration for jobs over $5K. Verify if they're licensed.</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">2. Opening</h2>
  ${ID_LINE}
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hi, this is <strong>[your first name]</strong> from <strong>NEPA-PRO</strong> — we're a veteran-owned shop in Clarks Summit. I'm calling because we built a website platform specifically for handymen and small home-repair contractors in PA. Quick question: are you currently paying Thumbtack or Angi for leads, and if so, do you ever get the feeling those leads are going to four other guys at the same time?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">3. Discovery</h2>
  <ol class="doc-ol">
    <li><strong>"How are most jobs coming in — referrals, platforms like Thumbtack, or Google?"</strong></li>
    <li><strong>"What's your average job size, and how many do you run in a typical week?"</strong></li>
    <li><strong>"What kind of work do you turn down? Drywall, plumbing rough-in, structural — knowing what you don't do is half the website."</strong></li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">4. Value pitch — handyman-specific</h2>
  <ol class="doc-ol">
    <li><strong>"Send a photo, get a quote" form</strong> — homeowner texts a photo, you reply with ballpark pricing. Filters out tire-kickers and books real jobs faster.</li>
    <li><strong>Service list with rough pricing</strong> — TV mounting from $X, ceiling fan install from $Y, etc. Sets expectations before they call.</li>
    <li><strong>Coverage area map</strong> — show the towns you'll travel to. "Within 20 minutes of Clarks Summit." Stops the "are you local?" call.</li>
    <li><strong>Review aggregation</strong> — your Google + Thumbtack + Angi reviews pulled together. Trust is the entire game in handyman.</li>
    <li><strong>Booking calendar</strong> — let customers self-book a time slot for non-urgent work. Fewer phone-tag rounds.</li>
    <li><strong>Branded follow-ups</strong> — automatic "how was the job?" text 24 hours after work, with a one-tap review link.</li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">5. Pricing &amp; CTA</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Best thing is for me to share my screen for 10 minutes — I'll have something built for [their company] showing the photo-quote flow, your service area, and your reviews pulled together. Tuesday or Wednesday?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">6. Handyman-specific objections</h2>
  <table class="doc-table">
    <tr><th>They say</th><th>You say</th></tr>
    <tr><td>"Thumbtack works fine for me."</td><td>"Most guys feel that way until they do the math. How many leads a month, average price per lead, close rate? When you back into cost-per-closed-job, it's usually eye-opening."</td></tr>
    <tr><td>"I'm just one guy, I don't need a real website."</td><td>"That's actually exactly why you do. Solo guys lose to bigger crews when the customer Googles them. Your site is the equalizer — it makes you look professional without you needing employees."</td></tr>
    <tr><td>"My customers are word-of-mouth."</td><td>"Best channel there is. The site doesn't replace referrals; it converts them. When someone mentions you, the next thing they do is Google you. Make sure what they find closes the deal."</td></tr>
    <tr><td>"I don't have time for a website."</td><td>"Get that. Build is on us — you give us photos and a list of services, we do the rest. Once it's up, you check it once a week."</td></tr>
  </table>
</div>

${section_after_call_generic()}
` + footer();

// ----- Painters ------------------------------------------------------------

const SCRIPT_PAINTERS = header('Sales Script — Painters', 'v1.0 · For PA-region residential & commercial painters') + `
<div class="doc-section">
  <h2 class="doc-h2">Why this market</h2>
  <p class="doc-p">Painting is a visual trade — homeowners decide on a painter primarily by looking at photos of past work. Most painter websites either (a) don't exist or (b) have generic stock photos that hurt more than help. The pitch is straightforward: <strong>portfolio + instant estimate forms</strong> close more jobs at higher ticket prices.</p>
  <div class="doc-stats">
    <div class="doc-pull"><div class="doc-pull-num">$3K–$10K</div><div class="doc-pull-lbl">typical interior repaint — visual trust closes the deal</div></div>
    <div class="doc-pull"><div class="doc-pull-num">~70%</div><div class="doc-pull-lbl">of painting customers compare 3+ contractors before deciding</div></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">1. Pre-call research</h2>
  <ul class="doc-checklist">
    <li>Their site or Google Business Profile — are there photos of actual completed jobs?</li>
    <li>Reviews — most painters have great reviews but no system to surface them</li>
    <li>Interior, exterior, commercial, or all? Different pitch per focus.</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">2. Opening</h2>
  ${ID_LINE}
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hi, this is <strong>[your first name]</strong> from <strong>NEPA-PRO</strong> — we're a veteran-owned shop in Clarks Summit. I'm calling because we built a website platform specifically for painters in PA, and the #1 reason painters lose bids is the homeowner can't see their work online. Quick question: do you have a portfolio of finished jobs anywhere customers can browse before they call?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">3. Discovery</h2>
  <ol class="doc-ol">
    <li><strong>"What's your job mix — interior, exterior, cabinets, commercial?"</strong></li>
    <li><strong>"When you finish a job, do you take photos? What happens to them?"</strong> <em>Almost always: "On my phone." That's gold sitting unused.</em></li>
    <li><strong>"How are estimates handled — phone walkthroughs, in-person, or send-me-photos?"</strong></li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">4. Value pitch — painter-specific</h2>
  <ol class="doc-ol">
    <li><strong>Filterable photo portfolio</strong> — interior / exterior / cabinets / specialty. Homeowners filter to "kitchen cabinet refinishing" and see 30 examples. Closes the trust gap instantly.</li>
    <li><strong>Before/after slider</strong> — drag to compare. The single most powerful conversion tool in the trade.</li>
    <li><strong>Photo-estimate form</strong> — homeowner uploads 4 photos + room dimensions, you reply with a ballpark. Pre-qualifies leads that turn into real walkthroughs.</li>
    <li><strong>Color consultation booking</strong> — separate page for upsell service. Most painters offer it; few advertise it.</li>
    <li><strong>License + insurance + worker's comp display</strong> — visible credentials, especially important for interior work where homeowners worry about damage.</li>
    <li><strong>Review aggregation + automated review requests</strong> — text goes out 24 hours after job completion.</li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">5. Pricing &amp; CTA</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Best thing is for me to share my screen for 10 minutes — I'll have a portfolio template built for [their company] using whatever sample photos you've got. Tuesday or Wednesday?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">6. Painter-specific objections</h2>
  <table class="doc-table">
    <tr><th>They say</th><th>You say</th></tr>
    <tr><td>"My photos aren't good enough."</td><td>"Hear that all the time. iPhone photos are fine — we'll guide what to capture. Most homeowners aren't comparing photo quality, they're looking for proof you've done their type of project."</td></tr>
    <tr><td>"I don't have a website right now and word-of-mouth keeps me busy."</td><td>"Best channel. Site doesn't replace it — it converts referrals. Your friend says 'use Bob the painter' and they Google you. If nothing comes up, the trust drops in half."</td></tr>
    <tr><td>"Painting isn't really shopped online."</td><td>"It is now. Homeowners look at photos before color consult before they call. We make sure your photos are what they're looking at."</td></tr>
    <tr><td>"I do mostly commercial — different business."</td><td>"Got it. Commercial painters need a different page set — property managers, insurance work, multi-unit. We can build that path separately. Different leads, different pitch."</td></tr>
  </table>
</div>

${section_after_call_generic()}
` + footer();

// ----- Deck Builders -------------------------------------------------------

const SCRIPT_DECKS = header('Sales Script — Deck Builders', 'v1.0 · For PA-region custom deck contractors') + `
<div class="doc-section">
  <h2 class="doc-h2">Why this market</h2>
  <p class="doc-p">Deck building is seasonal (April–October), high-ticket ($8K–$60K), and visually-driven. Homeowners spend weeks researching before contacting any contractor. Most deck builder websites are weak — generic stock photos, no calculator, no financing visibility — even though the customer is doing exactly the kind of intent-rich research where a great site converts cold visitors.</p>
  <div class="doc-stats">
    <div class="doc-pull"><div class="doc-pull-num">$8K–$60K</div><div class="doc-pull-lbl">typical deck build — material choice drives the spread</div></div>
    <div class="doc-pull"><div class="doc-pull-num">3–6 wk</div><div class="doc-pull-lbl">research-to-decision timeline — your site has time to win them over</div></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">1. Pre-call research</h2>
  <ul class="doc-checklist">
    <li>Their site — do they have photos of completed decks? By material? By size?</li>
    <li>Composite vs. wood — what do they specialize in?</li>
    <li>TimberTech / Trex / Azek dealer? Major selling point most don't surface.</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">2. Opening</h2>
  ${ID_LINE}
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hi, this is <strong>[your first name]</strong> from <strong>NEPA-PRO</strong> — we're a veteran-owned shop in Clarks Summit. I'm calling because we built a website platform specifically for custom deck builders in PA. Quick question: when somebody is researching a $20,000 composite deck for 6 weeks before calling you, what does your website show them?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">3. Discovery</h2>
  <ol class="doc-ol">
    <li><strong>"What's your typical project size and material — wood, composite, mix?"</strong></li>
    <li><strong>"How are leads coming in today — referrals, BBB, manufacturer dealer locator, your site?"</strong></li>
    <li><strong>"Do you offer financing on bigger builds, and if so, do customers know before they call?"</strong></li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">4. Value pitch — deck-builder-specific</h2>
  <ol class="doc-ol">
    <li><strong>Filterable project gallery</strong> — by material, by size, by feature (lighting, multi-level, screened-in, pergola). Homeowners filter to what they want to see.</li>
    <li><strong>Deck cost calculator</strong> — square footage, material, features. Spits out an estimated range. Pre-qualifies and educates simultaneously.</li>
    <li><strong>Material comparison tool</strong> — wood vs. composite vs. PVC, with cost-per-year-of-life math. Closes the higher-ticket sale because the customer understands the value.</li>
    <li><strong>Financing front-and-center</strong> — "$0 down, payments from $X/mo on a $20K deck." Massive lever for closing decisions where the customer was on the fence about scope.</li>
    <li><strong>Permit &amp; HOA assistance</strong> — page that explains your role in pulling permits and dealing with HOAs. Differentiates from solo contractors.</li>
    <li><strong>Build timeline transparency</strong> — "Booked through July, taking deposits for August builds." Sets expectations and creates urgency.</li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">5. Pricing &amp; CTA</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Best thing is for me to share my screen for 15 minutes — I'll have a portfolio + calculator template built for [their company] specifically. Tuesday or Wednesday this week?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">6. Deck-builder-specific objections</h2>
  <table class="doc-table">
    <tr><th>They say</th><th>You say</th></tr>
    <tr><td>"I'm booked through next year."</td><td>"That's fantastic. Then this isn't about more leads — it's about better ones. The calculator filters tire-kickers; you only spend time on customers who already know what they want and can afford it."</td></tr>
    <tr><td>"Customers always negotiate price down."</td><td>"That's almost always because they're comparing apples to oranges — your $30K composite vs. someone else's $18K wood. The material comparison page makes them understand what they're actually buying. Negotiation drops."</td></tr>
    <tr><td>"My TimberTech / Trex dealer locator brings me leads."</td><td>"Keep it. Dealer locator drives traffic; your own site converts it. Right now those leads are landing on a generic page. We make them land on your portfolio."</td></tr>
    <tr><td>"It's seasonal — slow in winter."</td><td>"Right, which is exactly when winter pre-booking pages earn their keep. We build off-season into the system — locking in spring builds with deposits in January."</td></tr>
  </table>
</div>

${section_after_call_generic()}
` + footer();

// ----- Welders -------------------------------------------------------------

const SCRIPT_WELDERS = header('Sales Script — Welding & Metal Fabrication', 'v1.0 · For PA-region welders & metal fabricators') + `
<div class="doc-section">
  <h2 class="doc-h2">Why this market</h2>
  <p class="doc-p">Welding is a B2B-heavy trade — most jobs come from contractors, manufacturers, and farm/equipment owners, not residential consumers. The pitch is different from consumer trades: <strong>certifications, capabilities, equipment, and turnaround</strong> are what buyers research. Most welder websites are 1-page brochures from 2010 that say "we weld." That's the gap.</p>
  <div class="doc-stats">
    <div class="doc-pull"><div class="doc-pull-num">3+ AWS</div><div class="doc-pull-lbl">certifications typical for commercial work — visibility wins commercial accounts</div></div>
    <div class="doc-pull"><div class="doc-pull-num">B2B</div><div class="doc-pull-lbl">primary buyer — contractors, plant managers, farm equipment owners</div></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">1. Pre-call research</h2>
  <ul class="doc-checklist">
    <li>Their site — does it list AWS / ASME certifications? Equipment specs?</li>
    <li>What welding processes? MIG / TIG / stick / aluminum / stainless?</li>
    <li>Mobile rig or shop-only? Different pitch.</li>
    <li>Do they have a fab shop or pure repair?</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">2. Opening</h2>
  ${ID_LINE}
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hi, this is <strong>[your first name]</strong> from <strong>NEPA-PRO</strong> — we're a veteran-owned shop in Clarks Summit. I'm calling because we built a website platform specifically for welders and metal fabricators in PA. Quick question: when a plant manager or general contractor is searching for a TIG welder with stainless capability, does your current site even tell them whether you can handle it?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">3. Discovery</h2>
  <ol class="doc-ol">
    <li><strong>"What's your typical buyer — contractor, manufacturer, farm/equipment, residential?"</strong></li>
    <li><strong>"What certifications do you hold, and are they visible to a customer Googling you?"</strong></li>
    <li><strong>"What's the breakdown — repair work, fab shop, mobile rig calls?"</strong></li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">4. Value pitch — welder-specific</h2>
  <ol class="doc-ol">
    <li><strong>Capability matrix</strong> — table of processes (MIG/TIG/stick/aluminum/stainless), thicknesses, lengths, certifications. Plant managers scan it in 5 seconds and decide if you're a fit.</li>
    <li><strong>Certifications front-and-center</strong> — AWS, ASME, code-stamp work. Visibility matters for commercial bids more than any other lever.</li>
    <li><strong>Project portfolio</strong> — past jobs by type (structural, equipment repair, custom fab, ornamental). Photos with brief descriptions of process used.</li>
    <li><strong>Mobile rig service area</strong> — if you have a mobile setup, map of how far you'll travel. Big differentiator for emergency equipment repair.</li>
    <li><strong>Quote request form</strong> — drawing/photo upload, material specs, quantity, deadline. Filters serious B2B inquiries.</li>
    <li><strong>Equipment list</strong> — what's in the shop. Sounds like overkill, but contractors specifically search for "shop with [machine]."</li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">5. Pricing &amp; CTA</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Best thing is for me to share my screen for 15 minutes — I'll have a capability matrix and portfolio template built for [their shop] specifically. Tuesday or Thursday this week?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">6. Welder-specific objections</h2>
  <table class="doc-table">
    <tr><th>They say</th><th>You say</th></tr>
    <tr><td>"My customers come from word-of-mouth in the industry."</td><td>"Best channel — and we don't replace it. When a plant buyer hears about you, they look you up before procurement signs off. Your site is the deciding factor at that step, not the lead source."</td></tr>
    <tr><td>"I'm too small for commercial accounts."</td><td>"Your size means lower overhead. Many smaller commercial buyers prefer that. The site is what makes you findable for the size of work you actually want."</td></tr>
    <tr><td>"My phone never stops, I don't need leads."</td><td>"Then this isn't lead-gen. It's about better-quality jobs — the form filters quote requests so you only respond to ones that fit your shop."</td></tr>
    <tr><td>"Welding isn't googled."</td><td>"It is by procurement and facility managers. Different searcher than residential. They search for exact processes — 'aluminum TIG stainless food-grade' — and find shops that surface those terms specifically."</td></tr>
  </table>
</div>

${section_after_call_generic()}
` + footer();

// ----- CNC Shops -----------------------------------------------------------

const SCRIPT_CNC = header('Sales Script — CNC & Precision Machine Shops', 'v1.0 · For PA-region CNC shops & precision manufacturers') + `
<div class="doc-section">
  <h2 class="doc-h2">Why this market</h2>
  <p class="doc-p">CNC shops are pure B2B — buyers are mechanical engineers, procurement officers, and product designers searching for vendors who can hold tolerances on specific materials. They aren't shopping on price first; they're shopping on <strong>capability + reliability + ISO certification</strong>. Most shop websites haven't been updated since 2015 and miss the buyers who'd otherwise be ideal accounts.</p>
  <div class="doc-stats">
    <div class="doc-pull"><div class="doc-pull-num">ISO 9001</div><div class="doc-pull-lbl">often required for aerospace/medical/defense work — must be visible</div></div>
    <div class="doc-pull"><div class="doc-pull-num">3-axis / 5-axis</div><div class="doc-pull-lbl">capability differentiation — lock in the searches that match your shop</div></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">1. Pre-call research</h2>
  <ul class="doc-checklist">
    <li>Their site — capabilities listed? Equipment? Certifications?</li>
    <li>Industries served — automotive, aerospace, medical, food-grade, general?</li>
    <li>Prototype-to-production, or production-only?</li>
    <li>ITAR / ISO / AS9100 — verify what they actually have.</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">2. Opening</h2>
  ${ID_LINE}
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hi, this is <strong>[your first name]</strong> from <strong>NEPA-PRO</strong> — we're a veteran-owned shop in Clarks Summit. I'm calling because we built a website platform specifically for CNC and precision machine shops. Quick question: when a procurement officer at an aerospace OEM is searching for a 5-axis shop with AS9100, does your site come up?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">3. Discovery</h2>
  <ol class="doc-ol">
    <li><strong>"What industries are your bread-and-butter — aerospace, medical, automotive, defense, general?"</strong></li>
    <li><strong>"Capabilities — 3-axis, 4-axis, 5-axis? Mill, lathe, swiss?"</strong></li>
    <li><strong>"Certifications — ISO 9001, AS9100, ITAR?"</strong></li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">4. Value pitch — CNC-specific</h2>
  <ol class="doc-ol">
    <li><strong>Capabilities matrix</strong> — equipment, axes, work envelopes, tolerance ranges, materials. Procurement scans it and decides whether to send the RFQ.</li>
    <li><strong>Certifications wall</strong> — ISO 9001, AS9100D, ITAR-registered, etc. Logos and certificate numbers. Buyer compliance starts here.</li>
    <li><strong>Industry case studies</strong> — anonymized projects: aerospace bracket from 6061-T6, medical device housing from 17-4 stainless, etc. Shows the buyer you've solved their problem before.</li>
    <li><strong>RFQ portal</strong> — secure file upload for STEP / DWG / PDF. Procurement uploads the print + quantity + due date, you reply with a quote. Removes the email back-and-forth.</li>
    <li><strong>Equipment list with brand &amp; year</strong> — Haas / Mazak / Doosan / Okuma. Buyers specifically search for shops that run their preferred equipment.</li>
    <li><strong>Lead-time transparency</strong> — "Currently quoting at 4-week lead time, expedite available." Sets expectations, builds trust.</li>
  </ol>
</div>

<div class="doc-section">
  <h2 class="doc-h2">5. Pricing &amp; CTA</h2>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Best thing is for me to share my screen for 15 minutes — I'll have a capability matrix and RFQ portal template built for [their shop] specifically. Tuesday or Thursday this week?"</span></div>
  </div>
  <div class="doc-callout doc-info">
    <strong>CNC sales cycles are longer.</strong> First conversation books a discovery; discovery books a proposal; proposal might take 30–60 days to close because procurement is involved. Patience and follow-up rhythm matter more than urgency.
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">6. CNC-specific objections</h2>
  <table class="doc-table">
    <tr><th>They say</th><th>You say</th></tr>
    <tr><td>"All my work is repeat customers."</td><td>"Best position to be in. The site does two things — captures the new lead occasionally, and shows your existing customers' procurement teams that you're modern. Many old-school shops lose accounts when procurement decides their vendor 'looks dated.'"</td></tr>
    <tr><td>"Procurement uses ThomasNet / MFG / industry directories."</td><td>"Right. And those listings link to your site. If your site looks like 2010, the click bounces. We make sure the click converts."</td></tr>
    <tr><td>"My business is too technical for a website to capture."</td><td>"Your business is exactly the kind of thing a website should capture — engineers love specs, equipment lists, tolerance data. They want to read all of it before they call."</td></tr>
    <tr><td>"I've tried RFQ portals, customers don't use them."</td><td>"Old portals, yeah. Modern ones with drag-and-drop, instant confirmation, and clear status — different story. Worth seeing what we'd build."</td></tr>
  </table>
</div>

${section_after_call_generic()}
` + footer();

// ===========================================================================
// OPERATIONAL DOCS — used after the cold call books a discovery
// ===========================================================================

// ----- Discovery Call Framework --------------------------------------------

const DISCOVERY = header('Discovery Call Framework', 'v1.0 · For the 10–15 minute Zoom you just booked') + `
<div class="doc-callout doc-info">
  <strong>What this doc is for:</strong> the cold call's job is to book the discovery. The discovery's job is to qualify the lead, demonstrate value, and book the proposal. This is the playbook for that middle step. Run it tight, finish on time, leave them wanting more.
</div>

<div class="doc-section">
  <h2 class="doc-h2">Before the call (10 min prep)</h2>
  <ul class="doc-checklist">
    <li>Pull up their existing website (or Google Business Profile if no site)</li>
    <li>Take 2 phone screenshots: their current mobile experience + a competitor's good one</li>
    <li>Review the relevant industry sales script — refresh the 2–3 most relevant value props</li>
    <li>Have your calendar open in another tab — proposal slot ready to offer</li>
    <li>Test your screenshare. Test your mic. Be the host.</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">The arc — 10 minutes, six segments</h2>
  <table class="doc-table">
    <tr><th>Time</th><th>Segment</th><th>Goal</th></tr>
    <tr><td>0–1 min</td><td>Warm-up</td><td>Confirm time, set agenda, get permission</td></tr>
    <tr><td>1–4 min</td><td>Discovery deepening</td><td>Three follow-ups to the cold-call answers</td></tr>
    <tr><td>4–7 min</td><td>Show-and-tell</td><td>Their site vs. a great-looking peer</td></tr>
    <tr><td>7–9 min</td><td>Recommendation</td><td>What you'd build, in their words</td></tr>
    <tr><td>9–10 min</td><td>Book the next step</td><td>Calendar a proposal walkthrough</td></tr>
    <tr><td>+5 min buffer</td><td>Their questions</td><td>Don't pitch through them</td></tr>
  </table>
</div>

<div class="doc-section">
  <h2 class="doc-h2">Segment scripts</h2>

  <h3 class="doc-h3">0–1: Warm-up</h3>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Hey [name], thanks for the time. Quick map of the next 10 minutes: I'm going to ask three follow-up questions to what we talked about, then share my screen for a couple minutes to show you specifically what I'd build for [business name], and we'll wrap by figuring out if next steps make sense. Sound good?"</span></div>
  </div>

  <h3 class="doc-h3">1–4: Discovery deepening</h3>
  <p class="doc-p">Three open questions only. Listen 80%, talk 20%.</p>
  <ol class="doc-ol">
    <li><strong>"Walk me through what happens today when [their pain point] comes in — start to finish."</strong></li>
    <li><strong>"If we fixed that, what's the one thing you'd want it to do that nothing on the market currently does?"</strong></li>
    <li><strong>"Who else needs to be on board with a decision like this?"</strong></li>
  </ol>
  <div class="doc-callout doc-warn"><strong>Listen for:</strong> who actually decides, what their budget reflex is, and what timing pressure exists. These three pieces decide whether the proposal lands.</div>

  <h3 class="doc-h3">4–7: Show-and-tell</h3>
  <p class="doc-p">Share screen. Pull up their existing site (or competitor's GBP if they have nothing). Don't trash it — narrate what you see, with empathy.</p>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Here's what I see when I'm a homeowner finding you for the first time. Loading time… [count seconds]. First impression… [what's there]. Phone number… [hard to find / missing]. Service area… [unclear]. Now let me show you a [their industry] in [different city] who's doing it well — see how this lands different?"</span></div>
  </div>

  <h3 class="doc-h3">7–9: Recommendation</h3>
  <p class="doc-p">Tell them what you'd build, using <em>their</em> words from the discovery.</p>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Based on what you just told me, here's what I'd recommend specifically for [business name]: [feature 1 tied to pain 1], [feature 2 tied to pain 2], and [feature 3 they wished existed]. We'd build a site and an installable app together — about a 3-week build, give or take depending on content."</span></div>
  </div>

  <h3 class="doc-h3">9–10: Book the next step</h3>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor">YOU</span><span class="doc-script-text">"Best next step is I prep a real proposal — pricing, mockups, timeline, all of it. Takes me about a day. Want to grab 20 minutes early next week to walk through it together? Tuesday or Wednesday?"</span></div>
  </div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">After the call</h2>
  <ul class="doc-checklist">
    <li>If proposal booked → calendar invite within 5 minutes, mark <strong>Qualified</strong> in the dialer</li>
    <li>If they want to think → "Totally fair. Mind if I send a one-pager so you have it in writing?" Send within an hour, mark <strong>Spoke</strong></li>
    <li>If clearly not a fit → polite exit, mark <strong>Lost</strong> with reason "not a fit (post-discovery)"</li>
    <li>Either way: log notes in their contact record while it's fresh</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">Common discovery-call mistakes</h2>
  <ol class="doc-ol">
    <li><strong>Pitching through their concerns.</strong> If they raise a worry, address it before continuing. Skipping a concern doesn't make it go away — it makes them politely lie at the end.</li>
    <li><strong>Going over time.</strong> If you said 10 minutes, end at 10. They'll respect you, and the proposal call will get booked.</li>
    <li><strong>Quoting on the call.</strong> Without a real proposal, every number you say becomes the price they remember. Quote on paper, not verbally.</li>
    <li><strong>Demoing features they don't care about.</strong> Show only what addresses what they told you in segment 2. Restraint is the demo.</li>
  </ol>
</div>
` + footer();

// ----- CRM Data Standards --------------------------------------------------

const CRM_STANDARDS = header('CRM Data Standards', 'v1.0 · How we keep the dialer trustworthy') + `
<div class="doc-callout doc-info">
  <strong>Why this matters:</strong> a CRM is only as good as the data going in. If everyone marks statuses inconsistently, the pipeline view becomes noise and we make bad decisions about who to call back when. This doc is the contract — every team member follows it the same way.
</div>

<div class="doc-section">
  <h2 class="doc-h2">When to use each Outreach status</h2>
  <table class="doc-table">
    <tr><th>Status</th><th>Use when</th><th>Don't use when</th></tr>
    <tr><td><strong>Spoke</strong></td><td>You had a real conversation — even brief — with the decision-maker or someone who can take a message reliably</td><td>You only spoke to a receptionist who said "he's not here." That's still LVM territory or no status.</td></tr>
    <tr><td><strong>LVM</strong></td><td>You left a voicemail. One LVM per number, ever. (See Voicemail Script for follow-up rhythm.)</td><td>The phone rang and rolled over without giving you a chance to leave a message. That's no status — try again.</td></tr>
    <tr><td><strong>Texted</strong></td><td>You sent an SMS to a published business number using the Text Follow-up Template</td><td>You texted a number scraped from a residential context. Don't text those — call.</td></tr>
    <tr><td><strong>Emailed</strong></td><td>You sent the Email Follow-up template (or a real customized response) to a published business email</td><td>You sent a contact form on their website. Mark Spoke + a note instead.</td></tr>
    <tr><td><strong>Direct Mailed</strong></td><td>You actually sent physical mail (letter, postcard, brochure)</td><td>You "thought about it" or planned to. Mark only when the envelope is in the mailbox.</td></tr>
  </table>
</div>

<div class="doc-section">
  <h2 class="doc-h2">When to use each Pipeline stage</h2>
  <table class="doc-table">
    <tr><th>Stage</th><th>Definition</th></tr>
    <tr><td><strong>Qualified</strong></td><td>They booked a discovery call OR explicitly asked for more information. Future revenue is plausible.</td></tr>
    <tr><td><strong>Customer</strong></td><td>They signed up. Money has changed hands or a contract is countersigned. Not "they said yes" — they paid.</td></tr>
    <tr><td><strong>Lost</strong></td><td>They explicitly said no, the deal stalled past 60 days with no response, or they went with a competitor. Always log a reason in the contact's notes.</td></tr>
  </table>
  <div class="doc-callout doc-warn"><strong>Outreach vs. Pipeline:</strong> these are two different axes. A lead can be Spoke (outreach) AND Qualified (pipeline) simultaneously — but the dialer only stores one status field, so the more advanced one wins. Pipeline stages override outreach methods. The system handles this for you when you click the buttons in order.</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">When to mark Do Not Call</h2>
  <ol class="doc-ol">
    <li>Anyone who explicitly asks to be removed from the list — same call, no exceptions</li>
    <li>Wrong numbers (so we don't redial)</li>
    <li>Confirmed business closures</li>
    <li>Anyone the team flags as a TCPA litigator (use the "Litigator / TCPA risk" reason)</li>
  </ol>
  <p class="doc-p"><strong>The DNC list is a one-way street.</strong> Once a number is on it, the only way it comes off is if the lead themselves contacts us asking to be reactivated, and we document that explicitly. Default behavior: stay on the list forever. (See TCPA Compliance &amp; DNC Policy doc.)</p>
</div>

<div class="doc-section">
  <h2 class="doc-h2">Notes hygiene</h2>
  <p class="doc-p">Every meaningful interaction gets a one-line note in the contact record. The format:</p>
  <div class="doc-script">
    <div class="doc-script-line"><span class="doc-script-actor note">FORMAT</span><span class="doc-script-text">[YYYY-MM-DD HH:MM] [Channel] — [What happened] — [Next step]</span></div>
    <div class="doc-script-line"><span class="doc-script-actor note">EX 1</span><span class="doc-script-text">2026-05-08 14:32 · Call · Owner Maria interested, kids run shop, asked for quote — Follow up Tue 5/13 with mockup</span></div>
    <div class="doc-script-line"><span class="doc-script-actor note">EX 2</span><span class="doc-script-text">2026-05-08 09:15 · LVM · Standard voicemail left, sent email — Day 7 text reminder</span></div>
    <div class="doc-script-line"><span class="doc-script-actor note">EX 3</span><span class="doc-script-text">2026-05-08 11:40 · Call · "Take me off your list" — DNC, asked to be removed</span></div>
  </div>
  <div class="doc-callout doc-success"><strong>Your future self thanks you.</strong> Notes are the difference between "wait, who is this?" and "I remember exactly where we left off." When a callback comes in two months later, the note saves the relationship.</div>
</div>

<div class="doc-section">
  <h2 class="doc-h2">Status timing &amp; cleanup</h2>
  <ul class="doc-checklist">
    <li>Update status <em>during</em> the call, not after — we forget by the next call</li>
    <li>Pipeline review every Friday — anyone Qualified for 30+ days without movement gets re-engaged or moved to Lost</li>
    <li>Customers from 6+ months ago get a check-in call quarterly — they're our best referral source</li>
    <li>Lost leads from 9+ months ago can be cleared from the active list (the lead never deletes — it just exits the active funnel view)</li>
  </ul>
</div>

<div class="doc-section">
  <h2 class="doc-h2">What good looks like</h2>
  <p class="doc-p">A healthy week in the dialer:</p>
  <ul class="doc-ul">
    <li>Every active contact has at least one note from the last 30 days</li>
    <li>Every status reflects the actual most-recent interaction</li>
    <li>The DNC list grew by 3–8 entries (proves we're calling, not just clicking)</li>
    <li>Pipeline view shows movement: things going from Spoke → Qualified → Customer over weeks, not stuck</li>
    <li>"Lost" entries have reasons in the notes — patterns become visible</li>
  </ul>
</div>
` + footer();

// ===========================================================================
// FINAL: doc registry. Order matters — appears in this order in the UI.
// ===========================================================================

return [
  // Sales scripts (one per active category)
  { id:'script-pizza',    cat:'script',     target:'pizza',         title:'Sales Script — Pizza Shops',           summary:'Cold-call pitch for NEPA pizzerias',                  body:SCRIPT_PIZZA },
  { id:'script-nails',    cat:'script',     target:'nail-salons',   title:'Sales Script — Nail Salons',           summary:'Cold-call pitch for PA nail salons',                  body:SCRIPT_NAILS },
  { id:'script-hair',     cat:'script',     target:'hair',          title:'Sales Script — Hair Salons',           summary:'Cold-call pitch for PA hair salons',                  body:SCRIPT_HAIR },
  { id:'script-barber',   cat:'script',     target:'barber',        title:'Sales Script — Barbershops',           summary:'Cold-call pitch for PA barbershops',                  body:SCRIPT_BARBER },
  { id:'script-roofers',  cat:'script',     target:'roofers',       title:'Sales Script — Roofers',               summary:'Cold-call pitch for PA roofing contractors',          body:SCRIPT_ROOFERS },
  { id:'script-hvac',     cat:'script',     target:'hvac',          title:'Sales Script — HVAC Contractors',      summary:'Cold-call pitch for PA HVAC contractors',             body:SCRIPT_HVAC },
  { id:'script-plumbers', cat:'script',     target:'plumbers',      title:'Sales Script — Plumbing Contractors',  summary:'Cold-call pitch for PA plumbing contractors',         body:SCRIPT_PLUMBERS },
  { id:'script-electricians',cat:'script',  target:'electricians',  title:'Sales Script — Electrical Contractors',summary:'Cold-call pitch for PA electrical contractors',       body:SCRIPT_ELECTRICIANS },
  { id:'script-handyman', cat:'script',     target:'handyman',      title:'Sales Script — Handymen',              summary:'Cold-call pitch for PA handyman & repair contractors',body:SCRIPT_HANDYMAN },
  { id:'script-painters', cat:'script',     target:'painters',      title:'Sales Script — Painters',              summary:'Cold-call pitch for PA painting contractors',         body:SCRIPT_PAINTERS },
  { id:'script-decks',    cat:'script',     target:'deck-builders', title:'Sales Script — Deck Builders',         summary:'Cold-call pitch for PA custom deck builders',         body:SCRIPT_DECKS },
  { id:'script-welders',  cat:'script',     target:'welders',       title:'Sales Script — Welding & Metal Fab',   summary:'Cold-call pitch for PA welders & metal fabricators',  body:SCRIPT_WELDERS },
  { id:'script-cnc',      cat:'script',     target:'cnc-shops',     title:'Sales Script — CNC & Precision Shops', summary:'Cold-call pitch for PA CNC & precision machine shops',body:SCRIPT_CNC },
  // Templates that apply to every call
  { id:'voicemail',       cat:'template',   target:'all',         title:'Voicemail Script',                   summary:'Sub-25-second LVM template',                          body:VOICEMAIL },
  { id:'email-followup',  cat:'template',   target:'all',         title:'Email Follow-up Template',           summary:'Send within 30 minutes of an LVM',                    body:EMAIL },
  { id:'text-followup',   cat:'template',   target:'all',         title:'Text Follow-up Template',            summary:'Day 7 of the rhythm',                                 body:TEXT },
  { id:'objections',      cat:'template',   target:'all',         title:'Objection Handling Library',         summary:'12 most common pushbacks and how to navigate them',   body:OBJECTIONS },
  { id:'discovery',       cat:'template',   target:'all',         title:'Discovery Call Framework',           summary:'10-minute Zoom playbook · run after a cold call books',body:DISCOVERY },
  // Compliance — required reading
  { id:'tcpa',            cat:'compliance', target:'all',         title:'TCPA Compliance & DNC Policy',       summary:'Required reading · review quarterly',                 body:TCPA },
  { id:'crm-standards',   cat:'compliance', target:'all',         title:'CRM Data Standards',                 summary:'How to mark statuses · keeps the pipeline trustworthy',body:CRM_STANDARDS }
];

})();
