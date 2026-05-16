/* =====================================================
   MAIN JS — LP1 Matozo & Espinosa
   - Custom cursor (dot + ring com lerp)
   - Magnetic buttons
   - Navbar scroll state
   - Hero parallax orbs
   - Counter animation
===================================================== */

/* ===== Custom Cursor — desativado (usa cursor nativo) ===== */

/* ===== Hamburger Menu (mobile) ===== */
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
const navBackdrop = document.getElementById('navBackdrop');

function toggleMenu(open) {
  const isOpen = open !== undefined ? open : !navMobile.classList.contains('is-open');
  navToggle.classList.toggle('is-open', isOpen);
  navMobile.classList.toggle('is-open', isOpen);
  navBackdrop.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  navMobile.setAttribute('aria-hidden', !isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
}

if (navToggle && navMobile && navBackdrop) {
  navToggle.addEventListener('click', () => toggleMenu());
  navBackdrop.addEventListener('click', () => toggleMenu(false));

  // Fecha ao clicar em qualquer link interno
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // ESC fecha
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMobile.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });
}

/* ===== Magnetic Buttons (técnica Awwwards) ===== */
document.querySelectorAll('.magnetic').forEach(el => {
  let rect = null;
  el.addEventListener('mouseenter', () => {
    rect = el.getBoundingClientRect();
  });
  el.addEventListener('mousemove', e => {
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
    el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => { el.style.transition = ''; }, 600);
  });
});

/* ===== Navbar scrolled state ===== */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ===== Hero parallax orbs ===== */
const heroEl = document.querySelector('.hero');
const heroOrbs = document.querySelectorAll('.hero-orb');

if (heroEl && heroOrbs.length) {
  heroEl.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);
    heroOrbs.forEach((orb, i) => {
      const factor = (i + 1) * 16;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
}

/* ===== Scroll reveal (.reveal e .feature-row) ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.reveal, .feature-row, .cenario-card, .etapa, .cta-photo, .cta-content').forEach(el => revealObserver.observe(el));

/* ===== Counter animation (hero meta) ===== */
function animateCounter(el) {
  const target = parseFloat(el.dataset.counter);
  const isFloat = !Number.isInteger(target);
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const current = target * eased;
    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = isFloat ? target.toFixed(1) : target;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

/* ===== Google Analytics — track WhatsApp clicks ===== */
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
  link.addEventListener('click', () => {
    if (typeof gtag === 'function') {
      const label = (link.textContent.trim().substring(0, 50) || 'whatsapp_button').replace(/\s+/g, ' ');
      gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: label,
        page_location: window.location.href
      });
    }
  });
});
