<script lang="ts">
  import Rocket from "./Rocket.svelte";
  import Stars from "./Stars.svelte";
  import ThreeCanvas from "./ThreeCanvas.svelte";
  import VideoBackground from "./VideoBackground.svelte";
  import { scroll } from "~/src/stores/scroll.svelte";
  import { fade } from "svelte/transition";
</script>

<div class="stage-root">
  <!-- <Rocket /> -->
  <!-- <Rocket3D /> -->
  <!-- <Stars /> -->
  <ThreeCanvas />
  
    <div class="background-video" style:opacity={scroll.page < 1000 ? 1 : 0}>
      <VideoBackground />
    </div>
  
</div>

<style lang="scss">
  .stage-root {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -2;
    background-color: var(--interactive-color-background);
  }

  .background-video {
    transition: opacity 1.5s ease-in-out;
  }
</style>
