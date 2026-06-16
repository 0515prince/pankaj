/* =============================================
   PANKAJ SHARMA — PREMIUM PORTFOLIO JS
   ============================================= */

// ===== NAVBAR SCROLL =====
const navbar   = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 80;
  navbar.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('visible', scrolled);
  updateActiveNav();
});

backToTop.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

// ===== ACTIVE NAV =====
function updateActiveNav() {
  const sections = ['home','work','about','skills','contact'];
  const pos = window.scrollY + 120;
  sections.forEach(id => {
    const sec  = document.getElementById(id);
    const link = document.getElementById('nav-' + id);
    if (!sec || !link) return;
    const inView = pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight;
    link.classList.toggle('active', inView);
  });
}

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const [s1, s2, s3] = hamburger.querySelectorAll('span');
  const open = navLinks.classList.contains('open');
  s1.style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  s2.style.opacity   = open ? '0' : '';
  s3.style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  })
);

// ===== TYPEWRITER =====
const roles = ['Creative Video Editor','Motion Graphics Artist','Cinematic Storyteller','Content Creator','Visual Storyteller'];
let ri = 0, ci = 0, del = false;
const roleEl = document.getElementById('roleText');

function type() {
  if (!roleEl) return;
  const word = roles[ri];
  roleEl.textContent = del ? word.slice(0, --ci) : word.slice(0, ++ci);
  if (!del && ci === word.length) { del = true; setTimeout(type, 2000); return; }
  if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
  setTimeout(type, del ? 50 : 80);
}
setTimeout(type, 1000);

// ===== PARTICLES =====
function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = ['rgba(255,65,108,','rgba(168,85,247,','rgba(6,182,212,','rgba(245,158,11,'];
  for (let i = 0; i < 18; i++) {
    const el  = document.createElement('div');
    el.className = 'particle';
    const size = Math.random() * 5 + 2;
    const col  = colors[Math.floor(Math.random() * colors.length)];
    const op   = Math.random() * 0.35 + 0.1;
    el.style.cssText = `
      width:${size}px;height:${size}px;
      background:${col}${op});
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 20 + 15}s;
      animation-delay:${Math.random() * 20}s;
      box-shadow:0 0 ${size * 3}px ${col}0.5);
    `;
    container.appendChild(el);
  }
}
spawnParticles();

// ===== VIDEO MODAL =====
const modal      = document.getElementById('videoModal');
const modalTitle = document.getElementById('modalTitle');
const modalVid   = document.getElementById('modalVideoWrapper');
const ytBtn      = document.getElementById('modalYtLink');

function openVideo(id, title) {
  modalTitle.textContent = title;
  ytBtn.href = `https://www.youtube.com/watch?v=${id}`;
  modalVid.innerHTML = `
    <iframe
      src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1"
      allow="autoplay;fullscreen;accelerometer;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
      allowfullscreen title="${title}"
      style="width:100%;height:100%;border:none;"
    ></iframe>`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== modal) return;
  _closeModal();
}

function _closeModal() {
  modal.classList.remove('active');
  setTimeout(() => { modalVid.innerHTML = ''; }, 300);
  document.body.style.overflow = '';
}

document.getElementById('modal-close-btn').addEventListener('click', _closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') _closeModal(); });

// ===== FILTER TABS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.video-card').forEach((card, i) => {
      const show = f === 'all' || card.dataset.category === f;
      card.classList.toggle('hidden', !show);
      if (show) card.style.animation = `fadeInUp 0.4s ease ${i * 0.04}s both`;
    });
  });
});

// ===== GOOGLE DRIVE SECTION =====
function switchFolder(id, btn) {
  document.querySelectorAll('.drive-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const loader = document.getElementById('driveLoader');
  const frame  = document.getElementById('driveFrame');
  if (loader) { loader.style.display = 'flex'; }
  if (frame)  { frame.style.opacity = '0'; frame.src = `https://drive.google.com/embeddedfolderview?id=${id}#grid`; }
}

function driveLoaded() {
  const loader = document.getElementById('driveLoader');
  const frame  = document.getElementById('driveFrame');
  if (loader) loader.style.display = 'none';
  if (frame)  frame.style.opacity  = '1';
}

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-card,.service-card,.contact-card,.highlight-item').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('name').value;
    const email   = document.getElementById('email').value;
    const project = document.getElementById('project').value;
    const message = document.getElementById('message').value;
    const sub  = encodeURIComponent(`Portfolio Inquiry from ${name} — ${project || 'General'}`);
    const body = encodeURIComponent(`Hello Pankaj,\n\nMy name is ${name}.\nEmail: ${email}\nProject: ${project || 'Not specified'}\n\nMessage:\n${message}\n\nRegards,\n${name}`);
    window.open(`mailto:pankajsharma112020@gmail.com?subject=${sub}&body=${body}`);
    const btn = document.getElementById('contact-submit-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>✅ Message Ready!</span>';
    btn.style.background = 'linear-gradient(135deg,#10B981,#059669)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; form.reset(); }, 3000);
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  });
});
