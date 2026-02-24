<script lang="ts">
  import { onMount } from "svelte";

  let headline: HTMLElement | null;

  onMount(() => {
    headline = document.querySelector<HTMLElement>(".Header-content h1");
  });
</script>

<style lang="scss">
  :global {
    .Header {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .Header-content {
        margin-inline: 16px;

        h1 {
          font-family: abcsans, "fallback sans", sans-serif;
          font-weight: 900;
          overflow-wrap: break-word;
          text-transform: uppercase;
        }
      }

      .Header-content h1 {
        font-size: 3rem !important;
        color: var(--interactive-color-header);
        text-align: center;
      }

      .Header-byline > ul {
        justify-content: center;
        margin-top: 3em !important;
      }

      .Header-meta > div {
        justify-content: center;
      }
    }
  }
</style>
