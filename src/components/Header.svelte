<script lang="ts">
  import Headline from "./Headline.svelte";
  import { onMount } from "svelte";

  let headline: HTMLElement | null;

  onMount(() => {
    headline = document.querySelector<HTMLElement>(".Header-content h1");
    console.log(headline);
  });
</script>

<!-- <Headline /> -->

<style lang="scss">
  :global {
    .Header {
      height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .Header-content {
        margin-inline: 16px;

        h1 {
          font-family: "Orbitron", sans-serif;
          font-optical-sizing: auto;
          font-weight: 900;
          font-style: normal;
          overflow-wrap: break-word;
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
