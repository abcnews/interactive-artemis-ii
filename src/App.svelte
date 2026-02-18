<script lang="ts">
  // Component imports
  import Portal from "svelte-portal";
  import Header from "./components/Header.svelte";
  import BackgroundStage from "./components/BackgroundStage.svelte";
  import Timeline from "./components/Timeline.svelte";
  import TimeSpacer from "./components/TimeSpacer.svelte";
  import UtilTransformSpacers from "./components/UtilTransformSpacers.svelte";
  import {
    getApplication,
    getGeneration,
    getTier,
    whenOdysseyLoaded,
  } from "@abcnews/env-utils";

  // Stores
  import { scroll } from "./stores/scroll.svelte";

  // Utilities
  import {
    loadDarkModeObserver,
    unloadDarkModeObserver,
    setMode,
  } from "./lib/darkModeSwitcher";

  // Other imports
  import { onMount } from "svelte";

  // Component props
  let { testing }: { testing: boolean } = $props();

  function initAutoDarkMode() {
    /* Auto dark mode for Odyssey */
    setMode(document.body.getAttribute("data-scheme") as string);
    loadDarkModeObserver();
    return () => unloadDarkModeObserver();
  }

  $effect(() => {
    getApplication() !== null && initAutoDarkMode();
  });
</script>

{#if getApplication() !== null}
  <Portal target={".Header"}>
    <Header></Header>
  </Portal>

  <Portal target="[data-key='body']">
    <BackgroundStage></BackgroundStage>
  </Portal>

  <UtilTransformSpacers />
{:else}
  <p>This web app needs to be attached to an ABC News CoreMedia article.</p>
{/if}

<svelte:window bind:scrollY={scroll.page} />

<style lang="scss">
  :global {
    /*
      Odyssey overrides
     */

    /* Remove long panel transitions */
    .Block-content[class*="u-richtext"] > *::before {
      transition: unset !important;
    }

    /* 
      Fix extended margins on 2nd panel if no embedded media
      https://github.com/abcnews/odyssey/issues/99
     */
    // .Main > .Block.is-piecemeal > .Block-content > :first-child {
    //   margin-top: 40vh !important;
    // }
    .Main > .Block.is-piecemeal > .Block-content:nth-child(2) > :first-child {
      margin-top: 40vh !important;
    }
  }
</style>
