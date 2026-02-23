<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    containerKey: string;
  }

  let { containerKey }: Props = $props();

  onMount(() => {
    const container = document.querySelector(
      `[data-key='${containerKey}']`,
    ) as HTMLElement;

    const spacers = container.querySelectorAll<HTMLElement>("[id^='spacer']");

    for (const spacer of spacers) {
      spacer.style.setProperty("margin-top", "500px", "important");
    }
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
      }
    }
  }
</style>
