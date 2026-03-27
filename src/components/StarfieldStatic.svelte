<!--
  Static CSS starfield — zero GPU cost alternative for low-end devices.
  Uses a seeded PRNG to generate deterministic star positions as CSS box-shadows.
-->

<script lang="ts">
  import Rand from "rand-seed";

  const rand = new Rand("artemis-ii-css");
  const COUNT = 600;

  const W = window.screen.width;
  const H = window.screen.height;

  // Generate stars as box-shadow values
  const boxShadow = Array.from({ length: COUNT }, () => {
    const x = Math.round(rand.next() * W);
    const y = Math.round(rand.next() * H);
    const opacity = (0.4 + rand.next() * 0.6).toFixed(2);
    return `${x}px ${y}px 0 0 rgba(255,255,255,${opacity})`;
  }).join(",");
</script>

<div class="static-starfield" style="box-shadow: {boxShadow}"></div>

<style>
  .static-starfield {
    position: fixed;
    top: 0;
    left: 0;
    width: 1px;
    border-radius: 50%;
    height: 1px;
    pointer-events: none;
    z-index: 1;
  }
</style>
