<script lang="ts">
  import { onMount } from "svelte";
  import VideoBackground from "./VideoBackground.svelte";

  let headline: HTMLElement | null;

  onMount(() => {
    headline = document.querySelector<HTMLElement>(".Header-content h1");
  });
</script>

<div class="background-image">
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
      height: 100dvh;

      .Header-content {
        margin-inline: 16px;

        h1 {
          font-family:
            ABCSansNova-CondensedBold, "abcsans condensed" !important;
          font-weight: 700;
          text-transform: uppercase;
          font-stretch: condensed;
        }
      }

      .Header-content h1 {
        font-size: 3.5rem !important;
        color: var(--interactive-color-header);
        text-align: center;
        text-shadow: 0 0 4px hsla(0, 0%, 100%, 1);

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

    /* html:not(.is-dark-mode) {
      .Header-content {
        background-color: grey;
        border-radius: 16px;
      }
    } */

    .background-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100dvh;
      background-color: transparent;
      z-index: -1;
    }
  }
</style>
