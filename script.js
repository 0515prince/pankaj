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

// ===== DIRECT INLINE VIDEO PLAYER =====
let currentlyPlayingCard = null;

window.playDirectly = function(card, id) {
  // If this card is already playing, do nothing
  if (card.classList.contains('playing')) return;

  // Stop any other currently playing video card
  if (currentlyPlayingCard && currentlyPlayingCard !== card) {
    resetCard(currentlyPlayingCard);
  }

  // Set card status to playing
  card.classList.add('playing');
  currentlyPlayingCard = card;

  // Replace card HTML with native HTML5 video player, spinner, and error display
  card.innerHTML = `
    <video 
      src="https://drive.usercontent.google.com/download?id=${id}&confirm=t" 
      autoplay 
      controls 
      playsinline 
      webkit-playsinline
      style="width:100%; height:100%; border:none; display:block; background:#000; object-fit:cover;"
    ></video>
    <div class="video-loader" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:30px; height:30px; border:3px solid rgba(255,255,255,0.2); border-top-color:#ff416c; border-radius:50%; animation:spin-loader 0.8s linear infinite; pointer-events:none; z-index:5;"></div>
    <div class="video-error-msg" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(10,10,12,0.95); color:#fff; display:none; flex-direction:column; align-items:center; justify-content:center; padding:15px; text-align:center; z-index:10; font-family:'Outfit', sans-serif; font-size:12px;">
      <span style="font-size:24px; margin-bottom:8px;">⚠️</span>
      <p style="margin:0 0 8px 0; font-weight:600; color:#ff416c;">Playback Error</p>
      <p class="error-detail" style="margin:0 0 12px 0; opacity:0.8; font-size:11px; line-height:1.4;"></p>
      <a href="https://drive.google.com/file/d/${id}/view" target="_blank" style="padding:6px 12px; background:#ff416c; color:#fff; border-radius:4px; text-decoration:none; font-weight:500; font-size:10px;">Open in Drive</a>
    </div>
    <style>
      @keyframes spin-loader {
        0% { transform: translate(-50%,-50%) rotate(0deg); }
        100% { transform: translate(-50%,-50%) rotate(360deg); }
      }
    </style>
  `;

  const video = card.querySelector('video');
  const loader = card.querySelector('.video-loader');
  const errorEl = card.querySelector('.video-error-msg');
  const detailEl = card.querySelector('.error-detail');

  if (video) {
    // Attempt playback programmatically
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn("Autoplay blocked, waiting for user click:", err);
      });
    }

    // Hide loader once the video starts playing
    video.onplaying = function() {
      if (loader) loader.style.display = 'none';
    };

    // Handle playback errors and show user-friendly message
    video.onerror = function() {
      if (loader) loader.style.display = 'none';
      const err = video.error;
      let msg = "Could not load video source.";
      if (err) {
        switch (err.code) {
          case err.MEDIA_ERR_ABORTED:
            msg = "Playback aborted by user.";
            break;
          case err.MEDIA_ERR_NETWORK:
            msg = "Network connection failed.";
            break;
          case err.MEDIA_ERR_DECODE:
            msg = "Video corrupt or unsupported format.";
            break;
          case err.MEDIA_ERR_SRC_NOT_SUPPORTED:
            msg = "Video format/source is not supported by your browser.";
            break;
        }
      }
      if (detailEl) detailEl.textContent = msg;
      if (errorEl) errorEl.style.display = 'flex';
    };
  }
};

function resetCard(card) {
  const id = card.dataset.videoid;
  const title = card.dataset.title;
  card.classList.remove('playing');
  const thumbUrl = `https://lh3.googleusercontent.com/d/${id}`;

  card.innerHTML = `
    <img src="${thumbUrl}" alt="${title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=500&q=80'" />
    <div class="carousel-overlay">
      <div class="carousel-play-btn">
        <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </div>
      <div class="carousel-meta">
        <h4>${title}</h4>
      </div>
    </div>
  `;
}

// ===== PORTFOLIO VIDEO DATABASE =====
const PORTFOLIO_VIDEOS = [
  // BADIYA BRAND WORK
  { id: '1_3DAE744l1ZqHhSCcOtnsou1kmpVrvAl', category: 'brand', title: 'Brand Promo V1', desc: 'Premium brand video edit' },
  { id: '1bjr2hDcPGOZRhqOpc9FPY-SWAjHVI1Rq', category: 'brand', title: 'Brand Promo V2', desc: 'Modern transitions & lookbook' },
  { id: '1M_yFw8KhkIn7yacHTXVe6doQGI0ljnZJ', category: 'brand', title: 'Brand Promo V3', desc: 'Professional commercial edit' },
  { id: '1HWIGz3sCHjRa4Ti2Q-wba9imjdzJR-1l', category: 'brand', title: 'Brand Promo V4', desc: 'High-energy brand reel' },
  { id: '1sqcOci0Cs7OvM0yAg7n8ALSTLjyFJ_bl', category: 'brand', title: 'Brand Promo V5', desc: 'Fashion brand lookbook' },
  { id: '1G3AC0PgySeughPbzrYEcNNJC3ZktKbRr', category: 'brand', title: 'Brand Promo V6', desc: 'Cinematic promotional reel' },
  { id: '1mzeCcNeueGsJx_B01wb-7E-CQjwbrF1Z', category: 'brand', title: 'Brand Promo V7', desc: 'Stylish transitions promo' },
  { id: '1EefL6kI_bywA3qZoIgSlBae9M8KkKdMv', category: 'brand', title: 'Brand Promo V8', desc: 'Latest commercial video' },

  // CLIENT WORK
  { id: '1NfcoJYMvlSdBZ_JGv0_XyRe2YvF7_G-D', category: 'client', title: 'Client Project V1', desc: 'Promotional edit for client' },
  { id: '11E471Et9MMZOv8bOHBHgiaEXu5TbjsZD', category: 'client', title: 'Client Project V2', desc: 'Social media campaign edit' },
  { id: '19j_lHY2Tw8hhy-mmawPqf0J_cjYU2vAh', category: 'client', title: 'Client Project V4', desc: 'Product advertising campaign' },
  { id: '1hIJ4VjuQzRkmFSaefmCjPiN_0I0cqsuw', category: 'client', title: 'Client Project V5', desc: 'High conversion social ad' },
  { id: '1y4RvunWWESAtmcK2yBPUS4c9NWyQDcmy', category: 'client', title: 'Client Project V6', desc: 'Creative reels editing' },
  { id: '1blCyjTNf99AcIy_ZPpHrGQDLJGS9s_ru', category: 'client', title: 'Client Project V7', desc: 'Event highlight storytelling' },
  { id: '1LJNZFmfhIjQ3D4ATdZ0DalKfMiuDbxO_', category: 'client', title: 'Client Project V8', desc: 'Brand narrative project' },
  { id: '1iXVuWD5qKFlKlG00VHnbdZt3ks6oeZH4', category: 'client', title: 'Client Project V9', desc: 'Dynamic commercial edit' },
  { id: '18o7GCOYbot4bgyBCp6KqzL_Kb-zjWhL1', category: 'client', title: 'Client Project V10', desc: 'Aesthetic fashion lookbook' },

  // INSTAGRAM CLIENT WORK
  { id: '11wC7SdAS0WIr8-KD8EDFK4bs3auQsWn7', category: 'instagram', title: 'Instagram Reel V1', desc: 'Viral reels editing structure' },
  { id: '1i6x1_mR3NI-AOwV4x6e8A7ii_2gZsztu', category: 'instagram', title: 'Instagram Reel V2', desc: 'High hook-rate reel content' },
  { id: '1R0Wtvpi2CB3Pjyww0hlpaTGiFuYEIukh', category: 'instagram', title: 'Instagram Reel V3', desc: 'Seamless transition flow' },
  { id: '1aiKcglncUdW1rk5-Wm42RCQP31rU1rli', category: 'instagram', title: 'Instagram Reel V4', desc: 'Engagement optimized reel' },
  { id: '1ucKScO6QOvboopw6WYS0fEmZ_zahg6jB', category: 'instagram', title: 'Instagram Reel V5', desc: 'Creative visual effects' },
  { id: '1EXqyfTdIRkT8qXAf7k0njJUa4WXGuVRz', category: 'instagram', title: 'Instagram Reel V6', desc: 'Premium aesthetic flow' },

  // PERSONAL WORK
  { id: '19GL-J1x71608gb0-4UT-z-J0fw2RQMuw', category: 'personal', title: 'Personal Project V1', desc: 'Cinematic color grading practice' },
  { id: '1pB4dFCrqyVb_-tGG-YS1OpST4G9L6s6K', category: 'personal', title: 'Personal Project V2', desc: 'Motion graphics experimentation' },
  { id: '1gCtPhjUM5qN6AqRWP10Q9XuJS3nfQbGp', category: 'personal', title: 'Personal Project V3', desc: 'Sound design & pacing study' },
  { id: '1BP3IY1xOKyiO_QzzddAxV5LFKc2ZOQDo', category: 'personal', title: 'Personal Project V4', desc: 'Creative narrative assembly' },
  { id: '1REwBqPSaF5lsbcAXGbFXMG-YZg4WPdny', category: 'personal', title: 'Personal Project V5', desc: 'Experimental transition edit' },
  { id: '18NGqBcmJ0HSnduyJfwSsrHtm-yCdy-FD', category: 'personal', title: 'Personal Project V6', desc: '3D assets integration clip' },
  { id: '1DTUqP0jLMHk-3epwEj0SjCeSaM0BRBMC', category: 'personal', title: 'Personal Project V7', desc: 'Visual storytelling exercise' },
  { id: '1JI4CULZAvAlNKSZrtCn0o6sAQVGhH4-E', category: 'personal', title: 'Personal Project V8', desc: 'Cinematic dynamic cuts' }
];

// ===== RENDER PORTFOLIO CAROUSELS =====
const carouselsContainer = document.getElementById('portfolioCarousels');
const CATEGORIES = [
  { key: 'brand', title: 'Badiya Brand_work' },
  { key: 'client', title: 'Client_work' },
  { key: 'instagram', title: 'instragram client work' },
  { key: 'personal', title: 'Personal work' }
];

function renderCarousels() {
  if (!carouselsContainer) return;
  carouselsContainer.innerHTML = '';

  CATEGORIES.forEach((cat, index) => {
    const videos = PORTFOLIO_VIDEOS.filter(video => video.category === cat.key);
    if (videos.length === 0) return;

    const section = document.createElement('div');
    section.className = 'carousel-section';
    section.style.animation = `fadeInUp 0.6s ease ${index * 0.15}s both`;

    section.innerHTML = `
      <h3 class="carousel-section-title">${cat.title}</h3>
      <div class="carousel-container">
        <button class="carousel-btn prev" onclick="scrollCarousel('${cat.key}', -1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        
        <div class="carousel-track" id="track-${cat.key}">
          ${videos.map(video => {
            const thumbUrl = `https://lh3.googleusercontent.com/d/${video.id}`;
            return `
              <div class="carousel-card" data-videoid="${video.id}" data-title="${video.title}" onclick="playDirectly(this, '${video.id}')">
                <img src="${thumbUrl}" alt="${video.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=500&q=80'" />
                <div class="carousel-overlay">
                  <div class="carousel-play-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                  <div class="carousel-meta">
                    <h4>${video.title}</h4>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <button class="carousel-btn next" onclick="scrollCarousel('${cat.key}', 1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    `;
    carouselsContainer.appendChild(section);
  });
}

// Scroll controller
window.scrollCarousel = function(categoryKey, direction) {
  const track = document.getElementById(`track-${categoryKey}`);
  if (!track) return;
  const scrollAmount = 340 * direction;
  track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
};

// Initial run
renderCarousels();


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
