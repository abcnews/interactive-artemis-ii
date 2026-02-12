<script lang="ts">
  import Portal from "svelte-portal";
  import Header from "./components/Header.svelte";
  import Stage from "./components/Stage.svelte";
  import Timeline from "./components/Timeline.svelte";
  import {
    loadDarkModeObserver,
    unloadDarkModeObserver,
    setMode,
  } from "./lib/darkModeSwitcher";
  import TimeSpacer from "./components/TimeSpacer.svelte";

  import { scroll } from "./stores/scroll.svelte";

  import { onMount } from "svelte";

  let { testing }: { testing: boolean } = $props();
  console.log(testing);

  $effect(() => {
    /* Auto dark mode for Odyssey */
    setMode(document.body.getAttribute("data-scheme") as string);
    loadDarkModeObserver();
    return () => unloadDarkModeObserver();
  });
</script>

<Portal target=".Header">
  <Header></Header>
</Portal>

<Portal target="[data-key='body']">
  <Stage></Stage>
</Portal>

<Portal target="#timelinemount">
  <Timeline></Timeline>
</Portal>

<Portal>
  <TimeSpacer></TimeSpacer>
</Portal>

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
