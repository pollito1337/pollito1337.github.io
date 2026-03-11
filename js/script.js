document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  // Header y Hero Animations
  gsap.from('.brand', {opacity:0, y:-8, duration:0.6, delay:0.1});
  gsap.from('.nav-inner nav a', {opacity:0, y:-6, stagger:0.06, duration:0.45, delay:0.12});
  gsap.from('.hero-left .hero-title', {opacity:0, y:40, duration:0.9, delay:0.18, ease:'power4.out'});
  gsap.from('.hero-left .hero-sub', {opacity:0, y:30, duration:0.8, delay:0.28});
  gsap.from('.portrait-wrap', {opacity:0, x:60, duration:0.9, delay:0.3, ease:'power3.out'});

  // Animaciones de secciones
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

  // Efecto 3D en cards de proyectos
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

  // Modal de proyectos
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

  // Scroll suave
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

  // Formulario de contacto (simulado)
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

  // Mini-player de música
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

  // CTA Join Scroll
  document.getElementById('cta-join').addEventListener('click', ()=> {
    document.getElementById('contact').scrollIntoView({behavior:'smooth'});
  });

  // Escape para cerrar modal
  window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') modal.setAttribute('aria-hidden','true');
  });

  // Lazy load images
  document.querySelectorAll('img').forEach(img=>{
    if(!img.getAttribute('loading')) img.setAttribute('loading','lazy');
  });

});
