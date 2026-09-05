(function(){
  'use strict';
  document.body.classList.add('rs-ready');

  const fine = matchMedia('(pointer:fine)').matches;
  if(fine){
    const move=(e)=>{document.body.style.setProperty('--mx',e.clientX+'px');document.body.style.setProperty('--my',e.clientY+'px')};
    window.addEventListener('pointermove',move,{passive:true});
  }

  // One navigation system across the entire public app.
  const path = location.pathname;
  const isApp = /dashboard|clips-dashboard/.test(path);
  const nav = document.querySelector('.rs-unified-nav') || document.querySelector('header > nav') || document.querySelector('.nav') || document.querySelector('body > nav');
  if(nav && !nav.dataset.rsUnified){
    nav.dataset.rsUnified='1';
    nav.className='rs-unified-nav';
    const isHome = path==='/' || path==='/index.html';
    const right = isApp
      ? '<span class="rs-nav-plan" id="navPlanBadge">Free</span><a class="rs-nav-earn" href="/referral.html">🎁 <span>Earn</span></a><button class="rs-nav-menu" type="button" aria-label="Open menu">☰</button>'
      : '<a class="rs-nav-login" href="/login.html">Log in</a><a class="rs-nav-start" href="/transcript.html">Start free</a><button class="rs-nav-menu" type="button" aria-label="Open menu">☰</button>';
    nav.innerHTML = '<div class="rs-nav-inner">'+
      '<a class="rs-nav-logo" href="/"><span class="rs-nav-dot"></span><span>ReelScribe</span></a>'+
      '<div class="rs-nav-links">'+
        '<a href="/transcript.html" class="'+(path.includes('transcript')?'active':'')+'">Transcript</a>'+ 
        '<a href="/#how">How it works</a>'+ 
        '<a href="/#captions">Captions</a>'+ 
        '<a href="/pricing.html" class="'+(path.includes('pricing')?'active':'')+'">Pricing</a>'+ 
        '<a href="/#faq">FAQ</a>'+ 
      '</div>'+ '<div class="rs-nav-right">'+right+'</div>'+ '</div>';
    nav.querySelector('.rs-nav-menu').addEventListener('click', openUnifiedMenu);
  }

  // Preserve the homepage's dynamic menu but restyle/use the same contents.
  let overlay = document.getElementById('rs-global-menu');
  if(!overlay){
    overlay=document.createElement('div');
    overlay.id='rs-global-menu';
    overlay.className='rs-global-menu';
    overlay.innerHTML='<div class="rs-menu-panel" role="dialog" aria-modal="true">'+
      '<div class="rs-menu-head"><a class="rs-nav-logo" href="/"><span class="rs-nav-dot"></span><span>ReelScribe</span></a><button type="button" class="rs-menu-close" aria-label="Close menu">×</button></div>'+ 
      '<div class="rs-menu-links">'+
      '<a href="/">Home</a><a href="/transcript.html">Transcript</a><a href="/pricing.html">Pricing</a><a href="/dashboard.html">Dashboard</a><a href="/clips-dashboard.html">Cut Clips</a><a href="/contact.html">Support</a>'+ 
      '<a class="rs-menu-primary" href="/login.html">Login →</a>'+ 
      '</div></div>';
    document.body.appendChild(overlay);
    overlay.querySelector('.rs-menu-close').addEventListener('click',closeUnifiedMenu);
    overlay.addEventListener('click',e=>{if(e.target===overlay)closeUnifiedMenu()});
  }
  const menuLogin=overlay.querySelector('.rs-menu-primary');
  const menuLinks=overlay.querySelector('.rs-menu-links');
  if(isApp){
    menuLogin.textContent='Upgrade Plan →';
    menuLogin.href='/pricing.html';
  }
  // Resolve session state so the same menu works on every page.
  fetch('/me').then(r=>r.ok?r.json():null).then(me=>{
    if(!me || !me.loggedIn) return;
    if(!menuLinks.querySelector('.rs-menu-logout')){
      const b=document.createElement('a');
      b.href='#'; b.className='rs-menu-logout'; b.textContent='Logout →';
      b.addEventListener('click',async e=>{e.preventDefault();try{await fetch('/logout',{method:'POST'})}catch(_){} location.href='/';});
      menuLinks.appendChild(b);
    }
    menuLinks.querySelectorAll('a[href="/dashboard.html"],a[href="/clips-dashboard.html"]').forEach(a=>a.style.display='flex');
    if(!isApp){ menuLogin.textContent='Dashboard →'; menuLogin.href='/dashboard.html'; }
  }).catch(()=>{});
  function openUnifiedMenu(){overlay.classList.add('open');document.body.classList.add('rs-menu-open');}
  function closeUnifiedMenu(){overlay.classList.remove('open');document.body.classList.remove('rs-menu-open');}
  window.rsOpenMenu=openUnifiedMenu;
  window.rsCloseMenu=closeUnifiedMenu;

  // Add missing transcript/pricing links to any legacy homepage nav that survived.
  const legacyLinks=document.querySelector('.links');
  if(legacyLinks){
    const links=[...legacyLinks.querySelectorAll('a')].map(a=>a.getAttribute('href'));
    if(!links.includes('/transcript.html')){const a=document.createElement('a');a.href='/transcript.html';a.textContent='Transcript';legacyLinks.insertBefore(a,legacyLinks.firstChild)}
    if(!links.includes('/pricing.html')){const a=document.createElement('a');a.href='/pricing.html';a.textContent='Pricing';legacyLinks.appendChild(a)}
  }

  document.querySelectorAll('.panel,.card,.price,.plan,.qa-card,.step,.video-preview-card,.src-card').forEach(el=>{
    if(!fine)return;
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${y*-1.5}deg) rotateY(${x*1.5}deg) translateY(-2px)`});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });
})();
