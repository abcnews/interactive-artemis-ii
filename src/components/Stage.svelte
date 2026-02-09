<script lang="ts">
  import Rocket from "./Rocket.svelte";
  import Rocket3D from "./Rocket3D.svelte";
</script>

<div class="stage-root">
  <!-- <Rocket /> -->
  <!-- <Rocket3D /> -->
</div>

<style lang="scss">
  .stage-root {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    background-color: var(--interactive-color-background);
  }
</style>
