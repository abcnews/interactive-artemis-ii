<script lang="ts">
  interface Props {
    /** The text to display inside the pill */
    name: string;
    /** Background colour (css hex or name) */
    colour?: string;
    /** Foreground colour (css hex or name) */
    text?: string;
    /** Border colour (css hex or name) */
    border?: string;
    /** Icon name, prefixed with 4-digit year (e.g. 2026finger) */
    icon?: string;
    /** Underline colour (css hex or name) */
    underline?: string;
    /** Dashed underline instead of solid */
    dashed?: string;
  }

  let { name, colour, text, border, icon, underline, dashed }: Props = $props();

  const iconUrl = $derived.by(() => {
    if (!icon) return null;
    const year = icon.substring(0, 4);
    let name = icon.substring(4);
    let extension = "webp";

    if (name.endsWith("svg")) {
      extension = "svg";
      name = name.slice(0, -3);
    }

    return `https://www.abc.net.au/res/sites/news-projects/interactive-inline-pill-text/icons/${year}/${name}.${extension}`;
  });

  const isMinimal = $derived(!border && !colour);
</script>

<span
  class="inline-pill-wrapper"
  class:inline-pill-wrapper--active={!isMinimal}
>
  <span
    class="inline-style"
    class:inline-style--with-icon={iconUrl}
    class:inline-style--with-border={border}
    class:inline-style--minimal={isMinimal}
    class:inline-style--with-underline={underline}
    class:inline-style--with-dashed-underline={dashed}
    style:--bgColour={colour}
    style:--fgColour={text}
    style:--borderColour={border}
    style:--underlineColour={underline}
  >
    <span
      class="inline-pill__text"
      class:inline-pill__text--active={!isMinimal}
    >
      {name}
    </span>
  </span>
</span>

<style lang="scss">
  .inline-pill-wrapper {
    &--active {
      /**
       * Firefox-only: translate the whole pill UP.
       * Requires display: inline-block to apply transform.
       */
      @supports (image-rendering: -moz-crisp-edges) {
        display: inline-block;
        translate: 0 -1px;
      }
    }
  }

  .inline-style {
    position: relative;
    color: var(--fgColour, white);
    background: var(--bgColour, transparent);
    // border-radius: 4px;
    font-family: ABCSans, "ABC Sans Nova", sans-serif;
    font-size: 0.9em;
    font-style: normal;
    font-weight: 700;
    line-height: 150%;
    padding: 3px 4px;
    white-space: nowrap;

    &--with-border {
      border: 2px solid var(--borderColour, transparent);
      padding: 1px 4px;
    }
    &--minimal {
      font-size: 1em;
      padding: 0;
    }
    &--with-icon {
      padding-right: calc(4px + 16px + 2px);
    }
    &--with-underline {
      border-bottom: 4px solid var(--underlineColour, transparent);
    }
    &--with-dashed-underline {
      border-bottom: 4px dashed var(--underlineColour, transparent);
    }

    .inline-pill__text {
      &--active {
        /**
         * Firefox-only: translate the text DOWN within the pill to center it.
         * Requires display: inline-block to apply transform.
         */
        @supports (image-rendering: -moz-crisp-edges) {
          display: inline-block;
          translate: 0 1px;
        }
      }
    }
  }
</style>
