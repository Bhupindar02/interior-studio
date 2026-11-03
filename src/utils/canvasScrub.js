import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CLOUD_NAME = 'qk5wy6np';

/**
 * Builds an optimized Cloudinary frame URL for a given folder and frame index.
 * Uses mobile/desktop responsive transformations:
 * - Mobile (<768px): f_auto,q_auto,w_640 (~20-30KB per frame, light memory footprint)
 * - Desktop (>=768px): f_auto,q_90,w_1280 (~40-60KB per frame, high fidelity)
 *
 * @param {string|function} folder - Folder name or URL builder function
 * @param {number} frameIndex - Zero-based frame index
 * @param {string} [transform] - Optional explicit Cloudinary transformation string
 * @returns {string} URL to the frame image
 */
export function getFrameURL(folder, frameIndex, transform) {
  if (typeof folder === 'function') {
    return folder(frameIndex);
  }

  // 4-digit zero padding: 0 -> 0001, 298 -> 0299
  const paddedIndex = String(frameIndex + 1).padStart(4, '0');

  if (folder.startsWith('http://') || folder.startsWith('https://')) {
    const cleanUrl = folder.replace(/\/$/, '');
    return `${cleanUrl}/frame_${paddedIndex}.jpg`;
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const currentTransform =
    transform || (isMobile ? 'f_auto,q_auto,w_640' : 'f_auto,q_90,w_1280');

  const cleanFolder = folder.replace(/_+$/, '');
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${currentTransform}/${cleanFolder}_${paddedIndex}.jpg`;
}

/**
 * Initializes canvas scroll scrub with GSAP ScrollTrigger and mobile-optimized architecture.
 *
 * Change 1 — Passive scroll listener:
 *   window.addEventListener('scroll', onScroll, { passive: true })
 * Change 2 — Touch event support on container:
 *   container.addEventListener('touchstart', ...), container.addEventListener('touchmove', ...)
 * Change 3 — Mobile frame count cap & transform:
 *   const isMobile = window.innerWidth < 768
 *   const EFFECTIVE_FRAMES = isMobile ? Math.min(totalFrames, 150) : totalFrames
 *   const CLOUD_TRANSFORM = isMobile ? 'f_auto,q_auto,w_640' : 'f_auto,q_90,w_1280'
 * Change 4 — Canvas resize with devicePixelRatio:
 *   canvas.width = window.innerWidth * dpr, canvas.height = window.innerHeight * dpr, ctx.scale(dpr, dpr)
 *
 * @param {Object} options
 * @param {string} options.cloudFolder - Cloudinary folder name ('frames1' or 'frames2')
 * @param {string} options.canvasId - ID of canvas element
 * @param {number} [options.totalFrames=299] - Total frames in sequence
 * @param {string|number} [options.pinDistance='+=1794px'] - Scroll distance to pin section
 * @param {number} [options.textRevealAt=0.85] - Progress threshold (0..1) to emit revealText event
 * @returns {Object} Scrub controller instance
 */
export function initCanvasScrub({
  cloudFolder,
  canvasId,
  totalFrames = 299,
  pinDistance = '+=1794px',
  textRevealAt = 0.85,
}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn(`[initCanvasScrub] Canvas with ID "${canvasId}" not found.`);
    return null;
  }

  const ctx = canvas.getContext('2d');
  const section = canvas.closest('section') || canvas.parentElement;
  const container = section || canvas.parentElement || canvas;

  // Change 3 — Mobile frame count cap & Cloudinary transform:
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const EFFECTIVE_FRAMES = isMobile ? Math.min(totalFrames, 150) : totalFrames;
  const CLOUD_TRANSFORM = isMobile ? 'f_auto,q_auto,w_640' : 'f_auto,q_90,w_1280';

  let currentFrameIndex = 0;
  let lastRenderedIndex = -1;
  let textRevealed = false;
  let hasScrolled = false;
  let isDestroyed = false;

  // Map effective index (0..EFFECTIVE_FRAMES-1) to full Cloudinary asset sequence (0..totalFrames-1)
  function getCloudinaryIndex(index) {
    if (!isMobile || totalFrames <= EFFECTIVE_FRAMES) {
      return index;
    }
    return Math.round((index / (EFFECTIVE_FRAMES - 1)) * (totalFrames - 1));
  }

  const images = new Array(EFFECTIVE_FRAMES);
  const loadedIndices = new Set();
  const loadingPromises = new Map();
  let loadedCount = 0;

  /**
   * getNearestLoadedImage(frameIndex) fallback
   * - Checks if frames[frameIndex] is loaded; if not, walks backward then forward
   *   to find the closest already-loaded frame
   * - Always returns a loaded image — never draws blank, never freezes
   * - Enables smooth scrubbing from the very first second of page load
   */
  function getNearestLoadedImage(frameIndex) {
    // 1. Exact match
    if (images[frameIndex] && images[frameIndex].complete && images[frameIndex].naturalWidth > 0) {
      return images[frameIndex];
    }

    // 2. Walk outward (backward then forward)
    const maxDistance = Math.max(frameIndex, EFFECTIVE_FRAMES - 1 - frameIndex);
    for (let dist = 1; dist <= maxDistance; dist++) {
      const prevIdx = frameIndex - dist;
      if (
        prevIdx >= 0 &&
        images[prevIdx] &&
        images[prevIdx].complete &&
        images[prevIdx].naturalWidth > 0
      ) {
        return images[prevIdx];
      }

      const nextIdx = frameIndex + dist;
      if (
        nextIdx < EFFECTIVE_FRAMES &&
        images[nextIdx] &&
        images[nextIdx].complete &&
        images[nextIdx].naturalWidth > 0
      ) {
        return images[nextIdx];
      }
    }

    // 3. Fallback to frame 0
    if (images[0] && images[0].complete && images[0].naturalWidth > 0) {
      return images[0];
    }

    // 4. Any loaded frame
    for (const idx of loadedIndices) {
      if (images[idx] && images[idx].complete && images[idx].naturalWidth > 0) {
        return images[idx];
      }
    }

    return null;
  }

  /**
   * Draws the frame with object-fit: cover math.
   * Leverages the scaled coordinate system established by ctx.scale(dpr, dpr).
   */
  function renderFrame(index) {
    if (!canvas || !ctx || isDestroyed) return;

    const imgToDraw = getNearestLoadedImage(index);
    if (!imgToDraw || !imgToDraw.complete || !imgToDraw.naturalWidth) return;

    const actualIndex = imgToDraw._frameIndex ?? index;

    if (actualIndex === lastRenderedIndex && index !== actualIndex) {
      return;
    }

    lastRenderedIndex = actualIndex;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    ctx.clearRect(0, 0, viewportWidth, viewportHeight);

    // Object-fit: cover math (fill viewport, crop overflow)
    const scale = Math.max(
      viewportWidth / imgToDraw.naturalWidth,
      viewportHeight / imgToDraw.naturalHeight
    );
    const x = (viewportWidth - imgToDraw.naturalWidth * scale) / 2;
    const y = (viewportHeight - imgToDraw.naturalHeight * scale) / 2;

    ctx.drawImage(
      imgToDraw,
      x,
      y,
      imgToDraw.naturalWidth * scale,
      imgToDraw.naturalHeight * scale
    );
  }

  /**
   * Loads a single frame by effective index.
   */
  function loadSingleFrame(index) {
    if (images[index] && images[index].complete && images[index].naturalWidth > 0) {
      return Promise.resolve(images[index]);
    }

    if (loadingPromises.has(index)) {
      return loadingPromises.get(index);
    }

    const promise = new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img._frameIndex = index;

      img.onload = () => {
        images[index] = img;
        loadedIndices.add(index);
        loadingPromises.delete(index);
        loadedCount += 1;

        // Dispatch frame load event
        window.dispatchEvent(
          new CustomEvent('canvas-frame-loaded', {
            detail: {
              canvasId,
              cloudFolder,
              loadedCount,
              totalFrames: EFFECTIVE_FRAMES,
              isFirstFrame: index === 0,
              index,
            },
          })
        );

        // Update display if this frame is currently active or closer to view
        if (
          index === currentFrameIndex ||
          Math.abs(index - currentFrameIndex) < Math.abs(lastRenderedIndex - currentFrameIndex)
        ) {
          renderFrame(currentFrameIndex);
        }

        resolve(img);
      };

      img.onerror = () => {
        loadingPromises.delete(index);
        resolve(null);
      };

      const cloudinaryIndex = getCloudinaryIndex(index);
      img.src = getFrameURL(cloudFolder, cloudinaryIndex, CLOUD_TRANSFORM);
    });

    loadingPromises.set(index, promise);
    return promise;
  }

  /**
   * 3-Phase Progressive Preloader using EFFECTIVE_FRAMES
   */
  async function startProgressivePreload() {
    // Phase 1 — Instant Boot (~0.2s):
    await loadSingleFrame(0);
    renderFrame(0);

    window.dispatchEvent(
      new CustomEvent('section1-first-frame-ready', {
        detail: { canvasId, cloudFolder },
      })
    );

    const overlay = document.getElementById('loading-overlay');
    if (overlay && !overlay.classList.contains('loaded')) {
      overlay.classList.add('loaded');
    }

    // Phase 2 — Keyframe Striding (~1.0s):
    const keyframes = [];
    for (let i = 5; i < EFFECTIVE_FRAMES; i += 5) {
      keyframes.push(i);
    }
    if (keyframes[keyframes.length - 1] !== EFFECTIVE_FRAMES - 1) {
      keyframes.push(EFFECTIVE_FRAMES - 1);
    }

    const BATCH_SIZE = 10;
    for (let i = 0; i < keyframes.length; i += BATCH_SIZE) {
      if (isDestroyed) return;
      const batch = keyframes.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map((idx) => loadSingleFrame(idx)));
    }

    // Phase 3 — Background Fill:
    const remainingIndices = [];
    for (let i = 1; i < EFFECTIVE_FRAMES; i++) {
      if (!loadedIndices.has(i) && !loadingPromises.has(i)) {
        remainingIndices.push(i);
      }
    }

    const idleCallback =
      typeof window !== 'undefined' && window.requestIdleCallback
        ? window.requestIdleCallback.bind(window)
        : (cb) => setTimeout(() => cb({ timeRemaining: () => 15, didTimeout: false }), 25);

    function fillIntermediateFrames() {
      if (isDestroyed || remainingIndices.length === 0) return;

      idleCallback((deadline) => {
        if (isDestroyed) return;

        while (
          remainingIndices.length > 0 &&
          (deadline.timeRemaining() > 3 || deadline.didTimeout)
        ) {
          const nextIdx = remainingIndices.shift();
          if (!loadedIndices.has(nextIdx) && !loadingPromises.has(nextIdx)) {
            loadSingleFrame(nextIdx);
          }
        }

        if (remainingIndices.length > 0) {
          fillIntermediateFrames();
        }
      });
    }

    fillIntermediateFrames();
  }

  startProgressivePreload();

  // Change 4 — Canvas resize with devicePixelRatio:
  function resizeCanvas() {
    if (!canvas || !ctx || isDestroyed) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);
    renderFrame(currentFrameIndex);
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', resizeCanvas);
  resizeCanvas(); // call once on init

  /**
   * Updates scrub position and renders frame based on scroll progress (0..1).
   */
  function updateFromProgress(progress) {
    if (progress > 0.005 && !hasScrolled) {
      hasScrolled = true;
      window.dispatchEvent(
        new CustomEvent('hero-scrolled-started', {
          detail: { canvasId, progress },
        })
      );
    } else if (progress <= 0.005 && hasScrolled) {
      hasScrolled = false;
      window.dispatchEvent(
        new CustomEvent('hero-scrolled-reset', {
          detail: { canvasId, progress },
        })
      );
    }

    // Clamp frameIndex between 0 and EFFECTIVE_FRAMES - 1
    const targetIndex = Math.min(
      EFFECTIVE_FRAMES - 1,
      Math.max(0, Math.floor(progress * (EFFECTIVE_FRAMES - 1)))
    );

    if (targetIndex !== currentFrameIndex) {
      currentFrameIndex = targetIndex;
      renderFrame(currentFrameIndex);

      if (!loadedIndices.has(currentFrameIndex) && !loadingPromises.has(currentFrameIndex)) {
        loadSingleFrame(currentFrameIndex);
      }
    }

    // Text reveal threshold
    if (typeof textRevealAt === 'number') {
      if (progress >= textRevealAt && !textRevealed) {
        textRevealed = true;
        const event = new CustomEvent('revealText', {
          detail: { canvasId, progress, revealed: true },
        });
        canvas.dispatchEvent(event);
        window.dispatchEvent(event);
      } else if (progress < textRevealAt && textRevealed) {
        textRevealed = false;
        const event = new CustomEvent('revealText', {
          detail: { canvasId, progress, revealed: false },
        });
        canvas.dispatchEvent(event);
        window.dispatchEvent(event);
      }
    }
  }

  // GSAP ScrollTrigger configuration
  const formattedEnd =
    typeof pinDistance === 'number'
      ? `+=${pinDistance}px`
      : pinDistance.startsWith('+=')
        ? pinDistance
        : `+=${pinDistance}`;

  const trigger = ScrollTrigger.create({
    trigger: section,
    pin: true,
    scrub: true,
    start: 'top top',
    end: formattedEnd,
    onUpdate: (self) => {
      updateFromProgress(self.progress);
    },
  });

  /**
   * onScroll handler to immediately recalculate and update frames
   */
  function onScroll() {
    if (trigger && !isDestroyed) {
      trigger.update();
      updateFromProgress(trigger.progress);
    }
  }

  // Change 1 — Passive scroll listener:
  window.addEventListener('scroll', onScroll, { passive: true });

  // Change 2 — Touch event support:
  // Add to the canvas container element (not window):
  let lastTouchY = 0;
  container.addEventListener(
    'touchstart',
    (e) => {
      lastTouchY = e.touches[0].clientY;
    },
    { passive: true }
  );

  container.addEventListener(
    'touchmove',
    () => {
      onScroll();
    },
    { passive: true }
  );

  return {
    canvas,
    images,
    trigger,
    getNearestLoadedImage,
    onScroll,
    destroy() {
      isDestroyed = true;
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
      window.removeEventListener('scroll', onScroll);
      trigger.kill();
    },
  };
}
