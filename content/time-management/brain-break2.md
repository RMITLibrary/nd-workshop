---
title: "Brain break 2"
weight: 6
excludeFromProgress: true
---
<style>
#fidget-wrapper {
  max-width: 856px;
  margin: 2rem auto;
  background: #d9d9dd;      /* page background */
  padding: 40px;
}
#fidget {
  position: relative;
  height: 120px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.fidget-rect {
  flex: 1;
  height: 40px;
  transition: flex 0.4s ease, background-color 0.3s ease;
  cursor: pointer;
}
.fidget-rect.active {
  flex: 2;                  /* grow on hover/active */
}
.fidget-rect:nth-child(1) { background:#0074b8; }
.fidget-rect:nth-child(2) { background:#f6d3b2; }
.fidget-rect:nth-child(3) { background:#8b9a18; }
.fidget-rect:nth-child(4) { background:#8b3f73; }
.fidget-rect:nth-child(5) { background:#d99ab9; }

/* “squiggle” – a simple SVG path positioned above boxes */
#fidget-arrow {
  position:absolute;
  left:0;
  right:0;
  top:0;
  height:100%;
  pointer-events:none;
}
#fidget-arrow path {
  stroke:#ffe900;
  stroke-width:10;
  fill:none;
  stroke-linecap:round;
  stroke-linejoin:round;
  transition: d 0.4s ease;  /* browsers will morph between similar paths */
}
</style>
<div class="content-856px-max">
  <p class="lead">Add fidget</p>
</div>
<div id="fidget-wrapper">
  <div id="fidget">
    <svg id="fidget-arrow" viewBox="0 0 100 40" preserveAspectRatio="none"><path id="arrow-path" d="M5 28 C 25 5, 45 5, 60 20 S 95 35, 95 35" /></svg>
    <div class="fidget-rect"></div>
    <div class="fidget-rect"></div>
    <div class="fidget-rect"></div>
    <div class="fidget-rect"></div>
    <div class="fidget-rect"></div>
  </div>
</div>
<script>
(function() {
  const rects = Array.from(document.querySelectorAll('.fidget-rect'));
  const arrowPath = document.getElementById('arrow-path');
  // simple arrays of colours to cycle through on click
  const palette = ['#ffffff','#f6d3b2','#8b9a18','#8b3f73','#d99ab9'];
  rects.forEach((rect, index) => {
    rect.dataset.colorIndex = '0';
    rect.addEventListener('mouseenter', () => {
      rects.forEach(r => r.classList.remove('active'));
      rect.classList.add('active');
      updateArrowToRect(index);
    });
    rect.addEventListener('click', () => {
      let i = Number(rect.dataset.colorIndex);
      i = (i + 1) % palette.length;
      rect.dataset.colorIndex = String(i);
      rect.style.backgroundColor = palette[i];
    });
  });
  function updateArrowToRect(idx) {
    // rough mapping of target x positions along the bar (0–100)
    const positions = [10,30,50,70,90];
    const x = positions[idx] || 50;
    // build a simple “arc” whose mid‑point aims roughly at x
    const d = `M5 28 C 25 5, ${x-15} 5, ${x} 20 S ${x+15} 35, 95 35`;
    arrowPath.setAttribute('d', d);
  }
  // initial state
  rects[2].classList.add('active');
  updateArrowToRect(2);
})();
</script>