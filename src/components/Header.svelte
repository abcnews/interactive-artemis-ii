<script lang="ts">
  import { onMount } from "svelte";
  import VideoBackground from "./VideoBackground.svelte";

  type Props = {
    fadeOutProgress: number;
  };

  let { fadeOutProgress }: Props = $props();

  let header: HTMLElement | null;
  let headline: HTMLElement | null;

  onMount(() => {
    // Get the elements
    header = document.querySelector<HTMLElement>(".Header");
    headline = document.querySelector<HTMLElement>(".Header-content h1");

    const tabsHeight = 48;
    const navHeight = window.innerWidth < 992 ? 50 : 72;
    const screenHeight = window.innerHeight;

    // Set properties
    header?.style.setProperty(
      "--header-height",
      `${screenHeight - tabsHeight - navHeight}px`,
    );

    if (headline) {
      // Only apply the split if a <br> hasn't already been injected (handles HMR)
      if (!headline.querySelector("br")) {
        const text = headline.textContent?.trim() ?? "";
        const words = text.split(" ");
        if (words.length > 1) {
          const mid = Math.ceil(words.length / 2);
          headline.innerHTML =
            words.slice(0, mid).join(" ") + "<br>" + words.slice(mid).join(" ");
        }
      }
    }
  });
</script>

<div class="background" style:--fade-out-progress={1 - fadeOutProgress}>
  <VideoBackground></VideoBackground>
</div>

<style lang="scss">
  @use "../styles/breakpoints.scss";

  :global {
    .Header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: var(--header-height, 900px);
      margin: 0 !important;

      .Header-content {
        margin-inline: 16px;

        h1 {
          font-family: ABCSansNova-CondensedBold, "abcsans condensed" !important;
          font-weight: 700;
          text-transform: uppercase;
          font-stretch: condensed;
          text-wrap: balance;
        }
      }

      .Header-content h1 {
        font-size: 3.5rem !important;
        color: var(--interactive-color-header);
        text-align: center;
        text-shadow: 0 0 4px hsla(0, 0%, 100%, 1);
        margin-top: 3rem;
        margin-bottom: 1rem;
        line-height: 1;

        @include breakpoints.for-small-mobile-only {
          font-size: 2.5rem !important;
        }

        @include breakpoints.for-tablet-up {
          font-size: 3.5rem !important;
        }

        @include breakpoints.for-large-tablet-up {
          font-size: 4.5rem !important;
        }

        @include breakpoints.for-desktop-up {
          font-size: 5.5rem !important;
        }

        @include breakpoints.for-large-desktop-up {
          font-size: 6.5rem !important;
        }
      }

      .Header-byline {
        text-align: center;
        color: white;
        text-wrap: balance;
        max-width: 400px;
        margin: auto;
        margin-bottom: 1rem !important;

        ul[class^="CardTagList"] {
          margin-top: 1.5rem !important;
        }

        ul * {
          color: hsla(215, 64%, 89%, 1) !important;
        }

        ul a {
          background-color: rgba(71, 81, 98, 0.6) !important;
        }
      }

      .Header-byline > ul {
        justify-content: center;
        margin-top: 3em !important;
      }

      .Header-meta * {
        color: hsla(215, 64%, 89%, 1);
      }

      .Header-meta > div {
        justify-content: center;
      }
    }

    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: var(--header-height, 900px);
      background-color: transparent;
      z-index: -1;
      opacity: var(--fade-out-progress);
    }
  }
</style>
