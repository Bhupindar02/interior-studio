import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 11: Book a Consultation CTA Section
 * Deep warm background with warm spotlight radial texture, centered content block,
 * primary & secondary buttons, and GSAP scale+fade entrance.
 */
export function initCta() {
  const container = document.getElementById('cta');
  if (!container) return;

  container.innerHTML = `
    <div class="cta-content-block">
      <span class="cta-label">GET STARTED</span>
      <h2 class="cta-heading">READY TO TRANSFORM YOUR SPACE?</h2>
      <p class="cta-subtext">
        Book a complimentary 30-minute consultation with our lead designer.
        We'll discuss your vision, your space, and the possibilities.
      </p>
      <div class="cta-buttons-group">
        <a href="mailto:inquire@aurastudio.com?subject=Consultation%20Inquiry%20-%20Aura%20Studio" class="cta-btn-primary">
          Book a Consultation
        </a>
        <a href="#portfolio" class="cta-btn-secondary">
          View Our Portfolio &rarr;
        </a>
      </div>
    </div>
  `;

  // Animate in on scroll (ScrollTrigger start: 'top 70%'): opacity 0->1 + scale 0.96->1, 0.7s ease
  const contentBlock = container.querySelector('.cta-content-block');
  if (contentBlock) {
    gsap.fromTo(
      contentBlock,
      {
        opacity: 0,
        scale: 0.96,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          once: true,
        },
      }
    );
  }
}
