/**
 * Initializes Section 04: Services (4-Card Grid)
 */
export function initServices() {
  const container = document.getElementById('services');
  if (!container) return;

  const services = [
    {
      title: 'Residential Design',
      desc: 'Bespoke residential environments shaped by daylight, tactile materiality, and tailored to your daily rituals.',
      icon: `
        <svg class="service-icon" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 16L20 6L34 16V34H6V16Z" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15 34V22H25V34" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 6V11" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M28 11V8H32V14" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
    },
    {
      title: 'Commercial Spaces',
      desc: 'Elevated hospitality, boutique workspaces, and retail destinations engineered for memorable human experience.',
      icon: `
        <svg class="service-icon" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="7" y="8" width="26" height="26" rx="1" stroke="#C9A96E" stroke-width="1.5"/>
          <line x1="7" y1="16" x2="33" y2="16" stroke="#C9A96E" stroke-width="1.5"/>
          <line x1="7" y1="24" x2="33" y2="24" stroke="#C9A96E" stroke-width="1.5"/>
          <line x1="16" y1="8" x2="16" y2="34" stroke="#C9A96E" stroke-width="1.5"/>
          <line x1="24" y1="8" x2="24" y2="34" stroke="#C9A96E" stroke-width="1.5"/>
        </svg>
      `,
    },
    {
      title: 'Furniture & Styling',
      desc: 'Curated European antiques, custom artisan millwork, and sensory textiles that bring enduring character.',
      icon: `
        <svg class="service-icon" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 22C9 18 12 15 16 15H24C28 15 31 18 31 22V26H9V22Z" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 26H33V29H7V26Z" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 29V35M28 29V35" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M20 7V15" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M15 7C15 7 17 9 20 9C23 9 25 7 25 7" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `,
    },
    {
      title: '3D Visualization',
      desc: 'Photorealistic architectural renderings and spatial animations that let you experience your future interior.',
      icon: `
        <svg class="service-icon" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L33 13.5V28.5L20 36L7 28.5V13.5L20 6Z" stroke="#C9A96E" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M20 21V36" stroke="#C9A96E" stroke-width="1.5"/>
          <path d="M20 21L33 13.5" stroke="#C9A96E" stroke-width="1.5"/>
          <path d="M20 21L7 13.5" stroke="#C9A96E" stroke-width="1.5"/>
        </svg>
      `,
    },
  ];

  const cardsHtml = services
    .map(
      (svc, index) => `
    <div class="service-card reveal-on-scroll" style="--reveal-delay: ${index * 0.1}s;">
      <div class="service-icon-wrap">
        ${svc.icon}
      </div>
      <h3 class="service-card-title">${svc.title}</h3>
      <p class="service-card-desc">${svc.desc}</p>
      <a href="#cta" class="service-card-link">Learn more &rarr;</a>
    </div>
  `
    )
    .join('');

  container.className = 'services-section';
  container.innerHTML = `
    <div class="services-container">
      <div class="services-header">
        <span class="services-label">WHAT WE OFFER</span>
        <h2 class="services-heading">OUR EXPERTISE</h2>
      </div>
      <div class="services-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}
