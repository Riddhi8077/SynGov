/* ═══════════════════════════════════════════════════════════════
   SynGov — Shared JavaScript
   Scroll animations, parallax, count-up, interactions
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initParallax();
  initCountUp();
  initNavScroll();
  initMobileNav();
  initMarquee();
});

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve stagger-children so the class stays
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ── Parallax ── */
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (!parallaxElements.length) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const rect = el.parentElement.getBoundingClientRect();
      const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${-offset}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/* ── Count-Up Animation ── */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');

  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

function animateCount(el) {
  const target = el.dataset.count;
  const duration = 1200;
  const start = performance.now();

  // Check if it's a number or has special chars
  const numericMatch = target.match(/^([<>]?\s?)(\d+\.?\d*)/);
  if (!numericMatch) {
    el.textContent = target;
    return;
  }

  const prefix = numericMatch[1] || '';
  const endValue = parseFloat(numericMatch[2]);
  const suffix = target.replace(numericMatch[0], '');
  const isDecimal = target.includes('.');

  function step(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * endValue;

    if (isDecimal) {
      el.textContent = prefix + current.toFixed(1) + suffix;
    } else {
      el.textContent = prefix + Math.round(current) + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/* ── Nav Scroll Effect ── */
function initNavScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      navbar.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ── Mobile Nav ── */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.navbar-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('mobile-open');
    toggle.classList.toggle('active');
  });
}

/* ── Image Marquee ── */
function initMarquee() {
  const tracks = document.querySelectorAll('.marquee-track');
  tracks.forEach(track => {
    // Duplicate children for seamless loop
    const children = Array.from(track.children);
    children.forEach(child => {
      const clone = child.cloneNode(true);
      track.appendChild(clone);
    });
  });
}

/* ── Segmented Control ── */
function initSegmentedControl(containerId, inputId) {
  const container = document.getElementById(containerId);
  const input = document.getElementById(inputId);
  if (!container) return;

  const options = container.querySelectorAll('.segmented-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      if (input) input.value = opt.dataset.value;
    });
  });
}

/* ── Vote Button Interaction ── */
function handleVote(button, type) {
  const buttons = button.parentElement.querySelectorAll('.vote-btn');
  buttons.forEach(btn => {
    btn.style.opacity = '0.4';
    btn.style.pointerEvents = 'none';
  });

  button.style.opacity = '1';

  // Show confirmation
  const confirmation = document.createElement('p');
  confirmation.style.cssText = 'text-align:center;color:#059669;font-size:0.8125rem;font-weight:600;font-family:var(--font-display);margin-top:12px;';
  confirmation.textContent = '✓ Your vote has been recorded';
  button.parentElement.after(confirmation);
}

/* ── Smooth anchor scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
