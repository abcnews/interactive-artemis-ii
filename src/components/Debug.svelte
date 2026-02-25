<script lang="ts">
  import { scroll } from "~/src/stores/scroll.svelte";
</script>

<div class="debug-root">
  <div>Section: {scroll.currentSection}</div>
  <div>Scroll: {scroll.pageScroll}</div>
</div>

<style lang="scss">
  .debug-root {
    padding: 4px;
    border: 1px dotted darkred;
    color: darkred;
    position: fixed;
    bottom: 40px;
    right: 10px;
  }
</style>
