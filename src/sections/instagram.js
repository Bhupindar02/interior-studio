/**
 * Section 10: Instagram Photo Grid Section
 * Responsive 3-col (desktop) / 2-col (mobile) grid with 6 luxury architectural photos,
 * hover overlay with centered Instagram SVG icon, and profile link.
 */
export function initInstagram() {
  const container = document.getElementById('instagram');
  if (!container) return;

  const tiles = [
    {
      tone: 'cream',
      label: 'Limestone & Linen Dining Sanctuary',
      image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    },
    {
      tone: 'sage-green',
      label: 'Olive Courtyard & Fluted Plaster',
      image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
    },
    {
      tone: 'warm-amber',
      label: 'Sculptural Seating in Golden Hour Light',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    },
    {
      tone: 'terracotta',
      label: 'Handcrafted Terracotta & Earthen Ceramics',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    },
    {
      tone: 'white',
      label: 'Curved Plaster Architectural Void',
      image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
    },
    {
      tone: 'warm-grey',
      label: 'Honed Stone & Bronze Detailing',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const instagramIconSvg = `
    <svg class="insta-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="#FFFFFF" stroke-width="1.8"/>
      <circle cx="12" cy="12" r="4.2" stroke="#FFFFFF" stroke-width="1.8"/>
      <circle cx="17.3" cy="6.7" r="1.2" fill="#FFFFFF"/>
    </svg>
  `;

  const tilesHtml = tiles
    .map(
      (tile, index) => `
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        class="insta-tile insta-tile--${tile.tone}"
        aria-label="Instagram post ${index + 1}: ${tile.label}"
      >
        <img
          src="${tile.image}"
          alt="${tile.label} - Aura Studio Interior Architecture"
          class="insta-tile-img"
          loading="lazy"
        />
        <div class="insta-overlay">
          ${instagramIconSvg}
        </div>
      </a>
    `
    )
    .join('');

  container.innerHTML = `
    <div class="insta-container">
      <!-- Section Header -->
      <div class="insta-header">
        <h2 class="insta-heading">FOLLOW OUR JOURNEY</h2>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="insta-handle">@studiointeriors</a>
      </div>

      <!-- 6 Square Tiles Grid -->
      <div class="insta-grid">
        ${tilesHtml}
      </div>

      <!-- Below Grid Link -->
      <div class="insta-footer-link">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="insta-view-all">View All on Instagram &rarr;</a>
      </div>
    </div>
  `;
}
