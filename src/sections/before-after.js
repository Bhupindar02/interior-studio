import { gsap } from 'gsap';

/**
 * Initializes Section 03: Before & After (Interactive Drag Reveal Slider)
 */
export function initBeforeAfter() {
  const container = document.getElementById('before-after');
  if (!container) return;

  container.className = 'ba-section';
  container.innerHTML = `
    <!-- Header Block Above Slider -->
    <div class="ba-header-block">
      <span class="ba-label">TRANSFORMATION</span>
      <h2 class="ba-heading">BEFORE &amp; AFTER</h2>
      <p class="ba-subtitle">Drag to reveal the transformation</p>
      <div class="ba-oscillation-arrow" aria-hidden="true">
        <svg width="28" height="14" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 7H24M4 7L8 3M4 7L8 11M24 7L20 3M24 7L20 11" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- Full-Width Slider Container -->
    <div class="ba-slider-container" id="ba-slider-container">
      <!-- Layer 1 (Bottom): AFTER Image (Warm Luxury Living Room Sanctuary) -->
      <div
        class="ba-layer-after"
        id="ba-layer-after"
        style="background-image: url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85');"
      >
        <div class="ba-badge-after">AFTER</div>
      </div>

      <!-- Layer 2 (Top): BEFORE Image (Exact Unfinished Raw Concrete Construction Shell) -->
      <div
        class="ba-layer-before"
        id="ba-layer-before"
        style="background-image: url('/before-construction.jpg');"
      >
        <div class="ba-badge-before">BEFORE</div>
      </div>

      <!-- Vertical Divider Line -->
      <div class="ba-divider-line" id="ba-divider-line"></div>

      <!-- Drag Handle Circle -->
      <div class="ba-handle-circle" id="ba-handle-circle" role="slider" aria-label="Before and after comparison slider" aria-valuenow="50" tabindex="0">
        <svg class="ba-handle-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 9H12.5M5.5 9L8 6.5M5.5 9L8 11.5M12.5 9L10 6.5M12.5 9L10 11.5" stroke="#1A1A1A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- Editorial Stats Row Below Slider -->
    <div class="ba-stats-row">
      <div class="ba-stat-box">
        <div class="ba-stat-num">200+</div>
        <div class="ba-stat-label">Projects Completed</div>
      </div>
      <div class="ba-stat-divider" aria-hidden="true"></div>
      <div class="ba-stat-box">
        <div class="ba-stat-num">15</div>
        <div class="ba-stat-label">Years of Experience</div>
      </div>
      <div class="ba-stat-divider" aria-hidden="true"></div>
      <div class="ba-stat-box">
        <div class="ba-stat-num">50+</div>
        <div class="ba-stat-label">Design Awards</div>
      </div>
    </div>
  `;

  const slider = document.getElementById('ba-slider-container');
  const beforeImg = document.getElementById('ba-layer-before');
  const divider = document.getElementById('ba-divider-line');
  const handle = document.getElementById('ba-handle-circle');

  if (!slider || !beforeImg || !divider || !handle) return;

  let currentPercent = 50;
  let isDragging = false;
  let hasAutoDemoed = false;
  let autoDemoTween = null;
  let rafId = null;

  // Core function to update the slider visuals
  function updateSlider(percent, instant = true) {
    currentPercent = percent;

    if (instant) {
      beforeImg.style.transition = 'none';
      divider.style.transition = 'none';
      handle.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    } else {
      beforeImg.style.transition = 'clip-path 0.15s ease';
      divider.style.transition = 'left 0.15s ease';
      handle.style.transition = 'left 0.15s ease, transform 0.2s ease, box-shadow 0.2s ease';
    }

    divider.style.left = `${percent}%`;
    handle.style.left = `${percent}%`;
    beforeImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    handle.setAttribute('aria-valuenow', Math.round(percent));
  }

  // Initialize at 50%
  updateSlider(50, false);

  // Auto-demo animation: slides to 22% then back to 50% when 40% visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAutoDemoed && !isDragging) {
          hasAutoDemoed = true;
          observer.disconnect();

          const demoState = { percent: 50 };
          autoDemoTween = gsap.to(demoState, {
            percent: 22,
            duration: 0.9,
            ease: 'power2.inOut',
            onUpdate: () => {
              updateSlider(demoState.percent, false);
            },
            onComplete: () => {
              autoDemoTween = gsap.to(demoState, {
                percent: 50,
                duration: 0.9,
                delay: 0.5,
                ease: 'power2.inOut',
                onUpdate: () => {
                  updateSlider(demoState.percent, false);
                },
                onComplete: () => {
                  autoDemoTween = null;
                },
              });
            },
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(container);

  // Cancel any active auto demo if user interacts
  function interruptAutoDemo() {
    if (autoDemoTween) {
      autoDemoTween.kill();
      autoDemoTween = null;
    }
    hasAutoDemoed = true;
  }

  // Drag Event Handlers
  function onDrag(e) {
    if (!isDragging) return;

    const containerRect = slider.getBoundingClientRect();
    const clientX =
      e.clientX !== undefined
        ? e.clientX
        : e.touches && e.touches[0]
          ? e.touches[0].clientX
          : 0;

    let percent = ((clientX - containerRect.left) / containerRect.width) * 100;
    percent = Math.max(2, Math.min(98, percent)); // Clamp between 2% and 98%

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      updateSlider(percent, true);
    });
  }

  function startDrag(e) {
    interruptAutoDemo();
    isDragging = true;
    handle.classList.add('active');
    slider.classList.add('is-dragging');
    onDrag(e);
  }

  function stopDrag() {
    if (!isDragging) return;
    isDragging = false;
    handle.classList.remove('active');
    slider.classList.remove('is-dragging');
    updateSlider(currentPercent, false); // Apply 0.15s ease on release
  }

  // Mouse Listeners
  slider.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);

  // Touch Listeners (passive: true)
  slider.addEventListener('touchstart', startDrag, { passive: true });
  document.addEventListener('touchmove', onDrag, { passive: true });
  document.addEventListener('touchend', stopDrag, { passive: true });

  // Keyboard navigation for accessibility
  handle.addEventListener('keydown', (e) => {
    interruptAutoDemo();
    if (e.key === 'ArrowLeft') {
      updateSlider(Math.max(2, currentPercent - 5), false);
    } else if (e.key === 'ArrowRight') {
      updateSlider(Math.min(98, currentPercent + 5), false);
    }
  });
}
