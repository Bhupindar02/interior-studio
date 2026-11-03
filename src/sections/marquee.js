/**
 * Section 09: Scrolling Luxury Quote Marquee Strip
 * Pure CSS infinite ticker displaying brand philosophy in gold Playfair Display italic.
 */
export function initMarquee() {
  const container = document.getElementById('marquee');
  if (!container) return;

  const phraseGroup = `
    <span class="marquee-group">
      <span>Great Design Changes How You Feel</span>
      <span class="marquee-diamond" aria-hidden="true">◆</span>
      <span>Every Room Has A Story</span>
      <span class="marquee-diamond" aria-hidden="true">◆</span>
      <span>Design With Intention</span>
      <span class="marquee-diamond" aria-hidden="true">◆</span>
      <span>Details Define Excellence</span>
      <span class="marquee-diamond" aria-hidden="true">◆</span>
      <span>Space Is Emotion</span>
      <span class="marquee-diamond" aria-hidden="true">◆</span>
    </span>
  `;

  // Render duplicated phrase set for seamless infinite loop
  container.innerHTML = `
    <div class="marquee-track" aria-hidden="true">
      ${phraseGroup}
      ${phraseGroup}
    </div>
  `;
}
