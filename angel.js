/* THREE is lazy-loaded only when the flight scene is needed (faster startup) */
let THREE=null;
async function ensureThree(){
  if(THREE)return THREE;
  try{ THREE=await import('three'); return THREE; }
  catch(e){ console.warn('3D unavailable, skipping flight'); return null; }
}

/* ===========================================================
   ABSTRACT AVATARS — angel silhouette + wings (4 styles, unique glow)
=========================================================== */
function svgDefs(uid,glow){
  return `<defs>
  <linearGradient id="wing_${uid}" x1="0" y1="0" x2="0.3" y2="1">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#f2eaff"/>
    <stop offset=".62" stop-color="#cdbce8"/><stop offset=".85" stop-color="#b59fd8"/><stop offset="1" stop-color="#99abfd"/></linearGradient>
  <linearGradient id="wing2_${uid}" x1="0" y1="0" x2="0.3" y2="1">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="${glow[1]}"/>
    <stop offset=".7" stop-color="${glow[2]}"/><stop offset="1" stop-color="#b59fd8"/></linearGradient>
  <linearGradient id="body_${uid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#e8def5"/><stop offset="1" stop-color="${glow[2]}"/></linearGradient>
  <radialGradient id="aura_${uid}" cx="50%" cy="42%" r="56%">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="32%" stop-color="${glow[1]}" stop-opacity=".6"/>
    <stop offset="66%" stop-color="${glow[2]}" stop-opacity=".3"/><stop offset="100%" stop-color="${glow[2]}" stop-opacity="0"/></radialGradient>
  <linearGradient id="halo_${uid}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="${glow[1]}"/><stop offset="1" stop-color="${glow[2]}"/></linearGradient>
  <filter id="glow_${uid}" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="halofx_${uid}" x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur stdDeviation="7"/></filter></defs>`;
}
function angelSVG(style,uid,glow){
  const W=`url(#wing_${uid})`,W2=`url(#wing2_${uid})`,GL=`url(#glow_${uid})`;
  let wings='';
  if(style===0){ // Leonor — tall sweeping wings
    wings=`<path d="M100 104 C82 70 60 36 36 30 C34 46 40 58 48 70 C34 66 26 72 26 86 C40 84 50 88 60 96 C46 96 40 104 42 116 C58 110 80 108 100 114 Z" fill="${W}" filter="${GL}"/>
    <path d="M100 104 C118 70 140 36 164 30 C166 46 160 58 152 70 C166 66 174 72 174 86 C160 84 150 88 140 96 C154 96 160 104 158 116 C142 110 120 108 100 114 Z" fill="${W2}" filter="${GL}"/>`;
  } else if(style===1){ // Rosa — soft curved wings
    wings=`<path d="M100 108 C78 84 46 78 28 96 C44 96 54 104 62 114 C48 116 42 126 46 138 C62 128 80 120 100 118 C92 114 90 110 100 108 Z" fill="${W}" filter="${GL}"/>
    <path d="M100 108 C122 84 154 78 172 96 C156 96 146 104 138 114 C152 116 158 126 154 138 C138 128 120 120 100 118 C108 114 110 110 100 108 Z" fill="${W2}" filter="${GL}"/>`;
  } else if(style===2){ // Francisca — layered ethereal wings
    wings=`<path d="M100 102 C80 72 52 60 34 66 C50 72 56 90 64 106 C50 104 44 114 48 126 C66 118 84 112 100 112 Z" fill="${W}" opacity=".95" filter="${GL}"/>
    <path d="M100 102 C120 72 148 60 166 66 C150 72 144 90 136 106 C150 104 156 114 152 126 C134 118 116 112 100 112 Z" fill="${W2}" opacity=".95" filter="${GL}"/>
    <path d="M100 106 C88 84 70 78 58 84 C70 88 74 100 80 110 C70 108 66 116 69 124 C80 118 92 114 100 113 Z" fill="#ffffff" opacity=".6"/>
    <path d="M100 106 C112 84 130 78 142 84 C130 88 126 100 120 110 C130 108 134 116 131 124 C120 118 108 114 100 113 Z" fill="#ffffff" opacity=".6"/>`;
  } else { // Irene — open broad dove wings
    wings=`<path d="M100 106 C76 92 44 86 24 102 C42 100 50 110 56 122 C66 110 82 104 100 110 Z" fill="${W}" filter="${GL}"/>
    <path d="M100 106 C124 92 156 86 176 102 C158 100 150 110 144 122 C134 110 118 104 100 110 Z" fill="${W2}" filter="${GL}"/>
    <path d="M100 100 C84 80 62 74 48 82 C62 86 66 100 72 112 C82 102 92 98 100 104 Z" fill="#ffffff" opacity=".55"/>
    <path d="M100 100 C116 80 138 74 152 82 C138 86 134 100 128 112 C118 102 108 98 100 104 Z" fill="#ffffff" opacity=".55"/>`;
  }
  return `<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMid meet">${svgDefs(uid,glow)}
    <ellipse cx="100" cy="120" rx="60" ry="64" fill="${glow[1]}" opacity=".4" filter="url(#halofx_${uid})"/>
    <ellipse cx="100" cy="118" rx="96" ry="106" fill="url(#aura_${uid})"/>
    ${wings}
    <path d="M100 96 C86 100 80 124 82 154 C84 182 92 206 100 214 C108 206 116 182 118 154 C120 124 114 100 100 96 Z" fill="url(#body_${uid})" filter="${GL}"/>
    <ellipse cx="100" cy="84" rx="13" ry="14" fill="url(#body_${uid})"/>
    <ellipse cx="100" cy="64" rx="15" ry="6" fill="none" stroke="url(#halo_${uid})" stroke-width="2.6" opacity=".95"/>
    <circle cx="100" cy="150" r="2.6" fill="#fff" opacity=".85"/>
    <circle cx="100" cy="120" r="3.4" fill="#fff"><animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite"/></circle></svg>`;
}
// 4 angels — unique colored aura/halo glow (verified palette tones)
const AVATARS=[
  {name:'Leonor',     style:0, glow:['#ffffff','#cad5f7','#99abfd']},   // ice-blue
  {name:'Rosa',       style:1, glow:['#ffffff','#f0d8ec','#d8a8d0']},   // soft rose-lilac
  {name:'Francisca',  style:2, glow:['#ffffff','#d8c4ec','#b09fd8']},   // lilac-violet
  {name:'Irene',      style:3, glow:['#ffffff','#cdeede','#aff2a2']},   // mint glow
];

let chosenAvatar=0;
const row=document.getElementById('avatarRow');
AVATARS.forEach((a,i)=>{
  const c=document.createElement('div');c.className='avatarCard'+(i===0?' sel':'');
  c.innerHTML=angelSVG(a.style,'av'+i,a.glow)+`<div class="label">${a.name}</div>`;
  c.onclick=()=>{chosenAvatar=i;[...row.children].forEach(x=>x.classList.remove('sel'));c.classList.add('sel');
    chime();};
  row.appendChild(c);
});
function setCompanion(){
  const a=AVATARS[chosenAvatar];
  document.getElementById('companion').innerHTML=angelSVG(a.style,'comp',a.glow);
}

/* ===========================================================
   THE SEVEN DOORS — abstract SVG scenes per door
=========================================================== */
const DOORS=[
 {id:'garden', name:'The Garden',  place:'the blooming hall', scene:'garden', notes:['C5','E5','G5'],
   q:'What in you is ready to bloom?',  msg:'Then let it open, gently, in its own time.'},
 {id:'beloved',name:'The Beloved', place:'the hall of light', scene:'light', notes:['E4','A4','C5'],
   q:'Who do you carry in your heart today?', msg:'They are here with you, in this light.'},
 {id:'release',name:'Release',     place:'the silver river', scene:'river', notes:['A3','C4','E4'],
   q:'What do you wish to let go of?', msg:'It dissolves now, like mist on water.'},
 {id:'wish',   name:'A Wish',      place:'the field of stars', scene:'stars', notes:['D5','G5','A5'],
   q:'If the sky could grant one wish…', msg:'Your wish rises and joins the stars.'},
 {id:'oracle', name:'The Angel',   place:'the sanctuary', scene:'angel', notes:['C4','G4','E5'],
   q:'What do you most need to hear?', msg:'You are soft, and whole, and enough.'},
 {id:'memory', name:'Memories',    place:'the hall of moons', scene:'moons', notes:['G3','D4','G4'],
   q:'What memory do you wish to keep forever?', msg:'It is kept here, safe, in crystal.'},
 {id:'gratitude',name:'Gratitude', place:'the still hall', scene:'still', notes:['F4','A4','C5'],
   q:'What are you grateful for, right now?', msg:'Gratitude opens every door in this sky.'},
];
const ROMAN=['I','II','III','IV','V','VI','VII'];

function doorScene(kind){
  const grad=`<defs>
    <linearGradient id="sky_${kind}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f2fbfd"/><stop offset=".5" stop-color="#cad5f7"/><stop offset="1" stop-color="#99abfd"/>
    </linearGradient>
    <radialGradient id="glow_${kind}" cx="50%" cy="40%" r="55%">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset="100%" stop-color="#cad5f7" stop-opacity="0"/>
    </radialGradient></defs>`;
  let art='';
  if(kind==='garden'){art=`<g>
    <circle cx="60" cy="200" r="10" fill="#b0f7d0"/><circle cx="90" cy="210" r="8" fill="#aff2a2"/>
    <circle cx="140" cy="205" r="9" fill="#b0f7d0"/><circle cx="115" cy="190" r="6" fill="#fff"/>
    <path d="M40 240 Q100 150 160 240" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/>
    <circle cx="100" cy="120" r="22" fill="#fff" opacity=".5"/></g>`;}
  else if(kind==='light'){art=`<g>
    <path d="M100 70 L120 200 L80 200 Z" fill="#fff" opacity=".55"/>
    <circle cx="100" cy="120" r="34" fill="url(#glow_light)"/>
    <line x1="100" y1="40" x2="100" y2="230" stroke="#fff" stroke-width="1.5" opacity=".4"/></g>`;}
  else if(kind==='river'){art=`<g>
    <path d="M0 170 Q100 150 200 175 L200 260 L0 260 Z" fill="#cad5f7" opacity=".7"/>
    <path d="M0 200 Q100 185 200 205" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>
    <circle cx="70" cy="110" r="14" fill="#fff" opacity=".7"/><circle cx="130" cy="95" r="10" fill="#daeaf6" opacity=".8"/></g>`;}
  else if(kind==='stars'){art=`<g>
    ${Array.from({length:14},(_,i)=>`<circle cx="${20+Math.random()*160|0}" cy="${50+Math.random()*150|0}" r="${1+Math.random()*2|0}" fill="#fff"/>`).join('')}
    <path d="M100 90 l5 14 14 5 -14 5 -5 14 -5 -14 -14 -5 14 -5 z" fill="#fff"/></g>`;}
  else if(kind==='angel'){art=`<g>
    <ellipse cx="100" cy="130" rx="60" ry="70" fill="url(#glow_angel)"/>
    <path d="M100 90 C80 70 55 64 42 74 C58 80 62 100 70 118 C92 110 100 108 100 108 Z" fill="#fff" opacity=".85"/>
    <path d="M100 90 C120 70 145 64 158 74 C142 80 138 100 130 118 C108 110 100 108 100 108 Z" fill="#fff" opacity=".85"/>
    <circle cx="100" cy="70" r="13" fill="none" stroke="#fff" stroke-width="2"/></g>`;}
  else if(kind==='moons'){art=`<g>
    <circle cx="70" cy="110" r="26" fill="#daeaf6"/><circle cx="78" cy="104" r="22" fill="#cad5f7"/>
    <circle cx="140" cy="170" r="16" fill="#f2fbfd"/><circle cx="120" cy="200" r="10" fill="#fff" opacity=".7"/></g>`;}
  else {art=`<g>
    <ellipse cx="100" cy="200" rx="80" ry="14" fill="#fff" opacity=".3"/>
    <circle cx="100" cy="120" r="30" fill="#fff" opacity=".5"/>
    <circle cx="100" cy="120" r="44" fill="none" stroke="#fff" stroke-width="1.5" opacity=".4"/></g>`;}
  return `<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMid slice">${grad}
    <rect width="200" height="260" fill="url(#sky_${kind})"/>${art}</svg>`;
}

const doorsEl=document.getElementById('doors');
const doorEls=[];
DOORS.forEach((d,i)=>{
  const el=document.createElement('div');el.className='door';
  el.style.animation=`doorFloat ${4.5+i*0.3}s ease-in-out infinite`;
  el.style.animationDelay=(i*0.4)+'s';
  el.innerHTML=doorScene(d.scene)+`<div class="num">Door ${ROMAN[i]}</div><div class="frame"></div>
    <div class="visited">✦</div>
    <div class="info"><div class="nm">${d.name}</div><div class="pl">${d.place}</div></div>`;
  el.onclick=()=>enterRoom(d,i);
  doorsEl.appendChild(el);doorEls.push(el);
});
/* center trailing 3 in row 2 — DESKTOP ONLY, so mobile media queries win */
const styleEl=document.createElement('style');
styleEl.textContent=`@media (min-width:881px){
  #doors .door:nth-child(5){grid-column:1;margin-left:calc(50% + 10px)}
  #doors .door:nth-child(6){grid-column:2;margin-left:calc(50% + 10px)}
  #doors .door:nth-child(7){grid-column:3;margin-left:calc(50% + 10px)}
}`;
document.head.appendChild(styleEl);

/* ===========================================================
   ABSTRACT ANIMATED SKY — single shared background canvas
=========================================================== */
const REDUCE_MOTION=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function makeSky(canvas){
  const ctx=canvas.getContext('2d');let w,h,orbs=[],t=0,raf=null,visible=true;
  function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight;}
  resize();addEventListener('resize',resize);
  orbs=Array.from({length:11},()=>({x:Math.random(),y:Math.random(),r:40+Math.random()*120,
    vx:(Math.random()-.5)*.0004,vy:(Math.random()-.5)*.0004,
    c:['#cad5f7','#daeaf6','#b0f7d0','#99abfd','#f2fbfd','#d8c4ec','#e8c4e0','#c8b4e8'][Math.floor(Math.random()*8)],a:.1+Math.random()*.16}));
  function draw(){
    const g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#e2e2f5');g.addColorStop(.4,'#c4bce8');g.addColorStop(.72,'#a6a8de');g.addColorStop(1,'#9a9cd6');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    const bandCols=[['#b0f7d0','#cad5f7','#99abfd'],['#e8c4e0','#cdbce8','#cad5f7'],['#d8c4ec','#cad5f7','#b0f7d0']];
    for(let i=0;i<3;i++){ctx.save();ctx.globalAlpha=.08;
      const grd=ctx.createLinearGradient(0,h*0.3,w,h*0.6);
      grd.addColorStop(0,bandCols[i][0]);grd.addColorStop(.5,bandCols[i][1]);grd.addColorStop(1,bandCols[i][2]);
      ctx.fillStyle=grd;ctx.beginPath();
      const yy=h*(.3+i*.16)+Math.sin(t+i)*30;
      ctx.moveTo(0,yy);for(let x=0;x<=w;x+=40)ctx.lineTo(x,yy+Math.sin(t*1.3+x*0.004+i)*26);
      ctx.lineTo(w,yy+90);ctx.lineTo(0,yy+90);ctx.closePath();ctx.fill();ctx.restore();}
    orbs.forEach(o=>{o.x+=o.vx;o.y+=o.vy;if(o.x<-.2)o.x=1.2;if(o.x>1.2)o.x=-.2;if(o.y<-.2)o.y=1.2;if(o.y>1.2)o.y=-.2;
      const px=o.x*w,py=o.y*h;const rg=ctx.createRadialGradient(px,py,2,px,py,o.r);
      rg.addColorStop(0,o.c);rg.addColorStop(1,'rgba(255,255,255,0)');
      ctx.globalAlpha=o.a;ctx.fillStyle=rg;ctx.beginPath();ctx.arc(px,py,o.r,0,7);ctx.fill();ctx.globalAlpha=1;});
  }
  function frame(){ if(!visible)return; t+=0.005;draw();raf=requestAnimationFrame(frame); }
  if(REDUCE_MOTION){draw();}            // static if user prefers reduced motion
  else frame();
  // pause when tab hidden (saves CPU)
  document.addEventListener('visibilitychange',()=>{
    visible=!document.hidden;
    if(visible&&!REDUCE_MOTION){raf=requestAnimationFrame(frame);}
    else if(raf)cancelAnimationFrame(raf);
  });
  return canvas;
}
makeSky(document.getElementById('bgCanvas'));

/* atmosphere: stars + bubbles on each screen */
function decorate(el,nStars,nBub){
  for(let i=0;i<nStars;i++){const s=document.createElement('div');s.className='star';s.textContent='✦';
    s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';
    s.style.fontSize=(7+Math.random()*15)+'px';s.style.animationDelay=Math.random()*3.6+'s';el.appendChild(s);}
  for(let i=0;i<nBub;i++){const b=document.createElement('div');b.className='bubble';
    const sz=18+Math.random()*72;b.style.width=sz+'px';b.style.height=sz+'px';
    b.style.left=Math.random()*100+'%';b.style.bottom='-15vh';
    b.style.animationDuration=(15+Math.random()*16)+'s';b.style.animationDelay=(-Math.random()*22)+'s';el.appendChild(b);}
}
['start','creator','hall','room','sky'].forEach(id=>decorate(document.getElementById(id),16,6));

/* ===========================================================
   ROUTING
=========================================================== */
const screens=['start','creator','flight','hall','room','sky'];
let activeFlight=false;
function flash(){const f=document.getElementById('flash');f.classList.remove('on');void f.offsetWidth;f.classList.add('on');}
function go(name){
  flash();
  screens.forEach(s=>document.getElementById(s).classList.toggle('hidden',s!==name));
  const wm=document.getElementById('wordmark');
  wm.classList.toggle('hide',name==='start'||name==='sky');
  wm.classList.toggle('small',name!=='start'&&name!=='sky');
  // companion appears in hall and room only
  const comp=document.getElementById('companion');
  if(name==='hall'||name==='room'){setCompanion();comp.classList.add('on');}
  else comp.classList.remove('on');
  activeFlight=(name==='flight');
  if(name==='flight'){startFlight();setTimeout(()=>{if(activeFlight)go('hall');},5200);}
  if(name==='hall')refreshDoors();
  chime();
}
window.go=go;

/* ===== word-by-word text reveal ===== */
function revealText(el,text,wordDelay=140,cb){
  el.innerHTML='';const words=text.split(' ');let i=0;
  (function step(){
    if(i>=words.length){if(cb)cb();return;}
    const span=document.createElement('span');span.textContent=words[i]+(i<words.length-1?' ':'');
    span.style.opacity=0;span.style.transition='opacity .6s';el.appendChild(span);
    requestAnimationFrame(()=>span.style.opacity=1);
    i++;setTimeout(step,wordDelay);
  })();
}

/* ROOM + progress */
let curDoor=null,curIndex=-1;
let answers=loadAnswers(); // id -> text  (persisted)
function refreshDoors(){
  doorEls.forEach((el,i)=>{el.classList.toggle('done', answers[DOORS[i].id]!==undefined);});
}
function enterRoom(d,i){
  curDoor=d;curIndex=i;
  document.getElementById('rTitle').textContent=d.name;
  const q=document.getElementById('rQuestion');
  const inp=document.getElementById('rInput');inp.value=answers[d.id]||'';inp.style.display='block';
  document.getElementById('rBtn').style.display='inline-block';
  const m=document.getElementById('rMsg');m.classList.remove('on');m.textContent='';
  document.getElementById('rBack').classList.remove('on');
  go('room');
  doorChord(d);                       // door's own sound
  revealText(q,d.q,130);              // question word-by-word
  setTimeout(()=>inp.focus(),700);
}
window.enterRoom=enterRoom;
window.answer=function(){
  const val=document.getElementById('rInput').value.trim();
  answers[curDoor.id]=val;saveAnswers();
  document.getElementById('rInput').style.display='none';
  document.getElementById('rBtn').style.display='none';
  const m=document.getElementById('rMsg');m.classList.add('on');
  revealText(m,curDoor.msg,150);      // message word-by-word
  document.getElementById('rBack').classList.add('on');
  doorChord(curDoor);
  const host=document.getElementById('room');
  for(let i=0;i<18;i++){const s=document.createElement('div');s.className='star';s.textContent='✦';
    s.style.left=(38+Math.random()*24)+'%';s.style.top=(32+Math.random()*32)+'%';
    s.style.fontSize=(10+Math.random()*20)+'px';s.style.zIndex=6;host.appendChild(s);
    setTimeout(()=>s.remove(),3200);}
  if(Object.keys(answers).length>=DOORS.length){
    document.getElementById('rBack').textContent='see your sky ✦';
    document.getElementById('rBack').onclick=showSky;
  } else {
    document.getElementById('rBack').textContent='return to the hall';
    document.getElementById('rBack').onclick=()=>go('hall');
  }
};
document.getElementById('rInput').addEventListener('keydown',e=>{if(e.key==='Enter')answer();});

/* ===== persistence ===== */
function saveAnswers(){try{localStorage.setItem('angel_sky',JSON.stringify(answers));}catch(e){}}
function loadAnswers(){try{const s=localStorage.getItem('angel_sky');return s?JSON.parse(s):{};}catch(e){return {};}}

/* ===== THE SKY (final diary) ===== */
function showSky(){
  const c=document.getElementById('constellation');c.innerHTML='';
  DOORS.forEach(d=>{
    const a=answers[d.id];
    const div=document.createElement('div');div.className='entry';
    div.innerHTML=`<div class="en silver">${d.name}</div><div class="eq">${d.q}</div>
      <div class="ea${a?'':' empty'}">${a?escapeHtml(a):'— left unspoken —'}</div>`;
    c.appendChild(div);
  });
  go('sky');
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
window.restartJourney=function(){
  answers={};saveAnswers();
  refreshDoors();go('start');
};

/* ===== download your sky as an image ===== */
window.downloadSky=function(){
  const W=1200,H=1500,c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d');
  // background gradient
  const g=x.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#f2fbfd');g.addColorStop(.5,'#cad5f7');g.addColorStop(1,'#99abfd');
  x.fillStyle=g;x.fillRect(0,0,W,H);
  // stars
  x.fillStyle='#ffffff';
  for(let i=0;i<120;i++){const sx=Math.random()*W,sy=Math.random()*H,r=Math.random()*2.2;
    x.globalAlpha=.4+Math.random()*.6;x.beginPath();x.arc(sx,sy,r,0,7);x.fill();}
  x.globalAlpha=1;
  // title
  x.textAlign='center';x.fillStyle='#5a63a8';
  x.font='700 90px Georgia';x.fillText('Your Sky',W/2,130);
  x.fillStyle='#6a72a8';x.font='italic 30px Georgia';
  x.fillText('a celestial dream · Angel',W/2,180);
  // entries
  let yy=250;const pad=70;
  DOORS.forEach((d)=>{
    const a=answers[d.id];
    // card
    x.fillStyle='rgba(255,255,255,.55)';
    roundRect(x,pad,yy,W-pad*2,150,18);x.fill();
    x.textAlign='left';
    x.fillStyle='#5a63a8';x.font='700 44px Georgia';x.fillText(d.name,pad+30,yy+56);
    x.fillStyle='#6a72a8';x.font='italic 24px Georgia';x.fillText(d.q,pad+30,yy+92);
    x.fillStyle='#3a4280';x.font='28px Georgia';
    x.fillText(a?clip(a,60):'— left unspoken —',pad+30,yy+132);
    yy+=170;
  });
  function roundRect(ctx,rx,ry,rw,rh,rr){ctx.beginPath();ctx.moveTo(rx+rr,ry);
    ctx.arcTo(rx+rw,ry,rx+rw,ry+rh,rr);ctx.arcTo(rx+rw,ry+rh,rx,ry+rh,rr);
    ctx.arcTo(rx,ry+rh,rx,ry,rr);ctx.arcTo(rx,ry,rx+rw,ry,rr);ctx.closePath();}
  function clip(s,n){return s.length>n?s.slice(0,n)+'…':s;}
  const link=document.createElement('a');link.download='your-sky.png';link.href=c.toDataURL('image/png');link.click();
  chord();
};

/* ===========================================================
   FLIGHT — simple abstract 3D (chrome rings + crystal castle ahead)
=========================================================== */
let renderer,camera,scene,rings=[],castle,flightZ=0,flightRAF=null,clock;
async function startFlight(){
  const lib=await ensureThree();
  if(!activeFlight)return;            // user may have skipped during load
  if(!lib){ go('hall'); return; }     // 3D unavailable → skip straight to hall
  try{
  if(!renderer){
    renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
    renderer.domElement.style.cssText='position:absolute;inset:0;z-index:0';
    document.getElementById('flight').prepend(renderer.domElement);
    camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,0.1,500);
    scene=new THREE.Scene();
    scene.background=new THREE.Color(0xb6c2ee);scene.fog=new THREE.Fog(0xb6c2ee,40,260);
    scene.add(new THREE.HemisphereLight(0xffffff,0x99abfd,1.7));
    const k=new THREE.DirectionalLight(0xffffff,1.3);k.position.set(4,10,6);scene.add(k);
    const pmrem=new THREE.PMREMGenerator(renderer);pmrem.compileEquirectangularShader();
    const cv=document.createElement('canvas');cv.width=256;cv.height=128;const x=cv.getContext('2d');
    const g=x.createLinearGradient(0,0,0,128);g.addColorStop(0,'#ffffff');g.addColorStop(.5,'#cad5f7');g.addColorStop(1,'#6e7cc8');
    x.fillStyle=g;x.fillRect(0,0,256,128);const tex=new THREE.CanvasTexture(cv);tex.mapping=THREE.EquirectangularReflectionMapping;
    const env=pmrem.fromEquirectangular(tex).texture;
    const chrome=new THREE.MeshStandardMaterial({color:0xf2fbfd,metalness:1,roughness:.05,envMap:env});
    const crystal=new THREE.MeshStandardMaterial({color:0xdaeaf6,metalness:.3,roughness:.05,envMap:env,transparent:true,opacity:.5});
    for(let i=0;i<20;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(4.2,0.26,16,48),chrome);
      r.position.set((Math.random()-.5)*7,(Math.random()-.5)*5,-i*14);rings.push(r);scene.add(r);}
    for(let i=0;i<16;i++){const sp=new THREE.Mesh(new THREE.SphereGeometry(0.5+Math.random()*0.8,32,32),chrome);
      sp.position.set((Math.random()-.5)*24,(Math.random()-.5)*16,-Math.random()*250);sp.userData.s=1;rings.push(sp);scene.add(sp);}
    // crystal castle far ahead (abstract spires)
    castle=new THREE.Group();castle.position.set(0,-2,-300);scene.add(castle);
    [[0,7,1.6],[-3,5,1.1],[3,5,1.1],[-6,4,1],[6,4,1]].forEach(p=>{
      const tw=new THREE.Mesh(new THREE.CylinderGeometry(p[2]*.7,p[2],p[1],12),crystal);tw.position.set(p[0],p[1]/2,0);castle.add(tw);
      const rf=new THREE.Mesh(new THREE.ConeGeometry(p[2]*1.1,p[1]*.7,12),chrome);rf.position.set(p[0],p[1]+p[1]*.32,0);castle.add(rf);});
    const pg=new THREE.BufferGeometry();const pts=[];
    for(let i=0;i<500;i++)pts.push((Math.random()-.5)*44,(Math.random()-.5)*32,-Math.random()*260);
    pg.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
    scene.add(new THREE.Points(pg,new THREE.PointsMaterial({color:0xffffff,size:0.28,transparent:true,opacity:.9})));
    clock=new THREE.Clock();
  }
  flightZ=0;clock.start();
  function loop(){if(!activeFlight){if(flightRAF)cancelAnimationFrame(flightRAF);return;}
    flightRAF=requestAnimationFrame(loop);const t=clock.getElapsedTime();
    flightZ-=26*0.016;
    camera.position.set(Math.sin(t*0.4)*1.6,Math.cos(t*0.3)*1.1,flightZ);
    camera.lookAt(Math.sin(t*0.4)*0.6,0,flightZ-20);
    rings.forEach(r=>{if(!r.userData.s)r.rotation.z+=0.012;
      if(r.position.z>camera.position.z+10)r.position.z-=14*20;});
    if(castle)castle.position.z=flightZ-120;
    renderer.render(scene,camera);}
  loop();
  }catch(e){ console.warn('flight failed, skipping',e); go('hall'); }
}
addEventListener('resize',()=>{if(renderer){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);}});

/* ===========================================================
   SOUND — ambient pad + crystal chimes (Tone.js, synthesized)
=========================================================== */
let audioReady=false,muted=false,pad,padChord,chimeSynth,reverb;
const PENT=['C4','D4','E4','G4','A4','C5','D5','E5','G5'];
function initAudio(){
  if(audioReady||typeof Tone==='undefined')return;
  audioReady=true;
  reverb=new Tone.Reverb({decay:8,wet:.55}).toDestination();
  pad=new Tone.PolySynth(Tone.Synth,{oscillator:{type:'sine'},
    envelope:{attack:4,decay:2,sustain:.6,release:8},volume:-22}).connect(reverb);
  chimeSynth=new Tone.PolySynth(Tone.FMSynth,{harmonicity:3.2,modulationIndex:6,
    oscillator:{type:'sine'},envelope:{attack:.005,decay:1.6,sustain:0,release:1.8},
    modulation:{type:'sine'},volume:-14}).connect(reverb);
  const chords=[['C3','G3','E4'],['A2','E3','C4'],['F2','C3','A3'],['G2','D3','B3']];
  let ci=0;
  padChord=new Tone.Loop(time=>{ if(muted)return; pad.triggerAttackRelease(chords[ci%chords.length],'2m',time);ci++; },'2m').start(0);
  Tone.Transport.bpm.value=50;Tone.Transport.start();
}
function startAudioOnce(){ if(typeof Tone==='undefined')return; Tone.start().then(()=>initAudio()); }
window.addEventListener('pointerdown',startAudioOnce,{once:true});
window.addEventListener('keydown',startAudioOnce,{once:true});
function chime(){ if(!audioReady||muted)return;
  chimeSynth.triggerAttackRelease(PENT[Math.floor(Math.random()*PENT.length)],'4n'); }
function chord(){ if(!audioReady||muted)return;
  const b=Math.floor(Math.random()*3);
  chimeSynth.triggerAttackRelease([PENT[b],PENT[b+2],PENT[b+4]],'2n'); }
function doorChord(d){ if(!audioReady||muted)return;
  if(d&&d.notes)chimeSynth.triggerAttackRelease(d.notes,'2n'); else chord(); }
window.toggleMute=function(){
  muted=!muted;
  document.getElementById('muteIcon').style.opacity=muted?.4:1;
  if(audioReady)Tone.Destination.mute=muted;else startAudioOnce();
};

/* ===== cursor sparkle trail ===== */
let lastTrail=0;
window.addEventListener('pointermove',e=>{
  const now=performance.now();if(now-lastTrail<40)return;lastTrail=now;
  const t=document.createElement('div');t.className='trail';
  const sz=6+Math.random()*8;t.style.width=sz+'px';t.style.height=sz+'px';
  t.style.left=e.clientX+'px';t.style.top=e.clientY+'px';
  document.body.appendChild(t);
  requestAnimationFrame(()=>t.classList.add('fade'));
  setTimeout(()=>t.remove(),650);
});

go('start');

/* hide loader once everything is ready */
function hideLoader(){const l=document.getElementById('loader');if(l){l.classList.add('gone');setTimeout(()=>l.remove(),900);}}
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(()=>setTimeout(hideLoader,400));}
else setTimeout(hideLoader,800);
setTimeout(hideLoader,2500);

/* ===== keyboard accessibility ===== */
(function makeAccessible(){
  document.querySelectorAll('.gbtn,.door,.avatarCard,#mute').forEach(el=>{
    if(!el.hasAttribute('tabindex'))el.setAttribute('tabindex','0');
    if(!el.hasAttribute('role'))el.setAttribute('role','button');
    el.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}
    });
  });
})();

/* ============================================================
   AERO WINDOWS — draggable, focus-to-front, minimize / close
============================================================ */
let winZ=130;
function makeDraggable(win){
  const bar=win.querySelector('.aeroBar');
  let dragging=false,sx=0,sy=0,ox=0,oy=0;
  function bringFront(){win.style.zIndex=(++winZ);}
  win.addEventListener('pointerdown',bringFront);
  bar.addEventListener('pointerdown',e=>{
    if(e.target.closest('.ctrls'))return;          // don't drag when hitting buttons
    dragging=true;bringFront();
    const r=win.getBoundingClientRect();
    win.style.left=r.left+'px';win.style.top=r.top+'px';
    win.style.right='auto';win.style.bottom='auto';
    sx=e.clientX;sy=e.clientY;ox=r.left;oy=r.top;
    bar.setPointerCapture(e.pointerId);
  });
  bar.addEventListener('pointermove',e=>{
    if(!dragging)return;
    let nx=ox+(e.clientX-sx),ny=oy+(e.clientY-sy);
    // keep on screen
    nx=Math.max(-win.offsetWidth+80,Math.min(innerWidth-80,nx));
    ny=Math.max(0,Math.min(innerHeight-40,ny));
    win.style.left=nx+'px';win.style.top=ny+'px';
  });
  bar.addEventListener('pointerup',e=>{dragging=false;try{bar.releasePointerCapture(e.pointerId);}catch(_){}});
  // controls
  const min=win.querySelector('[data-act="min"]'),cls=win.querySelector('[data-act="close"]');
  if(min)min.addEventListener('click',()=>{win.classList.toggle('minimized');chime&&chime();});
  if(cls)cls.addEventListener('click',()=>{win.classList.add('closed');chime&&chime();});
}
document.querySelectorAll('.aeroWin').forEach(makeDraggable);
