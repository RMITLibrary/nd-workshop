---
title: "Brain break"
weight: 6
excludeFromProgress: true
---
<style>
#riveCanvas {
  display: block;
  width: 100%;
  max-width: 856px;
  margin: 0 auto;
  cursor: pointer;
  aspect-ratio: 856 / 483;
}
</style>
<div class="content-856px-max">
	<p class="lead">After all that information, it's time for a little break...</p>
	<figure class="wide">
	<canvas id="riveCanvas" width="856" height="483"></canvas>
	<figcaption>
		<a href="https://rive.app/marketplace/18831-35392-form-fidget/">Form + Fidget</a> by 
		<a href="https://rive.app/@noodledesign/">noodledesign</a>, 
		licensed under 
		<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. 
	</figcaption>
	</figure>
</div>
<script src="https://unpkg.com/@rive-app/canvas@latest"></script>
<script>
new rive.Rive({
  src: '/nd-workshop/riv/form-fidget.riv',
  canvas: document.getElementById('riveCanvas'),
  autoplay: true,
  stateMachines: ['State Machine 1'],
  onLoad: () => { console.log('Rive loaded'); },
  onError: (e) => { console.error('Rive error:', e); }
});
</script>