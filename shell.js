(()=>{
'use strict';
const frame=document.getElementById('core');
const hero=document.getElementById('hero');
const hub=document.getElementById('hub');
const heading=document.getElementById('engineHeading');
const titles={home:['⌂','YOUR DOJO','The Four Verb Clans'],regles:['✧','HALL OF WISDOM','The Secrets of Irregular Verbs'],liste:['▤','SCROLL ARCHIVE','The Verb Collection'],memory:['▦','MEMORY GARDEN','Match the Sacred Cards'],quiz:['⚡','BATTLE ARENA','Choose Your Challenge'],progres:['✦','MASTERY SHRINE','Your Journey to Mastery']};
let view='home',loaded=false,resizeJob=0,soundOn=true,audio=null;
const senseiAvatar=`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 90 Q17 58 38 58 L63 58 Q85 64 84 90" fill="#273e5b" stroke="#182539" stroke-width="3"/><path d="M36 60 L51 79 L65 60" fill="#f9efe0"/><path d="M48 71 L55 71 L58 90 L45 90" fill="#c34840"/><ellipse cx="51" cy="40" rx="26" ry="29" fill="#f1bf91" stroke="#ad7e5d" stroke-width="2"/><path d="M23 34 Q17 7 50 10 Q85 7 79 38 Q66 29 63 21 Q44 40 23 34" fill="#d6d4d0" stroke="#86878f" stroke-width="3"/><path d="M24 31 Q48 8 76 28" fill="none" stroke="#dedbd7" stroke-width="6"/><path d="M31 45 Q39 40 44 45 M58 45 Q65 40 71 45" fill="none" stroke="#443c44" stroke-linecap="round" stroke-width="3"/><path d="M43 56 Q52 64 61 56" fill="none" stroke="#965d4b" stroke-width="2.5" stroke-linecap="round"/><path d="M24 36 L31 54 M78 36 L72 54" stroke="#e6b08d" stroke-width="3"/></svg>`;

/* V3 — daily training panel (self-contained, original engine stays untouched) */
const dailySteps=[
 {key:'regles',icon:'✧',name:'Study the clans',detail:'Review the verb patterns'},
 {key:'liste',icon:'▤',name:'Explore the scrolls',detail:'Read and listen to verbs'},
 {key:'memory',icon:'▦',name:'Memory challenge',detail:'Match the verb forms'},
 {key:'quiz',icon:'⚡',name:'Enter the arena',detail:'Test what you know'}
];
function getDailyKey(){const now=new Date();return 'verbdojo_v3_daily_'+now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')}
function dailyDone(){try{return JSON.parse(localStorage.getItem(getDailyKey())||'[]').filter(k=>dailySteps.some(s=>s.key===k))}catch(e){return []}}
function renderDaily(){
 let panel=document.getElementById('dailyPanel');
 if(!panel){panel=document.createElement('section');panel.id='dailyPanel';panel.className='daily-panel';panel.setAttribute('aria-label','Daily training missions');hub.insertAdjacentElement('afterend',panel)}
 const done=dailyDone();
 panel.innerHTML='<div class="daily-head"><div><small>✦ YOUR DAILY QUEST</small><h2>Path of the Sensei</h2><p>Complete four training steps at your own pace. Tick each step when finished.</p></div><div class="daily-count" aria-live="polite"><strong>'+done.length+'/4</strong><span>COMPLETE</span></div></div><div class="daily-progress"><span style="width:'+(done.length*25)+'%"></span></div><div class="daily-grid">'+dailySteps.map((s,i)=>'<article class="daily-step'+(done.includes(s.key)?' is-done':'')+'"><div class="daily-step-icon">'+s.icon+'</div><div class="daily-step-copy"><small>STEP '+(i+1)+'</small><strong>'+s.name+'</strong><span>'+s.detail+'</span></div><button type="button" class="daily-open" data-quest-open="'+s.key+'" aria-label="Open '+s.name+'">GO ↗</button><label class="daily-check"><input type="checkbox" data-quest-check="'+s.key+'" '+(done.includes(s.key)?'checked':'')+'><span>Done</span></label></article>').join('')+'</div>'+(done.length===4?'<p class="daily-finish">✦ Training complete! Return tomorrow for a new quest.</p>':'<p class="daily-hint">Your checkmarks stay on this device for today. Training progress and XP still come from the original game.</p>');
 panel.querySelectorAll('[data-quest-open]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.questOpen)));
 panel.querySelectorAll('[data-quest-check]').forEach(c=>c.addEventListener('change',()=>{let d=new Set(dailyDone());if(c.checked)d.add(c.dataset.questCheck);else d.delete(c.dataset.questCheck);try{localStorage.setItem(getDailyKey(),JSON.stringify([...d]))}catch(e){}renderDaily();decorateAllIcons();play()}));
}


/* V5 ORIGINAL characters, drawn as inline SVG: no existing franchise characters or logos. */
const v5Roster={
 hero:{skin:'#f1b98b',hair:'#503e35',suit:'#ed8b29',trim:'#205394',eyes:'#2b3049',band:'#1a65a9'},
 sensei:{skin:'#ddaa83',hair:'#d2e7ed',suit:'#344d69',trim:'#e0a43d',eyes:'#35374c',band:'#e0a43d'},
 stable:{skin:'#c68f70',hair:'#283b32',suit:'#297a50',trim:'#a5e2a5',eyes:'#243a31',band:'#63b886'},
 twin:{skin:'#efbd96',hair:'#154982',suit:'#277dd1',trim:'#b7e4ff',eyes:'#163861',band:'#51c9f2'},
 evolve:{skin:'#e8ad84',hair:'#8d352f',suit:'#d35129',trim:'#ffd367',eyes:'#4e242a',band:'#eeb33c'},
 wild:{skin:'#dab3a3',hair:'#d9cced',suit:'#58377f',trim:'#ceb8ff',eyes:'#342c58',band:'#9567d2'}
};
function v5FallbackPortrait(name){
 const p=v5Roster[name];if(!p)return '';
 const whiteHair=name==='sensei'||name==='wild';
 const eyes=name==='sensei'?'M51 56l11 3m18 0 11-3':'M49 57l12 1m19 0 11-1';
 return '<svg xmlns="http://www.w3.org/2000/svg" class="v5-character" viewBox="0 0 140 170" role="img" aria-label="Original anime character '+name+'">'+
 '<defs><linearGradient id="shine-'+name+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff" stop-opacity=".38"/><stop offset="1" stop-color="#000000" stop-opacity=".13"/></linearGradient></defs>'+
 '<path d="M9 168q0-60 44-66l35 0q43 6 44 66" fill="'+p.suit+'" stroke="#283345" stroke-width="4"/>'+
 '<path d="M47 106l24 23 25-23-13-10H60z" fill="'+p.trim+'" stroke="#283345" stroke-width="3"/>'+
 '<path d="M61 102v20h22v-20" fill="'+p.skin+'"/>'+
 '<ellipse cx="70" cy="62" rx="37" ry="45" fill="'+p.skin+'" stroke="#303443" stroke-width="3"/>'+
 '<path d="M32 61Q18 25 38 32L26 12 52 21 60 4 75 18 89 5 93 24 112 15 101 42 111 52 93 47 90 34Q63 51 42 42z" fill="'+p.hair+'" stroke="#293247" stroke-width="3" stroke-linejoin="round"/>'+
 '<path d="M35 46Q69 29 104 45" stroke="'+p.band+'" stroke-width="9" fill="none"/>'+
 '<path d="'+eyes+'" stroke="'+p.eyes+'" stroke-width="4" stroke-linecap="round"/>'+
 '<path d="M62 81q8 7 17 0" stroke="#783e3d" stroke-width="3" fill="none" stroke-linecap="round"/>'+
 (name==='sensei'?'<path d="M51 84q18 33 39 0l-10 29-10 10-11-11z" fill="#f1f2e7" stroke="#9b9caa" stroke-width="2"/>':'')+
 '<path d="M10 168q8-39 23-44M130 168q-8-39-23-44" stroke="'+p.trim+'" stroke-width="7" fill="none"/>'+
 '<path d="M9 168q0-60 44-66l35 0q43 6 44 66" fill="url(#shine-'+name+')" stroke="none"/></svg>';
}

/* V6: use original illustrated PNG assets when deployed, otherwise keep V5 SVGs. */
const v6Assets={
 hero:'01_heros.png',sensei:'05_sensei_kai.png',stable:'06_clan_vent.png',
 twin:'02_clan_eau.png',evolve:'03_clan_feu.png',wild:'04_clan_foudre.png',
 rival:'07_rival.png',mascot:'bonus_mascotte.png'
};
function v5Portrait(name){
 const file=v6Assets[name];
 if(!file)return v5FallbackPortrait(name);
 return '<span class="v6-portrait" role="img" aria-label="Verb Dojo character '+name+'">'+
 '<img alt="" loading="lazy" decoding="async" src="assets/characters/'+file+'">'+
 '<span class="v6-fallback" aria-hidden="true">'+v5FallbackPortrait(name)+'</span></span>';
}
function v6EnableImages(){
 document.querySelectorAll('.v6-portrait img').forEach(img=>{
  if(img.dataset.v6Ready)return;
  img.dataset.v6Ready='1';
  const loaded=()=>{img.parentElement.classList.add('v6-loaded')};
  if(img.complete&&img.naturalWidth)loaded();
  else img.addEventListener('load',loaded,{once:true});
 });
}

function v5Mount(){
 const cast=document.getElementById('v5HeroCast');
 if(cast){cast.innerHTML='<div class="v5-cast v5-cast-main">'+v5Portrait('hero')+'<span class="v5-cast-label">YOUR HERO</span></div>';}

 const arena=document.getElementById('v5Battle');
 if(arena)arena.innerHTML='<div class="v5-arena-title">⚡ BATTLE ARENA <small>TRAIN · LEARN · MASTER</small></div><div class="v5-fighter v5-player">'+v5Portrait('hero')+'<div class="v5-fighter-name">YOUR HERO <span>LEARNER</span></div></div><div class="v5-versus">VS</div><div class="v5-fighter v5-opponent">'+v5Portrait('evolve')+'<div class="v5-fighter-name">RIVAL RYU <span>VERB CHALLENGER</span></div></div><p class="v5-arena-note">Complete the original challenges below to build your mastery.</p>';v6EnableImages();
}


/* V7: illustrated icons, preserve existing navigation and accessible text */
const v7Icons={home:'dojo',regles:'wisdom',liste:'scrolls',memory:'memory',quiz:'arena',progres:'mastery'};
function decorateIcon(container,name){
 if(!container || container.querySelector('.v7-icon'))return;
 const img=document.createElement('img');
 img.className='v7-icon';img.alt='';img.decoding='async';img.loading='lazy';
 img.src='assets/icons/'+name+'.png?v=lotBC-20261022';
 img.addEventListener('load',()=>container.classList.add('v7-icon-ready'),{once:true});
 img.addEventListener('error',()=>img.remove(),{once:true});
 container.appendChild(img);
}
function decorateAllIcons(){
 document.querySelectorAll('.navigation button[data-go]').forEach(b=>decorateIcon(b.querySelector('.nav-icon'),v7Icons[b.dataset.go]));
 document.querySelectorAll('.zone[data-go]').forEach(b=>decorateIcon(b.querySelector('.zone-emblem'),v7Icons[b.dataset.go]));
 document.querySelectorAll('.clan-card').forEach((c,i)=>decorateIcon(c.querySelector('.clan-sigil'),['clan_stable','clan_twin','clan_evolve','clan_wild'][i]));
 document.querySelectorAll('.daily-step').forEach((c,i)=>decorateIcon(c.querySelector('.daily-step-icon'),['wisdom','scrolls','memory','arena'][i]));
 /* Keep existing wordmark symbol unchanged. */
 decorateIcon(document.querySelector('.engine-heading>span'),v7Icons[view]||'dojo');
 
 // Lot B: mission badges and the sound toggle.
 decorateIcon(document.querySelector('.sound'),'sound');
 document.querySelectorAll('.daily-count').forEach(e=>decorateIcon(e,'checklist'));
 document.querySelectorAll('.daily-head').forEach(e=>decorateIcon(e,'missions'));
 document.querySelectorAll('.daily-finish').forEach(e=>decorateIcon(e,'reward_chest'));
 document.querySelectorAll('.stat-pill.level').forEach(e=>decorateIcon(e,'trophy'));
 document.querySelectorAll('.stat-pill.xp').forEach(e=>decorateIcon(e,'reward_chest'));
 document.querySelectorAll('.v7-icon-ready').forEach(e=>{});
}

function addSensei(){if(document.getElementById('senseiCard'))return;const el=document.createElement('aside');el.id='senseiCard';el.className='sensei-card';el.setAttribute('aria-label','Conseil du Sensei');el.innerHTML=`<div class="sensei-avatar">${v5Portrait("sensei")}</div><div class="sensei-copy"><small>YOUR SENSEI SAYS</small><strong>Every master starts as a learner.</strong><p>Study the four verb clans, then test your skills in the Battle Arena. Each answer brings you closer to mastery.</p></div><button class="sensei-cta" data-go="quiz">TRAIN NOW ↗</button>`;hub.insertAdjacentElement('afterend',el);el.querySelector('button').addEventListener('click',()=>go('quiz'));}

function play(){if(!soundOn)return;try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.setValueAtTime(620,audio.currentTime);o.frequency.exponentialRampToValueAtTime(880,audio.currentTime+.08);g.gain.setValueAtTime(.033,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.13);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.14)}catch(e){}}
function setActive(key,scroll=true){view=key;document.querySelectorAll('[data-go]').forEach(el=>{if(el.closest('.navigation'))el.classList.toggle('active',el.dataset.go===key)});let t=titles[key];document.getElementById('sectionIcon').textContent=t[0];document.getElementById('sectionIcon').classList.remove('v7-icon-ready');document.getElementById('sectionIcon').querySelector('.v7-icon')?.remove();decorateIcon(document.getElementById('sectionIcon'),v7Icons[key]||'dojo');document.getElementById('sectionSubtitle').textContent=t[1];document.getElementById('sectionTitle').textContent=t[2];hero.hidden=key!=='home';hub.hidden=key!=='home';const clans=document.getElementById('clanSection');if(clans)clans.hidden=key!=='home';const sensei=document.getElementById('senseiCard');if(sensei)sensei.hidden=key!=='home';const daily=document.getElementById('dailyPanel');if(daily)daily.hidden=key!=='home';const arena=document.getElementById('v5Battle');if(arena)arena.hidden=key!=='quiz';document.getElementById('backHome').hidden=key==='home';if(scroll&&key!=='home')heading.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(resize,80)}
function go(key){play();if(!loaded){document.getElementById('missing').hidden=false;return}let doc;try{doc=frame.contentDocument}catch(e){return}const tabs=Array.from(doc.querySelectorAll('nav.tabs button'));const order=['home','regles','liste','memory','quiz','progres'];const index=order.indexOf(key);if(index<0||!tabs[index])return;tabs[index].click();setActive(key);setTimeout(resize,180)}
function resize(){if(!loaded)return;cancelAnimationFrame(resizeJob);resizeJob=requestAnimationFrame(()=>{try{const d=frame.contentDocument;const content=d.querySelector('.app-shell');if(content){const h=Math.ceil(Math.max(content.scrollHeight,content.getBoundingClientRect().height)+35);frame.style.height=Math.max(380,Math.min(14000,h))+'px'}}catch(e){}})}
function sync(){try{const progress=JSON.parse(localStorage.getItem('verbforge_progress_v1')||'{}');const xp=Number(progress.xp)||0;const lv=Math.floor(xp/100)+1;document.getElementById('level').textContent=`RANK ${String(lv).padStart(2,'0')}`;document.getElementById('xp').textContent=`✦ ${xp} XP`;document.getElementById('streak').textContent=`${progress.streak||0} DAY STREAK`;document.getElementById('xpbar').style.width=`${xp%100}%`}catch(e){}}
function init(){try{addSensei();renderDaily();v5Mount();v6EnableImages();decorateAllIcons();const d=frame.contentDocument;if(!d.querySelector('nav.tabs')){document.getElementById('missing').hidden=false;frame.hidden=true;return}const l=d.createElement('link');l.rel='stylesheet';l.href='dojo-theme.css';d.head.appendChild(l);loaded=true;d.addEventListener('click',e=>{if(e.target.closest('button'))play()});d.documentElement.style.overflow='hidden';d.body.style.overflow='hidden';const obs=new MutationObserver(()=>{resize();const buttons=Array.from(d.querySelectorAll('nav.tabs button'));const active=buttons.findIndex(el=>el.classList.contains('active'));const keys=['home','regles','liste','memory','quiz','progres'];if(active!==-1&&keys[active]!==view)setActive(keys[active],false);sync()});obs.observe(d.getElementById('root')||d.body,{childList:true,subtree:true,characterData:true});d.fonts?.ready.then(resize);setTimeout(resize,500);setTimeout(resize,2000);sync()}catch(e){document.getElementById('missing').hidden=false}}
document.addEventListener('keydown',e=>{if(e.altKey&&!e.ctrlKey&&!e.metaKey&&/^[1-6]$/.test(e.key)){e.preventDefault();go(['home','regles','liste','memory','quiz','progres'][Number(e.key)-1])}});
frame.addEventListener('load',init);document.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();go(el.dataset.go)}));document.getElementById('backHome').addEventListener('click',()=>go('home'));document.getElementById('sound').addEventListener('click',e=>{soundOn=!soundOn;e.currentTarget.setAttribute('aria-pressed',String(soundOn));if(!e.currentTarget.querySelector('.v7-icon'))e.currentTarget.textContent=soundOn?'♫':'♪';e.currentTarget.classList.toggle('sound-muted',!soundOn);if(soundOn)play()});window.addEventListener('resize',resize);setInterval(()=>{sync();resize()},2400);sync();
})();
