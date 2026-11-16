import './styles/main.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Import all 12 section initializers
import { initHero } from './sections/hero.js';
import { initTrustBar } from './sections/trust-bar.js';
import { initBeforeAfter } from './sections/before-after.js';
import { initServices } from './sections/services.js';
import { initInteriorTour } from './sections/interior-tour.js';
import { initPortfolio } from './sections/portfolio.js';
import { initProcess } from './sections/process.js';
import { initTestimonials } from './sections/testimonials.js';
import { initMarquee } from './sections/marquee.js';
import { initInstagram } from './sections/instagram.js';
import { initCta } from './sections/cta.js';
import { initFooter } from './sections/footer.js';
import { initScrollReveal } from './utils/scrollReveal.js';

/* ==========================================================================
   Loading Overlay Controller
   - Warm gold progress bar fills as Section 01 frames preload
   - Smoothly hides once Section 01's first frame is ready
   ========================================================================== */
function setupLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  const barFill = document.getElementById('loading-bar-fill');

  function hideOverlay() {
    if (!overlay || overlay.classList.contains('loaded')) return;
    if (barFill) barFill.style.width = '100%';
    setTimeout(() => {
      overlay.classList.add('loaded');
      ScrollTrigger.refresh();
    }, 300);
  }

  // Animate progress bar as Section 01 initial buffer preloads
  window.addEventListener('hero-buffer-progress', (e) => {
    const { percentage } = e.detail || {};
    if (barFill && percentage !== undefined && !overlay.classList.contains('loaded')) {
      barFill.style.width = `${percentage}%`;
    }
  });

  window.addEventListener('canvas-frame-loaded', (e) => {
    const { cloudFolder, loadedCount, totalFrames } = e.detail || {};
    if (cloudFolder === 'frames1' && barFill && totalFrames && !overlay.classList.contains('loaded')) {
      const percentage = Math.min(100, Math.round((loadedCount / totalFrames) * 100));
      const currentWidth = parseFloat(barFill.style.width) || 0;
      if (percentage > currentWidth) {
        barFill.style.width = `${percentage}%`;
      }
    }
  });

  // Hide as soon as Section 01 critical buffer is ready for smooth scrubbing
  window.addEventListener('hero-initial-buffer-ready', () => {
    hideOverlay();
  });

  // Immediately reflect first frame ready
  window.addEventListener('section1-first-frame-ready', () => {
    if (barFill && (!barFill.style.width || parseFloat(barFill.style.width) < 20)) {
      barFill.style.width = '20%';
    }
  });

  // Safety fallback timeout
  setTimeout(hideOverlay, 3500);
}

/* ==========================================================================
   Fixed Navigation Scroll Listener
   - Default: transparent background, no border
   - > 80px scroll: white background + subtle bottom shadow
   ========================================================================== */
function setupFixedNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   Initialize Application
   ========================================================================== */
function initApp() {
  setupLoadingOverlay();
  setupFixedNav();

  // Initialize all sections in order
  initHero();
  initTrustBar();
  initBeforeAfter();
  initServices();
  initInteriorTour();
  initPortfolio();
  initProcess();
  initTestimonials();
  initMarquee();
  initInstagram();
  initCta();
  initFooter();

  // Initialize GPU-accelerated compositor-thread scroll reveals
  initScrollReveal();

  // Refresh ScrollTrigger after DOM insertion
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
