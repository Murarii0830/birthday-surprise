// =============================
// EASY CUSTOMIZATION
// =============================
const CONFIG = {
  herName: "Sahasra",
  nickname: "Tsuma",
  cuteName: "Chinnu",
  myName: "Otto",

  birthdayMessage: "Happy Birthday, {herName} ❤️",

  balloonMessages: [
    `For my {cuteName} ❤️

You have this beautiful way of making ordinary moments feel special.

Even the smallest moments with you somehow become memories I want to keep forever.`,
    `For my {nickname} 🌷

Thank you for every laugh,
every silly conversation,
every little fight,
and every moment that somehow became special just because it was with you.`,
    `Something I want you to know ❤️

You are more precious to me than I can explain.

Your smile matters to me.
Your happiness matters to me.
And I hope you never forget how special you are.`,
    `A birthday wish for you ✨

I hope this new year of your life brings you beautiful surprises,
peaceful days,
big dreams,
and every happiness you deserve.

Keep smiling, {cuteName}.`
  ],

  letter: `Hey {nickname}... ❤️

Happy Birthday, {herName}.

I don't know if a single message can hold everything I feel for you,
but I still wanted to try.

Thank you for every laugh,
every silly conversation,
every cute moment,
every random conversation,
and every little memory that became special just because it was with you.

You mean more to me than I know how to put into words.

So today, my {cuteName},
I just want you to smile...
really smile...

and remember that you are incredibly special to me.

I hope this new year of your life gives you beautiful surprises,
peaceful days,
big dreams,
and every happiness you deserve.

Happy Birthday, my {nickname}. ❤️

Always yours,
{myName} ❤️`,

  finalMessage: `If I could give you one thing today,
it would be the ability to see yourself
the way I see you.

Precious.
Beautiful.
Loved.
And impossible to replace.

Every laugh.
Every silly fight.
Every random conversation.
Every little memory.

I wouldn't trade any of it.

Keep smiling, {cuteName}.

I hope this new year of your life
brings you everything your heart deserves.

Happy Birthday. ❤️

Always yours,
{myName} ❤️`,

  photoCaptions: [
    "That's where one of my favorite memories began...",
    "Look at this smile... ❤️",
    "A little moment I would happily live again.",
    "One more memory I never want to lose.",
    "This one still makes me smile.",
    "Some moments don't need a reason to be special."
  ]
};

const replaceVars = text => text.replace(/\{(herName|nickname|cuteName|myName)\}/g, (_, k) => CONFIG[k]);

const state = {
  scene: "intro",
  balloonOpened: new Set(),
  letterTyped: false,
  wishMade: false,
  rosesTaken: false,
  memories: Array.from({length: 6}, (_, i) => ({
    url: `assets/images/photo${i + 1}.jpg`,
    caption: replaceVars(CONFIG.photoCaptions[i % CONFIG.photoCaptions.length])
  })),
  memoryIndex: 0,
  musicReady: true,
  musicPlaying: false
};

const stage = document.getElementById("stage");
const modalRoot = document.getElementById("modalRoot");
const toastRoot = document.getElementById("toastRoot");
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const musicInput = document.getElementById("musicInput");
const photoInput = document.getElementById("photoInput");
const sceneCounter = document.getElementById("sceneCounter");

const scenes = ["intro","balloons","cake","roses","letter","final","memories"];
function setScene(name){
  stage.classList.remove("letter-active");
  state.scene = name;
  sceneCounter.textContent = name === "intro" ? "" : `${scenes.indexOf(name)+1} / ${scenes.length}`;
  render();
  window.scrollTo(0,0);
}

function render(){
  const renderers = {intro:renderIntro,balloons:renderBalloons,cake:renderCake,roses:renderRoses,letter:renderLetter,final:renderFinal,memories:renderMemories};
  renderers[state.scene]();
}

function scene(inner){
  stage.innerHTML = `<section class="scene"><div class="content">${inner}</div></section>`;
}

function renderIntro(){
  scene(`
    <div class="kicker">A little world, made just for you</div>
    <h1 class="breathe">A little surprise<br>for you...</h1>
    <p class="subtitle">Take a breath. Stay for a while.<br>There are a few things I wanted to tell you.</p>
    <div class="btn-row">
      <button class="btn btn-primary" id="yesBtn">YES ❤️</button>
      <button class="btn btn-ghost" id="noBtn">NO 🙈</button>
    </div>
  `);
  document.getElementById("yesBtn").onclick = () => { startMusicIfReady(); setScene("balloons"); };
  const no = document.getElementById("noBtn");
  let n=0;
  no.onclick = () => {
    n++;
    const messages = ["No? Really, Chinnu? 😌","I'm not accepting that answer 😂","Okay... press YES ❤️"];
    no.textContent = messages[Math.min(n-1,2)];
    no.style.transform = `translate(${(Math.random()*36-18).toFixed(0)}px, ${(Math.random()*18-9).toFixed(0)}px)`;
  };
}

function renderBalloons(){
  const all = state.balloonOpened.size === 4;
  const balloon = (i, cls) => `
    <button class="balloon ${cls}" data-balloon="${i}" aria-label="Open balloon ${i+1}">
      <span class="body"></span><span class="knot"></span><span class="string"></span>
    </button>`;
  scene(`
    <div class="kicker">Birthday surprise • ${state.balloonOpened.size}/4 opened</div>
    <h2>Pop these balloons,<br>${CONFIG.nickname} 🎈</h2>
    <p class="subtitle">Each one has something I want to tell you.</p>
    <div class="balloon-wrap">
      ${balloon(0,"b1")}${balloon(1,"b2")}${balloon(2,"b3")}${balloon(3,"b4")}
    </div>
    <div class="progress">${state.balloonOpened.size} / 4</div>
  `);
  document.querySelectorAll("[data-balloon]").forEach(el => el.onclick = () => {
    const i = Number(el.dataset.balloon);
    if(state.balloonOpened.has(i)) return;
    state.balloonOpened.add(i);
    burst(el);
    const isLast = state.balloonOpened.size === 4;
    showMessageModal(replaceVars(CONFIG.balloonMessages[i]), () => {
      if (isLast) {
        setScene("cake");
      } else {
        render();
      }
    });
  });
}

function burst(origin){
  const r=origin.getBoundingClientRect(), b=document.createElement("div");
  b.className="burst"; b.style.position="fixed"; b.style.left=r.left+"px"; b.style.top=r.top+"px"; b.style.width=r.width+"px"; b.style.height=r.height+"px"; b.style.zIndex=80;
  for(let i=0;i<14;i++){const s=document.createElement("i"); const a=(Math.PI*2*i)/14, d=50+Math.random()*60; s.style.left="50%";s.style.top="50%";s.style.setProperty("--dx",`${Math.cos(a)*d}px`);s.style.setProperty("--dy",`${Math.sin(a)*d}px`);b.appendChild(s)}
  document.body.appendChild(b); setTimeout(()=>b.remove(),1000); tone(660,.08);
}

function showMessageModal(message, done){
  modalRoot.innerHTML = `<div class="modal-backdrop"><div class="modal"><div class="script" style="font-size:26px;color:#a32d55">A little note ❤️</div><p>${escapeHtml(message)}</p><button class="btn btn-primary" id="modalContinue">Keep going ❤️</button></div></div>`;
  document.getElementById("modalContinue").onclick=()=>{modalRoot.innerHTML="";done();};
}

function renderCake(){
  scene(`
    <div class="kicker">Make a wish</div>
    <div class="cake" aria-label="Birthday cake">
      <div class="plate"></div><div class="tier one"></div><div class="tier two"></div><div class="tier three"></div>
      <div class="candle"><span class="flame" id="flame"></span><span class="smoke" id="smoke"></span></div>
    </div>
    <h2>Now make a wish,<br>${CONFIG.herName}...</h2>
    <p class="subtitle">Close your eyes...<br>make a wish... ✨</p>
    ${state.wishMade ? `<div class="btn-row"><button class="btn btn-primary" id="wishBtn">My wish is made</button></div>` : `<div class="small">Tap the candle flame.</div>`}
  `);
  if(!state.wishMade){
    document.getElementById("flame").onclick=()=>{
      state.wishMade=true; document.getElementById("flame").style.display="none"; document.getElementById("smoke").style.display="block"; burst(document.getElementById("smoke")); tone(240,.12); setTimeout(render,700);
    };
  } else document.getElementById("wishBtn").onclick=()=>setScene("roses");
}

function renderRoses(){
  scene(`
    <div class="kicker">One more thing...</div>
    <div class="rose-scene"><div class="rose r1"></div><div class="rose r2"></div><div class="rose r3"></div><div class="rose r4"></div><div class="rose r5"></div></div>
    <h2>These flowers are<br>for you, ${CONFIG.cuteName} 🌹</h2>
    <p class="subtitle">Because one flower could never be enough for someone as special as you.</p>
    <div class="btn-row"><button class="btn btn-primary" id="rosesBtn">Take these 🌹</button></div>
  `);
  document.getElementById("rosesBtn").onclick=()=>{state.rosesTaken=true;setScene("letter");};
}

function renderLetter(){
  stage.classList.add("letter-active");
  scene(`
    <div class="kicker">From my heart</div>
    <h2>A little letter<br>for you 💌</h2>
    <p class="subtitle">Tap the envelope. Take your time reading it.</p>
    <div class="envelope" id="envelope">
      <div class="env-body"></div><div class="env-left"></div><div class="env-right"></div>
      <div class="flap"></div><div class="seal">♥</div>
      <div class="letter"><div class="letter-text" id="letterText"></div></div>
    </div>
  `);
  const next=document.createElement("button");
  next.id="letterNext";
  next.className="btn btn-primary hidden";
  next.type="button";
  next.textContent="Continue ❤️";
  stage.appendChild(next);
  const env=document.getElementById("envelope"), text=document.getElementById("letterText");
  const positionContinue=()=>{
    if(next.classList.contains("hidden") || !env.classList.contains("open")) return;
    next.style.bottom="max(12px, calc(env(safe-area-inset-bottom) + 10px))";
  };
  env.onclick=()=>{
    if(env.classList.contains("open")) return;
    env.classList.add("open"); tone(420,.1);
    next.classList.add("hidden");
    typeText(text, replaceVars(CONFIG.letter), 24, ()=>{
      next.classList.remove("hidden");
      requestAnimationFrame(positionContinue);
    });
  };
  window.addEventListener("resize",positionContinue,{passive:true});
  if(window.visualViewport) window.visualViewport.addEventListener("resize",positionContinue,{passive:true});
  next.onclick=()=>setScene("final");
}

function typeText(el,text,speed,done){
  if(state.letterTyped){el.textContent=text;done?.();return}
  let i=0; state.letterTyped=true;
  const tick=()=>{el.textContent=text.slice(0,i++); if(i<=text.length) setTimeout(tick,speed); else done?.()};
  tick();
}

function renderFinal(){
  scene(`
    <div class="kicker">One last thing...</div>
    <h1>Happy Birthday,<br>${CONFIG.herName} ❤️</h1>
    <p class="script" style="font-size:27px;color:#fff;margin:25px 0 5px">My ${CONFIG.cuteName}. My ${CONFIG.nickname}. My favorite person.</p>
    <p class="subtitle">${escapeHtml(replaceVars(CONFIG.finalMessage))}</p>
    <div class="btn-row">
      <button class="btn btn-primary" id="memBtn">Want to see our memories? ❤️</button>
    </div>
  `);
  startMusicIfReady(true);
  document.getElementById("memBtn").onclick=()=>setScene("memories");
}

function renderMemories(){
  const item = state.memories[state.memoryIndex];
  scene(`
    <div class="memory-card">
      <div class="kicker">Memory ${String(state.memoryIndex+1).padStart(2,"0")} / ${state.memories.length}</div>
      <div class="memory-photo-wrap">
        <img class="memory-photo" src="${item.url}" alt="Memory ${state.memoryIndex+1}">
        <div class="memory-overlay"><div class="memory-caption">${escapeHtml(item.caption)}</div></div>
      </div>
      <p class="subtitle">A moment I would happily keep forever. ❤️</p>
      <div class="btn-row">
        <button class="btn btn-primary" id="nextMemory">
          ${state.memoryIndex===state.memories.length-1 ? "Replay the journey ❤️" : "Next memory →"}
        </button>
      </div>
    </div>
  `);
  document.getElementById("nextMemory").onclick=()=>{
    if(state.memoryIndex===state.memories.length-1){
      state.memoryIndex=0;
      setScene("intro");
    } else {
      state.memoryIndex++;
      render();
    }
  };
}

function handlePhotos(e){
  // Creator photo uploads are intentionally disabled in the recipient version.
  toast("These memories are already prepared for you ❤️");
}

function handleMusic(e){
  // Creator music uploads are intentionally disabled in the recipient version.
  toast("Your birthday music is already waiting ♫");
}


bgMusic.src = "assets/music/birthday-song.mp3";
bgMusic.loop = true;
state.musicReady = true;

musicBtn.onclick=()=>{
  if(state.musicPlaying){
    bgMusic.pause();
    state.musicPlaying=false;
    musicBtn.textContent="♫";
  } else {
    startMusicIfReady();
  }
};

async function startMusicIfReady(finalBoost=false){
  if(!state.musicReady)return;
  try{
    bgMusic.volume = finalBoost ? .35 : .22;
    await bgMusic.play();
    state.musicPlaying=true;
    musicBtn.textContent="❚❚";
  }catch{}
}


function tone(freq,duration){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.type="sine";g.gain.value=.025;o.connect(g);g.connect(c.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+duration);o.stop(c.currentTime+duration);
  }catch{}
}
function toast(msg){toastRoot.innerHTML=`<div class="toast">${escapeHtml(msg)}</div>`;setTimeout(()=>toastRoot.innerHTML="",2100)}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function seedAmbient(){
  const p=document.getElementById("particles"),h=document.getElementById("hearts");
  for(let i=0;i<38;i++){const e=document.createElement("i");e.className="particle";e.style.left=Math.random()*100+"%";e.style.top=Math.random()*100+"%";e.style.setProperty("--d",(2+Math.random()*5)+"s");e.style.animationDelay=-Math.random()*5+"s";p.appendChild(e)}
  for(let i=0;i<12;i++){const e=document.createElement("i");e.className="heart-p";e.textContent=Math.random()>.5?"♡":"✦";e.style.setProperty("--x",Math.random()*100+"%");e.style.setProperty("--s",(10+Math.random()*18)+"px");e.style.setProperty("--d",(10+Math.random()*14)+"s");e.style.animationDelay=-Math.random()*12+"s";h.appendChild(e)}
}
seedAmbient();render();
