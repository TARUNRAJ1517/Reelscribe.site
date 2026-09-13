
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')})
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.querySelectorAll('[data-faq]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const a=btn.parentElement.querySelector('.answer');
    const open=a.style.display==='block';
    document.querySelectorAll('.answer').forEach(x=>x.style.display='none');
    a.style.display=open?'none':'block';
  });
});
