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

window.openVideo = function(id, title) {
  if (modalTitle) modalTitle.textContent = title;

  const videoData = PORTFOLIO_VIDEOS.find(v => v.id === id);
  const isLandscape = videoData && (videoData.category === 'video' || videoData.aspect === '16/9');
  
  const container = document.querySelector('.modal-container');
  const wrapper = document.querySelector('.modal-video-wrapper');
  
  if (container && wrapper) {
    if (isLandscape) {
      container.style.maxWidth = '1200px';
      wrapper.style.aspectRatio = '16/9';
    } else {
      // Default to vertical (9/16) aspect ratio for mobile reels/shorts
      container.style.maxWidth = '450px';
      wrapper.style.aspectRatio = '9/16';
    }
  }

  if (modalVid) {
    if (id.startsWith('http://') || id.startsWith('https://')) {
      // Direct video URL (from Blogger, Cloudinary, etc.): play cleanly using native HTML5 player
      modalVid.innerHTML = `
        <video 
          controls
          autoplay
          playsinline
          style="width:100%; height:100%; object-fit:contain; background:#000; border:none; display:block;"
        >
          <source src="${id}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
    } else {
      // Local video file (hosted on Vercel): play using native player
      const localUrl = `videos/${id}.mp4`;
      modalVid.innerHTML = `
        <video 
          id="modalVideoPlayer"
          controls
          autoplay
          playsinline
          style="width:100%; height:100%; object-fit:contain; background:#000; border:none; display:block;"
        >
          <source src="${localUrl}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
      
      // Fallback: If local video fails to load (404/not uploaded), replace with Google Drive iframe player
      const videoEl = document.getElementById('modalVideoPlayer');
      if (videoEl) {
        videoEl.addEventListener('error', function() {
          const containerWidth = wrapper.clientWidth || 450;
          // Desktop base dimensions to force desktop UI inside iframe
          const baseW = isLandscape ? 1920 : 1080;
          const baseH = isLandscape ? 1080 : 1920;
          const scale = containerWidth / baseW;
          
          modalVid.innerHTML = `
            <div style="width: ${baseW}px; height: ${baseH}px; transform: scale(${scale}); transform-origin: top left; overflow: hidden; background: #000; position: absolute; top: 0; left: 0; pointer-events: auto;">
              <iframe 
                src="https://drive.google.com/file/d/${id}/preview" 
                allow="autoplay;fullscreen"
                allowfullscreen
                style="width:100%; height:100%; border:none; background:#000; display:block;"
              ></iframe>
            </div>
          `;
        }, true);
      }
    }
  }
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function(e) {
  if (e && e.target !== modal) return;
  window._closeModal();
};

window._closeModal = function() {
  if (modal) modal.classList.remove('active');
  setTimeout(() => { if (modalVid) modalVid.innerHTML = ''; }, 300);
  document.body.style.overflow = '';
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') window._closeModal();
});

// ===== PORTFOLIO VIDEO DATABASE =====
const PORTFOLIO_VIDEOS = [
  { id: '1x3ZOMRUtmJGvosMuemvISOk3cKg6Egd_', category: 'reel', title: '01' },
  { id: '1MG9qeB1CZG-B9lIyO0V6RWlezn7mLlaN', category: 'reel', title: '1v ' },
  { id: '1g8YDY8ZYnB2zF2EIVCuG9iRFaIJbsqaS', category: 'reel', title: '02' },
  { id: '1xKzPBmV3scpijfsuU5I9AUZfn5Lrb8Wt', category: 'reel', title: 'Af' },
  { id: '1qsgFtW6mUOgYAy86npusmV0o-ZERPYEv', category: 'reel', title: 'ajay ajmera bio' },
  { id: '16-Uok_WRuXA7XyuZAgWjHipeF8mmPgUm', category: 'reel', title: 'ajmera' },
  { id: '1sD5w4S1exS84FdvID1lQaT-3Uj8lMqOD', category: 'reel', title: 'astrologer demo reel 1 ' },
  { id: '1zlt3EL6FpEDMuQTMqTcbXtOO32tv3DNW', category: 'reel', title: 'food processing  OEM_render F-1' },
  { id: '16Br_tEcNRzngFLkRZ5JI5kNpHoj2X8v6', category: 'reel', title: 'monarch visa podcast reel' },
  { id: '17kIhussRngODb68FBDhEWmQz01uFrdLa', category: 'reel', title: 'monarch visa reel 1 final 2' },
  { id: '141tvR0jqvEoYvj-IusqjerQGTANB7435', category: 'reel', title: 'Primerpolytech reel 1' },
  { id: '13kDflRylM2_ucARB49-GgXe538GrX6ZE', category: 'reel', title: 'Primerpolytech reel 2' },
  { id: '1yEOO3FVYFFch-pQhVLl5dPb1sagWL5k_', category: 'reel', title: 'V_1' },
  { id: '1f0Gmr-qSRRP1b48xNLH3M01mokgPXSLn', category: 'reel', title: 'V_01' },
  { id: '1JsNaqaUQsmBC4yeS0ykYaGL99h4wk54b', category: 'reel', title: 'V_02' },
  { id: '1MG8M58ZsquE91U57d_zrMV6kHk15wyz3', category: 'reel', title: 'V_03' },
  { id: '1z8jL8yhJP98mQU3jFIvG4Ni0ppltJYDZ', category: 'reel', title: 'v_04' },
  { id: '1Ato6dMgmnMJQm53SCjFYMXAyW0jgD0ul', category: 'reel', title: 'V_6' },
  { id: '16SCo-UirUJWtd3IBsVMkoWzMRNarYZjq', category: 'reel', title: 'V_7' },
  { id: '1xfo1_vL_V_yiL-Aj1-oeQVtfVMH93Gx1', category: 'reel', title: 'v_09' },
  { id: '17dnutO4NfSxQgjLvExoI56TmlB75pX9H', category: 'reel', title: 'V_9' },
  { id: '1OPu2eRIEUieHlMDZKCmELnfGuZaNcDWl', category: 'reel', title: 'V_11' },
  { id: '1BE_pJGucs_KlDijm3efdCCyj_Q7_gSE1', category: 'reel', title: 'V_13' },
  { id: '1_AO8wgP1Oz0YNLUSg6-CPM_H5D6gPS0l', category: 'reel', title: 'V_18' },
  { id: '1PmDSlTgKFvO7Vu4OKj_c7LfqBJemKlGb', category: 'reel', title: 'V_19' },
  { id: '11HrPXTTlnvqGCic1qAwRumSYA_xnfhaF', category: 'video', title: '3F4A5502 1_1080p' },
  { id: '1ynAq_tx4mEU9w2mvstQfzCDenBOxWsWe', category: 'video', title: 'ajay sir Linked Comp 01 3_1080p' },
  { id: '1PepKuo7_-FQ_7HQCAeLJ9YwcKfo6tCoz', category: 'video', title: 'health insurance_1080p' },
  { id: '1ebhvW2L4Pg1D5FD2KHuJxC_8ykD40Qs6', category: 'video', title: 'tv ad-Final-Correction' }
];

// ===== RENDER PORTFOLIO CAROUSELS =====
const carouselsContainer = document.getElementById('portfolioCarousels');
const CATEGORIES = [
  { key: 'reel', title: 'Reel Videos' },
  { key: 'video', title: 'Videos' }
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
              <div class="carousel-card ${video.category === 'video' ? 'landscape' : ''}" data-videoid="${video.id}" data-title="${video.title}" onclick="openVideo('${video.id}', '${video.title.replace(/'/g, "\\'")}')">
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

// ===== DYNAMIC GOOGLE DRIVE LOADER =====
async function loadDynamicVideos() {
  const isLocalOrVercel = window.location.hostname.includes('vercel.app') || window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
  const apiUrl = isLocalOrVercel ? '/api/videos' : 'https://pankaj-blue.vercel.app/api/videos';
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('API response not OK');
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      // Clear static array and add dynamic videos
      PORTFOLIO_VIDEOS.length = 0;
      PORTFOLIO_VIDEOS.push(...data);
      
      // Update categories dynamically in case Blogger LinkList doesn't load
      // Force categories to contain 'reel' and 'video'
      CATEGORIES.length = 0;
      CATEGORIES.push(
        { key: 'reel', title: 'Reel Videos' },
        { key: 'video', title: 'Videos' }
      );
      
      // Re-render carousels
      renderCarousels();
    }
  } catch (e) {
    console.warn('Failed to load dynamic videos from Google Drive API, using static fallback database:', e);
  }
}

loadDynamicVideos();
