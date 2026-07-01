
/* ============================================================================
   Jesus Loves You — prayer wall
   Data layer: works instantly with the browser's own storage. To switch the
   wall + candles to SHARED cloud storage on Wix (so every visitor sees the same
   notes), paste your Wix Headless OAuth Client ID into WIX.clientId below and
   follow DEPLOY.md. Empty clientId = local storage (still fully functional).
   ============================================================================ */
const WIX = { clientId: "" /* <-- paste Wix Headless Client ID to enable shared cloud wall */ };

/* ---- Storage abstraction (localStorage default; Wix CMS adapter ready) ---- */
const Local = {
  async getNotes(){ return JSON.parse(localStorage.getItem('jlu_notes')||'null') || SEED_NOTES.slice(); },
  async addNote(n){ const a = await this.getNotes(); a.unshift(n); localStorage.setItem('jlu_notes', JSON.stringify(a)); return n; },
  async getCandles(){ return JSON.parse(localStorage.getItem('jlu_candles')||'null') || SEED_CANDLES.slice(); },
  async addCandle(c){ const a = await this.getCandles(); a.unshift(c); localStorage.setItem('jlu_candles', JSON.stringify(a)); return c; }
};
/* Wix adapter is loaded lazily only if a clientId is present. Falls back to Local on any error. */
async function makeWix(){
  try{
    const { createClient, OAuthStrategy } = await import('https://esm.sh/@wix/sdk');
    const { items } = await import('https://esm.sh/@wix/data');
    const wix = createClient({ modules:{ items }, auth: OAuthStrategy({ clientId: WIX.clientId }) });
    const map = (it)=>it.data || it;
    return {
      async getNotes(){ const r = await wix.items.queryDataItems({dataCollectionId:'Notes'}).descending('_createdDate').find(); return r.items.map(map); },
      async addNote(n){ await wix.items.insertDataItem({dataCollectionId:'Notes', dataItem:{data:n}}); return n; },
      async getCandles(){ const r = await wix.items.queryDataItems({dataCollectionId:'Candles'}).descending('_createdDate').find(); return r.items.map(map); },
      async addCandle(c){ await wix.items.insertDataItem({dataCollectionId:'Candles', dataItem:{data:c}}); return c; }
    };
  }catch(e){ console.warn('Wix unavailable, using local storage:', e); return Local; }
}
let Store = Local;

/* ---- Seed content (shown until real notes arrive) ---- */
const SEED_NOTES = [
  {text:'Thank You, Lord, for another sunrise and a quiet house before the day begins.',author:'Ruth K.',tag:'Gratitude'},
  {text:'Praying for Mom’s surgery on Thursday. Peace over fear, in Jesus’ name.',author:'Dani',tag:'Prayer'},
  {text:'He did it again. The job came through right when we’d run out of options.',author:'Samuel O.',tag:'Praise'},
  {text:'So grateful for this little church family. I never knew I could be this held.',author:'Priya',tag:'Gratitude'},
  {text:'Lord, give me patience with the kids today, and grace with myself.',author:'Beth',tag:'Prayer'},
  {text:'Healed and whole. The scans came back clear. Thank You, Jesus.',author:'Marcus T.',tag:'Praise'},
  {text:'For my neighbor who lives alone — that she would feel seen this week.',author:'Joel',tag:'Prayer'},
  {text:'Found the exact verse I needed the very morning I needed it.',author:'Aimee',tag:'Hope'},
  {text:'Baby girl arrived safe at 3am. Our hearts are overflowing.',author:'The Okafors',tag:'Praise'}
];
const SEED_CANDLES = [
  {name:'Grace', intention:'For everyone who feels alone tonight.'},
  {name:'Thomas', intention:'For my brother’s heart to soften.'},
  {name:'', intention:'For peace in our home.'},
  {name:'Lydia', intention:'Thank you for answered prayer.'}
];

/* ---- KJV verse templates (public domain) ---- */
const VERSES = [
  {ref:'John 3:16', cat:'Love', text:'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.'},
  {ref:'Matthew 11:28', cat:'Peace', text:'Come unto me, all ye that labour and are heavy laden, and I will give you rest.'},
  {ref:'Psalm 23:1', cat:'Strength', text:'The Lord is my shepherd; I shall not want.'},
  {ref:'Philippians 4:13', cat:'Strength', text:'I can do all things through Christ which strengtheneth me.'},
  {ref:'Jeremiah 29:11', cat:'Hope', text:'For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.'},
  {ref:'Romans 8:28', cat:'Hope', text:'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.'},
  {ref:'Proverbs 3:5-6', cat:'Guidance', text:'Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.'},
  {ref:'Isaiah 41:10', cat:'Strength', text:'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee.'},
  {ref:'Psalm 46:10', cat:'Peace', text:'Be still, and know that I am God.'},
  {ref:'Joshua 1:9', cat:'Strength', text:'Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.'},
  {ref:'2 Timothy 1:7', cat:'Strength', text:'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.'},
  {ref:'Philippians 4:6-7', cat:'Peace', text:'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.'},
  {ref:'Isaiah 40:31', cat:'Strength', text:'But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles.'},
  {ref:'Matthew 6:25', cat:'Peace', text:'Therefore I say unto you, Take no thought for your life, what ye shall eat, or what ye shall drink; nor yet for your body, what ye shall put on. Is not the life more than meat, and the body than raiment?'},
  {ref:'Matthew 6:27', cat:'Peace', text:'Which of you by taking thought can add one cubit unto his stature?'},
  {ref:'Matthew 6:33', cat:'Guidance', text:'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.'},
  {ref:'1 Corinthians 13:4', cat:'Love', text:'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up.'},
  {ref:'1 John 4:8', cat:'Love', text:'He that loveth not knoweth not God; for God is love.'},
  {ref:'Romans 5:8', cat:'Love', text:'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.'},
  {ref:'Ephesians 2:8', cat:'Love', text:'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God.'},
  {ref:'Psalm 118:24', cat:'Hope', text:'This is the day which the Lord hath made; we will rejoice and be glad in it.'},
  {ref:'Psalm 119:105', cat:'Guidance', text:'Thy word is a lamp unto my feet, and a light unto my path.'},
  {ref:'Micah 6:8', cat:'Guidance', text:'He hath shewed thee, O man, what is good; and what doth the Lord require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?'},
  {ref:'Galatians 5:22-23', cat:'Love', text:'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance.'}
];

/* ---- palette helpers ---- */
const TAG_BG = {Gratitude:'var(--rose-tint)', Prayer:'var(--sage-tint)', Praise:'var(--cream2)', Hope:'#FBEFD6'};
const HUES = {rose:['var(--rose)','#FFF9F4'], sage:['var(--sage)','#FFF9F4'], paper:['var(--paper)','var(--ink)'], ink:['var(--ink)','#FFF9F4']};

/* ===== HERO illustration (inline) ===== */
document.getElementById('heroArt').innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 640" width="100%" role="img" aria-label="An illustration of Jesus with open arms, surrounded by warm light, a descending dove, and floating hearts, expressing unconditional love.">
  <defs>
    <radialGradient id="glow" cx="50%" cy="38%" r="60%"><stop offset="0%" stop-color="#FBEFC9"/><stop offset="42%" stop-color="#F6E7E4"/><stop offset="100%" stop-color="#FAF4E9"/></radialGradient>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#F7DE9B"/><stop offset="70%" stop-color="#F2CE86"/><stop offset="100%" stop-color="#F2CE86" stop-opacity="0"/></radialGradient>
    <linearGradient id="robe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFFCF6"/><stop offset="100%" stop-color="#F1E7D6"/></linearGradient>
    <linearGradient id="sash" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#C98B89"/><stop offset="100%" stop-color="#B06D6B"/></linearGradient>
    <radialGradient id="hg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FBE3CF"/><stop offset="100%" stop-color="#F2CE86" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="600" height="640" fill="url(#glow)" rx="28"/>
  <g opacity="0.5" fill="#F4D79A"><g transform="translate(300,250)">
    <polygon points="-7,0 7,0 26,-300 -26,-300"/><polygon points="-7,0 7,0 26,300 -26,300"/><polygon points="0,-7 0,7 300,26 300,-26"/><polygon points="0,-7 0,7 -300,26 -300,-26"/>
    <polygon transform="rotate(45)" points="-6,0 6,0 22,-300 -22,-300"/><polygon transform="rotate(45)" points="-6,0 6,0 22,300 -22,300"/><polygon transform="rotate(45)" points="0,-6 0,6 300,22 300,-22"/><polygon transform="rotate(45)" points="0,-6 0,6 -300,22 -300,-22"/>
    <polygon transform="rotate(22.5)" points="-4,0 4,0 16,-290 -16,-290"/><polygon transform="rotate(67.5)" points="-4,0 4,0 16,-290 -16,-290"/><polygon transform="rotate(112.5)" points="-4,0 4,0 16,-290 -16,-290"/><polygon transform="rotate(157.5)" points="-4,0 4,0 16,-290 -16,-290"/>
    <polygon transform="rotate(202.5)" points="-4,0 4,0 16,-290 -16,-290"/><polygon transform="rotate(247.5)" points="-4,0 4,0 16,-290 -16,-290"/><polygon transform="rotate(292.5)" points="-4,0 4,0 16,-290 -16,-290"/><polygon transform="rotate(337.5)" points="-4,0 4,0 16,-290 -16,-290"/>
  </g></g>
  <g transform="translate(300,86)">
    <ellipse cx="0" cy="40" rx="46" ry="46" fill="#FBEFC9" opacity="0.7"/>
    <path d="M0,18 C-12,18 -20,26 -20,38 C-20,30 -36,26 -48,34 C-38,34 -30,42 -22,46 C-18,54 -8,58 0,58 C10,58 20,50 20,40 C28,44 36,42 40,36 C32,38 26,34 24,28 C18,22 9,18 0,18 Z" fill="#FFFFFF" stroke="#EADFCB" stroke-width="1.5"/>
    <circle cx="-12" cy="30" r="2.4" fill="#42382F"/><path d="M16,42 q10,2 18,-4" stroke="#9FAE94" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="30" cy="40" r="2.6" fill="#9FAE94"/><circle cx="35" cy="37" r="2.2" fill="#B5C4A6"/>
  </g>
  <circle cx="300" cy="252" r="92" fill="url(#halo)"/><circle cx="300" cy="252" r="64" fill="none" stroke="#EFC878" stroke-width="3" opacity="0.85"/>
  <g>
    <path d="M300,300 C262,300 232,322 224,360 L196,520 C190,548 210,560 236,560 L364,560 C390,560 410,548 404,520 L376,360 C368,322 338,300 300,300 Z" fill="url(#robe)" stroke="#E7D8C2" stroke-width="2"/>
    <path d="M236,332 C196,344 150,392 120,452 C112,468 128,482 144,474 C190,452 226,410 252,372 Z" fill="url(#robe)" stroke="#E7D8C2" stroke-width="2"/>
    <path d="M364,332 C404,344 450,392 480,452 C488,468 472,482 456,474 C410,452 374,410 348,372 Z" fill="url(#robe)" stroke="#E7D8C2" stroke-width="2"/>
    <ellipse cx="132" cy="466" rx="15" ry="12" fill="#EAC8AE" transform="rotate(-28 132 466)"/><ellipse cx="468" cy="466" rx="15" ry="12" fill="#EAC8AE" transform="rotate(28 468 466)"/>
    <path d="M252,372 q48,28 96,0 l-6,150 q-42,16 -84,0 Z" fill="url(#sash)" opacity="0.92"/>
    <circle cx="300" cy="408" r="40" fill="url(#hg)"/><path d="M300,424 c-16,-12 -28,-22 -28,-34 c0,-9 7,-15 15,-15 c6,0 11,4 13,8 c2,-4 7,-8 13,-8 c8,0 15,6 15,15 c0,12 -12,22 -28,34 Z" fill="#B06D6B"/>
    <rect x="288" y="286" width="24" height="30" rx="10" fill="#EAC8AE"/>
    <path d="M256,250 C256,210 274,188 300,188 C326,188 344,210 344,250 C344,278 332,300 332,300 L268,300 C268,300 256,278 256,250 Z" fill="#7C6F63"/>
    <path d="M300,212 C322,212 336,232 336,258 C336,286 320,304 300,304 C280,304 264,286 264,258 C264,232 278,212 300,212 Z" fill="#F0D2BA"/>
    <path d="M300,206 C278,206 264,224 262,250 C270,238 282,232 300,232 C318,232 330,238 338,250 C336,224 322,206 300,206 Z" fill="#6E6155"/>
    <path d="M262,250 C258,286 268,312 276,322 L284,300 C272,292 266,272 266,252 Z" fill="#6E6155"/><path d="M338,250 C342,286 332,312 324,322 L316,300 C328,292 334,272 334,252 Z" fill="#6E6155"/>
    <path d="M281,258 q7,5 14,0" stroke="#5E5043" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M305,258 q7,5 14,0" stroke="#5E5043" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M289,286 q11,9 22,0" stroke="#B06D6B" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M276,278 C276,300 286,318 300,318 C314,318 324,300 324,278 C320,294 312,302 300,302 C288,302 280,294 276,278 Z" fill="#7C6F63" opacity="0.92"/>
    <path d="M286,280 q14,8 28,0" stroke="#6E6155" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>
  <g fill="#C98B89">
    <path d="M150,250 c-7,-6 -13,-10 -13,-16 c0,-4 3,-7 7,-7 c3,0 5,2 6,4 c1,-2 3,-4 6,-4 c4,0 7,3 7,7 c0,6 -6,10 -13,16 Z" opacity="0.85"/>
    <path d="M452,230 c-6,-5 -11,-9 -11,-14 c0,-3 3,-6 6,-6 c2,0 4,1 5,3 c1,-2 3,-3 5,-3 c3,0 6,3 6,6 c0,5 -5,9 -11,14 Z" opacity="0.7"/>
    <path d="M118,340 c-5,-4 -9,-7 -9,-11 c0,-3 2,-5 5,-5 c2,0 3,1 4,2 c1,-1 2,-2 4,-2 c3,0 5,2 5,5 c0,4 -4,7 -9,11 Z" opacity="0.6"/>
  </g>
  <path d="M0,560 C120,520 220,548 300,548 C380,548 480,520 600,560 L600,640 L0,640 Z" fill="#EDF0E6"/>
  <path d="M0,592 C140,560 240,584 300,584 C360,584 460,560 600,592 L600,640 L0,640 Z" fill="#D9E2CC"/>
</svg>`;

/* ===== draggable stickers ===== */
const STICKERS = [
  {kind:'word',label:'amen',rot:-8,x:'8%',y:'2%',hue:'rose'},
  {kind:'glyph',label:'✝',rot:7,x:'30%',y:'0%',hue:'ink'},
  {kind:'word',label:'grace',rot:5,x:'52%',y:'6%',hue:'sage'},
  {kind:'glyph',label:'♥',rot:-10,x:'70%',y:'30%',hue:'rose'},
  {kind:'word',label:'blessed',rot:-4,x:'6%',y:'78%',hue:'paper'},
  {kind:'glyph',label:'✧',rot:12,x:'34%',y:'84%',hue:'sage'},
  {kind:'word',label:'pray',rot:8,x:'80%',y:'72%',hue:'rose'}
];
(function buildStickers(){
  const layer = document.getElementById('dragLayer');
  STICKERS.forEach((s,i)=>{
    const el = document.createElement('div');
    el.className = 'sticker '+(s.kind==='glyph'?'glyph':'word');
    el.textContent = s.label;
    const [bg,fg] = HUES[s.hue];
    el.style.background = bg; el.style.color = fg;
    el.style.left = s.x; el.style.top = s.y;
    el.style.transform = `rotate(${s.rot}deg)`;
    el.style.pointerEvents = 'auto'; el.style.zIndex = 30+i;
    el.title = 'drag me';
    let drag=null;
    el.addEventListener('pointerdown',e=>{
      e.preventDefault(); el.setPointerCapture(e.pointerId);
      const r = layer.getBoundingClientRect();
      drag = {sx:e.clientX, sy:e.clientY, ox:el.offsetLeft, oy:el.offsetTop, rot:s.rot};
      el.style.cursor='grabbing'; el.style.zIndex=50; el.style.boxShadow='0 14px 26px rgba(66,56,47,0.28)';
    });
    el.addEventListener('pointermove',e=>{
      if(!drag) return;
      const nx = drag.ox + (e.clientX-drag.sx), ny = drag.oy + (e.clientY-drag.sy);
      el.style.left = nx+'px'; el.style.top = ny+'px';
      el.style.transform = `rotate(${drag.rot}deg) scale(1.08)`;
    });
    const end=()=>{ if(!drag) return; drag=null; el.style.cursor='grab'; el.style.boxShadow='0 6px 14px rgba(66,56,47,0.16)'; el.style.transform=`rotate(${s.rot}deg)`; };
    el.addEventListener('pointerup',end); el.addEventListener('pointercancel',end);
    layer.appendChild(el);
  });
})();

/* ===== how it works ===== */
document.getElementById('howGrid').innerHTML = [
  ['01','Write it down','Put pen to paper — a prayer, a thanks, a verse that found you. Your words, in your own hand.'],
  ['02','Light & pin it','Light a candle, then pin your note to the wall — shared with your church family, or kept between you and the Lord.'],
  ['03','Keep it forever','Every note and candle is saved. Look back and see how faithfully your prayers were answered.']
].map((c,i)=>`<div class="card" style="padding:30px 26px;transform:rotate(${[-1,0.8,-0.6][i]}deg);">
    <div style="font-family:'Caveat',cursive;font-size:46px;color:var(--rose);line-height:1;">${c[0]}</div>
    <h3 style="font-size:30px;margin:8px 0 8px;">${c[1]}</h3>
    <p style="margin:0;color:var(--ink-soft);font-size:16px;line-height:1.6;">${c[2]}</p></div>`).join('');

/* ===== verse templates ===== */
const VERSE_CATS = ['All','Love','Peace','Strength','Hope','Guidance'];
let verseFilter='All';
function renderVerseFilters(){
  document.getElementById('verseFilters').innerHTML = VERSE_CATS.map(c=>{
    const on = c===verseFilter;
    return `<button class="vf btn-ghost" data-c="${c}" style="${on?'background:var(--rose-deep);color:#FFF9F4;border-color:var(--rose-deep);':''}">${c}</button>`;
  }).join('');
  document.querySelectorAll('.vf').forEach(b=>b.onclick=()=>{verseFilter=b.dataset.c;renderVerseFilters();renderVerses();});
}
function renderVerses(){
  const list = VERSES.filter(v=>verseFilter==='All'||v.cat===verseFilter);
  document.getElementById('verseGrid').innerHTML = list.map((v,i)=>{
    const rot=[-1.2,0.9,-0.6,1.1,-0.9,0.7][i%6];
    return `<div class="card vcard" data-ref="${v.ref}" style="break-inside:avoid;display:inline-block;width:100%;margin-bottom:20px;padding:22px 20px;cursor:pointer;transform:rotate(${rot}deg);border:1px solid rgba(66,56,47,0.05);transition:transform .15s,box-shadow .15s;">
      <div style="font-family:'Lora',serif;font-style:italic;font-size:17px;line-height:1.6;color:var(--ink);">&ldquo;${v.text}&rdquo;</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;">
        <span style="font-family:'Kalam',cursive;font-size:16px;color:var(--rose-deep);">${v.ref}</span>
        <span style="font-size:13px;color:var(--ink-soft);font-family:'Caveat',cursive;font-size:18px;">start a note &rarr;</span>
      </div></div>`;
  }).join('');
  document.querySelectorAll('.vcard').forEach(c=>{
    c.onmouseenter=()=>c.style.transform='rotate(0deg) translateY(-3px)';
    c.onmouseleave=()=>{renderVerses();};
    c.onclick=()=>{
      const v = VERSES.find(x=>x.ref===c.dataset.ref);
      document.getElementById('noteText').value = `“${v.text}”\n— ${v.ref}\n\n`;
      document.getElementById('noteTag').value = ({Love:'Gratitude',Peace:'Prayer',Strength:'Prayer',Hope:'Hope',Guidance:'Hope'})[v.cat]||'Hope';
      document.getElementById('write').scrollIntoView({behavior:'smooth'});
      setTimeout(()=>{const t=document.getElementById('noteText');t.focus();t.setSelectionRange(t.value.length,t.value.length);},500);
    };
  });
}

/* ===== community wall ===== */
const WALL_TABS = ['All','Gratitude','Prayer','Praise','Hope'];
let wallFilter='All', NOTES=[];
function renderWallFilters(){
  document.getElementById('wallFilters').innerHTML = WALL_TABS.map(t=>{
    const on=t===wallFilter;
    return `<button class="wf btn-ghost" data-t="${t}" style="${on?'background:var(--rose-deep);color:#FFF9F4;border-color:var(--rose-deep);':''}">${t}</button>`;
  }).join('');
  document.querySelectorAll('.wf').forEach(b=>b.onclick=()=>{wallFilter=b.dataset.t;renderWallFilters();renderWall();});
}
function renderWall(){
  const list = NOTES.filter(n=>wallFilter==='All'||n.tag===wallFilter);
  const grid = document.getElementById('wallGrid');
  if(!list.length){ grid.innerHTML = `<p style="font-family:'Kalam',cursive;color:var(--ink-soft);">No notes here yet — be the first to pin one.</p>`; return; }
  grid.innerHTML = list.map((n,i)=>{
    const rot=[-1.4,0.8,-0.6,1.2,-1,0.6,1.4,-0.8,0.5][i%9];
    return `<div style="break-inside:avoid;display:inline-block;width:100%;background:${TAG_BG[n.tag]||'var(--paper)'};border-radius:10px;padding:26px 20px 18px;margin-bottom:22px;box-shadow:0 8px 22px rgba(66,56,47,0.10);transform:rotate(${rot}deg);position:relative;border:1px solid rgba(66,56,47,0.05);">
      <div style="position:absolute;top:-7px;left:50%;transform:translateX(-50%);width:15px;height:15px;border-radius:50%;background:var(--rose-deep);box-shadow:0 3px 5px rgba(66,56,47,0.3),inset 0 -2px 3px rgba(0,0,0,0.2);"></div>
      <p style="margin:0 0 14px;font-family:'Kalam',cursive;font-size:18px;line-height:1.5;color:var(--ink);white-space:pre-wrap;">${esc(n.text)}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Caveat',cursive;font-size:20px;color:var(--ink-soft);">— ${esc(n.author||'A friend')}</span>
        <span style="font-size:11px;letter-spacing:0.6px;text-transform:uppercase;color:var(--rose-deep);font-weight:600;background:var(--paper);padding:3px 9px;border-radius:999px;">${n.tag||'Note'}</span>
      </div></div>`;
  }).join('');
}
async function loadWall(){ NOTES = await Store.getNotes(); renderWall(); }

document.getElementById('noteForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const text=document.getElementById('noteText').value.trim();
  const author=document.getElementById('noteAuthor').value.trim();
  const tag=document.getElementById('noteTag').value;
  const err=document.getElementById('noteErr');
  if(!text){ err.textContent='Write a few words first — even one line is enough.'; return; }
  err.textContent='';
  const note={text,author:author||'A friend',tag,_createdDate:new Date().toISOString()};
  NOTES.unshift(note); renderWall();
  document.getElementById('noteForm').reset();
  document.getElementById('wall').scrollIntoView({behavior:'smooth'});
  try{ await Store.addNote(note); }catch(_){}
});

/* ===== candles ===== */
let CANDLES=[];
function renderCandles(){
  const wall=document.getElementById('candleWall');
  wall.innerHTML = CANDLES.slice(0,60).map(c=>`
    <button class="candle" title="${esc((c.name?c.name+': ':'')+(c.intention||'A prayer'))}">
      <div class="flame" style="animation-delay:${(Math.random()*1.4).toFixed(2)}s"></div>
      <div class="stick"></div>
      <div style="font-family:'Caveat',cursive;font-size:16px;color:var(--ink-soft);max-width:74px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(c.name||'•')}</div>
    </button>`).join('');
  document.getElementById('candleCount').textContent = CANDLES.length+ (CANDLES.length===1?' candle is':' candles are')+' burning right now.';
}
async function loadCandles(){ CANDLES = await Store.getCandles(); renderCandles(); }
const cm=document.getElementById('candleModal');
document.getElementById('openCandle').onclick=()=>cm.classList.add('open');
document.getElementById('closeCandle').onclick=()=>cm.classList.remove('open');
cm.addEventListener('click',e=>{if(e.target===cm)cm.classList.remove('open');});
document.getElementById('candleForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const name=document.getElementById('candleName').value.trim();
  const intention=document.getElementById('candleIntention').value.trim();
  const candle={name,intention,_createdDate:new Date().toISOString()};
  CANDLES.unshift(candle); renderCandles();
  document.getElementById('candleForm').reset(); cm.classList.remove('open');
  document.getElementById('candleWall').scrollIntoView({behavior:'smooth'});
  try{ await Store.addCandle(candle); }catch(_){}
});

/* ===== utils + boot ===== */
function esc(s){return String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
(function reveals(){
  const els=[...document.querySelectorAll('.reveal')];
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}}),{threshold:0.1});
    els.forEach(el=>io.observe(el));
  } else els.forEach(el=>el.classList.add('in'));
  setTimeout(()=>els.forEach(el=>el.classList.add('in')),1600);
})();
(async function boot(){
  if(WIX.clientId){ Store = await makeWix(); }
  renderVerseFilters(); renderVerses(); renderWallFilters();
  await loadWall(); await loadCandles();
})();
