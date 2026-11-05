(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();class ch{constructor(){this.ctx=null,this.master=null,this.musicGain=null,this.sfxGain=null,this.noise=null,this.muted=!1,this.started=!1,this.step=0,this.nextNote=0,this.musicOn=!1,this.intensity=0}async init(){if(this.ctx){this.ctx.state==="suspended"&&await this.ctx.resume();return}const t=window.AudioContext||window.webkitAudioContext;if(!t)return;this.ctx=new t,this.master=this.ctx.createGain(),this.master.gain.value=this.muted?0:.72;const e=this.ctx.createDynamicsCompressor();e.threshold.value=-18,e.knee.value=16,e.ratio.value=5,e.attack.value=.003,e.release.value=.24,this.master.connect(e).connect(this.ctx.destination),this.musicGain=this.ctx.createGain(),this.musicGain.gain.value=.14,this.musicGain.connect(this.master),this.sfxGain=this.ctx.createGain(),this.sfxGain.gain.value=.72,this.sfxGain.connect(this.master);const n=this.ctx.sampleRate*2,s=this.ctx.createBuffer(1,n,this.ctx.sampleRate),r=s.getChannelData(0);for(let a=0;a<n;a++)r[a]=Math.random()*2-1;this.noise=s,this.startWind(),this.started=!0}setMuted(t){this.muted=t,this.master&&this.ctx&&(this.master.gain.cancelScheduledValues(this.ctx.currentTime),this.master.gain.linearRampToValueAtTime(t?0:.72,this.ctx.currentTime+.12))}startWind(){const t=this.ctx.createBufferSource();t.buffer=this.noise,t.loop=!0;const e=this.ctx.createBiquadFilter();e.type="lowpass",e.frequency.value=340,e.Q.value=.6;const n=this.ctx.createGain();n.gain.value=.028;const s=this.ctx.createOscillator();s.frequency.value=.07;const r=this.ctx.createGain();r.gain.value=.012,s.connect(r).connect(n.gain),t.connect(e).connect(n).connect(this.master),t.start(),s.start(),this.wind={src:t,gain:n,filter:e}}noiseBurst(t=.22,e=.6,n=900,s=.8,r="lowpass"){if(!this.ctx)return;const a=this.ctx.currentTime,o=this.ctx.createBufferSource();o.buffer=this.noise;const l=this.ctx.createBiquadFilter();l.type=r,l.frequency.setValueAtTime(n,a),l.frequency.exponentialRampToValueAtTime(Math.max(100,n*.28),a+t),l.Q.value=s;const c=this.ctx.createGain();c.gain.setValueAtTime(e,a),c.gain.exponentialRampToValueAtTime(.001,a+t),o.connect(l).connect(c).connect(this.sfxGain),o.start(a),o.stop(a+t)}tone(t,e,n=.1,s="sine",r=null,a=0){if(!this.ctx)return;const o=this.ctx.currentTime+a,l=this.ctx.createOscillator(),c=this.ctx.createGain();l.type=s,l.frequency.setValueAtTime(t,o),r&&l.frequency.exponentialRampToValueAtTime(r,o+e),c.gain.setValueAtTime(1e-4,o),c.gain.linearRampToValueAtTime(n,o+.006),c.gain.exponentialRampToValueAtTime(1e-4,o+e),l.connect(c).connect(this.sfxGain),l.start(o),l.stop(o+e+.02)}shot(){this.ctx&&(this.noiseBurst(.3,.75,2100,1.1),this.noiseBurst(.14,.35,5600,.8,"highpass"),this.tone(92,.2,.3,"sine",38),this.tone(42,.3,.22,"triangle",28))}empty(){this.tone(540,.06,.1,"square",320),this.tone(210,.06,.06,"square",160,.04)}reload(){this.tone(320,.05,.1,"square",240),this.tone(640,.04,.08,"square",480,.36),this.tone(410,.06,.09,"square",280,.78)}hit(){this.noiseBurst(.08,.22,1500,.6),this.tone(130,.1,.12,"triangle",60)}crit(){this.tone(880,.06,.08,"square",1400),this.tone(1600,.05,.05,"sine",1900,.04)}splat(){this.noiseBurst(.22,.28,700,.7),this.tone(75,.25,.14,"sawtooth",32)}growl(){if(!this.ctx)return;const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain(),s=this.ctx.createBiquadFilter();e.type="sawtooth",e.frequency.setValueAtTime(56+Math.random()*16,t),e.frequency.exponentialRampToValueAtTime(38,t+.55),s.type="lowpass",s.frequency.value=260,n.gain.setValueAtTime(1e-4,t),n.gain.linearRampToValueAtTime(.055,t+.08),n.gain.exponentialRampToValueAtTime(1e-4,t+.6),e.connect(s).connect(n).connect(this.sfxGain),e.start(t),e.stop(t+.62)}hurt(){this.noiseBurst(.18,.4,650,.6),this.tone(180,.22,.16,"sawtooth",70)}repair(){this.tone(310,.12,.13,"square",620),this.tone(460,.18,.1,"triangle",220,.09),this.noiseBurst(.1,.1,2400,1.4,"bandpass")}trap(){this.noiseBurst(.08,.32,3200,.9,"bandpass"),this.tone(900,.18,.13,"square",120),this.tone(70,.3,.16,"triangle",35,.04)}build(){this.noiseBurst(.12,.2,1600,.4),this.tone(190,.08,.1,"square",110)}reloadDone(){this.tone(720,.06,.1,"square",920),this.tone(380,.05,.06,"square",300,.08)}ui(){this.tone(620,.04,.055,"square",820)}levelUp(){[392,523,659,784].forEach((t,e)=>this.tone(t,.18,.065,"triangle",null,e*.08))}horn(){if(!this.ctx)return;const t=this.ctx.currentTime;[138,174,207].forEach((e,n)=>{const s=this.ctx.createOscillator(),r=this.ctx.createGain();s.type=n===1?"sawtooth":"square",s.frequency.value=e,r.gain.setValueAtTime(1e-4,t),r.gain.linearRampToValueAtTime(.055,t+.15),r.gain.exponentialRampToValueAtTime(1e-4,t+1.15),s.connect(r).connect(this.sfxGain),s.start(t),s.stop(t+1.2)})}victory(){[262,330,392,523,659].forEach((t,e)=>this.tone(t,.5,.08,"triangle",null,e*.12)),this.noiseBurst(.7,.05,3e3,.4)}death(){[196,165,131,98].forEach((t,e)=>this.tone(t,.5,.1,"sawtooth",t*.92,e*.16)),this.noiseBurst(1.2,.1,500,.4)}startMusic(){!this.ctx||this.musicOn||(this.musicOn=!0,this.step=0,this.nextNote=this.ctx.currentTime+.1,this.musicGain.gain.setTargetAtTime(.13,this.ctx.currentTime,.4))}stopMusic(){this.musicOn=!1,this.musicGain&&this.musicGain.gain.setTargetAtTime(1e-4,this.ctx.currentTime,.4)}update(t=0){if(!this.ctx||!this.musicOn)return;this.intensity=t;const e=104+t*18,n=60/e/2;for(;this.nextNote<this.ctx.currentTime+.16;)this.playStep(this.step,this.nextNote,e),this.nextNote+=n,this.step=(this.step+1)%32}playStep(t,e,n){this.ctx;const s=Math.floor(t/8),r=t%8,o=[55,55,43.65,49][s%4];(r===0||r===4)&&this.musicKick(e,r===0?.16:.1),(r===2||r===6)&&this.musicSnare(e),t%2===1&&this.musicHat(e,.012);const c=o*Math.pow(2,[0,0,12,7,0,0,-5,7][r]/12);(r%2===0||Math.random()>.45)&&this.musicBass(c,e,r===0?.11:.075),(r===1||r===5)&&this.musicTwang(o*4,e),s===3&&r===7&&this.musicTwang(o*6,e+.02),this.musicShaker(e,.009)}musicKick(t,e){const n=this.ctx.createOscillator(),s=this.ctx.createGain();n.type="sine",n.frequency.setValueAtTime(105,t),n.frequency.exponentialRampToValueAtTime(42,t+.14),s.gain.setValueAtTime(e,t),s.gain.exponentialRampToValueAtTime(1e-4,t+.18),n.connect(s).connect(this.musicGain),n.start(t),n.stop(t+.2)}musicSnare(t){const e=this.ctx.createBufferSource();e.buffer=this.noise;const n=this.ctx.createBiquadFilter();n.type="bandpass",n.frequency.value=1600,n.Q.value=.7;const s=this.ctx.createGain();s.gain.setValueAtTime(.055,t),s.gain.exponentialRampToValueAtTime(1e-4,t+.11),e.connect(n).connect(s).connect(this.musicGain),e.start(t),e.stop(t+.12)}musicHat(t,e){const n=this.ctx.createBufferSource();n.buffer=this.noise;const s=this.ctx.createBiquadFilter();s.type="highpass",s.frequency.value=6100;const r=this.ctx.createGain();r.gain.setValueAtTime(e,t),r.gain.exponentialRampToValueAtTime(1e-4,t+.035),n.connect(s).connect(r).connect(this.musicGain),n.start(t),n.stop(t+.04)}musicShaker(t,e){if(Math.random()>.7)return;const n=this.ctx.createBufferSource();n.buffer=this.noise;const s=this.ctx.createBiquadFilter();s.type="bandpass",s.frequency.value=7300,s.Q.value=1.2;const r=this.ctx.createGain();r.gain.setValueAtTime(e,t),r.gain.exponentialRampToValueAtTime(1e-4,t+.06),n.connect(s).connect(r).connect(this.musicGain),n.start(t),n.stop(t+.07)}musicBass(t,e,n){const s=this.ctx.createOscillator(),r=this.ctx.createGain(),a=this.ctx.createBiquadFilter();a.type="lowpass",a.frequency.value=500,s.type="triangle",s.frequency.value=t,r.gain.setValueAtTime(1e-4,e),r.gain.linearRampToValueAtTime(n,e+.015),r.gain.exponentialRampToValueAtTime(1e-4,e+.15),s.connect(a).connect(r).connect(this.musicGain),s.start(e),s.stop(e+.17)}musicTwang(t,e){const n=this.ctx.createOscillator(),s=this.ctx.createGain(),r=this.ctx.createBiquadFilter();r.type="lowpass",r.frequency.setValueAtTime(2400,e),r.frequency.exponentialRampToValueAtTime(800,e+.18),n.type="sawtooth",n.frequency.setValueAtTime(t,e),n.frequency.exponentialRampToValueAtTime(t*.995,e+.2),s.gain.setValueAtTime(.022,e),s.gain.exponentialRampToValueAtTime(1e-4,e+.22),n.connect(r).connect(s).connect(this.musicGain),n.start(e),n.stop(e+.24)}}const se=(i,t=document)=>t.querySelector(i),hh=(i,t=document)=>[...t.querySelectorAll(i)],uh=["THE FIRST KNOCK","UNPAID GUESTS","THE DINER CROWD","FULL HOUSE","CHECKOUT TIME","LAST CALL"];class dh{constructor(){this.hud=se("#hud"),this.start=se("#start-screen"),this.pause=se("#pause-screen"),this.end=se("#end-screen"),this.lock=se("#target-lock"),this.healthFill=se("#health-fill"),this.healthText=se("#health-text"),this.statusRow=se(".status-row"),this.statusText=se("#status-text"),this.shells=se("#shells"),this.reloadLabel=se("#reload-label"),this.score=se("#score"),this.scrap=se("#scrap"),this.waveTitle=se("#wave-title"),this.waveState=se("#wave-state"),this.nightLabel=se("#night-label"),this.waveProgress=se("#wave-progress"),this.clearBanner=se("#clear-banner"),this.breakBanner=se("#break-banner"),this.breakCount=se("#break-count"),this.clearBonus=se("#clear-bonus"),this.toasts=se("#toast-stack"),this.damageFlash=se("#damage-flash"),this.lowHealth=se("#low-health"),this.objective=se("#objective"),this.objectiveTitle=se("#objective-title"),this.objectiveSub=se("#objective-sub"),this.repairBtn=se("#repair-btn"),this.trapBtn=se("#trap-btn"),this.fireBtn=se("#fire-btn"),this.barrierRows=hh(".barricade-row"),this.muteBtn=se("#mute-btn"),this.lastShells=-1,this.lastHealth=-1,this.lastScrap=-1,this.lastScore=-1,this.floatEls=[],this.toastTimers=[],this.endStamp=se("#end-stamp"),this.endKicker=se("#end-kicker"),this.endTitle=se("#end-title"),this.endCopy=se("#end-copy")}setPlaying(t){this.hud.classList.toggle("hidden",!t)}hideStart(){this.start.classList.add("leaving"),setTimeout(()=>this.start.classList.add("hidden"),620)}showStart(){this.start.classList.remove("hidden","leaving"),this.hud.classList.add("hidden"),this.end.classList.add("hidden"),this.pause.classList.add("hidden")}showHud(){this.hud.classList.remove("hidden"),this.objective.classList.remove("fade")}setMuted(t){this.muteBtn.classList.toggle("muted",t),this.muteBtn.setAttribute("aria-label",t?"Unmute sound":"Mute sound")}setHealth(t,e,n=!1){const s=Math.max(0,t/e);this.lastHealth!==Math.round(t)&&(this.healthFill.style.width=`${s*100}%`,this.healthText.textContent=Math.max(0,Math.ceil(t)),this.lowHealth.classList.toggle("on",s<.35),this.statusRow.classList.toggle("hurt",s<.45||n),this.statusText.textContent=s<.2?"CRITICAL":s<.45?"BLEEDING":n?"STUNG":"STEADY",this.healthFill.style.background=s<.3?"linear-gradient(90deg,#7d1717,#e23b31)":s<.55?"linear-gradient(90deg,#a83731,#f28d4a)":"linear-gradient(90deg,#a83731,#d74b40 60%,#ee7054)",this.lastHealth=Math.round(t))}setScore(t){t!==this.lastScore&&(this.lastScore=t,this.score.textContent=String(Math.max(0,Math.floor(t))).padStart(6,"0"))}setScrap(t){t!==this.lastScrap&&(this.lastScrap=t,this.scrap.textContent=String(t).padStart(2,"0"))}setAmmo(t,e,n){if(t!==this.lastShells){if(this.lastShells=t,this.shells.children.length!==e){this.shells.innerHTML="";for(let s=0;s<e;s++){const r=document.createElement("i");r.className="shell",this.shells.appendChild(r)}}[...this.shells.children].forEach((s,r)=>s.classList.toggle("empty",r>=t))}this.reloadLabel.classList.toggle("hidden",!n)}setWave(t,e,n,s=0){const r=String(t+1).padStart(2,"0");this.nightLabel.textContent=`NIGHT ${r}`,n==="break"?(this.waveState.textContent="REGROUP",this.waveTitle.textContent="THEY COME IN WAVES"):n==="victory"?(this.waveState.textContent="DAWN",this.waveTitle.textContent="SUNRISE"):(this.waveState.textContent=`WAVE ${t+1} / ${e}`,this.waveTitle.textContent=uh[t]||"HOLD THE LINE")}setWaveProgress(t){this.waveProgress.style.width=`${Math.min(1,Math.max(0,t))*100}%`}setBarriers(t){t.forEach((e,n)=>{const s=this.barrierRows[n];if(!s)return;const r=Math.max(0,e.hp/e.maxHp);s.querySelector(".mini-bar span").style.width=`${r*100}%`,s.querySelector("b").textContent=e.destroyed?"OPEN":`${Math.round(r*100)}%`,s.classList.toggle("crit",r<.3||e.destroyed),s.classList.toggle("warn",r>=.3&&r<.6)})}setRepairReady(t){this.repairBtn.classList.toggle("armed",t)}showTarget(t,e,n=!0){if(!n||!t){this.lock.classList.add("hidden");return}const s=t.clone().project(e);if(s.z>1||s.z<-1||Math.abs(s.x)>1.2||Math.abs(s.y)>1.2){this.lock.classList.add("hidden");return}const r=(s.x*.5+.5)*window.innerWidth,a=(-s.y*.5+.5)*window.innerHeight;this.lock.style.left=`${r}px`,this.lock.style.top=`${a}px`,this.lock.classList.remove("hidden")}hitPulse(t=!1){this.lock.style.transform="translate(-50%, -50%) scale(1.3)",this.lock.querySelector("span").style.color=t?"#ffdc86":"#d74b40",clearTimeout(this.hitTimer),this.hitTimer=setTimeout(()=>{this.lock&&(this.lock.style.transform="translate(-50%, -50%) scale(1)",this.lock.querySelector("span").style.color="#d74b40")},90)}damage(){this.damageFlash.classList.add("hit"),clearTimeout(this.damageTimer),this.damageTimer=setTimeout(()=>this.damageFlash.classList.remove("hit"),100)}toast(t,e=""){const n=document.createElement("div");n.className=`toast ${e}`,n.textContent=t,this.toasts.appendChild(n);const s=setTimeout(()=>n.remove(),2200);this.toastTimers.push(s)}objectiveSet(t,e){this.objectiveTitle.textContent=t,this.objectiveSub.textContent=e,this.objective.classList.remove("fade")}fadeObjective(){this.objective.classList.add("fade")}showClear(t,e){this.clearBanner.classList.remove("hidden"),this.clearBonus.textContent=`+${t} SCRAP`,setTimeout(()=>this.clearBanner.classList.add("hidden"),3300)}showBreak(t){this.breakBanner.classList.remove("hidden"),this.breakCount.textContent=`00:0${Math.max(0,Math.ceil(t))}`,this.breakCount.style.color=t<3?"#d74b40":""}updateBreak(t){this.breakCount.textContent=`00:0${Math.max(0,Math.ceil(t))}`,this.breakCount.style.color=t<3?"#d74b40":""}hideBreak(){this.breakBanner.classList.add("hidden")}floatText(t,e,n,s=""){const r=t.clone().project(e);if(r.z>1)return;const a=(r.x*.5+.5)*window.innerWidth,o=(-r.y*.5+.5)*window.innerHeight,l=document.createElement("div");l.className=`damage-num ${s}`,l.textContent=n,l.style.left=`${a+(Math.random()-.5)*20}px`,l.style.top=`${o}px`,document.body.appendChild(l),setTimeout(()=>l.remove(),900)}showPause(t){this.pause.classList.toggle("hidden",!t)}showEnd({victory:t,waves:e,kills:n,score:s,best:r}){this.end.classList.remove("hidden"),this.hud.classList.add("hidden"),this.endStamp.textContent=t?"SURVIVED":"YOU DIED",this.endStamp.style.webkitTextStroke=t?"2px rgba(242,167,59,.55)":"2px rgba(215,75,64,.48)",this.endKicker.textContent=t?"THE SUN CAME UP":"THE NIGHT WINS",this.endTitle.innerHTML=t?"THE ROAD IS<br/>YOURS AGAIN.":"THE MOTEL<br/>KEEPS ITS GUESTS.",this.endCopy.textContent=t?"Six waves. One busted shotgun. A sunrise worth waiting for.":"They got through the line. They always do. But the night can be beaten.",se("#stat-wave").textContent=`${e} / 6`,se("#stat-kills").textContent=String(n),se("#stat-score").textContent=String(s).padStart(6,"0"),se("#stat-best").textContent=String(r).padStart(6,"0")}hideEnd(){this.end.classList.add("hidden")}reset(){this.setScore(0),this.setScrap(8),this.setHealth(100,100),this.setAmmo(8,8,!1),this.clearBanner.classList.add("hidden"),this.breakBanner.classList.add("hidden"),this.lock.classList.add("hidden"),this.lowHealth.classList.remove("on"),this.toasts.innerHTML="",this.setRepairReady(!1)}}class fh{constructor(t){this.cb=t,this.keys=new Set,this.joy={x:0,y:0,active:!1,id:null},this.firing=!1,this.enabled=!1,this.isTouch="ontouchstart"in window||navigator.maxTouchPoints>0||window.matchMedia("(pointer: coarse)").matches,this.updateTouchClass=()=>document.body.classList.toggle("touch",this.isTouch||innerWidth<=900),this.updateTouchClass(),window.addEventListener("resize",this.updateTouchClass),this.zone=document.getElementById("joystick-zone"),this.knob=document.getElementById("joystick-knob"),this.fireBtn=document.getElementById("fire-btn"),this.repairBtn=document.getElementById("repair-btn"),this.trapBtn=document.getElementById("trap-btn"),this.canvas=document.getElementById("game"),this.bindJoystick(),this.bindButtons(),this.bindKeyboard(),this.bindScreens()}bindJoystick(){const t=n=>{const s=this.zone.getBoundingClientRect(),r=s.left+s.width/2,a=s.top+s.height/2;let o=n.clientX-r,l=n.clientY-a;const c=Math.hypot(o,l),h=s.width*.34;c>h&&(o=o/c*h,l=l/c*h),this.knob.style.transform=`translate(${o}px, ${l}px)`,this.joy.x=o/h,this.joy.y=l/h},e=()=>{this.joy.active=!1,this.joy.id=null,this.joy.x=0,this.joy.y=0,this.knob.style.transform="translate(0px, 0px)"};this.zone.addEventListener("pointerdown",n=>{if(this.enabled){n.preventDefault(),this.joy.active=!0,this.joy.id=n.pointerId;try{this.zone.setPointerCapture(n.pointerId)}catch{}t(n)}}),this.zone.addEventListener("pointermove",n=>{!this.joy.active||n.pointerId!==this.joy.id||(n.preventDefault(),t(n))});for(const n of["pointerup","pointercancel","lostpointercapture"])this.zone.addEventListener(n,s=>{s.pointerId===this.joy.id&&e()});this.zone.addEventListener("dblclick",n=>n.preventDefault())}holdButton(t,e,n){t.addEventListener("pointerdown",r=>{if(this.enabled){r.preventDefault();try{t.setPointerCapture(r.pointerId)}catch{}t.classList.add("pressed"),e()}});const s=r=>{t.classList.remove("pressed"),n()};for(const r of["pointerup","pointercancel","lostpointercapture"])t.addEventListener(r,s)}bindButtons(){this.holdButton(this.fireBtn,()=>{this.firing=!0,this.fireBtn.classList.add("firing")},()=>{this.firing=!1,this.fireBtn.classList.remove("firing")}),this.repairBtn.addEventListener("pointerdown",t=>{this.enabled&&(t.preventDefault(),this.cb.onAction?.("repair"))}),this.trapBtn.addEventListener("pointerdown",t=>{this.enabled&&(t.preventDefault(),this.cb.onAction?.("trap"))}),this.isTouch||(this.canvas.addEventListener("mousedown",t=>{!this.enabled||t.button!==0||(t.preventDefault(),this.firing=!0)}),window.addEventListener("mouseup",()=>{this.firing=!1}),this.canvas.addEventListener("contextmenu",t=>t.preventDefault())),window.addEventListener("blur",()=>{this.firing=!1,this.keys.clear()}),document.addEventListener("visibilitychange",()=>{document.hidden&&(this.firing=!1,this.keys.clear(),this.cb.onHidden?.())})}bindKeyboard(){window.addEventListener("keydown",t=>{["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(t.code)&&t.preventDefault(),this.keys.add(t.code),!t.repeat&&(t.code==="KeyE"&&this.cb.onAction?.("repair"),t.code==="KeyQ"&&this.cb.onAction?.("trap"),t.code==="KeyR"&&this.cb.onAction?.("reload"),(t.code==="Escape"||t.code==="KeyP")&&this.cb.onPause?.(),t.code==="Space"&&this.enabled&&(this.firing=!0))}),window.addEventListener("keyup",t=>{this.keys.delete(t.code),t.code==="Space"&&(this.firing=!1)})}bindScreens(){const t=(e,n)=>{document.getElementById(e)?.addEventListener("click",r=>{r.preventDefault(),n()})};t("start-btn",()=>this.cb.onStart?.()),t("resume-btn",()=>this.cb.onResume?.()),t("quit-btn",()=>this.cb.onQuit?.()),t("retry-btn",()=>this.cb.onRetry?.()),t("end-quit-btn",()=>this.cb.onQuit?.()),t("mute-btn",()=>this.cb.onMute?.()),t("pause-btn",()=>this.cb.onPause?.())}movement(){let t=0,e=0;(this.keys.has("KeyA")||this.keys.has("ArrowLeft"))&&(t-=1),(this.keys.has("KeyD")||this.keys.has("ArrowRight"))&&(t+=1),(this.keys.has("KeyW")||this.keys.has("ArrowUp"))&&(e-=1),(this.keys.has("KeyS")||this.keys.has("ArrowDown"))&&(e+=1),t+=this.joy.x,e+=this.joy.y;const n=Math.hypot(t,e);return n>1&&(t/=n,e/=n),{x:t,z:e,len:Math.min(1,n)}}setEnabled(t){this.enabled=t,t||(this.firing=!1,this.joy.x=0,this.joy.y=0,this.joy.active=!1,this.knob.style.transform="translate(0,0)")}}const Po="180",ph=0,Qo=1,mh=2,fc=1,pc=2,Nn=3,Hn=0,We=1,je=2,On=0,yi=1,Qe=2,tl=3,el=4,gh=5,_i=100,_h=101,xh=102,vh=103,Mh=104,yh=200,Sh=201,Eh=202,Th=203,Ua=204,Na=205,bh=206,wh=207,Ah=208,Rh=209,Ch=210,Ph=211,Lh=212,Dh=213,Ih=214,Fa=0,Oa=1,Ba=2,Qi=3,za=4,ka=5,Ha=6,Va=7,mc=0,Uh=1,Nh=2,ei=0,gc=1,_c=2,xc=3,Lo=4,vc=5,Mc=6,yc=7,Sc=300,ts=301,es=302,Ga=303,Wa=304,Nr=306,ws=1e3,vi=1001,Xa=1002,pn=1003,Fh=1004,Gs=1005,_n=1006,Wr=1007,Mi=1008,yn=1009,Ec=1010,Tc=1011,As=1012,Do=1013,Si=1014,Fn=1015,Mn=1016,Io=1017,Uo=1018,Rs=1020,bc=35902,wc=35899,Ac=1021,Rc=1022,fn=1023,Cs=1026,Ps=1027,Cc=1028,No=1029,Pc=1030,Fo=1031,Oo=1033,yr=33776,Sr=33777,Er=33778,Tr=33779,qa=35840,Ya=35841,Za=35842,Ka=35843,$a=36196,Ja=37492,ja=37496,Qa=37808,to=37809,eo=37810,no=37811,io=37812,so=37813,ro=37814,ao=37815,oo=37816,lo=37817,co=37818,ho=37819,uo=37820,fo=37821,po=36492,mo=36494,go=36495,_o=36283,xo=36284,vo=36285,Mo=36286,Oh=3200,Bh=3201,Lc=0,zh=1,ti="",qe="srgb",ns="srgb-linear",Rr="linear",me="srgb",Pi=7680,nl=519,kh=512,Hh=513,Vh=514,Dc=515,Gh=516,Wh=517,Xh=518,qh=519,yo=35044,il="300 es",xn=2e3,Cr=2001;class as{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const ze=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Xr=Math.PI/180,So=180/Math.PI;function Bn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ze[i&255]+ze[i>>8&255]+ze[i>>16&255]+ze[i>>24&255]+"-"+ze[t&255]+ze[t>>8&255]+"-"+ze[t>>16&15|64]+ze[t>>24&255]+"-"+ze[e&63|128]+ze[e>>8&255]+"-"+ze[e>>16&255]+ze[e>>24&255]+ze[n&255]+ze[n>>8&255]+ze[n>>16&255]+ze[n>>24&255]).toLowerCase()}function oe(i,t,e){return Math.max(t,Math.min(e,i))}function Yh(i,t){return(i%t+t)%t}function qr(i,t,e){return(1-e)*i+e*t}function gn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function _e(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class ot{constructor(t=0,e=0){ot.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=oe(this.x,t.x,e.x),this.y=oe(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=oe(this.x,t,e),this.y=oe(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(oe(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(oe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Fs{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3];const f=r[a+0],p=r[a+1],g=r[a+2],x=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(o===1){t[e+0]=f,t[e+1]=p,t[e+2]=g,t[e+3]=x;return}if(d!==x||l!==f||c!==p||h!==g){let m=1-o;const u=l*f+c*p+h*g+d*x,T=u>=0?1:-1,E=1-u*u;if(E>Number.EPSILON){const C=Math.sqrt(E),R=Math.atan2(C,u*T);m=Math.sin(m*R)/C,o=Math.sin(o*R)/C}const v=o*T;if(l=l*m+f*v,c=c*m+p*v,h=h*m+g*v,d=d*m+x*v,m===1-o){const C=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=C,c*=C,h*=C,d*=C}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],f=r[a+1],p=r[a+2],g=r[a+3];return t[e]=o*g+h*d+l*p-c*f,t[e+1]=l*g+h*f+c*d-o*p,t[e+2]=c*g+h*p+o*f-l*d,t[e+3]=h*g-o*d-l*f-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),f=l(n/2),p=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=f*h*d+c*p*g,this._y=c*p*d-f*h*g,this._z=c*h*g+f*p*d,this._w=c*h*d-f*p*g;break;case"YXZ":this._x=f*h*d+c*p*g,this._y=c*p*d-f*h*g,this._z=c*h*g-f*p*d,this._w=c*h*d+f*p*g;break;case"ZXY":this._x=f*h*d-c*p*g,this._y=c*p*d+f*h*g,this._z=c*h*g+f*p*d,this._w=c*h*d-f*p*g;break;case"ZYX":this._x=f*h*d-c*p*g,this._y=c*p*d+f*h*g,this._z=c*h*g-f*p*d,this._w=c*h*d+f*p*g;break;case"YZX":this._x=f*h*d+c*p*g,this._y=c*p*d+f*h*g,this._z=c*h*g-f*p*d,this._w=c*h*d-f*p*g;break;case"XZY":this._x=f*h*d-c*p*g,this._y=c*p*d-f*h*g,this._z=c*h*g+f*p*d,this._w=c*h*d+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],f=n+o+d;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(n>o&&n>d){const p=2*Math.sqrt(1+n-o-d);this._w=(h-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>d){const p=2*Math.sqrt(1+o-n-d);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+d-n-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(oe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=a*d+this._w*f,this._x=n*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class w{constructor(t=0,e=0,n=0){w.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(sl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(sl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),d=2*(r*n-a*e);return this.x=e+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=oe(this.x,t.x,e.x),this.y=oe(this.y,t.y,e.y),this.z=oe(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=oe(this.x,t,e),this.y=oe(this.y,t,e),this.z=oe(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(oe(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Yr.copy(this).projectOnVector(t),this.sub(Yr)}reflect(t){return this.sub(Yr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(oe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Yr=new w,sl=new Fs;class Qt{constructor(t,e,n,s,r,a,o,l,c){Qt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],f=n[2],p=n[5],g=n[8],x=s[0],m=s[3],u=s[6],T=s[1],E=s[4],v=s[7],C=s[2],R=s[5],L=s[8];return r[0]=a*x+o*T+l*C,r[3]=a*m+o*E+l*R,r[6]=a*u+o*v+l*L,r[1]=c*x+h*T+d*C,r[4]=c*m+h*E+d*R,r[7]=c*u+h*v+d*L,r[2]=f*x+p*T+g*C,r[5]=f*m+p*E+g*R,r[8]=f*u+p*v+g*L,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,f=o*l-h*r,p=c*r-a*l,g=e*d+n*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return t[0]=d*x,t[1]=(s*c-h*n)*x,t[2]=(o*n-s*a)*x,t[3]=f*x,t[4]=(h*e-s*l)*x,t[5]=(s*r-o*e)*x,t[6]=p*x,t[7]=(n*l-c*e)*x,t[8]=(a*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Zr.makeScale(t,e)),this}rotate(t){return this.premultiply(Zr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Zr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Zr=new Qt;function Ic(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Pr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Zh(){const i=Pr("canvas");return i.style.display="block",i}const rl={};function Ls(i){i in rl||(rl[i]=!0,console.warn(i))}function Kh(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const al=new Qt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ol=new Qt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function $h(){const i={enabled:!0,workingColorSpace:ns,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===me&&(s.r=zn(s.r),s.g=zn(s.g),s.b=zn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===me&&(s.r=Ji(s.r),s.g=Ji(s.g),s.b=Ji(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ti?Rr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ls("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ls("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ns]:{primaries:t,whitePoint:n,transfer:Rr,toXYZ:al,fromXYZ:ol,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:qe},outputColorSpaceConfig:{drawingBufferColorSpace:qe}},[qe]:{primaries:t,whitePoint:n,transfer:me,toXYZ:al,fromXYZ:ol,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:qe}}}),i}const ue=$h();function zn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ji(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Li;class Jh{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Li===void 0&&(Li=Pr("canvas")),Li.width=t.width,Li.height=t.height;const s=Li.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Li}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Pr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=zn(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(zn(e[n]/255)*255):e[n]=zn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let jh=0;class Bo{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:jh++}),this.uuid=Bn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Kr(s[a].image)):r.push(Kr(s[a]))}else r=Kr(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Kr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Jh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Qh=0;const $r=new w;class Xe extends as{constructor(t=Xe.DEFAULT_IMAGE,e=Xe.DEFAULT_MAPPING,n=vi,s=vi,r=_n,a=Mi,o=fn,l=yn,c=Xe.DEFAULT_ANISOTROPY,h=ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Qh++}),this.uuid=Bn(),this.name="",this.source=new Bo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize($r).x}get height(){return this.source.getSize($r).y}get depth(){return this.source.getSize($r).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Sc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ws:t.x=t.x-Math.floor(t.x);break;case vi:t.x=t.x<0?0:1;break;case Xa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ws:t.y=t.y-Math.floor(t.y);break;case vi:t.y=t.y<0?0:1;break;case Xa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Xe.DEFAULT_IMAGE=null;Xe.DEFAULT_MAPPING=Sc;Xe.DEFAULT_ANISOTROPY=1;class xe{constructor(t=0,e=0,n=0,s=1){xe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],d=l[8],f=l[1],p=l[5],g=l[9],x=l[2],m=l[6],u=l[10];if(Math.abs(h-f)<.01&&Math.abs(d-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const E=(c+1)/2,v=(p+1)/2,C=(u+1)/2,R=(h+f)/4,L=(d+x)/4,I=(g+m)/4;return E>v&&E>C?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=R/n,r=L/n):v>C?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=R/s,r=I/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=L/r,s=I/r),this.set(n,s,r,e),this}let T=Math.sqrt((m-g)*(m-g)+(d-x)*(d-x)+(f-h)*(f-h));return Math.abs(T)<.001&&(T=1),this.x=(m-g)/T,this.y=(d-x)/T,this.z=(f-h)/T,this.w=Math.acos((c+p+u-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=oe(this.x,t.x,e.x),this.y=oe(this.y,t.y,e.y),this.z=oe(this.z,t.z,e.z),this.w=oe(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=oe(this.x,t,e),this.y=oe(this.y,t,e),this.z=oe(this.z,t,e),this.w=oe(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(oe(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class tu extends as{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:_n,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new xe(0,0,t,e),this.scissorTest=!1,this.viewport=new xe(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new Xe(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:_n,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Bo(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class an extends tu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Uc extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=pn,this.minFilter=pn,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class eu extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=pn,this.minFilter=pn,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Os{constructor(t=new w(1/0,1/0,1/0),e=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,hn):hn.fromBufferAttribute(r,a),hn.applyMatrix4(t.matrixWorld),this.expandByPoint(hn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ws.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ws.copy(n.boundingBox)),Ws.applyMatrix4(t.matrixWorld),this.union(Ws)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,hn),hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(hs),Xs.subVectors(this.max,hs),Di.subVectors(t.a,hs),Ii.subVectors(t.b,hs),Ui.subVectors(t.c,hs),Wn.subVectors(Ii,Di),Xn.subVectors(Ui,Ii),ai.subVectors(Di,Ui);let e=[0,-Wn.z,Wn.y,0,-Xn.z,Xn.y,0,-ai.z,ai.y,Wn.z,0,-Wn.x,Xn.z,0,-Xn.x,ai.z,0,-ai.x,-Wn.y,Wn.x,0,-Xn.y,Xn.x,0,-ai.y,ai.x,0];return!Jr(e,Di,Ii,Ui,Xs)||(e=[1,0,0,0,1,0,0,0,1],!Jr(e,Di,Ii,Ui,Xs))?!1:(qs.crossVectors(Wn,Xn),e=[qs.x,qs.y,qs.z],Jr(e,Di,Ii,Ui,Xs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Rn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Rn=[new w,new w,new w,new w,new w,new w,new w,new w],hn=new w,Ws=new Os,Di=new w,Ii=new w,Ui=new w,Wn=new w,Xn=new w,ai=new w,hs=new w,Xs=new w,qs=new w,oi=new w;function Jr(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){oi.fromArray(i,r);const o=s.x*Math.abs(oi.x)+s.y*Math.abs(oi.y)+s.z*Math.abs(oi.z),l=t.dot(oi),c=e.dot(oi),h=n.dot(oi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const nu=new Os,us=new w,jr=new w;class Bs{constructor(t=new w,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):nu.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;us.subVectors(t,this.center);const e=us.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(us,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(jr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(us.copy(t.center).add(jr)),this.expandByPoint(us.copy(t.center).sub(jr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Cn=new w,Qr=new w,Ys=new w,qn=new w,ta=new w,Zs=new w,ea=new w;class zo{constructor(t=new w,e=new w(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Cn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Cn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Cn.copy(this.origin).addScaledVector(this.direction,e),Cn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Qr.copy(t).add(e).multiplyScalar(.5),Ys.copy(e).sub(t).normalize(),qn.copy(this.origin).sub(Qr);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Ys),o=qn.dot(this.direction),l=-qn.dot(Ys),c=qn.lengthSq(),h=Math.abs(1-a*a);let d,f,p,g;if(h>0)if(d=a*l-o,f=a*o-l,g=r*h,d>=0)if(f>=-g)if(f<=g){const x=1/h;d*=x,f*=x,p=d*(d+a*f+2*o)+f*(a*d+f+2*l)+c}else f=r,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*l)+c;else f<=-g?(d=Math.max(0,-(-a*r+o)),f=d>0?-r:Math.min(Math.max(-r,-l),r),p=-d*d+f*(f+2*l)+c):f<=g?(d=0,f=Math.min(Math.max(-r,-l),r),p=f*(f+2*l)+c):(d=Math.max(0,-(a*r+o)),f=d>0?r:Math.min(Math.max(-r,-l),r),p=-d*d+f*(f+2*l)+c);else f=a>0?-r:r,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Qr).addScaledVector(Ys,f),p}intersectSphere(t,e){Cn.subVectors(t.center,this.origin);const n=Cn.dot(this.direction),s=Cn.dot(Cn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(t.min.z-f.z)*d,l=(t.max.z-f.z)*d):(o=(t.max.z-f.z)*d,l=(t.min.z-f.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Cn)!==null}intersectTriangle(t,e,n,s,r){ta.subVectors(e,t),Zs.subVectors(n,t),ea.crossVectors(ta,Zs);let a=this.direction.dot(ea),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;qn.subVectors(this.origin,t);const l=o*this.direction.dot(Zs.crossVectors(qn,Zs));if(l<0)return null;const c=o*this.direction.dot(ta.cross(qn));if(c<0||l+c>a)return null;const h=-o*qn.dot(ea);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Me{constructor(t,e,n,s,r,a,o,l,c,h,d,f,p,g,x,m){Me.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,d,f,p,g,x,m)}set(t,e,n,s,r,a,o,l,c,h,d,f,p,g,x,m){const u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=s,u[1]=r,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=h,u[10]=d,u[14]=f,u[3]=p,u[7]=g,u[11]=x,u[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Me().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ni.setFromMatrixColumn(t,0).length(),r=1/Ni.setFromMatrixColumn(t,1).length(),a=1/Ni.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const f=a*h,p=a*d,g=o*h,x=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=p+g*c,e[5]=f-x*c,e[9]=-o*l,e[2]=x-f*c,e[6]=g+p*c,e[10]=a*l}else if(t.order==="YXZ"){const f=l*h,p=l*d,g=c*h,x=c*d;e[0]=f+x*o,e[4]=g*o-p,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=p*o-g,e[6]=x+f*o,e[10]=a*l}else if(t.order==="ZXY"){const f=l*h,p=l*d,g=c*h,x=c*d;e[0]=f-x*o,e[4]=-a*d,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*h,e[9]=x-f*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const f=a*h,p=a*d,g=o*h,x=o*d;e[0]=l*h,e[4]=g*c-p,e[8]=f*c+x,e[1]=l*d,e[5]=x*c+f,e[9]=p*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const f=a*l,p=a*c,g=o*l,x=o*c;e[0]=l*h,e[4]=x-f*d,e[8]=g*d+p,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=p*d+g,e[10]=f-x*d}else if(t.order==="XZY"){const f=a*l,p=a*c,g=o*l,x=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=f*d+x,e[5]=a*h,e[9]=p*d-g,e[2]=g*d-p,e[6]=o*h,e[10]=x*d+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(iu,t,su)}lookAt(t,e,n){const s=this.elements;return Ze.subVectors(t,e),Ze.lengthSq()===0&&(Ze.z=1),Ze.normalize(),Yn.crossVectors(n,Ze),Yn.lengthSq()===0&&(Math.abs(n.z)===1?Ze.x+=1e-4:Ze.z+=1e-4,Ze.normalize(),Yn.crossVectors(n,Ze)),Yn.normalize(),Ks.crossVectors(Ze,Yn),s[0]=Yn.x,s[4]=Ks.x,s[8]=Ze.x,s[1]=Yn.y,s[5]=Ks.y,s[9]=Ze.y,s[2]=Yn.z,s[6]=Ks.z,s[10]=Ze.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],f=n[9],p=n[13],g=n[2],x=n[6],m=n[10],u=n[14],T=n[3],E=n[7],v=n[11],C=n[15],R=s[0],L=s[4],I=s[8],y=s[12],M=s[1],P=s[5],F=s[9],V=s[13],K=s[2],X=s[6],k=s[10],Q=s[14],Z=s[3],_t=s[7],Et=s[11],Pt=s[15];return r[0]=a*R+o*M+l*K+c*Z,r[4]=a*L+o*P+l*X+c*_t,r[8]=a*I+o*F+l*k+c*Et,r[12]=a*y+o*V+l*Q+c*Pt,r[1]=h*R+d*M+f*K+p*Z,r[5]=h*L+d*P+f*X+p*_t,r[9]=h*I+d*F+f*k+p*Et,r[13]=h*y+d*V+f*Q+p*Pt,r[2]=g*R+x*M+m*K+u*Z,r[6]=g*L+x*P+m*X+u*_t,r[10]=g*I+x*F+m*k+u*Et,r[14]=g*y+x*V+m*Q+u*Pt,r[3]=T*R+E*M+v*K+C*Z,r[7]=T*L+E*P+v*X+C*_t,r[11]=T*I+E*F+v*k+C*Et,r[15]=T*y+E*V+v*Q+C*Pt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],f=t[10],p=t[14],g=t[3],x=t[7],m=t[11],u=t[15];return g*(+r*l*d-s*c*d-r*o*f+n*c*f+s*o*p-n*l*p)+x*(+e*l*p-e*c*f+r*a*f-s*a*p+s*c*h-r*l*h)+m*(+e*c*d-e*o*p-r*a*d+n*a*p+r*o*h-n*c*h)+u*(-s*o*h-e*l*d+e*o*f+s*a*d-n*a*f+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],f=t[10],p=t[11],g=t[12],x=t[13],m=t[14],u=t[15],T=d*m*c-x*f*c+x*l*p-o*m*p-d*l*u+o*f*u,E=g*f*c-h*m*c-g*l*p+a*m*p+h*l*u-a*f*u,v=h*x*c-g*d*c+g*o*p-a*x*p-h*o*u+a*d*u,C=g*d*l-h*x*l-g*o*f+a*x*f+h*o*m-a*d*m,R=e*T+n*E+s*v+r*C;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/R;return t[0]=T*L,t[1]=(x*f*r-d*m*r-x*s*p+n*m*p+d*s*u-n*f*u)*L,t[2]=(o*m*r-x*l*r+x*s*c-n*m*c-o*s*u+n*l*u)*L,t[3]=(d*l*r-o*f*r-d*s*c+n*f*c+o*s*p-n*l*p)*L,t[4]=E*L,t[5]=(h*m*r-g*f*r+g*s*p-e*m*p-h*s*u+e*f*u)*L,t[6]=(g*l*r-a*m*r-g*s*c+e*m*c+a*s*u-e*l*u)*L,t[7]=(a*f*r-h*l*r+h*s*c-e*f*c-a*s*p+e*l*p)*L,t[8]=v*L,t[9]=(g*d*r-h*x*r-g*n*p+e*x*p+h*n*u-e*d*u)*L,t[10]=(a*x*r-g*o*r+g*n*c-e*x*c-a*n*u+e*o*u)*L,t[11]=(h*o*r-a*d*r-h*n*c+e*d*c+a*n*p-e*o*p)*L,t[12]=C*L,t[13]=(h*x*s-g*d*s+g*n*f-e*x*f-h*n*m+e*d*m)*L,t[14]=(g*o*s-a*x*s-g*n*l+e*x*l+a*n*m-e*o*m)*L,t[15]=(a*d*s-h*o*s+h*n*l-e*d*l-a*n*f+e*o*f)*L,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,d=o+o,f=r*c,p=r*h,g=r*d,x=a*h,m=a*d,u=o*d,T=l*c,E=l*h,v=l*d,C=n.x,R=n.y,L=n.z;return s[0]=(1-(x+u))*C,s[1]=(p+v)*C,s[2]=(g-E)*C,s[3]=0,s[4]=(p-v)*R,s[5]=(1-(f+u))*R,s[6]=(m+T)*R,s[7]=0,s[8]=(g+E)*L,s[9]=(m-T)*L,s[10]=(1-(f+x))*L,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ni.set(s[0],s[1],s[2]).length();const a=Ni.set(s[4],s[5],s[6]).length(),o=Ni.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],un.copy(this);const c=1/r,h=1/a,d=1/o;return un.elements[0]*=c,un.elements[1]*=c,un.elements[2]*=c,un.elements[4]*=h,un.elements[5]*=h,un.elements[6]*=h,un.elements[8]*=d,un.elements[9]*=d,un.elements[10]*=d,e.setFromRotationMatrix(un),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=xn,l=!1){const c=this.elements,h=2*r/(e-t),d=2*r/(n-s),f=(e+t)/(e-t),p=(n+s)/(n-s);let g,x;if(l)g=r/(a-r),x=a*r/(a-r);else if(o===xn)g=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===Cr)g=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=xn,l=!1){const c=this.elements,h=2/(e-t),d=2/(n-s),f=-(e+t)/(e-t),p=-(n+s)/(n-s);let g,x;if(l)g=1/(a-r),x=a/(a-r);else if(o===xn)g=-2/(a-r),x=-(a+r)/(a-r);else if(o===Cr)g=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=d,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ni=new w,un=new Me,iu=new w(0,0,0),su=new w(1,1,1),Yn=new w,Ks=new w,Ze=new w,ll=new Me,cl=new Fs;class Sn{constructor(t=0,e=0,n=0,s=Sn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(oe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-oe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(oe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-oe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(oe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-oe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ll.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ll,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return cl.setFromEuler(this),this.setFromQuaternion(cl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Sn.DEFAULT_ORDER="XYZ";class Nc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let ru=0;const hl=new w,Fi=new Fs,Pn=new Me,$s=new w,ds=new w,au=new w,ou=new Fs,ul=new w(1,0,0),dl=new w(0,1,0),fl=new w(0,0,1),pl={type:"added"},lu={type:"removed"},Oi={type:"childadded",child:null},na={type:"childremoved",child:null};class we extends as{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ru++}),this.uuid=Bn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=we.DEFAULT_UP.clone();const t=new w,e=new Sn,n=new Fs,s=new w(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Me},normalMatrix:{value:new Qt}}),this.matrix=new Me,this.matrixWorld=new Me,this.matrixAutoUpdate=we.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.multiply(Fi),this}rotateOnWorldAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.premultiply(Fi),this}rotateX(t){return this.rotateOnAxis(ul,t)}rotateY(t){return this.rotateOnAxis(dl,t)}rotateZ(t){return this.rotateOnAxis(fl,t)}translateOnAxis(t,e){return hl.copy(t).applyQuaternion(this.quaternion),this.position.add(hl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ul,t)}translateY(t){return this.translateOnAxis(dl,t)}translateZ(t){return this.translateOnAxis(fl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Pn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?$s.copy(t):$s.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ds.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Pn.lookAt(ds,$s,this.up):Pn.lookAt($s,ds,this.up),this.quaternion.setFromRotationMatrix(Pn),s&&(Pn.extractRotation(s.matrixWorld),Fi.setFromRotationMatrix(Pn),this.quaternion.premultiply(Fi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(pl),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(lu),na.child=t,this.dispatchEvent(na),na.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Pn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Pn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Pn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(pl),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ds,t,au),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ds,ou,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),d=a(t.shapes),f=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}we.DEFAULT_UP=new w(0,1,0);we.DEFAULT_MATRIX_AUTO_UPDATE=!0;we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const dn=new w,Ln=new w,ia=new w,Dn=new w,Bi=new w,zi=new w,ml=new w,sa=new w,ra=new w,aa=new w,oa=new xe,la=new xe,ca=new xe;class rn{constructor(t=new w,e=new w,n=new w){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),dn.subVectors(t,e),s.cross(dn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){dn.subVectors(s,e),Ln.subVectors(n,e),ia.subVectors(t,e);const a=dn.dot(dn),o=dn.dot(Ln),l=dn.dot(ia),c=Ln.dot(Ln),h=Ln.dot(ia),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const f=1/d,p=(c*l-o*h)*f,g=(a*h-o*l)*f;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Dn)===null?!1:Dn.x>=0&&Dn.y>=0&&Dn.x+Dn.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,Dn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Dn.x),l.addScaledVector(a,Dn.y),l.addScaledVector(o,Dn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return oa.setScalar(0),la.setScalar(0),ca.setScalar(0),oa.fromBufferAttribute(t,e),la.fromBufferAttribute(t,n),ca.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(oa,r.x),a.addScaledVector(la,r.y),a.addScaledVector(ca,r.z),a}static isFrontFacing(t,e,n,s){return dn.subVectors(n,e),Ln.subVectors(t,e),dn.cross(Ln).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return dn.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),dn.cross(Ln).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return rn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return rn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return rn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return rn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return rn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Bi.subVectors(s,n),zi.subVectors(r,n),sa.subVectors(t,n);const l=Bi.dot(sa),c=zi.dot(sa);if(l<=0&&c<=0)return e.copy(n);ra.subVectors(t,s);const h=Bi.dot(ra),d=zi.dot(ra);if(h>=0&&d<=h)return e.copy(s);const f=l*d-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Bi,a);aa.subVectors(t,r);const p=Bi.dot(aa),g=zi.dot(aa);if(g>=0&&p<=g)return e.copy(r);const x=p*c-l*g;if(x<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(zi,o);const m=h*g-p*d;if(m<=0&&d-h>=0&&p-g>=0)return ml.subVectors(r,s),o=(d-h)/(d-h+(p-g)),e.copy(s).addScaledVector(ml,o);const u=1/(m+x+f);return a=x*u,o=f*u,e.copy(n).addScaledVector(Bi,a).addScaledVector(zi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Fc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zn={h:0,s:0,l:0},Js={h:0,s:0,l:0};function ha(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Zt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=qe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ue.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=ue.workingColorSpace){return this.r=t,this.g=e,this.b=n,ue.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=ue.workingColorSpace){if(t=Yh(t,1),e=oe(e,0,1),n=oe(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=ha(a,r,t+1/3),this.g=ha(a,r,t),this.b=ha(a,r,t-1/3)}return ue.colorSpaceToWorking(this,s),this}setStyle(t,e=qe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=qe){const n=Fc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=zn(t.r),this.g=zn(t.g),this.b=zn(t.b),this}copyLinearToSRGB(t){return this.r=Ji(t.r),this.g=Ji(t.g),this.b=Ji(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=qe){return ue.workingToColorSpace(ke.copy(this),t),Math.round(oe(ke.r*255,0,255))*65536+Math.round(oe(ke.g*255,0,255))*256+Math.round(oe(ke.b*255,0,255))}getHexString(t=qe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ue.workingColorSpace){ue.workingToColorSpace(ke.copy(this),e);const n=ke.r,s=ke.g,r=ke.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ue.workingColorSpace){return ue.workingToColorSpace(ke.copy(this),e),t.r=ke.r,t.g=ke.g,t.b=ke.b,t}getStyle(t=qe){ue.workingToColorSpace(ke.copy(this),t);const e=ke.r,n=ke.g,s=ke.b;return t!==qe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Zn),this.setHSL(Zn.h+t,Zn.s+e,Zn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Zn),t.getHSL(Js);const n=qr(Zn.h,Js.h,e),s=qr(Zn.s,Js.s,e),r=qr(Zn.l,Js.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ke=new Zt;Zt.NAMES=Fc;let cu=0;class ni extends as{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cu++}),this.uuid=Bn(),this.name="",this.type="Material",this.blending=yi,this.side=Hn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ua,this.blendDst=Na,this.blendEquation=_i,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Zt(0,0,0),this.blendAlpha=0,this.depthFunc=Qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=nl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pi,this.stencilZFail=Pi,this.stencilZPass=Pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==yi&&(n.blending=this.blending),this.side!==Hn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ua&&(n.blendSrc=this.blendSrc),this.blendDst!==Na&&(n.blendDst=this.blendDst),this.blendEquation!==_i&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==nl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Pi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Pi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Pi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ce extends ni{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=mc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ae=new w,js=new ot;let hu=0;class tn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:hu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=yo,this.updateRanges=[],this.gpuType=Fn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)js.fromBufferAttribute(this,e),js.applyMatrix3(t),this.setXY(e,js.x,js.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix3(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix4(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyNormalMatrix(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.transformDirection(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=gn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=_e(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=gn(e,this.array)),e}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=gn(e,this.array)),e}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=gn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=gn(e,this.array)),e}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array),r=_e(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==yo&&(t.usage=this.usage),t}}class Oc extends tn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Bc extends tn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class de extends tn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let uu=0;const en=new Me,ua=new we,ki=new w,Ke=new Os,fs=new Os,De=new w;class ye extends as{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:uu++}),this.uuid=Bn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ic(t)?Bc:Oc)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Qt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return en.makeRotationFromQuaternion(t),this.applyMatrix4(en),this}rotateX(t){return en.makeRotationX(t),this.applyMatrix4(en),this}rotateY(t){return en.makeRotationY(t),this.applyMatrix4(en),this}rotateZ(t){return en.makeRotationZ(t),this.applyMatrix4(en),this}translate(t,e,n){return en.makeTranslation(t,e,n),this.applyMatrix4(en),this}scale(t,e,n){return en.makeScale(t,e,n),this.applyMatrix4(en),this}lookAt(t){return ua.lookAt(t),ua.updateMatrix(),this.applyMatrix4(ua.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ki).negate(),this.translate(ki.x,ki.y,ki.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new de(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Os);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Ke.setFromBufferAttribute(r),this.morphTargetsRelative?(De.addVectors(this.boundingBox.min,Ke.min),this.boundingBox.expandByPoint(De),De.addVectors(this.boundingBox.max,Ke.max),this.boundingBox.expandByPoint(De)):(this.boundingBox.expandByPoint(Ke.min),this.boundingBox.expandByPoint(Ke.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Bs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new w,1/0);return}if(t){const n=this.boundingSphere.center;if(Ke.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];fs.setFromBufferAttribute(o),this.morphTargetsRelative?(De.addVectors(Ke.min,fs.min),Ke.expandByPoint(De),De.addVectors(Ke.max,fs.max),Ke.expandByPoint(De)):(Ke.expandByPoint(fs.min),Ke.expandByPoint(fs.max))}Ke.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)De.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(De));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)De.fromBufferAttribute(o,c),l&&(ki.fromBufferAttribute(t,c),De.add(ki)),s=Math.max(s,n.distanceToSquared(De))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new tn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let I=0;I<n.count;I++)o[I]=new w,l[I]=new w;const c=new w,h=new w,d=new w,f=new ot,p=new ot,g=new ot,x=new w,m=new w;function u(I,y,M){c.fromBufferAttribute(n,I),h.fromBufferAttribute(n,y),d.fromBufferAttribute(n,M),f.fromBufferAttribute(r,I),p.fromBufferAttribute(r,y),g.fromBufferAttribute(r,M),h.sub(c),d.sub(c),p.sub(f),g.sub(f);const P=1/(p.x*g.y-g.x*p.y);isFinite(P)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(P),m.copy(d).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(P),o[I].add(x),o[y].add(x),o[M].add(x),l[I].add(m),l[y].add(m),l[M].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:t.count}]);for(let I=0,y=T.length;I<y;++I){const M=T[I],P=M.start,F=M.count;for(let V=P,K=P+F;V<K;V+=3)u(t.getX(V+0),t.getX(V+1),t.getX(V+2))}const E=new w,v=new w,C=new w,R=new w;function L(I){C.fromBufferAttribute(s,I),R.copy(C);const y=o[I];E.copy(y),E.sub(C.multiplyScalar(C.dot(y))).normalize(),v.crossVectors(R,y);const P=v.dot(l[I])<0?-1:1;a.setXYZW(I,E.x,E.y,E.z,P)}for(let I=0,y=T.length;I<y;++I){const M=T[I],P=M.start,F=M.count;for(let V=P,K=P+F;V<K;V+=3)L(t.getX(V+0)),L(t.getX(V+1)),L(t.getX(V+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new tn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const s=new w,r=new w,a=new w,o=new w,l=new w,c=new w,h=new w,d=new w;if(t)for(let f=0,p=t.count;f<p;f+=3){const g=t.getX(f+0),x=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,x),a.fromBufferAttribute(e,m),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)De.fromBufferAttribute(t,e),De.normalize(),t.setXYZ(e,De.x,De.y,De.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,d=o.normalized,f=new c.constructor(l.length*h);let p=0,g=0;for(let x=0,m=l.length;x<m;x++){o.isInterleavedBufferAttribute?p=l[x]*o.data.stride+o.offset:p=l[x]*h;for(let u=0;u<h;u++)f[g++]=c[p++]}return new tn(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ye,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){const f=c[h],p=t(f,n);l.push(p)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,f=c.length;d<f;d++){const p=c[d];h.push(p.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let f=0,p=d.length;f<p;f++)h.push(d[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const gl=new Me,li=new zo,Qs=new Bs,_l=new w,tr=new w,er=new w,nr=new w,da=new w,ir=new w,xl=new w,sr=new w;class Lt extends we{constructor(t=new ye,e=new ce){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){ir.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],d=r[l];h!==0&&(da.fromBufferAttribute(d,t),a?ir.addScaledVector(da,h):ir.addScaledVector(da.sub(e),h))}e.add(ir)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Qs.copy(n.boundingSphere),Qs.applyMatrix4(r),li.copy(t.ray).recast(t.near),!(Qs.containsPoint(li.origin)===!1&&(li.intersectSphere(Qs,_l)===null||li.origin.distanceToSquared(_l)>(t.far-t.near)**2))&&(gl.copy(r).invert(),li.copy(t.ray).applyMatrix4(gl),!(n.boundingBox!==null&&li.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,li)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,x=f.length;g<x;g++){const m=f[g],u=a[m.materialIndex],T=Math.max(m.start,p.start),E=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let v=T,C=E;v<C;v+=3){const R=o.getX(v),L=o.getX(v+1),I=o.getX(v+2);s=rr(this,u,t,n,c,h,d,R,L,I),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),x=Math.min(o.count,p.start+p.count);for(let m=g,u=x;m<u;m+=3){const T=o.getX(m),E=o.getX(m+1),v=o.getX(m+2);s=rr(this,a,t,n,c,h,d,T,E,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,x=f.length;g<x;g++){const m=f[g],u=a[m.materialIndex],T=Math.max(m.start,p.start),E=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let v=T,C=E;v<C;v+=3){const R=v,L=v+1,I=v+2;s=rr(this,u,t,n,c,h,d,R,L,I),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let m=g,u=x;m<u;m+=3){const T=m,E=m+1,v=m+2;s=rr(this,a,t,n,c,h,d,T,E,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function du(i,t,e,n,s,r,a,o){let l;if(t.side===We?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Hn,o),l===null)return null;sr.copy(o),sr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(sr);return c<e.near||c>e.far?null:{distance:c,point:sr.clone(),object:i}}function rr(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,tr),i.getVertexPosition(l,er),i.getVertexPosition(c,nr);const h=du(i,t,e,n,tr,er,nr,xl);if(h){const d=new w;rn.getBarycoord(xl,tr,er,nr,d),s&&(h.uv=rn.getInterpolatedAttribute(s,o,l,c,d,new ot)),r&&(h.uv1=rn.getInterpolatedAttribute(r,o,l,c,d,new ot)),a&&(h.normal=rn.getInterpolatedAttribute(a,o,l,c,d,new w),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new w,materialIndex:0};rn.getNormal(tr,er,nr,f.normal),h.face=f,h.barycoord=d}return h}class on extends ye{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],d=[];let f=0,p=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new de(c,3)),this.setAttribute("normal",new de(h,3)),this.setAttribute("uv",new de(d,2));function g(x,m,u,T,E,v,C,R,L,I,y){const M=v/L,P=C/I,F=v/2,V=C/2,K=R/2,X=L+1,k=I+1;let Q=0,Z=0;const _t=new w;for(let Et=0;Et<k;Et++){const Pt=Et*P-V;for(let Jt=0;Jt<X;Jt++){const ie=Jt*M-F;_t[x]=ie*T,_t[m]=Pt*E,_t[u]=K,c.push(_t.x,_t.y,_t.z),_t[x]=0,_t[m]=0,_t[u]=R>0?1:-1,h.push(_t.x,_t.y,_t.z),d.push(Jt/L),d.push(1-Et/I),Q+=1}}for(let Et=0;Et<I;Et++)for(let Pt=0;Pt<L;Pt++){const Jt=f+Pt+X*Et,ie=f+Pt+X*(Et+1),he=f+(Pt+1)+X*(Et+1),le=f+(Pt+1)+X*Et;l.push(Jt,ie,le),l.push(ie,he,le),Z+=6}o.addGroup(p,Z,y),p+=Z,f+=Q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new on(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function is(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ge(i){const t={};for(let e=0;e<i.length;e++){const n=is(i[e]);for(const s in n)t[s]=n[s]}return t}function fu(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function zc(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ue.workingColorSpace}const Ds={clone:is,merge:Ge};var pu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,mu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class He extends ni{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=pu,this.fragmentShader=mu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=is(t.uniforms),this.uniformsGroups=fu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class kc extends we{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Me,this.projectionMatrix=new Me,this.projectionMatrixInverse=new Me,this.coordinateSystem=xn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Kn=new w,vl=new ot,Ml=new ot;class Je extends kc{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=So*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Xr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return So*2*Math.atan(Math.tan(Xr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Kn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Kn.x,Kn.y).multiplyScalar(-t/Kn.z),Kn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Kn.x,Kn.y).multiplyScalar(-t/Kn.z)}getViewSize(t,e){return this.getViewBounds(t,vl,Ml),e.subVectors(Ml,vl)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Xr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Hi=-90,Vi=1;class gu extends we{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Je(Hi,Vi,t,e);s.layers=this.layers,this.add(s);const r=new Je(Hi,Vi,t,e);r.layers=this.layers,this.add(r);const a=new Je(Hi,Vi,t,e);a.layers=this.layers,this.add(a);const o=new Je(Hi,Vi,t,e);o.layers=this.layers,this.add(o);const l=new Je(Hi,Vi,t,e);l.layers=this.layers,this.add(l);const c=new Je(Hi,Vi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===xn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Cr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,d=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,f,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Hc extends Xe{constructor(t=[],e=ts,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class _u extends an{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Hc(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new on(5,5,5),r=new He({name:"CubemapFromEquirect",uniforms:is(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:We,blending:On});r.uniforms.tEquirect.value=e;const a=new Lt(s,r),o=e.minFilter;return e.minFilter===Mi&&(e.minFilter=_n),new gu(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class $t extends we{constructor(){super(),this.isGroup=!0,this.type="Group"}}const xu={type:"move"};class fa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $t,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $t,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $t,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const x of t.hand.values()){const m=e.getJointPose(x,n),u=this._getHandJoint(c,x);m!==null&&(u.matrix.fromArray(m.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=m.radius),u.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=h.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&f>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(xu)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new $t;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class ko{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Zt(t),this.density=e}clone(){return new ko(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class vu extends we{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Sn,this.environmentIntensity=1,this.environmentRotation=new Sn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Mu{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=yo,this.updateRanges=[],this.version=0,this.uuid=Bn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Bn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Bn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ve=new w;class Lr{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ve.fromBufferAttribute(this,e),Ve.applyMatrix4(t),this.setXYZ(e,Ve.x,Ve.y,Ve.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ve.fromBufferAttribute(this,e),Ve.applyNormalMatrix(t),this.setXYZ(e,Ve.x,Ve.y,Ve.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ve.fromBufferAttribute(this,e),Ve.transformDirection(t),this.setXYZ(e,Ve.x,Ve.y,Ve.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=gn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=_e(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=gn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=gn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=gn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=gn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array),r=_e(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new tn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Lr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Zi extends ni{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Zt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Gi;const ps=new w,Wi=new w,Xi=new w,qi=new ot,ms=new ot,Vc=new Me,ar=new w,gs=new w,or=new w,yl=new ot,pa=new ot,Sl=new ot;class ys extends we{constructor(t=new Zi){if(super(),this.isSprite=!0,this.type="Sprite",Gi===void 0){Gi=new ye;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Mu(e,5);Gi.setIndex([0,1,2,0,2,3]),Gi.setAttribute("position",new Lr(n,3,0,!1)),Gi.setAttribute("uv",new Lr(n,2,3,!1))}this.geometry=Gi,this.material=t,this.center=new ot(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Wi.setFromMatrixScale(this.matrixWorld),Vc.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Xi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Wi.multiplyScalar(-Xi.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;lr(ar.set(-.5,-.5,0),Xi,a,Wi,s,r),lr(gs.set(.5,-.5,0),Xi,a,Wi,s,r),lr(or.set(.5,.5,0),Xi,a,Wi,s,r),yl.set(0,0),pa.set(1,0),Sl.set(1,1);let o=t.ray.intersectTriangle(ar,gs,or,!1,ps);if(o===null&&(lr(gs.set(-.5,.5,0),Xi,a,Wi,s,r),pa.set(0,1),o=t.ray.intersectTriangle(ar,or,gs,!1,ps),o===null))return;const l=t.ray.origin.distanceTo(ps);l<t.near||l>t.far||e.push({distance:l,point:ps.clone(),uv:rn.getInterpolation(ps,ar,gs,or,yl,pa,Sl,new ot),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function lr(i,t,e,n,s,r){qi.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(ms.x=r*qi.x-s*qi.y,ms.y=s*qi.x+r*qi.y):ms.copy(qi),i.copy(t),i.x+=ms.x,i.y+=ms.y,i.applyMatrix4(Vc)}const ma=new w,yu=new w,Su=new Qt;class mi{constructor(t=new w(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=ma.subVectors(n,e).cross(yu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ma),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Su.getNormalMatrix(t),s=this.coplanarPoint(ma).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ci=new Bs,Eu=new ot(.5,.5),cr=new w;class Ho{constructor(t=new mi,e=new mi,n=new mi,s=new mi,r=new mi,a=new mi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=xn,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],f=r[6],p=r[7],g=r[8],x=r[9],m=r[10],u=r[11],T=r[12],E=r[13],v=r[14],C=r[15];if(s[0].setComponents(c-a,p-h,u-g,C-T).normalize(),s[1].setComponents(c+a,p+h,u+g,C+T).normalize(),s[2].setComponents(c+o,p+d,u+x,C+E).normalize(),s[3].setComponents(c-o,p-d,u-x,C-E).normalize(),n)s[4].setComponents(l,f,m,v).normalize(),s[5].setComponents(c-l,p-f,u-m,C-v).normalize();else if(s[4].setComponents(c-l,p-f,u-m,C-v).normalize(),e===xn)s[5].setComponents(c+l,p+f,u+m,C+v).normalize();else if(e===Cr)s[5].setComponents(l,f,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ci.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ci.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ci)}intersectsSprite(t){ci.center.set(0,0,0);const e=Eu.distanceTo(t.center);return ci.radius=.7071067811865476+e,ci.applyMatrix4(t.matrixWorld),this.intersectsSphere(ci)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(cr.x=s.normal.x>0?t.max.x:t.min.x,cr.y=s.normal.y>0?t.max.y:t.min.y,cr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(cr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Vo extends ni{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Zt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Dr=new w,Ir=new w,El=new Me,_s=new zo,hr=new Bs,ga=new w,Tl=new w;class br extends we{constructor(t=new ye,e=new Vo){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Dr.fromBufferAttribute(e,s-1),Ir.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Dr.distanceTo(Ir);t.setAttribute("lineDistance",new de(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),hr.copy(n.boundingSphere),hr.applyMatrix4(s),hr.radius+=r,t.ray.intersectsSphere(hr)===!1)return;El.copy(s).invert(),_s.copy(t.ray).applyMatrix4(El);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let x=p,m=g-1;x<m;x+=c){const u=h.getX(x),T=h.getX(x+1),E=ur(this,t,_s,l,u,T,x);E&&e.push(E)}if(this.isLineLoop){const x=h.getX(g-1),m=h.getX(p),u=ur(this,t,_s,l,x,m,g-1);u&&e.push(u)}}else{const p=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let x=p,m=g-1;x<m;x+=c){const u=ur(this,t,_s,l,x,x+1,x);u&&e.push(u)}if(this.isLineLoop){const x=ur(this,t,_s,l,g-1,p,g-1);x&&e.push(x)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function ur(i,t,e,n,s,r,a){const o=i.geometry.attributes.position;if(Dr.fromBufferAttribute(o,s),Ir.fromBufferAttribute(o,r),e.distanceSqToSegment(Dr,Ir,ga,Tl)>n)return;ga.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(ga);if(!(c<t.near||c>t.far))return{distance:c,point:Tl.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class Ur extends ni{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Zt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const bl=new Me,Eo=new zo,dr=new Bs,fr=new w;class To extends we{constructor(t=new ye,e=new Ur){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),dr.copy(n.boundingSphere),dr.applyMatrix4(s),dr.radius+=r,t.ray.intersectsSphere(dr)===!1)return;bl.copy(s).invert(),Eo.copy(t.ray).applyMatrix4(bl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let g=f,x=p;g<x;g++){const m=c.getX(g);fr.fromBufferAttribute(d,m),wl(fr,m,l,s,t,e,this)}}else{const f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let g=f,x=p;g<x;g++)fr.fromBufferAttribute(d,g),wl(fr,g,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function wl(i,t,e,n,s,r,a){const o=Eo.distanceSqToPoint(i);if(o<e){const l=new w;Eo.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class Go extends Xe{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Gc extends Xe{constructor(t,e,n=Si,s,r,a,o=pn,l=pn,c,h=Cs,d=1){if(h!==Cs&&h!==Ps)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:d};super(f,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Bo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Wc extends Xe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class zs extends ye{constructor(t=1,e=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=e/2,d=Math.PI/2*t,f=e,p=2*d+f,g=n*2+r,x=s+1,m=new w,u=new w;for(let T=0;T<=g;T++){let E=0,v=0,C=0,R=0;if(T<=n){const y=T/n,M=y*Math.PI/2;v=-h-t*Math.cos(M),C=t*Math.sin(M),R=-t*Math.cos(M),E=y*d}else if(T<=n+r){const y=(T-n)/r;v=-h+y*e,C=t,R=0,E=d+y*f}else{const y=(T-n-r)/n,M=y*Math.PI/2;v=h+t*Math.sin(M),C=t*Math.cos(M),R=t*Math.sin(M),E=d+f+y*d}const L=Math.max(0,Math.min(1,E/p));let I=0;T===0?I=.5/s:T===g&&(I=-.5/s);for(let y=0;y<=s;y++){const M=y/s,P=M*Math.PI*2,F=Math.sin(P),V=Math.cos(P);u.x=-C*V,u.y=v,u.z=C*F,o.push(u.x,u.y,u.z),m.set(-C*V,R,C*F),m.normalize(),l.push(m.x,m.y,m.z),c.push(M+I,L)}if(T>0){const y=(T-1)*x;for(let M=0;M<s;M++){const P=y+M,F=y+M+1,V=T*x+M,K=T*x+M+1;a.push(P,F,V),a.push(F,K,V)}}}this.setIndex(a),this.setAttribute("position",new de(o,3)),this.setAttribute("normal",new de(l,3)),this.setAttribute("uv",new de(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zs(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class vn extends ye{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],f=[],p=[];let g=0;const x=[],m=n/2;let u=0;T(),a===!1&&(t>0&&E(!0),e>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new de(d,3)),this.setAttribute("normal",new de(f,3)),this.setAttribute("uv",new de(p,2));function T(){const v=new w,C=new w;let R=0;const L=(e-t)/n;for(let I=0;I<=r;I++){const y=[],M=I/r,P=M*(e-t)+t;for(let F=0;F<=s;F++){const V=F/s,K=V*l+o,X=Math.sin(K),k=Math.cos(K);C.x=P*X,C.y=-M*n+m,C.z=P*k,d.push(C.x,C.y,C.z),v.set(X,L,k).normalize(),f.push(v.x,v.y,v.z),p.push(V,1-M),y.push(g++)}x.push(y)}for(let I=0;I<s;I++)for(let y=0;y<r;y++){const M=x[y][I],P=x[y+1][I],F=x[y+1][I+1],V=x[y][I+1];(t>0||y!==0)&&(h.push(M,P,V),R+=3),(e>0||y!==r-1)&&(h.push(P,F,V),R+=3)}c.addGroup(u,R,0),u+=R}function E(v){const C=g,R=new ot,L=new w;let I=0;const y=v===!0?t:e,M=v===!0?1:-1;for(let F=1;F<=s;F++)d.push(0,m*M,0),f.push(0,M,0),p.push(.5,.5),g++;const P=g;for(let F=0;F<=s;F++){const K=F/s*l+o,X=Math.cos(K),k=Math.sin(K);L.x=y*k,L.y=m*M,L.z=y*X,d.push(L.x,L.y,L.z),f.push(0,M,0),R.x=X*.5+.5,R.y=k*.5*M+.5,p.push(R.x,R.y),g++}for(let F=0;F<s;F++){const V=C+F,K=P+F;v===!0?h.push(K,K+1,V):h.push(K+1,K,V),I+=3}c.addGroup(u,I,v===!0?1:2),u+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class kn extends vn{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new kn(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Fr extends ye{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new de(r,3)),this.setAttribute("normal",new de(r.slice(),3)),this.setAttribute("uv",new de(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(T){const E=new w,v=new w,C=new w;for(let R=0;R<e.length;R+=3)p(e[R+0],E),p(e[R+1],v),p(e[R+2],C),l(E,v,C,T)}function l(T,E,v,C){const R=C+1,L=[];for(let I=0;I<=R;I++){L[I]=[];const y=T.clone().lerp(v,I/R),M=E.clone().lerp(v,I/R),P=R-I;for(let F=0;F<=P;F++)F===0&&I===R?L[I][F]=y:L[I][F]=y.clone().lerp(M,F/P)}for(let I=0;I<R;I++)for(let y=0;y<2*(R-I)-1;y++){const M=Math.floor(y/2);y%2===0?(f(L[I][M+1]),f(L[I+1][M]),f(L[I][M])):(f(L[I][M+1]),f(L[I+1][M+1]),f(L[I+1][M]))}}function c(T){const E=new w;for(let v=0;v<r.length;v+=3)E.x=r[v+0],E.y=r[v+1],E.z=r[v+2],E.normalize().multiplyScalar(T),r[v+0]=E.x,r[v+1]=E.y,r[v+2]=E.z}function h(){const T=new w;for(let E=0;E<r.length;E+=3){T.x=r[E+0],T.y=r[E+1],T.z=r[E+2];const v=m(T)/2/Math.PI+.5,C=u(T)/Math.PI+.5;a.push(v,1-C)}g(),d()}function d(){for(let T=0;T<a.length;T+=6){const E=a[T+0],v=a[T+2],C=a[T+4],R=Math.max(E,v,C),L=Math.min(E,v,C);R>.9&&L<.1&&(E<.2&&(a[T+0]+=1),v<.2&&(a[T+2]+=1),C<.2&&(a[T+4]+=1))}}function f(T){r.push(T.x,T.y,T.z)}function p(T,E){const v=T*3;E.x=t[v+0],E.y=t[v+1],E.z=t[v+2]}function g(){const T=new w,E=new w,v=new w,C=new w,R=new ot,L=new ot,I=new ot;for(let y=0,M=0;y<r.length;y+=9,M+=6){T.set(r[y+0],r[y+1],r[y+2]),E.set(r[y+3],r[y+4],r[y+5]),v.set(r[y+6],r[y+7],r[y+8]),R.set(a[M+0],a[M+1]),L.set(a[M+2],a[M+3]),I.set(a[M+4],a[M+5]),C.copy(T).add(E).add(v).divideScalar(3);const P=m(C);x(R,M+0,T,P),x(L,M+2,E,P),x(I,M+4,v,P)}}function x(T,E,v,C){C<0&&T.x===1&&(a[E]=T.x-1),v.x===0&&v.z===0&&(a[E]=C/2/Math.PI+.5)}function m(T){return Math.atan2(T.z,-T.x)}function u(T){return Math.atan2(-T.y,Math.sqrt(T.x*T.x+T.z*T.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fr(t.vertices,t.indices,t.radius,t.details)}}class Wo extends Fr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Wo(t.radius,t.detail)}}class En{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],f=n[s+1]-h,p=(a-h)/f;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new ot:new w);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new w,s=[],r=[],a=[],o=new w,l=new Me;for(let p=0;p<=t;p++){const g=p/t;s[p]=this.getTangentAt(g,new w)}r[0]=new w,a[0]=new w;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),d=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),f<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(oe(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(oe(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Xo extends En{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ot){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),f=l-this.aX,p=c-this.aY;l=f*h-p*d+this.aX,c=f*d+p*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Tu extends Xo{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function qo(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let f=(a-r)/c-(o-r)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+d)+(l-o)/d;f*=h,p*=h,s(a,o,f,p)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const pr=new w,_a=new qo,xa=new qo,va=new qo;class bu extends En{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new w){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(pr.subVectors(s[0],s[1]).add(s[0]),c=pr);const d=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(pr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=pr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(d),p),x=Math.pow(d.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(h),p);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),_a.initNonuniformCatmullRom(c.x,d.x,f.x,h.x,g,x,m),xa.initNonuniformCatmullRom(c.y,d.y,f.y,h.y,g,x,m),va.initNonuniformCatmullRom(c.z,d.z,f.z,h.z,g,x,m)}else this.curveType==="catmullrom"&&(_a.initCatmullRom(c.x,d.x,f.x,h.x,this.tension),xa.initCatmullRom(c.y,d.y,f.y,h.y,this.tension),va.initCatmullRom(c.z,d.z,f.z,h.z,this.tension));return n.set(_a.calc(l),xa.calc(l),va.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new w().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Al(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function wu(i,t){const e=1-i;return e*e*t}function Au(i,t){return 2*(1-i)*i*t}function Ru(i,t){return i*i*t}function Ts(i,t,e,n){return wu(i,t)+Au(i,e)+Ru(i,n)}function Cu(i,t){const e=1-i;return e*e*e*t}function Pu(i,t){const e=1-i;return 3*e*e*i*t}function Lu(i,t){return 3*(1-i)*i*i*t}function Du(i,t){return i*i*i*t}function bs(i,t,e,n,s){return Cu(i,t)+Pu(i,e)+Lu(i,n)+Du(i,s)}class Xc extends En{constructor(t=new ot,e=new ot,n=new ot,s=new ot){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ot){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(bs(t,s.x,r.x,a.x,o.x),bs(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Iu extends En{constructor(t=new w,e=new w,n=new w,s=new w){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new w){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(bs(t,s.x,r.x,a.x,o.x),bs(t,s.y,r.y,a.y,o.y),bs(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class qc extends En{constructor(t=new ot,e=new ot){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ot){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ot){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Uu extends En{constructor(t=new w,e=new w){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new w){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new w){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Yc extends En{constructor(t=new ot,e=new ot,n=new ot){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ot){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ts(t,s.x,r.x,a.x),Ts(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Zc extends En{constructor(t=new w,e=new w,n=new w){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new w){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ts(t,s.x,r.x,a.x),Ts(t,s.y,r.y,a.y),Ts(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Kc extends En{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ot){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(Al(o,l.x,c.x,h.x,d.x),Al(o,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ot().fromArray(s))}return this}}var bo=Object.freeze({__proto__:null,ArcCurve:Tu,CatmullRomCurve3:bu,CubicBezierCurve:Xc,CubicBezierCurve3:Iu,EllipseCurve:Xo,LineCurve:qc,LineCurve3:Uu,QuadraticBezierCurve:Yc,QuadraticBezierCurve3:Zc,SplineCurve:Kc});class Nu extends En{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new bo[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new bo[s.type]().fromJSON(s))}return this}}class Rl extends Nu{constructor(t){super(),this.type="Path",this.currentPoint=new ot,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new qc(this.currentPoint.clone(),new ot(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Yc(this.currentPoint.clone(),new ot(t,e),new ot(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Xc(this.currentPoint.clone(),new ot(t,e),new ot(n,s),new ot(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Kc(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new Xo(t,e,n,s,r,a,o,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class $c extends Rl{constructor(t){super(t),this.uuid=Bn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new Rl().fromJSON(s))}return this}}function Fu(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Jc(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Hu(i,t,r,e)),i.length>80*e){o=1/0,l=1/0;let h=-1/0,d=-1/0;for(let f=e;f<s;f+=e){const p=i[f],g=i[f+1];p<o&&(o=p),g<l&&(l=g),p>h&&(h=p),g>d&&(d=g)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return Is(r,a,e,o,l,c,0),a}function Jc(i,t,e,n,s){let r;if(s===ju(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Cl(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Cl(a/n|0,i[a],i[a+1],r);return r&&ss(r,r.next)&&(Ns(r),r=r.next),r}function Ei(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ss(e,e.next)||Te(e.prev,e,e.next)===0)){if(Ns(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Is(i,t,e,n,s,r,a){if(!i)return;!a&&r&&qu(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?Bu(i,n,s,r):Ou(i)){t.push(l.i,i.i,c.i),Ns(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=zu(Ei(i),t),Is(i,t,e,n,s,r,2)):a===2&&ku(i,t,e,n,s,r):Is(Ei(i),t,e,n,s,r,1);break}}}function Ou(i){const t=i.prev,e=i,n=i.next;if(Te(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),d=Math.min(o,l,c),f=Math.max(s,r,a),p=Math.max(o,l,c);let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=d&&g.y<=p&&Ss(s,o,r,l,a,c,g.x,g.y)&&Te(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Bu(i,t,e,n){const s=i.prev,r=i,a=i.next;if(Te(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,d=r.y,f=a.y,p=Math.min(o,l,c),g=Math.min(h,d,f),x=Math.max(o,l,c),m=Math.max(h,d,f),u=wo(p,g,t,e,n),T=wo(x,m,t,e,n);let E=i.prevZ,v=i.nextZ;for(;E&&E.z>=u&&v&&v.z<=T;){if(E.x>=p&&E.x<=x&&E.y>=g&&E.y<=m&&E!==s&&E!==a&&Ss(o,h,l,d,c,f,E.x,E.y)&&Te(E.prev,E,E.next)>=0||(E=E.prevZ,v.x>=p&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==a&&Ss(o,h,l,d,c,f,v.x,v.y)&&Te(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;E&&E.z>=u;){if(E.x>=p&&E.x<=x&&E.y>=g&&E.y<=m&&E!==s&&E!==a&&Ss(o,h,l,d,c,f,E.x,E.y)&&Te(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;v&&v.z<=T;){if(v.x>=p&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==a&&Ss(o,h,l,d,c,f,v.x,v.y)&&Te(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function zu(i,t){let e=i;do{const n=e.prev,s=e.next.next;!ss(n,s)&&Qc(n,e,e.next,s)&&Us(n,s)&&Us(s,n)&&(t.push(n.i,e.i,s.i),Ns(e),Ns(e.next),e=i=s),e=e.next}while(e!==i);return Ei(e)}function ku(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Ku(a,o)){let l=th(a,o);a=Ei(a,a.next),l=Ei(l,l.next),Is(a,t,e,n,s,r,0),Is(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Hu(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=Jc(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Zu(c))}s.sort(Vu);for(let r=0;r<s.length;r++)e=Gu(s[r],e);return e}function Vu(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Gu(i,t){const e=Wu(i,t);if(!e)return t;const n=th(e,i);return Ei(n,n.next),Ei(e,e.next)}function Wu(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(ss(i,e))return e;do{if(ss(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const d=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,a=e.x<e.next.x?e:e.next,d===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&jc(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const d=Math.abs(s-e.y)/(n-e.x);Us(e,i)&&(d<h||d===h&&(e.x>a.x||e.x===a.x&&Xu(a,e)))&&(a=e,h=d)}e=e.next}while(e!==o);return a}function Xu(i,t){return Te(i.prev,i,t.prev)<0&&Te(t.next,i,i.next)<0}function qu(i,t,e,n){let s=i;do s.z===0&&(s.z=wo(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Yu(s)}function Yu(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function wo(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Zu(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function jc(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function Ss(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&jc(i,t,e,n,s,r,a,o)}function Ku(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!$u(i,t)&&(Us(i,t)&&Us(t,i)&&Ju(i,t)&&(Te(i.prev,i,t.prev)||Te(i,t.prev,t))||ss(i,t)&&Te(i.prev,i,i.next)>0&&Te(t.prev,t,t.next)>0)}function Te(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ss(i,t){return i.x===t.x&&i.y===t.y}function Qc(i,t,e,n){const s=gr(Te(i,t,e)),r=gr(Te(i,t,n)),a=gr(Te(e,n,i)),o=gr(Te(e,n,t));return!!(s!==r&&a!==o||s===0&&mr(i,e,t)||r===0&&mr(i,n,t)||a===0&&mr(e,i,n)||o===0&&mr(e,t,n))}function mr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function gr(i){return i>0?1:i<0?-1:0}function $u(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Qc(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Us(i,t){return Te(i.prev,i,i.next)<0?Te(i,t,i.next)>=0&&Te(i,i.prev,t)>=0:Te(i,t,i.prev)<0||Te(i,i.next,t)<0}function Ju(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function th(i,t){const e=Ao(i.i,i.x,i.y),n=Ao(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Cl(i,t,e,n){const s=Ao(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ns(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Ao(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function ju(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Qu{static triangulate(t,e,n=2){return Fu(t,e,n)}}class Ki{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Ki.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Pl(t),Ll(n,t);let a=t.length;e.forEach(Pl);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,Ll(n,e[l]);const o=Qu.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Pl(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Ll(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Yo extends ye{constructor(t=new $c([new ot(.5,.5),new ot(-.5,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new de(s,3)),this.setAttribute("uv",new de(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:p-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const u=e.extrudePath,T=e.UVGenerator!==void 0?e.UVGenerator:td;let E,v=!1,C,R,L,I;u&&(E=u.getSpacedPoints(h),v=!0,f=!1,C=u.computeFrenetFrames(h,!1),R=new w,L=new w,I=new w),f||(m=0,p=0,g=0,x=0);const y=o.extractPoints(c);let M=y.shape;const P=y.holes;if(!Ki.isClockWise(M)){M=M.reverse();for(let st=0,nt=P.length;st<nt;st++){const j=P[st];Ki.isClockWise(j)&&(P[st]=j.reverse())}}function V(st){const j=10000000000000001e-36;let $=st[0];for(let gt=1;gt<=st.length;gt++){const at=gt%st.length,lt=st[at],Kt=lt.x-$.x,Gt=lt.y-$.y,b=Kt*Kt+Gt*Gt,_=Math.max(Math.abs(lt.x),Math.abs(lt.y),Math.abs($.x),Math.abs($.y)),z=j*_*_;if(b<=z){st.splice(at,1),gt--;continue}$=lt}}V(M),P.forEach(V);const K=P.length,X=M;for(let st=0;st<K;st++){const nt=P[st];M=M.concat(nt)}function k(st,nt,j){return nt||console.error("THREE.ExtrudeGeometry: vec does not exist"),st.clone().addScaledVector(nt,j)}const Q=M.length;function Z(st,nt,j){let $,gt,at;const lt=st.x-nt.x,Kt=st.y-nt.y,Gt=j.x-st.x,b=j.y-st.y,_=lt*lt+Kt*Kt,z=lt*b-Kt*Gt;if(Math.abs(z)>Number.EPSILON){const q=Math.sqrt(_),it=Math.sqrt(Gt*Gt+b*b),Y=nt.x-Kt/q,Nt=nt.y+lt/q,ft=j.x-b/it,It=j.y+Gt/it,At=((ft-Y)*b-(It-Nt)*Gt)/(lt*b-Kt*Gt);$=Y+lt*At-st.x,gt=Nt+Kt*At-st.y;const ct=$*$+gt*gt;if(ct<=2)return new ot($,gt);at=Math.sqrt(ct/2)}else{let q=!1;lt>Number.EPSILON?Gt>Number.EPSILON&&(q=!0):lt<-Number.EPSILON?Gt<-Number.EPSILON&&(q=!0):Math.sign(Kt)===Math.sign(b)&&(q=!0),q?($=-Kt,gt=lt,at=Math.sqrt(_)):($=lt,gt=Kt,at=Math.sqrt(_/2))}return new ot($/at,gt/at)}const _t=[];for(let st=0,nt=X.length,j=nt-1,$=st+1;st<nt;st++,j++,$++)j===nt&&(j=0),$===nt&&($=0),_t[st]=Z(X[st],X[j],X[$]);const Et=[];let Pt,Jt=_t.concat();for(let st=0,nt=K;st<nt;st++){const j=P[st];Pt=[];for(let $=0,gt=j.length,at=gt-1,lt=$+1;$<gt;$++,at++,lt++)at===gt&&(at=0),lt===gt&&(lt=0),Pt[$]=Z(j[$],j[at],j[lt]);Et.push(Pt),Jt=Jt.concat(Pt)}let ie;if(m===0)ie=Ki.triangulateShape(X,P);else{const st=[],nt=[];for(let j=0;j<m;j++){const $=j/m,gt=p*Math.cos($*Math.PI/2),at=g*Math.sin($*Math.PI/2)+x;for(let lt=0,Kt=X.length;lt<Kt;lt++){const Gt=k(X[lt],_t[lt],at);Bt(Gt.x,Gt.y,-gt),$===0&&st.push(Gt)}for(let lt=0,Kt=K;lt<Kt;lt++){const Gt=P[lt];Pt=Et[lt];const b=[];for(let _=0,z=Gt.length;_<z;_++){const q=k(Gt[_],Pt[_],at);Bt(q.x,q.y,-gt),$===0&&b.push(q)}$===0&&nt.push(b)}}ie=Ki.triangulateShape(st,nt)}const he=ie.length,le=g+x;for(let st=0;st<Q;st++){const nt=f?k(M[st],Jt[st],le):M[st];v?(L.copy(C.normals[0]).multiplyScalar(nt.x),R.copy(C.binormals[0]).multiplyScalar(nt.y),I.copy(E[0]).add(L).add(R),Bt(I.x,I.y,I.z)):Bt(nt.x,nt.y,0)}for(let st=1;st<=h;st++)for(let nt=0;nt<Q;nt++){const j=f?k(M[nt],Jt[nt],le):M[nt];v?(L.copy(C.normals[st]).multiplyScalar(j.x),R.copy(C.binormals[st]).multiplyScalar(j.y),I.copy(E[st]).add(L).add(R),Bt(I.x,I.y,I.z)):Bt(j.x,j.y,d/h*st)}for(let st=m-1;st>=0;st--){const nt=st/m,j=p*Math.cos(nt*Math.PI/2),$=g*Math.sin(nt*Math.PI/2)+x;for(let gt=0,at=X.length;gt<at;gt++){const lt=k(X[gt],_t[gt],$);Bt(lt.x,lt.y,d+j)}for(let gt=0,at=P.length;gt<at;gt++){const lt=P[gt];Pt=Et[gt];for(let Kt=0,Gt=lt.length;Kt<Gt;Kt++){const b=k(lt[Kt],Pt[Kt],$);v?Bt(b.x,b.y+E[h-1].y,E[h-1].x+j):Bt(b.x,b.y,d+j)}}}J(),rt();function J(){const st=s.length/3;if(f){let nt=0,j=Q*nt;for(let $=0;$<he;$++){const gt=ie[$];Dt(gt[2]+j,gt[1]+j,gt[0]+j)}nt=h+m*2,j=Q*nt;for(let $=0;$<he;$++){const gt=ie[$];Dt(gt[0]+j,gt[1]+j,gt[2]+j)}}else{for(let nt=0;nt<he;nt++){const j=ie[nt];Dt(j[2],j[1],j[0])}for(let nt=0;nt<he;nt++){const j=ie[nt];Dt(j[0]+Q*h,j[1]+Q*h,j[2]+Q*h)}}n.addGroup(st,s.length/3-st,0)}function rt(){const st=s.length/3;let nt=0;bt(X,nt),nt+=X.length;for(let j=0,$=P.length;j<$;j++){const gt=P[j];bt(gt,nt),nt+=gt.length}n.addGroup(st,s.length/3-st,1)}function bt(st,nt){let j=st.length;for(;--j>=0;){const $=j;let gt=j-1;gt<0&&(gt=st.length-1);for(let at=0,lt=h+m*2;at<lt;at++){const Kt=Q*at,Gt=Q*(at+1),b=nt+$+Kt,_=nt+gt+Kt,z=nt+gt+Gt,q=nt+$+Gt;te(b,_,z,q)}}}function Bt(st,nt,j){l.push(st),l.push(nt),l.push(j)}function Dt(st,nt,j){jt(st),jt(nt),jt(j);const $=s.length/3,gt=T.generateTopUV(n,s,$-3,$-2,$-1);D(gt[0]),D(gt[1]),D(gt[2])}function te(st,nt,j,$){jt(st),jt(nt),jt($),jt(nt),jt(j),jt($);const gt=s.length/3,at=T.generateSideWallUV(n,s,gt-6,gt-3,gt-2,gt-1);D(at[0]),D(at[1]),D(at[3]),D(at[1]),D(at[2]),D(at[3])}function jt(st){s.push(l[st*3+0]),s.push(l[st*3+1]),s.push(l[st*3+2])}function D(st){r.push(st.x),r.push(st.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return ed(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new bo[s.type]().fromJSON(s)),new Yo(n,t.options)}}const td={generateTopUV:function(i,t,e,n,s){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new ot(r,a),new ot(o,l),new ot(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],f=t[s*3],p=t[s*3+1],g=t[s*3+2],x=t[r*3],m=t[r*3+1],u=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ot(a,1-l),new ot(c,1-d),new ot(f,1-g),new ot(x,1-u)]:[new ot(o,1-l),new ot(h,1-d),new ot(p,1-g),new ot(m,1-u)]}};function ed(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Zo extends Fr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Zo(t.radius,t.detail)}}class Fe extends ye{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=t/o,f=e/l,p=[],g=[],x=[],m=[];for(let u=0;u<h;u++){const T=u*f-a;for(let E=0;E<c;E++){const v=E*d-r;g.push(v,-T,0),x.push(0,0,1),m.push(E/o),m.push(1-u/l)}}for(let u=0;u<l;u++)for(let T=0;T<o;T++){const E=T+c*u,v=T+c*(u+1),C=T+1+c*(u+1),R=T+1+c*u;p.push(E,v,R),p.push(v,C,R)}this.setIndex(p),this.setAttribute("position",new de(g,3)),this.setAttribute("normal",new de(x,3)),this.setAttribute("uv",new de(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fe(t.width,t.height,t.widthSegments,t.heightSegments)}}class Or extends ye{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let d=t;const f=(e-t)/s,p=new w,g=new ot;for(let x=0;x<=s;x++){for(let m=0;m<=n;m++){const u=r+m/n*a;p.x=d*Math.cos(u),p.y=d*Math.sin(u),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/e+1)/2,g.y=(p.y/e+1)/2,h.push(g.x,g.y)}d+=f}for(let x=0;x<s;x++){const m=x*(n+1);for(let u=0;u<n;u++){const T=u+m,E=T,v=T+n+1,C=T+n+2,R=T+1;o.push(E,v,R),o.push(v,C,R)}}this.setIndex(o),this.setAttribute("position",new de(l,3)),this.setAttribute("normal",new de(c,3)),this.setAttribute("uv",new de(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Or(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class nn extends ye{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new w,f=new w,p=[],g=[],x=[],m=[];for(let u=0;u<=n;u++){const T=[],E=u/n;let v=0;u===0&&a===0?v=.5/e:u===n&&l===Math.PI&&(v=-.5/e);for(let C=0;C<=e;C++){const R=C/e;d.x=-t*Math.cos(s+R*r)*Math.sin(a+E*o),d.y=t*Math.cos(a+E*o),d.z=t*Math.sin(s+R*r)*Math.sin(a+E*o),g.push(d.x,d.y,d.z),f.copy(d).normalize(),x.push(f.x,f.y,f.z),m.push(R+v,1-E),T.push(c++)}h.push(T)}for(let u=0;u<n;u++)for(let T=0;T<e;T++){const E=h[u][T+1],v=h[u][T],C=h[u+1][T],R=h[u+1][T+1];(u!==0||a>0)&&p.push(E,v,R),(u!==n-1||l<Math.PI)&&p.push(v,C,R)}this.setIndex(p),this.setAttribute("position",new de(g,3)),this.setAttribute("normal",new de(x,3)),this.setAttribute("uv",new de(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ji extends ye{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],c=[],h=new w,d=new w,f=new w;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){const x=g/s*r,m=p/n*Math.PI*2;d.x=(t+e*Math.cos(m))*Math.cos(x),d.y=(t+e*Math.cos(m))*Math.sin(x),d.z=e*Math.sin(m),o.push(d.x,d.y,d.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),f.subVectors(d,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/s),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){const x=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,u=(s+1)*(p-1)+g,T=(s+1)*p+g;a.push(x,m,T),a.push(m,u,T)}this.setIndex(a),this.setAttribute("position",new de(o,3)),this.setAttribute("normal",new de(l,3)),this.setAttribute("uv",new de(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ji(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class nd extends He{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ks extends ni{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Zt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Lc,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class id extends ni{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Oh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class sd extends ni{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Br extends we{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Zt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class rd extends Br{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Zt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ma=new Me,Dl=new w,Il=new w;class eh{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.mapType=yn,this.map=null,this.mapPass=null,this.matrix=new Me,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ho,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new xe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Dl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Dl),Il.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Il),e.updateMatrixWorld(),Ma.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ma,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ma)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Ul=new Me,xs=new w,ya=new w;class ad extends eh{constructor(){super(new Je(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ot(4,2),this._viewportCount=6,this._viewports=[new xe(2,1,1,1),new xe(0,1,1,1),new xe(3,1,1,1),new xe(1,1,1,1),new xe(3,0,1,1),new xe(1,0,1,1)],this._cubeDirections=[new w(1,0,0),new w(-1,0,0),new w(0,0,1),new w(0,0,-1),new w(0,1,0),new w(0,-1,0)],this._cubeUps=[new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,0,1),new w(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),xs.setFromMatrixPosition(t.matrixWorld),n.position.copy(xs),ya.copy(n.position),ya.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ya),n.updateMatrixWorld(),s.makeTranslation(-xs.x,-xs.y,-xs.z),Ul.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ul,n.coordinateSystem,n.reversedDepth)}}class $e extends Br{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new ad}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Ko extends kc{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class od extends eh{constructor(){super(new Ko(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Nl extends Br{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.target=new we,this.shadow=new od}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class ld extends Br{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class cd extends Je{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class hd{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Fl(i,t,e,n){const s=ud(n);switch(e){case Ac:return i*t;case Cc:return i*t/s.components*s.byteLength;case No:return i*t/s.components*s.byteLength;case Pc:return i*t*2/s.components*s.byteLength;case Fo:return i*t*2/s.components*s.byteLength;case Rc:return i*t*3/s.components*s.byteLength;case fn:return i*t*4/s.components*s.byteLength;case Oo:return i*t*4/s.components*s.byteLength;case yr:case Sr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Er:case Tr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ya:case Ka:return Math.max(i,16)*Math.max(t,8)/4;case qa:case Za:return Math.max(i,8)*Math.max(t,8)/2;case $a:case Ja:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ja:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Qa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case to:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case eo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case no:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case io:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case so:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ro:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case ao:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case oo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case lo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case co:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case ho:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case uo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case fo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case po:case mo:case go:return Math.ceil(i/4)*Math.ceil(t/4)*16;case _o:case xo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case vo:case Mo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ud(i){switch(i){case yn:case Ec:return{byteLength:1,components:1};case As:case Tc:case Mn:return{byteLength:2,components:1};case Io:case Uo:return{byteLength:2,components:4};case Si:case Do:case Fn:return{byteLength:4,components:1};case bc:case wc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Po}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Po);function nh(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function dd(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,d=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<d.length;p++){const g=d[f],x=d[p];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++f,d[f]=x)}d.length=f+1;for(let p=0,g=d.length;p<g;p++){const x=d[p];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var fd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,pd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,md=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,gd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_d=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,xd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Md=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,yd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Sd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ed=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Td=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,wd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ad=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Rd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Cd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Pd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ld=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Dd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Id=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ud=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Nd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Fd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Od=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Bd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,zd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,kd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Hd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Vd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Wd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Xd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,qd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Yd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Zd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Kd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,$d=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Jd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,jd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Qd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,tf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ef=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,nf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,sf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,rf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,af=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,of=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,cf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,hf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,uf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,df=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ff=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,pf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,mf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,gf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,_f=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Mf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,yf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Sf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ef=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Tf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,bf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,wf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Af=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Rf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Pf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Lf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Df=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,If=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Uf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Nf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ff=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Of=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Bf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,zf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,kf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Hf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Vf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Gf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Wf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Xf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,qf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Yf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Zf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Kf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,$f=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Jf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,jf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Qf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,tp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ep=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,np=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,ip=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,rp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ap=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,op=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,lp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,cp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,hp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,up=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,dp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const fp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,pp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_p=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Mp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,yp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Sp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Ep=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Tp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,wp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ap=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Rp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Pp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Dp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ip=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Up=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Np=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Op=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Bp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Vp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Gp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,qp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ne={alphahash_fragment:fd,alphahash_pars_fragment:pd,alphamap_fragment:md,alphamap_pars_fragment:gd,alphatest_fragment:_d,alphatest_pars_fragment:xd,aomap_fragment:vd,aomap_pars_fragment:Md,batching_pars_vertex:yd,batching_vertex:Sd,begin_vertex:Ed,beginnormal_vertex:Td,bsdfs:bd,iridescence_fragment:wd,bumpmap_pars_fragment:Ad,clipping_planes_fragment:Rd,clipping_planes_pars_fragment:Cd,clipping_planes_pars_vertex:Pd,clipping_planes_vertex:Ld,color_fragment:Dd,color_pars_fragment:Id,color_pars_vertex:Ud,color_vertex:Nd,common:Fd,cube_uv_reflection_fragment:Od,defaultnormal_vertex:Bd,displacementmap_pars_vertex:zd,displacementmap_vertex:kd,emissivemap_fragment:Hd,emissivemap_pars_fragment:Vd,colorspace_fragment:Gd,colorspace_pars_fragment:Wd,envmap_fragment:Xd,envmap_common_pars_fragment:qd,envmap_pars_fragment:Yd,envmap_pars_vertex:Zd,envmap_physical_pars_fragment:af,envmap_vertex:Kd,fog_vertex:$d,fog_pars_vertex:Jd,fog_fragment:jd,fog_pars_fragment:Qd,gradientmap_pars_fragment:tf,lightmap_pars_fragment:ef,lights_lambert_fragment:nf,lights_lambert_pars_fragment:sf,lights_pars_begin:rf,lights_toon_fragment:of,lights_toon_pars_fragment:lf,lights_phong_fragment:cf,lights_phong_pars_fragment:hf,lights_physical_fragment:uf,lights_physical_pars_fragment:df,lights_fragment_begin:ff,lights_fragment_maps:pf,lights_fragment_end:mf,logdepthbuf_fragment:gf,logdepthbuf_pars_fragment:_f,logdepthbuf_pars_vertex:xf,logdepthbuf_vertex:vf,map_fragment:Mf,map_pars_fragment:yf,map_particle_fragment:Sf,map_particle_pars_fragment:Ef,metalnessmap_fragment:Tf,metalnessmap_pars_fragment:bf,morphinstance_vertex:wf,morphcolor_vertex:Af,morphnormal_vertex:Rf,morphtarget_pars_vertex:Cf,morphtarget_vertex:Pf,normal_fragment_begin:Lf,normal_fragment_maps:Df,normal_pars_fragment:If,normal_pars_vertex:Uf,normal_vertex:Nf,normalmap_pars_fragment:Ff,clearcoat_normal_fragment_begin:Of,clearcoat_normal_fragment_maps:Bf,clearcoat_pars_fragment:zf,iridescence_pars_fragment:kf,opaque_fragment:Hf,packing:Vf,premultiplied_alpha_fragment:Gf,project_vertex:Wf,dithering_fragment:Xf,dithering_pars_fragment:qf,roughnessmap_fragment:Yf,roughnessmap_pars_fragment:Zf,shadowmap_pars_fragment:Kf,shadowmap_pars_vertex:$f,shadowmap_vertex:Jf,shadowmask_pars_fragment:jf,skinbase_vertex:Qf,skinning_pars_vertex:tp,skinning_vertex:ep,skinnormal_vertex:np,specularmap_fragment:ip,specularmap_pars_fragment:sp,tonemapping_fragment:rp,tonemapping_pars_fragment:ap,transmission_fragment:op,transmission_pars_fragment:lp,uv_pars_fragment:cp,uv_pars_vertex:hp,uv_vertex:up,worldpos_vertex:dp,background_vert:fp,background_frag:pp,backgroundCube_vert:mp,backgroundCube_frag:gp,cube_vert:_p,cube_frag:xp,depth_vert:vp,depth_frag:Mp,distanceRGBA_vert:yp,distanceRGBA_frag:Sp,equirect_vert:Ep,equirect_frag:Tp,linedashed_vert:bp,linedashed_frag:wp,meshbasic_vert:Ap,meshbasic_frag:Rp,meshlambert_vert:Cp,meshlambert_frag:Pp,meshmatcap_vert:Lp,meshmatcap_frag:Dp,meshnormal_vert:Ip,meshnormal_frag:Up,meshphong_vert:Np,meshphong_frag:Fp,meshphysical_vert:Op,meshphysical_frag:Bp,meshtoon_vert:zp,meshtoon_frag:kp,points_vert:Hp,points_frag:Vp,shadow_vert:Gp,shadow_frag:Wp,sprite_vert:Xp,sprite_frag:qp},St={common:{diffuse:{value:new Zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qt}},envmap:{envMap:{value:null},envMapRotation:{value:new Qt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qt},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0},uvTransform:{value:new Qt}},sprite:{diffuse:{value:new Zt(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}}},mn={basic:{uniforms:Ge([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:ne.meshbasic_vert,fragmentShader:ne.meshbasic_frag},lambert:{uniforms:Ge([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Zt(0)}}]),vertexShader:ne.meshlambert_vert,fragmentShader:ne.meshlambert_frag},phong:{uniforms:Ge([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Zt(0)},specular:{value:new Zt(1118481)},shininess:{value:30}}]),vertexShader:ne.meshphong_vert,fragmentShader:ne.meshphong_frag},standard:{uniforms:Ge([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new Zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag},toon:{uniforms:Ge([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new Zt(0)}}]),vertexShader:ne.meshtoon_vert,fragmentShader:ne.meshtoon_frag},matcap:{uniforms:Ge([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:ne.meshmatcap_vert,fragmentShader:ne.meshmatcap_frag},points:{uniforms:Ge([St.points,St.fog]),vertexShader:ne.points_vert,fragmentShader:ne.points_frag},dashed:{uniforms:Ge([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ne.linedashed_vert,fragmentShader:ne.linedashed_frag},depth:{uniforms:Ge([St.common,St.displacementmap]),vertexShader:ne.depth_vert,fragmentShader:ne.depth_frag},normal:{uniforms:Ge([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:ne.meshnormal_vert,fragmentShader:ne.meshnormal_frag},sprite:{uniforms:Ge([St.sprite,St.fog]),vertexShader:ne.sprite_vert,fragmentShader:ne.sprite_frag},background:{uniforms:{uvTransform:{value:new Qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ne.background_vert,fragmentShader:ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Qt}},vertexShader:ne.backgroundCube_vert,fragmentShader:ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ne.cube_vert,fragmentShader:ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ne.equirect_vert,fragmentShader:ne.equirect_frag},distanceRGBA:{uniforms:Ge([St.common,St.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ne.distanceRGBA_vert,fragmentShader:ne.distanceRGBA_frag},shadow:{uniforms:Ge([St.lights,St.fog,{color:{value:new Zt(0)},opacity:{value:1}}]),vertexShader:ne.shadow_vert,fragmentShader:ne.shadow_frag}};mn.physical={uniforms:Ge([mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qt},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qt},sheen:{value:0},sheenColor:{value:new Zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qt},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qt},attenuationDistance:{value:0},attenuationColor:{value:new Zt(0)},specularColor:{value:new Zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qt},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qt}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag};const _r={r:0,b:0,g:0},hi=new Sn,Yp=new Me;function Zp(i,t,e,n,s,r,a){const o=new Zt(0);let l=r===!0?0:1,c,h,d=null,f=0,p=null;function g(E){let v=E.isScene===!0?E.background:null;return v&&v.isTexture&&(v=(E.backgroundBlurriness>0?e:t).get(v)),v}function x(E){let v=!1;const C=g(E);C===null?u(o,l):C&&C.isColor&&(u(C,1),v=!0);const R=i.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,v){const C=g(v);C&&(C.isCubeTexture||C.mapping===Nr)?(h===void 0&&(h=new Lt(new on(1,1,1),new He({name:"BackgroundCubeMaterial",uniforms:is(mn.backgroundCube.uniforms),vertexShader:mn.backgroundCube.vertexShader,fragmentShader:mn.backgroundCube.fragmentShader,side:We,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,L,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),hi.copy(v.backgroundRotation),hi.x*=-1,hi.y*=-1,hi.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),h.material.uniforms.envMap.value=C,h.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Yp.makeRotationFromEuler(hi)),h.material.toneMapped=ue.getTransfer(C.colorSpace)!==me,(d!==C||f!==C.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,d=C,f=C.version,p=i.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null)):C&&C.isTexture&&(c===void 0&&(c=new Lt(new Fe(2,2),new He({name:"BackgroundMaterial",uniforms:is(mn.background.uniforms),vertexShader:mn.background.vertexShader,fragmentShader:mn.background.fragmentShader,side:Hn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=C,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=ue.getTransfer(C.colorSpace)!==me,C.matrixAutoUpdate===!0&&C.updateMatrix(),c.material.uniforms.uvTransform.value.copy(C.matrix),(d!==C||f!==C.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,d=C,f=C.version,p=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function u(E,v){E.getRGB(_r,zc(i)),n.buffers.color.setClear(_r.r,_r.g,_r.b,v,a)}function T(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(E,v=1){o.set(E),l=v,u(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,u(o,l)},render:x,addToRenderList:m,dispose:T}}function Kp(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(M,P,F,V,K){let X=!1;const k=d(V,F,P);r!==k&&(r=k,c(r.object)),X=p(M,V,F,K),X&&g(M,V,F,K),K!==null&&t.update(K,i.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,v(M,P,F,V),K!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(K).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function d(M,P,F){const V=F.wireframe===!0;let K=n[M.id];K===void 0&&(K={},n[M.id]=K);let X=K[P.id];X===void 0&&(X={},K[P.id]=X);let k=X[V];return k===void 0&&(k=f(l()),X[V]=k),k}function f(M){const P=[],F=[],V=[];for(let K=0;K<e;K++)P[K]=0,F[K]=0,V[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:F,attributeDivisors:V,object:M,attributes:{},index:null}}function p(M,P,F,V){const K=r.attributes,X=P.attributes;let k=0;const Q=F.getAttributes();for(const Z in Q)if(Q[Z].location>=0){const Et=K[Z];let Pt=X[Z];if(Pt===void 0&&(Z==="instanceMatrix"&&M.instanceMatrix&&(Pt=M.instanceMatrix),Z==="instanceColor"&&M.instanceColor&&(Pt=M.instanceColor)),Et===void 0||Et.attribute!==Pt||Pt&&Et.data!==Pt.data)return!0;k++}return r.attributesNum!==k||r.index!==V}function g(M,P,F,V){const K={},X=P.attributes;let k=0;const Q=F.getAttributes();for(const Z in Q)if(Q[Z].location>=0){let Et=X[Z];Et===void 0&&(Z==="instanceMatrix"&&M.instanceMatrix&&(Et=M.instanceMatrix),Z==="instanceColor"&&M.instanceColor&&(Et=M.instanceColor));const Pt={};Pt.attribute=Et,Et&&Et.data&&(Pt.data=Et.data),K[Z]=Pt,k++}r.attributes=K,r.attributesNum=k,r.index=V}function x(){const M=r.newAttributes;for(let P=0,F=M.length;P<F;P++)M[P]=0}function m(M){u(M,0)}function u(M,P){const F=r.newAttributes,V=r.enabledAttributes,K=r.attributeDivisors;F[M]=1,V[M]===0&&(i.enableVertexAttribArray(M),V[M]=1),K[M]!==P&&(i.vertexAttribDivisor(M,P),K[M]=P)}function T(){const M=r.newAttributes,P=r.enabledAttributes;for(let F=0,V=P.length;F<V;F++)P[F]!==M[F]&&(i.disableVertexAttribArray(F),P[F]=0)}function E(M,P,F,V,K,X,k){k===!0?i.vertexAttribIPointer(M,P,F,K,X):i.vertexAttribPointer(M,P,F,V,K,X)}function v(M,P,F,V){x();const K=V.attributes,X=F.getAttributes(),k=P.defaultAttributeValues;for(const Q in X){const Z=X[Q];if(Z.location>=0){let _t=K[Q];if(_t===void 0&&(Q==="instanceMatrix"&&M.instanceMatrix&&(_t=M.instanceMatrix),Q==="instanceColor"&&M.instanceColor&&(_t=M.instanceColor)),_t!==void 0){const Et=_t.normalized,Pt=_t.itemSize,Jt=t.get(_t);if(Jt===void 0)continue;const ie=Jt.buffer,he=Jt.type,le=Jt.bytesPerElement,J=he===i.INT||he===i.UNSIGNED_INT||_t.gpuType===Do;if(_t.isInterleavedBufferAttribute){const rt=_t.data,bt=rt.stride,Bt=_t.offset;if(rt.isInstancedInterleavedBuffer){for(let Dt=0;Dt<Z.locationSize;Dt++)u(Z.location+Dt,rt.meshPerAttribute);M.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Dt=0;Dt<Z.locationSize;Dt++)m(Z.location+Dt);i.bindBuffer(i.ARRAY_BUFFER,ie);for(let Dt=0;Dt<Z.locationSize;Dt++)E(Z.location+Dt,Pt/Z.locationSize,he,Et,bt*le,(Bt+Pt/Z.locationSize*Dt)*le,J)}else{if(_t.isInstancedBufferAttribute){for(let rt=0;rt<Z.locationSize;rt++)u(Z.location+rt,_t.meshPerAttribute);M.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=_t.meshPerAttribute*_t.count)}else for(let rt=0;rt<Z.locationSize;rt++)m(Z.location+rt);i.bindBuffer(i.ARRAY_BUFFER,ie);for(let rt=0;rt<Z.locationSize;rt++)E(Z.location+rt,Pt/Z.locationSize,he,Et,Pt*le,Pt/Z.locationSize*rt*le,J)}}else if(k!==void 0){const Et=k[Q];if(Et!==void 0)switch(Et.length){case 2:i.vertexAttrib2fv(Z.location,Et);break;case 3:i.vertexAttrib3fv(Z.location,Et);break;case 4:i.vertexAttrib4fv(Z.location,Et);break;default:i.vertexAttrib1fv(Z.location,Et)}}}}T()}function C(){I();for(const M in n){const P=n[M];for(const F in P){const V=P[F];for(const K in V)h(V[K].object),delete V[K];delete P[F]}delete n[M]}}function R(M){if(n[M.id]===void 0)return;const P=n[M.id];for(const F in P){const V=P[F];for(const K in V)h(V[K].object),delete V[K];delete P[F]}delete n[M.id]}function L(M){for(const P in n){const F=n[P];if(F[M.id]===void 0)continue;const V=F[M.id];for(const K in V)h(V[K].object),delete V[K];delete F[M.id]}}function I(){y(),a=!0,r!==s&&(r=s,c(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:y,dispose:C,releaseStatesOfGeometry:R,releaseStatesOfProgram:L,initAttributes:x,enableAttribute:m,disableUnusedAttributes:T}}function $p(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,d){d!==0&&(i.drawArraysInstanced(n,c,h,d),e.update(h,n,d))}function o(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let p=0;for(let g=0;g<d;g++)p+=h[g];e.update(p,n,1)}function l(c,h,d,f){if(d===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)a(c[g],h[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,d);let g=0;for(let x=0;x<d;x++)g+=h[x]*f[x];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Jp(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const L=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(L){return!(L!==fn&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(L){const I=L===Mn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(L!==yn&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&L!==Fn&&!I)}function l(L){if(L==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),C=g>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:u,maxVertexUniforms:T,maxVaryings:E,maxFragmentUniforms:v,vertexTextures:C,maxSamples:R}}function jp(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new mi,o=new Qt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const p=d.length!==0||f||n!==0||s;return s=f,n=d.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){e=h(d,f,0)},this.setState=function(d,f,p){const g=d.clippingPlanes,x=d.clipIntersection,m=d.clipShadows,u=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const T=r?0:n,E=T*4;let v=u.clippingState||null;l.value=v,v=h(g,f,E,p);for(let C=0;C!==E;++C)v[C]=e[C];u.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,f,p,g){const x=d!==null?d.length:0;let m=null;if(x!==0){if(m=l.value,g!==!0||m===null){const u=p+x*4,T=f.matrixWorldInverse;o.getNormalMatrix(T),(m===null||m.length<u)&&(m=new Float32Array(u));for(let E=0,v=p;E!==x;++E,v+=4)a.copy(d[E]).applyMatrix4(T,o),a.normal.toArray(m,v),m[v+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}function Qp(i){let t=new WeakMap;function e(a,o){return o===Ga?a.mapping=ts:o===Wa&&(a.mapping=es),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ga||o===Wa)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new _u(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const $i=4,Ol=[.125,.215,.35,.446,.526,.582],xi=20,Sa=new Ko,Bl=new Zt;let Ea=null,Ta=0,ba=0,wa=!1;const gi=(1+Math.sqrt(5))/2,Yi=1/gi,zl=[new w(-gi,Yi,0),new w(gi,Yi,0),new w(-Yi,0,gi),new w(Yi,0,gi),new w(0,gi,-Yi),new w(0,gi,Yi),new w(-1,1,-1),new w(1,1,-1),new w(-1,1,1),new w(1,1,1)],tm=new w;class kl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=tm}=r;Ea=this._renderer.getRenderTarget(),Ta=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel(),wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Vl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ea,Ta,ba),this._renderer.xr.enabled=wa,t.scissorTest=!1,xr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ts||t.mapping===es?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ea=this._renderer.getRenderTarget(),Ta=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel(),wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:_n,minFilter:_n,generateMipmaps:!1,type:Mn,format:fn,colorSpace:ns,depthBuffer:!1},s=Hl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Hl(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=em(r)),this._blurMaterial=nm(r,t,e)}return s}_compileMaterial(t){const e=new Lt(this._lodPlanes[0],t);this._renderer.compile(e,Sa)}_sceneToCubeUV(t,e,n,s,r){const l=new Je(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,p=d.toneMapping;d.getClearColor(Bl),d.toneMapping=ei,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null));const x=new ce({name:"PMREM.Background",side:We,depthWrite:!1,depthTest:!1}),m=new Lt(new on,x);let u=!1;const T=t.background;T?T.isColor&&(x.color.copy(T),t.background=null,u=!0):(x.color.copy(Bl),u=!0);for(let E=0;E<6;E++){const v=E%3;v===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[E],r.y,r.z)):v===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[E]));const C=this._cubeSize;xr(s,v*C,E>2?C:0,C,C),d.setRenderTarget(s),u&&d.render(m,l),d.render(t,l)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=p,d.autoClear=f,t.background=T}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===ts||t.mapping===es;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Vl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Lt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;xr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Sa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=zl[(s-r-1)%zl.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Lt(this._lodPlanes[s],c),f=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*xi-1),x=r/g,m=isFinite(r)?1+Math.floor(h*x):xi;m>xi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${xi}`);const u=[];let T=0;for(let L=0;L<xi;++L){const I=L/x,y=Math.exp(-I*I/2);u.push(y),L===0?T+=y:L<m&&(T+=2*y)}for(let L=0;L<u.length;L++)u[L]=u[L]/T;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=u,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:E}=this;f.dTheta.value=g,f.mipInt.value=E-n;const v=this._sizeLods[s],C=3*v*(s>E-$i?s-E+$i:0),R=4*(this._cubeSize-v);xr(e,C,R,3*v,2*v),l.setRenderTarget(e),l.render(d,Sa)}}function em(i){const t=[],e=[],n=[];let s=i;const r=i-$i+1+Ol.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-$i?l=Ol[a-i+$i-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,d=1+c,f=[h,h,d,h,d,d,h,h,d,d,h,d],p=6,g=6,x=3,m=2,u=1,T=new Float32Array(x*g*p),E=new Float32Array(m*g*p),v=new Float32Array(u*g*p);for(let R=0;R<p;R++){const L=R%3*2/3-1,I=R>2?0:-1,y=[L,I,0,L+2/3,I,0,L+2/3,I+1,0,L,I,0,L+2/3,I+1,0,L,I+1,0];T.set(y,x*g*R),E.set(f,m*g*R);const M=[R,R,R,R,R,R];v.set(M,u*g*R)}const C=new ye;C.setAttribute("position",new tn(T,x)),C.setAttribute("uv",new tn(E,m)),C.setAttribute("faceIndex",new tn(v,u)),t.push(C),s>$i&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Hl(i,t,e){const n=new an(i,t,e);return n.texture.mapping=Nr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function xr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function nm(i,t,e){const n=new Float32Array(xi),s=new w(0,1,0);return new He({name:"SphericalGaussianBlur",defines:{n:xi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:$o(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function Vl(){return new He({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:$o(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function Gl(){return new He({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:$o(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function $o(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function im(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Ga||l===Wa,h=l===ts||l===es;if(c||h){let d=t.get(o);const f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new kl(i)),d=c?e.fromEquirectangular(o,d):e.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),d.texture;if(d!==void 0)return d.texture;{const p=o.image;return c&&p&&p.height>0||h&&p&&s(p)?(e===null&&(e=new kl(i)),d=c?e.fromEquirectangular(o):e.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function sm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ls("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function rm(i,t,e,n){const s={},r=new WeakMap;function a(d){const f=d.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete s[f.id];const p=r.get(f);p&&(t.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(d,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function l(d){const f=d.attributes;for(const p in f)t.update(f[p],i.ARRAY_BUFFER)}function c(d){const f=[],p=d.index,g=d.attributes.position;let x=0;if(p!==null){const T=p.array;x=p.version;for(let E=0,v=T.length;E<v;E+=3){const C=T[E+0],R=T[E+1],L=T[E+2];f.push(C,R,R,L,L,C)}}else if(g!==void 0){const T=g.array;x=g.version;for(let E=0,v=T.length/3-1;E<v;E+=3){const C=E+0,R=E+1,L=E+2;f.push(C,R,R,L,L,C)}}else return;const m=new(Ic(f)?Bc:Oc)(f,1);m.version=x;const u=r.get(d);u&&t.remove(u),r.set(d,m)}function h(d){const f=r.get(d);if(f){const p=d.index;p!==null&&f.version<p.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function am(i,t,e){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,p){i.drawElements(n,p,r,f*a),e.update(p,n,1)}function c(f,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,f*a,g),e.update(p,n,g))}function h(f,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,g);let m=0;for(let u=0;u<g;u++)m+=p[u];e.update(m,n,1)}function d(f,p,g,x){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let u=0;u<f.length;u++)c(f[u]/a,p[u],x[u]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,x,0,g);let u=0;for(let T=0;T<g;T++)u+=p[T]*x[T];e.update(u,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function om(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function lm(i,t,e){const n=new WeakMap,s=new xe;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==d){let M=function(){I.dispose(),n.delete(o),o.removeEventListener("dispose",M)};var p=M;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],T=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let v=0;g===!0&&(v=1),x===!0&&(v=2),m===!0&&(v=3);let C=o.attributes.position.count*v,R=1;C>t.maxTextureSize&&(R=Math.ceil(C/t.maxTextureSize),C=t.maxTextureSize);const L=new Float32Array(C*R*4*d),I=new Uc(L,C,R,d);I.type=Fn,I.needsUpdate=!0;const y=v*4;for(let P=0;P<d;P++){const F=u[P],V=T[P],K=E[P],X=C*R*4*P;for(let k=0;k<F.count;k++){const Q=k*y;g===!0&&(s.fromBufferAttribute(F,k),L[X+Q+0]=s.x,L[X+Q+1]=s.y,L[X+Q+2]=s.z,L[X+Q+3]=0),x===!0&&(s.fromBufferAttribute(V,k),L[X+Q+4]=s.x,L[X+Q+5]=s.y,L[X+Q+6]=s.z,L[X+Q+7]=0),m===!0&&(s.fromBufferAttribute(K,k),L[X+Q+8]=s.x,L[X+Q+9]=s.y,L[X+Q+10]=s.z,L[X+Q+11]=K.itemSize===4?s.w:1)}}f={count:d,texture:I,size:new ot(C,R)},n.set(o,f),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const x=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",x),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function cm(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return d}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}const ih=new Xe,Wl=new Gc(1,1),sh=new Uc,rh=new eu,ah=new Hc,Xl=[],ql=[],Yl=new Float32Array(16),Zl=new Float32Array(9),Kl=new Float32Array(4);function os(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Xl[s];if(r===void 0&&(r=new Float32Array(s),Xl[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Ce(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Pe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function zr(i,t){let e=ql[t];e===void 0&&(e=new Int32Array(t),ql[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function hm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function um(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;i.uniform2fv(this.addr,t),Pe(e,t)}}function dm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ce(e,t))return;i.uniform3fv(this.addr,t),Pe(e,t)}}function fm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;i.uniform4fv(this.addr,t),Pe(e,t)}}function pm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,n))return;Kl.set(n),i.uniformMatrix2fv(this.addr,!1,Kl),Pe(e,n)}}function mm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,n))return;Zl.set(n),i.uniformMatrix3fv(this.addr,!1,Zl),Pe(e,n)}}function gm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,n))return;Yl.set(n),i.uniformMatrix4fv(this.addr,!1,Yl),Pe(e,n)}}function _m(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;i.uniform2iv(this.addr,t),Pe(e,t)}}function vm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;i.uniform3iv(this.addr,t),Pe(e,t)}}function Mm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;i.uniform4iv(this.addr,t),Pe(e,t)}}function ym(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Sm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;i.uniform2uiv(this.addr,t),Pe(e,t)}}function Em(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;i.uniform3uiv(this.addr,t),Pe(e,t)}}function Tm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;i.uniform4uiv(this.addr,t),Pe(e,t)}}function bm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Wl.compareFunction=Dc,r=Wl):r=ih,e.setTexture2D(t||r,s)}function wm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||rh,s)}function Am(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||ah,s)}function Rm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||sh,s)}function Cm(i){switch(i){case 5126:return hm;case 35664:return um;case 35665:return dm;case 35666:return fm;case 35674:return pm;case 35675:return mm;case 35676:return gm;case 5124:case 35670:return _m;case 35667:case 35671:return xm;case 35668:case 35672:return vm;case 35669:case 35673:return Mm;case 5125:return ym;case 36294:return Sm;case 36295:return Em;case 36296:return Tm;case 35678:case 36198:case 36298:case 36306:case 35682:return bm;case 35679:case 36299:case 36307:return wm;case 35680:case 36300:case 36308:case 36293:return Am;case 36289:case 36303:case 36311:case 36292:return Rm}}function Pm(i,t){i.uniform1fv(this.addr,t)}function Lm(i,t){const e=os(t,this.size,2);i.uniform2fv(this.addr,e)}function Dm(i,t){const e=os(t,this.size,3);i.uniform3fv(this.addr,e)}function Im(i,t){const e=os(t,this.size,4);i.uniform4fv(this.addr,e)}function Um(i,t){const e=os(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Nm(i,t){const e=os(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Fm(i,t){const e=os(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Om(i,t){i.uniform1iv(this.addr,t)}function Bm(i,t){i.uniform2iv(this.addr,t)}function zm(i,t){i.uniform3iv(this.addr,t)}function km(i,t){i.uniform4iv(this.addr,t)}function Hm(i,t){i.uniform1uiv(this.addr,t)}function Vm(i,t){i.uniform2uiv(this.addr,t)}function Gm(i,t){i.uniform3uiv(this.addr,t)}function Wm(i,t){i.uniform4uiv(this.addr,t)}function Xm(i,t,e){const n=this.cache,s=t.length,r=zr(e,s);Ce(n,r)||(i.uniform1iv(this.addr,r),Pe(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||ih,r[a])}function qm(i,t,e){const n=this.cache,s=t.length,r=zr(e,s);Ce(n,r)||(i.uniform1iv(this.addr,r),Pe(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||rh,r[a])}function Ym(i,t,e){const n=this.cache,s=t.length,r=zr(e,s);Ce(n,r)||(i.uniform1iv(this.addr,r),Pe(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||ah,r[a])}function Zm(i,t,e){const n=this.cache,s=t.length,r=zr(e,s);Ce(n,r)||(i.uniform1iv(this.addr,r),Pe(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||sh,r[a])}function Km(i){switch(i){case 5126:return Pm;case 35664:return Lm;case 35665:return Dm;case 35666:return Im;case 35674:return Um;case 35675:return Nm;case 35676:return Fm;case 5124:case 35670:return Om;case 35667:case 35671:return Bm;case 35668:case 35672:return zm;case 35669:case 35673:return km;case 5125:return Hm;case 36294:return Vm;case 36295:return Gm;case 36296:return Wm;case 35678:case 36198:case 36298:case 36306:case 35682:return Xm;case 35679:case 36299:case 36307:return qm;case 35680:case 36300:case 36308:case 36293:return Ym;case 36289:case 36303:case 36311:case 36292:return Zm}}class $m{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Cm(e.type)}}class Jm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Km(e.type)}}class jm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Aa=/(\w+)(\])?(\[|\.)?/g;function $l(i,t){i.seq.push(t),i.map[t.id]=t}function Qm(i,t,e){const n=i.name,s=n.length;for(Aa.lastIndex=0;;){const r=Aa.exec(n),a=Aa.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){$l(e,c===void 0?new $m(o,i,t):new Jm(o,i,t));break}else{let d=e.map[o];d===void 0&&(d=new jm(o),$l(e,d)),e=d}}}class wr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Qm(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Jl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const t0=37297;let e0=0;function n0(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const jl=new Qt;function i0(i){ue._getMatrix(jl,ue.workingColorSpace,i);const t=`mat3( ${jl.elements.map(e=>e.toFixed(4))} )`;switch(ue.getTransfer(i)){case Rr:return[t,"LinearTransferOETF"];case me:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Ql(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+n0(i.getShaderSource(t),o)}else return r}function s0(i,t){const e=i0(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function r0(i,t){let e;switch(t){case gc:e="Linear";break;case _c:e="Reinhard";break;case xc:e="Cineon";break;case Lo:e="ACESFilmic";break;case Mc:e="AgX";break;case yc:e="Neutral";break;case vc:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const vr=new w;function a0(){ue.getLuminanceCoefficients(vr);const i=vr.x.toFixed(4),t=vr.y.toFixed(4),e=vr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function o0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Es).join(`
`)}function l0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function c0(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Es(i){return i!==""}function tc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function ec(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const h0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ro(i){return i.replace(h0,d0)}const u0=new Map;function d0(i,t){let e=ne[t];if(e===void 0){const n=u0.get(t);if(n!==void 0)e=ne[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ro(e)}const f0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nc(i){return i.replace(f0,p0)}function p0(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ic(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function m0(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===fc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===pc?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Nn&&(t="SHADOWMAP_TYPE_VSM"),t}function g0(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ts:case es:t="ENVMAP_TYPE_CUBE";break;case Nr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function _0(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case es:t="ENVMAP_MODE_REFRACTION";break}return t}function x0(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case mc:t="ENVMAP_BLENDING_MULTIPLY";break;case Uh:t="ENVMAP_BLENDING_MIX";break;case Nh:t="ENVMAP_BLENDING_ADD";break}return t}function v0(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function M0(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=m0(e),c=g0(e),h=_0(e),d=x0(e),f=v0(e),p=o0(e),g=l0(r),x=s.createProgram();let m,u,T=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Es).join(`
`),m.length>0&&(m+=`
`),u=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Es).join(`
`),u.length>0&&(u+=`
`)):(m=[ic(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Es).join(`
`),u=[ic(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ei?"#define TONE_MAPPING":"",e.toneMapping!==ei?ne.tonemapping_pars_fragment:"",e.toneMapping!==ei?r0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ne.colorspace_pars_fragment,s0("linearToOutputTexel",e.outputColorSpace),a0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Es).join(`
`)),a=Ro(a),a=tc(a,e),a=ec(a,e),o=Ro(o),o=tc(o,e),o=ec(o,e),a=nc(a),o=nc(o),e.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,u=["#define varying in",e.glslVersion===il?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===il?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const E=T+m+a,v=T+u+o,C=Jl(s,s.VERTEX_SHADER,E),R=Jl(s,s.FRAGMENT_SHADER,v);s.attachShader(x,C),s.attachShader(x,R),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function L(P){if(i.debug.checkShaderErrors){const F=s.getProgramInfoLog(x)||"",V=s.getShaderInfoLog(C)||"",K=s.getShaderInfoLog(R)||"",X=F.trim(),k=V.trim(),Q=K.trim();let Z=!0,_t=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(Z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,C,R);else{const Et=Ql(s,C,"vertex"),Pt=Ql(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+X+`
`+Et+`
`+Pt)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(k===""||Q==="")&&(_t=!1);_t&&(P.diagnostics={runnable:Z,programLog:X,vertexShader:{log:k,prefix:m},fragmentShader:{log:Q,prefix:u}})}s.deleteShader(C),s.deleteShader(R),I=new wr(s,x),y=c0(s,x)}let I;this.getUniforms=function(){return I===void 0&&L(this),I};let y;this.getAttributes=function(){return y===void 0&&L(this),y};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(x,t0)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=e0++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=C,this.fragmentShader=R,this}let y0=0;class S0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new E0(t),e.set(t,n)),n}}class E0{constructor(t){this.id=y0++,this.code=t,this.usedTimes=0}}function T0(i,t,e,n,s,r,a){const o=new Nc,l=new S0,c=new Set,h=[],d=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(y){return c.add(y),y===0?"uv":`uv${y}`}function m(y,M,P,F,V){const K=F.fog,X=V.geometry,k=y.isMeshStandardMaterial?F.environment:null,Q=(y.isMeshStandardMaterial?e:t).get(y.envMap||k),Z=Q&&Q.mapping===Nr?Q.image.height:null,_t=g[y.type];y.precision!==null&&(p=s.getMaxPrecision(y.precision),p!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));const Et=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Pt=Et!==void 0?Et.length:0;let Jt=0;X.morphAttributes.position!==void 0&&(Jt=1),X.morphAttributes.normal!==void 0&&(Jt=2),X.morphAttributes.color!==void 0&&(Jt=3);let ie,he,le,J;if(_t){const re=mn[_t];ie=re.vertexShader,he=re.fragmentShader}else ie=y.vertexShader,he=y.fragmentShader,l.update(y),le=l.getVertexShaderID(y),J=l.getFragmentShaderID(y);const rt=i.getRenderTarget(),bt=i.state.buffers.depth.getReversed(),Bt=V.isInstancedMesh===!0,Dt=V.isBatchedMesh===!0,te=!!y.map,jt=!!y.matcap,D=!!Q,st=!!y.aoMap,nt=!!y.lightMap,j=!!y.bumpMap,$=!!y.normalMap,gt=!!y.displacementMap,at=!!y.emissiveMap,lt=!!y.metalnessMap,Kt=!!y.roughnessMap,Gt=y.anisotropy>0,b=y.clearcoat>0,_=y.dispersion>0,z=y.iridescence>0,q=y.sheen>0,it=y.transmission>0,Y=Gt&&!!y.anisotropyMap,Nt=b&&!!y.clearcoatMap,ft=b&&!!y.clearcoatNormalMap,It=b&&!!y.clearcoatRoughnessMap,At=z&&!!y.iridescenceMap,ct=z&&!!y.iridescenceThicknessMap,yt=q&&!!y.sheenColorMap,kt=q&&!!y.sheenRoughnessMap,Ft=!!y.specularMap,vt=!!y.specularColorMap,Vt=!!y.specularIntensityMap,N=it&&!!y.transmissionMap,dt=it&&!!y.thicknessMap,pt=!!y.gradientMap,Ut=!!y.alphaMap,ht=y.alphaTest>0,tt=!!y.alphaHash,wt=!!y.extensions;let Wt=ei;y.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(Wt=i.toneMapping);const pe={shaderID:_t,shaderType:y.type,shaderName:y.name,vertexShader:ie,fragmentShader:he,defines:y.defines,customVertexShaderID:le,customFragmentShaderID:J,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:Dt,batchingColor:Dt&&V._colorsTexture!==null,instancing:Bt,instancingColor:Bt&&V.instanceColor!==null,instancingMorph:Bt&&V.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:rt===null?i.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:ns,alphaToCoverage:!!y.alphaToCoverage,map:te,matcap:jt,envMap:D,envMapMode:D&&Q.mapping,envMapCubeUVHeight:Z,aoMap:st,lightMap:nt,bumpMap:j,normalMap:$,displacementMap:f&&gt,emissiveMap:at,normalMapObjectSpace:$&&y.normalMapType===zh,normalMapTangentSpace:$&&y.normalMapType===Lc,metalnessMap:lt,roughnessMap:Kt,anisotropy:Gt,anisotropyMap:Y,clearcoat:b,clearcoatMap:Nt,clearcoatNormalMap:ft,clearcoatRoughnessMap:It,dispersion:_,iridescence:z,iridescenceMap:At,iridescenceThicknessMap:ct,sheen:q,sheenColorMap:yt,sheenRoughnessMap:kt,specularMap:Ft,specularColorMap:vt,specularIntensityMap:Vt,transmission:it,transmissionMap:N,thicknessMap:dt,gradientMap:pt,opaque:y.transparent===!1&&y.blending===yi&&y.alphaToCoverage===!1,alphaMap:Ut,alphaTest:ht,alphaHash:tt,combine:y.combine,mapUv:te&&x(y.map.channel),aoMapUv:st&&x(y.aoMap.channel),lightMapUv:nt&&x(y.lightMap.channel),bumpMapUv:j&&x(y.bumpMap.channel),normalMapUv:$&&x(y.normalMap.channel),displacementMapUv:gt&&x(y.displacementMap.channel),emissiveMapUv:at&&x(y.emissiveMap.channel),metalnessMapUv:lt&&x(y.metalnessMap.channel),roughnessMapUv:Kt&&x(y.roughnessMap.channel),anisotropyMapUv:Y&&x(y.anisotropyMap.channel),clearcoatMapUv:Nt&&x(y.clearcoatMap.channel),clearcoatNormalMapUv:ft&&x(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:It&&x(y.clearcoatRoughnessMap.channel),iridescenceMapUv:At&&x(y.iridescenceMap.channel),iridescenceThicknessMapUv:ct&&x(y.iridescenceThicknessMap.channel),sheenColorMapUv:yt&&x(y.sheenColorMap.channel),sheenRoughnessMapUv:kt&&x(y.sheenRoughnessMap.channel),specularMapUv:Ft&&x(y.specularMap.channel),specularColorMapUv:vt&&x(y.specularColorMap.channel),specularIntensityMapUv:Vt&&x(y.specularIntensityMap.channel),transmissionMapUv:N&&x(y.transmissionMap.channel),thicknessMapUv:dt&&x(y.thicknessMap.channel),alphaMapUv:Ut&&x(y.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&($||Gt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!X.attributes.uv&&(te||Ut),fog:!!K,useFog:y.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:bt,skinning:V.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:Pt,morphTextureStride:Jt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:Wt,decodeVideoTexture:te&&y.map.isVideoTexture===!0&&ue.getTransfer(y.map.colorSpace)===me,decodeVideoTextureEmissive:at&&y.emissiveMap.isVideoTexture===!0&&ue.getTransfer(y.emissiveMap.colorSpace)===me,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===je,flipSided:y.side===We,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:wt&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(wt&&y.extensions.multiDraw===!0||Dt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return pe.vertexUv1s=c.has(1),pe.vertexUv2s=c.has(2),pe.vertexUv3s=c.has(3),c.clear(),pe}function u(y){const M=[];if(y.shaderID?M.push(y.shaderID):(M.push(y.customVertexShaderID),M.push(y.customFragmentShaderID)),y.defines!==void 0)for(const P in y.defines)M.push(P),M.push(y.defines[P]);return y.isRawShaderMaterial===!1&&(T(M,y),E(M,y),M.push(i.outputColorSpace)),M.push(y.customProgramCacheKey),M.join()}function T(y,M){y.push(M.precision),y.push(M.outputColorSpace),y.push(M.envMapMode),y.push(M.envMapCubeUVHeight),y.push(M.mapUv),y.push(M.alphaMapUv),y.push(M.lightMapUv),y.push(M.aoMapUv),y.push(M.bumpMapUv),y.push(M.normalMapUv),y.push(M.displacementMapUv),y.push(M.emissiveMapUv),y.push(M.metalnessMapUv),y.push(M.roughnessMapUv),y.push(M.anisotropyMapUv),y.push(M.clearcoatMapUv),y.push(M.clearcoatNormalMapUv),y.push(M.clearcoatRoughnessMapUv),y.push(M.iridescenceMapUv),y.push(M.iridescenceThicknessMapUv),y.push(M.sheenColorMapUv),y.push(M.sheenRoughnessMapUv),y.push(M.specularMapUv),y.push(M.specularColorMapUv),y.push(M.specularIntensityMapUv),y.push(M.transmissionMapUv),y.push(M.thicknessMapUv),y.push(M.combine),y.push(M.fogExp2),y.push(M.sizeAttenuation),y.push(M.morphTargetsCount),y.push(M.morphAttributeCount),y.push(M.numDirLights),y.push(M.numPointLights),y.push(M.numSpotLights),y.push(M.numSpotLightMaps),y.push(M.numHemiLights),y.push(M.numRectAreaLights),y.push(M.numDirLightShadows),y.push(M.numPointLightShadows),y.push(M.numSpotLightShadows),y.push(M.numSpotLightShadowsWithMaps),y.push(M.numLightProbes),y.push(M.shadowMapType),y.push(M.toneMapping),y.push(M.numClippingPlanes),y.push(M.numClipIntersection),y.push(M.depthPacking)}function E(y,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),M.gradientMap&&o.enable(22),y.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),y.push(o.mask)}function v(y){const M=g[y.type];let P;if(M){const F=mn[M];P=Ds.clone(F.uniforms)}else P=y.uniforms;return P}function C(y,M){let P;for(let F=0,V=h.length;F<V;F++){const K=h[F];if(K.cacheKey===M){P=K,++P.usedTimes;break}}return P===void 0&&(P=new M0(i,M,y,r),h.push(P)),P}function R(y){if(--y.usedTimes===0){const M=h.indexOf(y);h[M]=h[h.length-1],h.pop(),y.destroy()}}function L(y){l.remove(y)}function I(){l.dispose()}return{getParameters:m,getProgramCacheKey:u,getUniforms:v,acquireProgram:C,releaseProgram:R,releaseShaderCache:L,programs:h,dispose:I}}function b0(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function w0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function sc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function rc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(d,f,p,g,x,m){let u=i[t];return u===void 0?(u={id:d.id,object:d,geometry:f,material:p,groupOrder:g,renderOrder:d.renderOrder,z:x,group:m},i[t]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=p,u.groupOrder=g,u.renderOrder=d.renderOrder,u.z=x,u.group=m),t++,u}function o(d,f,p,g,x,m){const u=a(d,f,p,g,x,m);p.transmission>0?n.push(u):p.transparent===!0?s.push(u):e.push(u)}function l(d,f,p,g,x,m){const u=a(d,f,p,g,x,m);p.transmission>0?n.unshift(u):p.transparent===!0?s.unshift(u):e.unshift(u)}function c(d,f){e.length>1&&e.sort(d||w0),n.length>1&&n.sort(f||sc),s.length>1&&s.sort(f||sc)}function h(){for(let d=t,f=i.length;d<f;d++){const p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function A0(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new rc,i.set(n,[a])):s>=r.length?(a=new rc,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function R0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new w,color:new Zt};break;case"SpotLight":e={position:new w,direction:new w,color:new Zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new w,color:new Zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new w,skyColor:new Zt,groundColor:new Zt};break;case"RectAreaLight":e={color:new Zt,position:new w,halfWidth:new w,halfHeight:new w};break}return i[t.id]=e,e}}}function C0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let P0=0;function L0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function D0(i){const t=new R0,e=C0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new w);const s=new w,r=new Me,a=new Me;function o(c){let h=0,d=0,f=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let p=0,g=0,x=0,m=0,u=0,T=0,E=0,v=0,C=0,R=0,L=0;c.sort(L0);for(let y=0,M=c.length;y<M;y++){const P=c[y],F=P.color,V=P.intensity,K=P.distance,X=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=F.r*V,d+=F.g*V,f+=F.b*V;else if(P.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(P.sh.coefficients[k],V);L++}else if(P.isDirectionalLight){const k=t.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const Q=P.shadow,Z=e.get(P);Z.shadowIntensity=Q.intensity,Z.shadowBias=Q.bias,Z.shadowNormalBias=Q.normalBias,Z.shadowRadius=Q.radius,Z.shadowMapSize=Q.mapSize,n.directionalShadow[p]=Z,n.directionalShadowMap[p]=X,n.directionalShadowMatrix[p]=P.shadow.matrix,T++}n.directional[p]=k,p++}else if(P.isSpotLight){const k=t.get(P);k.position.setFromMatrixPosition(P.matrixWorld),k.color.copy(F).multiplyScalar(V),k.distance=K,k.coneCos=Math.cos(P.angle),k.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),k.decay=P.decay,n.spot[x]=k;const Q=P.shadow;if(P.map&&(n.spotLightMap[C]=P.map,C++,Q.updateMatrices(P),P.castShadow&&R++),n.spotLightMatrix[x]=Q.matrix,P.castShadow){const Z=e.get(P);Z.shadowIntensity=Q.intensity,Z.shadowBias=Q.bias,Z.shadowNormalBias=Q.normalBias,Z.shadowRadius=Q.radius,Z.shadowMapSize=Q.mapSize,n.spotShadow[x]=Z,n.spotShadowMap[x]=X,v++}x++}else if(P.isRectAreaLight){const k=t.get(P);k.color.copy(F).multiplyScalar(V),k.halfWidth.set(P.width*.5,0,0),k.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=k,m++}else if(P.isPointLight){const k=t.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),k.distance=P.distance,k.decay=P.decay,P.castShadow){const Q=P.shadow,Z=e.get(P);Z.shadowIntensity=Q.intensity,Z.shadowBias=Q.bias,Z.shadowNormalBias=Q.normalBias,Z.shadowRadius=Q.radius,Z.shadowMapSize=Q.mapSize,Z.shadowCameraNear=Q.camera.near,Z.shadowCameraFar=Q.camera.far,n.pointShadow[g]=Z,n.pointShadowMap[g]=X,n.pointShadowMatrix[g]=P.shadow.matrix,E++}n.point[g]=k,g++}else if(P.isHemisphereLight){const k=t.get(P);k.skyColor.copy(P.color).multiplyScalar(V),k.groundColor.copy(P.groundColor).multiplyScalar(V),n.hemi[u]=k,u++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=f;const I=n.hash;(I.directionalLength!==p||I.pointLength!==g||I.spotLength!==x||I.rectAreaLength!==m||I.hemiLength!==u||I.numDirectionalShadows!==T||I.numPointShadows!==E||I.numSpotShadows!==v||I.numSpotMaps!==C||I.numLightProbes!==L)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=u,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=v+C-R,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=L,I.directionalLength=p,I.pointLength=g,I.spotLength=x,I.rectAreaLength=m,I.hemiLength=u,I.numDirectionalShadows=T,I.numPointShadows=E,I.numSpotShadows=v,I.numSpotMaps=C,I.numLightProbes=L,n.version=P0++)}function l(c,h){let d=0,f=0,p=0,g=0,x=0;const m=h.matrixWorldInverse;for(let u=0,T=c.length;u<T;u++){const E=c[u];if(E.isDirectionalLight){const v=n.directional[d];v.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),d++}else if(E.isSpotLight){const v=n.spot[p];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),p++}else if(E.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),a.identity(),r.copy(E.matrixWorld),r.premultiply(m),a.extractRotation(r),v.halfWidth.set(E.width*.5,0,0),v.halfHeight.set(0,E.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(E.isPointLight){const v=n.point[f];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),f++}else if(E.isHemisphereLight){const v=n.hemi[x];v.direction.setFromMatrixPosition(E.matrixWorld),v.direction.transformDirection(m),x++}}}return{setup:o,setupView:l,state:n}}function ac(i){const t=new D0(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function I0(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new ac(i),t.set(s,[o])):r>=a.length?(o=new ac(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const U0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,N0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function F0(i,t,e){let n=new Ho;const s=new ot,r=new ot,a=new xe,o=new id({depthPacking:Bh}),l=new sd,c={},h=e.maxTextureSize,d={[Hn]:We,[We]:Hn,[je]:je},f=new He({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:U0,fragmentShader:N0}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new ye;g.setAttribute("position",new tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Lt(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=fc;let u=this.type;this.render=function(R,L,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;const y=i.getRenderTarget(),M=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),F=i.state;F.setBlending(On),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const V=u!==Nn&&this.type===Nn,K=u===Nn&&this.type!==Nn;for(let X=0,k=R.length;X<k;X++){const Q=R[X],Z=Q.shadow;if(Z===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(Z.autoUpdate===!1&&Z.needsUpdate===!1)continue;s.copy(Z.mapSize);const _t=Z.getFrameExtents();if(s.multiply(_t),r.copy(Z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/_t.x),s.x=r.x*_t.x,Z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/_t.y),s.y=r.y*_t.y,Z.mapSize.y=r.y)),Z.map===null||V===!0||K===!0){const Pt=this.type!==Nn?{minFilter:pn,magFilter:pn}:{};Z.map!==null&&Z.map.dispose(),Z.map=new an(s.x,s.y,Pt),Z.map.texture.name=Q.name+".shadowMap",Z.camera.updateProjectionMatrix()}i.setRenderTarget(Z.map),i.clear();const Et=Z.getViewportCount();for(let Pt=0;Pt<Et;Pt++){const Jt=Z.getViewport(Pt);a.set(r.x*Jt.x,r.y*Jt.y,r.x*Jt.z,r.y*Jt.w),F.viewport(a),Z.updateMatrices(Q,Pt),n=Z.getFrustum(),v(L,I,Z.camera,Q,this.type)}Z.isPointLightShadow!==!0&&this.type===Nn&&T(Z,I),Z.needsUpdate=!1}u=this.type,m.needsUpdate=!1,i.setRenderTarget(y,M,P)};function T(R,L){const I=t.update(x);f.defines.VSM_SAMPLES!==R.blurSamples&&(f.defines.VSM_SAMPLES=R.blurSamples,p.defines.VSM_SAMPLES=R.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new an(s.x,s.y)),f.uniforms.shadow_pass.value=R.map.texture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(L,null,I,f,x,null),p.uniforms.shadow_pass.value=R.mapPass.texture,p.uniforms.resolution.value=R.mapSize,p.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(L,null,I,p,x,null)}function E(R,L,I,y){let M=null;const P=I.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(P!==void 0)M=P;else if(M=I.isPointLight===!0?l:o,i.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0||L.alphaToCoverage===!0){const F=M.uuid,V=L.uuid;let K=c[F];K===void 0&&(K={},c[F]=K);let X=K[V];X===void 0&&(X=M.clone(),K[V]=X,L.addEventListener("dispose",C)),M=X}if(M.visible=L.visible,M.wireframe=L.wireframe,y===Nn?M.side=L.shadowSide!==null?L.shadowSide:L.side:M.side=L.shadowSide!==null?L.shadowSide:d[L.side],M.alphaMap=L.alphaMap,M.alphaTest=L.alphaToCoverage===!0?.5:L.alphaTest,M.map=L.map,M.clipShadows=L.clipShadows,M.clippingPlanes=L.clippingPlanes,M.clipIntersection=L.clipIntersection,M.displacementMap=L.displacementMap,M.displacementScale=L.displacementScale,M.displacementBias=L.displacementBias,M.wireframeLinewidth=L.wireframeLinewidth,M.linewidth=L.linewidth,I.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const F=i.properties.get(M);F.light=I}return M}function v(R,L,I,y,M){if(R.visible===!1)return;if(R.layers.test(L.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&M===Nn)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,R.matrixWorld);const V=t.update(R),K=R.material;if(Array.isArray(K)){const X=V.groups;for(let k=0,Q=X.length;k<Q;k++){const Z=X[k],_t=K[Z.materialIndex];if(_t&&_t.visible){const Et=E(R,_t,y,M);R.onBeforeShadow(i,R,L,I,V,Et,Z),i.renderBufferDirect(I,null,V,Et,R,Z),R.onAfterShadow(i,R,L,I,V,Et,Z)}}}else if(K.visible){const X=E(R,K,y,M);R.onBeforeShadow(i,R,L,I,V,X,null),i.renderBufferDirect(I,null,V,X,R,null),R.onAfterShadow(i,R,L,I,V,X,null)}}const F=R.children;for(let V=0,K=F.length;V<K;V++)v(F[V],L,I,y,M)}function C(R){R.target.removeEventListener("dispose",C);for(const I in c){const y=c[I],M=R.target.uuid;M in y&&(y[M].dispose(),delete y[M])}}}const O0={[Fa]:Oa,[Ba]:Ha,[za]:Va,[Qi]:ka,[Oa]:Fa,[Ha]:Ba,[Va]:za,[ka]:Qi};function B0(i,t){function e(){let N=!1;const dt=new xe;let pt=null;const Ut=new xe(0,0,0,0);return{setMask:function(ht){pt!==ht&&!N&&(i.colorMask(ht,ht,ht,ht),pt=ht)},setLocked:function(ht){N=ht},setClear:function(ht,tt,wt,Wt,pe){pe===!0&&(ht*=Wt,tt*=Wt,wt*=Wt),dt.set(ht,tt,wt,Wt),Ut.equals(dt)===!1&&(i.clearColor(ht,tt,wt,Wt),Ut.copy(dt))},reset:function(){N=!1,pt=null,Ut.set(-1,0,0,0)}}}function n(){let N=!1,dt=!1,pt=null,Ut=null,ht=null;return{setReversed:function(tt){if(dt!==tt){const wt=t.get("EXT_clip_control");tt?wt.clipControlEXT(wt.LOWER_LEFT_EXT,wt.ZERO_TO_ONE_EXT):wt.clipControlEXT(wt.LOWER_LEFT_EXT,wt.NEGATIVE_ONE_TO_ONE_EXT),dt=tt;const Wt=ht;ht=null,this.setClear(Wt)}},getReversed:function(){return dt},setTest:function(tt){tt?rt(i.DEPTH_TEST):bt(i.DEPTH_TEST)},setMask:function(tt){pt!==tt&&!N&&(i.depthMask(tt),pt=tt)},setFunc:function(tt){if(dt&&(tt=O0[tt]),Ut!==tt){switch(tt){case Fa:i.depthFunc(i.NEVER);break;case Oa:i.depthFunc(i.ALWAYS);break;case Ba:i.depthFunc(i.LESS);break;case Qi:i.depthFunc(i.LEQUAL);break;case za:i.depthFunc(i.EQUAL);break;case ka:i.depthFunc(i.GEQUAL);break;case Ha:i.depthFunc(i.GREATER);break;case Va:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ut=tt}},setLocked:function(tt){N=tt},setClear:function(tt){ht!==tt&&(dt&&(tt=1-tt),i.clearDepth(tt),ht=tt)},reset:function(){N=!1,pt=null,Ut=null,ht=null,dt=!1}}}function s(){let N=!1,dt=null,pt=null,Ut=null,ht=null,tt=null,wt=null,Wt=null,pe=null;return{setTest:function(re){N||(re?rt(i.STENCIL_TEST):bt(i.STENCIL_TEST))},setMask:function(re){dt!==re&&!N&&(i.stencilMask(re),dt=re)},setFunc:function(re,ln,Ye){(pt!==re||Ut!==ln||ht!==Ye)&&(i.stencilFunc(re,ln,Ye),pt=re,Ut=ln,ht=Ye)},setOp:function(re,ln,Ye){(tt!==re||wt!==ln||Wt!==Ye)&&(i.stencilOp(re,ln,Ye),tt=re,wt=ln,Wt=Ye)},setLocked:function(re){N=re},setClear:function(re){pe!==re&&(i.clearStencil(re),pe=re)},reset:function(){N=!1,dt=null,pt=null,Ut=null,ht=null,tt=null,wt=null,Wt=null,pe=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},d={},f=new WeakMap,p=[],g=null,x=!1,m=null,u=null,T=null,E=null,v=null,C=null,R=null,L=new Zt(0,0,0),I=0,y=!1,M=null,P=null,F=null,V=null,K=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,Q=0;const Z=i.getParameter(i.VERSION);Z.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(Z)[1]),k=Q>=1):Z.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),k=Q>=2);let _t=null,Et={};const Pt=i.getParameter(i.SCISSOR_BOX),Jt=i.getParameter(i.VIEWPORT),ie=new xe().fromArray(Pt),he=new xe().fromArray(Jt);function le(N,dt,pt,Ut){const ht=new Uint8Array(4),tt=i.createTexture();i.bindTexture(N,tt),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let wt=0;wt<pt;wt++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(dt,0,i.RGBA,1,1,Ut,0,i.RGBA,i.UNSIGNED_BYTE,ht):i.texImage2D(dt+wt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ht);return tt}const J={};J[i.TEXTURE_2D]=le(i.TEXTURE_2D,i.TEXTURE_2D,1),J[i.TEXTURE_CUBE_MAP]=le(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[i.TEXTURE_2D_ARRAY]=le(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),J[i.TEXTURE_3D]=le(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),rt(i.DEPTH_TEST),a.setFunc(Qi),j(!1),$(Qo),rt(i.CULL_FACE),st(On);function rt(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function bt(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function Bt(N,dt){return d[N]!==dt?(i.bindFramebuffer(N,dt),d[N]=dt,N===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=dt),N===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=dt),!0):!1}function Dt(N,dt){let pt=p,Ut=!1;if(N){pt=f.get(dt),pt===void 0&&(pt=[],f.set(dt,pt));const ht=N.textures;if(pt.length!==ht.length||pt[0]!==i.COLOR_ATTACHMENT0){for(let tt=0,wt=ht.length;tt<wt;tt++)pt[tt]=i.COLOR_ATTACHMENT0+tt;pt.length=ht.length,Ut=!0}}else pt[0]!==i.BACK&&(pt[0]=i.BACK,Ut=!0);Ut&&i.drawBuffers(pt)}function te(N){return g!==N?(i.useProgram(N),g=N,!0):!1}const jt={[_i]:i.FUNC_ADD,[_h]:i.FUNC_SUBTRACT,[xh]:i.FUNC_REVERSE_SUBTRACT};jt[vh]=i.MIN,jt[Mh]=i.MAX;const D={[yh]:i.ZERO,[Sh]:i.ONE,[Eh]:i.SRC_COLOR,[Ua]:i.SRC_ALPHA,[Ch]:i.SRC_ALPHA_SATURATE,[Ah]:i.DST_COLOR,[bh]:i.DST_ALPHA,[Th]:i.ONE_MINUS_SRC_COLOR,[Na]:i.ONE_MINUS_SRC_ALPHA,[Rh]:i.ONE_MINUS_DST_COLOR,[wh]:i.ONE_MINUS_DST_ALPHA,[Ph]:i.CONSTANT_COLOR,[Lh]:i.ONE_MINUS_CONSTANT_COLOR,[Dh]:i.CONSTANT_ALPHA,[Ih]:i.ONE_MINUS_CONSTANT_ALPHA};function st(N,dt,pt,Ut,ht,tt,wt,Wt,pe,re){if(N===On){x===!0&&(bt(i.BLEND),x=!1);return}if(x===!1&&(rt(i.BLEND),x=!0),N!==gh){if(N!==m||re!==y){if((u!==_i||v!==_i)&&(i.blendEquation(i.FUNC_ADD),u=_i,v=_i),re)switch(N){case yi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Qe:i.blendFunc(i.ONE,i.ONE);break;case tl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case el:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case yi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Qe:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case tl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case el:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}T=null,E=null,C=null,R=null,L.set(0,0,0),I=0,m=N,y=re}return}ht=ht||dt,tt=tt||pt,wt=wt||Ut,(dt!==u||ht!==v)&&(i.blendEquationSeparate(jt[dt],jt[ht]),u=dt,v=ht),(pt!==T||Ut!==E||tt!==C||wt!==R)&&(i.blendFuncSeparate(D[pt],D[Ut],D[tt],D[wt]),T=pt,E=Ut,C=tt,R=wt),(Wt.equals(L)===!1||pe!==I)&&(i.blendColor(Wt.r,Wt.g,Wt.b,pe),L.copy(Wt),I=pe),m=N,y=!1}function nt(N,dt){N.side===je?bt(i.CULL_FACE):rt(i.CULL_FACE);let pt=N.side===We;dt&&(pt=!pt),j(pt),N.blending===yi&&N.transparent===!1?st(On):st(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);const Ut=N.stencilWrite;o.setTest(Ut),Ut&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),at(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?rt(i.SAMPLE_ALPHA_TO_COVERAGE):bt(i.SAMPLE_ALPHA_TO_COVERAGE)}function j(N){M!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),M=N)}function $(N){N!==ph?(rt(i.CULL_FACE),N!==P&&(N===Qo?i.cullFace(i.BACK):N===mh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):bt(i.CULL_FACE),P=N}function gt(N){N!==F&&(k&&i.lineWidth(N),F=N)}function at(N,dt,pt){N?(rt(i.POLYGON_OFFSET_FILL),(V!==dt||K!==pt)&&(i.polygonOffset(dt,pt),V=dt,K=pt)):bt(i.POLYGON_OFFSET_FILL)}function lt(N){N?rt(i.SCISSOR_TEST):bt(i.SCISSOR_TEST)}function Kt(N){N===void 0&&(N=i.TEXTURE0+X-1),_t!==N&&(i.activeTexture(N),_t=N)}function Gt(N,dt,pt){pt===void 0&&(_t===null?pt=i.TEXTURE0+X-1:pt=_t);let Ut=Et[pt];Ut===void 0&&(Ut={type:void 0,texture:void 0},Et[pt]=Ut),(Ut.type!==N||Ut.texture!==dt)&&(_t!==pt&&(i.activeTexture(pt),_t=pt),i.bindTexture(N,dt||J[N]),Ut.type=N,Ut.texture=dt)}function b(){const N=Et[_t];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function z(){try{i.compressedTexImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function q(){try{i.texSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function it(){try{i.texSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Y(){try{i.compressedTexSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Nt(){try{i.compressedTexSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ft(){try{i.texStorage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function It(){try{i.texStorage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function At(){try{i.texImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ct(){try{i.texImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function yt(N){ie.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),ie.copy(N))}function kt(N){he.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),he.copy(N))}function Ft(N,dt){let pt=c.get(dt);pt===void 0&&(pt=new WeakMap,c.set(dt,pt));let Ut=pt.get(N);Ut===void 0&&(Ut=i.getUniformBlockIndex(dt,N.name),pt.set(N,Ut))}function vt(N,dt){const Ut=c.get(dt).get(N);l.get(dt)!==Ut&&(i.uniformBlockBinding(dt,Ut,N.__bindingPointIndex),l.set(dt,Ut))}function Vt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},_t=null,Et={},d={},f=new WeakMap,p=[],g=null,x=!1,m=null,u=null,T=null,E=null,v=null,C=null,R=null,L=new Zt(0,0,0),I=0,y=!1,M=null,P=null,F=null,V=null,K=null,ie.set(0,0,i.canvas.width,i.canvas.height),he.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:rt,disable:bt,bindFramebuffer:Bt,drawBuffers:Dt,useProgram:te,setBlending:st,setMaterial:nt,setFlipSided:j,setCullFace:$,setLineWidth:gt,setPolygonOffset:at,setScissorTest:lt,activeTexture:Kt,bindTexture:Gt,unbindTexture:b,compressedTexImage2D:_,compressedTexImage3D:z,texImage2D:At,texImage3D:ct,updateUBOMapping:Ft,uniformBlockBinding:vt,texStorage2D:ft,texStorage3D:It,texSubImage2D:q,texSubImage3D:it,compressedTexSubImage2D:Y,compressedTexSubImage3D:Nt,scissor:yt,viewport:kt,reset:Vt}}function z0(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ot,h=new WeakMap;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(b,_){return p?new OffscreenCanvas(b,_):Pr("canvas")}function x(b,_,z){let q=1;const it=Gt(b);if((it.width>z||it.height>z)&&(q=z/Math.max(it.width,it.height)),q<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const Y=Math.floor(q*it.width),Nt=Math.floor(q*it.height);d===void 0&&(d=g(Y,Nt));const ft=_?g(Y,Nt):d;return ft.width=Y,ft.height=Nt,ft.getContext("2d").drawImage(b,0,0,Y,Nt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+it.width+"x"+it.height+") to ("+Y+"x"+Nt+")."),ft}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+it.width+"x"+it.height+")."),b;return b}function m(b){return b.generateMipmaps}function u(b){i.generateMipmap(b)}function T(b){return b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:b.isWebGL3DRenderTarget?i.TEXTURE_3D:b.isWebGLArrayRenderTarget||b.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(b,_,z,q,it=!1){if(b!==null){if(i[b]!==void 0)return i[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let Y=_;if(_===i.RED&&(z===i.FLOAT&&(Y=i.R32F),z===i.HALF_FLOAT&&(Y=i.R16F),z===i.UNSIGNED_BYTE&&(Y=i.R8)),_===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(Y=i.R8UI),z===i.UNSIGNED_SHORT&&(Y=i.R16UI),z===i.UNSIGNED_INT&&(Y=i.R32UI),z===i.BYTE&&(Y=i.R8I),z===i.SHORT&&(Y=i.R16I),z===i.INT&&(Y=i.R32I)),_===i.RG&&(z===i.FLOAT&&(Y=i.RG32F),z===i.HALF_FLOAT&&(Y=i.RG16F),z===i.UNSIGNED_BYTE&&(Y=i.RG8)),_===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(Y=i.RG8UI),z===i.UNSIGNED_SHORT&&(Y=i.RG16UI),z===i.UNSIGNED_INT&&(Y=i.RG32UI),z===i.BYTE&&(Y=i.RG8I),z===i.SHORT&&(Y=i.RG16I),z===i.INT&&(Y=i.RG32I)),_===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),z===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),z===i.UNSIGNED_INT&&(Y=i.RGB32UI),z===i.BYTE&&(Y=i.RGB8I),z===i.SHORT&&(Y=i.RGB16I),z===i.INT&&(Y=i.RGB32I)),_===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),z===i.UNSIGNED_INT&&(Y=i.RGBA32UI),z===i.BYTE&&(Y=i.RGBA8I),z===i.SHORT&&(Y=i.RGBA16I),z===i.INT&&(Y=i.RGBA32I)),_===i.RGB&&(z===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),z===i.UNSIGNED_INT_10F_11F_11F_REV&&(Y=i.R11F_G11F_B10F)),_===i.RGBA){const Nt=it?Rr:ue.getTransfer(q);z===i.FLOAT&&(Y=i.RGBA32F),z===i.HALF_FLOAT&&(Y=i.RGBA16F),z===i.UNSIGNED_BYTE&&(Y=Nt===me?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function v(b,_){let z;return b?_===null||_===Si||_===Rs?z=i.DEPTH24_STENCIL8:_===Fn?z=i.DEPTH32F_STENCIL8:_===As&&(z=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Si||_===Rs?z=i.DEPTH_COMPONENT24:_===Fn?z=i.DEPTH_COMPONENT32F:_===As&&(z=i.DEPTH_COMPONENT16),z}function C(b,_){return m(b)===!0||b.isFramebufferTexture&&b.minFilter!==pn&&b.minFilter!==_n?Math.log2(Math.max(_.width,_.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?_.mipmaps.length:1}function R(b){const _=b.target;_.removeEventListener("dispose",R),I(_),_.isVideoTexture&&h.delete(_)}function L(b){const _=b.target;_.removeEventListener("dispose",L),M(_)}function I(b){const _=n.get(b);if(_.__webglInit===void 0)return;const z=b.source,q=f.get(z);if(q){const it=q[_.__cacheKey];it.usedTimes--,it.usedTimes===0&&y(b),Object.keys(q).length===0&&f.delete(z)}n.remove(b)}function y(b){const _=n.get(b);i.deleteTexture(_.__webglTexture);const z=b.source,q=f.get(z);delete q[_.__cacheKey],a.memory.textures--}function M(b){const _=n.get(b);if(b.depthTexture&&(b.depthTexture.dispose(),n.remove(b.depthTexture)),b.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(_.__webglFramebuffer[q]))for(let it=0;it<_.__webglFramebuffer[q].length;it++)i.deleteFramebuffer(_.__webglFramebuffer[q][it]);else i.deleteFramebuffer(_.__webglFramebuffer[q]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[q])}else{if(Array.isArray(_.__webglFramebuffer))for(let q=0;q<_.__webglFramebuffer.length;q++)i.deleteFramebuffer(_.__webglFramebuffer[q]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let q=0;q<_.__webglColorRenderbuffer.length;q++)_.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[q]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const z=b.textures;for(let q=0,it=z.length;q<it;q++){const Y=n.get(z[q]);Y.__webglTexture&&(i.deleteTexture(Y.__webglTexture),a.memory.textures--),n.remove(z[q])}n.remove(b)}let P=0;function F(){P=0}function V(){const b=P;return b>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+s.maxTextures),P+=1,b}function K(b){const _=[];return _.push(b.wrapS),_.push(b.wrapT),_.push(b.wrapR||0),_.push(b.magFilter),_.push(b.minFilter),_.push(b.anisotropy),_.push(b.internalFormat),_.push(b.format),_.push(b.type),_.push(b.generateMipmaps),_.push(b.premultiplyAlpha),_.push(b.flipY),_.push(b.unpackAlignment),_.push(b.colorSpace),_.join()}function X(b,_){const z=n.get(b);if(b.isVideoTexture&&lt(b),b.isRenderTargetTexture===!1&&b.isExternalTexture!==!0&&b.version>0&&z.__version!==b.version){const q=b.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(z,b,_);return}}else b.isExternalTexture&&(z.__webglTexture=b.sourceTexture?b.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+_)}function k(b,_){const z=n.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&z.__version!==b.version){J(z,b,_);return}e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+_)}function Q(b,_){const z=n.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&z.__version!==b.version){J(z,b,_);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+_)}function Z(b,_){const z=n.get(b);if(b.version>0&&z.__version!==b.version){rt(z,b,_);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+_)}const _t={[ws]:i.REPEAT,[vi]:i.CLAMP_TO_EDGE,[Xa]:i.MIRRORED_REPEAT},Et={[pn]:i.NEAREST,[Fh]:i.NEAREST_MIPMAP_NEAREST,[Gs]:i.NEAREST_MIPMAP_LINEAR,[_n]:i.LINEAR,[Wr]:i.LINEAR_MIPMAP_NEAREST,[Mi]:i.LINEAR_MIPMAP_LINEAR},Pt={[kh]:i.NEVER,[qh]:i.ALWAYS,[Hh]:i.LESS,[Dc]:i.LEQUAL,[Vh]:i.EQUAL,[Xh]:i.GEQUAL,[Gh]:i.GREATER,[Wh]:i.NOTEQUAL};function Jt(b,_){if(_.type===Fn&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===_n||_.magFilter===Wr||_.magFilter===Gs||_.magFilter===Mi||_.minFilter===_n||_.minFilter===Wr||_.minFilter===Gs||_.minFilter===Mi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(b,i.TEXTURE_WRAP_S,_t[_.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,_t[_.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,_t[_.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,Et[_.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,Et[_.minFilter]),_.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,Pt[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===pn||_.minFilter!==Gs&&_.minFilter!==Mi||_.type===Fn&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");i.texParameterf(b,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function ie(b,_){let z=!1;b.__webglInit===void 0&&(b.__webglInit=!0,_.addEventListener("dispose",R));const q=_.source;let it=f.get(q);it===void 0&&(it={},f.set(q,it));const Y=K(_);if(Y!==b.__cacheKey){it[Y]===void 0&&(it[Y]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,z=!0),it[Y].usedTimes++;const Nt=it[b.__cacheKey];Nt!==void 0&&(it[b.__cacheKey].usedTimes--,Nt.usedTimes===0&&y(_)),b.__cacheKey=Y,b.__webglTexture=it[Y].texture}return z}function he(b,_,z){return Math.floor(Math.floor(b/z)/_)}function le(b,_,z,q){const Y=b.updateRanges;if(Y.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,z,q,_.data);else{Y.sort((ct,yt)=>ct.start-yt.start);let Nt=0;for(let ct=1;ct<Y.length;ct++){const yt=Y[Nt],kt=Y[ct],Ft=yt.start+yt.count,vt=he(kt.start,_.width,4),Vt=he(yt.start,_.width,4);kt.start<=Ft+1&&vt===Vt&&he(kt.start+kt.count-1,_.width,4)===vt?yt.count=Math.max(yt.count,kt.start+kt.count-yt.start):(++Nt,Y[Nt]=kt)}Y.length=Nt+1;const ft=i.getParameter(i.UNPACK_ROW_LENGTH),It=i.getParameter(i.UNPACK_SKIP_PIXELS),At=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let ct=0,yt=Y.length;ct<yt;ct++){const kt=Y[ct],Ft=Math.floor(kt.start/4),vt=Math.ceil(kt.count/4),Vt=Ft%_.width,N=Math.floor(Ft/_.width),dt=vt,pt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Vt),i.pixelStorei(i.UNPACK_SKIP_ROWS,N),e.texSubImage2D(i.TEXTURE_2D,0,Vt,N,dt,pt,z,q,_.data)}b.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ft),i.pixelStorei(i.UNPACK_SKIP_PIXELS,It),i.pixelStorei(i.UNPACK_SKIP_ROWS,At)}}function J(b,_,z){let q=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(q=i.TEXTURE_3D);const it=ie(b,_),Y=_.source;e.bindTexture(q,b.__webglTexture,i.TEXTURE0+z);const Nt=n.get(Y);if(Y.version!==Nt.__version||it===!0){e.activeTexture(i.TEXTURE0+z);const ft=ue.getPrimaries(ue.workingColorSpace),It=_.colorSpace===ti?null:ue.getPrimaries(_.colorSpace),At=_.colorSpace===ti||ft===It?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,At);let ct=x(_.image,!1,s.maxTextureSize);ct=Kt(_,ct);const yt=r.convert(_.format,_.colorSpace),kt=r.convert(_.type);let Ft=E(_.internalFormat,yt,kt,_.colorSpace,_.isVideoTexture);Jt(q,_);let vt;const Vt=_.mipmaps,N=_.isVideoTexture!==!0,dt=Nt.__version===void 0||it===!0,pt=Y.dataReady,Ut=C(_,ct);if(_.isDepthTexture)Ft=v(_.format===Ps,_.type),dt&&(N?e.texStorage2D(i.TEXTURE_2D,1,Ft,ct.width,ct.height):e.texImage2D(i.TEXTURE_2D,0,Ft,ct.width,ct.height,0,yt,kt,null));else if(_.isDataTexture)if(Vt.length>0){N&&dt&&e.texStorage2D(i.TEXTURE_2D,Ut,Ft,Vt[0].width,Vt[0].height);for(let ht=0,tt=Vt.length;ht<tt;ht++)vt=Vt[ht],N?pt&&e.texSubImage2D(i.TEXTURE_2D,ht,0,0,vt.width,vt.height,yt,kt,vt.data):e.texImage2D(i.TEXTURE_2D,ht,Ft,vt.width,vt.height,0,yt,kt,vt.data);_.generateMipmaps=!1}else N?(dt&&e.texStorage2D(i.TEXTURE_2D,Ut,Ft,ct.width,ct.height),pt&&le(_,ct,yt,kt)):e.texImage2D(i.TEXTURE_2D,0,Ft,ct.width,ct.height,0,yt,kt,ct.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){N&&dt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ut,Ft,Vt[0].width,Vt[0].height,ct.depth);for(let ht=0,tt=Vt.length;ht<tt;ht++)if(vt=Vt[ht],_.format!==fn)if(yt!==null)if(N){if(pt)if(_.layerUpdates.size>0){const wt=Fl(vt.width,vt.height,_.format,_.type);for(const Wt of _.layerUpdates){const pe=vt.data.subarray(Wt*wt/vt.data.BYTES_PER_ELEMENT,(Wt+1)*wt/vt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ht,0,0,Wt,vt.width,vt.height,1,yt,pe)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ht,0,0,0,vt.width,vt.height,ct.depth,yt,vt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ht,Ft,vt.width,vt.height,ct.depth,0,vt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?pt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,ht,0,0,0,vt.width,vt.height,ct.depth,yt,kt,vt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ht,Ft,vt.width,vt.height,ct.depth,0,yt,kt,vt.data)}else{N&&dt&&e.texStorage2D(i.TEXTURE_2D,Ut,Ft,Vt[0].width,Vt[0].height);for(let ht=0,tt=Vt.length;ht<tt;ht++)vt=Vt[ht],_.format!==fn?yt!==null?N?pt&&e.compressedTexSubImage2D(i.TEXTURE_2D,ht,0,0,vt.width,vt.height,yt,vt.data):e.compressedTexImage2D(i.TEXTURE_2D,ht,Ft,vt.width,vt.height,0,vt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?pt&&e.texSubImage2D(i.TEXTURE_2D,ht,0,0,vt.width,vt.height,yt,kt,vt.data):e.texImage2D(i.TEXTURE_2D,ht,Ft,vt.width,vt.height,0,yt,kt,vt.data)}else if(_.isDataArrayTexture)if(N){if(dt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ut,Ft,ct.width,ct.height,ct.depth),pt)if(_.layerUpdates.size>0){const ht=Fl(ct.width,ct.height,_.format,_.type);for(const tt of _.layerUpdates){const wt=ct.data.subarray(tt*ht/ct.data.BYTES_PER_ELEMENT,(tt+1)*ht/ct.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,tt,ct.width,ct.height,1,yt,kt,wt)}_.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ct.width,ct.height,ct.depth,yt,kt,ct.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ft,ct.width,ct.height,ct.depth,0,yt,kt,ct.data);else if(_.isData3DTexture)N?(dt&&e.texStorage3D(i.TEXTURE_3D,Ut,Ft,ct.width,ct.height,ct.depth),pt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ct.width,ct.height,ct.depth,yt,kt,ct.data)):e.texImage3D(i.TEXTURE_3D,0,Ft,ct.width,ct.height,ct.depth,0,yt,kt,ct.data);else if(_.isFramebufferTexture){if(dt)if(N)e.texStorage2D(i.TEXTURE_2D,Ut,Ft,ct.width,ct.height);else{let ht=ct.width,tt=ct.height;for(let wt=0;wt<Ut;wt++)e.texImage2D(i.TEXTURE_2D,wt,Ft,ht,tt,0,yt,kt,null),ht>>=1,tt>>=1}}else if(Vt.length>0){if(N&&dt){const ht=Gt(Vt[0]);e.texStorage2D(i.TEXTURE_2D,Ut,Ft,ht.width,ht.height)}for(let ht=0,tt=Vt.length;ht<tt;ht++)vt=Vt[ht],N?pt&&e.texSubImage2D(i.TEXTURE_2D,ht,0,0,yt,kt,vt):e.texImage2D(i.TEXTURE_2D,ht,Ft,yt,kt,vt);_.generateMipmaps=!1}else if(N){if(dt){const ht=Gt(ct);e.texStorage2D(i.TEXTURE_2D,Ut,Ft,ht.width,ht.height)}pt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,yt,kt,ct)}else e.texImage2D(i.TEXTURE_2D,0,Ft,yt,kt,ct);m(_)&&u(q),Nt.__version=Y.version,_.onUpdate&&_.onUpdate(_)}b.__version=_.version}function rt(b,_,z){if(_.image.length!==6)return;const q=ie(b,_),it=_.source;e.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+z);const Y=n.get(it);if(it.version!==Y.__version||q===!0){e.activeTexture(i.TEXTURE0+z);const Nt=ue.getPrimaries(ue.workingColorSpace),ft=_.colorSpace===ti?null:ue.getPrimaries(_.colorSpace),It=_.colorSpace===ti||Nt===ft?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);const At=_.isCompressedTexture||_.image[0].isCompressedTexture,ct=_.image[0]&&_.image[0].isDataTexture,yt=[];for(let tt=0;tt<6;tt++)!At&&!ct?yt[tt]=x(_.image[tt],!0,s.maxCubemapSize):yt[tt]=ct?_.image[tt].image:_.image[tt],yt[tt]=Kt(_,yt[tt]);const kt=yt[0],Ft=r.convert(_.format,_.colorSpace),vt=r.convert(_.type),Vt=E(_.internalFormat,Ft,vt,_.colorSpace),N=_.isVideoTexture!==!0,dt=Y.__version===void 0||q===!0,pt=it.dataReady;let Ut=C(_,kt);Jt(i.TEXTURE_CUBE_MAP,_);let ht;if(At){N&&dt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Ut,Vt,kt.width,kt.height);for(let tt=0;tt<6;tt++){ht=yt[tt].mipmaps;for(let wt=0;wt<ht.length;wt++){const Wt=ht[wt];_.format!==fn?Ft!==null?N?pt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,wt,0,0,Wt.width,Wt.height,Ft,Wt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,wt,Vt,Wt.width,Wt.height,0,Wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,wt,0,0,Wt.width,Wt.height,Ft,vt,Wt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,wt,Vt,Wt.width,Wt.height,0,Ft,vt,Wt.data)}}}else{if(ht=_.mipmaps,N&&dt){ht.length>0&&Ut++;const tt=Gt(yt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Ut,Vt,tt.width,tt.height)}for(let tt=0;tt<6;tt++)if(ct){N?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,yt[tt].width,yt[tt].height,Ft,vt,yt[tt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,Vt,yt[tt].width,yt[tt].height,0,Ft,vt,yt[tt].data);for(let wt=0;wt<ht.length;wt++){const pe=ht[wt].image[tt].image;N?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,wt+1,0,0,pe.width,pe.height,Ft,vt,pe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,wt+1,Vt,pe.width,pe.height,0,Ft,vt,pe.data)}}else{N?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,Ft,vt,yt[tt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,Vt,Ft,vt,yt[tt]);for(let wt=0;wt<ht.length;wt++){const Wt=ht[wt];N?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,wt+1,0,0,Ft,vt,Wt.image[tt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,wt+1,Vt,Ft,vt,Wt.image[tt])}}}m(_)&&u(i.TEXTURE_CUBE_MAP),Y.__version=it.version,_.onUpdate&&_.onUpdate(_)}b.__version=_.version}function bt(b,_,z,q,it,Y){const Nt=r.convert(z.format,z.colorSpace),ft=r.convert(z.type),It=E(z.internalFormat,Nt,ft,z.colorSpace),At=n.get(_),ct=n.get(z);if(ct.__renderTarget=_,!At.__hasExternalTextures){const yt=Math.max(1,_.width>>Y),kt=Math.max(1,_.height>>Y);it===i.TEXTURE_3D||it===i.TEXTURE_2D_ARRAY?e.texImage3D(it,Y,It,yt,kt,_.depth,0,Nt,ft,null):e.texImage2D(it,Y,It,yt,kt,0,Nt,ft,null)}e.bindFramebuffer(i.FRAMEBUFFER,b),at(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,it,ct.__webglTexture,0,gt(_)):(it===i.TEXTURE_2D||it>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&it<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,it,ct.__webglTexture,Y),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Bt(b,_,z){if(i.bindRenderbuffer(i.RENDERBUFFER,b),_.depthBuffer){const q=_.depthTexture,it=q&&q.isDepthTexture?q.type:null,Y=v(_.stencilBuffer,it),Nt=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=gt(_);at(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ft,Y,_.width,_.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,ft,Y,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Y,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Nt,i.RENDERBUFFER,b)}else{const q=_.textures;for(let it=0;it<q.length;it++){const Y=q[it],Nt=r.convert(Y.format,Y.colorSpace),ft=r.convert(Y.type),It=E(Y.internalFormat,Nt,ft,Y.colorSpace),At=gt(_);z&&at(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,At,It,_.width,_.height):at(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,At,It,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,It,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Dt(b,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,b),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=n.get(_.depthTexture);q.__renderTarget=_,(!q.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),X(_.depthTexture,0);const it=q.__webglTexture,Y=gt(_);if(_.depthTexture.format===Cs)at(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0);else if(_.depthTexture.format===Ps)at(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0);else throw new Error("Unknown depthTexture format")}function te(b){const _=n.get(b),z=b.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==b.depthTexture){const q=b.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),q){const it=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,q.removeEventListener("dispose",it)};q.addEventListener("dispose",it),_.__depthDisposeCallback=it}_.__boundDepthTexture=q}if(b.depthTexture&&!_.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");const q=b.texture.mipmaps;q&&q.length>0?Dt(_.__webglFramebuffer[0],b):Dt(_.__webglFramebuffer,b)}else if(z){_.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[q]),_.__webglDepthbuffer[q]===void 0)_.__webglDepthbuffer[q]=i.createRenderbuffer(),Bt(_.__webglDepthbuffer[q],b,!1);else{const it=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=_.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,it,i.RENDERBUFFER,Y)}}else{const q=b.texture.mipmaps;if(q&&q.length>0?e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),Bt(_.__webglDepthbuffer,b,!1);else{const it=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,it,i.RENDERBUFFER,Y)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function jt(b,_,z){const q=n.get(b);_!==void 0&&bt(q.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&te(b)}function D(b){const _=b.texture,z=n.get(b),q=n.get(_);b.addEventListener("dispose",L);const it=b.textures,Y=b.isWebGLCubeRenderTarget===!0,Nt=it.length>1;if(Nt||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=_.version,a.memory.textures++),Y){z.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(_.mipmaps&&_.mipmaps.length>0){z.__webglFramebuffer[ft]=[];for(let It=0;It<_.mipmaps.length;It++)z.__webglFramebuffer[ft][It]=i.createFramebuffer()}else z.__webglFramebuffer[ft]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){z.__webglFramebuffer=[];for(let ft=0;ft<_.mipmaps.length;ft++)z.__webglFramebuffer[ft]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(Nt)for(let ft=0,It=it.length;ft<It;ft++){const At=n.get(it[ft]);At.__webglTexture===void 0&&(At.__webglTexture=i.createTexture(),a.memory.textures++)}if(b.samples>0&&at(b)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ft=0;ft<it.length;ft++){const It=it[ft];z.__webglColorRenderbuffer[ft]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[ft]);const At=r.convert(It.format,It.colorSpace),ct=r.convert(It.type),yt=E(It.internalFormat,At,ct,It.colorSpace,b.isXRRenderTarget===!0),kt=gt(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,kt,yt,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.RENDERBUFFER,z.__webglColorRenderbuffer[ft])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Bt(z.__webglDepthRenderbuffer,b,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Y){e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),Jt(i.TEXTURE_CUBE_MAP,_);for(let ft=0;ft<6;ft++)if(_.mipmaps&&_.mipmaps.length>0)for(let It=0;It<_.mipmaps.length;It++)bt(z.__webglFramebuffer[ft][It],b,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,It);else bt(z.__webglFramebuffer[ft],b,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);m(_)&&u(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Nt){for(let ft=0,It=it.length;ft<It;ft++){const At=it[ft],ct=n.get(At);let yt=i.TEXTURE_2D;(b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(yt=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(yt,ct.__webglTexture),Jt(yt,At),bt(z.__webglFramebuffer,b,At,i.COLOR_ATTACHMENT0+ft,yt,0),m(At)&&u(yt)}e.unbindTexture()}else{let ft=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(ft=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ft,q.__webglTexture),Jt(ft,_),_.mipmaps&&_.mipmaps.length>0)for(let It=0;It<_.mipmaps.length;It++)bt(z.__webglFramebuffer[It],b,_,i.COLOR_ATTACHMENT0,ft,It);else bt(z.__webglFramebuffer,b,_,i.COLOR_ATTACHMENT0,ft,0);m(_)&&u(ft),e.unbindTexture()}b.depthBuffer&&te(b)}function st(b){const _=b.textures;for(let z=0,q=_.length;z<q;z++){const it=_[z];if(m(it)){const Y=T(b),Nt=n.get(it).__webglTexture;e.bindTexture(Y,Nt),u(Y),e.unbindTexture()}}}const nt=[],j=[];function $(b){if(b.samples>0){if(at(b)===!1){const _=b.textures,z=b.width,q=b.height;let it=i.COLOR_BUFFER_BIT;const Y=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Nt=n.get(b),ft=_.length>1;if(ft)for(let At=0;At<_.length;At++)e.bindFramebuffer(i.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Nt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer);const It=b.texture.mipmaps;It&&It.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer);for(let At=0;At<_.length;At++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(it|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(it|=i.STENCIL_BUFFER_BIT)),ft){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Nt.__webglColorRenderbuffer[At]);const ct=n.get(_[At]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ct,0)}i.blitFramebuffer(0,0,z,q,0,0,z,q,it,i.NEAREST),l===!0&&(nt.length=0,j.length=0,nt.push(i.COLOR_ATTACHMENT0+At),b.depthBuffer&&b.resolveDepthBuffer===!1&&(nt.push(Y),j.push(Y),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,j)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,nt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ft)for(let At=0;At<_.length;At++){e.bindFramebuffer(i.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,Nt.__webglColorRenderbuffer[At]);const ct=n.get(_[At]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Nt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,ct,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){const _=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function gt(b){return Math.min(s.maxSamples,b.samples)}function at(b){const _=n.get(b);return b.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function lt(b){const _=a.render.frame;h.get(b)!==_&&(h.set(b,_),b.update())}function Kt(b,_){const z=b.colorSpace,q=b.format,it=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||z!==ns&&z!==ti&&(ue.getTransfer(z)===me?(q!==fn||it!==yn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),_}function Gt(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(c.width=b.displayWidth,c.height=b.displayHeight):(c.width=b.width,c.height=b.height),c}this.allocateTextureUnit=V,this.resetTextureUnits=F,this.setTexture2D=X,this.setTexture2DArray=k,this.setTexture3D=Q,this.setTextureCube=Z,this.rebindTextures=jt,this.setupRenderTarget=D,this.updateRenderTargetMipmap=st,this.updateMultisampleRenderTarget=$,this.setupDepthRenderbuffer=te,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=at}function k0(i,t){function e(n,s=ti){let r;const a=ue.getTransfer(s);if(n===yn)return i.UNSIGNED_BYTE;if(n===Io)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Uo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===bc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===wc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Ec)return i.BYTE;if(n===Tc)return i.SHORT;if(n===As)return i.UNSIGNED_SHORT;if(n===Do)return i.INT;if(n===Si)return i.UNSIGNED_INT;if(n===Fn)return i.FLOAT;if(n===Mn)return i.HALF_FLOAT;if(n===Ac)return i.ALPHA;if(n===Rc)return i.RGB;if(n===fn)return i.RGBA;if(n===Cs)return i.DEPTH_COMPONENT;if(n===Ps)return i.DEPTH_STENCIL;if(n===Cc)return i.RED;if(n===No)return i.RED_INTEGER;if(n===Pc)return i.RG;if(n===Fo)return i.RG_INTEGER;if(n===Oo)return i.RGBA_INTEGER;if(n===yr||n===Sr||n===Er||n===Tr)if(a===me)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===yr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===yr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Sr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Er)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Tr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===qa||n===Ya||n===Za||n===Ka)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===qa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ya)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Za)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ka)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===$a||n===Ja||n===ja)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===$a||n===Ja)return a===me?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ja)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Qa||n===to||n===eo||n===no||n===io||n===so||n===ro||n===ao||n===oo||n===lo||n===co||n===ho||n===uo||n===fo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Qa)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===to)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===eo)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===no)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===io)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===so)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ro)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ao)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===oo)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===lo)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===co)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ho)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===uo)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===fo)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===po||n===mo||n===go)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===po)return a===me?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===mo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===go)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===_o||n===xo||n===vo||n===Mo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===_o)return r.COMPRESSED_RED_RGTC1_EXT;if(n===xo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===vo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Mo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Rs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const H0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,V0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class G0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Wc(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new He({vertexShader:H0,fragmentShader:V0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Lt(new Fe(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class W0 extends as{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,f=null,p=null,g=null;const x=typeof XRWebGLBinding<"u",m=new G0,u={},T=e.getContextAttributes();let E=null,v=null;const C=[],R=[],L=new ot;let I=null;const y=new Je;y.viewport=new xe;const M=new Je;M.viewport=new xe;const P=[y,M],F=new cd;let V=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let rt=C[J];return rt===void 0&&(rt=new fa,C[J]=rt),rt.getTargetRaySpace()},this.getControllerGrip=function(J){let rt=C[J];return rt===void 0&&(rt=new fa,C[J]=rt),rt.getGripSpace()},this.getHand=function(J){let rt=C[J];return rt===void 0&&(rt=new fa,C[J]=rt),rt.getHandSpace()};function X(J){const rt=R.indexOf(J.inputSource);if(rt===-1)return;const bt=C[rt];bt!==void 0&&(bt.update(J.inputSource,J.frame,c||a),bt.dispatchEvent({type:J.type,data:J.inputSource}))}function k(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",Q);for(let J=0;J<C.length;J++){const rt=R[J];rt!==null&&(R[J]=null,C[J].disconnect(rt))}V=null,K=null,m.reset();for(const J in u)delete u[J];t.setRenderTarget(E),p=null,f=null,d=null,s=null,v=null,le.stop(),n.isPresenting=!1,t.setPixelRatio(I),t.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(E=t.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",k),s.addEventListener("inputsourceschange",Q),T.xrCompatible!==!0&&await e.makeXRCompatible(),I=t.getPixelRatio(),t.getSize(L),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let bt=null,Bt=null,Dt=null;T.depth&&(Dt=T.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,bt=T.stencil?Ps:Cs,Bt=T.stencil?Rs:Si);const te={colorFormat:e.RGBA8,depthFormat:Dt,scaleFactor:r};d=this.getBinding(),f=d.createProjectionLayer(te),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),v=new an(f.textureWidth,f.textureHeight,{format:fn,type:yn,depthTexture:new Gc(f.textureWidth,f.textureHeight,Bt,void 0,void 0,void 0,void 0,void 0,void 0,bt),stencilBuffer:T.stencil,colorSpace:t.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const bt={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,bt),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new an(p.framebufferWidth,p.framebufferHeight,{format:fn,type:yn,colorSpace:t.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),le.setContext(s),le.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Q(J){for(let rt=0;rt<J.removed.length;rt++){const bt=J.removed[rt],Bt=R.indexOf(bt);Bt>=0&&(R[Bt]=null,C[Bt].disconnect(bt))}for(let rt=0;rt<J.added.length;rt++){const bt=J.added[rt];let Bt=R.indexOf(bt);if(Bt===-1){for(let te=0;te<C.length;te++)if(te>=R.length){R.push(bt),Bt=te;break}else if(R[te]===null){R[te]=bt,Bt=te;break}if(Bt===-1)break}const Dt=C[Bt];Dt&&Dt.connect(bt)}}const Z=new w,_t=new w;function Et(J,rt,bt){Z.setFromMatrixPosition(rt.matrixWorld),_t.setFromMatrixPosition(bt.matrixWorld);const Bt=Z.distanceTo(_t),Dt=rt.projectionMatrix.elements,te=bt.projectionMatrix.elements,jt=Dt[14]/(Dt[10]-1),D=Dt[14]/(Dt[10]+1),st=(Dt[9]+1)/Dt[5],nt=(Dt[9]-1)/Dt[5],j=(Dt[8]-1)/Dt[0],$=(te[8]+1)/te[0],gt=jt*j,at=jt*$,lt=Bt/(-j+$),Kt=lt*-j;if(rt.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Kt),J.translateZ(lt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Dt[10]===-1)J.projectionMatrix.copy(rt.projectionMatrix),J.projectionMatrixInverse.copy(rt.projectionMatrixInverse);else{const Gt=jt+lt,b=D+lt,_=gt-Kt,z=at+(Bt-Kt),q=st*D/b*Gt,it=nt*D/b*Gt;J.projectionMatrix.makePerspective(_,z,q,it,Gt,b),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function Pt(J,rt){rt===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(rt.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let rt=J.near,bt=J.far;m.texture!==null&&(m.depthNear>0&&(rt=m.depthNear),m.depthFar>0&&(bt=m.depthFar)),F.near=M.near=y.near=rt,F.far=M.far=y.far=bt,(V!==F.near||K!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),V=F.near,K=F.far),F.layers.mask=J.layers.mask|6,y.layers.mask=F.layers.mask&3,M.layers.mask=F.layers.mask&5;const Bt=J.parent,Dt=F.cameras;Pt(F,Bt);for(let te=0;te<Dt.length;te++)Pt(Dt[te],Bt);Dt.length===2?Et(F,y,M):F.projectionMatrix.copy(y.projectionMatrix),Jt(J,F,Bt)};function Jt(J,rt,bt){bt===null?J.matrix.copy(rt.matrixWorld):(J.matrix.copy(bt.matrixWorld),J.matrix.invert(),J.matrix.multiply(rt.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(rt.projectionMatrix),J.projectionMatrixInverse.copy(rt.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=So*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(J){l=J,f!==null&&(f.fixedFoveation=J),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(J){return u[J]};let ie=null;function he(J,rt){if(h=rt.getViewerPose(c||a),g=rt,h!==null){const bt=h.views;p!==null&&(t.setRenderTargetFramebuffer(v,p.framebuffer),t.setRenderTarget(v));let Bt=!1;bt.length!==F.cameras.length&&(F.cameras.length=0,Bt=!0);for(let D=0;D<bt.length;D++){const st=bt[D];let nt=null;if(p!==null)nt=p.getViewport(st);else{const $=d.getViewSubImage(f,st);nt=$.viewport,D===0&&(t.setRenderTargetTextures(v,$.colorTexture,$.depthStencilTexture),t.setRenderTarget(v))}let j=P[D];j===void 0&&(j=new Je,j.layers.enable(D),j.viewport=new xe,P[D]=j),j.matrix.fromArray(st.transform.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale),j.projectionMatrix.fromArray(st.projectionMatrix),j.projectionMatrixInverse.copy(j.projectionMatrix).invert(),j.viewport.set(nt.x,nt.y,nt.width,nt.height),D===0&&(F.matrix.copy(j.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Bt===!0&&F.cameras.push(j)}const Dt=s.enabledFeatures;if(Dt&&Dt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){d=n.getBinding();const D=d.getDepthInformation(bt[0]);D&&D.isValid&&D.texture&&m.init(D,s.renderState)}if(Dt&&Dt.includes("camera-access")&&x){t.state.unbindTexture(),d=n.getBinding();for(let D=0;D<bt.length;D++){const st=bt[D].camera;if(st){let nt=u[st];nt||(nt=new Wc,u[st]=nt);const j=d.getCameraImage(st);nt.sourceTexture=j}}}}for(let bt=0;bt<C.length;bt++){const Bt=R[bt],Dt=C[bt];Bt!==null&&Dt!==void 0&&Dt.update(Bt,rt,c||a)}ie&&ie(J,rt),rt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:rt}),g=null}const le=new nh;le.setAnimationLoop(he),this.setAnimationLoop=function(J){ie=J},this.dispose=function(){}}}const ui=new Sn,X0=new Me;function q0(i,t){function e(m,u){m.matrixAutoUpdate===!0&&m.updateMatrix(),u.value.copy(m.matrix)}function n(m,u){u.color.getRGB(m.fogColor.value,zc(i)),u.isFog?(m.fogNear.value=u.near,m.fogFar.value=u.far):u.isFogExp2&&(m.fogDensity.value=u.density)}function s(m,u,T,E,v){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(m,u):u.isMeshToonMaterial?(r(m,u),d(m,u)):u.isMeshPhongMaterial?(r(m,u),h(m,u)):u.isMeshStandardMaterial?(r(m,u),f(m,u),u.isMeshPhysicalMaterial&&p(m,u,v)):u.isMeshMatcapMaterial?(r(m,u),g(m,u)):u.isMeshDepthMaterial?r(m,u):u.isMeshDistanceMaterial?(r(m,u),x(m,u)):u.isMeshNormalMaterial?r(m,u):u.isLineBasicMaterial?(a(m,u),u.isLineDashedMaterial&&o(m,u)):u.isPointsMaterial?l(m,u,T,E):u.isSpriteMaterial?c(m,u):u.isShadowMaterial?(m.color.value.copy(u.color),m.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(m,u){m.opacity.value=u.opacity,u.color&&m.diffuse.value.copy(u.color),u.emissive&&m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(m.map.value=u.map,e(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,e(u.alphaMap,m.alphaMapTransform)),u.bumpMap&&(m.bumpMap.value=u.bumpMap,e(u.bumpMap,m.bumpMapTransform),m.bumpScale.value=u.bumpScale,u.side===We&&(m.bumpScale.value*=-1)),u.normalMap&&(m.normalMap.value=u.normalMap,e(u.normalMap,m.normalMapTransform),m.normalScale.value.copy(u.normalScale),u.side===We&&m.normalScale.value.negate()),u.displacementMap&&(m.displacementMap.value=u.displacementMap,e(u.displacementMap,m.displacementMapTransform),m.displacementScale.value=u.displacementScale,m.displacementBias.value=u.displacementBias),u.emissiveMap&&(m.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,m.emissiveMapTransform)),u.specularMap&&(m.specularMap.value=u.specularMap,e(u.specularMap,m.specularMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest);const T=t.get(u),E=T.envMap,v=T.envMapRotation;E&&(m.envMap.value=E,ui.copy(v),ui.x*=-1,ui.y*=-1,ui.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(ui.y*=-1,ui.z*=-1),m.envMapRotation.value.setFromMatrix4(X0.makeRotationFromEuler(ui)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=u.reflectivity,m.ior.value=u.ior,m.refractionRatio.value=u.refractionRatio),u.lightMap&&(m.lightMap.value=u.lightMap,m.lightMapIntensity.value=u.lightMapIntensity,e(u.lightMap,m.lightMapTransform)),u.aoMap&&(m.aoMap.value=u.aoMap,m.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,m.aoMapTransform))}function a(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,u.map&&(m.map.value=u.map,e(u.map,m.mapTransform))}function o(m,u){m.dashSize.value=u.dashSize,m.totalSize.value=u.dashSize+u.gapSize,m.scale.value=u.scale}function l(m,u,T,E){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.size.value=u.size*T,m.scale.value=E*.5,u.map&&(m.map.value=u.map,e(u.map,m.uvTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,e(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function c(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.rotation.value=u.rotation,u.map&&(m.map.value=u.map,e(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,e(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function h(m,u){m.specular.value.copy(u.specular),m.shininess.value=Math.max(u.shininess,1e-4)}function d(m,u){u.gradientMap&&(m.gradientMap.value=u.gradientMap)}function f(m,u){m.metalness.value=u.metalness,u.metalnessMap&&(m.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,m.metalnessMapTransform)),m.roughness.value=u.roughness,u.roughnessMap&&(m.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,m.roughnessMapTransform)),u.envMap&&(m.envMapIntensity.value=u.envMapIntensity)}function p(m,u,T){m.ior.value=u.ior,u.sheen>0&&(m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),m.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(m.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,m.sheenColorMapTransform)),u.sheenRoughnessMap&&(m.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,m.sheenRoughnessMapTransform))),u.clearcoat>0&&(m.clearcoat.value=u.clearcoat,m.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(m.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,m.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(m.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===We&&m.clearcoatNormalScale.value.negate())),u.dispersion>0&&(m.dispersion.value=u.dispersion),u.iridescence>0&&(m.iridescence.value=u.iridescence,m.iridescenceIOR.value=u.iridescenceIOR,m.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(m.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,m.iridescenceMapTransform)),u.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),u.transmission>0&&(m.transmission.value=u.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),u.transmissionMap&&(m.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,m.transmissionMapTransform)),m.thickness.value=u.thickness,u.thicknessMap&&(m.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=u.attenuationDistance,m.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(m.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(m.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=u.specularIntensity,m.specularColor.value.copy(u.specularColor),u.specularColorMap&&(m.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,m.specularColorMapTransform)),u.specularIntensityMap&&(m.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,u){u.matcap&&(m.matcap.value=u.matcap)}function x(m,u){const T=t.get(u).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Y0(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,E){const v=E.program;n.uniformBlockBinding(T,v)}function c(T,E){let v=s[T.id];v===void 0&&(g(T),v=h(T),s[T.id]=v,T.addEventListener("dispose",m));const C=E.program;n.updateUBOMapping(T,C);const R=t.render.frame;r[T.id]!==R&&(f(T),r[T.id]=R)}function h(T){const E=d();T.__bindingPointIndex=E;const v=i.createBuffer(),C=T.__size,R=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,C,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,v),v}function d(){for(let T=0;T<o;T++)if(a.indexOf(T)===-1)return a.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(T){const E=s[T.id],v=T.uniforms,C=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let R=0,L=v.length;R<L;R++){const I=Array.isArray(v[R])?v[R]:[v[R]];for(let y=0,M=I.length;y<M;y++){const P=I[y];if(p(P,R,y,C)===!0){const F=P.__offset,V=Array.isArray(P.value)?P.value:[P.value];let K=0;for(let X=0;X<V.length;X++){const k=V[X],Q=x(k);typeof k=="number"||typeof k=="boolean"?(P.__data[0]=k,i.bufferSubData(i.UNIFORM_BUFFER,F+K,P.__data)):k.isMatrix3?(P.__data[0]=k.elements[0],P.__data[1]=k.elements[1],P.__data[2]=k.elements[2],P.__data[3]=0,P.__data[4]=k.elements[3],P.__data[5]=k.elements[4],P.__data[6]=k.elements[5],P.__data[7]=0,P.__data[8]=k.elements[6],P.__data[9]=k.elements[7],P.__data[10]=k.elements[8],P.__data[11]=0):(k.toArray(P.__data,K),K+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(T,E,v,C){const R=T.value,L=E+"_"+v;if(C[L]===void 0)return typeof R=="number"||typeof R=="boolean"?C[L]=R:C[L]=R.clone(),!0;{const I=C[L];if(typeof R=="number"||typeof R=="boolean"){if(I!==R)return C[L]=R,!0}else if(I.equals(R)===!1)return I.copy(R),!0}return!1}function g(T){const E=T.uniforms;let v=0;const C=16;for(let L=0,I=E.length;L<I;L++){const y=Array.isArray(E[L])?E[L]:[E[L]];for(let M=0,P=y.length;M<P;M++){const F=y[M],V=Array.isArray(F.value)?F.value:[F.value];for(let K=0,X=V.length;K<X;K++){const k=V[K],Q=x(k),Z=v%C,_t=Z%Q.boundary,Et=Z+_t;v+=_t,Et!==0&&C-Et<Q.storage&&(v+=C-Et),F.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=v,v+=Q.storage}}}const R=v%C;return R>0&&(v+=C-R),T.__size=v,T.__cache={},this}function x(T){const E={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(E.boundary=4,E.storage=4):T.isVector2?(E.boundary=8,E.storage=8):T.isVector3||T.isColor?(E.boundary=16,E.storage=12):T.isVector4?(E.boundary=16,E.storage=16):T.isMatrix3?(E.boundary=48,E.storage=48):T.isMatrix4?(E.boundary=64,E.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),E}function m(T){const E=T.target;E.removeEventListener("dispose",m);const v=a.indexOf(E.__bindingPointIndex);a.splice(v,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function u(){for(const T in s)i.deleteBuffer(s[T]);a=[],s={},r={}}return{bind:l,update:c,dispose:u}}class Z0{constructor(t={}){const{canvas:e=Zh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),x=new Int32Array(4);let m=null,u=null;const T=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ei,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const v=this;let C=!1;this._outputColorSpace=qe;let R=0,L=0,I=null,y=-1,M=null;const P=new xe,F=new xe;let V=null;const K=new Zt(0);let X=0,k=e.width,Q=e.height,Z=1,_t=null,Et=null;const Pt=new xe(0,0,k,Q),Jt=new xe(0,0,k,Q);let ie=!1;const he=new Ho;let le=!1,J=!1;const rt=new Me,bt=new w,Bt=new xe,Dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let te=!1;function jt(){return I===null?Z:1}let D=n;function st(S,O){return e.getContext(S,O)}try{const S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Po}`),e.addEventListener("webglcontextlost",pt,!1),e.addEventListener("webglcontextrestored",Ut,!1),e.addEventListener("webglcontextcreationerror",ht,!1),D===null){const O="webgl2";if(D=st(O,S),D===null)throw st(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let nt,j,$,gt,at,lt,Kt,Gt,b,_,z,q,it,Y,Nt,ft,It,At,ct,yt,kt,Ft,vt,Vt;function N(){nt=new sm(D),nt.init(),Ft=new k0(D,nt),j=new Jp(D,nt,t,Ft),$=new B0(D,nt),j.reversedDepthBuffer&&f&&$.buffers.depth.setReversed(!0),gt=new om(D),at=new b0,lt=new z0(D,nt,$,at,j,Ft,gt),Kt=new Qp(v),Gt=new im(v),b=new dd(D),vt=new Kp(D,b),_=new rm(D,b,gt,vt),z=new cm(D,_,b,gt),ct=new lm(D,j,lt),ft=new jp(at),q=new T0(v,Kt,Gt,nt,j,vt,ft),it=new q0(v,at),Y=new A0,Nt=new I0(nt),At=new Zp(v,Kt,Gt,$,z,p,l),It=new F0(v,z,j),Vt=new Y0(D,gt,j,$),yt=new $p(D,nt,gt),kt=new am(D,nt,gt),gt.programs=q.programs,v.capabilities=j,v.extensions=nt,v.properties=at,v.renderLists=Y,v.shadowMap=It,v.state=$,v.info=gt}N();const dt=new W0(v,D);this.xr=dt,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const S=nt.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=nt.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(S){S!==void 0&&(Z=S,this.setSize(k,Q,!1))},this.getSize=function(S){return S.set(k,Q)},this.setSize=function(S,O,G=!0){if(dt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=S,Q=O,e.width=Math.floor(S*Z),e.height=Math.floor(O*Z),G===!0&&(e.style.width=S+"px",e.style.height=O+"px"),this.setViewport(0,0,S,O)},this.getDrawingBufferSize=function(S){return S.set(k*Z,Q*Z).floor()},this.setDrawingBufferSize=function(S,O,G){k=S,Q=O,Z=G,e.width=Math.floor(S*G),e.height=Math.floor(O*G),this.setViewport(0,0,S,O)},this.getCurrentViewport=function(S){return S.copy(P)},this.getViewport=function(S){return S.copy(Pt)},this.setViewport=function(S,O,G,W){S.isVector4?Pt.set(S.x,S.y,S.z,S.w):Pt.set(S,O,G,W),$.viewport(P.copy(Pt).multiplyScalar(Z).round())},this.getScissor=function(S){return S.copy(Jt)},this.setScissor=function(S,O,G,W){S.isVector4?Jt.set(S.x,S.y,S.z,S.w):Jt.set(S,O,G,W),$.scissor(F.copy(Jt).multiplyScalar(Z).round())},this.getScissorTest=function(){return ie},this.setScissorTest=function(S){$.setScissorTest(ie=S)},this.setOpaqueSort=function(S){_t=S},this.setTransparentSort=function(S){Et=S},this.getClearColor=function(S){return S.copy(At.getClearColor())},this.setClearColor=function(){At.setClearColor(...arguments)},this.getClearAlpha=function(){return At.getClearAlpha()},this.setClearAlpha=function(){At.setClearAlpha(...arguments)},this.clear=function(S=!0,O=!0,G=!0){let W=0;if(S){let B=!1;if(I!==null){const ut=I.texture.format;B=ut===Oo||ut===Fo||ut===No}if(B){const ut=I.texture.type,Tt=ut===yn||ut===Si||ut===As||ut===Rs||ut===Io||ut===Uo,Mt=At.getClearColor(),Rt=At.getClearAlpha(),Ht=Mt.r,A=Mt.g,U=Mt.b;Tt?(g[0]=Ht,g[1]=A,g[2]=U,g[3]=Rt,D.clearBufferuiv(D.COLOR,0,g)):(x[0]=Ht,x[1]=A,x[2]=U,x[3]=Rt,D.clearBufferiv(D.COLOR,0,x))}else W|=D.COLOR_BUFFER_BIT}O&&(W|=D.DEPTH_BUFFER_BIT),G&&(W|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",pt,!1),e.removeEventListener("webglcontextrestored",Ut,!1),e.removeEventListener("webglcontextcreationerror",ht,!1),At.dispose(),Y.dispose(),Nt.dispose(),at.dispose(),Kt.dispose(),Gt.dispose(),z.dispose(),vt.dispose(),Vt.dispose(),q.dispose(),dt.dispose(),dt.removeEventListener("sessionstart",Ye),dt.removeEventListener("sessionend",ii),Tn.stop()};function pt(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function Ut(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;const S=gt.autoReset,O=It.enabled,G=It.autoUpdate,W=It.needsUpdate,B=It.type;N(),gt.autoReset=S,It.enabled=O,It.autoUpdate=G,It.needsUpdate=W,It.type=B}function ht(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function tt(S){const O=S.target;O.removeEventListener("dispose",tt),wt(O)}function wt(S){Wt(S),at.remove(S)}function Wt(S){const O=at.get(S).programs;O!==void 0&&(O.forEach(function(G){q.releaseProgram(G)}),S.isShaderMaterial&&q.releaseShaderCache(S))}this.renderBufferDirect=function(S,O,G,W,B,ut){O===null&&(O=Dt);const Tt=B.isMesh&&B.matrixWorld.determinant()<0,Mt=kr(S,O,G,W,B);$.setMaterial(W,Tt);let Rt=G.index,Ht=1;if(W.wireframe===!0){if(Rt=_.getWireframeAttribute(G),Rt===void 0)return;Ht=2}const A=G.drawRange,U=G.attributes.position;let H=A.start*Ht,et=(A.start+A.count)*Ht;ut!==null&&(H=Math.max(H,ut.start*Ht),et=Math.min(et,(ut.start+ut.count)*Ht)),Rt!==null?(H=Math.max(H,0),et=Math.min(et,Rt.count)):U!=null&&(H=Math.max(H,0),et=Math.min(et,U.count));const Ot=et-H;if(Ot<0||Ot===1/0)return;vt.setup(B,W,Mt,G,Rt);let xt,ae=yt;if(Rt!==null&&(xt=b.get(Rt),ae=kt,ae.setIndex(xt)),B.isMesh)W.wireframe===!0?($.setLineWidth(W.wireframeLinewidth*jt()),ae.setMode(D.LINES)):ae.setMode(D.TRIANGLES);else if(B.isLine){let Ct=W.linewidth;Ct===void 0&&(Ct=1),$.setLineWidth(Ct*jt()),B.isLineSegments?ae.setMode(D.LINES):B.isLineLoop?ae.setMode(D.LINE_LOOP):ae.setMode(D.LINE_STRIP)}else B.isPoints?ae.setMode(D.POINTS):B.isSprite&&ae.setMode(D.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)Ls("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ae.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(nt.get("WEBGL_multi_draw"))ae.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Ct=B._multiDrawStarts,ee=B._multiDrawCounts,Xt=B._multiDrawCount,Re=Rt?b.get(Rt).bytesPerElement:1,Gn=at.get(W).currentProgram.getUniforms();for(let Ie=0;Ie<Xt;Ie++)Gn.setValue(D,"_gl_DrawID",Ie),ae.render(Ct[Ie]/Re,ee[Ie])}else if(B.isInstancedMesh)ae.renderInstances(H,Ot,B.count);else if(G.isInstancedBufferGeometry){const Ct=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,ee=Math.min(G.instanceCount,Ct);ae.renderInstances(H,Ot,ee)}else ae.render(H,Ot)};function pe(S,O,G){S.transparent===!0&&S.side===je&&S.forceSinglePass===!1?(S.side=We,S.needsUpdate=!0,bn(S,O,G),S.side=Hn,S.needsUpdate=!0,bn(S,O,G),S.side=je):bn(S,O,G)}this.compile=function(S,O,G=null){G===null&&(G=S),u=Nt.get(G),u.init(O),E.push(u),G.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(u.pushLight(B),B.castShadow&&u.pushShadow(B))}),S!==G&&S.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(u.pushLight(B),B.castShadow&&u.pushShadow(B))}),u.setupLights();const W=new Set;return S.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const ut=B.material;if(ut)if(Array.isArray(ut))for(let Tt=0;Tt<ut.length;Tt++){const Mt=ut[Tt];pe(Mt,G,B),W.add(Mt)}else pe(ut,G,B),W.add(ut)}),u=E.pop(),W},this.compileAsync=function(S,O,G=null){const W=this.compile(S,O,G);return new Promise(B=>{function ut(){if(W.forEach(function(Tt){at.get(Tt).currentProgram.isReady()&&W.delete(Tt)}),W.size===0){B(S);return}setTimeout(ut,10)}nt.get("KHR_parallel_shader_compile")!==null?ut():setTimeout(ut,10)})};let re=null;function ln(S){re&&re(S)}function Ye(){Tn.stop()}function ii(){Tn.start()}const Tn=new nh;Tn.setAnimationLoop(ln),typeof self<"u"&&Tn.setContext(self),this.setAnimationLoop=function(S){re=S,dt.setAnimationLoop(S),S===null?Tn.stop():Tn.start()},dt.addEventListener("sessionstart",Ye),dt.addEventListener("sessionend",ii),this.render=function(S,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),dt.enabled===!0&&dt.isPresenting===!0&&(dt.cameraAutoUpdate===!0&&dt.updateCamera(O),O=dt.getCamera()),S.isScene===!0&&S.onBeforeRender(v,S,O,I),u=Nt.get(S,E.length),u.init(O),E.push(u),rt.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),he.setFromProjectionMatrix(rt,xn,O.reversedDepth),J=this.localClippingEnabled,le=ft.init(this.clippingPlanes,J),m=Y.get(S,T.length),m.init(),T.push(m),dt.enabled===!0&&dt.isPresenting===!0){const ut=v.xr.getDepthSensingMesh();ut!==null&&si(ut,O,-1/0,v.sortObjects)}si(S,O,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(_t,Et),te=dt.enabled===!1||dt.isPresenting===!1||dt.hasDepthSensing()===!1,te&&At.addToRenderList(m,S),this.info.render.frame++,le===!0&&ft.beginShadows();const G=u.state.shadowsArray;It.render(G,S,O),le===!0&&ft.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=m.opaque,B=m.transmissive;if(u.setupLights(),O.isArrayCamera){const ut=O.cameras;if(B.length>0)for(let Tt=0,Mt=ut.length;Tt<Mt;Tt++){const Rt=ut[Tt];cs(W,B,S,Rt)}te&&At.render(S);for(let Tt=0,Mt=ut.length;Tt<Mt;Tt++){const Rt=ut[Tt];Ti(m,S,Rt,Rt.viewport)}}else B.length>0&&cs(W,B,S,O),te&&At.render(S),Ti(m,S,O);I!==null&&L===0&&(lt.updateMultisampleRenderTarget(I),lt.updateRenderTargetMipmap(I)),S.isScene===!0&&S.onAfterRender(v,S,O),vt.resetDefaultState(),y=-1,M=null,E.pop(),E.length>0?(u=E[E.length-1],le===!0&&ft.setGlobalState(v.clippingPlanes,u.state.camera)):u=null,T.pop(),T.length>0?m=T[T.length-1]:m=null};function si(S,O,G,W){if(S.visible===!1)return;if(S.layers.test(O.layers)){if(S.isGroup)G=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(O);else if(S.isLight)u.pushLight(S),S.castShadow&&u.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||he.intersectsSprite(S)){W&&Bt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(rt);const Tt=z.update(S),Mt=S.material;Mt.visible&&m.push(S,Tt,Mt,G,Bt.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||he.intersectsObject(S))){const Tt=z.update(S),Mt=S.material;if(W&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Bt.copy(S.boundingSphere.center)):(Tt.boundingSphere===null&&Tt.computeBoundingSphere(),Bt.copy(Tt.boundingSphere.center)),Bt.applyMatrix4(S.matrixWorld).applyMatrix4(rt)),Array.isArray(Mt)){const Rt=Tt.groups;for(let Ht=0,A=Rt.length;Ht<A;Ht++){const U=Rt[Ht],H=Mt[U.materialIndex];H&&H.visible&&m.push(S,Tt,H,G,Bt.z,U)}}else Mt.visible&&m.push(S,Tt,Mt,G,Bt.z,null)}}const ut=S.children;for(let Tt=0,Mt=ut.length;Tt<Mt;Tt++)si(ut[Tt],O,G,W)}function Ti(S,O,G,W){const B=S.opaque,ut=S.transmissive,Tt=S.transparent;u.setupLightsView(G),le===!0&&ft.setGlobalState(v.clippingPlanes,G),W&&$.viewport(P.copy(W)),B.length>0&&Vn(B,O,G),ut.length>0&&Vn(ut,O,G),Tt.length>0&&Vn(Tt,O,G),$.buffers.depth.setTest(!0),$.buffers.depth.setMask(!0),$.buffers.color.setMask(!0),$.setPolygonOffset(!1)}function cs(S,O,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[W.id]===void 0&&(u.state.transmissionRenderTarget[W.id]=new an(1,1,{generateMipmaps:!0,type:nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float")?Mn:yn,minFilter:Mi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ue.workingColorSpace}));const ut=u.state.transmissionRenderTarget[W.id],Tt=W.viewport||P;ut.setSize(Tt.z*v.transmissionResolutionScale,Tt.w*v.transmissionResolutionScale);const Mt=v.getRenderTarget(),Rt=v.getActiveCubeFace(),Ht=v.getActiveMipmapLevel();v.setRenderTarget(ut),v.getClearColor(K),X=v.getClearAlpha(),X<1&&v.setClearColor(16777215,.5),v.clear(),te&&At.render(G);const A=v.toneMapping;v.toneMapping=ei;const U=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),u.setupLightsView(W),le===!0&&ft.setGlobalState(v.clippingPlanes,W),Vn(S,G,W),lt.updateMultisampleRenderTarget(ut),lt.updateRenderTargetMipmap(ut),nt.has("WEBGL_multisampled_render_to_texture")===!1){let H=!1;for(let et=0,Ot=O.length;et<Ot;et++){const xt=O[et],ae=xt.object,Ct=xt.geometry,ee=xt.material,Xt=xt.group;if(ee.side===je&&ae.layers.test(W.layers)){const Re=ee.side;ee.side=We,ee.needsUpdate=!0,bi(ae,G,W,Ct,ee,Xt),ee.side=Re,ee.needsUpdate=!0,H=!0}}H===!0&&(lt.updateMultisampleRenderTarget(ut),lt.updateRenderTargetMipmap(ut))}v.setRenderTarget(Mt,Rt,Ht),v.setClearColor(K,X),U!==void 0&&(W.viewport=U),v.toneMapping=A}function Vn(S,O,G){const W=O.isScene===!0?O.overrideMaterial:null;for(let B=0,ut=S.length;B<ut;B++){const Tt=S[B],Mt=Tt.object,Rt=Tt.geometry,Ht=Tt.group;let A=Tt.material;A.allowOverride===!0&&W!==null&&(A=W),Mt.layers.test(G.layers)&&bi(Mt,O,G,Rt,A,Ht)}}function bi(S,O,G,W,B,ut){S.onBeforeRender(v,O,G,W,B,ut),S.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),B.onBeforeRender(v,O,G,W,S,ut),B.transparent===!0&&B.side===je&&B.forceSinglePass===!1?(B.side=We,B.needsUpdate=!0,v.renderBufferDirect(G,O,W,B,S,ut),B.side=Hn,B.needsUpdate=!0,v.renderBufferDirect(G,O,W,B,S,ut),B.side=je):v.renderBufferDirect(G,O,W,B,S,ut),S.onAfterRender(v,O,G,W,B,ut)}function bn(S,O,G){O.isScene!==!0&&(O=Dt);const W=at.get(S),B=u.state.lights,ut=u.state.shadowsArray,Tt=B.state.version,Mt=q.getParameters(S,B.state,ut,O,G),Rt=q.getProgramCacheKey(Mt);let Ht=W.programs;W.environment=S.isMeshStandardMaterial?O.environment:null,W.fog=O.fog,W.envMap=(S.isMeshStandardMaterial?Gt:Kt).get(S.envMap||W.environment),W.envMapRotation=W.environment!==null&&S.envMap===null?O.environmentRotation:S.envMapRotation,Ht===void 0&&(S.addEventListener("dispose",tt),Ht=new Map,W.programs=Ht);let A=Ht.get(Rt);if(A!==void 0){if(W.currentProgram===A&&W.lightsStateVersion===Tt)return Vs(S,Mt),A}else Mt.uniforms=q.getUniforms(S),S.onBeforeCompile(Mt,v),A=q.acquireProgram(Mt,Rt),Ht.set(Rt,A),W.uniforms=Mt.uniforms;const U=W.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(U.clippingPlanes=ft.uniform),Vs(S,Mt),W.needsLights=Ai(S),W.lightsStateVersion=Tt,W.needsLights&&(U.ambientLightColor.value=B.state.ambient,U.lightProbe.value=B.state.probe,U.directionalLights.value=B.state.directional,U.directionalLightShadows.value=B.state.directionalShadow,U.spotLights.value=B.state.spot,U.spotLightShadows.value=B.state.spotShadow,U.rectAreaLights.value=B.state.rectArea,U.ltc_1.value=B.state.rectAreaLTC1,U.ltc_2.value=B.state.rectAreaLTC2,U.pointLights.value=B.state.point,U.pointLightShadows.value=B.state.pointShadow,U.hemisphereLights.value=B.state.hemi,U.directionalShadowMap.value=B.state.directionalShadowMap,U.directionalShadowMatrix.value=B.state.directionalShadowMatrix,U.spotShadowMap.value=B.state.spotShadowMap,U.spotLightMatrix.value=B.state.spotLightMatrix,U.spotLightMap.value=B.state.spotLightMap,U.pointShadowMap.value=B.state.pointShadowMap,U.pointShadowMatrix.value=B.state.pointShadowMatrix),W.currentProgram=A,W.uniformsList=null,A}function Hs(S){if(S.uniformsList===null){const O=S.currentProgram.getUniforms();S.uniformsList=wr.seqWithValue(O.seq,S.uniforms)}return S.uniformsList}function Vs(S,O){const G=at.get(S);G.outputColorSpace=O.outputColorSpace,G.batching=O.batching,G.batchingColor=O.batchingColor,G.instancing=O.instancing,G.instancingColor=O.instancingColor,G.instancingMorph=O.instancingMorph,G.skinning=O.skinning,G.morphTargets=O.morphTargets,G.morphNormals=O.morphNormals,G.morphColors=O.morphColors,G.morphTargetsCount=O.morphTargetsCount,G.numClippingPlanes=O.numClippingPlanes,G.numIntersection=O.numClipIntersection,G.vertexAlphas=O.vertexAlphas,G.vertexTangents=O.vertexTangents,G.toneMapping=O.toneMapping}function kr(S,O,G,W,B){O.isScene!==!0&&(O=Dt),lt.resetTextureUnits();const ut=O.fog,Tt=W.isMeshStandardMaterial?O.environment:null,Mt=I===null?v.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:ns,Rt=(W.isMeshStandardMaterial?Gt:Kt).get(W.envMap||Tt),Ht=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,A=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),U=!!G.morphAttributes.position,H=!!G.morphAttributes.normal,et=!!G.morphAttributes.color;let Ot=ei;W.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(Ot=v.toneMapping);const xt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,ae=xt!==void 0?xt.length:0,Ct=at.get(W),ee=u.state.lights;if(le===!0&&(J===!0||S!==M)){const be=S===M&&W.id===y;ft.setState(W,S,be)}let Xt=!1;W.version===Ct.__version?(Ct.needsLights&&Ct.lightsStateVersion!==ee.state.version||Ct.outputColorSpace!==Mt||B.isBatchedMesh&&Ct.batching===!1||!B.isBatchedMesh&&Ct.batching===!0||B.isBatchedMesh&&Ct.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Ct.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Ct.instancing===!1||!B.isInstancedMesh&&Ct.instancing===!0||B.isSkinnedMesh&&Ct.skinning===!1||!B.isSkinnedMesh&&Ct.skinning===!0||B.isInstancedMesh&&Ct.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Ct.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Ct.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Ct.instancingMorph===!1&&B.morphTexture!==null||Ct.envMap!==Rt||W.fog===!0&&Ct.fog!==ut||Ct.numClippingPlanes!==void 0&&(Ct.numClippingPlanes!==ft.numPlanes||Ct.numIntersection!==ft.numIntersection)||Ct.vertexAlphas!==Ht||Ct.vertexTangents!==A||Ct.morphTargets!==U||Ct.morphNormals!==H||Ct.morphColors!==et||Ct.toneMapping!==Ot||Ct.morphTargetsCount!==ae)&&(Xt=!0):(Xt=!0,Ct.__version=W.version);let Re=Ct.currentProgram;Xt===!0&&(Re=bn(W,O,B));let Gn=!1,Ie=!1,ri=!1;const ve=Re.getUniforms(),Oe=Ct.uniforms;if($.useProgram(Re.program)&&(Gn=!0,Ie=!0,ri=!0),W.id!==y&&(y=W.id,Ie=!0),Gn||M!==S){$.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),ve.setValue(D,"projectionMatrix",S.projectionMatrix),ve.setValue(D,"viewMatrix",S.matrixWorldInverse);const Le=ve.map.cameraPosition;Le!==void 0&&Le.setValue(D,bt.setFromMatrixPosition(S.matrixWorld)),j.logarithmicDepthBuffer&&ve.setValue(D,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&ve.setValue(D,"isOrthographic",S.isOrthographicCamera===!0),M!==S&&(M=S,Ie=!0,ri=!0)}if(B.isSkinnedMesh){ve.setOptional(D,B,"bindMatrix"),ve.setOptional(D,B,"bindMatrixInverse");const be=B.skeleton;be&&(be.boneTexture===null&&be.computeBoneTexture(),ve.setValue(D,"boneTexture",be.boneTexture,lt))}B.isBatchedMesh&&(ve.setOptional(D,B,"batchingTexture"),ve.setValue(D,"batchingTexture",B._matricesTexture,lt),ve.setOptional(D,B,"batchingIdTexture"),ve.setValue(D,"batchingIdTexture",B._indirectTexture,lt),ve.setOptional(D,B,"batchingColorTexture"),B._colorsTexture!==null&&ve.setValue(D,"batchingColorTexture",B._colorsTexture,lt));const Be=G.morphAttributes;if((Be.position!==void 0||Be.normal!==void 0||Be.color!==void 0)&&ct.update(B,G,Re),(Ie||Ct.receiveShadow!==B.receiveShadow)&&(Ct.receiveShadow=B.receiveShadow,ve.setValue(D,"receiveShadow",B.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Oe.envMap.value=Rt,Oe.flipEnvMap.value=Rt.isCubeTexture&&Rt.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&O.environment!==null&&(Oe.envMapIntensity.value=O.environmentIntensity),Ie&&(ve.setValue(D,"toneMappingExposure",v.toneMappingExposure),Ct.needsLights&&wi(Oe,ri),ut&&W.fog===!0&&it.refreshFogUniforms(Oe,ut),it.refreshMaterialUniforms(Oe,W,Z,Q,u.state.transmissionRenderTarget[S.id]),wr.upload(D,Hs(Ct),Oe,lt)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(wr.upload(D,Hs(Ct),Oe,lt),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&ve.setValue(D,"center",B.center),ve.setValue(D,"modelViewMatrix",B.modelViewMatrix),ve.setValue(D,"normalMatrix",B.normalMatrix),ve.setValue(D,"modelMatrix",B.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const be=W.uniformsGroups;for(let Le=0,Ri=be.length;Le<Ri;Le++){const cn=be[Le];Vt.update(cn,Re),Vt.bind(cn,Re)}}return Re}function wi(S,O){S.ambientLightColor.needsUpdate=O,S.lightProbe.needsUpdate=O,S.directionalLights.needsUpdate=O,S.directionalLightShadows.needsUpdate=O,S.pointLights.needsUpdate=O,S.pointLightShadows.needsUpdate=O,S.spotLights.needsUpdate=O,S.spotLightShadows.needsUpdate=O,S.rectAreaLights.needsUpdate=O,S.hemisphereLights.needsUpdate=O}function Ai(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return L},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(S,O,G){const W=at.get(S);W.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),at.get(S.texture).__webglTexture=O,at.get(S.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:G,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,O){const G=at.get(S);G.__webglFramebuffer=O,G.__useDefaultFramebuffer=O===void 0};const Hr=D.createFramebuffer();this.setRenderTarget=function(S,O=0,G=0){I=S,R=O,L=G;let W=!0,B=null,ut=!1,Tt=!1;if(S){const Rt=at.get(S);if(Rt.__useDefaultFramebuffer!==void 0)$.bindFramebuffer(D.FRAMEBUFFER,null),W=!1;else if(Rt.__webglFramebuffer===void 0)lt.setupRenderTarget(S);else if(Rt.__hasExternalTextures)lt.rebindTextures(S,at.get(S.texture).__webglTexture,at.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const U=S.depthTexture;if(Rt.__boundDepthTexture!==U){if(U!==null&&at.has(U)&&(S.width!==U.image.width||S.height!==U.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");lt.setupDepthRenderbuffer(S)}}const Ht=S.texture;(Ht.isData3DTexture||Ht.isDataArrayTexture||Ht.isCompressedArrayTexture)&&(Tt=!0);const A=at.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(A[O])?B=A[O][G]:B=A[O],ut=!0):S.samples>0&&lt.useMultisampledRTT(S)===!1?B=at.get(S).__webglMultisampledFramebuffer:Array.isArray(A)?B=A[G]:B=A,P.copy(S.viewport),F.copy(S.scissor),V=S.scissorTest}else P.copy(Pt).multiplyScalar(Z).floor(),F.copy(Jt).multiplyScalar(Z).floor(),V=ie;if(G!==0&&(B=Hr),$.bindFramebuffer(D.FRAMEBUFFER,B)&&W&&$.drawBuffers(S,B),$.viewport(P),$.scissor(F),$.setScissorTest(V),ut){const Rt=at.get(S.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+O,Rt.__webglTexture,G)}else if(Tt){const Rt=O;for(let Ht=0;Ht<S.textures.length;Ht++){const A=at.get(S.textures[Ht]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Ht,A.__webglTexture,G,Rt)}}else if(S!==null&&G!==0){const Rt=at.get(S.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Rt.__webglTexture,G)}y=-1},this.readRenderTargetPixels=function(S,O,G,W,B,ut,Tt,Mt=0){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Rt=at.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Tt!==void 0&&(Rt=Rt[Tt]),Rt){$.bindFramebuffer(D.FRAMEBUFFER,Rt);try{const Ht=S.textures[Mt],A=Ht.format,U=Ht.type;if(!j.textureFormatReadable(A)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!j.textureTypeReadable(U)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=S.width-W&&G>=0&&G<=S.height-B&&(S.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Mt),D.readPixels(O,G,W,B,Ft.convert(A),Ft.convert(U),ut))}finally{const Ht=I!==null?at.get(I).__webglFramebuffer:null;$.bindFramebuffer(D.FRAMEBUFFER,Ht)}}},this.readRenderTargetPixelsAsync=async function(S,O,G,W,B,ut,Tt,Mt=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Rt=at.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Tt!==void 0&&(Rt=Rt[Tt]),Rt)if(O>=0&&O<=S.width-W&&G>=0&&G<=S.height-B){$.bindFramebuffer(D.FRAMEBUFFER,Rt);const Ht=S.textures[Mt],A=Ht.format,U=Ht.type;if(!j.textureFormatReadable(A))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!j.textureTypeReadable(U))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const H=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,H),D.bufferData(D.PIXEL_PACK_BUFFER,ut.byteLength,D.STREAM_READ),S.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Mt),D.readPixels(O,G,W,B,Ft.convert(A),Ft.convert(U),0);const et=I!==null?at.get(I).__webglFramebuffer:null;$.bindFramebuffer(D.FRAMEBUFFER,et);const Ot=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Kh(D,Ot,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,H),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,ut),D.deleteBuffer(H),D.deleteSync(Ot),ut}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,O=null,G=0){const W=Math.pow(2,-G),B=Math.floor(S.image.width*W),ut=Math.floor(S.image.height*W),Tt=O!==null?O.x:0,Mt=O!==null?O.y:0;lt.setTexture2D(S,0),D.copyTexSubImage2D(D.TEXTURE_2D,G,0,0,Tt,Mt,B,ut),$.unbindTexture()};const wn=D.createFramebuffer(),Vr=D.createFramebuffer();this.copyTextureToTexture=function(S,O,G=null,W=null,B=0,ut=null){ut===null&&(B!==0?(Ls("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ut=B,B=0):ut=0);let Tt,Mt,Rt,Ht,A,U,H,et,Ot;const xt=S.isCompressedTexture?S.mipmaps[ut]:S.image;if(G!==null)Tt=G.max.x-G.min.x,Mt=G.max.y-G.min.y,Rt=G.isBox3?G.max.z-G.min.z:1,Ht=G.min.x,A=G.min.y,U=G.isBox3?G.min.z:0;else{const Be=Math.pow(2,-B);Tt=Math.floor(xt.width*Be),Mt=Math.floor(xt.height*Be),S.isDataArrayTexture?Rt=xt.depth:S.isData3DTexture?Rt=Math.floor(xt.depth*Be):Rt=1,Ht=0,A=0,U=0}W!==null?(H=W.x,et=W.y,Ot=W.z):(H=0,et=0,Ot=0);const ae=Ft.convert(O.format),Ct=Ft.convert(O.type);let ee;O.isData3DTexture?(lt.setTexture3D(O,0),ee=D.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(lt.setTexture2DArray(O,0),ee=D.TEXTURE_2D_ARRAY):(lt.setTexture2D(O,0),ee=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,O.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,O.unpackAlignment);const Xt=D.getParameter(D.UNPACK_ROW_LENGTH),Re=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Gn=D.getParameter(D.UNPACK_SKIP_PIXELS),Ie=D.getParameter(D.UNPACK_SKIP_ROWS),ri=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,xt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,xt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ht),D.pixelStorei(D.UNPACK_SKIP_ROWS,A),D.pixelStorei(D.UNPACK_SKIP_IMAGES,U);const ve=S.isDataArrayTexture||S.isData3DTexture,Oe=O.isDataArrayTexture||O.isData3DTexture;if(S.isDepthTexture){const Be=at.get(S),be=at.get(O),Le=at.get(Be.__renderTarget),Ri=at.get(be.__renderTarget);$.bindFramebuffer(D.READ_FRAMEBUFFER,Le.__webglFramebuffer),$.bindFramebuffer(D.DRAW_FRAMEBUFFER,Ri.__webglFramebuffer);for(let cn=0;cn<Rt;cn++)ve&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,at.get(S).__webglTexture,B,U+cn),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,at.get(O).__webglTexture,ut,Ot+cn)),D.blitFramebuffer(Ht,A,Tt,Mt,H,et,Tt,Mt,D.DEPTH_BUFFER_BIT,D.NEAREST);$.bindFramebuffer(D.READ_FRAMEBUFFER,null),$.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(B!==0||S.isRenderTargetTexture||at.has(S)){const Be=at.get(S),be=at.get(O);$.bindFramebuffer(D.READ_FRAMEBUFFER,wn),$.bindFramebuffer(D.DRAW_FRAMEBUFFER,Vr);for(let Le=0;Le<Rt;Le++)ve?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Be.__webglTexture,B,U+Le):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Be.__webglTexture,B),Oe?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,be.__webglTexture,ut,Ot+Le):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,be.__webglTexture,ut),B!==0?D.blitFramebuffer(Ht,A,Tt,Mt,H,et,Tt,Mt,D.COLOR_BUFFER_BIT,D.NEAREST):Oe?D.copyTexSubImage3D(ee,ut,H,et,Ot+Le,Ht,A,Tt,Mt):D.copyTexSubImage2D(ee,ut,H,et,Ht,A,Tt,Mt);$.bindFramebuffer(D.READ_FRAMEBUFFER,null),$.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else Oe?S.isDataTexture||S.isData3DTexture?D.texSubImage3D(ee,ut,H,et,Ot,Tt,Mt,Rt,ae,Ct,xt.data):O.isCompressedArrayTexture?D.compressedTexSubImage3D(ee,ut,H,et,Ot,Tt,Mt,Rt,ae,xt.data):D.texSubImage3D(ee,ut,H,et,Ot,Tt,Mt,Rt,ae,Ct,xt):S.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,ut,H,et,Tt,Mt,ae,Ct,xt.data):S.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,ut,H,et,xt.width,xt.height,ae,xt.data):D.texSubImage2D(D.TEXTURE_2D,ut,H,et,Tt,Mt,ae,Ct,xt);D.pixelStorei(D.UNPACK_ROW_LENGTH,Xt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Re),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Gn),D.pixelStorei(D.UNPACK_SKIP_ROWS,Ie),D.pixelStorei(D.UNPACK_SKIP_IMAGES,ri),ut===0&&O.generateMipmaps&&D.generateMipmap(ee),$.unbindTexture()},this.initRenderTarget=function(S){at.get(S).__webglFramebuffer===void 0&&lt.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?lt.setTextureCube(S,0):S.isData3DTexture?lt.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?lt.setTexture2DArray(S,0):lt.setTexture2D(S,0),$.unbindTexture()},this.resetState=function(){R=0,L=0,I=null,$.reset(),vt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=ue._getDrawingBufferColorSpace(t),e.unpackColorSpace=ue._getUnpackColorSpace()}}const Ar={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class ls{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const K0=new Ko(-1,1,1,-1,0,1);class $0 extends ye{constructor(){super(),this.setAttribute("position",new de([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new de([0,2,0,0,2,0],2))}}const J0=new $0;class Jo{constructor(t){this._mesh=new Lt(J0,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,K0)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class j0 extends ls{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof He?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Ds.clone(t.uniforms),this.material=new He({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Jo(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class oc extends ls{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Q0 extends ls{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class tg{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new ot);this._width=n.width,this._height=n.height,e=new an(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Mn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new j0(Ar),this.copyPass.material.blending=On,this.clock=new hd}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}oc!==void 0&&(a instanceof oc?n=!0:a instanceof Q0&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new ot);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class eg extends ls{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Zt}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}const ng={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Zt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class rs extends ls{constructor(t,e=1,n,s){super(),this.strength=e,this.radius=n,this.threshold=s,this.resolution=t!==void 0?new ot(t.x,t.y):new ot(256,256),this.clearColor=new Zt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new an(r,a,{type:Mn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const d=new an(r,a,{type:Mn});d.texture.name="UnrealBloomPass.h"+h,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const f=new an(r,a,{type:Mn});f.texture.name="UnrealBloomPass.v"+h,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=ng;this.highPassUniforms=Ds.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new He({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new ot(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new w(1,1,1),new w(1,1,1),new w(1,1,1),new w(1,1,1),new w(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Ds.clone(Ar.uniforms),this.blendMaterial=new He({uniforms:this.copyUniforms,vertexShader:Ar.vertexShader,fragmentShader:Ar.fragmentShader,blending:Qe,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Zt,this._oldClearAlpha=1,this._basic=new ce,this._fsQuad=new Jo(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new ot(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(t,e,n,s,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=rs.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=rs.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){const e=[];for(let n=0;n<t;n++)e.push(.39894*Math.exp(-.5*n*n/(t*t))/t);return new He({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new ot(.5,.5)},direction:{value:new ot(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(t){return new He({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}rs.BlurDirectionX=new ot(1,0);rs.BlurDirectionY=new ot(0,1);const Mr={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class ig extends ls{constructor(){super(),this.uniforms=Ds.clone(Mr.uniforms),this.material=new nd({name:Mr.name,uniforms:this.uniforms,vertexShader:Mr.vertexShader,fragmentShader:Mr.fragmentShader}),this._fsQuad=new Jo(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},ue.getTransfer(this._outputColorSpace)===me&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===gc?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===_c?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===xc?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Lo?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Mc?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===yc?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===vc&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}let Ra=1959;function ge(){return Ra=(Ra*1664525+1013904223)%4294967296,Ra/4294967296}const zt=(i,t)=>i+(t-i)*ge(),Co=i=>i[Math.floor(ge()*i.length)];function sn(i,t,e,{repeat:n=null,srgb:s=!0}={}){const r=document.createElement("canvas");r.width=i,r.height=t;const a=r.getContext("2d");e(a,i,t);const o=new Go(r);return s&&(o.colorSpace=qe),o.anisotropy=8,n&&(o.wrapS=o.wrapT=ws,o.repeat.set(n[0],n[1])),o}function qt(i,t={}){return new ks({color:i,roughness:.78,metalness:.03,flatShading:!0,...t})}function mt(i,t,e,n,s=0,r=0,a=0,o=!0,l=!0){const c=new Lt(new on(i,t,e),n);return c.position.set(s,r,a),c.castShadow=o,c.receiveShadow=l,c}function Se(i,t,e,n,s=0,r=0,a=0,o=8){const l=new Lt(new vn(i,t,e,o),n);return l.position.set(s,r,a),l.castShadow=!0,l.receiveShadow=!0,l}function sg(){return sn(512,512,(i,t,e)=>{i.fillStyle="#24242a",i.fillRect(0,0,t,e);for(let n=0;n<9e3;n++){const s=22+Math.floor(ge()*42);i.fillStyle=`rgba(${s},${s},${s+Math.floor(ge()*7)},${zt(.12,.6)})`,i.fillRect(ge()*t,ge()*e,zt(1,3.5),zt(1,3))}for(let n=0;n<14;n++){i.strokeStyle=`rgba(9,9,13,${zt(.25,.65)})`,i.lineWidth=zt(.6,2.4),i.beginPath();let s=ge()*t,r=ge()*e;i.moveTo(s,r);for(let a=0;a<7;a++)s+=zt(-32,32),r+=zt(8,34),i.lineTo(s,r);i.stroke()}for(let n=0;n<6;n++){const s=ge()*t,r=ge()*e,a=zt(25,90),o=i.createRadialGradient(s,r,2,s,r,a);o.addColorStop(0,"rgba(5,6,9,.28)"),o.addColorStop(1,"rgba(5,6,9,0)"),i.fillStyle=o,i.beginPath(),i.arc(s,r,a,0,Math.PI*2),i.fill()}},{repeat:[4,4]})}function rg(){return sn(512,512,(i,t,e)=>{i.fillStyle="#4c3b31",i.fillRect(0,0,t,e);for(let n=0;n<15e3;n++){const s=ge();i.fillStyle=s>.5?`rgba(118,93,70,${zt(.06,.34)})`:`rgba(28,23,23,${zt(.05,.3)})`,i.fillRect(ge()*t,ge()*e,zt(1,4),zt(1,2))}for(let n=0;n<22;n++){i.strokeStyle=`rgba(28,22,22,${zt(.08,.22)})`,i.lineWidth=zt(2,8),i.beginPath();for(let s=0;s<=t;s+=18){const r=e*.2+n*20+Math.sin(s*.014+n)*11;s===0?i.moveTo(s,r):i.lineTo(s,r)}i.stroke()}},{repeat:[10,10]})}function ag(){return sn(256,256,(i,t,e)=>{i.fillStyle="#5c4634",i.fillRect(0,0,t,e);for(let n=0;n<e;n+=32){i.fillStyle=Co(["#6a503b","#594534","#73563d","#4c382a"]),i.fillRect(0,n+1,t,30),i.fillStyle="rgba(20,13,9,.75)",i.fillRect(0,n,t,2);for(let s=0;s<12;s++)i.strokeStyle=`rgba(30,19,12,${zt(.08,.25)})`,i.lineWidth=zt(.4,1.4),i.beginPath(),i.moveTo(0,n+ge()*30),i.bezierCurveTo(t*.3,n+ge()*30,t*.7,n+ge()*30,t,n+ge()*30),i.stroke()}},{repeat:[2,1]})}function og(){const i=sn(128,128,(t,e,n)=>{t.clearRect(0,0,e,n),t.strokeStyle="rgba(124,132,132,.78)",t.lineWidth=2;for(let s=-2;s<12;s++)t.beginPath(),t.moveTo(s*16,0),t.lineTo(s*16+64,n),t.stroke(),t.beginPath(),t.moveTo(s*16+64,0),t.lineTo(s*16,n),t.stroke()},{repeat:[3,1]});return i.wrapS=i.wrapT=ws,i}function lg(){return sn(256,256,(i,t,e)=>{i.clearRect(0,0,t,e),i.fillStyle="rgba(79,12,14,.65)";for(let n=0;n<18;n++)i.beginPath(),i.ellipse(zt(45,210),zt(45,210),zt(10,48),zt(5,28),ge()*6,0,Math.PI*2),i.fill();for(let n=0;n<40;n++)i.beginPath(),i.arc(ge()*t,ge()*e,zt(1,6),0,Math.PI*2),i.fill()})}function In({w:i=512,h:t=192,lines:e,bg:n="rgba(0,0,0,0)",color:s="#ffe8ca",glow:r="#ff5e6d",font:a="Bebas Neue",size:o=96,border:l=null,letter:c=4,sub:h=null,subColor:d="#ffd58c",subSize:f=28}){return sn(i,t,g=>{n!=="transparent"&&(g.fillStyle=n,g.fillRect(0,0,i,t)),l&&(g.strokeStyle=l,g.lineWidth=5,g.strokeRect(5,5,i-10,t-10)),g.textAlign="center",g.textBaseline="middle";const x=Array.isArray(e)?e:[e],m=t/(x.length+(h?.7:0));x.forEach((u,T)=>{g.font=`400 ${o}px "${a}", Impact, sans-serif`,g.shadowColor=r,g.shadowBlur=26,g.fillStyle=r,g.fillText(u,i/2,m*(T+.58)),g.shadowBlur=10,g.fillStyle=s,g.fillText(u,i/2,m*(T+.58)),g.fillStyle=s,g.fillText(u,i/2,m*(T+.58))}),h&&(g.shadowBlur=8,g.shadowColor=d,g.font=`600 ${f}px Oswald, sans-serif`,g.fillStyle=d,g.fillText(Array.isArray(h)?h.join("  •  "):h,i/2,t-f*.8))})}function Un(i,t,e,{emissive:n=!0,doubleSided:s=!0}={}){const r=new ce({map:i,transparent:!0,depthWrite:!1,side:s?je:Hn,toneMapped:!1});return new Lt(new Fe(t,e),r)}function Ca(i,t,e,n=2761766){const s=qt(n,{roughness:.5,metalness:.55});i.add(mt(t+.18,.11,.12,s,0,e/2+.04,0)),i.add(mt(t+.18,.11,.12,s,0,-e/2-.04,0)),i.add(mt(.11,e,.12,s,-t/2-.04,0,0)),i.add(mt(.11,e,.12,s,t/2+.04,0,0))}function cg(i,{mobile:t=!1}={}){const e=new $t;e.name="world",i.add(e);const n={signs:[],bulbs:[],dust:null,fire:null,smoke:[],flags:[],tumble:null},s=[],r=sg(),a=rg(),o=ag(),l=og(),c=lg(),h={sand:qt(10781541,{map:a,roughness:1}),asphalt:qt(5591127,{map:r,roughness:.94}),wood:qt(12558977,{map:o,roughness:.84}),woodDark:qt(5060137,{roughness:.9}),metal:qt(5001300,{roughness:.34,metalness:.72}),chrome:qt(14144713,{roughness:.18,metalness:.92}),rust:qt(7880496,{roughness:.9,metalness:.16}),stucco:qt(12363661,{roughness:.94}),stuccoDark:qt(9139811,{roughness:.94}),teal:qt(3106407,{roughness:.55,metalness:.1}),cream:qt(14733233,{roughness:.76}),black:qt(1184793,{roughness:.55}),red:qt(10171182,{roughness:.66}),amber:qt(14981949,{roughness:.5}),cinder:qt(7629923,{roughness:.97}),darkMetal:qt(2698544,{roughness:.6,metalness:.35})},d=new He({side:We,depthWrite:!1,fog:!1,uniforms:{top:{value:new Zt(330003)},mid:{value:new Zt(1581372)},horizon:{value:new Zt(4861243)},low:{value:new Zt(1905949)}},vertexShader:"varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
      uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; uniform vec3 low;
      varying vec3 vP;
      void main(){
        float y = normalize(vP).y;
        vec3 c = mix(low, horizon, smoothstep(-0.22, 0.04, y));
        c = mix(c, mid, smoothstep(0.02, 0.28, y));
        c = mix(c, top, smoothstep(0.26, 0.82, y));
        float glow = pow(max(0.0, 1.0 - abs(y - 0.01) * 6.0), 4.0);
        c += vec3(0.19, 0.055, 0.045) * glow;
        gl_FragColor = vec4(c, 1.0);
      }`}),f=new Lt(new nn(120,40,24),d);f.renderOrder=-10,e.add(f),i.fog=new ko(658453,.0115);const p=new ye,g=[];for(let A=0;A<900;A++){const U=zt(0,Math.PI*2),H=zt(.08,1.32),et=100;g.push(Math.cos(U)*Math.cos(H)*et,Math.sin(H)*et,Math.sin(U)*Math.cos(H)*et)}p.setAttribute("position",new de(g,3));const x=new To(p,new Ur({color:13621759,size:.21,transparent:!0,opacity:.7,depthWrite:!1,fog:!1}));e.add(x);const m=sn(256,256,(A,U,H)=>{const et=A.createRadialGradient(128,128,30,128,128,128);et.addColorStop(0,"rgba(242,238,214,1)"),et.addColorStop(.28,"rgba(229,224,197,1)"),et.addColorStop(.32,"rgba(229,224,197,.5)"),et.addColorStop(.56,"rgba(208,190,172,.13)"),et.addColorStop(1,"rgba(150,140,160,0)"),A.fillStyle=et,A.fillRect(0,0,U,H),A.globalCompositeOperation="source-atop";for(let Ot=0;Ot<15;Ot++)A.fillStyle=`rgba(105,99,99,${zt(.05,.16)})`,A.beginPath(),A.arc(zt(82,174),zt(82,174),zt(4,16),0,Math.PI*2),A.fill()}),u=new ys(new Zi({map:m,transparent:!0,depthWrite:!1,fog:!1,toneMapped:!1}));u.scale.set(26,26,1),u.position.set(-38,42,-85),e.add(u);const T=new ys(new Zi({map:sn(128,128,A=>{const U=A.createRadialGradient(64,64,1,64,64,64);U.addColorStop(0,"rgba(159,181,229,.34)"),U.addColorStop(.42,"rgba(115,134,186,.1)"),U.addColorStop(1,"rgba(80,90,130,0)"),A.fillStyle=U,A.fillRect(0,0,128,128)}),transparent:!0,depthWrite:!1,fog:!1,blending:Qe,toneMapped:!1}));T.scale.set(58,58,1),T.position.copy(u.position),e.add(T);const E=new $t,v=qt(2300968,{roughness:1,flatShading:!0}),C=qt(3416880,{roughness:1,flatShading:!0});for(let A=0;A<16;A++){const U=zt(-2.9,-.15),H=zt(52,92),et=zt(5,17),Ot=new vn(zt(4,9),zt(8,16),et,Co([5,6,7]),1),xt=new Lt(Ot,A%3?v:C);xt.position.set(Math.cos(U)*H,et/2-1,Math.sin(U)*H),xt.rotation.y=ge()*3,xt.scale.z=zt(.5,1.1),E.add(xt)}e.add(E);const R=new Lt(new Fe(220,220),h.sand);R.rotation.x=-Math.PI/2,R.position.y=-.06,R.receiveShadow=!0,e.add(R);const L=new Lt(new on(22.4,.14,21),h.asphalt);L.position.set(0,-.04,.4),L.receiveShadow=!0,e.add(L);const I=qt(3551800,{roughness:1}),y=new Lt(new on(22.8,.12,21.4),I);y.position.set(0,-.13,.4),y.receiveShadow=!0,e.add(y);const M=new Lt(new Fe(140,10),qt(2697518,{map:r,roughness:.96}));M.rotation.x=-Math.PI/2,M.position.set(0,-.01,19.2),M.receiveShadow=!0,e.add(M);const P=new ce({color:12297319,transparent:!0,opacity:.42,toneMapped:!1});for(let A=-5;A<6;A++){const U=new Lt(new Fe(4.5,.18),P);U.rotation.x=-Math.PI/2,U.position.set(A*10,.006,19.2),e.add(U)}const F=new ce({color:12889462,transparent:!0,opacity:.18,depthWrite:!1});for(let A=-2;A<=2;A++){const U=new Lt(new Fe(.13,5.4),F);U.rotation.x=-Math.PI/2,U.position.set(A*4.3,.04,5.7),e.add(U)}const V=In({w:512,h:256,lines:["KEEP OUT"],color:"rgba(204,95,71,.55)",glow:"rgba(121,31,24,.15)",size:120,letter:9}),K=Un(V,4.3,2.15);K.rotation.x=-Math.PI/2,K.rotation.z=-.22,K.position.set(1.1,.042,7.1),K.material.opacity=.2,e.add(K);const X=new Lt(new Fe(3.7,3.7),new ce({map:c,transparent:!0,opacity:.5,depthWrite:!1}));X.rotation.x=-Math.PI/2,X.position.set(-3.6,.045,-2.5),e.add(X);const k=new $t;k.position.set(-9.2,0,-13.5),e.add(k),k.add(mt(15.5,5.25,4.2,h.stucco,0,2.62,0)),k.add(mt(16.1,.28,4.7,h.stuccoDark,0,5.36,0)),k.add(mt(15.8,.16,4.55,h.teal,0,5.12,0));const Q=qt(2509643,{roughness:.7,metalness:.1}),Z=new ce({color:16762993,transparent:!0,opacity:.84,toneMapped:!1}),_t=new ce({color:10308424,transparent:!0,opacity:.8});for(let A=0;A<5;A++){const U=-5.9+A*2.95;k.add(mt(1.15,2.2,.09,Q,U,1.16,2.13)),k.add(mt(.08,.08,.08,h.chrome,U+.4,1.12,2.2,!1)),k.add(mt(1.35,.17,.18,h.stuccoDark,U,2.34,2.13)),A<4&&(k.add(mt(1.05,.8,.06,Z,U+1.48,1.72,2.13,!1)),k.add(mt(1.17,.92,.16,h.stuccoDark,U+1.48,1.72,2.07)),k.add(mt(.16,1.04,.16,h.teal,U+1.48,1.72,2.16,!1)))}k.add(mt(15.6,.2,1.3,h.stuccoDark,0,2.9,2.7)),k.add(mt(15.5,.35,.1,h.teal,0,3.78,3.28));for(let A=0;A<=10;A++){const U=-7.5+A*1.5;k.add(mt(.07,.95,.07,h.teal,U,3.33,3.28,!1))}for(let A=0;A<5;A++){const U=-5.9+A*2.95;k.add(mt(1.05,2.02,.08,Q,U,4.04,2.13)),A<4&&(k.add(mt(.98,.85,.06,Z,U+1.48,4.18,2.13,!1)),k.add(mt(1.1,.97,.14,h.stuccoDark,U+1.48,4.18,2.06)),k.add(mt(.15,.9,.15,h.teal,U+1.48,4.18,2.15,!1)))}for(let A=0;A<4;A++){const U=-4.42+A*2.95;k.add(mt(.44,.82,.02,_t,U-.2,1.6,2.18,!1)),k.add(mt(.32,.83,.02,_t,U+1.48,4.2,2.18,!1))}for(let A=0;A<3;A++){const U=new $t;U.add(mt(.85,.45,.75,h.metal,0,.24,0)),U.add(new Lt(new vn(.24,.24,.06,12),h.darkMetal)),U.children[1].rotation.x=Math.PI/2,U.children[1].position.set(0,.25,.38),U.position.set(-4.5+A*4,5.55,-.3),k.add(U)}const Et=new $t;for(let A=0;A<9;A++)Et.add(mt(1.3,.18,.5,h.stuccoDark,0,.1+A*.3,A*.44));Et.position.set(7.1,0,1.1),k.add(Et);const Pt=qt(7296066);for(let A=0;A<2;A++){const U=new $t;U.add(mt(.45,.06,.45,Pt,0,.42,0)),U.add(mt(.45,.6,.06,Pt,0,.7,-.2));for(const[H,et]of[[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18]])U.add(mt(.05,.42,.05,h.darkMetal,H,.2,et));U.position.set(-4.8+A*4,2.99,2.82),k.add(U)}const Jt=In({w:1024,h:280,lines:["SUNSET MOTEL"],color:"#ffaac8",glow:"#ff1f66",size:148,letter:8,sub:"VACANCY  •  COLOR TV  •  AIR COOLED",subSize:28,subColor:"#ffb6db"}),ie=Un(Jt,11.7,3.2);ie.position.set(-.1,6.55,2.25),Ca(ie,11.7,3.2,2827046),k.add(ie),k.add(mt(.28,1.15,.28,h.metal,-5.3,5.7,1.8)),k.add(mt(.28,1.15,.28,h.metal,5.1,5.7,1.8));const he=new $e(16733838,46,20,1.7);he.position.set(-9.3,6.9,-10.4),e.add(he),n.signs.push({mat:ie.material,light:he,base:46,rate:.8,seed:1.7});const le=In({w:512,h:128,lines:["OFFICE"],color:"#ffddae",glow:"#ffa53d",size:82,sub:"RING BELL FOR SERVICE",subSize:22,subColor:"#ffcb7e"}),J=Un(le,2.4,.62);J.position.set(-1.53,2.58,2.22),k.add(J);const rt=new $e(16753735,11,7,1.8);rt.position.set(-11.1,2.7,-10.8),e.add(rt);const bt=new $t;bt.position.set(-16.3,0,-5.1),bt.add(Se(.16,.2,8.4,h.darkMetal,0,4.2,0,6)),bt.add(mt(5.2,3.1,.28,qt(1842466,{roughness:.7}),2.1,8.2,0));const Bt=In({w:640,h:400,lines:["MOTEL"],color:"#ff9fbe",glow:"#ff1f57",size:185,letter:14,sub:["VACANCY","POOL • TV"],subSize:40,subColor:"#ffa6c4"}),Dt=Un(Bt,5,3.1);Dt.position.set(2.1,8.38,.18),Ca(Dt,5,3.1,2761509),bt.add(Dt);const te=new $e(16730487,38,17,1.6);te.position.set(2.1,8.2,2.4),bt.add(te),n.signs.push({mat:Dt.material,light:te,base:28,rate:1.7,seed:4.1}),e.add(bt);const jt=new $t;jt.position.set(9.8,0,-13.1),e.add(jt),jt.add(mt(11.2,3.4,4.4,qt(12297615,{roughness:.88}),0,1.7,0)),jt.add(mt(11.8,.26,4.8,h.chrome,0,3.46,0)),jt.add(mt(11.65,.16,4.65,h.red,0,3.74,0)),jt.add(mt(11.3,.22,.16,h.chrome,0,1.18,2.24)),jt.add(mt(11.3,.12,.18,h.chrome,0,2.55,2.25));const D=sn(1024,256,(A,U,H)=>{const et=A.createLinearGradient(0,0,0,H);et.addColorStop(0,"#1c4b4a"),et.addColorStop(.48,"#4ec4b1"),et.addColorStop(1,"#ffc477"),A.fillStyle=et,A.fillRect(0,0,U,H),A.fillStyle="rgba(10,32,34,.72)",A.fillRect(0,H*.56,U,H*.44);for(let Ot=0;Ot<6;Ot++)A.fillStyle="rgba(19,33,35,.8)",A.beginPath(),A.arc(90+Ot*170,170,27,0,Math.PI*2),A.fill(),A.fillRect(90+Ot*170-31,190,62,46),A.fillStyle="rgba(255,209,142,.34)",A.fillRect(55+Ot*170,124,62,30);for(let Ot=0;Ot<30;Ot++)A.fillStyle=`rgba(255,236,193,${zt(.06,.26)})`,A.fillRect(ge()*U,ge()*H,zt(3,18),zt(2,7))}),st=new Lt(new Fe(9.4,2.25),new ce({map:D,toneMapped:!1}));st.position.set(-.6,2.16,2.26),jt.add(st);for(let A=0;A<=5;A++)jt.add(mt(.1,2.3,.12,h.chrome,-4.2+A*1.86,2.15,2.32,!1));jt.add(mt(1.34,2.56,.1,h.teal,4.4,1.34,2.28)),jt.add(mt(.08,.65,.08,h.chrome,4.9,1.4,2.36));const nt=mt(11.8,.18,1.7,h.red,0,3.18,2.95);jt.add(nt),jt.add(mt(11.5,.08,.13,h.chrome,0,3.07,3.8,!1));const j=In({w:1024,h:250,lines:["ROSIE'S DINER"],color:"#96ffe9",glow:"#0fe3cb",size:132,letter:5,sub:"OPEN ALL NIGHT  •  HOT COFFEE",subSize:29,subColor:"#a8fff3"}),$=Un(j,9.3,2.28);$.position.set(-.2,5.1,.3),Ca($,9.3,2.28,3486003),jt.add($),jt.add(mt(.2,1.25,.2,h.metal,-3.8,4,0)),jt.add(mt(.2,1.25,.2,h.metal,3.4,4,0));const gt=new $e(5497810,40,19,1.7);gt.position.set(9.6,5.3,-9.8),e.add(gt),n.signs.push({mat:$.material,light:gt,base:40,rate:1.2,seed:2.8});const at=new $t;at.add(Se(.72,.56,.9,h.cream,0,.45,0,12)),at.add(new Lt(new ji(.4,.09,6,12,Math.PI*1.5),h.cream)),at.children[1].rotation.y=Math.PI/2,at.children[1].position.set(.63,.48,0),at.children[1].rotation.z=-.3,at.add(Se(.68,.68,.07,qt(3810077),0,.86,0,12)),at.position.set(3.6,3.88,-.7),at.rotation.z=.08,jt.add(at);const lt=new $t;lt.position.set(14.2,0,-5.2),lt.rotation.y=-.12,e.add(lt),lt.add(mt(7.6,.38,5.6,h.cream,0,3.75,0)),lt.add(mt(7.9,.15,5.9,h.red,0,3.96,0));for(const[A,U]of[[-3.1,-2],[3.1,-2],[-3.1,2],[3.1,2]])lt.add(Se(.15,.18,3.75,h.chrome,A,1.87,U,8));for(const A of[-1.45,1.45]){const U=new $t;U.add(mt(.82,1.75,.62,h.red,0,.88,0)),U.add(mt(.9,.18,.7,h.chrome,0,1.8,0)),U.add(mt(.5,.28,.04,h.black,0,1.38,.32)),U.add(mt(.38,.5,.02,new ce({color:16765568,toneMapped:!1}),0,1.52,.34,!1)),U.add(Se(.07,.07,1.2,h.black,.48,.85,.1,6)),U.position.set(A,0,.1),lt.add(U)}lt.add(mt(7.2,2.5,3.4,h.stuccoDark,0,1.25,-4.2)),lt.add(mt(7.6,.15,3.7,h.teal,0,2.57,-4.2)),lt.add(mt(2.4,1.2,.05,new ce({color:16759660,transparent:!0,opacity:.6,toneMapped:!1}),-1.5,1.5,-2.48,!1)),lt.add(mt(1.1,2.1,.08,h.teal,2.1,1.06,-2.48)),lt.add(Se(.13,.16,6.4,h.darkMetal,3.9,3.2,2.5,6)),lt.add(mt(3.1,2.2,.2,qt(2105895),3.9,6.5,2.5));const Kt=In({w:512,h:360,lines:["GAS"],color:"#ffc0a4",glow:"#ff2c17",size:205,sub:["24 HR","SERVICE"],subSize:39,subColor:"#ffc184"}),Gt=Un(Kt,2.9,2.05);Gt.position.set(3.9,6.5,2.62),lt.add(Gt);const b=new $e(16734535,30,15,1.7);b.position.set(17.8,6.5,-2.4),e.add(b),n.signs.push({mat:Gt.material,light:b,base:30,rate:1.5,seed:5.5});const _=new $e(16765595,18,10,1.8);_.position.set(14.2,3.4,-5.1),e.add(_);const z=new ks({map:l,transparent:!0,opacity:.8,side:je,roughness:.65,metalness:.3,alphaTest:.1}),q=[{x:-7.35,z:-7.2,len:4.4,rot:0},{x:7.35,z:-7.2,len:4.4,rot:0},{x:-8.7,z:-4.8,len:4.6,rot:Math.PI/2},{x:-8.7,z:5.2,len:4.6,rot:Math.PI/2},{x:8.7,z:-4.8,len:4.6,rot:Math.PI/2},{x:8.7,z:5.2,len:4.6,rot:Math.PI/2}];for(const A of q){const U=new $t;U.position.set(A.x,0,A.z),U.rotation.y=A.rot;const H=h.darkMetal,et=Math.max(2,Math.round(A.len/2));for(let xt=0;xt<=et;xt++)U.add(Se(.065,.08,2.45,H,-A.len/2+xt*A.len/et,1.22,0,6));U.add(mt(A.len,.07,.07,H,0,2.43,0)),U.add(mt(A.len,.05,.05,H,0,1.8,0));const Ot=new Lt(new Fe(A.len,2.32),z);Ot.position.y=1.22,Ot.receiveShadow=!0,U.add(Ot),e.add(U)}for(const A of[-9.8,9.8]){const U=mt(2.2,.8,.5,h.cinder,A,.4,8.1);e.add(U);for(let H=0;H<3;H++)e.add(mt(.35,.12,.06,h.red,A-.75+H*.75,.66,8.38,!1))}function it(A,U,H,et,Ot){const xt=new $t;xt.position.set(U,0,H),xt.rotation.y=et;const ae=[],Ct=qt(7032376,{map:o,roughness:.92}),ee=[qt(10122320,{map:o,roughness:.84}),qt(11897953,{map:o,roughness:.9}),qt(8280637,{map:o,roughness:.88})];for(const Ee of[-3.55,3.55]){const Ue=mt(.28,1.82,.3,Ct,Ee,.91,0);Ue.rotation.z=Ee>0?-.028:.028,xt.add(Ue),xt.add(mt(.46,.16,.56,h.darkMetal,Ee,.08,0)),xt.add(Se(.035,.035,.22,h.metal,Ee,1.9,0,5))}xt.add(mt(7.35,.19,.24,Ct,0,1.74,0));for(let Ee=0;Ee<3;Ee++){const Ue=.38+Ee*.43,Ci=Ee%2?.3:-.12;for(let An=0;An<5;An++){const lh=zt(1.2,1.55),Gr=mt(lh,.28,.13,ee[(An+Ee)%3],-2.9+An*1.46+Ci,Ue+zt(-.025,.025),.03+zt(-.04,.04));Gr.rotation.z=zt(-.03,.03),xt.add(Gr),ae.push(Gr)}}const Xt=mt(7.1,.23,.12,Ct,0,.83,.15);Xt.rotation.z=-.22,xt.add(Xt),ae.push(Xt);for(const Ee of[-2.4,0,2.4]){xt.add(mt(.07,1.55,.03,h.darkMetal,Ee,.87,.13,!1));for(const Ue of[.36,.92,1.47]){const Ci=new Lt(new nn(.035,5,4),h.chrome);Ci.position.set(Ee+zt(-.12,.12),Ue,.2),xt.add(Ci)}}const Re=qt(7364676,{roughness:1});for(let Ee=0;Ee<6;Ee++){const Ue=new Lt(new zs(.24,.34,3,6),Re);Ue.rotation.z=Math.PI/2,Ue.rotation.y=zt(-.2,.2),Ue.position.set(-2.52+Ee%3*1.02,.19+Math.floor(Ee/3)*.26,zt(.24,.42)),Ue.scale.z=.68,Ue.castShadow=!0,Ue.receiveShadow=!0,xt.add(Ue)}const Gn=In({w:384,h:384,lines:["DEAD","END"],color:"#e8d7b6",glow:"#891f1d",size:121,letter:7,border:"rgba(240,213,169,.75)"}),Ie=Un(Gn,.74,.74);Ie.position.set(0,1.03,.19),Ie.rotation.z=.035,xt.add(mt(.88,.88,.05,qt(7088162),0,1.03,.14)),xt.add(Ie);const ri=new ce({color:6185570,transparent:!0,opacity:.65});for(let Ee=0;Ee<2;Ee++){const Ue=[];for(let An=0;An<=12;An++)Ue.push(new w(-3.6+An*.6,1.55+Math.sin(An*2.2+Ee)*.1+Ee*.16,zt(-.05,.1)));const Ci=new br(new ye().setFromPoints(Ue),ri);xt.add(Ci)}const ve=new ce({color:8315806,toneMapped:!1}),Oe=new Lt(new nn(.085,8,6),ve);Oe.position.set(3.55,1.98,.1),xt.add(Oe);const Be=new $e(7267482,5,4,2);Be.position.set(3.55,1.95,.1),xt.add(Be);const be=new $t;be.position.set(0,1.58,.34),be.add(mt(.2,.26,.18,h.darkMetal,0,.08,0));const Le=new Lt(new on(.13,.16,.13),new ce({color:16761966,toneMapped:!1}));Le.position.y=.08,be.add(Le);const Ri=new Lt(new ji(.12,.016,5,10,Math.PI),h.darkMetal);Ri.position.y=.22,be.add(Ri),xt.add(be);const cn=new $e(16754008,14,6.2,2);cn.position.set(0,1.75,.6),xt.add(cn),n.signs.push({mat:Le.material,light:cn,base:14,rate:3.1,seed:Math.random()*9}),e.add(xt);const jo={id:A,group:xt,planks:ae,hp:420,maxHp:420,label:Ot,pos:new w(U,0,H),rotY:et,beacon:Oe,beaconMat:ve,beaconLight:Be,destroyed:!1,shake:0,breachT:0};return s.push(jo),jo}it(0,0,-7.2,0,"NORTH"),it(1,-8.7,.2,Math.PI/2,"WEST"),it(2,8.7,.2,-Math.PI/2,"EAST");const Y=new $t;Y.position.set(4.7,0,-2.8),Y.add(Se(.1,.16,5.2,h.darkMetal,0,2.6,0,7)),Y.add(mt(1.4,.13,.13,h.darkMetal,.55,5.18,0));const Nt=new Lt(new kn(.48,.3,8),h.metal);Nt.position.set(1.18,5.05,0),Nt.rotation.z=Math.PI,Y.add(Nt);const ft=new Lt(new nn(.19,10,8),new ce({color:16767136,toneMapped:!1}));ft.position.set(1.18,4.91,0),Y.add(ft);const It=new $e(16757866,42,15,1.7);It.position.set(1.18,4.85,0),It.castShadow=!1,Y.add(It),e.add(Y),n.signs.push({mat:ft.material,light:It,base:42,rate:2.3,seed:8.1});const At=new $t;At.position.set(-5.2,0,4.6),At.add(Se(.52,.47,1.05,h.rust,0,.53,0,12));for(const A of[.2,.82])At.add(Se(.55,.55,.09,h.darkMetal,0,A,0,12));const ct=new ce({color:16748343,transparent:!0,opacity:.9,toneMapped:!1}),yt=new Lt(new kn(.38,1.15,7),ct);yt.position.y=1.4,At.add(yt);const kt=new Lt(new kn(.22,.8,6),new ce({color:16766071,toneMapped:!1}));kt.position.y=1.5,kt.rotation.z=.12,At.add(kt);const Ft=new $e(16742957,18,9,1.8);Ft.position.y=1.7,At.add(Ft),e.add(At),n.fire={flame:yt,flame2:kt,light:Ft,base:18};const vt=new ys(new Zi({map:sn(64,64,A=>{const U=A.createRadialGradient(32,32,1,32,32,32);U.addColorStop(0,"rgba(255,149,58,.7)"),U.addColorStop(.4,"rgba(255,98,32,.18)"),U.addColorStop(1,"rgba(255,70,20,0)"),A.fillStyle=U,A.fillRect(0,0,64,64)}),transparent:!0,blending:Qe,depthWrite:!1,toneMapped:!1}));vt.scale.set(4,4,1),vt.position.set(-5.2,1.25,4.6),e.add(vt);const Vt=new $t;Vt.position.set(-4.1,0,1.2),Vt.rotation.y=.28;const N=qt(9135942,{map:o});Vt.add(mt(2.7,.14,.9,N,0,.82,0));for(const A of[-1.05,1.05]){const U=mt(.14,.78,.14,h.woodDark,A,.4,0);U.rotation.z=A>0?-.2:.2,Vt.add(U),Vt.add(mt(2.5,.1,.35,N,0,.49,.74)),Vt.add(mt(2.5,.1,.35,N,0,.49,-.74))}e.add(Vt);for(let A=0;A<3;A++){const U=Se(.055,.07,.3,new ce({color:A===1?5934928:9263666,toneMapped:!1}),-1.05+A*.55,1.05,zt(-.2,.2),6);Vt.add(U)}const dt=qt(7295030,{map:o});function pt(A,U,H=1,et=0){const Ot=new $t;Ot.add(mt(.8*H,.8*H,.8*H,dt,0,.4*H,0));for(const xt of[.17*H,.63*H])Ot.add(mt(.84*H,.06*H,.84*H,h.woodDark,0,xt,0));Ot.position.set(A,0,U),Ot.rotation.y=et,e.add(Ot)}pt(6.1,-5.9,.95,.2),pt(6.8,-5.5,.7,-.15),pt(-6.9,-5.6,1.05,-.1),pt(-7.4,6.3,.8,.3);for(let A=0;A<3;A++){const U=new Lt(new ji(.45,.17,7,12),h.black);U.rotation.x=Math.PI/2,U.rotation.z=zt(-.1,.1),U.position.set(-7.6,.18+A*.16,4),U.castShadow=!0,e.add(U)}const Ut=Se(.36,.32,.9,h.metal,6.9,.45,5.8,9);e.add(Ut),e.add(mt(.78,.06,.78,h.darkMetal,6.9,.92,5.8));const ht=sn(256,320,(A,U,H)=>{A.clearRect(0,0,U,H),A.strokeStyle="rgba(226,217,194,.7)",A.lineWidth=4,A.lineCap="round",A.beginPath(),A.arc(U*.5,52,23,0,Math.PI*2),A.stroke(),A.beginPath(),A.moveTo(U*.5,76),A.lineTo(U*.5,168),A.stroke(),A.beginPath(),A.moveTo(U*.5,96),A.lineTo(U*.5-62,148),A.moveTo(U*.5,92),A.lineTo(U*.5+55,128),A.stroke(),A.beginPath(),A.moveTo(U*.5,168),A.lineTo(U*.5-48,252),A.moveTo(U*.5,168),A.lineTo(U*.5+44,248),A.stroke();for(let et=0;et<9;et++)A.beginPath(),A.arc(24+ge()*(U-48),24+ge()*(H-48),zt(1,3),0,Math.PI*2),A.stroke()}),tt=new Lt(new Fe(2.3,2.9),new ce({map:ht,transparent:!0,opacity:.42,depthWrite:!1}));tt.rotation.x=-Math.PI/2,tt.rotation.z=-.34,tt.position.set(2,.047,4.7),e.add(tt);const wt=new $t;wt.position.set(3.2,0,7.7),wt.rotation.y=-.32;const Wt=qt(7295288,{map:o,roughness:.9});wt.add(mt(2.4,.11,.52,Wt,0,.46,0));const pe=mt(2.2,.46,.08,Wt,0,.7,-.23);pe.rotation.x=-.13,wt.add(pe);for(const A of[-1.05,1.05])wt.add(mt(.1,.46,.42,h.darkMetal,A,.23,0));wt.add(Se(.045,.055,.25,new ce({color:7178831,toneMapped:!1}),-.7,.62,.12,6)),wt.add(Se(.075,.06,.1,h.cream,.45,.56,.14,8)),e.add(wt),pt(-4.3,7.9,.72,-.22),pt(4.8,8.2,.58,.34);const re=new $t;re.position.set(-6.6,0,8.1),re.rotation.y=.22,re.add(Se(.08,.11,2.1,h.woodDark,-1.1,1.05,0,6)),re.add(Se(.08,.11,2.1,h.woodDark,1.1,1.05,0,6)),re.add(mt(2.7,1,.12,qt(5979947,{map:o}),0,2.15,0));const ln=In({w:512,h:190,lines:["MOTOR COURT"],color:"#f2dfbc",glow:"#ff7a45",size:78,sub:"VACANCY  •  NIGHTLY",subSize:24,subColor:"#f2a73b"}),Ye=Un(ln,2.45,.9);Ye.position.set(0,2.15,.08),re.add(Ye),e.add(re);const ii=new $t,Tn=qt(7164723,{roughness:1,wireframe:!0});for(const[A,U,H]of[[.42,0,1],[.3,1,.9],[.18,0,.8]]){const et=new Lt(new Zo(A,U),Tn);et.scale.set(H,H*.92,H),ii.add(et)}ii.position.set(-3.5,.48,8.3),e.add(ii),n.tumble={group:ii};function si(A,U,H,et,Ot=!1){const xt=new $t;xt.position.set(U,0,H),xt.rotation.y=et;const ae=qt(A,{metalness:.45,roughness:.42});xt.add(mt(3.65,.55,1.55,ae,0,.64,0)),xt.add(mt(1.65,.55,1.4,ae,-.18,1.12,0)),xt.add(mt(1.5,.42,1.3,new ce({color:1582636,transparent:!0,opacity:.84}),-.18,1.17,.02,!1)),xt.add(mt(1.4,.1,1.26,ae,-.18,1.42,0));for(const Ct of[-.74,.74]){const ee=new $c;ee.moveTo(0,0),ee.lineTo(1.5,0),ee.lineTo(1.15,.45),ee.lineTo(.2,.35),ee.closePath();const Xt=new Lt(new Yo(ee,{depth:.07,bevelEnabled:!1}),ae);Xt.rotation.x=Math.PI/2,Xt.rotation.z=0,Xt.position.set(1.7,1.1,Ct),xt.add(Xt)}xt.add(mt(3.95,.13,.16,h.chrome,0,.45,.8)),xt.add(mt(3.95,.13,.16,h.chrome,0,.45,-.8));for(const Ct of[-.5,.5]){const ee=new Lt(new nn(.15,8,6),new ce({color:16770478,toneMapped:!1}));ee.position.set(1.83,.64,Ct),xt.add(ee)}for(const[Ct,ee]of[[-1.22,-.8],[1.22,-.8],[-1.22,.8],[1.22,.8]]){const Xt=new Lt(new vn(.37,.37,.18,12),h.black);Xt.rotation.x=Math.PI/2,Xt.position.set(Ct,.36,ee),Xt.castShadow=!0,xt.add(Xt);const Re=new Lt(new vn(.16,.16,.2,10),h.chrome);Re.rotation.x=Math.PI/2,Re.position.set(Ct,.36,ee),xt.add(Re)}if(Ot){xt.rotation.z=.03,xt.rotation.x=-.02;const Ct=new Lt(new Fe(1.1,.5),new ce({color:1053979,transparent:!0,opacity:.5}));Ct.position.set(-.18,1.18,.68),xt.add(Ct)}return e.add(xt),xt}si(5211008,-14.1,7.5,1.22),si(8204592,13.2,7.8,-1.5,!0),si(10128232,-15.8,-2.4,1.55,!0);function Ti(A,U){const H=new $t;H.position.set(A,0,U),H.add(Se(.16,.23,10,qt(3681319),0,5,0,6)),H.add(mt(2.6,.16,.16,qt(3681319),0,8.4,0)),H.add(mt(1.8,.13,.13,qt(3681319),0,7.6,0));for(const et of[-1.15,-.5,.5,1.15])H.add(Se(.05,.05,.32,qt(7830384),et,8.62,0,5));return e.add(H),H}Ti(-21,15),Ti(2,17.5),Ti(24,14.5);const cs=new Vo({color:1513245,transparent:!0,opacity:.7}),Vn=[[-21,8.6,15],[2,8.6,17.5],[24,8.6,14.5]];for(let A=0;A<Vn.length-1;A++)for(const U of[-1.1,.4]){const[H,et,Ot]=Vn[A],[xt,ae,Ct]=Vn[A+1],ee=new Zc(new w(H,et,Ot+U),new w((H+xt)/2,et-1.1,(Ot+Ct)/2+U),new w(xt,ae,Ct+U));e.add(new br(new ye().setFromPoints(ee.getPoints(24)),cs))}const bi=new $t,bn=[],Hs=new w(-9.5,6.2,-9.4),Vs=new w(5.6,4.9,-2.8);for(let A=0;A<=20;A++){const U=A/20,H=new w().lerpVectors(Hs,Vs,U);H.y-=Math.sin(U*Math.PI)*1.5,bn.push(H)}bi.add(new br(new ye().setFromPoints(bn),cs));const kr=[16766880,16758381,16773321];for(let A=2;A<bn.length-2;A+=2){const U=bn[A],H=new Lt(new nn(.075,6,5),new ce({color:Co(kr),toneMapped:!1}));H.position.copy(U),H.position.y-=.14,bi.add(H),n.bulbs.push({mesh:H,phase:ge()*10})}e.add(bi);const wi=qt(4084802,{roughness:.93});function Ai(A,U,H){const et=new $t;et.position.set(A,0,U),et.scale.setScalar(H),et.add(Se(.22,.31,2.6,wi,0,1.3,0,7));const Ot=Se(.14,.16,1.25,wi,-.45,1.75,0,6);Ot.rotation.z=.5,et.add(Ot);const xt=Se(.11,.13,.9,wi,.42,1.35,0,6);xt.rotation.z=-.65,et.add(xt),et.add(new Lt(new nn(.22,6,5),wi)),e.add(et)}Ai(-20,4,1.1),Ai(20,10,1.35),Ai(17.5,-10.5,.8),Ai(-23,-7,.9);const Hr=qt(4208186,{roughness:1});for(let A=0;A<18;A++){const U=zt(0,Math.PI*2),H=zt(13,30),et=new Lt(new Wo(zt(.25,1.1),0),Hr);et.position.set(Math.cos(U)*H,zt(.05,.25),Math.sin(U)*H),et.scale.y=zt(.4,.8),et.rotation.set(ge(),ge(),ge()),et.castShadow=!0,et.receiveShadow=!0,e.add(et)}const wn=new $t;wn.position.set(-18,0,21),wn.rotation.y=.15,wn.add(Se(.12,.15,4.5,h.darkMetal,-1.4,2.25,0,6)),wn.add(Se(.12,.15,4.5,h.darkMetal,1.4,2.25,0,6)),wn.add(mt(5.3,2.3,.18,qt(1776673),0,4.3,0));const Vr=In({w:640,h:260,lines:["NO VACANCY"],color:"#dfcbae",glow:"#6d2023",size:105,sub:"SUNSET MOTEL  •  NEXT RIGHT",subSize:24,subColor:"#ba8f70"}),S=Un(Vr,5.1,2.05);S.position.set(0,4.35,.11),wn.add(S),e.add(wn);const O=new ye,G=[];for(let A=0;A<380;A++){const U=zt(0,Math.PI*2),H=zt(1,25);G.push(Math.cos(U)*H,zt(.1,6),Math.sin(U)*H)}O.setAttribute("position",new de(G,3));const W=new To(O,new Ur({color:13809037,size:.045,transparent:!0,opacity:.38,depthWrite:!1,blending:Qe}));e.add(W),n.dust=W;const B=sn(64,64,A=>{const U=A.createRadialGradient(32,32,1,32,32,32);U.addColorStop(0,"rgba(144,142,148,.3)"),U.addColorStop(.4,"rgba(87,85,95,.15)"),U.addColorStop(1,"rgba(50,50,60,0)"),A.fillStyle=U,A.fillRect(0,0,64,64)});for(let A=0;A<5;A++){const U=new ys(new Zi({map:B,transparent:!0,depthWrite:!1,opacity:.3}));U.position.set(-10.8+A*.1,6.6+A*.7,-13.4),U.scale.setScalar(1.3+A*.55),U.userData={baseY:U.position.y,phase:A*1.2,baseScale:U.scale.x},e.add(U),n.smoke.push(U)}const ut=new rd(8821192,3351078,1.45);i.add(ut);const Tt=new ld(5661831,.62);i.add(Tt);const Mt=new Nl(11781887,2.65);Mt.position.set(-16,24,10),Mt.castShadow=!0,Mt.shadow.mapSize.set(t?1024:2048,t?1024:2048),Mt.shadow.camera.left=-20,Mt.shadow.camera.right=20,Mt.shadow.camera.top=20,Mt.shadow.camera.bottom=-20,Mt.shadow.camera.near=1,Mt.shadow.camera.far=60,Mt.shadow.bias=-7e-4,Mt.shadow.normalBias=.035,i.add(Mt),i.add(Mt.target),Mt.target.position.set(0,0,0);const Rt=new $e(16751450,34,22,1.8);Rt.position.set(-1,5,4),i.add(Rt);const Ht=new Nl(9282524,1.05);return Ht.position.set(8,12,20),i.add(Ht),{root:e,barriers:s,animated:n,moonLight:Mt,update(A,U){W.rotation.y=A*.006,W.position.y=Math.sin(A*.12)*.08,x.rotation.y=A*.0015;for(const H of n.signs){const et=.9+Math.sin(A*H.rate+H.seed)*.07+(Math.sin(A*13.7+H.seed)>.96?-.3:0);H.mat&&H.mat.opacity!==void 0&&(H.mat.opacity=Math.min(1,.78+et*.2)),H.light&&(H.light.intensity=H.base*et)}for(const H of n.bulbs){const et=.65+Math.sin(A*2.2+H.phase)*.2;H.mesh.material.opacity=et}if(n.fire){const H=n.fire,et=.82+Math.sin(A*13)*.1+Math.sin(A*23.7)*.07;H.flame.scale.y=et,H.flame.scale.x=.88+Math.sin(A*17)*.08,H.flame2.scale.y=.9+Math.sin(A*20+2)*.12,H.light.intensity=H.base*et}if(n.tumble){const H=n.tumble.group,et=A*.045%1;H.position.x=-10.5+et*21,H.position.z=8.3+Math.sin(A*.7)*.35,H.position.y=.42+Math.abs(Math.sin(A*2.6))*.08,H.rotation.z=-A*2.9,H.rotation.x=A*1.7}for(const H of n.smoke){const et=(A*.12+H.userData.phase)%1;H.position.y=H.userData.baseY+et*3.2,H.material.opacity=.23*(1-et),H.scale.setScalar(H.userData.baseScale*(1+et*1.4))}for(let H=0;H<s.length;H++){const et=s[H];if(et.shake>0&&(et.shake=Math.max(0,et.shake-U*2.4),et.group.rotation.z=Math.sin(A*54+H)*et.shake*.012,et.group.position.y=Math.sin(A*40)*et.shake*.025),et.beaconMat){const Ot=et.hp/et.maxHp;et.beaconMat.color.setHex(Ot>.55?8315806:Ot>.22?16756812:16732742)}}}}}const lc=[14201227,11040600,8212796,12751984,8871493],cc=[6450005,8207671,5004404,9271380,5914200,8288873,3692887],hc=[3356223,4931640,2962480,5589568,3947084];function fe(i,t={}){return new ks({color:i,roughness:.82,metalness:.03,flatShading:!0,...t})}const hg=(()=>{if(typeof document>"u")return null;const i=document.createElement("canvas");i.width=i.height=64;const t=i.getContext("2d"),e=t.createRadialGradient(32,32,2,32,32,31);return e.addColorStop(0,"rgba(0,0,0,.56)"),e.addColorStop(.65,"rgba(0,0,0,.28)"),e.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),new Go(i)})(),ug=(()=>{if(typeof document>"u")return null;const i=document.createElement("canvas");i.width=i.height=64;const t=i.getContext("2d"),e=t.createRadialGradient(32,32,1,32,32,32);return e.addColorStop(0,"rgba(255,236,184,1)"),e.addColorStop(.28,"rgba(255,168,72,.8)"),e.addColorStop(.62,"rgba(210,70,32,.2)"),e.addColorStop(1,"rgba(160,30,15,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),new Go(i)})();function oh(i=1){const t=new ce({map:hg,transparent:!0,depthWrite:!1,opacity:.75});t.userData.shared=!0;const e=new Lt(new Fe(i,i),t);return e.rotation.x=-Math.PI/2,e.position.y=.015,e}function Yt(i,t,e,n,s,r,a){const o=new Lt(new on(i,t,e),n);return o.position.set(s,r,a),o.castShadow=!0,o.receiveShadow=!0,o}function dg(){const i=new $t;i.name="survivor";const t=new $t;i.add(t),i.add(oh(1.4));const e=fe(7156013,{roughness:.9}),n=fe(5515815,{roughness:.92}),s=fe(13943456,{roughness:.95}),r=fe(3490126,{roughness:.92}),a=fe(2957597,{roughness:.76}),o=fe(9527364,{roughness:.92}),l=fe(2366747,{roughness:.9}),c=fe(5855838,{roughness:.35,metalness:.7}),h=new $t;h.position.set(-.17,.92,0),h.add(Yt(.26,.78,.28,r,0,-.38,0)),h.add(Yt(.3,.2,.42,a,0,-.84,.05)),h.add(Yt(.29,.35,.3,n,0,-.66,-.01)),t.add(h);const d=h.clone();d.position.x=.17,t.add(d);const f=Yt(.64,.7,.38,e,0,1.27,0);t.add(f);const p=Yt(.26,.32,.02,s,0,1.42,.2);p.rotation.z=0,t.add(p);for(const k of[-1,1]){const Q=Yt(.22,.1,.13,n,.11*k,1.61,.15);Q.rotation.z=k*.4,t.add(Q)}t.add(Yt(.66,.1,.4,a,0,.92,0)),t.add(Yt(.12,.12,.04,c,0,.92,.22)),t.add(Yt(.2,.16,.2,o,0,1.68,0));const g=new Lt(new zs(.19,.16,4,8),o);g.position.set(0,1.88,.02),g.castShadow=!0,t.add(g);const x=new Lt(new kn(.05,.12,4),o);x.rotation.x=Math.PI/2,x.position.set(0,1.87,.22),t.add(x);for(const k of[-.075,.075])t.add(Yt(.045,.045,.02,fe(1512722),k,1.92,.2));t.add(Yt(.27,.035,.025,l,0,1.965,.2));const m=Yt(.36,.055,.24,fe(5192226),0,2.035,.16),u=new Lt(new nn(.205,8,5,0,Math.PI*2,0,Math.PI*.48),fe(6244391));u.position.set(0,2.02,0),u.scale.z=1.1,u.castShadow=!0,t.add(u),t.add(m);const T=Yt(.38,.16,.08,l,0,1.92,-.17);t.add(T),t.add(Yt(.54,.12,.4,fe(10238257),0,1.59,0));const E=new $t;E.position.set(-.4,1.55,0),E.add(Yt(.18,.5,.2,e,0,-.23,0)),E.add(Yt(.16,.38,.18,n,0,-.62,.03)),E.add(Yt(.14,.16,.16,o,0,-.86,.05)),t.add(E);const v=new $t;v.position.set(.4,1.55,0),v.add(Yt(.18,.5,.2,e,0,-.23,0)),v.add(Yt(.16,.38,.18,n,0,-.62,.03)),v.add(Yt(.14,.16,.16,o,0,-.86,.05)),t.add(v);const C=new $t;C.position.set(.14,1.34,.27);const R=Yt(.12,.16,.45,fe(5650731),0,-.04,-.38);R.rotation.x=-.08,C.add(R),C.add(Yt(.1,.1,.95,fe(3684925,{metalness:.8,roughness:.32}),0,.03,.28)),C.add(Yt(.09,.08,.88,fe(5527386,{metalness:.75,roughness:.28}),0,.11,.3)),C.add(Yt(.17,.16,.2,fe(4927267),0,-.05,-.05)),C.add(Yt(.12,.06,.18,fe(7031351),0,-.17,.04));const L=new we;L.position.set(0,.06,.75),C.add(L);const I=new ce({color:16765834,transparent:!0,opacity:0,depthWrite:!1,blending:Qe,toneMapped:!1}),y=new $t,M=new Lt(new kn(.16,.68,5),I);M.rotation.x=-Math.PI/2,M.position.z=.3,y.add(M);const P=new Lt(new kn(.1,.42,4),I);P.rotation.z=Math.PI/2,P.position.set(.2,0,.08),y.add(P);const F=P.clone();F.rotation.z=-Math.PI/2,F.position.x=-.2,y.add(F);const V=new $e(16753735,0,7,2);y.add(V),y.position.set(0,.06,.75),y.visible=!1,C.add(y),t.add(C);const K=Yt(.56,.12,.41,fe(6767154),0,1.28,0);K.rotation.z=.5,t.add(K);for(let k=0;k<5;k++)t.add(Yt(.055,.14,.03,fe(11897426),-.22+k*.11,1.28+(k-2)*.105,.22));const X={root:i,body:t,leftLeg:h,rightLeg:d,leftArm:E,rightArm:v,gun:C,muzzle:L,flash:y,flashMat:I,flashLight:V,aim:0,recoil:0};return i.userData=X,X}function fg(i,t,e,n){const s=Math.min(1,e),r=Math.sin(t*10.5)*.58*s,a=Math.abs(Math.sin(t*10.5))*.045*s;i.leftLeg.rotation.x=r,i.rightLeg.rotation.x=-r,i.leftArm.rotation.x=-r*.62+.08,i.rightArm.rotation.x=r*.35-.3,i.leftArm.rotation.z=.06,i.rightArm.rotation.z=-.16,i.body.position.y=a+Math.sin(t*1.8)*.012,i.body.rotation.z=Math.sin(t*10.5)*.02*s,i.body.rotation.x=s*.035,i.gun.rotation.x=-.05-i.recoil*.16,i.gun.position.z=.27-i.recoil*.1,i.recoil>0&&(i.recoil=Math.max(0,i.recoil-n*7.5)),i.flash.visible=i.flashMat.opacity>.02}function pg(i){i.recoil=1,i.flashMat.opacity=1,i.flash.rotation.z=Math.random()*Math.PI*2,i.flash.scale.setScalar(.8+Math.random()*.55),i.flashLight.intensity=45}function mg(i,t){i.flashMat.opacity>0&&(i.flashMat.opacity=Math.max(0,i.flashMat.opacity-t*13),i.flashLight.intensity=Math.max(0,i.flashLight.intensity-t*500))}function uc(){const i=new $t,t=fe(lc[Math.floor(Math.random()*lc.length)],{roughness:.96}),e=fe(cc[Math.floor(Math.random()*cc.length)],{roughness:.94}),n=fe(hc[Math.floor(Math.random()*hc.length)],{roughness:.95}),s=fe(2564895,{roughness:.9}),r=new ce({color:Math.random()>.35?16754250:14286730,toneMapped:!1}),a=fe(3805972),o=fe([8203305,2902858,5983021,4078427][Math.floor(Math.random()*4)]),l=new $t;i.add(l),i.add(oh(1.25));const c=new $t;c.position.set(-.16,.83,0),c.add(Yt(.24,.68,.27,n,0,-.33,0)),c.add(Yt(.27,.16,.37,s,0,-.73,.05)),l.add(c);const h=c.clone();h.position.x=.16,l.add(h);const d=Yt(.58,.72,.36,e,0,1.17,0);d.rotation.z=(Math.random()-.5)*.1,l.add(d),l.add(Yt(.18,.26,.02,t,.08,1.06,.19)),Math.random()>.5&&l.add(Yt(.52,.14,.38,o,0,.9,0)),l.add(Yt(.72,.14,.38,e,0,1.48,0));const f=new $t;f.position.set(-.38,1.42,0),f.add(Yt(.16,.55,.18,e,0,-.24,0)),f.add(Yt(.13,.42,.15,t,0,-.66,.02)),f.add(Yt(.12,.14,.15,t,0,-.9,.03)),l.add(f);const p=f.clone();p.position.x=.38,l.add(p);const g=Yt(.19,.17,.19,t,0,1.58,0);l.add(g);const x=new $t;x.position.set(0,1.75,.01);const m=new Lt(new zs(.2,.12,4,8),t);m.castShadow=!0,m.rotation.z=(Math.random()-.5)*.18,x.add(m);const u=Yt(.21,.12,.18,t,0,-.1,.04);x.add(u),x.add(Yt(.18,.06,.03,a,0,-.05,.18));for(const P of[-.07,.07]){const F=new Lt(new nn(.032,5,4),r);F.position.set(P,.045,.185),x.add(F)}x.add(Yt(.3,.06,.06,fe(4860712),0,.085,.16));const T=Math.random();if(T>.72){const P=Yt(.47,.045,.42,o,0,.16,0);x.add(P),x.add(Yt(.3,.18,.3,o,0,.27,0))}else if(T>.42){const P=new Lt(new nn(.215,7,4,0,Math.PI*2,0,Math.PI*.52),fe(4078130));P.position.y=.07,x.add(P),x.add(Yt(.31,.04,.22,fe(3157288),0,.1,.14))}else for(let P=0;P<5;P++){const F=Yt(.1,.12,.08,fe(2826525),-.18+P*.09,.13+Math.random()*.04,-.02);F.rotation.z=(Math.random()-.5)*.7,x.add(F)}l.add(x);const E=fe(6102556,{roughness:1});l.add(Yt(.16,.2,.02,E,-.17,1.21,.19)),l.add(Yt(.12,.12,.02,E,.22,1.02,.19));const v=new Lt(new on(.8,1.9,.6),new ce({color:16773584,transparent:!0,opacity:0,depthWrite:!1,blending:Qe}));v.position.y=1,l.add(v);const C=new Zi({map:ug,color:16757594,transparent:!0,opacity:.62,depthWrite:!1,blending:Qe,toneMapped:!1});C.userData.shared=!0;const R=new ys(C);R.position.set(0,1.83,.2),R.scale.set(.46,.26,1),i.add(R);const L=new $t;L.position.y=2.28,L.visible=!1;const I=new Lt(new Fe(1,.11),new ce({color:460812,transparent:!0,opacity:.88,depthWrite:!1,toneMapped:!1})),y=new Lt(new Fe(.92,.065),new ce({color:14109504,depthWrite:!1,toneMapped:!1}));y.position.z=.002,L.add(I,y),i.add(L),i.scale.setScalar(.98+Math.random()*.22);const M={root:i,body:l,legL:c,legR:h,armL:f,armR:p,head:x,hitFlash:v,eyeMat:r,eyeGlow:R,hpBar:L,hpFill:y,style:T,phase:Math.random()*10};return i.userData=M,M}function Pa(i,t,e,n="walk"){const s=Math.min(1.4,e),r=t*(7.2+s)+i.phase,a=Math.sin(r)*.58*s;i.legL.rotation.x=a,i.legR.rotation.x=-a,i.body.position.y=Math.abs(Math.sin(r))*.045*s,i.body.rotation.z=Math.sin(r)*.055*s,i.armL.rotation.x=-1.1+Math.sin(r+.4)*.17,i.armR.rotation.x=-1.02+Math.sin(r+1.4)*.2,i.armL.rotation.z=.12,i.armR.rotation.z=-.1,i.head.rotation.z=Math.sin(r*.7)*.11,i.head.rotation.y=Math.sin(r*.4)*.1,i.eyeGlow&&(i.eyeGlow.material.opacity=.5+Math.sin(t*3.4+i.phase)*.16),n==="attack"?(i.armL.rotation.x=-1.5+Math.sin(t*9)*.6,i.armR.rotation.x=-1.4+Math.sin(t*9+2)*.55,i.body.rotation.x=.18+Math.sin(t*9)*.07):i.body.rotation.x=.03,i.hitFlash.material.opacity>0&&(i.hitFlash.material.opacity=Math.max(0,i.hitFlash.material.opacity-.13))}function gg(i){i.hitFlash.material.opacity=.22}const $n=520;class La{constructor(t,{size:e=.09,additive:n=!0,opacity:s=.9,gravity:r=9}={}){this.scene=t,this.gravity=r,this.pos=new Float32Array($n*3),this.col=new Float32Array($n*3),this.vel=new Float32Array($n*3),this.life=new Float32Array($n),this.max=new Float32Array($n),this.cursor=0;for(let l=0;l<$n;l++)this.pos[l*3+1]=-999;const a=new ye;a.setAttribute("position",new tn(this.pos,3)),a.setAttribute("color",new tn(this.col,3));const o=new Ur({size:e,vertexColors:!0,transparent:!0,opacity:s,depthWrite:!1,blending:n?Qe:yi,sizeAttenuation:!0});this.points=new To(a,o),this.points.frustumCulled=!1,t.add(this.points),this.geo=a}spawn(t,e,n,s=2,r=2,a=.7,o=1){const l=new Zt(e);for(let c=0;c<n;c++){const h=this.cursor;this.cursor=(this.cursor+1)%$n;const d=Math.random()*Math.PI*2,f=Math.random()*s*o;this.pos[h*3]=t.x+(Math.random()-.5)*.25,this.pos[h*3+1]=t.y+(Math.random()-.5)*.25,this.pos[h*3+2]=t.z+(Math.random()-.5)*.25,this.vel[h*3]=Math.cos(d)*f,this.vel[h*3+1]=Math.random()*r+.5,this.vel[h*3+2]=Math.sin(d)*f;const p=l.clone().offsetHSL((Math.random()-.5)*.04,0,(Math.random()-.5)*.25);this.col[h*3]=p.r,this.col[h*3+1]=p.g,this.col[h*3+2]=p.b,this.life[h]=a*(.6+Math.random()*.8),this.max[h]=this.life[h]}this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.color.needsUpdate=!0}update(t){let e=!1;for(let n=0;n<$n;n++)if(!(this.life[n]<=0)){if(this.life[n]-=t,this.life[n]<=0){this.pos[n*3+1]=-999,e=!0;continue}this.vel[n*3+1]-=this.gravity*t,this.pos[n*3]+=this.vel[n*3]*t,this.pos[n*3+1]+=this.vel[n*3+1]*t,this.pos[n*3+2]+=this.vel[n*3+2]*t,this.pos[n*3+1]<.04&&(this.pos[n*3+1]=.04,this.vel[n*3+1]*=-.28,this.vel[n*3]*=.65,this.vel[n*3+2]*=.65),e=!0}e&&(this.geo.attributes.position.needsUpdate=!0)}}class _g{constructor(t){this.scene=t,this.sparks=new La(t,{size:.085,additive:!0,opacity:.95,gravity:7}),this.blood=new La(t,{size:.115,additive:!1,opacity:.9,gravity:12}),this.dust=new La(t,{size:.16,additive:!1,opacity:.34,gravity:1.8}),this.tracers=[],this.shells=[],this.debris=[],this.rings=[],this.lastBlood=0}shot(t,e){const n=new ye().setFromPoints([t.clone(),e.clone()]),s=new Vo({color:16768156,transparent:!0,opacity:.92,blending:Qe,depthWrite:!1,toneMapped:!1}),r=new br(n,s);this.scene.add(r),this.tracers.push({line:r,life:.065,max:.065}),this.sparks.spawn(e,16762223,8,3.2,2.4,.42)}impact(t){this.sparks.spawn(t,16760168,6,2.5,1.6,.32),this.blood.spawn(t,8198938,9,2,1.8,.55)}zombieHit(t){this.blood.spawn(t,9379099,11,2.2,2.2,.62);const e=performance.now();e-this.lastBlood>70&&(this.lastBlood=e,this.blood.spawn(t,4853520,5,1.5,1.4,.45))}zombieDeath(t){this.blood.spawn(t,7542037,26,2.8,2.7,.85),this.blood.spawn(t,3934988,12,1.5,1.3,1.1),this.dust.spawn(t.clone().setY(.18),9272686,9,2.6,.7,.9),this.ring(t.clone().setY(.04),9247512,.45,2.4,.42)}barrierHit(t){this.sparks.spawn(t,16761978,5,2.2,1.2,.3),this.dust.spawn(t,10456693,5,1.5,.8,.5)}breach(t){this.dust.spawn(t.clone().setY(.4),10258802,24,4.5,2.4,1.2),this.sparks.spawn(t.clone().setY(.7),16752973,14,3,2,.5),this.ring(t.clone().setY(.05),11570533,1,4.8,.8)}repair(t){this.sparks.spawn(t,16766339,13,2.4,2.1,.5),this.dust.spawn(t,12099967,6,1.4,.8,.6)}trap(t){this.sparks.spawn(t,16758878,15,3.5,2,.45),this.dust.spawn(t,9074274,5,1.8,.6,.5),this.ring(t.clone().setY(.04),12071463,.5,2.8,.35)}muzzle(t){this.sparks.spawn(t,16765050,4,1.8,.7,.16)}shell(t,e){const n=new vn(.018,.018,.075,6),s=new ce({color:14855509,toneMapped:!1}),r=new Lt(n,s);r.position.copy(t),this.scene.add(r),this.shells.push({mesh:r,life:2.1,vel:new w((Math.random()-.5)*1.5+e.x*.5,2.6+Math.random(),(Math.random()-.5)*1.5+e.z*.5),rot:new w(Math.random()*8,Math.random()*8,Math.random()*8)})}debrisBurst(t){const e=new ks({color:7624252,roughness:.9,flatShading:!0,transparent:!0});for(let n=0;n<14;n++){const s=new Lt(new on(.12+Math.random()*.35,.07+Math.random()*.12,.06+Math.random()*.16),e),r=new w((Math.random()-.5)*6.5,.4+Math.random()*2.1,(Math.random()-.5)*.3);t.localToWorld(r),s.position.copy(r),this.scene.add(s),this.debris.push({mesh:s,life:2.4,vel:new w((Math.random()-.5)*4.5,2.2+Math.random()*3.5,(Math.random()-.5)*4.5),rot:new w(Math.random()*6,Math.random()*6,Math.random()*6)})}}ring(t,e=16755285,n=1,s=.55,r=.5){const a=new ce({color:e,transparent:!0,opacity:r,side:je,depthWrite:!1,blending:Qe}),o=new Lt(new Or(.25,.36,24),a);o.rotation.x=-Math.PI/2,o.position.copy(t),o.scale.setScalar(n*.4),this.scene.add(o),this.rings.push({mesh:o,life:s,max:s,scale:n,opacity:r})}update(t){this.sparks.update(t),this.blood.update(t),this.dust.update(t);for(let e=this.tracers.length-1;e>=0;e--){const n=this.tracers[e];n.life-=t,n.line.material.opacity=Math.max(0,n.life/n.max)*.92,n.life<=0&&(this.scene.remove(n.line),n.line.geometry.dispose(),n.line.material.dispose(),this.tracers.splice(e,1))}for(let e=this.shells.length-1;e>=0;e--){const n=this.shells[e];n.life-=t,n.vel.y-=9.5*t,n.mesh.position.addScaledVector(n.vel,t),n.mesh.rotation.x+=n.rot.x*t,n.mesh.rotation.y+=n.rot.y*t,n.mesh.position.y<.03&&(n.mesh.position.y=.03,n.vel.y*=-.3,n.vel.x*=.7,n.vel.z*=.7),n.life<=0&&(this.scene.remove(n.mesh),n.mesh.geometry.dispose(),n.mesh.material.dispose(),this.shells.splice(e,1))}for(let e=this.debris.length-1;e>=0;e--){const n=this.debris[e];n.life-=t,n.vel.y-=12*t,n.mesh.position.addScaledVector(n.vel,t),n.mesh.rotation.x+=n.rot.x*t,n.mesh.rotation.y+=n.rot.y*t,n.mesh.position.y<.05&&(n.mesh.position.y=.05,n.vel.y*=-.24,n.vel.x*=.72,n.vel.z*=.72,n.rot.multiplyScalar(.75)),n.life<=0&&(n.mesh.material.opacity=Math.max(0,n.life),n.life<-.8&&(this.scene.remove(n.mesh),n.mesh.geometry.dispose(),this.debris.splice(e,1)))}for(let e=this.rings.length-1;e>=0;e--){const n=this.rings[e];n.life-=t;const s=1-n.life/n.max;n.mesh.scale.setScalar(n.scale*(.4+s*1.8)),n.mesh.material.opacity=n.opacity*(1-s),n.life<=0&&(this.scene.remove(n.mesh),n.mesh.geometry.dispose(),n.mesh.material.dispose(),this.rings.splice(e,1))}}clear(){this.tracers.forEach(t=>{this.scene.remove(t.line),t.line.geometry.dispose(),t.line.material.dispose()}),this.tracers=[],this.shells.forEach(t=>{this.scene.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose()}),this.shells=[],this.debris.forEach(t=>{this.scene.remove(t.mesh),t.mesh.geometry.dispose()}),this.debris=[],this.rings.forEach(t=>{this.scene.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose()}),this.rings=[],this.sparks.life.fill(0),this.blood.life.fill(0),this.dust.life.fill(0),this.sparks.pos.fill(-999),this.blood.pos.fill(-999),this.dust.pos.fill(-999),this.sparks.geo.attributes.position.needsUpdate=!0,this.blood.geo.attributes.position.needsUpdate=!0,this.dust.geo.attributes.position.needsUpdate=!0}}const Jn=6,xg=[{count:8,interval:.9,hp:50,speed:1.04,damage:7,title:"THE FIRST KNOCK"},{count:11,interval:.8,hp:62,speed:1.12,damage:8,title:"UNPAID GUESTS"},{count:15,interval:.7,hp:78,speed:1.2,damage:9,title:"THE DINER CROWD"},{count:20,interval:.6,hp:94,speed:1.3,damage:10,title:"FULL HOUSE"},{count:26,interval:.52,hp:112,speed:1.4,damage:12,title:"CHECKOUT TIME"},{count:32,interval:.44,hp:132,speed:1.52,damage:14,title:"LAST CALL"}],dc=[{barrier:0,spawn:new w(1.2,0,-11.6),out:new w(0,0,-1),tangent:new w(1,0,0)},{barrier:1,spawn:new w(-12.1,0,1.2),out:new w(-1,0,0),tangent:new w(0,0,1)},{barrier:2,spawn:new w(12.1,0,.8),out:new w(1,0,0),tangent:new w(0,0,1)}],jn={minX:-7.7,maxX:7.7,minZ:-6.2,maxZ:7.6},vs=(i,t,e)=>Math.max(t,Math.min(e,i)),Qn=(i,t,e,n)=>i+(t-i)*(1-Math.exp(-e*n));function Da(i,t,e,n){let s=((t-i+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;return i+s*(1-Math.exp(-e*n))}const Ms=(i,t)=>Math.hypot(i.x-t.x,i.z-t.z);class vg{constructor({canvas:t,audio:e,ui:n,controls:s}){this.canvas=t,this.audio=e,this.ui=n,this.controls=s,this.mobile=s.isTouch||innerWidth<720,this.phase="menu",this.paused=!1,this.elapsed=0,this.waveIndex=0,this.kills=0,this.score=0,this.scrap=8,this.health=100,this.maxHealth=100,this.shells=8,this.maxShells=8,this.reloadT=0,this.fireCd=0,this.invuln=0,this.hurtT=0,this.lastHurt=0,this.shake=0,this.deathT=0,this.breakT=0,this.waveElapsed=0,this.spawnQueue=[],this.spawned=0,this.waveKills=0,this.zombies=[],this.menuZombies=[],this.traps=[],this.targetZombie=null,this.facing=Math.PI,this.vel=new w,this.camFocus=new w(0,1.1,1),this.camPos=new w(10,9,16),this.introCam=null,this.aimPulse=0,this.beaconTimer=0,this.growlTimer=4,this.emberT=0,this.best=this.loadBest(),this.lastFrame=performance.now(),this.lowFPS=0,this.setupRenderer(),this.setupScene(),this.setupPlayer(),this.effects=new _g(this.scene),this.spawnMenuZombies(),this.bindResize(),this.renderer.setAnimationLoop(r=>this.frame(r))}loadBest(){try{return Number(localStorage.getItem("deadblock-best")||0)||0}catch{return 0}}saveBest(){if(this.score>this.best){this.best=Math.floor(this.score);try{localStorage.setItem("deadblock-best",String(this.best))}catch{}}}setupRenderer(){this.renderer=new Z0({canvas:this.canvas,antialias:!this.mobile,powerPreference:"high-performance",alpha:!1,stencil:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,this.mobile?1.55:2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=pc,this.renderer.toneMapping=Lo,this.renderer.toneMappingExposure=1.2,this.renderer.outputColorSpace=qe,this.renderer.domElement.addEventListener("webglcontextlost",t=>{t.preventDefault(),this.showFatal("The projector jammed. Reload the page to keep the dead at bay.")})}setupScene(){this.scene=new vu,this.scene.background=new Zt(526866),this.camera=new Je(innerHeight>innerWidth?64:innerWidth<900?52:47,innerWidth/innerHeight,.1,160),this.camera.position.copy(this.camPos),this.camera.lookAt(0,2.4,-5),this.world=cg(this.scene,{mobile:this.mobile});const t=this.renderer.getDrawingBufferSize(new ot),e=new an(t.x,t.y,{type:Mn,samples:this.mobile?0:2});this.composer=new tg(this.renderer,e),this.composer.addPass(new eg(this.scene,this.camera)),this.bloom=new rs(new ot(innerWidth,innerHeight),this.mobile?.52:.72,.72,.58),this.composer.addPass(this.bloom),this.composer.addPass(new ig),this.world.update(0,0)}setupPlayer(){this.player=dg(),this.player.root.scale.setScalar(1.08),this.scene.add(this.player.root),this.playerPos=new w(0,0,2.4),this.player.root.position.copy(this.playerPos),this.player.root.rotation.y=Math.PI,this.player.root.visible=!1,this.tmpA=new w,this.tmpB=new w,this.playerLight=new $e(16757375,5.8,6.8,2),this.playerLight.position.set(0,3.1,1),this.scene.add(this.playerLight)}spawnMenuZombies(){const t=[[.6,-10.6,.05],[-11.4,1.8,1.3],[11.5,1.4,-1.1],[-10.9,-3.9,2.1],[11.1,-4.4,-2.4]];for(const[e,n,s]of t){const r=uc();r.root.position.set(e,0,n),r.root.rotation.y=s,r.root.scale.multiplyScalar(1.02),r.phase=Math.random()*10,r.menuT=Math.random()*5,r.menuBase=new w(e,0,n),this.scene.add(r.root),this.menuZombies.push(r)}}clearMenuZombies(){this.menuZombies.forEach(t=>{this.scene.remove(t.root),this.disposeObject(t.root)}),this.menuZombies=[]}start(){this.audio.init().then(()=>{this.audio.startMusic()}),this.clearMenuZombies(),this.resetGameData(),this.ui.hideStart(),this.ui.showHud(),this.ui.reset(),this.player.root.visible=!0,this.playerPos.set(0,0,2.4),this.player.root.position.copy(this.playerPos),this.facing=Math.PI,this.camFocus.set(0,1.1,1),this.introCam={t:0},this.phase="wave",this.controls.setEnabled(!0),this.startWave(0),this.ui.toast("WAVE 1 — THE FIRST KNOCK"),this.ui.objectiveSet("HOLD THE COURTYARD","Survive six waves until dawn"),setTimeout(()=>this.ui.fadeObjective(),6500),this.audio.horn()}resetGameData(){this.phase="menu",this.paused=!1,this.elapsed=0,this.waveIndex=0,this.kills=0,this.score=0,this.scrap=8,this.health=100,this.maxHealth=100,this.shells=8,this.reloadT=0,this.fireCd=0,this.invuln=0,this.hurtT=0,this.lastHurt=0,this.shake=0,this.deathT=0,this.breakT=0,this.waveElapsed=0,this.spawnQueue=[],this.spawned=0,this.waveKills=0,this.targetZombie=null,this.vel.set(0,0,0),this.zombies.forEach(t=>{this.scene.remove(t.root),this.disposeObject(t.root)}),this.zombies=[],this.traps.forEach(t=>this.scene.remove(t.group)),this.traps=[],this.effects.clear();for(const t of this.world.barriers)t.hp=t.maxHp,t.destroyed=!1,t.shake=0,t.planks.forEach(e=>e.visible=!0),t.group.position.y=0,t.group.rotation.z=0;for(const t of this.menuZombies)this.scene.remove(t.root),this.disposeObject(t.root);this.menuZombies=[],this.player.recoil=0,this.player.flashMat.opacity=0,this.player.root.rotation.set(0,Math.PI,0),this.player.root.visible=!1,this.ui.hideEnd(),this.ui.hideBreak(),this.ui.showPause(!1),this.ui.setHealth(100,100),this.ui.setAmmo(8,8,!1),this.ui.setScore(0),this.ui.setScrap(8),this.ui.setBarriers(this.world.barriers),this.ui.showTarget(null,this.camera,!1)}startWave(t){this.waveIndex=t,this.waveConfig=xg[t],this.waveElapsed=0,this.waveKills=0,this.spawned=0,this.phase="wave",this.breakT=0,this.spawnQueue=[];const e=this.waveConfig.count;let n=.15;for(let s=0;s<e;s++){const r=t>=2&&s>3&&Math.random()<.075,a=!r&&Math.random()<.16,o=(s%3+t%3)%3;this.spawnQueue.push({t:n,brute:r,runner:a,lane:o}),n+=this.waveConfig.interval*(r?1.7:a?.72:1)*(this.mobile?1.12:1)}this.ui.hideBreak(),this.ui.setWave(t,Jn,"wave"),this.ui.setWaveProgress(0),this.ui.setBarriers(this.world.barriers),this.ui.objectiveSet(`WAVE ${t+1} — ${this.waveConfig.title}`,t===Jn-1?"Last call. Make it count.":"Defend all three barricades"),setTimeout(()=>this.ui.fadeObjective(),4200),t>0&&(this.audio.horn(),this.ui.toast(`WAVE ${t+1} — ${this.waveConfig.title}`,t===Jn-1?"bad":""))}completeWave(){this.phase="break",this.breakT=8.5;const t=6;this.scrap=Math.min(99,this.scrap+t),this.score+=700+this.waveIndex*350,this.health=Math.min(this.maxHealth,this.health+26),this.shells=this.maxShells,this.reloadT=0;for(const e of this.world.barriers)e.destroyed=!1,e.hp=Math.min(e.maxHp,Math.max(e.hp,e.maxHp*.62)+100),e.planks.forEach(n=>n.visible=!0),e.group.position.y=0,e.group.rotation.z=0;this.ui.setScrap(this.scrap),this.ui.setScore(this.score),this.ui.setHealth(this.health,this.maxHealth),this.ui.setAmmo(this.shells,this.maxShells,!1),this.ui.setBarriers(this.world.barriers),this.ui.setWave(this.waveIndex,Jn,"break"),this.ui.setWaveProgress(1),this.ui.showClear(t),this.ui.showBreak(this.breakT),this.ui.toast("LINE HELD — SUPPLIES DELIVERED","good"),this.audio.levelUp(),this.audio.stopMusic(),this.waveIndex>=Jn-1&&setTimeout(()=>this.victory(),1600)}nextWave(){this.ui.hideBreak(),this.audio.startMusic(),this.ui.setWaveProgress(0),this.startWave(this.waveIndex+1)}victory(){this.phase!=="victory"&&(this.phase="victory",this.controls.setEnabled(!1),this.saveBest(),this.score+=5e3+this.health*20,this.ui.setScore(this.score),this.ui.setWave(Jn-1,Jn,"victory"),this.ui.setWaveProgress(1),this.audio.victory(),setTimeout(()=>{this.ui.showEnd({victory:!0,waves:Jn,kills:this.kills,score:Math.floor(this.score),best:this.best})},1500))}die(){this.phase!=="dead"&&(this.phase="dead",this.deathT=0,this.controls.setEnabled(!1),this.saveBest(),this.audio.death(),this.audio.stopMusic(),this.shake=1.2,setTimeout(()=>{this.ui.showEnd({victory:!1,waves:this.waveIndex+(this.phase==="wave"?0:1),kills:this.kills,score:Math.floor(this.score),best:this.best})},1800))}retry(){this.ui.hideEnd(),this.ui.showPause(!1),this.ui.reset(),this.phase="menu",this.paused=!1,this.start()}quit(){this.audio.stopMusic(),this.resetGameData(),this.controls.setEnabled(!1),this.ui.showStart(),this.ui.showPause(!1),this.ui.setPlaying(!1),this.phase="menu",this.player.root.visible=!1,this.spawnMenuZombies(),this.camPos.set(10,9,16),this.camFocus.set(0,1.1,1)}pause(){!["wave","break"].includes(this.phase)||this.paused||(this.paused=!0,this.controls.setEnabled(!1),this.ui.showPause(!0),this.audio.stopMusic())}resume(){this.paused&&(this.paused=!1,this.controls.setEnabled(!0),this.ui.showPause(!1),this.phase==="wave"&&this.audio.startMusic())}togglePause(){this.paused?this.resume():["wave","break"].includes(this.phase)&&this.pause()}bindResize(){this.onResize=()=>{if(!this.renderer)return;const t=innerWidth,e=innerHeight;this.mobile=this.controls.isTouch||t<720,this.camera.aspect=t/e,this.camera.fov=e>t?64:t<900?52:47,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e),this.composer.setSize(t,e),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,this.mobile?1.55:2)),this.bloom.strength=this.mobile?.52:.72},window.addEventListener("resize",this.onResize),window.addEventListener("orientationchange",()=>setTimeout(this.onResize,160))}showFatal(t){const e=document.getElementById("fatal");e.textContent=t,e.classList.remove("hidden")}frame(t){const e=Math.min(.05,Math.max(.001,(t-this.lastFrame)/1e3));this.lastFrame=t,this.paused||this.update(e),this.composer.render(),this.adaptQuality(e)}adaptQuality(t){const e=innerWidth<innerHeight;this.bloom&&(this.bloom.strength=this.mobile?e?.32:.38:.52)}update(t){this.elapsed+=t,this.phase==="menu"?this.updateMenu(t):this.updateGame(t),this.world.update(this.elapsed,t),this.effects.update(t),this.updateCamera(t),this.audio.update(this.zombies.length/16),this.ui.setBarriers(this.world.barriers),this.phase!=="menu"&&(this.emberT-=t,this.emberT<=0&&(this.emberT=.09+Math.random()*.14,this.effects.sparks.spawn(new w(-5.2+(Math.random()-.5)*.45,1.55,4.6+(Math.random()-.5)*.45),16743733,1,.65,1.9,.85)))}updateMenu(t){this.camPos.set(10.6+Math.sin(this.elapsed*.05)*1.1,8.4+Math.sin(this.elapsed*.09)*.35,16.4+Math.cos(this.elapsed*.04)*.8),this.camFocus.set(-.4,2.6,-4.6);for(const e of this.menuZombies){e.menuT+=t;const n=Math.sin(this.elapsed*.7+e.phase)*.4;e.root.position.x=e.menuBase.x+Math.sin(this.elapsed*.28+e.phase)*.45,e.root.position.z=e.menuBase.z+n,e.root.rotation.y+=Math.sin(this.elapsed*.16+e.phase)*t*.1,Pa(e,this.elapsed,.25,"walk")}this.player.root.visible=!1,this.ui.showTarget(null,this.camera,!1)}updateGame(t){if(this.fireCd=Math.max(0,this.fireCd-t),this.invuln=Math.max(0,this.invuln-t),this.hurtT=Math.max(0,this.hurtT-t),this.aimPulse+=t,this.growlTimer-=t,(this.phase==="wave"||this.phase==="break"||this.phase==="victory")&&this.updatePlayer(t),this.phase==="wave"?this.updateWave(t):this.phase==="break"?(this.breakT-=t,this.ui.updateBreak(this.breakT),this.breakT<=0&&this.nextWave()):this.phase==="dead"&&this.updateDeath(t),this.updateZombies(t),this.updateTraps(t),this.updateTarget(),this.ui.setHealth(this.health,this.maxHealth,this.hurtT>0),this.ui.setAmmo(this.shells,this.maxShells,this.reloadT>0),this.ui.setScore(Math.floor(this.score)),this.ui.setScrap(this.scrap),this.updateReload(t),this.updateHealthRegen(t),this.phase==="wave"){const e=this.waveConfig.count?this.waveKills/this.waveConfig.count:0;this.ui.setWaveProgress(e)}this.ui.setRepairReady(this.nearestBarrier()!==null),this.growlTimer<=0&&this.zombies.length&&(this.growlTimer=di(3.5,7.5),this.audio.growl())}updatePlayer(t){const n=this.phase==="wave"||this.phase==="break"?this.controls.movement():{x:0,z:0,len:0},s=this.controls.firing?4.1:5.15,r=n.x*s,a=n.z*s;this.vel.x=Qn(this.vel.x,r,13,t),this.vel.z=Qn(this.vel.z,a,13,t),this.playerPos.x=vs(this.playerPos.x+this.vel.x*t,jn.minX,jn.maxX),this.playerPos.z=vs(this.playerPos.z+this.vel.z*t,jn.minZ,jn.maxZ),this.player.root.position.copy(this.playerPos),this.playerPos.y=0;const o=Math.hypot(this.vel.x,this.vel.z),l=this.findTarget();if(this.targetZombie=l,this.controls.firing&&l){const c=l.root.position.x-this.playerPos.x,h=l.root.position.z-this.playerPos.z;this.facing=Da(this.facing,Math.atan2(c,h),18,t)}else n.len>.06&&(this.facing=Da(this.facing,Math.atan2(n.x,n.z),13,t));this.player.root.rotation.y=this.facing,this.player.root.position.y=Math.sin(this.elapsed*19)*.012*Math.min(1,o),fg(this.player,this.elapsed,Math.min(1,o/4.6),t),mg(this.player,t),this.controls.firing&&this.fireCd<=0&&this.reloadT<=0&&this.shoot(),this.ui.showTarget(l?this.tmpA.copy(l.root.position).setY(l.root.position.y+1.75):null,this.camera,!!l),this.updateNearBarrier()}updateNearBarrier(){const t=this.nearestBarrier();this.ui.setRepairReady(t!==null&&t.hp<t.maxHp&&this.scrap>=2)}nearestBarrier(){let t=null,e=3.6;for(const n of this.world.barriers){const s=Ms(n.pos,this.playerPos);s<e&&(t=n,e=s)}return t}updateReload(t){this.reloadT>0&&(this.reloadT-=t,this.reloadT<=0&&(this.reloadT=0,this.shells=this.maxShells,this.audio.reloadDone(),this.ui.setAmmo(this.shells,this.maxShells,!1)))}updateHealthRegen(t){this.phase!=="wave"&&this.phase!=="break"||this.elapsed-this.lastHurt>5.5&&this.health<this.maxHealth&&(this.health=Math.min(this.maxHealth,this.health+t*3.4))}startReload(){this.reloadT>0||this.shells>=this.maxShells||(this.reloadT=1.32,this.audio.reload(),this.ui.setAmmo(this.shells,this.maxShells,!0))}shoot(){if(!["wave","break"].includes(this.phase)||this.reloadT>0)return;if(this.shells<=0){this.audio.empty(),this.startReload();return}this.shells--,this.fireCd=.46,pg(this.player),this.audio.shot(),this.shake=Math.max(this.shake,.23);const t=this.player.muzzle.getWorldPosition(new w);this.effects.muzzle(t);const e=new w(Math.sin(this.facing),0,Math.cos(this.facing));this.effects.shell(t.clone().add(new w(.1,-.02,-.1)),e);const n=this.findTarget();if(n){const s=this.tmpB.copy(n.root.position).setY(n.root.position.y+.9+Math.random()*.65);s.x+=(Math.random()-.5)*.35,s.z+=(Math.random()-.5)*.35;const r=Math.random()<.17,a=62+this.waveIndex*8,o=Math.round(a*(r?1.7:1)*(.92+Math.random()*.16));this.damageZombie(n,o,r,s);for(const l of this.zombies)l===n||l.dying||Ms(l.root.position,n.root.position)<2.05&&this.damageZombie(l,Math.round(a*.24),!1,this.tmpA.copy(l.root.position).setY(l.root.position.y+1));this.effects.shot(t,s),this.effects.impact(s),this.ui.hitPulse(r)}else{const s=this.playerPos.clone().addScaledVector(e,10).setY(1.1);this.effects.shot(t,s)}this.ui.setAmmo(this.shells,this.maxShells,!1),this.shells<=0&&this.startReload()}findTarget(){let t=null,e=15.5;for(const n of this.zombies){if(n.dying||n.hp<=0)continue;const s=Ms(n.root.position,this.playerPos);if(s>=e)continue;const r=this.tmpB.copy(n.root.position).setY(1.2).project(this.camera);r.z>1||Math.abs(r.x)>1.08||r.y<-1||r.y>.95||(e=s,t=n)}return t}damageZombie(t,e,n,s){t.dying||(t.hp-=e,gg(t),this.score+=e*(n?2.2:1.2),this.ui.floatText(s,this.camera,n?`${e}!`:`${e}`,n?"crit":""),this.effects.zombieHit(s),Math.random()<.28&&this.audio.hit(),t.hp<=0&&this.killZombie(t,n))}killZombie(t,e){if(t.dying)return;t.dying=!0,t.deathT=0,t.deathRoll=(Math.random()-.5)*.45,t.hpBar&&(t.hpBar.visible=!1),this.kills++,this.waveKills++;const n=1+(Math.random()<.16?1:0);this.scrap=Math.min(99,this.scrap+n),this.score+=110+this.waveIndex*22+(e?75:0),this.effects.zombieDeath(t.root.position.clone().setY(1)),this.audio.splat(),Math.random()<.17&&this.ui.floatText(t.root.position.clone().setY(2.1),this.camera,`+${n} ✦`,"kill"),this.targetZombie===t&&(this.targetZombie=null)}updateWave(t){this.waveElapsed+=t;const e=this.mobile?13:19;for(;this.spawnQueue.length&&this.spawnQueue[0].t<=this.waveElapsed&&!(this.zombies.filter(s=>!s.dying).length>=e);){const n=this.spawnQueue.shift();this.spawnZombie(n.lane,n.brute,n.runner)}!this.spawnQueue.length&&this.zombies.every(n=>n.dying)&&this.completeWave()}spawnZombie(t,e=!1,n=!1){const s=uc(),r=dc[t],a=r.tangent,o=r.spawn.clone();o.x+=a.x*di(-1.5,1.5),o.z+=a.z*di(-1.5,1.5),s.root.position.copy(o);const l=this.waveConfig;let c=l.speed*di(.86,1.12)*(this.mobile?.92:1),h=l.hp*di(.84,1.16),d=di(1.06,1.22);n&&(c*=1.58,h*=.68,d*=.94),e&&(c*=.7,h*=2.2,d*=1.28),s.root.scale.setScalar(d),s.hp=h,s.maxHp=h,s.speed=c,s.damage=l.damage*(e?1.45:n?.8:1),s.isBrute=e,s.lane=t,s.offset=di(-2.45,2.45),s.phase=Math.random()*10,s.attackT=0,s.stun=0,s.dying=!1,s.state="walk",n&&s.root.traverse(f=>{f.material&&f.material.color&&f.material.type==="MeshStandardMaterial"&&f.material.emissive?.setHex(2228224)}),s.root.rotation.y=Math.atan2(this.playerPos.x-o.x,this.playerPos.z-o.z),this.scene.add(s.root),this.zombies.push(s),this.effects.dust.spawn(o.clone().setY(.2),10256999,5,1.7,.4,.6)}updateZombies(t){const e=this.zombies.filter(n=>!n.dying);for(const n of this.zombies){if(n.dying){n.deathT+=t;const u=Math.min(1,n.deathT/.55);n.root.rotation.x=-u*Math.PI*.48,n.root.rotation.z+=n.deathRoll*t,n.deathT>1.35&&(n.root.position.y-=t*1.1),n.deathT>2.2&&(n.remove=!0);continue}if(n.attackT=Math.max(0,n.attackT-t),n.stun>0){n.stun-=t,Pa(n,this.elapsed,.12,"walk");continue}const s=this.world.barriers[n.lane],r=s.destroyed||s.hp<=0;let a,o,l=!1;if(r)a=this.playerPos.x,o=this.playerPos.z;else{const u=dc[n.lane];a=s.pos.x+u.out.x*.58+u.tangent.x*n.offset,o=s.pos.z+u.out.z*.58+u.tangent.z*n.offset,l=!0}let c=a-n.root.position.x,h=o-n.root.position.z,d=Math.hypot(c,h),f=0,p=0;for(const u of e){if(u===n)continue;const T=n.root.position.x-u.root.position.x,E=n.root.position.z-u.root.position.z,v=Math.hypot(T,E);v>.001&&v<1.02&&(f+=T/v*(1.02-v)*2.2,p+=E/v*(1.02-v)*2.2)}const g=Ms(n.root.position,this.playerPos);if(g<.78&&!l){const u=(.78-g)*3;f+=(n.root.position.x-this.playerPos.x)*u,p+=(n.root.position.z-this.playerPos.z)*u}const x=l&&d<.72,m=!l&&d<1.18;if(x)n.state="attack",n.attackT<=0&&(n.attackT=1.05,this.hitBarrier(s,n));else if(m)n.state="attack",n.attackT<=0&&(n.attackT=1,this.hurtPlayer(n.damage));else if(n.state="walk",d>.01){const u=c/d,T=h/d,E=n.speed*(n===this.targetZombie?.94:1);n.root.position.x+=(u*E+f)*t,n.root.position.z+=(T*E+p)*t}if(n.root.rotation.y=Da(n.root.rotation.y,Math.atan2(a-n.root.position.x,o-n.root.position.z),7,t),Pa(n,this.elapsed,n.speed,n.state),n.hpBar){const u=vs(n.hp/n.maxHp,0,1),T=n.isBrute||u<.999;n.hpBar.visible=T,T&&(n.hpBar.lookAt(this.camera.position),n.hpFill.scale.x=Math.max(.001,u),n.hpFill.position.x=-(.92*(1-u))/2,n.hpFill.material.color.setHex(u>.55?10211439:u>.25?15902523:14109504))}}for(let n=this.zombies.length-1;n>=0;n--)this.zombies[n].remove&&(this.scene.remove(this.zombies[n].root),this.disposeObject(this.zombies[n].root),this.zombies.splice(n,1))}hitBarrier(t,e){if(t.destroyed)return;t.hp-=e.damage*1.6,t.shake=1;const n=t.group.position.clone().add(new w((Math.random()-.5)*4,.8+Math.random()*1.2,(Math.random()-.5)*.4));this.effects.barrierHit(n),Math.random()<.65&&this.audio.hit(),t.hp<=0&&(t.hp=0,t.destroyed=!0,t.planks.forEach(s=>s.visible=!1),this.effects.debrisBurst(t.group),this.effects.breach(t.pos.clone().setY(.5)),this.shake=Math.max(this.shake,.75),this.audio.trap(),this.ui.toast(`${t.label} BARRICADE BREACHED`,"bad"),this.ui.setBarriers(this.world.barriers))}hurtPlayer(t){this.phase!=="wave"||this.invuln>0||(this.health-=t,this.invuln=.42,this.hurtT=.5,this.lastHurt=this.elapsed,this.shake=Math.max(this.shake,.35),this.ui.damage(),this.audio.hurt(),navigator.vibrate&&navigator.vibrate(24),this.health<=0&&(this.health=0,this.die()))}updateTraps(t){for(const e of this.traps){if(e.pulse+=t,e.jaw.rotation.z=Math.sin(e.pulse*2.8)*.04,e.glow.material.opacity=.2+Math.sin(e.pulse*4)*.08,e.dead){e.deadT+=t,e.group.scale.setScalar(Math.max(.01,1-e.deadT*2.5)),e.deadT>.35&&(e.remove=!0);continue}for(const n of this.zombies)if(!(n.dying||n.stun>0)&&Ms(n.root.position,e.group.position)<.8){this.damageZombie(n,58+this.waveIndex*7,!1,n.root.position.clone().setY(1)),n.stun=2.9,n.attackT=.8,e.dead=!0,e.deadT=0,this.effects.trap(e.group.position.clone().setY(.5)),this.audio.trap(),this.shake=Math.max(this.shake,.18),this.ui.toast("TRAP SPRUNG","good");break}}for(let e=this.traps.length-1;e>=0;e--)this.traps[e].remove&&(this.scene.remove(this.traps[e].group),this.traps.splice(e,1))}updateDeath(t){this.deathT+=t,this.camFocus.lerp(new w(this.playerPos.x,.4,this.playerPos.z),1-Math.exp(-2*t)),this.player.root.rotation.z=Math.min(1.2,this.player.root.rotation.z+t*1.4),this.player.root.position.y=Math.max(-.25,this.player.root.position.y-t*.18)}updateTarget(){if(this.phase==="wave"||this.phase==="break"){const t=this.findTarget();this.targetZombie=t,t?this.ui.showTarget(this.tmpA.copy(t.root.position).setY(t.root.position.y+1.75),this.camera,!0):this.ui.showTarget(null,this.camera,!1)}else this.ui.showTarget(null,this.camera,!1)}useRepair(){if(!["wave","break"].includes(this.phase))return;const t=this.nearestBarrier();if(!t){this.ui.toast("MOVE TO A BARRICADE","bad");return}if(this.scrap<2){this.ui.toast("NEED 2 SCRAP","bad");return}if(t.destroyed){this.scrap-=2,t.destroyed=!1,t.hp=t.maxHp*.35,t.shake=.4,t.group.position.y=0,t.group.rotation.z=0,t.planks.forEach(s=>s.visible=!0),this.score+=60;const n=t.pos.clone().add(new w(0,1.1,0));this.effects.repair(n),this.audio.repair(),this.ui.toast("BARRICADE REBUILT","good"),this.ui.setScrap(this.scrap),this.ui.setBarriers(this.world.barriers);return}if(t.hp>=t.maxHp){this.ui.toast("BARRICADE IS SOLID","bad");return}this.scrap-=2,t.hp=Math.min(t.maxHp,t.hp+130),t.shake=.35,this.score+=35;const e=t.pos.clone().add(new w(0,1.4,0));this.effects.repair(e),this.audio.repair(),this.ui.toast("BARRICADE PATCHED","good"),this.ui.setScrap(this.scrap),this.ui.setBarriers(this.world.barriers)}useTrap(){if(!["wave","break"].includes(this.phase))return;if(this.traps.filter(l=>!l.dead).length>=5){this.ui.toast("FIVE TRAPS MAX","bad");return}if(this.scrap<3){this.ui.toast("NEED 3 SCRAP","bad");return}this.scrap-=3;const t=new w(Math.sin(this.facing),0,Math.cos(this.facing)),e=this.playerPos.clone().addScaledVector(t,.7);e.x=vs(e.x,jn.minX+.2,jn.maxX-.2),e.z=vs(e.z,jn.minZ+.2,jn.maxZ-.2);const n=new $t;n.position.copy(e),n.rotation.y=this.facing;const s=new ks({color:6251620,roughness:.4,metalness:.7,flatShading:!0}),r=new Lt(new vn(.47,.5,.06,10),s);r.position.y=.04,r.receiveShadow=!0,n.add(r);const a=new $t;for(const l of[-1,1]){const c=new Lt(new ji(.34,.055,5,9,Math.PI),s);c.rotation.x=-Math.PI/2,c.rotation.z=l>0?0:Math.PI,c.position.set(0,.1,0),a.add(c);for(let h=0;h<4;h++){const d=new Lt(new kn(.045,.18,4),s),f=h/3*Math.PI;d.position.set(Math.cos(f)*.34*l,.2,Math.sin(f)*.34),d.rotation.x=Math.PI,a.add(d)}}n.add(a);const o=new Lt(new Or(.58,.7,20),new ce({color:16735038,transparent:!0,opacity:.22,side:je,depthWrite:!1,blending:Qe}));o.rotation.x=-Math.PI/2,o.position.y=.05,n.add(o),this.scene.add(n),this.traps.push({group:n,jaw:a,glow:o,pulse:0,dead:!1,deadT:0}),this.effects.dust.spawn(e.clone().setY(.2),9338217,6,1.4,.5,.45),this.audio.build(),this.ui.toast("BEAR TRAP SET","good"),this.ui.setScrap(this.scrap)}updateCamera(t){if(this.phase==="menu"){this.camera.position.lerp(this.camPos,1-Math.exp(-3*t));const f=this.tmpA.copy(this.camFocus);this.camera.lookAt(f);return}const e=innerHeight>innerWidth,n=innerWidth<900,s=e?64:n?52:47;Math.abs(this.camera.fov-s)>.01&&(this.camera.fov=s,this.camera.updateProjectionMatrix());let r=0,a=e?14.8:n?12:12.1,o=e?15.4:n?15.2:15.8;const l=this.tmpA.copy(this.playerPos);l.y=1.25,l.x+=this.vel.x*.14,l.z+=this.vel.z*.12-(e?2.35:1.35),this.camFocus.lerp(l,1-Math.exp(-5.4*t)),this.playerLight.position.set(this.playerPos.x,3.1,this.playerPos.z+.6);let c=this.camFocus.x+r,h=a,d=this.camFocus.z+o;if(this.phase==="dead"){const f=Math.min(1,this.deathT/3);h=a+f*5,d=this.camFocus.z+o+f*3.5}if(this.introCam){this.introCam.t+=t;const f=Math.min(1,this.introCam.t/.95),p=1-Math.pow(1-f,3);this.camera.position.x=Qn(this.camera.position.x,this.camPos.x+(c-this.camPos.x)*p,6,t),this.camera.position.y=Qn(this.camera.position.y,this.camPos.y+(h-this.camPos.y)*p,6,t),this.camera.position.z=Qn(this.camera.position.z,this.camPos.z+(d-this.camPos.z)*p,6,t),f>=1&&(this.introCam=null)}else this.camera.position.x=Qn(this.camera.position.x,c,4.5,t),this.camera.position.y=Qn(this.camera.position.y,h,4.5,t),this.camera.position.z=Qn(this.camera.position.z,d,4.5,t);if(this.shake>0){const f=this.shake;this.camera.position.x+=(Math.random()-.5)*f,this.camera.position.y+=(Math.random()-.5)*f*.7,this.camera.position.z+=(Math.random()-.5)*f,this.shake=Math.max(0,this.shake-t*2.1)}this.camera.lookAt(this.camFocus.x,this.camFocus.y+.15,this.camFocus.z-.4),this.phase==="dead"&&(this.camera.rotation.z+=Math.min(.08,this.deathT*.02))}disposeObject(t){const e=new Set,n=new Set;t.traverse(s=>{s.geometry&&!s.isSprite&&e.add(s.geometry),s.material&&(Array.isArray(s.material)?s.material.forEach(r=>n.add(r)):n.add(s.material))}),e.forEach(s=>s.dispose()),n.forEach(s=>{s.map&&!s.userData?.shared&&s.map.dispose(),s.dispose()})}}function di(i,t){return i+Math.random()*(t-i)}const fi=new dh,pi=new ch;let Ne=null;function Ia(){try{const i=new fh({onStart:()=>{!Ne||!["menu"].includes(Ne.phase)||(pi.init().catch(()=>{}),Ne.start())},onResume:()=>Ne?.resume(),onPause:()=>Ne?.togglePause(),onQuit:()=>Ne?.quit(),onRetry:()=>Ne?.retry(),onMute:()=>{pi.init().catch(()=>{}),pi.setMuted(!pi.muted),fi.setMuted(pi.muted)},onAction:n=>{Ne&&(n==="repair"&&Ne.useRepair(),n==="trap"&&Ne.useTrap(),n==="reload"&&Ne.startReload())},onHidden:()=>{Ne&&!Ne.paused&&["wave","break"].includes(Ne.phase)&&Ne.pause()}});Ne=new vg({canvas:document.getElementById("game"),audio:pi,ui:fi,controls:i}),window.__deadBlock=Ne,fi.setMuted(!1),fi.showStart(),fi.showPause(!1),fi.hideEnd(),fi.setPlaying(!1);const t=()=>document.body.classList.toggle("is-portrait",innerHeight>innerWidth);t(),window.addEventListener("resize",t),window.addEventListener("orientationchange",()=>setTimeout(t,120));const e=()=>{pi.init().catch(()=>{}),window.removeEventListener("pointerdown",e)};window.addEventListener("pointerdown",e,{passive:!0}),document.body.classList.add("ready")}catch(i){console.error(i);const t=document.getElementById("fatal");t.textContent=`The projector failed to start. ${i.message}`,t.classList.remove("hidden")}}document.fonts&&document.fonts.ready?document.fonts.ready.then(Ia).catch(Ia):Ia();
