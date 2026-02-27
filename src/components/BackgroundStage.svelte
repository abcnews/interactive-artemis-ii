<script lang="ts">
  let { children } = $props();
</script>

<div class="stage-root">
  {@render children()}
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
