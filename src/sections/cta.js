/**
 * Section 11: Book a Consultation CTA Section
 * Deep warm background with warm spotlight radial texture, centered content block,
 * primary & secondary buttons, with compositor-thread scroll reveal.
 */
export function initCta() {
  const container = document.getElementById('cta');
  if (!container) return;

  container.innerHTML = `
    <div class="cta-content-block reveal-on-scroll">
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
}
