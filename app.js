/* NEPA-PRO Dialer — App Script */
(async function(){
"use strict";

// Wait for dynamic lead-list bootstrap (manifest-driven) to finish loading
// before initializing UI. This lets us add new categories without code changes.
if (window.__LEAD_BOOT__) {
  try { await window.__LEAD_BOOT__; } catch(e) { /* keep going */ }
}

/* ========== Lead-list categories ========== */
const CATS = [
  {id:'pizza',         name:'Pizza',          icon:'🍕', color:'#FF6B35'},
  {id:'nail-salons',   name:'Nail Salons',    icon:'💅', color:'#FF375F'},
  {id:'hair',          name:'Hair Salons',    icon:'✂️', color:'#BF5AF2'},
  {id:'barber',        name:'Barbershops',    icon:'💈', color:'#FF453A'},
  {id:'lashes',        name:'Lashes & Brows', icon:'👁️', color:'#FF9F0A'},
  {id:'roofers',       name:'Roofers',        icon:'🏠', color:'#FFD60A'},
  {id:'plumbers',      name:'Plumbers',       icon:'🔧', color:'#0A84FF'},
  {id:'hvac',          name:'HVAC',           icon:'❄️', color:'#64D2FF'},
  {id:'electricians',  name:'Electricians',   icon:'⚡', color:'#FFE03A'},
  {id:'handyman',      name:'Handymen',       icon:'🛠️', color:'#34C759'},
  {id:'pet-services',  name:'Pet Services',   icon:'🐾', color:'#5E5CE6'},
  {id:'home-services', name:'Home Services',  icon:'🏡', color:'#30D158'},
  {id:'food-makers',   name:'Food Makers',    icon:'🍴', color:'#FF6482'},
];
const CAT_BY = Object.fromEntries(CATS.map(c=>[c.id,c]));

/* ========== Helpers ========== */
const $  = s=>document.querySelector(s);
const $$ = s=>Array.from(document.querySelectorAll(s));
const uid = ()=> 'c_'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const digits = s => (s||'').replace(/\D/g,'');
const esc = s => String(s||'').replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function fmtPhone(p){
  const d = digits(p);
  if (d.length===10) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  if (d.length===11 && d[0]==='1') return `+1 (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`;
  if (d.length>10) return '+'+d;
  return p||'';
}
function timeAgo(ts){
  const d = (Date.now()-ts)/1000;
  if (d<60) return 'just now';
  if (d<3600) return Math.floor(d/60)+' min ago';
  const today = new Date(); today.setHours(0,0,0,0);
  const t = new Date(ts);
  if (t>=today) return t.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
  const yest = new Date(today); yest.setDate(yest.getDate()-1);
  if (t>=yest) return 'Yesterday';
  if (Date.now()-ts < 7*86400000) return t.toLocaleDateString([], {weekday:'short'});
  return t.toLocaleDateString([], {month:'numeric',day:'numeric',year:'2-digit'});
}
function initials(s){
  if(!s) return '?';
  const w = s.trim().split(/\s+/).filter(Boolean);
  if (w.length===0) return '?';
  if (w.length===1) return w[0][0].toUpperCase();
  return (w[0][0]+w[w.length-1][0]).toUpperCase();
}
function avColor(seed){
  const colors=['#FF453A','#FF9F0A','#FFD60A','#30D158','#64D2FF','#0A84FF','#5E5CE6','#BF5AF2','#FF375F','#34C759'];
  let h=0; for (let i=0;i<(seed||'').length;i++) h=(h*31+seed.charCodeAt(i))>>>0;
  return colors[h%colors.length];
}
function vibrate(ms){ try{ navigator.vibrate && navigator.vibrate(ms||10) }catch(e){} }
function toast(msg, ms){
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.remove('on'), ms||1800);
}

/* ========== State ========== */
const KEY = 'nepaDialerData_v1';
const DEFAULT_CARD = {
  name:'NEPA-PRO',
  title:'Construction & Property Maintenance',
  company:'NEPA-PRO LLC',
  phone:'5706777971',
  email:'service@nepa-pro.com',
  website:'nepa-pro.com',
  address:'Clarks Summit, PA — NEPA Region',
  tagline:'Veteran Owned & Operated'
};
let state = loadState();

function loadState(){
  try{
    const s = JSON.parse(localStorage.getItem(KEY)||'null');
    if (!s) throw 0;
    s.contacts = s.contacts || [];
    s.calls = s.calls || [];
    s.card = Object.assign({}, DEFAULT_CARD, s.card||{});
    s.leadState = s.leadState || {}; // per-lead-key: {status, lastContacted, hidden}
    s.settings = s.settings || {autoLog:true};
    return s;
  }catch(e){
    return {contacts:[], calls:[], card:Object.assign({},DEFAULT_CARD), leadState:{}, settings:{autoLog:true}};
  }
}
function save(){
  try{ localStorage.setItem(KEY, JSON.stringify(state)); }
  catch(e){ toast('Storage error: '+e.message); }
}

/* ========== Tabs ========== */
let activeTab = 'keypad';
function switchTab(t){
  if (t===activeTab) return;
  activeTab = t;
  $$('.page').forEach(p=>p.classList.toggle('on', p.id==='p-'+t));
  $$('.tab').forEach(b=>b.classList.toggle('on', b.dataset.tab===t));
  if (t==='recents')  renderRecents();
  if (t==='contacts') renderContacts();
  if (t==='leads')    renderLeads();
  if (t==='more')     {renderCard(); updateStorageInfo();}
}
$$('.tab').forEach(b=> b.addEventListener('click', ()=>{ vibrate(8); switchTab(b.dataset.tab); }));

/* ========== KEYPAD ========== */
let dialed = '';
const dialedEl = $('#dialed');
const matchEl  = $('#kpMatch');
const callBtn  = $('#callBtn');
const kpBack   = $('#kpBack');
const kpAdd    = $('#kpAdd');

function setDialed(v){
  dialed = v;
  dialedEl.textContent = v ? fmtPhone(v) : '';
  // dynamic font size
  const len = dialedEl.textContent.length;
  let size = 42;
  if (len>16) size = 32;
  if (len>20) size = 26;
  dialedEl.style.fontSize = size+'px';
  callBtn.classList.toggle('dis', !v);
  kpBack.classList.toggle('on', !!v);
  kpAdd.classList.toggle('on', !!v);
  liveMatch();
}

function pressKey(k){
  if (k==='+' && dialed.length>0) return;
  if (dialed.length>=20) return;
  setDialed(dialed + k);
  vibrate(6);
}
function backspace(){
  if (!dialed) return;
  setDialed(dialed.slice(0,-1));
  vibrate(6);
}

// keypad buttons w/ long press
$$('.k').forEach(btn=>{
  let timer=null, longFired=false;
  const press = ()=>{
    btn.classList.add('pr');
    longFired=false;
    if (btn.dataset.long){
      timer = setTimeout(()=>{
        longFired=true;
        pressKey(btn.dataset.long);
        vibrate(20);
      }, 500);
    }
  };
  const rel = ()=>{
    btn.classList.remove('pr');
    if (timer) clearTimeout(timer);
    if (!longFired) pressKey(btn.dataset.k);
  };
  const cancel = ()=>{
    btn.classList.remove('pr');
    if (timer) clearTimeout(timer);
  };
  btn.addEventListener('pointerdown', e=>{e.preventDefault(); press();});
  btn.addEventListener('pointerup', rel);
  btn.addEventListener('pointercancel', cancel);
  btn.addEventListener('pointerleave', cancel);
});
// Backspace - long press to clear
let bkTimer=null, bkLong=false;
kpBack.querySelector('button').addEventListener('pointerdown', e=>{
  e.preventDefault(); bkLong=false;
  bkTimer = setTimeout(()=>{ bkLong=true; setDialed(''); vibrate(20); }, 600);
});
kpBack.querySelector('button').addEventListener('pointerup', ()=>{
  if (bkTimer) clearTimeout(bkTimer);
  if (!bkLong) backspace();
});
kpBack.querySelector('button').addEventListener('pointerleave', ()=>{
  if (bkTimer) clearTimeout(bkTimer);
});

// Keyboard support (desktop)
document.addEventListener('keydown', e=>{
  if (e.target.tagName==='INPUT' || e.target.tagName==='TEXTAREA') return;
  if (activeTab!=='keypad') return;
  if (/^[0-9*#]$/.test(e.key)) { pressKey(e.key); }
  else if (e.key==='Backspace') { backspace(); e.preventDefault(); }
  else if (e.key==='Enter' && dialed) { placeCall(dialed); }
  else if (e.key==='+') { pressKey('+'); }
});

// Live match
function liveMatch(){
  if (!dialed || dialed.length<3){ matchEl.innerHTML=''; return; }
  const d = digits(dialed);
  // Search saved contacts first
  const c = findContactByPhone(d);
  if (c){
    matchEl.innerHTML = `<strong>${esc(fullName(c)||c.company||'')}</strong>${c.company && fullName(c)?' · '+esc(c.company):''}`;
    return;
  }
  // Search lead lists
  for (const cat of CATS){
    const list = (window.LEADS && window.LEADS[cat.id]) || [];
    const m = list.find(l=> l.p && l.p.endsWith(d) || (d.length>=10 && l.p===d));
    if (m){ matchEl.innerHTML = `<strong>${esc(m.n)}</strong> · ${cat.icon} ${esc(cat.name)}`; return; }
  }
  matchEl.innerHTML = '<span class="muted">Add to Contacts</span>';
}

// Call button & Add Number
callBtn.addEventListener('click', ()=>{
  if (!dialed) return;
  placeCall(dialed);
});
kpAdd.addEventListener('click', ()=>{
  openContactEdit({phone: digits(dialed)});
});

function findContactByPhone(d){
  d = digits(d); if (!d) return null;
  return state.contacts.find(c=> digits(c.phone) === d) || null;
}
function fullName(c){ return [c.firstName, c.lastName].filter(Boolean).join(' ').trim(); }

function placeCall(num){
  const d = digits(num);
  if (!d) return;
  const tel = (d.length>=10 && d[0]!=='1' ? '+1' : '+') + d;
  // log
  if (state.settings.autoLog!==false){
    const c = findContactByPhone(d);
    state.calls.unshift({
      id: uid(),
      contactId: c ? c.id : null,
      number: d,
      label: c ? (fullName(c)||c.company) : null,
      type: 'outgoing',
      timestamp: Date.now()
    });
    state.calls = state.calls.slice(0, 500);
    if (c){ c.lastContacted = Date.now(); c.updated = Date.now(); }
    save();
  }
  vibrate(15);
  // open dialer
  window.location.href = 'tel:'+tel;
}

/* ========== RECENTS ========== */
function renderRecents(){
  const list = $('#rcList');
  if (state.calls.length===0){
    list.innerHTML = `<div class="empty">
      <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
      <h3>No Recent Calls</h3><p>Your dial history shows up here.</p></div>`;
    return;
  }
  // Group consecutive calls to same number
  const groups = [];
  for (const c of state.calls){
    const last = groups[groups.length-1];
    if (last && last.number===c.number && (last.timestamp - c.timestamp) < 30*60000){
      last.count++; last.timestamp = Math.max(last.timestamp, c.timestamp);
      last.ids.push(c.id);
    } else {
      groups.push({...c, count:1, ids:[c.id]});
    }
  }
  list.innerHTML = '<div class="list">'+groups.map(g=>{
    const c = g.contactId ? state.contacts.find(x=>x.id===g.contactId) : null;
    const display = c ? (fullName(c)||c.company||fmtPhone(g.number)) : (g.label || fmtPhone(g.number));
    const sub = c && c.company && fullName(c) ? c.company : 'mobile';
    const isMissed = g.type==='missed';
    return `<div class="row" data-call="${g.ids[0]}" data-num="${g.number}">
      <div class="ico" style="background:transparent;color:${isMissed?'var(--red)':'var(--t2)'};margin-right:10px">
        <svg viewBox="0 0 24 24" style="width:22px;height:22px;fill:currentColor">
          ${isMissed
            ? '<path d="M16.59 9L12 13.59 9.83 11.41l-3.59-3.58L4.83 9.24 9 13.41l-1.42 1.42L4.83 12l1.41-1.41 1.42 1.42L9.66 12 4 17.66 5.41 19l5.66-5.66 4.93-4.93z"/>'
            : '<path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"/>'}
        </svg>
      </div>
      <div class="body">
        <span class="t ${isMissed?'miss':''}">${esc(display)}${g.count>1?` <span class="muted">(${g.count})</span>`:''}</span>
        <span class="s">${esc(sub)}</span>
      </div>
      <span class="meta">${timeAgo(g.timestamp)}</span>
      <button class="info" data-info="${g.number}" data-cid="${c?c.id:''}" aria-label="Info">
        <svg viewBox="0 0 24 24"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
      </button>
    </div>`;
  }).join('')+'</div>';
  // wire up
  list.querySelectorAll('.row').forEach(r=>{
    r.addEventListener('click', e=>{
      if (e.target.closest('.info')) return;
      placeCall(r.dataset.num);
    });
  });
  list.querySelectorAll('.info').forEach(b=>{
    b.addEventListener('click', e=>{
      e.stopPropagation();
      const num = b.dataset.info;
      const cid = b.dataset.cid;
      const c = cid ? state.contacts.find(x=>x.id===cid) : null;
      if (c){ openContactView(c); }
      else { openContactEdit({phone:num}); }
    });
  });
}
$('#rcClear').addEventListener('click', ()=>{
  if (state.calls.length===0) return;
  showActionSheet([
    {label:'Clear All Recents', action:()=>{ state.calls=[]; save(); renderRecents(); toast('Recents cleared'); }, destructive:true}
  ]);
});

/* ========== CONTACTS ========== */
let ctSearchTerm = '';
$('#ctSearch').addEventListener('input', e=>{
  ctSearchTerm = e.target.value.trim().toLowerCase();
  $('#ctSb').classList.toggle('on', !!ctSearchTerm);
  renderContacts();
});
$('#ctClr').addEventListener('click', ()=>{ $('#ctSearch').value=''; ctSearchTerm=''; $('#ctSb').classList.remove('on'); renderContacts(); });

function renderContacts(){
  const list = $('#ctList');
  let cs = state.contacts.slice();
  if (ctSearchTerm){
    cs = cs.filter(c=>{
      const s = [fullName(c), c.company, c.phone, c.email, c.notes, c.address].filter(Boolean).join(' ').toLowerCase();
      return s.includes(ctSearchTerm);
    });
  }
  if (cs.length===0){
    list.innerHTML = `<div class="empty">
      <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
      <h3>${ctSearchTerm?'No Results':'No Contacts'}</h3>
      <p>${ctSearchTerm?'Try a different search.':'Tap + to add a contact, or import a CSV.'}</p>
      ${ctSearchTerm?'':'<button class="btn btn-p" onclick="document.getElementById(\'ctAdd\').click()">Add Contact</button>'}
    </div>`;
    return;
  }
  // alphabetical groups
  cs.sort((a,b)=>{
    const an=(fullName(a)||a.company||'').toLowerCase();
    const bn=(fullName(b)||b.company||'').toLowerCase();
    return an.localeCompare(bn);
  });
  const groups = {};
  for (const c of cs){
    const n = (fullName(c)||c.company||'?');
    const l = n[0].toUpperCase().match(/[A-Z]/) ? n[0].toUpperCase() : '#';
    (groups[l] = groups[l] || []).push(c);
  }
  const letters = Object.keys(groups).sort((a,b)=>{
    if (a==='#') return 1; if (b==='#') return -1; return a.localeCompare(b);
  });
  list.innerHTML = letters.map(L=>`
    <div class="sec-l">${L}</div>
    <div class="list">${groups[L].map(c=>{
      const n = fullName(c)||c.company||'?';
      return `<button class="row" data-cid="${c.id}">
        <div class="av" style="background:${avColor(c.id)}">${initials(n)}</div>
        <div class="body">
          <span class="t">${esc(n)}</span>
          ${c.company && fullName(c) ? `<span class="s">${esc(c.company)}</span>` : ''}
        </div>
        ${c.status?`<span class="bdg bdg-${c.status}" style="margin-right:8px">${esc(c.status)}</span>`:''}
        <span class="meta"><svg class="chev" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg></span>
      </button>`;
    }).join('')}</div>
  `).join('');
  list.querySelectorAll('[data-cid]').forEach(r=>{
    r.addEventListener('click', ()=>{
      const c = state.contacts.find(x=>x.id===r.dataset.cid);
      if (c) openContactView(c);
    });
  });
}
$('#ctAdd').addEventListener('click', ()=> openContactEdit({}));

function openContactView(c){
  const n = fullName(c)||c.company||'';
  $('#mTitle').textContent = '';
  $('#mCancel').textContent = 'Done';
  $('#mSave').textContent = 'Edit';
  $('#mSave').style.color = 'var(--link)'; $('#mSave').style.fontWeight = '600';

  const phone = c.phone ? fmtPhone(c.phone) : '';
  $('#mBody').innerHTML = `
    <div class="hero">
      <div class="av lg" style="background:${avColor(c.id)}">${initials(n)}</div>
      <h1>${esc(n||'(No name)')}</h1>
      ${c.title?`<div class="sub">${esc(c.title)}</div>`:''}
      ${c.company && fullName(c) ?`<div class="sub">${esc(c.company)}</div>`:''}
      ${c.status?`<div style="margin-top:8px"><span class="bdg bdg-${c.status}">${esc(c.status)}</span></div>`:''}
    </div>
    <div class="qa">
      <button class="qa-b" ${!c.phone?'disabled':''} onclick="window.__call('${digits(c.phone)}')"><svg viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg><span class="l">Call</span></button>
      <button class="qa-b" ${!c.phone?'disabled':''} onclick="window.location.href='sms:+1${digits(c.phone)}'"><svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg><span class="l">Text</span></button>
      <button class="qa-b" ${!c.email?'disabled':''} onclick="window.location.href='mailto:${esc(c.email)}'"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><span class="l">Email</span></button>
      <button class="qa-b" ${!c.address?'disabled':''} onclick="window.open('https://maps.apple.com/?q='+encodeURIComponent('${esc(c.address)}'))"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg><span class="l">Map</span></button>
    </div>
    <div class="list">
      ${phone ? `<button class="row" onclick="window.__call('${digits(c.phone)}')"><div class="body"><span class="s" style="font-size:13px">phone</span><span class="t" style="color:var(--link)">${esc(phone)}</span></div></button>`:''}
      ${c.email ? `<a class="row" href="mailto:${esc(c.email)}"><div class="body"><span class="s" style="font-size:13px">email</span><span class="t" style="color:var(--link)">${esc(c.email)}</span></div></a>`:''}
      ${c.address ? `<div class="row"><div class="body"><span class="s" style="font-size:13px">address</span><span class="t wrap">${esc(c.address)}</span></div></div>`:''}
      ${c.title ? `<div class="row"><div class="body"><span class="s" style="font-size:13px">title</span><span class="t">${esc(c.title)}</span></div></div>`:''}
      ${c.category ? `<div class="row"><div class="body"><span class="s" style="font-size:13px">category</span><span class="t">${esc(CAT_BY[c.category]?CAT_BY[c.category].name:c.category)}</span></div></div>`:''}
      ${c.source ? `<div class="row"><div class="body"><span class="s" style="font-size:13px">source</span><span class="t">${esc(c.source)}</span></div></div>`:''}
      ${c.notes ? `<div class="row" style="display:block"><span class="s" style="font-size:13px">notes</span><div style="margin-top:4px;white-space:pre-wrap">${esc(c.notes)}</div></div>`:''}
      ${c.lastContacted ? `<div class="row"><div class="body"><span class="s" style="font-size:13px">last contacted</span><span class="t">${new Date(c.lastContacted).toLocaleString()}</span></div></div>`:''}
    </div>
    <button class="btn btn-s" style="width:100%;margin-top:16px" onclick="window.__cycleStatus('${c.id}')">Status: ${esc(c.status||'new')} · tap to change</button>
    <button class="btn" style="width:100%;margin-top:8px;color:var(--red)" onclick="window.__delContact('${c.id}')">Delete Contact</button>
  `;
  $('#mSave').onclick = ()=>{ closeModal(); openContactEdit(c); };
  $('#mCancel').onclick = closeModal;
  showModal();
}

window.__call = placeCall;
window.__delContact = (id)=>{
  showActionSheet([
    {label:'Delete Contact', action:()=>{
      state.contacts = state.contacts.filter(x=>x.id!==id);
      state.calls.forEach(c=>{ if (c.contactId===id) c.contactId=null; });
      save(); closeModal(); renderContacts(); toast('Contact deleted');
    }, destructive:true}
  ]);
};
window.__cycleStatus = (id)=>{
  const order=['new','contacted','qualified','customer','lost'];
  const c = state.contacts.find(x=>x.id===id); if (!c) return;
  const i = order.indexOf(c.status||'new');
  c.status = order[(i+1)%order.length];
  c.updated = Date.now();
  save(); openContactView(c);
  toast('Status: '+c.status);
};

function openContactEdit(c){
  const isNew = !c.id;
  $('#mTitle').textContent = isNew ? 'New Contact' : 'Edit Contact';
  $('#mCancel').textContent = 'Cancel';
  $('#mSave').textContent = 'Save'; $('#mSave').style.color='var(--link)'; $('#mSave').style.fontWeight='600';

  $('#mBody').innerHTML = `
    <div class="form">
      <div class="frow"><label>First name</label><input id="fF" value="${esc(c.firstName||'')}" placeholder="First"></div>
      <div class="frow"><label>Last name</label><input id="fL" value="${esc(c.lastName||'')}" placeholder="Last"></div>
      <div class="frow"><label>Company</label><input id="fC" value="${esc(c.company||'')}" placeholder="Company"></div>
      <div class="frow"><label>Title</label><input id="fT" value="${esc(c.title||'')}" placeholder="Title"></div>
    </div>
    <div class="form">
      <div class="frow"><label>Phone</label><input id="fP" type="tel" inputmode="tel" value="${esc(c.phone||'')}" placeholder="Phone"></div>
      <div class="frow"><label>Email</label><input id="fE" type="email" inputmode="email" value="${esc(c.email||'')}" placeholder="Email"></div>
      <div class="frow"><label>Address</label><input id="fA" value="${esc(c.address||'')}" placeholder="Address"></div>
    </div>
    <div class="form">
      <div class="frow"><label>Status</label>
        <select id="fS">
          ${['new','contacted','qualified','customer','lost'].map(s=>`<option value="${s}" ${(c.status||'new')===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="frow"><label>Category</label>
        <select id="fCat">
          <option value="">(none)</option>
          ${CATS.map(x=>`<option value="${x.id}" ${c.category===x.id?'selected':''}>${x.icon} ${x.name}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form">
      <div class="frow" style="align-items:flex-start;padding-top:11px"><label>Notes</label><textarea id="fN" placeholder="Notes" rows="3">${esc(c.notes||'')}</textarea></div>
    </div>
    ${!isNew?`<button class="btn" style="width:100%;color:var(--red)" id="fDel">Delete Contact</button>`:''}
  `;
  $('#mSave').onclick = ()=>{
    const updated = {
      firstName: $('#fF').value.trim(),
      lastName:  $('#fL').value.trim(),
      company:   $('#fC').value.trim(),
      title:     $('#fT').value.trim(),
      phone:     digits($('#fP').value),
      email:     $('#fE').value.trim(),
      address:   $('#fA').value.trim(),
      status:    $('#fS').value,
      category:  $('#fCat').value,
      notes:     $('#fN').value
    };
    if (!updated.firstName && !updated.lastName && !updated.company){
      toast('Add a name or company'); return;
    }
    if (isNew){
      const newC = Object.assign({id:uid(), source:'manual', created:Date.now(), updated:Date.now()}, updated);
      state.contacts.push(newC); save(); closeModal(); renderContacts(); toast('Contact added');
    } else {
      Object.assign(c, updated, {updated:Date.now()});
      save(); closeModal(); renderContacts(); toast('Saved');
    }
  };
  $('#mCancel').onclick = closeModal;
  if (!isNew){
    const del = $('#fDel');
    if (del) del.onclick = ()=> window.__delContact(c.id);
  }
  showModal();
  setTimeout(()=>{ const f=$('#fF'); if (f) f.focus(); }, 250);
}

/* ========== LEADS ========== */
let ldSeg = 'pipe';
let ldCat = null;        // current category id when drilled in
let ldCityFilter = null; // city chip
let ldCityShowAll = false; // expand-all-cities flag
let ldSearch = '';

function renderLeads(){
  $('#ldHome').style.display = '';
  $('#ldDetail').style.display = 'none';
  $('#ldNavTitle').textContent = 'Leads';
  $('#ldBack').style.display = 'none';
  ldCat = null;

  const seg = $('#ldHome').querySelectorAll('.seg button');
  seg.forEach(b=>{
    b.onclick = ()=>{ ldSeg = b.dataset.seg; renderLeads(); };
    b.classList.toggle('on', b.dataset.seg===ldSeg);
  });
  if (ldSeg==='pipe') renderPipeline();
  else                renderCategories();
}

function renderPipeline(){
  $('#ldPipe').style.display='';
  $('#ldCats').style.display='none';
  const cs = state.contacts;
  const total = cs.length;
  const byStatus = {new:[],contacted:[],qualified:[],customer:[],lost:[]};
  for (const c of cs){ (byStatus[c.status||'new'] = byStatus[c.status||'new']||[]).push(c); }
  const conv = total ? Math.round(100*byStatus.customer.length/total) : 0;
  $('#ldPipe').innerHTML = `
    <div class="stats">
      <div class="st"><div class="l">Total Leads</div><div class="v">${total}</div></div>
      <div class="st"><div class="l">Customers</div><div class="v" style="color:var(--green)">${byStatus.customer.length}</div></div>
      <div class="st"><div class="l">Qualified</div><div class="v" style="color:var(--purple)">${byStatus.qualified.length}</div></div>
      <div class="st"><div class="l">Conversion</div><div class="v" style="color:var(--orange)">${conv}%</div></div>
    </div>
    ${['new','contacted','qualified','customer','lost'].map(s=>{
      const arr = byStatus[s]||[];
      if (arr.length===0) return '';
      return `<div class="gr"><div class="gr-h">${s} (${arr.length})</div>
      <div class="list">${arr.slice(0,20).map(c=>{
        const n=fullName(c)||c.company||'?';
        return `<button class="row" data-cid="${c.id}">
          <div class="av" style="background:${avColor(c.id)};width:32px;height:32px;font-size:12px">${initials(n)}</div>
          <div class="body"><span class="t">${esc(n)}</span>${c.company&&fullName(c)?`<span class="s">${esc(c.company)}</span>`:''}</div>
          ${c.lastContacted?`<span class="meta">${timeAgo(c.lastContacted)}</span>`:''}
        </button>`;
      }).join('')}</div></div>`;
    }).join('')}
    ${total===0 ? `<div class="empty"><svg viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg><h3>No Pipeline Yet</h3><p>Add contacts or import a CSV to start tracking.</p></div>`:''}
  `;
  $('#ldPipe').querySelectorAll('[data-cid]').forEach(r=>{
    r.addEventListener('click',()=>{
      const c = state.contacts.find(x=>x.id===r.dataset.cid);
      if (c) openContactView(c);
    });
  });
}

function leadCount(catId){
  return ((window.LEADS && window.LEADS[catId]) || []).length;
}

function renderCategories(){
  $('#ldPipe').style.display='none';
  $('#ldCats').style.display='';
  $('#ldCats').innerHTML = `
    <div class="cat-g">
      ${CATS.map(c=>{
        const n = leadCount(c.id);
        const empty = n===0;
        return `<button class="cat-c" data-cat="${c.id}" ${empty?'style="opacity:0.5"':''}>
          <div class="ico-w" style="background:${c.color}33">${c.icon}</div>
          <div class="nm">${esc(c.name)}</div>
          <div class="ct">${empty?'No leads — Import CSV':n+' leads'}</div>
        </button>`;
      }).join('')}
    </div>
    <div style="padding:16px;text-align:center"><button class="btn btn-s" id="csvCat">Import CSV to Category</button></div>
  `;
  $$('.cat-c').forEach(b=>{
    b.addEventListener('click',()=>{
      const id = b.dataset.cat;
      if (leadCount(id)===0){
        showActionSheet([
          {label:'Import CSV for '+CAT_BY[id].name, action:()=>{ pendingCat=id; $('#csvIn').click(); }},
          {label:'Open Empty Category', action:()=>{ ldCat=id; ldCityFilter=null; ldCityShowAll=false; ldSearch=''; renderCategoryDetail(); }}
        ]);
      } else {
        ldCat=id; ldCityFilter=null; ldCityShowAll=false; ldSearch=''; renderCategoryDetail();
      }
    });
  });
  const csvCat = $('#csvCat');
  if (csvCat) csvCat.onclick = ()=>{
    showActionSheet(CATS.map(c=>({label:c.icon+' '+c.name, action:()=>{ pendingCat=c.id; $('#csvIn').click(); }})));
  };
}

function renderCategoryDetail(){
  const cat = CAT_BY[ldCat]; if (!cat) return;
  const all = (window.LEADS && window.LEADS[cat.id]) || [];
  const cities = {};
  for (const l of all){ const c=l.c||'(unknown)'; cities[c] = (cities[c]||0)+1; }
  const cityList = Object.keys(cities).sort((a,b)=>cities[b]-cities[a]);

  let leads = all.slice();
  if (ldCityFilter) leads = leads.filter(l=> (l.c||'(unknown)')===ldCityFilter);
  if (ldSearch){
    const q=ldSearch.toLowerCase();
    leads = leads.filter(l=> (l.n||'').toLowerCase().includes(q) || (l.a||'').toLowerCase().includes(q) || (l.p||'').includes(q));
  }
  // hide dismissed
  leads = leads.filter(l=>{
    const k = stateKey(cat.id, l);
    return !(state.leadState[k] && state.leadState[k].hidden);
  });

  $('#ldHome').style.display='none';
  $('#ldDetail').style.display='';
  $('#ldNavTitle').textContent = cat.icon+' '+cat.name;
  $('#ldBack').style.display='';
  $('#ldBack').onclick = ()=>{ ldCat=null; renderLeads(); };

  $('#ldDetail').innerHTML = `
    <h1 class="bt" style="display:flex;align-items:center;gap:10px"><span style="font-size:28px">${cat.icon}</span>${esc(cat.name)} <span style="font-size:15px;color:var(--t2);font-weight:400;margin-left:auto">${leads.length} of ${all.length}</span></h1>
    <div class="sb on" style="margin-bottom:8px">
      <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      <input id="ldQ" placeholder="Search ${esc(cat.name)}" value="${esc(ldSearch)}">
    </div>
    <div class="cs-bar" id="ldChips">
      <button class="chip ${!ldCityFilter?'on':''}" data-city="">All (${all.length})</button>
      ${cityList.slice(0, ldCityShowAll ? cityList.length : 16).map(c=>`<button class="chip ${ldCityFilter===c?'on':''}" data-city="${esc(c)}">${esc(c||'?')} (${cities[c]})</button>`).join('')}
      ${cityList.length>16 && !ldCityShowAll ? `<button class="chip" id="ldChipMore" style="background:transparent;border:1px dashed var(--sep);color:var(--link)">+${cityList.length-16} more cities</button>` : ''}
    </div>
    ${leads.length===0
      ? `<div class="empty"><h3>No Leads</h3><p>${all.length===0?'Import a CSV for '+esc(cat.name)+' to get started.':'No matches for current filter.'}</p>${all.length===0?'<button class="btn btn-p" onclick="document.getElementById(\'csvIn\').click()">Import CSV</button>':''}</div>`
      : '<div class="list" style="margin:0 16px">'+leads.slice(0,300).map(l=>{
          const k = stateKey(cat.id, l);
          const ls = state.leadState[k];
          const status = ls && ls.status;
          const saved = state.contacts.find(c=> digits(c.phone)===l.p);
          return `<div class="row" data-leadkey="${esc(k)}">
            <div class="av" style="background:${cat.color};width:32px;height:32px;font-size:11px">${initials(l.n)}</div>
            <div class="body">
              <span class="t">${esc(l.n)}</span>
              <span class="s">${l.c?esc(l.c)+' · ':''}${l.r?'★'+l.r+(l.v?` (${l.v})`:''):''}</span>
            </div>
            ${saved?'<span class="bdg bdg-customer" style="margin-right:6px">saved</span>':status?`<span class="bdg bdg-${status}" style="margin-right:6px">${esc(status)}</span>`:''}
            <button class="info gn" data-call="${esc(l.p)}" aria-label="Call"><svg viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg></button>
          </div>`;
        }).join('')+'</div>'+(leads.length>300?`<div class="muted center" style="padding:12px 16px">${leads.length-300} more — narrow your search</div>`:'')}
    <div class="divider"></div>
  `;
  $('#ldQ').addEventListener('input', e=>{ ldSearch=e.target.value.trim(); renderCategoryDetail(); });
  $$('#ldDetail .chip').forEach(b=>{
    b.addEventListener('click',()=>{
      if (b.id==='ldChipMore'){ ldCityShowAll = true; renderCategoryDetail(); return; }
      ldCityFilter = b.dataset.city || null; renderCategoryDetail();
    });
  });
  $$('#ldDetail [data-leadkey]').forEach(r=>{
    r.addEventListener('click', e=>{
      if (e.target.closest('[data-call]')) return;
      const k = r.dataset.leadkey;
      const l = (window.LEADS[cat.id]||[]).find(x=> stateKey(cat.id,x)===k);
      if (l) openLeadDetail(cat, l);
    });
  });
  $$('#ldDetail [data-call]').forEach(b=>{
    b.addEventListener('click', e=>{
      e.stopPropagation();
      const p = b.dataset.call;
      if (!p) return;
      const k = b.closest('[data-leadkey]').dataset.leadkey;
      markLeadStatus(cat.id, k, 'contacted');
      placeCall(p);
    });
  });
}

function stateKey(catId, l){ return catId+'|'+(l.p||l.n); }

function markLeadStatus(catId, k, status){
  state.leadState[k] = state.leadState[k] || {};
  state.leadState[k].status = status;
  state.leadState[k].lastContacted = Date.now();
  save();
}

function openLeadDetail(cat, l){
  const k = stateKey(cat.id, l);
  const ls = state.leadState[k] || {};
  const saved = state.contacts.find(c=> digits(c.phone)===l.p);
  $('#mTitle').textContent = '';
  $('#mCancel').textContent = 'Close'; $('#mSave').textContent = '';
  $('#mSave').style.color='transparent'; $('#mSave').style.pointerEvents='none';
  $('#mBody').innerHTML = `
    <div class="hero">
      <div class="av lg" style="background:${cat.color}">${initials(l.n)}</div>
      <h1>${esc(l.n)}</h1>
      <div class="sub">${cat.icon} ${esc(cat.name)}</div>
      ${l.r?`<div class="sub" style="margin-top:4px">★ ${l.r}${l.v?` (${l.v} reviews)`:''}${l.y?` · est. ${esc(l.y)}`:''}</div>`:l.y?`<div class="sub">est. ${esc(l.y)}</div>`:''}
      ${saved?'<div style="margin-top:8px"><span class="bdg bdg-customer">saved as contact</span></div>':ls.status?`<div style="margin-top:8px"><span class="bdg bdg-${ls.status}">${esc(ls.status)}</span></div>`:''}
    </div>
    <div class="qa">
      <button class="qa-b" ${!l.p?'disabled':''} onclick="window.__leadCall('${cat.id}','${esc(k)}','${esc(l.p)}')"><svg viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg><span class="l">Call</span></button>
      <button class="qa-b" ${!l.p?'disabled':''} onclick="window.location.href='sms:+1${esc(l.p)}'"><svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg><span class="l">Text</span></button>
      <button class="qa-b" ${!l.e?'disabled':''} onclick="window.location.href='mailto:${esc(l.e)}'"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><span class="l">Email</span></button>
      <button class="qa-b" ${!l.w?'disabled':''} onclick="window.open('${esc(l.w)}','_blank')"><svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg><span class="l">Web</span></button>
    </div>
    <div class="list">
      ${l.p?`<button class="row" onclick="window.__leadCall('${cat.id}','${esc(k)}','${esc(l.p)}')"><div class="body"><span class="s" style="font-size:13px">phone</span><span class="t" style="color:var(--link)">${fmtPhone(l.p)}</span></div></button>`:''}
      ${l.e?`<a class="row" href="mailto:${esc(l.e)}"><div class="body"><span class="s" style="font-size:13px">email</span><span class="t" style="color:var(--link)">${esc(l.e)}</span></div></a>`:''}
      ${l.w?`<a class="row" href="${esc(l.w)}" target="_blank" rel="noopener"><div class="body"><span class="s" style="font-size:13px">website</span><span class="t" style="color:var(--link);overflow:hidden;text-overflow:ellipsis">${esc(l.w)}</span></div></a>`:''}
      ${l.a?`<button class="row" onclick="window.open('https://maps.apple.com/?q='+encodeURIComponent('${esc(l.a)}'))"><div class="body"><span class="s" style="font-size:13px">address</span><span class="t wrap">${esc(l.a)}</span></div></button>`:''}
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:16px">
      <button class="btn btn-s" onclick="window.__leadStatus('${cat.id}','${esc(k)}','contacted')">Mark Contacted</button>
      <button class="btn btn-s" onclick="window.__leadStatus('${cat.id}','${esc(k)}','qualified')">Mark Qualified</button>
      <button class="btn btn-s" onclick="window.__leadStatus('${cat.id}','${esc(k)}','customer')">Mark Customer</button>
      <button class="btn btn-s" onclick="window.__leadStatus('${cat.id}','${esc(k)}','lost')">Mark Lost</button>
    </div>
    ${saved
      ? `<button class="btn" style="width:100%;margin-top:10px;color:var(--link)" onclick="window.__viewSaved('${saved.id}')">View Saved Contact →</button>`
      : `<button class="btn btn-p" style="width:100%;margin-top:10px" onclick="window.__leadSave('${cat.id}','${esc(k)}')">Save to Contacts</button>`}
    <button class="btn" style="width:100%;margin-top:8px;color:var(--red)" onclick="window.__leadHide('${esc(k)}')">Hide From List</button>
  `;
  $('#mCancel').onclick = closeModal;
  showModal();
}

window.__leadCall = (catId, k, p)=>{
  markLeadStatus(catId, k, 'contacted');
  closeModal();
  placeCall(p);
};
window.__leadStatus = (catId, k, st)=>{
  markLeadStatus(catId, k, st);
  toast('Status: '+st);
  if (ldCat===catId) renderCategoryDetail();
};
window.__leadSave = (catId, k)=>{
  const list = window.LEADS[catId]||[];
  const l = list.find(x=> stateKey(catId,x)===k); if (!l) return;
  const c = {
    id: uid(), source:'leads:'+catId, category:catId, status:'new',
    firstName:'', lastName:'', company:l.n, title:'',
    phone:l.p||'', email:l.e||'', address:l.a||'',
    notes: [l.r?`★ ${l.r}${l.v?` (${l.v} reviews)`:''}`:'', l.w?`Web: ${l.w}`:'', l.y?`Est. ${l.y}`:''].filter(Boolean).join('\n'),
    created:Date.now(), updated:Date.now()
  };
  state.contacts.push(c); save();
  toast('Saved to Contacts');
  closeModal();
  if (ldCat===catId) renderCategoryDetail();
};
window.__leadHide = (k)=>{
  state.leadState[k] = state.leadState[k] || {};
  state.leadState[k].hidden = true;
  save(); toast('Hidden');
  closeModal();
  if (ldCat) renderCategoryDetail();
};
window.__viewSaved = (id)=>{
  closeModal();
  const c = state.contacts.find(x=>x.id===id); if (c) openContactView(c);
};

$('#ldExport').addEventListener('click', ()=>{
  showActionSheet([
    {label:'Export Contacts CSV', action:exportContactsCSV},
    {label:'Export Call Log CSV', action:exportCallLogCSV},
    {label:'Export Pizza Lead List', action:()=>exportLeadCategoryCSV('pizza')}
  ]);
});

/* ========== CSV IMPORT ========== */
let pendingCat = null; // category to fill if set
$('#csvIn').addEventListener('change', e=>{
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = ()=>{ try{ handleCSV(r.result); }catch(err){ toast('CSV error: '+err.message); } };
  r.readAsText(f);
  e.target.value='';
});
$('#ctImport').addEventListener('click', ()=>{ pendingCat=null; $('#csvIn').click(); });
$('#ctImport2').addEventListener('click', ()=>{
  showActionSheet([
    {label:'Import as Contacts', action:()=>{ pendingCat=null; $('#csvIn').click(); }},
    ...CATS.map(c=>({label:'Import as '+c.icon+' '+c.name+' Leads', action:()=>{ pendingCat=c.id; $('#csvIn').click(); }}))
  ]);
});

function parseCSV(text){
  const rows=[];
  let row=[],cell='',q=false;
  for (let i=0;i<text.length;i++){
    const ch=text[i];
    if (q){
      if (ch==='"' && text[i+1]==='"'){ cell+='"'; i++; }
      else if (ch==='"'){ q=false; }
      else cell+=ch;
    } else {
      if (ch==='"') q=true;
      else if (ch===','){ row.push(cell); cell=''; }
      else if (ch==='\n'){ row.push(cell); rows.push(row); row=[]; cell=''; }
      else if (ch==='\r'){ /* skip */ }
      else cell+=ch;
    }
  }
  if (cell.length>0 || row.length>0){ row.push(cell); rows.push(row); }
  return rows;
}

function handleCSV(text){
  const rows = parseCSV(text).filter(r=>r.length>1 || (r.length===1 && r[0].trim()));
  if (rows.length<2){ toast('CSV is empty'); return; }
  const headers = rows[0].map(h=>h.trim().toLowerCase());
  const find = (...names)=>{ for(const n of names){ const i=headers.indexOf(n); if (i>=0) return i; } return -1; };
  const idx = {
    first: find('first','first name','firstname','given name'),
    last:  find('last','last name','lastname','family name','surname'),
    name:  find('name','full name','fullname','contact','business','company name','business name'),
    company: find('company','organization','organisation','business','restaurant','shop'),
    title: find('title','position','job title','role'),
    phone: find('phone','phone number','telephone','tel','mobile','cell','number'),
    email: find('email','e-mail','email address'),
    address: find('address','street','full address','location'),
    website: find('website','web','url','site'),
    rating: find('rating','stars','review rating'),
    reviews: find('reviews','review count','# of reviews','num reviews'),
    notes: find('notes','note','description','memo','comments'),
    status: find('status','stage','pipeline'),
    city: find('city','town'),
    state: find('state','region'),
    zip: find('zip','zipcode','postal','postal code')
  };
  if (pendingCat){
    // Import as lead list (overwrite or append?)
    showActionSheet([
      {label:'Replace existing '+CAT_BY[pendingCat].name+' leads', action:()=>importAsLeads(rows, idx, true)},
      {label:'Append to '+CAT_BY[pendingCat].name+' leads',  action:()=>importAsLeads(rows, idx, false)}
    ]);
  } else {
    importAsContacts(rows, idx);
  }
}

function importAsContacts(rows, idx){
  let added=0, skipped=0;
  for (let i=1;i<rows.length;i++){
    const r=rows[i];
    const get = j=> j>=0 ? (r[j]||'').trim() : '';
    let first=get(idx.first), last=get(idx.last);
    if (!first && !last && idx.name>=0){
      const full = get(idx.name).split(/\s+/);
      first = full[0]||''; last = full.slice(1).join(' ');
    }
    const company = get(idx.company);
    const phone = digits(get(idx.phone));
    const email = get(idx.email);
    if (!first && !last && !company){ skipped++; continue; }
    if (state.contacts.some(c=> (digits(c.phone)===phone && phone) || (c.email && c.email===email && email))){
      skipped++; continue;
    }
    state.contacts.push({
      id:uid(), source:'csv', category:'', status:get(idx.status)||'new',
      firstName:first, lastName:last, company, title:get(idx.title),
      phone, email, address:get(idx.address),
      notes:get(idx.notes), created:Date.now(), updated:Date.now()
    });
    added++;
  }
  save(); renderContacts();
  toast(`Imported ${added} contacts${skipped?` · ${skipped} skipped`:''}`, 2400);
}

function importAsLeads(rows, idx, replace){
  window.LEADS = window.LEADS || {};
  const target = replace ? [] : (window.LEADS[pendingCat] || []).slice();
  const seen = new Set(target.map(l=>l.p||l.n.toLowerCase()));
  let added=0, skipped=0;
  for (let i=1;i<rows.length;i++){
    const r=rows[i];
    const get = j=> j>=0 ? (r[j]||'').trim() : '';
    const name = get(idx.name) || get(idx.company) || [get(idx.first), get(idx.last)].filter(Boolean).join(' ');
    const phone = digits(get(idx.phone));
    if (!name){ skipped++; continue; }
    const key = phone || name.toLowerCase();
    if (seen.has(key)){ skipped++; continue; }
    seen.add(key);
    const addr = get(idx.address);
    let city=get(idx.city), state2=get(idx.state)||'PA', zip=get(idx.zip);
    if (!city && addr){
      const m = addr.match(/,\s*([^,]+),\s*([A-Z]{2})\s*(\d{5})?\s*$/);
      if (m){ city=m[1].trim(); state2=m[2]; zip=m[3]||''; }
    }
    const rating = parseFloat(get(idx.rating))||null;
    const reviews = parseInt(get(idx.reviews))||0;
    target.push({n:name, p:phone, e:get(idx.email), w:get(idx.website),
                 a:addr, c:city, s:state2, z:zip, r:rating, v:reviews, y:''});
    added++;
  }
  window.LEADS[pendingCat] = target;
  toast(`${replace?'Replaced':'Imported'} ${added} into ${CAT_BY[pendingCat].name}${skipped?` · ${skipped} skipped`:''}`, 2400);
  // NOTE: imported leads are in-memory only; persist to localStorage next save
  state.userLeads = state.userLeads || {};
  state.userLeads[pendingCat] = target;
  save();
  pendingCat = null;
  if (activeTab==='leads') renderLeads();
}

// On load, merge userLeads into window.LEADS
if (state.userLeads){
  window.LEADS = window.LEADS || {};
  for (const k in state.userLeads){
    if (k==='pizza' && (window.LEADS.pizza||[]).length>0) continue; // keep embedded pizza unless replaced
    window.LEADS[k] = state.userLeads[k];
  }
  // If user replaced pizza, honor that
  if (state.userLeads.pizza) window.LEADS.pizza = state.userLeads.pizza;
}

function exportContactsCSV(){
  const cs = state.contacts;
  if (cs.length===0){ toast('No contacts to export'); return; }
  const headers = ['First Name','Last Name','Company','Title','Phone','Email','Address','Status','Category','Source','Notes','Last Contacted','Created'];
  const rows = cs.map(c=>[c.firstName||'',c.lastName||'',c.company||'',c.title||'',fmtPhone(c.phone)||'',c.email||'',c.address||'',c.status||'',c.category||'',c.source||'',c.notes||'',c.lastContacted?new Date(c.lastContacted).toISOString():'',c.created?new Date(c.created).toISOString():'']);
  download(toCSV([headers,...rows]), 'nepa-pro-contacts.csv', 'text/csv');
}
function exportCallLogCSV(){
  if (state.calls.length===0){ toast('No calls to export'); return; }
  const headers = ['Timestamp','Number','Name','Type','Contact ID'];
  const rows = state.calls.map(c=>[
    new Date(c.timestamp).toISOString(),
    fmtPhone(c.number),
    c.label || (c.contactId ? (state.contacts.find(x=>x.id===c.contactId)||{}).firstName : '') || '',
    c.type, c.contactId||''
  ]);
  download(toCSV([headers,...rows]), 'nepa-pro-calllog.csv', 'text/csv');
}
function exportLeadCategoryCSV(catId){
  const list = (window.LEADS && window.LEADS[catId]) || [];
  if (list.length===0){ toast('No leads in '+catId); return; }
  const headers = ['Name','Phone','Email','Website','Address','City','State','Zip','Rating','Reviews','Year'];
  const rows = list.map(l=>[l.n,fmtPhone(l.p),l.e,l.w,l.a,l.c,l.s,l.z,l.r||'',l.v||'',l.y||'']);
  download(toCSV([headers,...rows]), 'nepa-pro-leads-'+catId+'.csv', 'text/csv');
}
function toCSV(rows){
  return rows.map(r=>r.map(v=>{
    v = String(v==null?'':v);
    if (v.includes(',')||v.includes('"')||v.includes('\n')) return '"'+v.replace(/"/g,'""')+'"';
    return v;
  }).join(',')).join('\r\n');
}
function download(text, filename, type){
  const blob = new Blob([text], {type:type||'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}
$('#ctExport').addEventListener('click', exportContactsCSV);
$('#logExport').addEventListener('click', exportCallLogCSV);

/* ========== BUSINESS CARD ========== */
function renderCard(){
  const c = state.card;
  $('#cardPv').innerHTML = `
    <div class="bc">
      <div class="bc-top">
        <div class="bc-logo">${esc(c.name)}</div>
        ${c.tagline?`<div class="bc-vet">★ ${esc(c.tagline)}</div>`:''}
      </div>
      <div>
        <div class="bc-name">${fmtPhone(c.phone)}</div>
        <div class="bc-title">${esc(c.title||'')}</div>
        <div class="bc-info">
          ${c.email?`<div class="bc-info-r"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>${esc(c.email)}</div>`:''}
          ${c.website?`<div class="bc-info-r"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>${esc(c.website)}</div>`:''}
          ${c.address?`<div class="bc-info-r"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>${esc(c.address)}</div>`:''}
        </div>
      </div>
    </div>`;
}
$('#cardEdit').addEventListener('click', ()=>{
  const c = state.card;
  $('#mTitle').textContent = 'Edit My Card';
  $('#mCancel').textContent = 'Cancel';
  $('#mSave').textContent = 'Save'; $('#mSave').style.color='var(--link)'; $('#mSave').style.fontWeight='600'; $('#mSave').style.pointerEvents='auto';
  $('#mBody').innerHTML = `
    <div class="form">
      <div class="frow"><label>Name</label><input id="bcN" value="${esc(c.name)}"></div>
      <div class="frow"><label>Title</label><input id="bcT" value="${esc(c.title)}"></div>
      <div class="frow"><label>Company</label><input id="bcC" value="${esc(c.company)}"></div>
      <div class="frow"><label>Phone</label><input id="bcP" type="tel" value="${esc(c.phone)}"></div>
      <div class="frow"><label>Email</label><input id="bcE" type="email" value="${esc(c.email)}"></div>
      <div class="frow"><label>Website</label><input id="bcW" value="${esc(c.website)}"></div>
      <div class="frow"><label>Address</label><input id="bcA" value="${esc(c.address)}"></div>
      <div class="frow"><label>Tagline</label><input id="bcG" value="${esc(c.tagline)}"></div>
    </div>`;
  $('#mSave').onclick = ()=>{
    state.card = {
      name:$('#bcN').value.trim(), title:$('#bcT').value.trim(), company:$('#bcC').value.trim(),
      phone:digits($('#bcP').value), email:$('#bcE').value.trim(), website:$('#bcW').value.trim(),
      address:$('#bcA').value.trim(), tagline:$('#bcG').value.trim()
    };
    save(); closeModal(); renderCard(); toast('Card updated');
  };
  $('#mCancel').onclick = closeModal;
  showModal();
});

$('#shareBtn').addEventListener('click', async ()=>{
  const c = state.card;
  const text = `${c.name} — ${c.title}\n${fmtPhone(c.phone)}\n${c.email}\n${c.website}`;
  const url = location.href;
  if (navigator.share){
    try{ await navigator.share({title:c.name+' Dialer', text, url}); return; }catch(e){}
  }
  try{ await navigator.clipboard.writeText(text+'\n\n'+url); toast('Copied to clipboard'); }
  catch(e){ toast('Share unavailable'); }
});

$('#vcardBtn').addEventListener('click', ()=>{
  const c = state.card;
  const v = ['BEGIN:VCARD','VERSION:3.0',
    `FN:${c.name||''}`, `ORG:${c.company||''}`, `TITLE:${c.title||''}`,
    c.phone?`TEL;TYPE=WORK,VOICE:+1${c.phone}`:'',
    c.email?`EMAIL;TYPE=WORK:${c.email}`:'',
    c.website?`URL:${c.website.startsWith('http')?c.website:'https://'+c.website}`:'',
    c.address?`ADR;TYPE=WORK:;;${c.address}`:'',
    c.tagline?`NOTE:${c.tagline}`:'',
    'END:VCARD'].filter(Boolean).join('\n');
  download(v, 'nepa-pro.vcf', 'text/vcard');
  toast('vCard downloaded');
});

$('#qrBtn').addEventListener('click', ()=>{
  const c = state.card;
  const data = `MECARD:N:${c.name};TEL:${c.phone};EMAIL:${c.email};URL:${c.website};ADR:${c.address};NOTE:${c.tagline};;`;
  $('#mTitle').textContent = 'QR Code'; $('#mCancel').textContent='Close'; $('#mSave').textContent=''; $('#mSave').style.pointerEvents='none';
  $('#mBody').innerHTML = `
    <div class="hero" style="padding-top:0">
      <div id="qrBox" style="background:#fff;padding:24px;border-radius:16px;display:flex;align-items:center;justify-content:center;width:280px;height:280px;margin:0 auto"><div class="muted">Loading…</div></div>
      <h1 style="margin-top:18px;font-size:20px">${esc(c.name)}</h1>
      <div class="sub">${fmtPhone(c.phone)}</div>
      <p class="muted" style="margin-top:12px;font-size:13px">Scan to save contact</p>
    </div>`;
  $('#mCancel').onclick = closeModal;
  showModal();
  // Render QR via online API as PNG fallback (works offline if cached); also try local generation
  setTimeout(()=>{
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(data)}&color=0A2540&bgcolor=ffffff`;
    const img = new Image(); img.style.width='240px'; img.style.height='240px';
    img.onerror = ()=>{ $('#qrBox').innerHTML = '<div class="muted center">QR offline. Use vCard instead.</div>'; };
    img.onload = ()=>{ $('#qrBox').innerHTML=''; $('#qrBox').appendChild(img); };
    img.src = url;
  }, 100);
});

/* Install prompt */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredPrompt = e; });
$('#installBtn').addEventListener('click', async ()=>{
  if (deferredPrompt){
    deferredPrompt.prompt();
    const r = await deferredPrompt.userChoice;
    if (r.outcome==='accepted') toast('Installing…');
    deferredPrompt = null;
  } else {
    showActionSheet([
      {label:'How to Install', action:()=>{
        $('#mTitle').textContent='Install'; $('#mCancel').textContent='Close'; $('#mSave').textContent='';
        $('#mBody').innerHTML = `
          <div style="padding:8px 4px"><h2 style="font-size:18px;margin-bottom:8px">📱 iPhone / iPad</h2>
            <p class="muted" style="font-size:14px;line-height:1.6">1. Tap the Share button (square with arrow up)<br>2. Scroll down and tap "Add to Home Screen"<br>3. Tap "Add"</p>
            <h2 style="font-size:18px;margin:16px 0 8px">🤖 Android Chrome</h2>
            <p class="muted" style="font-size:14px;line-height:1.6">1. Tap the menu (⋮) in the top right<br>2. Tap "Add to Home screen" or "Install app"<br>3. Tap "Install"</p>
            <h2 style="font-size:18px;margin:16px 0 8px">💻 Desktop</h2>
            <p class="muted" style="font-size:14px;line-height:1.6">Look for the install icon in the address bar, or use the browser menu → "Install".</p>
          </div>`;
        $('#mCancel').onclick = closeModal; showModal();
      }}
    ]);
  }
});

$('#resetBtn').addEventListener('click', ()=>{
  showActionSheet([
    {label:'Reset All Data', action:()=>{
      if (confirm('Erase ALL contacts, calls, and settings? This cannot be undone.')){
        localStorage.removeItem(KEY); state = loadState();
        renderContacts(); renderRecents(); renderCard(); updateStorageInfo();
        toast('All data cleared');
      }
    }, destructive:true}
  ]);
});

function updateStorageInfo(){
  try{
    const s = localStorage.getItem(KEY) || '';
    const kb = (s.length/1024).toFixed(1);
    $('#storeInfo').textContent = `${state.contacts.length} contacts · ${state.calls.length} calls · ${kb} KB`;
  }catch(e){ $('#storeInfo').textContent = 'unavailable'; }
}

/* ========== Modal & Action sheet ========== */
function showModal(){ $('#modal').classList.add('on'); }
function closeModal(){ $('#modal').classList.remove('on'); }
$('#modal').addEventListener('click', e=>{ if (e.target.id==='modal') closeModal(); });

function showActionSheet(buttons){
  const c = $('#asBtns');
  c.innerHTML = buttons.map((b,i)=>`<button class="as-b ${b.destructive?'del':''}" data-i="${i}">${esc(b.label)}</button>`).join('');
  c.querySelectorAll('.as-b').forEach(b=>{
    b.onclick = ()=>{
      const i = parseInt(b.dataset.i);
      $('#asheet').classList.remove('on');
      setTimeout(()=>{ try{ buttons[i].action(); }catch(e){ console.error(e); toast('Error: '+e.message); } }, 150);
    };
  });
  $('#asheet').classList.add('on');
}
$('#asCancel').addEventListener('click', ()=> $('#asheet').classList.remove('on'));
$('#asheet').addEventListener('click', e=>{ if (e.target.id==='asheet') $('#asheet').classList.remove('on'); });

/* ========== Init ========== */
setDialed('');
renderCard();
updateStorageInfo();

/* Service worker */
if ('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  });
}

console.log('NEPA-PRO Dialer loaded ·', state.contacts.length, 'contacts ·', leadCount('pizza'), 'pizza leads');
})();
