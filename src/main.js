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
    }, 250);
  }

  // Animate progress bar as Section 01 frames preload
  window.addEventListener('canvas-frame-loaded', (e) => {
    const { cloudFolder, loadedCount, totalFrames } = e.detail || {};
    if (cloudFolder === 'frames1' && barFill && totalFrames) {
      const percentage = Math.min(100, Math.round((loadedCount / totalFrames) * 100));
      barFill.style.width = `${percentage}%`;
    }
  });

  // Hide as soon as Section 01 first frame is ready
  window.addEventListener('section1-first-frame-ready', () => {
    hideOverlay();
  });

  // Safety fallback timeout
  setTimeout(hideOverlay, 2000);
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
