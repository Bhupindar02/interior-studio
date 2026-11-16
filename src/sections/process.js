/**
 * Section 07: The Process (4-Step How We Work)
 * Charcoal background, gold connecting line, numbered step circles,
 * hardware-accelerated compositor-thread scroll reveal.
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
      <div class="process-step reveal-on-scroll" data-step="${index + 1}" style="--reveal-delay: ${index * 0.12}s;">
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
}
