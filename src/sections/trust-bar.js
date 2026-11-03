/**
 * Initializes Section 02: Trust Bar (Awards & Press Recognition Strip)
 * Placed directly below the hero section.
 */
export function initTrustBar() {
  const container = document.getElementById('trust-bar');
  if (!container) return;

  const brands = [
    'ELLE DECOR',
    'ARCHITECTURAL DIGEST',
    'ID AWARDS 2024',
    'DESIGN WEEK',
    'DESIGNLINES',
    'BETTER HOMES',
    'FHM DESIGN',
    'DEZEEN',
    'WALLPAPER*',
  ];

  // Helper to render badge HTML
  const renderBadgeGroup = (items) =>
    items
      .map(
        (brand) => `
        <div class="trust-badge">
          <span>${brand}</span>
        </div>
      `
      )
      .join('');

  // Duplicate items within each group to ensure full coverage across all viewport widths
  const groupHtml = renderBadgeGroup([...brands, ...brands]);

  container.className = 'trust-section';
  container.innerHTML = `
    <div class="trust-container">
      <div class="trust-label">AS RECOGNISED BY</div>
      <div class="trust-marquee" aria-label="Press and awards recognition">
        <div class="trust-marquee-track">
          <div class="trust-marquee-group">
            ${groupHtml}
          </div>
          <div class="trust-marquee-group" aria-hidden="true">
            ${groupHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}
