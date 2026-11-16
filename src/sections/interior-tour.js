import { initCanvasScrub } from '../utils/canvasScrub.js';

/**
 * Initializes Section 05: Interior Tour (Kitchen & Dining Orbit Canvas Scrub)
 */
export function initInteriorTour() {
  const container = document.getElementById('interior-tour');
  if (!container) return;

  container.className = 'tour-section';
  container.innerHTML = `
    <!-- Mobile Fallback Video (<768px): Autoplay, Muted, Looping -->
    <video
      class="tour-mobile-video"
      src="/video2.mp4"
      poster="https://pub-54dc63ec84a74037ae5dea0b31af4f39.r2.dev/frames2_0001.webp"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    ></video>

    <!-- Full-bleed Canvas Element for Desktop (100vw × 100vh) -->
    <canvas id="tour-canvas" class="tour-canvas"></canvas>

    <!-- Canvas Dark Gradient Overlay for Left-side Text Readability -->
    <div class="tour-dark-overlay" aria-hidden="true"></div>

    <!-- Left-side Text Overlay — FIXED during pin, ALWAYS VISIBLE from scroll start -->
    <div class="tour-content" id="tour-content">
      <span class="tour-label">INTERIOR SPACES</span>
      <h2 class="tour-heading">WHERE FUNCTION MEETS BEAUTY</h2>
      <p class="tour-body">
        Every material, every detail chosen with intention. Spaces that inspire as much as they serve.
      </p>
      <!-- At 90% scroll progress: Fades in below body text -->
      <a href="#portfolio" class="tour-portfolio-link" id="tour-portfolio-link">
        Explore Full Portfolio &rarr;
      </a>
    </div>
  `;

  const portfolioLink = document.getElementById('tour-portfolio-link');

  // Smooth scroll handler for "Explore Full Portfolio →"
  if (portfolioLink) {
    portfolioLink.addEventListener('click', (e) => {
      e.preventDefault();
      const portfolio = document.getElementById('portfolio');
      if (portfolio) {
        portfolio.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Initialize canvas scroll scrub on all devices (mobile-optimized with DPR scaling and 150-frame cap)
  let scrubInstance = null;

  function setupTourMode() {
    if (!scrubInstance) {
      scrubInstance = initCanvasScrub({
        cloudFolder: 'frames2',
        canvasId: 'tour-canvas',
        totalFrames: 299,
        pinDistance: '+=1794px', // 299 × 6 = 1794px
        textRevealAt: 0.90,      // 90% scroll progress
      });
    }
  }

  setupTourMode();

  // At 90% scroll progress (when 'revealText' event fires): Fade in portfolio link
  window.addEventListener('revealText', (e) => {
    if (e.detail?.canvasId === 'tour-canvas' && portfolioLink) {
      if (e.detail.revealed) {
        portfolioLink.classList.add('revealed');
      } else {
        portfolioLink.classList.remove('revealed');
      }
    }
  });
}
