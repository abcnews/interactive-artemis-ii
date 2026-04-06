<style lang="scss">
  @use "../styles/breakpoints.scss";

  :global {
    .u-layout > [data-key="panel"] {
      border-radius: 12px;
      background: rgba(15, 15, 15, 0.6);
      backdrop-filter: blur(2px);
      width: calc(100% - 32px);
      position: relative;
      z-index: 1;
      padding: 1px 24px;

      @include breakpoints.for-tablet-up {
        max-width: 621.33px;
        padding: 30px 45px;
        width: calc(100% - 48px);
      }

      @include breakpoints.for-desktop-up {
        max-width: 700px;
        font-size: 1.375rem;
      }

      figure {
        text-align: center;
        margin-right: 0 !important;

        [data-component="AspectRatioContainer"] {
          max-width: 400px;
          margin-inline: auto;
          padding-bottom: 0;
          height: auto;
        }
      }

      img {
        padding: 32px;
        position: relative;

        @include breakpoints.for-tablet-up {
          padding: 38px;
        }
      }

      &::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 1px;

        background: linear-gradient(
            160deg,
            rgba(255, 255, 255, 0.25) 0%,
            /* bright top border */ rgba(255, 255, 255, 0.08) 30%,
            /* fading down the sides */ rgba(255, 255, 255, 0.02) 70%,
            /* dim lower sides */ rgba(255, 255, 255, 0.01) 100%
          ),
          linear-gradient(
            340deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.08) 30%,
            rgba(255, 255, 255, 0.02) 70%,
            rgba(255, 255, 255, 0.01) 100%
          );

        /* A "hollow" that reveals only the border strip */
        mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        mask-composite: exclude;
        -webkit-mask-composite: xor;

        pointer-events: none;
      }
    }

    // First panel opaque background to hide capsule
    [data-tag="startpanelKEYintro"] {
      background-color: var(--interactive-panel-background-opaque) !important;
    }
  }
</style>
