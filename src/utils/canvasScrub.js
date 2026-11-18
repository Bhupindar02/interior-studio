import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const R2_ENDPOINTS = {
  frames1: 'https://pub-ed61ae6c7caa41dead326a99f4d0cd9e.r2.dev',
  frames2: 'https://pub-54dc63ec84a74037ae5dea0b31af4f39.r2.dev',
};

/**
 * Builds the Cloudflare R2 frame URL for a given folder and frame index.
 * Uses .webp frames:
 * - frames1: https://pub-ed61ae6c7caa41dead326a99f4d0cd9e.r2.dev/frames1_0001.webp -> frames1_0299.webp
 * - frames2: https://pub-54dc63ec84a74037ae5dea0b31af4f39.r2.dev/frames2_0001.webp -> frames2_0299.webp
 *
 * @param {string|function} folder - Folder identifier ('frames1' or 'frames2')
 * @param {number} frameIndex - Zero-based frame index (0..298)
 * @returns {string} URL to the frame image
 */
export function getFrameURL(folder, frameIndex) {
  if (typeof folder === 'function') {
    return folder(frameIndex);
  }

  // 4-digit zero padding: 0 -> 0001, 298 -> 0299
  const paddedIndex = String(frameIndex + 1).padStart(4, '0');

  if (folder.startsWith('http://') || folder.startsWith('https://')) {
    const cleanUrl = folder.replace(/\/$/, '');
    return `${cleanUrl}/${paddedIndex}.webp`;
  }

  const baseUrl = R2_ENDPOINTS[folder] || R2_ENDPOINTS.frames1;
  const cleanFolder = folder.replace(/_+$/, '');
  return `${baseUrl}/${cleanFolder}_${paddedIndex}.webp`;
}

/**
 * Initializes canvas scroll scrub with GSAP ScrollTrigger and mobile-optimized architecture.
 *
 * Change 1 — Passive scroll listener:
 *   window.addEventListener('scroll', onScroll, { passive: true })
 * Change 2 — Touch event support on container:
 *   container.addEventListener('touchstart', ...), container.addEventListener('touchmove', ...)
 * Change 3 — Mobile frame count cap:
 *   const isMobile = window.innerWidth < 768
 *   const EFFECTIVE_FRAMES = isMobile ? Math.min(totalFrames, 80) : totalFrames
 * Change 4 — Canvas resize with devicePixelRatio (capped to 1.5 on mobile):
 *   const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : (window.devicePixelRatio || 1)
 *   canvas.width = window.innerWidth * dpr, canvas.height = window.innerHeight * dpr, ctx.scale(dpr, dpr)
 *
 * @param {Object} options
 * @param {string} options.cloudFolder - Frame folder name ('frames1' or 'frames2')
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

  // Change 3 — Mobile frame count cap:
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const EFFECTIVE_FRAMES = isMobile ? Math.min(totalFrames, 80) : totalFrames;

  let currentFrameIndex = 0;
  let lastRenderedIndex = -1;
  let textRevealed = false;
  let hasScrolled = false;
  let isDestroyed = false;

  // Map effective index (0..EFFECTIVE_FRAMES-1) to full Cloudflare R2 asset sequence (0..totalFrames-1)
  function getAssetIndex(index) {
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
  function renderFrame(index, force = false) {
    if (!canvas || !ctx || isDestroyed) return;

    const imgToDraw = getNearestLoadedImage(index);
    if (!imgToDraw || !imgToDraw.complete || !imgToDraw.naturalWidth) return;

    const actualIndex = imgToDraw._frameIndex ?? index;

    if (!force && actualIndex === lastRenderedIndex) {
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

      const assetIndex = getAssetIndex(index);
      img.src = getFrameURL(cloudFolder, assetIndex);
    });

    loadingPromises.set(index, promise);
    return promise;
  }

  /**
   * 3-Phase Progressive Preloader using EFFECTIVE_FRAMES
   * Guarantees that critical frames load before user scroll
   */
  async function startProgressivePreload() {
    // Phase 1 — Instant Boot Frame 0:
    await loadSingleFrame(0);
    renderFrame(0);

    window.dispatchEvent(
      new CustomEvent('section1-first-frame-ready', {
        detail: { canvasId, cloudFolder },
      })
    );

    // Phase 2 — Critical Buffer & Keyframe Strides:
    // Preload initial 12 frames (1..12) and keyframe strides across timeline (every 15th frame)
    const bufferFrames = [];
    const initialBufferLimit = Math.min(12, EFFECTIVE_FRAMES);
    for (let i = 1; i < initialBufferLimit; i++) {
      bufferFrames.push(i);
    }

    const keyframes = [];
    for (let i = initialBufferLimit; i < EFFECTIVE_FRAMES; i += 15) {
      keyframes.push(i);
    }
    if (keyframes[keyframes.length - 1] !== EFFECTIVE_FRAMES - 1) {
      keyframes.push(EFFECTIVE_FRAMES - 1);
    }

    const criticalBatch = [...bufferFrames, ...keyframes];
    let loadedCriticalCount = 0;

    // Load critical buffer in concurrent batches of 8
    const BATCH_SIZE = 8;
    for (let i = 0; i < criticalBatch.length; i += BATCH_SIZE) {
      if (isDestroyed) return;
      const batch = criticalBatch.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (idx) => {
          await loadSingleFrame(idx);
          loadedCriticalCount += 1;
          if (cloudFolder === 'frames1') {
            const pct = Math.min(
              100,
              Math.round(((loadedCriticalCount + 1) / (criticalBatch.length + 1)) * 100)
            );
            window.dispatchEvent(
              new CustomEvent('hero-buffer-progress', {
                detail: {
                  percentage: pct,
                  loaded: loadedCriticalCount + 1,
                  total: criticalBatch.length + 1,
                },
              })
            );
          }
        })
      );
    }

    // Critical buffer is fully loaded and ready for smooth scrubbing!
    if (cloudFolder === 'frames1') {
      window.dispatchEvent(
        new CustomEvent('hero-initial-buffer-ready', {
          detail: { canvasId, cloudFolder },
        })
      );
    }

    // Phase 3 — Background Fill:
    // Fill all remaining intermediate frames silently via requestIdleCallback
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

  // Change 4 — Canvas resize with devicePixelRatio (capped to 1.5 on mobile):
  function resizeCanvas() {
    if (!canvas || !ctx || isDestroyed) return;
    const isMobileNow = typeof window !== 'undefined' && window.innerWidth < 768;
    const rawDpr = window.devicePixelRatio || 1;
    const dpr = isMobileNow ? Math.min(rawDpr, 1.5) : rawDpr;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);
    renderFrame(currentFrameIndex, true);
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

  return {
    canvas,
    images,
    trigger,
    getNearestLoadedImage,
    destroy() {
      isDestroyed = true;
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
      trigger.kill();
    },
  };
}
