document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.brand', {opacity:0, y:-8, duration:0.6, delay:0.1});
  gsap.from('.nav-inner nav a', {opacity:0, y:-6, stagger:0.06, duration:0.45, delay:0.12});
  gsap.from('.hero-left .hero-title', {opacity:0, y:40, duration:0.9, delay:0.18, ease:'power4.out'});
  gsap.from('.hero-left .hero-sub', {opacity:0, y:30, duration:0.8, delay:0.28});
  gsap.from('.portrait-wrap', {opacity:0, x:60, duration:0.9, delay:0.3, ease:'power3.out'});

  gsap.utils.toArray('.section').forEach(section => {
    gsap.from(section.querySelectorAll('*'), {
      opacity: 0,
      y: 40,
      stagger: 0.04,
      duration: 0.7,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {rotationY: x * 6, rotationX: -y * 6, transformPerspective: 800, ease: 'power3.out', duration: 0.4});
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {rotationY: 0, rotationX: 0, duration: 0.6, ease: 'power3.out'});
    });
  });

  const openBtns = document.querySelectorAll('.open-project');
  const modal = document.getElementById('project-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalLink = document.getElementById('modal-link');
  const modalClose = document.getElementById('modal-close');
  const modalClose2 = document.getElementById('modal-close2');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      modalImg.src = card.dataset.img || 'images/default-project.jpg';
      modalTitle.textContent = card.dataset.title || 'Proyecto';
      modalDesc.textContent = card.dataset.desc || 'Descripción del proyecto';
      modalLink.href = card.dataset.link || '#';
      modal.setAttribute('aria-hidden', 'false');
      gsap.fromTo('.modal-inner', {scale:0.98, opacity:0}, {scale:1, opacity:1, duration:0.35});
    });
  });

  function closeModal(){
    modal.setAttribute('aria-hidden','true');
  }
  modalClose.addEventListener('click', closeModal);
  modalClose2.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.startsWith('#')){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name').trim();
      const email = data.get('email').trim();
      const message = data.get('message').trim();
      if(!name || !email || !message){
        alert('Rellena todos los campos, porfa.');
        return;
      }

      gsap.to('.form', {opacity:0.6, duration:0.25});
      setTimeout(()=>{
        alert('Mensaje enviado. ¡Gracias! Te contestaré pronto.');
        form.reset();
        gsap.to('.form', {opacity:1, duration:0.25});
      }, 700);
    });
  }

  const playlist = [
    {name:'Legends', cover:'images/cover1.jpg', file:'music/Legends.mp3'},
    {name:'All Girls Are The Same', cover:'images/cover2.jpg', file:'music/All Girls Are The Same.mp3'},
    {name:'Lovers Rock', cover:'images/cover3.jpg', file:'music/Lovers Rock.mp3'}
  ];

  let idx = 0;
  const audio = document.getElementById('audio-player');
  const miniTitle = document.getElementById('mini-title');
  const miniCover = document.getElementById('mini-cover');
  const playBtn = document.getElementById('mini-play');

  function loadSong(i){
    idx = i;
    miniTitle.textContent = playlist[idx].name;
    miniCover.src = playlist[idx].cover;
    audio.src = playlist[idx].file;
  }

  function changeSong(dir){
    idx = (idx + dir + playlist.length) % playlist.length;
    loadSong(idx);
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    gsap.fromTo('#mini-cover', {opacity:0, scale:1.03}, {opacity:1, scale:1, duration:0.28});
  }

  playBtn.addEventListener('click', () => {
    if(audio.paused){
      audio.play();
      playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      audio.pause();
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  });
  document.getElementById('mini-next').addEventListener('click', ()=> changeSong(1));
  document.getElementById('mini-prev').addEventListener('click', ()=> changeSong(-1));
  audio.addEventListener('ended', () => changeSong(1));
  loadSong(idx);

  document.getElementById('cta-join').addEventListener('click', ()=> {
    document.getElementById('contact').scrollIntoView({behavior:'smooth'});
  });

  window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') modal.setAttribute('aria-hidden','true');
  });

  document.querySelectorAll('img').forEach(img=>{
    if(!img.getAttribute('loading')) img.setAttribute('loading','lazy');
  });

const typingEl = document.getElementById("typing-name");
if (typingEl){
  const text = "Pollito";
  let i = 0;
  function type(){
    if(i < text.length){
      typingEl.textContent += text.charAt(i);
      i++;
      setTimeout(type, 120);
    }
  }
  type();
}

let lastScroll = 0;
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if(currentScroll > lastScroll && currentScroll > 100){
    nav.classList.add('hidden');
  } else {
    nav.classList.remove('hidden');
  }
  lastScroll = currentScroll;
});

let cursorPro = document.querySelector('.cursor-glow');
if(!cursorPro){
  cursorPro = document.createElement('div');
  cursorPro.classList.add('cursor-glow');
  cursorPro.style.position = 'fixed';
  cursorPro.style.width = '14px';
  cursorPro.style.height = '14px';
  cursorPro.style.borderRadius = '50%';
  cursorPro.style.background = '#00ff9c';
  cursorPro.style.pointerEvents = 'none';
  cursorPro.style.zIndex = '9999';
  cursorPro.style.boxShadow = '0 0 15px #00ff9c, 0 0 25px #00ff9c';
  cursorPro.style.transition = 'transform 0.1s ease-out';
  document.body.appendChild(cursorPro);
}

const trail = [];
const trailCount = 8;
for(let i=0; i<trailCount; i++){
  const t = document.createElement('div');
  t.classList.add('cursor-trail');
  t.style.position = 'fixed';
  t.style.width = `${14 - i*1.5}px`;
  t.style.height = `${14 - i*1.5}px`;
  t.style.borderRadius = '50%';
  t.style.background = 'rgba(0,255,156,' + (0.3 - i*0.03) + ')';
  t.style.pointerEvents = 'none';
  t.style.zIndex = '9998';
  document.body.appendChild(t);
  trail.push(t);
}

window.addEventListener('mousemove', e => {
  cursorPro.style.left = e.clientX + 'px';
  cursorPro.style.top = e.clientY + 'px';
  trail.forEach((t, index) => {
    gsap.to(t, {left:e.clientX, top:e.clientY, duration:0.1 + index*0.03, ease:'power1.out'});
  });
});

document.addEventListener('click', e => {
  for(let i=0;i<8;i++){
    const p = document.createElement('div');
    p.style.position = 'fixed';
    p.style.width = '6px';
    p.style.height = '6px';
    p.style.borderRadius = '50%';
    p.style.background = '#00ff9c';
    p.style.left = e.clientX + 'px';
    p.style.top = e.clientY + 'px';
    p.style.pointerEvents = 'none';
    p.style.zIndex = '9999';
    document.body.appendChild(p);

    const angle = Math.random()*Math.PI*2;
    const radius = 30 + Math.random()*20;

    gsap.to(p, {
      x: Math.cos(angle)*radius,
      y: Math.sin(angle)*radius,
      opacity:0,
      duration:0.6 + Math.random()*0.3,
      ease:'power2.out',
      onComplete: ()=> p.remove()
    });
  }
});

document.querySelectorAll('.hero-stats strong').forEach(el => {
  gsap.from(el, {
    textContent: 0,
    duration: 1.5,
    ease: "power1.out",
    snap: { textContent: 1 },
    scrollTrigger: {
      trigger: el,
      start: "top 80%"
    }
  });
});

});