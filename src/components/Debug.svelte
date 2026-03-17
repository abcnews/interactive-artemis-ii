<script lang="ts">
  import { pipe } from "effect";
  import { scroll } from "~/src/stores/scroll.svelte";
  import type { CameraPositionResult } from "~/src/lib/getCameraPosition";

  const { cameraPosition }: { cameraPosition: CameraPositionResult } = $props();
</script>

<div class="debug-root">
  <div>Section: {scroll.currentSection.name}</div>
  <div>Downpage: {scroll.pageScrollBottom}</div>
  <div>Progress: {scroll.progressUntilNextSection}</div>
  <!-- <div>Active: {JSON.stringify(stage.transitionsActive)}</div> -->
  <div>
    Camera: {pipe(
      cameraPosition.position[2],
      (n) => n * 1000,
      Math.round,
      Math.abs,
    )}km
  </div>
</div>

<style lang="scss">
  .debug-root {
    background-color: hsla(0, 0%, 0%, 0.8);
    padding: 4px;
    border: 1px dotted red;
    color: red;
    position: fixed;
    bottom: 40px;
    right: 10px;
  }
</style>
