<script lang="ts">
  import ThreeCanvas from "./ThreeCanvas.svelte";
  import VideoBackground from "./VideoBackground.svelte";
  import { scroll } from "~/src/stores/scroll.svelte";
  import { fade } from "svelte/transition";
</script>

<div class="stage-root">
  <!-- <ThreeCanvas /> -->
    <div class="background-video" style:opacity={scroll.pageScroll < 1000 ? 1 : 0}>
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
