<script lang="ts">
  import { onMount } from "svelte";

  onMount(() => {
    const spacer = document.querySelector("[data-key='spacer']") as HTMLElement;
    spacer.style = `--grid-template-rows: minmax(200px, auto) minmax(500px, auto) minmax(300px, auto) minmax(5px, auto)`;
  });
</script>

<style lang="scss">
  :global {
    [data-component="Decoy"] {
      .Block.is-piecemeal > .Block-content > :first-child {
        margin-top: 0px !important;
        margin-bottom: 0px !important;
      }

      .Block.is-piecemeal > .Block-content:nth-child(2) > p:first-child {
        margin-top: 0vh !important;
      }

      .Block-content {
        min-height: unset !important;

        > p {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
      }

      .Block {
        display: grid;
        align-items: start;
        min-height: unset !important;
        grid-template-rows: var(--grid-template-rows);
      }
    }
  }
</style>
