(function(){
  document.body.classList.add('rs-ready');
  const move=(e)=>{document.body.style.setProperty('--mx',e.clientX+'px');document.body.style.setProperty('--my',e.clientY+'px')};
  if(matchMedia('(pointer:fine)').matches) window.addEventListener('pointermove',move,{passive:true});
  document.querySelectorAll('.panel,.card,.price,.plan,.qa-card,.step,.video-preview-card,.src-card').forEach(el=>{el.addEventListener('pointermove',e=>{if(matchMedia('(pointer:fine)').matches){const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${y*-2}deg) rotateY(${x*2}deg) translateY(-3px)`}});el.addEventListener('pointerleave',()=>el.style.transform='')});
  const path=location.pathname;
  if(path!=='/admin.html' && !path.startsWith('/blog/')){
    const nav=document.querySelector('.links');
    if(nav){const links=[...nav.querySelectorAll('a')].map(a=>a.getAttribute('href')); if(!links.includes('/transcript.html')){const a=document.createElement('a');a.href='/transcript.html';a.textContent='Transcript';nav.insertBefore(a,nav.firstChild)} if(!links.includes('/pricing.html')){const a=document.createElement('a');a.href='/pricing.html';a.textContent='Pricing';nav.appendChild(a)}}
  }
  document.querySelectorAll('a[href="#pricing"]').forEach(a=>a.addEventListener('click',()=>{}));
})();
