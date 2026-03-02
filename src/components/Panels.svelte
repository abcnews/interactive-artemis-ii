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
    }
  }
</style>
