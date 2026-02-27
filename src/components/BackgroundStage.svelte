<script lang="ts">
  import ThreeCanvas from "./ThreeCanvas.svelte";
</script>

<div class="stage-root">
  <ThreeCanvas />
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
</style>
