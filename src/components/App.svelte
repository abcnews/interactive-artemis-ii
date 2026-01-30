<script lang="ts">
  import Block from './Block.svelte';
  import MainGrid from './MainGrid.svelte';
  export let blocks: import('..').Block[];
</script>

<MainGrid>
  {#each blocks as block}
    <Block {...block} />
  {/each}
</MainGrid>

<style></style>
