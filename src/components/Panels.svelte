<style lang="scss">
  @use "../styles/breakpoints.scss";

  :global {
    .u-layout > [data-key="panel"] {
      border: var(--interactive-panel-border);
      border-radius: 12px;
      background-color: var(--interactive-panel-background);
      backdrop-filter: blur(7px);
      box-shadow: 0 0px 30px hsla(0, 0%, 100%, 0.2);
      width: calc(100% - 48px);

      @include breakpoints.for-tablet-up {
        max-width: 600px;
        padding: 30px 45px;
      }

      @include breakpoints.for-desktop-up {
        max-width: 700;
        font-size: 1.375rem;
      }

      figure {
        text-align: center;

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
          padding: 48px;
        }
      }
    }

    // First panel opaque background to hide capsule
    [data-tag="startpanelKEYintro"] {
      background-color: var(--interactive-panel-background-opaque) !important;
    }
  }
</style>
