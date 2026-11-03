import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 08: Client Testimonials
 * Horizontal drag-scroll carousel displaying 5 luxury client review cards,
 * gold star ratings, client initials avatar, and disclaimer.
 */
export function initTestimonials() {
  const container = document.getElementById('testimonials');
  if (!container) return;

  const testimonials = [
    {
      initials: 'AM',
      name: 'Aarav Mehta',
      city: 'Bandra, Mumbai',
      quote:
        '“They transformed our apartment into something from a magazine. The way sunlight moves through the limestone finishes is pure poetry.”',
      projectTag: 'Residential — Bandra, Mumbai',
    },
    {
      initials: 'PS',
      name: 'Priya Sharma',
      city: 'Worli, Mumbai',
      quote:
        '“Absolute mastery over scale and texture. Every custom fixture feels intentional, calming, and deeply tailored to how our family lives.”',
      projectTag: 'Residential — Worli, Mumbai',
    },
    {
      initials: 'RK',
      name: 'Rohan Kapoor',
      city: 'Lower Parel, Mumbai',
      quote:
        '“Our creative headquarters has become a benchmark for client hospitality. The team handled design through execution with effortless poise.”',
      projectTag: 'Commercial — Lower Parel, Mumbai',
    },
    {
      initials: 'ND',
      name: 'Nisha Dalal',
      city: 'Juhu, Mumbai',
      quote:
        '“From raw concrete to an ethereal sanctuary. Aura Studio created spaces that bring quiet clarity at the end of every busy day.”',
      projectTag: 'Residential — Juhu, Mumbai',
    },
    {
      initials: 'VK',
      name: 'Vikram Khurana',
      city: 'BKC, Mumbai',
      quote:
        '“Impeccable acoustic balance, tailored smoked oak millwork, and refined detailing that immediately sets our advisory practice apart.”',
      projectTag: 'Commercial — BKC, Mumbai',
    },
  ];

  // SVG 5-star rating icon
  const starSvg = `
    <svg class="testimonial-star" width="16" height="16" viewBox="0 0 16 16" fill="#C9A96E" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0.5L10.3 5.2L15.5 6L11.7 9.7L12.6 14.9L8 12.5L3.4 14.9L4.3 9.7L0.5 6L5.7 5.2L8 0.5Z" />
    </svg>
  `;
  const fiveStarsHtml = `<div class="testimonial-stars-row" aria-label="5 out of 5 stars">${starSvg.repeat(5)}</div>`;

  const cardsHtml = testimonials
    .map(
      (item, index) => `
      <article class="testimonial-card" data-index="${index}">
        <div class="testimonial-card-top">
          <div class="testimonial-avatar" aria-hidden="true">${item.initials}</div>
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

      <!-- Horizontal Drag-Scroll Carousel -->
      <div class="testimonials-carousel-wrapper">
        <div class="testimonials-carousel" id="testimonials-carousel" role="region" aria-label="Client testimonials slider">
          ${cardsHtml}
        </div>
      </div>

      <!-- Disclaimer Below Carousel -->
      <p class="testimonials-disclaimer">All reviews are unpaid and shared with permission</p>
    </div>
  `;

  // Drag-to-scroll implementation
  const carousel = document.getElementById('testimonials-carousel');
  if (!carousel) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasMoved = false;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    hasMoved = false;
    carousel.classList.add('is-dragging');
    carousel.style.scrollSnapType = 'none'; // Temporarily disable snap during active drag
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  const onMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.35;
    if (Math.abs(walk) > 4) {
      hasMoved = true;
    }
    carousel.scrollLeft = scrollLeft - walk;
  };

  const onMouseUp = () => {
    if (!isDown) return;
    isDown = false;
    carousel.classList.remove('is-dragging');
    carousel.style.scrollSnapType = 'x mandatory'; // Restore snap behavior
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  carousel.addEventListener('click', (e) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      hasMoved = false;
    }
  });

  // Staggered GSAP scroll entrance animation
  const cards = container.querySelectorAll('.testimonial-card');
  if (cards.length > 0) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
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
