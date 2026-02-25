<script lang="ts">
  import { onMount } from "svelte";
  import { scroll } from "~/src/stores/scroll.svelte";

  onMount(() => {
    const panels = document.querySelectorAll("[data-key='panel']");
    console.log(panels);
  });
</script>
