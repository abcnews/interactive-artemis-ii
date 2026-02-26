<script lang="ts">
  import { scroll } from "~/src/stores/scroll.svelte";
</script>

<div class="debug-root">
  <div>Section: {scroll.currentSection.name}</div>
  <div>Scroll: {scroll.pageScroll}</div>
  <div>Progress: {scroll.progressThrough}</div>
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
