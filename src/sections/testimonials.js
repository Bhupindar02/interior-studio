/**
 * Section 08: Client Testimonials
 * 4 luxury client review cards in a 4-column side-by-side grid on desktop,
 * with real photo avatars, gold star ratings, editorial italic quotes, and project tags.
 * Entrance animation offloaded to compositor-thread scroll reveal.
 */
export function initTestimonials() {
  const container = document.getElementById('testimonials');
  if (!container) return;

  const testimonials = [
    {
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80',
      initials: 'LS',
      name: 'Lord & Lady Sterling',
      city: 'London, UK',
      quote:
        '“AURA transformed our Mayfair penthouse into a sanctuary of warmth and timeless luxury. Their bespoke millwork and quiet light are unmatched...”',
      projectTag: 'RESIDENTIAL — MAYFAIR, LONDON',
    },
    {
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80',
      initials: 'MR',
      name: 'Marcello Rossi',
      city: 'Lake Como, Italy',
      quote:
        '“Working with the AURA team felt like a masterclass in architectural harmony. The living room framing the lake is an absolute daily joy...”',
      projectTag: 'VILLA ARCHITECTURE — LAKE COMO',
    },
    {
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
      initials: 'ER',
      name: 'Elena Rostova',
      city: 'Paris, France',
      quote:
        '“Flawless execution from concept drawings to the final marble island installation. Truly white-glove service throughout the renovation...”',
      projectTag: 'HERITAGE RENOVATION — PARIS',
    },
    {
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80',
      initials: 'AK',
      name: 'Ananya Kapoor',
      city: 'Mumbai, India',
      quote:
        '“They transformed our apartment into something right out of a design magazine. Every single detail feels intentional, calming, and deeply timeless...”',
      projectTag: 'RESIDENTIAL — BANDRA, MUMBAI',
    },
  ];

  // SVG 5-star rating icon
  const starSvg = `
    <svg class="testimonial-star" width="14" height="14" viewBox="0 0 16 16" fill="#C9A96E" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0.5L10.3 5.2L15.5 6L11.7 9.7L12.6 14.9L8 12.5L3.4 14.9L4.3 9.7L0.5 6L5.7 5.2L8 0.5Z" />
    </svg>
  `;
  const fiveStarsHtml = `<div class="testimonial-stars-row" aria-label="5 out of 5 stars">${starSvg.repeat(5)}</div>`;

  const cardsHtml = testimonials
    .map(
      (item, index) => `
      <article class="testimonial-card reveal-on-scroll" data-index="${index}" style="--reveal-delay: ${index * 0.12}s;">
        <div class="testimonial-card-top">
          <div class="testimonial-avatar-wrapper">
            <img
              class="testimonial-avatar-img"
              src="${item.avatar}"
              alt="${item.name}"
              loading="lazy"
              decoding="async"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div class="testimonial-avatar-fallback" style="display: none;">${item.initials}</div>
          </div>
          <div class="testimonial-client-meta">
            <h4 class="testimonial-client-name">${item.name}</h4>
            <span class="testimonial-client-city">${item.city}</span>
          </div>
        </div>

        ${fiveStarsHtml}

        <p class="testimonial-quote">${item.quote}</p>

        <div class="testimonial-project-tag">${item.projectTag}</div>
      </article>
    `
    )
    .join('');

  container.innerHTML = `
    <div class="testimonials-container">
      <!-- Section Header -->
      <div class="testimonials-header">
        <span class="testimonials-label">CLIENT LOVE</span>
        <h2 class="testimonials-heading">WHAT OUR CLIENTS SAY</h2>
      </div>

      <!-- 4 Testimonial Cards Grid (Side-by-Side on Desktop, Responsive Carousel on Mobile) -->
      <div class="testimonials-grid-wrapper">
        <div class="testimonials-grid" id="testimonials-grid" role="region" aria-label="Client testimonials">
          ${cardsHtml}
        </div>
      </div>
    </div>
  `;
}
