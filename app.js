/* ============================================================
   বোন ব্লাস্ট 💣🐱 — Exploding Kittens (বাংলা সংস্করণ)
   Pass & Play + কম্পিউটার (AI) খেলোয়াড় + সাউন্ড + কাস্টমাইজেশন
   শুধু ব্রাউজারে চলে • কোনো সার্ভার লাগে না
   ============================================================ */

/* ---------- কার্ডের সংজ্ঞা ---------- */
const CARD_DB = {
  exploding: { img:'assets/img_exploding.jpeg', name:'বোন ব্লাস্ট', em:'💣', color:'#c23329', kind:'exploding',
    desc:'টানলেই বিস্ফোরণ! নিষ্ক্রিয়কারী না থাকলে তুমি খেলা থেকে বাদ। এটি হাত থেকে খেলা যায় না।' },
  defuse: { img:'assets/img_defuse.jpeg', name:'নিষ্ক্রিয়কারী', em:'🚿', color:'#0a8f54', kind:'defuse',
    desc:'বোন ব্লাস্ট টানলে এটি নিজে নিজে কাজে লাগে। তখন বিড়ালটি গোপনে ডেকে আবার রাখো। ইচ্ছেমতো খেলা যায় না।' },
  attack: { img:'assets/img_attack.jpeg', name:'আক্রমণ', em:'⚔️', color:'#c23329', kind:'attack',
    desc:'কার্ড না টেনেই তোমার পালা শেষ করো। পরের খেলোয়াড়কে ২ বার পালা খেলতে হবে।' },
  skip: { img:'assets/img_skip.jpeg', name:'এড়িয়ে যাও', em:'⏭️', color:'#2563eb', kind:'skip',
    desc:'কার্ড না টেনেই তোমার এই পালাটি শেষ করো।' },
  favor: { img:'assets/img_favor.jpeg', name:'অনুগ্রহ', em:'🙏', color:'#8e44ad', kind:'favor',
    desc:'একজন খেলোয়াড়কে বাধ্য করো তোমাকে তার পছন্দের একটি কার্ড দিতে।' },
  shuffle: { img:'assets/img_shuffle.jpeg', name:'রদবদল', em:'🔀', color:'#0e9488', kind:'shuffle',
    desc:'পুরো ডেকটি এলোমেলো করে দাও।' },
  future: { img:'assets/img_future.jpeg', name:'ভবিষ্যৎ দেখা', em:'🔮', color:'#d97706', kind:'future',
    desc:'ডেকের উপরের ৩টি কার্ড গোপনে দেখে নাও।' },
  nope: { img:'assets/img_nope.jpeg', name:'না!', em:'🚫', color:'#475569', kind:'nope',
    desc:'অন্য কারো খেলা অ্যাকশন কার্ড বাতিল করো। নিজের পালায় ইচ্ছেমতো খেলা যায় না — শুধু অন্যের কার্ডের জবাবে।' },
  cat_taco:    { img:'assets/img_cat_taco.jpeg', name:'টাকো বিড়াল', em:'🌮', color:'#f39c12', kind:'cat',
    desc:'একই রকম ২টি বিড়াল কার্ড একসাথে খেললে অন্যের একটি কার্ড চুরি করতে পারো।' },
  cat_rainbow: { img:'assets/img_cat_rainbow.jpeg', name:'রংধনু বিড়াল', em:'🌈', color:'#9b59b6', kind:'cat',
    desc:'একই রকম ২টি বিড়াল কার্ড একসাথে খেললে অন্যের একটি কার্ড চুরি করতে পারো।' },
  cat_potato:  { img:'assets/img_cat_potato.jpeg', name:'আলু বিড়াল', em:'🥔', color:'#b7791f', kind:'cat',
    desc:'একই রকম ২টি বিড়াল কার্ড একসাথে খেললে অন্যের একটি কার্ড চুরি করতে পারো।' },
  cat_beard:   { img:'assets/img_cat_beard.jpeg', name:'দাড়িওয়ালা বিড়াল', em:'🧔', color:'#64748b', kind:'cat',
    desc:'একই রকম ২টি বিড়াল কার্ড একসাথে খেললে অন্যের একটি কার্ড চুরি করতে পারো।' },
  cat_melon:   { img:'assets/img_cat_melon.jpeg', name:'তরমুজ বিড়াল', em:'🍉', color:'#e84393', kind:'cat',
    desc:'একই রকম ২টি বিড়াল কার্ড একসাথে খেললে অন্যের একটি কার্ড চুরি করতে পারো।' },
};
const CAT_KEYS = ['cat_taco','cat_rainbow','cat_potato','cat_beard','cat_melon'];

/* ---------- সেটিংস ---------- */
const DEFAULT_COUNTS = { attack:4, skip:4, favor:4, shuffle:4, future:5, nope:5, cat:4, defuse:6 };
const COUNT_FIELDS = [
  {k:'attack', label:'⚔️ আক্রমণ'}, {k:'skip', label:'⏭️ এড়িয়ে যাও'},
  {k:'favor', label:'🙏 অনুগ্রহ'}, {k:'shuffle', label:'🔀 রদবদল'},
  {k:'future', label:'🔮 ভবিষ্যৎ দেখা'}, {k:'nope', label:'🚫 না!'},
  {k:'cat', label:'🐱 প্রতি বিড়াল (×৫)'}, {k:'defuse', label:'🚿 নিষ্ক্রিয়কারী (মোট)'},
];
let SETTINGS = { sound:true, counts:{...DEFAULT_COUNTS} };

/* ---------- গেম অবস্থা ---------- */
let G = null;
let uidCounter = 1;
const uid = () => 'c' + (uidCounter++);

/* ---------- হেল্পার ---------- */
const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise(r=>setTimeout(r,ms));
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
  return arr;
}
function showScreen(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  $('screen-'+name).classList.add('active');
  window.scrollTo(0,0);
}
let toastTimer=null;
function toast(msg){
  const t=$('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2300);
}
function fx(name,...a){ try{ if(window.FX && window.FX[name]) window.FX[name](...a); }catch(e){} }
function pulseDeck(){ const d=$('deck-pile'); if(d){ d.classList.add('pulse'); setTimeout(()=>d.classList.remove('pulse'),360); } }
const BN_DIGITS=['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
const toBn=(n)=>String(n).split('').map(c=>/[0-9]/.test(c)?BN_DIGITS[c]:c).join('');

/* ============================================================
   সাউন্ড ইঞ্জিন (Web Audio — কোনো ফাইল লাগে না)
   ============================================================ */
let AC=null;
function initAudio(){ if(!AC){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } }
function beep(freq, dur, type='sine', vol=0.18, when=0){
  if(!SETTINGS.sound || !AC) return;
  const t=AC.currentTime+when;
  const o=AC.createOscillator(), g=AC.createGain();
  o.type=type; o.frequency.value=freq;
  g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(vol,t+0.01);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t+dur+0.02);
}
function sfx(kind){
  if(!SETTINGS.sound) return;
  initAudio();
  switch(kind){
    case 'tap':   beep(520,0.06,'triangle',0.12); break;
    case 'play':  beep(440,0.08,'square',0.14); beep(660,0.10,'square',0.12,0.06); break;
    case 'draw':  beep(330,0.10,'sine',0.16); break;
    case 'defuse':beep(700,0.08,'sine',0.16); beep(900,0.10,'sine',0.14,0.08); break;
    case 'steal': beep(600,0.06,'sawtooth',0.12); beep(800,0.08,'sawtooth',0.12,0.06); break;
    case 'nope':  beep(220,0.18,'sawtooth',0.18); break;
    case 'explode':
      for(let i=0;i<6;i++) beep(120-i*12, 0.12, 'sawtooth', 0.22, i*0.05);
      break;
    case 'win':
      [523,659,784,1047].forEach((f,i)=>beep(f,0.18,'triangle',0.18,i*0.12));
      break;
  }
}

/* ============================================================
   সেটআপ
   ============================================================ */
const DEFAULT_NAMES = ['খেলোয়াড় ১','খেলোয়াড় ২','খেলোয়াড় ৩','খেলোয়াড় ৪','খেলোয়াড় ৫'];
const AI_NAMES = ['রোবট মিতু','রোবট কবির','রোবট জয়া','রোবট রনি','রোবট তমা'];
let setupCount = 2;
let setupTypes = [false, false, false, false, false]; // false=মানুষ, true=AI

function renderPlayerInputs(){
  const wrap=$('player-inputs'); wrap.innerHTML='';
  for(let i=0;i<setupCount;i++){
    const row=document.createElement('div');
    row.className='player-input-row';
    const isAI=setupTypes[i];
    row.innerHTML=`<div class="pnum">${toBn(i+1)}</div>
      <input type="text" maxlength="16" placeholder="${isAI?AI_NAMES[i]:DEFAULT_NAMES[i]}" data-i="${i}">
      <button class="ptype-btn ${isAI?'ai':''}" data-i="${i}">${isAI?'🤖 কম্পিউটার':'🧑 মানুষ'}</button>`;
    wrap.appendChild(row);
  }
  wrap.querySelectorAll('.ptype-btn').forEach(b=>{
    b.onclick=()=>{ const i=+b.dataset.i; setupTypes[i]=!setupTypes[i]; renderPlayerInputs(); };
  });
  $('btn-add-player').disabled = setupCount>=5;
  $('btn-remove-player').disabled = setupCount<=2;
}

function renderCountGrid(){
  const grid=$('count-grid'); grid.innerHTML='';
  COUNT_FIELDS.forEach(f=>{
    const item=document.createElement('div');
    item.className='count-item';
    item.innerHTML=`<label>${f.label}</label>
      <input type="number" min="0" max="20" data-k="${f.k}" value="${SETTINGS.counts[f.k]}">`;
    grid.appendChild(item);
  });
  grid.querySelectorAll('input').forEach(inp=>{
    inp.onchange=()=>{
      let v=parseInt(inp.value,10);
      if(isNaN(v)||v<0) v=0; if(v>20) v=20;
      inp.value=v; SETTINGS.counts[inp.dataset.k]=v;
    };
  });
}

/* ---------- ডেক তৈরি ---------- */
const makeCard=(key)=>({ id:uid(), key, ...CARD_DB[key] });
function buildBaseDeck(){
  const deck=[]; const c=SETTINGS.counts;
  ['attack','skip','favor','shuffle','future','nope'].forEach(k=>{
    for(let i=0;i<(c[k]||0);i++) deck.push(makeCard(k));
  });
  CAT_KEYS.forEach(k=>{ for(let i=0;i<(c.cat||0);i++) deck.push(makeCard(k)); });
  return shuffle(deck);
}

function startGame(names, types){
  const players = names.map((nm,i)=>({ name:nm||(types[i]?AI_NAMES[i]:DEFAULT_NAMES[i]), hand:[], alive:true, isAI:!!types[i] }));
  const base = buildBaseDeck();

  // যথেষ্ট কার্ড আছে কি না যাচাই
  if(base.length < players.length*7){
    toast('কার্ড সংখ্যা খুব কম! সেটিংসে বাড়াও বা ডিফল্টে ফিরে যাও।');
    return false;
  }

  const deck=[...base];
  players.forEach(p=>{
    for(let i=0;i<7;i++) p.hand.push(deck.pop());
    p.hand.push(makeCard('defuse'));
  });
  const remainingনিষ্ক্রিয়কারী = Math.max(0, (SETTINGS.counts.defuse||0) - players.length);
  for(let i=0;i<remainingনিষ্ক্রিয়কারী;i++) deck.push(makeCard('defuse'));
  for(let i=0;i<players.length-1;i++) deck.push(makeCard('exploding'));
  shuffle(deck);

  G = { players, deck, discard:[], current:0, turnsRemaining:1, busy:false };
  goToPass();
  return true;
}

/* ============================================================
   পালা ব্যবস্থাপনা
   ============================================================ */
const curP=()=>G.players[G.current];
const aliveCount=()=>G.players.filter(p=>p.alive).length;
function nextAlive(from){
  let i=from;
  for(let k=0;k<G.players.length;k++){ i=(i+1)%G.players.length; if(G.players[i].alive) return i; }
  return from;
}
function aliveOpponents(){ return G.players.filter((p,i)=>i!==G.current && p.alive); }
function aliveOpponentsWithCards(){ return aliveOpponents().filter(p=>p.hand.length>0); }

function goToPass(){
  if(aliveCount()<=1){ return endGame(); }
  if(curP().isAI){ runAITurn(); return; }
  $('pass-player-name').textContent = curP().name;
  $('pass-sub').textContent = G.turnsRemaining>1
    ? `তোমার পালা! তোমাকে এখন ${toBn(G.turnsRemaining)} বার পালা খেলতে হবে।`
    : 'তোমার পালা! অন্যরা যেন তোমার হাত না দেখে।';
  showScreen('pass');
}
function beginTurn(){ showScreen('game'); renderGame(); }

function endTurnNoDraw(){
  G.turnsRemaining--;
  if(G.turnsRemaining>0) goToPass(); else advancePlayer(1);
}
function advancePlayer(nextTurns){ G.current=nextAlive(G.current); G.turnsRemaining=nextTurns; goToPass(); }
function finishOneTurn(){
  G.turnsRemaining--;
  if(G.turnsRemaining>0) goToPass(); else advancePlayer(1);
}

/* ============================================================
   কার্ড টানা / বিস্ফোরণ
   ============================================================ */
function drawCard(){
  if(G.busy) return;
  pulseDeck();
  const card=G.deck.pop();
  if(!card){ finishOneTurn(); return; }
  if(card.kind==='exploding'){ handleExploding(card); }
  else {
    curP().hand.push(card); sfx('draw');
    if(!curP().isAI){ toast(`তুমি টানলে: ${card.em} ${card.name}`); renderGame(); }
    finishOneTurn();
  }
}

function handleExploding(card){
  const p=curP();
  const defuseIdx=p.hand.findIndex(c=>c.kind==='defuse');

  if(p.isAI){
    if(defuseIdx>=0){
      const d=p.hand.splice(defuseIdx,1)[0]; G.discard.push(d); G.discard.push(card);
      const pos=Math.random()<0.5 ? G.deck.length : Math.floor(Math.random()*(G.deck.length+1));
      G.deck.splice(pos,0,card); sfx('defuse'); fx('sparkle',null,null,'#27d17f');
      toast(`${p.name} 🚿 নিষ্ক্রিয়কারী ব্যবহার করল!`);
      finishOneTurn();
    } else {
      explodePlayer(p,card);
    }
    return;
  }

  if(defuseIdx>=0){
    sfx('draw');
    openModal({
      title:'💣 বোন ব্লাস্ট!',
      bodyHTML:`<p><b>${p.name}</b>, তুমি একটি <b>বোন ব্লাস্ট</b> টেনেছ!</p>
                <p>তোমার কাছে <b>🚿 নিষ্ক্রিয়কারী</b> আছে — এটি দিয়ে রক্ষা পাও।</p>`,
      actions:[{ label:'🚿 নিষ্ক্রিয়কারী ব্যবহার করো', cls:'btn-primary', onClick:()=>{
        const d=p.hand.splice(defuseIdx,1)[0]; G.discard.push(d); G.discard.push(card);
        sfx('defuse'); fx('sparkle',null,null,'#27d17f'); closeModal(); chooseInsertPosition(card);
      }}],
      noClose:true
    });
  } else {
    openModal({
      title:'💥 বুম!',
      bodyHTML:`<p><b>${p.name}</b>-এর কাছে নিষ্ক্রিয়কারী নেই!</p>`,
      actions:[{ label:'💥 ভাগ্য পরীক্ষা করো', cls:'btn-danger', onClick:()=>{ closeModal(); explodePlayer(p,card); }}],
      noClose:true
    });
  }
}

function explodePlayer(p,card){
  sfx('explode'); fx('explosion');
  G.discard.push(card);
  p.alive=false;
  G.discard.push(...p.hand); p.hand=[];
  const finish=()=>{ if(aliveCount()<=1) endGame(); else advancePlayer(1); };
  if(p.isAI){ toast(`💥 ${p.name} বিস্ফোরিত হয়ে বাদ পড়ল!`); setTimeout(finish, 1200); }
  else {
    openModal({ title:'💥 বুম!', bodyHTML:`<p><b>${p.name}</b> বিস্ফোরিত হয়ে খেলা থেকে বাদ! 💀</p>`,
      actions:[{label:'ঠিক আছে', cls:'btn-danger', onClick:()=>{ closeModal(); finish(); }}], noClose:true });
  }
}

function chooseInsertPosition(card){
  const n=G.deck.length;
  let html=`<p>এখন <b>💣 বোন ব্লাস্ট</b>টি গোপনে ডেকের কোথায় রাখবে বেছে নাও।
    ডেকে এখন ${toBn(n)}টি কার্ড আছে। উপরে রাখলে পরের জন সাথে সাথে টানবে!</p><div class="deck-insert">`;
  html+=`<button class="choice-btn" data-pos="${n}">⬆️ একদম উপরে (পরের জন এখনই টানবে)</button>`;
  if(n>=2) html+=`<button class="choice-btn" data-pos="${n-1}">উপর থেকে ২য় স্থানে</button>`;
  if(n>=4) html+=`<button class="choice-btn" data-pos="${Math.floor(n/2)}">ঠিক মাঝখানে</button>`;
  html+=`<button class="choice-btn" data-pos="0">⬇️ একদম নিচে</button>`;
  html+=`<button class="choice-btn" data-pos="random">🎲 এলোমেলো যেকোনো জায়গায়</button></div>`;
  openModal({ title:'🚿 কোথায় লুকাবে?', bodyHTML:html, actions:[], noClose:true,
    afterRender:(box)=>{
      box.querySelectorAll('.choice-btn').forEach(btn=>{
        btn.onclick=()=>{
          let pos=btn.dataset.pos;
          pos = pos==='random' ? Math.floor(Math.random()*(G.deck.length+1)) : parseInt(pos,10);
          G.deck.splice(pos,0,card); closeModal();
          toast('বোন ব্লাস্ট ডেকে লুকানো হলো 🤫'); finishOneTurn();
        };
      });
    }
  });
}

/* ============================================================
   কার্ড অ্যাকশন মেনু (মানুষের জন্য — পরিষ্কার ও সহজ)
   ============================================================ */
function onCardTap(cardId){
  if(G.busy || curP().isAI) return;
  const card=curP().hand.find(c=>c.id===cardId);
  if(!card) return;
  sfx('tap');
  openCardSheet(card);
}

function openCardSheet(card){
  const sameCats = card.kind==='cat' ? curP().hand.filter(c=>c.key===card.key) : [];
  const actions=[];

  if(['attack','skip','favor','shuffle','future'].includes(card.kind)){
    actions.push({ label:`▶️ এই কার্ডটি খেলো`, cls:'btn-gold', onClick:()=>{ closeModal(); humanPlayAction(card); }});
  } else if(card.kind==='cat'){
    if(sameCats.length>=2){
      actions.push({ label:`🐱 জোড়া দিয়ে কার্ড চুরি করো`, cls:'btn-gold',
        onClick:()=>{ closeModal(); humanPlayCatPair(card.key); }});
    }
  }
  actions.push({ label:'✖️ বন্ধ করো', cls:'btn-ghost', onClick:closeModal });

  let extra='';
  if(card.kind==='cat' && sameCats.length<2)
    extra=`<p class="sheet-desc" style="color:var(--gold)">⚠️ চুরি করতে এই রকম আরও একটি বিড়াল দরকার (তোমার আছে ${toBn(sameCats.length)}টি)।</p>`;
  if(card.kind==='defuse') extra=`<p class="sheet-desc" style="color:var(--gold)">⚠️ এটি শুধু বিস্ফোরণের সময় নিজে কাজে লাগে।</p>`;
  if(card.kind==='nope') extra=`<p class="sheet-desc" style="color:var(--gold)">⚠️ এটি শুধু অন্য কেউ অ্যাকশন কার্ড খেললে তখন ব্যবহার হবে।</p>`;

  openModal({
    title:'🎴 কার্ড',
    bodyHTML:`<div class="sheet-card" style="background-image:url('${card.img}'); background-size:cover; background-position:center;">
        <div class="gc-nm-top">${card.name}</div></div>
      <p class="sheet-desc">${card.desc}</p>${extra}`,
    actions
  });
}

/* অ্যাকশন কার্ড খেলা (মানুষ) */
function humanPlayAction(card){
  removeFromHand(curP(), card.id);
  G.discard.push(card); sfx('play'); renderGame();
  offerNope(card, ()=>resolveAction(card), curP());
}
function humanPlayCatPair(key){
  const two=curP().hand.filter(c=>c.key===key).slice(0,2);
  two.forEach(c=>{ removeFromHand(curP(), c.id); G.discard.push(c); });
  sfx('play'); renderGame();
  offerNope(two[0], ()=>catStealFlow(curP()), curP());
}

function resolveAction(card){
  switch(card.kind){
    case 'attack':
      toast('⚔️ আক্রমণ! পরের জন বেশি পালা খেলবে।');
      advancePlayer(2 + (G.turnsRemaining - 1)); break;
    case 'skip':
      toast('⏭️ পালা এড়ানো হলো।'); endTurnNoDraw(); break;
    case 'shuffle':
      shuffle(G.deck); toast('🔀 ডেক এলোমেলো করা হলো।'); renderGame(); break;
    case 'future':
      if(curP().isAI){ renderGame(); } else showFuture(); break;
    case 'favor':
      if(curP().isAI) aiDoঅনুগ্রহ(); else startঅনুগ্রহ(); break;
  }
}

function removeFromHand(p,id){ const i=p.hand.findIndex(c=>c.id===id); if(i>=0) p.hand.splice(i,1); }

/* ভবিষ্যৎ দেখা */
function showFuture(){
  const n=G.deck.length;
  const top=G.deck.slice(Math.max(0,n-3)).reverse();
  let html='<p>ডেকের উপরের কার্ডগুলো (উপর থেকে নিচে):</p><div class="future-row">';
  const labels=['১ম (পরবর্তী)','২য়','৩য়'];
  if(top.length===0) html+='<p class="muted">ডেক খালি!</p>';
  top.forEach((c,i)=>{
    html+=`<div class="future-slot"><div class="lbl">${labels[i]}</div>
      <div class="future-card" style="background-image:url(\'${c.img}\'); background-size:cover; background-position:center;"><div class="gc-nm-top">${c.name}</div>
      <div style="font-size:.66rem;font-weight:700;padding:0 3px">${c.name}</div></div></div>`;
  });
  html+='</div>';
  openModal({ title:'🔮 ভবিষ্যৎ দেখা', bodyHTML:html,
    actions:[{label:'বন্ধ করো',cls:'btn-primary',onClick:closeModal}] });
}

/* জোড়া বিড়াল — চুরি (মানুষ লক্ষ্য বাছে; কার্ড এলোমেলো) */
function catStealFlow(actor){
  const targets=aliveOpponentsWithCards();
  if(targets.length===0){ toast('চুরি করার মতো কেউ নেই।'); return; }
  if(actor.isAI){ doSteal(actor, targets[Math.floor(Math.random()*targets.length)]); return; }
  openModal({ title:'🐱 জোড়া বিড়াল — চুরি!',
    bodyHTML:'<p>কার কাছ থেকে চুরি করবে? (এলোমেলোভাবে একটি কার্ড পাবে)</p>', actions:[], noClose:true,
    afterRender:(box)=>{
      const act=box.querySelector('.modal-actions');
      targets.forEach(t=>{
        const b=document.createElement('button'); b.className='choice-btn';
        b.textContent=`${t.name} (${toBn(t.hand.length)}টি কার্ড)`;
        b.onclick=()=>{ closeModal(); doSteal(actor,t); };
        act.appendChild(b);
      });
    }
  });
}
function doSteal(actor, victim){
  if(victim.hand.length===0){ toast('ওই খেলোয়াড়ের হাতে কার্ড নেই।'); return; }
  const idx=Math.floor(Math.random()*victim.hand.length);
  const stolen=victim.hand.splice(idx,1)[0];
  actor.hand.push(stolen); sfx('steal'); fx('sparkle',null,null,'#f4b740');
  toast(`${victim.name}-এর কাছ থেকে একটি কার্ড চুরি হলো!`);
  renderGame();
}

/* অনুগ্রহ */
function startঅনুগ্রহ(){
  const targets=aliveOpponentsWithCards();
  if(targets.length===0){ toast('অনুগ্রহ করার মতো কেউ নেই।'); return; }
  openModal({ title:'🙏 অনুগ্রহ',
    bodyHTML:'<p>কার কাছে অনুগ্রহ চাইবে? সে তোমাকে একটি কার্ড দেবে।</p>', actions:[], noClose:true,
    afterRender:(box)=>{
      const act=box.querySelector('.modal-actions');
      targets.forEach(t=>{
        const b=document.createElement('button'); b.className='choice-btn';
        b.textContent=`${t.name} (${toBn(t.hand.length)}টি কার্ড)`;
        b.onclick=()=>{ closeModal(); favorResolve(G.players.indexOf(t)); };
        act.appendChild(b);
      });
    }
  });
}
function favorResolve(targetIdx){
  const giver=G.players[targetIdx], asker=curP();
  if(giver.isAI){
    // AI পছন্দের কার্ড দেয়: নিষ্ক্রিয়কারী বাদে যেকোনো, না থাকলে যেকোনো
    let pool=giver.hand.filter(c=>c.kind!=='defuse');
    if(pool.length===0) pool=giver.hand;
    const give=pool[Math.floor(Math.random()*pool.length)];
    removeFromHand(giver, give.id); asker.hand.push(give); sfx('steal');
    toast(`${giver.name} তোমাকে দিল: ${give.em} ${give.name}`); renderGame(); return;
  }
  // মানুষ → ডিভাইস পাস করে কার্ড বাছে
  openModal({ title:'📱➡️ ডিভাইস পাস করো',
    bodyHTML:`<p><b>${asker.name}</b> অনুগ্রহ চেয়েছে।</p><p>ডিভাইসটি <b>${giver.name}</b>-কে দাও।</p>`,
    actions:[{label:`👀 আমি ${giver.name}`,cls:'btn-primary',onClick:()=>{ closeModal(); favorChoose(targetIdx); }}], noClose:true });
}
function favorChoose(targetIdx){
  const giver=G.players[targetIdx], asker=curP();
  let html=`<p><b>${giver.name}</b>, ${asker.name}-কে দেওয়ার জন্য একটি কার্ড বেছে নাও:</p><div class="pick-grid">`;
  giver.hand.forEach(c=>{ html+=`<div class="game-card" data-id="${c.id}" style="background:${c.color}">
      <div class="gc-nm-top">${c.name}</div></div>`; });
  html+='</div>';
  openModal({ title:'🎴 কার্ড বেছে দাও', bodyHTML:html, actions:[], noClose:true,
    afterRender:(box)=>{
      box.querySelectorAll('.game-card').forEach(el=>{
        el.onclick=()=>{
          const id=el.dataset.id;
          const i=giver.hand.findIndex(c=>c.id===id);
          const given=giver.hand.splice(i,1)[0]; asker.hand.push(given); sfx('steal'); closeModal();
          openModal({ title:'📱⬅️ ফেরত দাও', bodyHTML:`<p>ডিভাইসটি আবার <b>${asker.name}</b>-কে দাও।</p>`,
            actions:[{label:`👀 আমি ${asker.name}`,cls:'btn-primary',onClick:()=>{ closeModal();
              toast(`${giver.name} তোমাকে দিল: ${given.em} ${given.name}`); renderGame(); }}], noClose:true });
        };
      });
    }
  });
}

/* ============================================================
   "না!" (না!) — শুধু মানুষ খেলোয়াড়রা ব্যবহার করে
   ============================================================ */
function humanNopeHolders(exclude){
  return G.players.filter(p=>p.alive && p!==exclude && !p.isAI && p.hand.some(c=>c.kind==='nope'));
}
function offerNope(playedCard, onResolve, actor){
  const holders=humanNopeHolders(actor);
  if(holders.length===0){ onResolve(); return; }
  openModal({ title:'🚫 কেউ কি "না!" খেলবে?',
    bodyHTML:`<p><b>${actor.name}</b> খেলেছে: <b>${playedCard.em} ${playedCard.name}</b></p>
      <p>যার কাছে <b>🚫 না!</b> আছে সে এটি বাতিল করতে পারে।</p>`, actions:[], noClose:true,
    afterRender:(box)=>{
      const act=box.querySelector('.modal-actions');
      holders.forEach(p=>{
        const b=document.createElement('button'); b.className='choice-btn';
        b.textContent=`🚫 ${p.name} "না!" খেলবে`;
        b.onclick=()=>{
          const i=p.hand.findIndex(c=>c.kind==='nope'); const nc=p.hand.splice(i,1)[0];
          G.discard.push(nc); sfx('nope'); closeModal(); renderGame();
          toast(`${p.name} "না!" খেলল 🚫`); offerNopeChain(onResolve, p, 1);
        };
        act.appendChild(b);
      });
      const skip=document.createElement('button'); skip.className='btn btn-primary btn-block';
      skip.textContent='কেউ "না!" খেলবে না — চালিয়ে যাও';
      skip.onclick=()=>{ closeModal(); onResolve(); };
      act.appendChild(skip);
    }
  });
}
function offerNopeChain(onResolve, lastActor, depth){
  const holders=humanNopeHolders(lastActor);
  const cancelled = depth%2===1; // বিজোড় = বর্তমানে বাতিল অবস্থায়
  const settle=()=>{ if(cancelled){ toast('কার্ডটি বাতিল হয়ে গেল! ❌'); } else onResolve(); };
  if(holders.length===0){ settle(); return; }
  openModal({ title:'🚫 আরেকটি "না!" ?',
    bodyHTML:`<p>এখন কার্ডটি ${cancelled?'<b>বাতিল</b>':'<b>সক্রিয়</b>'} অবস্থায় আছে। কেউ চাইলে উল্টে দিতে পারে।</p>`,
    actions:[], noClose:true,
    afterRender:(box)=>{
      const act=box.querySelector('.modal-actions');
      holders.forEach(p=>{
        const b=document.createElement('button'); b.className='choice-btn';
        b.textContent=`🚫 ${p.name} আবার "না!" খেলবে`;
        b.onclick=()=>{
          const i=p.hand.findIndex(c=>c.kind==='nope'); const nc=p.hand.splice(i,1)[0];
          G.discard.push(nc); sfx('nope'); closeModal(); renderGame();
          toast(`${p.name} আবার "না!" খেলল 🚫`); offerNopeChain(onResolve, p, depth+1);
        };
        act.appendChild(b);
      });
      const skip=document.createElement('button'); skip.className='btn btn-primary btn-block';
      skip.textContent='থামো — যা আছে তাই হবে';
      skip.onclick=()=>{ closeModal(); settle(); };
      act.appendChild(skip);
    }
  });
}

/* ============================================================
   কম্পিউটার (AI) খেলোয়াড়
   ============================================================ */
function findCatPairKey(hand){
  for(const k of CAT_KEYS){ if(hand.filter(c=>c.key===k).length>=2) return k; }
  return null;
}
function runAITurn(){
  G.busy=true;
  showScreen('game'); renderGame();
  setTimeout(aiStep, 1000);
}
function aiStep(){
  if(!G || !curP().isAI || !curP().alive){ G.busy=false; return; }
  const p=curP();
  const hasনিষ্ক্রিয়কারী=p.hand.some(c=>c.kind==='defuse');
  const deckBig=G.deck.length;
  // ঝুঁকি: ডেক ছোট হলে বিস্ফোরণের সম্ভাবনা বেশি
  const risky = deckBig>0 && (1/deckBig) > 0.16; // আনুমানিক
  const skipCard=p.hand.find(c=>c.kind==='skip');
  const attackCard=p.hand.find(c=>c.kind==='attack');

  // ১) আক্রান্ত হলে — skip/attack দিয়ে চাপ কমাও
  if(G.turnsRemaining>1){
    if(attackCard && Math.random()<0.6){ return aiPlay(attackCard); }
    if(skipCard && Math.random()<0.7){ return aiPlay(skipCard); }
  }
  // ২) ঝুঁকিপূর্ণ ও নিষ্ক্রিয়কারী নেই — পালানোর চেষ্টা
  if(risky && !hasনিষ্ক্রিয়কারী){
    if(attackCard && Math.random()<0.6){ return aiPlay(attackCard); }
    if(skipCard && Math.random()<0.6){ return aiPlay(skipCard); }
  }
  // ৩) মাঝে মাঝে এমনিতেও skip/attack খেলে (কৌশল)
  if(Math.random()<0.12 && (skipCard||attackCard)){ return aiPlay(attackCard||skipCard); }

  // ৪) নাহলে কার্ড টানো
  setTimeout(()=>{ drawCard(); G.busy=false; }, 700);
}
function aiPlay(card){
  removeFromHand(curP(), card.id); G.discard.push(card); sfx('play'); renderGame();
  // মানুষ চাইলে "না!" খেলতে পারে
  offerNope(card, ()=>{ G.busy=false; resolveAction(card); }, curP());
}
function aiDoঅনুগ্রহ(){
  const targets=aliveOpponentsWithCards();
  if(targets.length===0){ toast('অনুগ্রহ করার মতো কেউ নেই।'); return; }
  // সবচেয়ে বেশি কার্ডওয়ালার কাছ থেকে চায়; সে এলোমেলো একটি দেয়
  const t=targets.reduce((a,b)=>b.hand.length>a.hand.length?b:a, targets[0]);
  const give=t.hand[Math.floor(Math.random()*t.hand.length)];
  removeFromHand(t, give.id); curP().hand.push(give); sfx('steal');
  toast(`${curP().name} অনুগ্রহ নিল ${t.name}-এর কাছ থেকে।`); renderGame();
}

/* ============================================================
   রেন্ডারিং
   ============================================================ */
function renderGame(){
  const p=curP();
  $('current-player').textContent = p.name + (p.isAI?' 🤖':'');
  $('deck-count').textContent = toBn(G.deck.length);
  $('turn-info').textContent = G.turnsRemaining>1 ? `⚔️ এই পালায় আরও ${toBn(G.turnsRemaining)} বার খেলতে হবে` : '';

  const dp=$('discard-pile');
  if(G.discard.length===0){ dp.innerHTML='<span class="discard-empty">খেলা কার্ড</span>'; }
  else { const c=G.discard[G.discard.length-1];
    dp.innerHTML=`<div class="discard-card" style="background-image:url('${c.img}'); background-size:cover; background-position:center;">
      <div class="gc-nm-top">${c.name}</div></div>`; }

  renderPlayers();
  renderHand();
  // AI পালায় ইন্টারঅ্যাকশন বন্ধ
  const aiTurn=p.isAI;
  $('deck-pile').disabled=aiTurn;
  $('btn-draw').disabled=aiTurn;
  $('btn-draw').textContent = aiTurn ? '🤖 কম্পিউটার খেলছে...' : '🃏 কার্ড টেনে পালা শেষ করো';
}
function renderPlayers(){
  const strip=$('players-strip'); strip.innerHTML='';
  G.players.forEach((p,i)=>{
    const chip=document.createElement('div');
    chip.className='pchip'+(i===G.current?' active':'')+(p.alive?'':' dead');
    chip.innerHTML=`<div class="pn">${p.isAI?'🤖 ':''}${p.name}</div>
      <div class="pc">${p.alive?toBn(p.hand.length)+'টি কার্ড':'বাদ'}</div>`;
    strip.appendChild(chip);
  });
}
function renderHand(){
  const hand=$('hand'); hand.innerHTML='';
  const p=curP();
  $('hand-owner').textContent = p.isAI ? `${p.name}-এর কার্ড (লুকানো)` : 'তোমার কার্ড';
  if(p.isAI){
    const banner=document.createElement('div'); banner.className='ai-banner';
    banner.innerHTML=`🤖 ${p.name} ভাবছে<span class="dots"></span>`;
    hand.appendChild(banner);
    const hidden=document.createElement('div'); hidden.className='hidden-hand';
    for(let i=0;i<p.hand.length;i++){ const b=document.createElement('div'); b.className='card-back-mini'; b.textContent='🐱'; hidden.appendChild(b); }
    hand.appendChild(hidden);
    return;
  }
  p.hand.forEach(c=>{
    const el=document.createElement('div');
    el.className='game-card'; 
    el.style.backgroundImage=`url('${c.img}')`;
    el.style.backgroundSize='cover';
    el.style.backgroundPosition='center';
    el.innerHTML=`<div class="gc-nm-top">${c.name}</div>`;
    el.onclick=()=>onCardTap(c.id);
    hand.appendChild(el);
  });
}

/* ============================================================
   মডাল
   ============================================================ */
function openModal({title, bodyHTML, actions=[], afterRender=null, noClose=false}){
  $('modal-title').textContent=title;
  $('modal-body').innerHTML=bodyHTML;
  const act=$('modal-actions'); act.innerHTML='';
  actions.forEach(a=>{
    const b=document.createElement('button'); b.className='btn '+(a.cls||'btn-ghost')+' btn-block';
    b.textContent=a.label; b.onclick=a.onClick; act.appendChild(b);
  });
  $('modal-overlay').classList.add('show');
  $('modal-overlay').dataset.noClose = noClose?'1':'';
  if(afterRender) afterRender($('modal-box'));
}
function closeModal(){ $('modal-overlay').classList.remove('show'); }

/* ============================================================
   গেম শেষ
   ============================================================ */
function endGame(){
  G.busy=false;
  const winner=G.players.find(p=>p.alive);
  $('winner-name').textContent = winner ? winner.name+(winner.isAI?' 🤖':'') : '—';
  sfx('win'); fx('confetti');
  showScreen('over');
}

/* ============================================================
   নিয়ম মডাল
   ============================================================ */
function buildRules(){
  const shown=new Set(); let cards='';
  Object.values(CARD_DB).forEach(c=>{
    const key=c.kind==='cat'?'cat':c.kind;
    if(shown.has(key)) return; shown.add(key);
    const nm=c.kind==='cat'?'বিড়াল কার্ড (৫ রকম)':c.name;
    const em=c.kind==='cat'?'🐱':c.em;
    cards+=`<div class="rule-card"><div class="rc-em">${em}</div>
      <div><div class="rc-nm">${nm}</div><div class="rc-ds">${c.desc}</div></div></div>`;
  });
  return `
  <h3>🎯 খেলার লক্ষ্য</h3>
  <p>সবাই পালা করে ডেক থেকে কার্ড টানে। যে <b>বোন ব্লাস্ট 💣</b> টানে সে বিস্ফোরিত হয়ে বাদ পড়ে।
  <b>সবার শেষে যে টিকে থাকবে, সেই বিজয়ী!</b></p>

  <h3>🕹️ কীভাবে খেলবে (খুব সহজ)</h3>
  <ol>
    <li><b>কার্ড খেলতে:</b> নিচে তোমার হাতের যেকোনো কার্ডে <b>চাপ দাও</b> — একটি মেনু আসবে, সেখানে "▶️ এই কার্ডটি খেলো" চাপো।</li>
    <li>চাইলে কয়েকটি কার্ড খেলতে পারো, একটাও না খেললেও চলে।</li>
    <li><b>পালা শেষ করতে:</b> উপরের <b>🐱 টানো</b> ডেকে অথবা নিচের বড় বাটনে চাপ দিয়ে <b>একটি কার্ড টানো</b>।</li>
    <li>⚠️ কার্ড টানাই ঝুঁকি — তখনই বোন ব্লাস্ট আসতে পারে!</li>
  </ol>

  <h3>🛠️ শুরুতে যা হয়</h3>
  <ul>
    <li>প্রত্যেকে ৭টি কার্ড ও ১টি <b>নিষ্ক্রিয়কারী 🚿</b> পায়।</li>
    <li>ডেকে <b>(খেলোয়াড় সংখ্যা − ১)</b>টি বোন ব্লাস্ট থাকে — তাই শেষে একজনই টেকে।</li>
  </ul>

  <h3>💣 বোন ব্লাস্ট টানলে</h3>
  <ul>
    <li><b>নিষ্ক্রিয়কারী 🚿 থাকলে:</b> বাঁচো, তারপর বিড়ালটি গোপনে ডেকের যেকোনো জায়গায় রাখো (উপরে রাখলে পরের জন ফাঁদে পড়বে!)।</li>
    <li><b>না থাকলে:</b> তুমি বিস্ফোরিত — বাদ 💀।</li>
  </ul>

  <h3>🃏 কার্ডের পরিচয়</h3>
  ${cards}

  <h3>⚔️ আক্রমণ ও পালা</h3>
  <p>আক্রমণ খেললে কার্ড না টেনেই পালা শেষ, আর পরের জনকে ২ বার খেলতে হয়। আক্রান্ত অবস্থায় আবার আক্রমণ খেললে বাকি পালা পরের জনের সাথে যোগ হয়।</p>

  <h3>🚫 "না!" কার্ড</h3>
  <p>অন্য কেউ অ্যাকশন কার্ড খেললে, যার কাছে "না!" আছে সে সেটি বাতিল করতে পারে; আরেকটি "না!" দিয়ে আবার উল্টানো যায়। (বোন ব্লাস্ট ও নিষ্ক্রিয়কারী "না!" দিয়ে বাতিল হয় না।)</p>

  <h3>🤖 কম্পিউটার খেলোয়াড়</h3>
  <p>সেটআপে যেকোনো খেলোয়াড়কে 🤖 কম্পিউটার বানাতে পারো — তখন একা বা অল্প মানুষেও পুরো খেলা যায়। কম্পিউটার নিজে নিজে খেলে।</p>

  <h3>📱 Pass &amp; Play</h3>
  <p>একটিই ডিভাইসে সবাই খেলবে। প্রতি (মানুষ) পালার আগে "ডিভাইস পাস করো" স্ক্রিন আসবে — যেন কেউ অন্যের হাত না দেখে।</p>
  `;
}

/* ============================================================
   ইভেন্ট বাইন্ডিং
   ============================================================ */
function updateSoundIcons(){
  const ic = SETTINGS.sound ? '🔊' : '🔇';
  const g=$('btn-sound-game'); if(g) g.textContent=ic;
}
function init(){
  renderPlayerInputs();
  renderCountGrid();

  $('btn-add-player').onclick=()=>{ if(setupCount<5){ setupCount++; renderPlayerInputs(); } };
  $('btn-remove-player').onclick=()=>{ if(setupCount>2){ setupCount--; renderPlayerInputs(); } };

  $('toggle-sound').onclick=()=>{
    SETTINGS.sound=!SETTINGS.sound;
    const t=$('toggle-sound'); t.classList.toggle('on',SETTINGS.sound); t.textContent=SETTINGS.sound?'চালু':'বন্ধ';
    updateSoundIcons(); if(SETTINGS.sound){ initAudio(); sfx('tap'); }
  };
  $('btn-sound-game').onclick=()=>{
    SETTINGS.sound=!SETTINGS.sound; const t=$('toggle-sound');
    t.classList.toggle('on',SETTINGS.sound); t.textContent=SETTINGS.sound?'চালু':'বন্ধ';
    updateSoundIcons(); toast(SETTINGS.sound?'🔊 শব্দ চালু':'🔇 শব্দ বন্ধ'); if(SETTINGS.sound) initAudio();
  };
  $('btn-reset-counts').onclick=()=>{ SETTINGS.counts={...DEFAULT_COUNTS}; renderCountGrid(); toast('ডিফল্ট সংখ্যায় ফিরে গেলাম।'); };

  $('btn-start').onclick=()=>{
    initAudio();
    const inputs=[...document.querySelectorAll('#player-inputs input[type="text"]')];
    const types=setupTypes.slice(0,setupCount);
    const names=inputs.map((inp,i)=> inp.value.trim() || (types[i]?AI_NAMES[i]:DEFAULT_NAMES[i]));
    const seen={}; names.forEach((nm,i)=>{ if(seen[nm]) names[i]=nm+' '+toBn(i+1); seen[nm]=true; });
    startGame(names, types);
  };

  $('btn-pass-ready').onclick=beginTurn;
  $('deck-pile').onclick=()=>{ if(!curP().isAI) drawCard(); };
  $('btn-draw').onclick=()=>{ if(!curP().isAI) drawCard(); };

  $('btn-play-again').onclick=()=>{ startGame(G.players.map(p=>p.name), G.players.map(p=>p.isAI)); };
  $('btn-new-setup').onclick=()=>showScreen('setup');

  $('rules-body').innerHTML=buildRules();
  $('btn-rules-setup').onclick=()=>$('rules-overlay').classList.add('show');
  $('btn-rules-game').onclick=()=>$('rules-overlay').classList.add('show');
  $('btn-close-rules').onclick=()=>$('rules-overlay').classList.remove('show');

  $('modal-overlay').onclick=(e)=>{ if(e.target.id==='modal-overlay' && $('modal-overlay').dataset.noClose!=='1') closeModal(); };
  $('rules-overlay').onclick=(e)=>{ if(e.target.id==='rules-overlay') $('rules-overlay').classList.remove('show'); };

  showScreen('setup');
}
document.addEventListener('DOMContentLoaded', init);
