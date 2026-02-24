<!--
  The main app component
-->

<script lang="ts">
  // Component imports
  import Portal from "svelte-portal";
  import Header from "./components/Header.svelte";
  import BackgroundStage from "./components/BackgroundStage.svelte";
  import UtilTransformSpacers from "./components/UtilTransformSpacers.svelte";
  import { getApplication } from "@abcnews/env-utils";

  // Type imports
  import { type Readable } from "svelte/store";

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
  export type AppProps = {
    prefersColorScheme: Readable<string>;
  };

  let { prefersColorScheme }: AppProps = $props();
  let isABC = $derived(getApplication() !== null ? true : false);

  function initAutoDarkMode() {
    /* Auto dark mode for Odyssey */
    setMode(document.body.getAttribute("data-scheme") as string);
    loadDarkModeObserver();
    return () => unloadDarkModeObserver();
  }

  onMount(() => {
    // No dark mode for now
    // isABC && initAutoDarkMode();
  });
</script>

{#if isABC}
  <Portal target={".Header"}>
    <Header />
  </Portal>

  <Portal target="[data-key='body']">
    <BackgroundStage />
  </Portal>

  <UtilTransformSpacers />
{:else}
  <p>This web app needs to be attached to an ABC News CoreMedia article.</p>
{/if}

<svelte:window bind:scrollY={scroll.page} />

<style lang="scss"></style>
