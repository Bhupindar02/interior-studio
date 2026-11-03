import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 07: The Process (4-Step How We Work)
 * Charcoal background, gold connecting line, numbered step circles,
 * staggered GSAP scroll entrance.
 */
export function initProcess() {
  const container = document.getElementById('process');
  if (!container) return;

  const steps = [
    {
      num: '01',
      title: 'Discovery & Brief',
      desc: 'In-depth consultation to map your lifestyle, spatial aspirations, and functional timeline.',
    },
    {
      num: '02',
      title: 'Concept Design',
      desc: 'Bespoke spatial layouts, 3D visualizations, and architectural material palettes.',
    },
    {
      num: '03',
      title: 'Material Sourcing',
      desc: 'Direct procurement of natural stone, custom millwork, rare textiles, and artisan finishes.',
    },
    {
      num: '04',
      title: 'Final Delivery',
      desc: 'Rigorous on-site realization, bespoke white-glove staging, and seamless turnkey handover.',
    },
  ];

  const stepsHtml = steps
    .map(
      (step, index) => `
      <div class="process-step" data-step="${index + 1}">
        <div class="process-num-circle">
          <span class="process-num-text">${step.num}</span>
        </div>
        <h3 class="process-step-title">${step.title}</h3>
        <p class="process-step-desc">${step.desc}</p>
      </div>
    `
    )
    .join('');

  container.innerHTML = `
    <div class="process-container">
      <!-- Section Header -->
      <div class="process-header">
        <span class="process-label">HOW WE WORK</span>
        <h2 class="process-heading">THE PROCESS</h2>
      </div>

      <!-- 4-Step Row / Grid -->
      <div class="process-grid">
        ${stepsHtml}
      </div>
    </div>
  `;

  // Staggered GSAP ScrollTrigger entrance: opacity 0->1 + translateX -20px->0
  const stepElements = container.querySelectorAll('.process-step');
  if (stepElements.length > 0) {
    gsap.fromTo(
      stepElements,
      {
        opacity: 0,
        x: -20,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
          once: true,
        },
      }
    );
  }
}
