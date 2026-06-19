/* ============================================================
   VFX ইঞ্জিন — ক্যানভাস পার্টিকেল (বিস্ফোরণ, কনফেটি, স্পার্কল, শেক)
   শুধু ব্রাউজারে চলে • কোনো লাইব্রেরি লাগে না
   ============================================================ */
const FX = (function(){
  let canvas=null, ctx=null, parts=[], raf=null, shakeT=0, shakeMag=0;

  function ensure(){
    if(ctx) return;
    canvas=document.getElementById('fx-canvas');
    if(!canvas) return;
    ctx=canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }
  function resize(){
    if(!canvas) return;
    const dpr=Math.min(window.devicePixelRatio||1, 2);
    canvas.width=Math.floor(innerWidth*dpr);
    canvas.height=Math.floor(innerHeight*dpr);
    canvas.style.width=innerWidth+'px';
    canvas.style.height=innerHeight+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function rand(a,b){ return a+Math.random()*(b-a); }

  function loop(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for(let i=parts.length-1;i>=0;i--){
      const p=parts[i];
      p.vy+=p.g; p.vx*=p.drag; p.x+=p.vx; p.y+=p.vy; p.life--; p.rot+=p.vr;
      if(p.life<=0){ parts.splice(i,1); continue; }
      const a=Math.max(0,Math.min(1, p.life/p.fade));
      ctx.save(); ctx.globalAlpha=a; ctx.translate(p.x,p.y); ctx.rotate(p.rot);
      if(p.shape==='rect'){ ctx.fillStyle=p.color; ctx.fillRect(-p.s/2,-p.s*0.35,p.s,p.s*0.7); }
      else if(p.shape==='emoji'){ ctx.font=`${p.s}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(p.char,0,0); }
      else { ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(0,0,p.s,0,Math.PI*2); ctx.fill(); }
      ctx.restore();
    }
    const app=document.getElementById('app');
    if(shakeT>0){
      shakeT--; const m=shakeMag*(shakeT/14);
      if(app) app.style.transform=`translate(${rand(-m,m)}px,${rand(-m,m)}px)`;
      if(shakeT===0 && app) app.style.transform='';
    }
    if(parts.length>0 || shakeT>0){ raf=requestAnimationFrame(loop); }
    else { raf=null; ctx.clearRect(0,0,innerWidth,innerHeight); }
  }
  function start(){ ensure(); if(ctx && !raf) raf=requestAnimationFrame(loop); }

  function explosion(x,y){
    ensure(); if(!ctx) return;
    x = x ?? innerWidth/2; y = y ?? innerHeight/2;
    const colors=['#ff4d2e','#ff8c1a','#ffd23f','#fff1c1','#e8453c'];
    // ফ্ল্যাশ
    parts.push({x,y,vx:0,vy:0,g:0,drag:1,s:90,life:8,fade:8,rot:0,vr:0,shape:'circle',color:'#fff7e6'});
    // ধ্বংসাবশেষ
    for(let i=0;i<46;i++){
      const ang=rand(0,Math.PI*2), sp=rand(2,11);
      parts.push({ x,y, vx:Math.cos(ang)*sp, vy:Math.sin(ang)*sp-2, g:0.18, drag:0.98,
        s:rand(3,8), life:rand(28,60), fade:40, rot:rand(0,6), vr:rand(-0.3,0.3),
        shape:'circle', color:colors[(Math.random()*colors.length)|0] });
    }
    // ইমোজি পাফ
    ['💥','🔥','💢','🐱'].forEach((ch,k)=>{
      for(let j=0;j<3;j++){
        const ang=rand(0,Math.PI*2), sp=rand(1.5,6);
        parts.push({ x,y, vx:Math.cos(ang)*sp, vy:Math.sin(ang)*sp-3, g:0.16, drag:0.98,
          s:rand(20,34), life:rand(30,55), fade:45, rot:rand(-0.4,0.4), vr:rand(-0.15,0.15),
          shape:'emoji', char:ch });
      }
    });
    shakeMag=14; shakeT=14; start();
  }

  function confetti(){
    ensure(); if(!ctx) return;
    const colors=['#0a8f54','#e8453c','#f4b740','#3b82f6','#9b59b6','#ffffff'];
    for(let i=0;i<160;i++){
      parts.push({ x:rand(0,innerWidth), y:rand(-innerHeight*0.4,0),
        vx:rand(-2,2), vy:rand(2,6), g:0.07, drag:0.999,
        s:rand(6,12), life:rand(90,170), fade:60, rot:rand(0,6), vr:rand(-0.3,0.3),
        shape:'rect', color:colors[(Math.random()*colors.length)|0] });
    }
    // কয়েকটি ইমোজি
    ['🎉','🏆','🎊','⭐'].forEach(ch=>{
      for(let j=0;j<5;j++) parts.push({ x:rand(0,innerWidth), y:rand(-200,-20),
        vx:rand(-1.5,1.5), vy:rand(1.5,4), g:0.05, drag:1, s:rand(22,36),
        life:rand(110,190), fade:70, rot:rand(-0.3,0.3), vr:rand(-0.1,0.1), shape:'emoji', char:ch });
    });
    start();
  }

  function sparkle(x,y,color){
    ensure(); if(!ctx) return;
    x = x ?? innerWidth/2; y = y ?? innerHeight/2;
    const c=color||'#f4b740';
    for(let i=0;i<22;i++){
      const ang=rand(0,Math.PI*2), sp=rand(1,6);
      parts.push({ x,y, vx:Math.cos(ang)*sp, vy:Math.sin(ang)*sp, g:0.04, drag:0.95,
        s:rand(2,5), life:rand(22,42), fade:32, rot:0, vr:0, shape:'circle', color:c });
    }
    ['✨','⭐','💫'].forEach(ch=>{
      parts.push({ x:x+rand(-20,20), y:y+rand(-20,20), vx:rand(-1,1), vy:rand(-2,-0.5),
        g:0.05, drag:0.98, s:rand(18,26), life:rand(28,46), fade:36, rot:0, vr:rand(-0.1,0.1), shape:'emoji', char:ch });
    });
    start();
  }

  function shake(mag){ shakeMag=mag||10; shakeT=14; start(); }

  return { explosion, confetti, sparkle, shake, ensure };
})();
window.FX=FX;
