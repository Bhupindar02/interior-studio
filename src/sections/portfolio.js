import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 06: Selected Works Portfolio Section
 * Horizontal scroll gallery with custom drag-to-scroll, card hover reveals,
 * and category tags.
 */
export function initPortfolio() {
  const container = document.getElementById('portfolio');
  if (!container) return;

  const projects = [
    {
      id: 'andheri-residence',
      name: 'Andheri Residence',
      category: 'RESIDENTIAL',
      subtitle: 'Sunlit brutalist sanctuary with textured limestone & custom walnut joinery',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85',
    },
    {
      id: 'lower-parel-office',
      name: 'Lower Parel Office',
      category: 'COMMERCIAL',
      subtitle: 'High-ceiling creative headquarters with fluted glass and brushed bronze',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85',
    },
    {
      id: 'bandra-villa',
      name: 'Bandra Villa',
      category: 'RESIDENTIAL',
      subtitle: 'Double-height coastal residence with travertine terrace & organic linen',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
    },
    {
      id: 'worli-penthouse',
      name: 'Worli Penthouse',
      category: 'RESIDENTIAL',
      subtitle: 'Skyline residence with monolithic marble fireplace & silk wall panels',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
    },
    {
      id: 'juhu-townhouse',
      name: 'Juhu Townhouse',
      category: 'RESIDENTIAL',
      subtitle: 'Tactile minimalist retreat with internal garden courtyard & lime plaster',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85',
    },
    {
      id: 'bkc-studio',
      name: 'BKC Studio',
      category: 'COMMERCIAL',
      subtitle: 'Bespoke financial advisory suite featuring smoked oak and acoustic felt',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85',
    },
  ];

  const cardsHtml = projects
    .map(
      (project, index) => `
      <article class="portfolio-card" data-index="${index}">
        <div class="portfolio-img-wrap">
          <img
            src="${project.image}"
            alt="${project.name} - ${project.category} Architecture and Interior Design"
            class="portfolio-img"
            loading="lazy"
          />
          <div class="portfolio-img-overlay">
            <span class="portfolio-hover-cta">View Project &rarr;</span>
          </div>
        </div>
        <div class="portfolio-card-info">
          <span class="portfolio-category-tag">${project.category}</span>
          <h3 class="portfolio-project-name">${project.name}</h3>
        </div>
      </article>
    `
    )
    .join('');

  container.innerHTML = `
    <div class="portfolio-section-inner">
      <!-- Section Header -->
      <div class="portfolio-header">
        <span class="portfolio-label">OUR WORK</span>
        <h2 class="portfolio-heading">SELECTED PROJECTS</h2>
        <p class="portfolio-subtext">
          A collection of spaces we've had the privilege to design
        </p>
      </div>

      <!-- Horizontal Scroll Gallery -->
      <div class="portfolio-gallery-wrapper">
        <div class="portfolio-gallery" id="portfolio-gallery" role="region" aria-label="Selected Projects Carousel">
          ${cardsHtml}
        </div>
      </div>
    </div>
  `;

  // Drag-to-scroll implementation
  const gallery = document.getElementById('portfolio-gallery');
  if (!gallery) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasMoved = false;

  // Mouse drag handlers
  gallery.addEventListener('mousedown', (e) => {
    isDown = true;
    hasMoved = false;
    gallery.classList.add('is-dragging');
    gallery.style.scrollSnapType = 'none'; // Temporarily disable snap during active drag for smooth response
    startX = e.pageX - gallery.offsetLeft;
    scrollLeft = gallery.scrollLeft;
  });

  const onMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - gallery.offsetLeft;
    const walk = (x - startX) * 1.35; // Responsive scroll factor
    if (Math.abs(walk) > 4) {
      hasMoved = true;
    }
    gallery.scrollLeft = scrollLeft - walk;
  };

  const onMouseUp = () => {
    if (!isDown) return;
    isDown = false;
    gallery.classList.remove('is-dragging');
    // Restore snap behavior on release
    gallery.style.scrollSnapType = 'x mandatory';
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  // Prevent click triggering if user was dragging
  gallery.addEventListener('click', (e) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      hasMoved = false;
    }
  });

  // GSAP scroll trigger for staggered card entrance
  const cards = container.querySelectorAll('.portfolio-card');
  if (cards.length > 0) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
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
