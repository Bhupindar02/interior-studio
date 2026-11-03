/**
 * Section 12: Site Footer
 * Near black background (#111111), brand column & 3 link columns,
 * scrolling keyword strip marquee, and copyright bar.
 */
export function initFooter() {
  const container = document.getElementById('footer');
  if (!container) return;

  const keywordPhrase = `
    <span class="footer-keyword-group">
      <span>Interior Design</span> <span class="footer-dot">&middot;</span>
      <span>Space Planning</span> <span class="footer-dot">&middot;</span>
      <span>Luxury Homes</span> <span class="footer-dot">&middot;</span>
      <span>Commercial Design</span> <span class="footer-dot">&middot;</span>
      <span>Home Styling</span> <span class="footer-dot">&middot;</span>
      <span>3D Visualization</span> <span class="footer-dot">&middot;</span>
      <span>Mumbai</span> <span class="footer-dot">&middot;</span>
      <span>India</span> <span class="footer-dot">&middot;</span>
    </span>
  `;

  container.innerHTML = `
    <!-- Top Section (80px padding-top) -->
    <div class="footer-top-wrap">
      <div class="footer-top-inner">
        <!-- Left Brand Info -->
        <div class="footer-brand">
          <h3 class="footer-brand-name">AURA STUDIO</h3>
          <p class="footer-tagline">Crafting spaces since 2009</p>
        </div>

        <!-- Three Link Columns (flex, evenly spaced) -->
        <div class="footer-links-group">
          <!-- Column 1: Studio -->
          <div class="footer-col">
            <h4 class="footer-col-title">Studio</h4>
            <ul class="footer-col-list">
              <li><a href="#about" class="footer-link">About</a></li>
              <li><a href="#awards" class="footer-link">Awards</a></li>
              <li><a href="#journal" class="footer-link">Journal</a></li>
              <li><a href="#careers" class="footer-link">Careers</a></li>
              <li><a href="#press" class="footer-link">Press</a></li>
            </ul>
          </div>

          <!-- Column 2: Services -->
          <div class="footer-col">
            <h4 class="footer-col-title">Services</h4>
            <ul class="footer-col-list">
              <li><a href="#services" class="footer-link">Residential</a></li>
              <li><a href="#services" class="footer-link">Commercial</a></li>
              <li><a href="#services" class="footer-link">Furniture</a></li>
              <li><a href="#services" class="footer-link">3D Visualization</a></li>
              <li><a href="#cta" class="footer-link">Consultation</a></li>
            </ul>
          </div>

          <!-- Column 3: Connect -->
          <div class="footer-col">
            <h4 class="footer-col-title">Connect</h4>
            <ul class="footer-col-list">
              <li><a href="#cta" class="footer-link">Contact Us</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="footer-link">Instagram</a></li>
              <li><a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" class="footer-link">Pinterest</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="footer-link">LinkedIn</a></li>
              <li><a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" class="footer-link">WhatsApp</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Scrolling Keyword Strip Above Copyright Bar -->
    <div class="footer-keyword-strip" aria-hidden="true">
      <div class="footer-keyword-track">
        ${keywordPhrase}
        ${keywordPhrase}
        ${keywordPhrase}
      </div>
    </div>

    <!-- Bottom Copyright Bar -->
    <div class="footer-bottom-wrap">
      <div class="footer-bottom-inner">
        <div class="footer-copyright">
          &copy; 2025 Aura Studio. All rights reserved.
        </div>
        <div class="footer-legal">
          <a href="#privacy" class="footer-legal-link">Privacy Policy</a>
          <span class="footer-legal-sep">/</span>
          <a href="#terms" class="footer-legal-link">Terms</a>
          <span class="footer-legal-sep">/</span>
          <a href="#sitemap" class="footer-legal-link">Sitemap</a>
        </div>
      </div>
    </div>
  `;
}
