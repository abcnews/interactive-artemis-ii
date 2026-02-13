<script lang="ts">
</script>

<style lang="scss">
  :global {
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
      grid-template-rows: minmax(2px, auto) minmax(50px, auto) minmax(2px, auto) minmax(
          5px,
          auto
        );
    }
  }
</style>
