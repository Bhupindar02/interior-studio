import { initCanvasScrub } from '../utils/canvasScrub.js';

/**
 * Initializes Section 01: Hero (Full-Viewport Canvas Scroll Scrub)
 */
export function initHero() {
  const container = document.getElementById('hero');
  if (!container) return;

  container.className = 'hero-section';
  container.innerHTML = `
    <!-- Mobile fallback video (<768px): autoplay, muted, looping -->
    <video
      class="hero-mobile-video"
      src="/video1.mp4"
      poster="https://pub-ed61ae6c7caa41dead326a99f4d0cd9e.r2.dev/frames1_0001.webp"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    ></video>

    <!-- Full-bleed canvas element (100vw × 100vh) for desktop -->
    <canvas id="hero-canvas" class="hero-canvas"></canvas>

    <!-- Minimal loading indicator (thin warm gold progress bar at bottom center) -->
    <div id="hero-loader" class="hero-loader">
      <div class="hero-loader-bar">
        <div id="hero-loader-progress" class="hero-loader-progress"></div>
      </div>
    </div>

    <!-- Fixed overlay text -->
    <div id="hero-overlay" class="hero-overlay">
      <div class="hero-overlay-content">
        <span class="hero-top-label">AWARD-WINNING STUDIO</span>
        <h1 class="hero-headline">SPACES THAT TELL<br>YOUR STORY</h1>
        <p class="hero-subtext">Crafting interiors that feel like home</p>
        <a href="#portfolio" class="hero-cta-btn" id="hero-cta-btn">View Our Work &rarr;</a>
      </div>
    </div>

    <!-- Subtle scroll indicator below the text (thin animated downward arrow) -->
    <div id="hero-scroll-indicator" class="hero-scroll-indicator">
      <span class="scroll-label">Scroll to Explore</span>
      <svg class="scroll-arrow" width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 1V17M7 17L1.5 11.5M7 17L12.5 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `;

  const heroOverlay = document.getElementById('hero-overlay');
  const heroLoader = document.getElementById('hero-loader');
  const heroLoaderProgress = document.getElementById('hero-loader-progress');
  const scrollIndicator = document.getElementById('hero-scroll-indicator');
  const ctaBtn = document.getElementById('hero-cta-btn');

  // Smooth scroll handler for CTA button to #portfolio
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const portfolio = document.getElementById('portfolio');
      if (portfolio) {
        portfolio.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Hide loader helper
  function hideLoader() {
    if (heroLoader && !heroLoader.classList.contains('hidden')) {
      if (heroLoaderProgress) heroLoaderProgress.style.width = '100%';
      setTimeout(() => {
        heroLoader.classList.add('hidden');
      }, 150);
    }
  }

  // Initialize canvas scroll scrub on all devices (mobile-optimized with DPR capped to 1.5 and 80-frame cap)
  let scrubInstance = null;

  function setupHeroMode() {
    if (!scrubInstance) {
      scrubInstance = initCanvasScrub({
        cloudFolder: 'frames1',
        canvasId: 'hero-canvas',
        totalFrames: 299,
        pinDistance: '+=1794px', // 299 frames × 6px = 1794px (1:1 scroll-to-frame)
        textRevealAt: 0.85,      // 85% scroll progress
      });
    }
  }

  setupHeroMode();

  // Update minimal loading bar progress
  window.addEventListener('hero-buffer-progress', (e) => {
    const { percentage } = e.detail || {};
    if (heroLoaderProgress && percentage !== undefined) {
      heroLoaderProgress.style.width = `${percentage}%`;
    }
  });

  window.addEventListener('canvas-frame-loaded', (e) => {
    const { cloudFolder, loadedCount, totalFrames } = e.detail || {};
    if (cloudFolder === 'frames1' && heroLoaderProgress && totalFrames) {
      const pct = Math.min(100, Math.round((loadedCount / totalFrames) * 100));
      heroLoaderProgress.style.width = `${pct}%`;
    }
  });

  // Hide loader once critical buffer is ready
  window.addEventListener('hero-initial-buffer-ready', () => {
    hideLoader();
  });

  // Safety fallback for loader
  setTimeout(hideLoader, 3500);

  // Fixed overlay text fades in when 'revealText' event fires (85% scroll progress)
  window.addEventListener('revealText', (e) => {
    if (e.detail?.canvasId === 'hero-canvas' && heroOverlay) {
      if (e.detail.revealed) {
        heroOverlay.classList.add('revealed');
      } else {
        heroOverlay.classList.remove('revealed');
      }
    }
  });

  // Subtle scroll indicator disappears as soon as user starts scrolling
  window.addEventListener('hero-scrolled-started', () => {
    if (scrollIndicator) {
      scrollIndicator.classList.add('hidden');
    }
  });

  window.addEventListener('hero-scrolled-reset', () => {
    if (scrollIndicator && window.innerWidth >= 768) {
      scrollIndicator.classList.remove('hidden');
    }
  });
}
