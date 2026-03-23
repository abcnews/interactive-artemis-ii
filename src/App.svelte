<!--
  The main app component
-->

<script lang="ts">
  // Component imports
  import Portal from "svelte-portal";
  import Header from "./components/Header.svelte";
  import BackgroundStage from "./components/BackgroundStage.svelte";
  import UtilTransformSpacers from "./components/UtilTransformSpacers.svelte";
  import UtilGetPanelData from "./components/UtilGetPanelData.svelte";
  import UtilGetTransitions from "./components/UtilGetTransitions.svelte";
  import Debug from "./components/Debug.svelte";
  import ThreeScene, { type ModelState } from "./components/ThreeScene.svelte";
  import ThreeSceneReducedMotion from "./components/ThreeSceneReducedMotion.svelte";
  import Panels from "./components/Panels.svelte";
  import OnScreenDisplay from "./components/OnScreenDisplay.svelte";

  // Standard imports
  import { ElementSize } from "runed";
  import { getApplication } from "@abcnews/env-utils";
  import { SvelteURLSearchParams } from "svelte/reactivity";
  import { Throttled } from "runed";
  import { Match } from "effect";
  import { pipe } from "effect";

  // Type imports
  import { type Readable } from "svelte/store";

  // Stores
  import { scroll } from "./stores/scroll.svelte";
  import { screen } from "./stores/screen.svelte";
  import { accessibility } from "./stores/accessibility.svelte";

  // Utilities
  import {
    loadDarkModeObserver,
    unloadDarkModeObserver,
    setMode,
  } from "./lib/darkModeSwitcher";
  import { getCameraPosition } from "./lib/getCameraPosition";

  // Other imports
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  // Constants
  const SCROLL_THROTTLE = 25;

  // Component props
  export type AppProps = {
    prefersColorScheme: Readable<string>;
  };

  let { prefersColorScheme }: AppProps = $props();

  let isABC = $derived(getApplication() !== null);
  let bodyEl = $state() as HTMLElement;

  // Bind to window scroll
  let scrollY = $state(0);

  // Throttle the page scroll for increased performance
  let throttledPageScroll = new Throttled(() => scrollY, SCROLL_THROTTLE);
  $effect(() => {
    scroll.pageScroll = throttledPageScroll.current;
  });

  // Enable debug mode with ?debug=true OR &debug=true (if ? already present)
  const paramsString = window.location.search;
  const params = new SvelteURLSearchParams(paramsString);
  const isDebug = $derived(params.get("debug") === "true");

  function initAutoDarkMode() {
    /* Auto dark mode for Odyssey */
    /*
      Previously we would detect user preference, but we're just going to push people
      into dark mode for now. This may change in future.
    */
    // setMode(document.body.getAttribute("data-scheme") as string);
    setMode("dark");
    loadDarkModeObserver();
    return () => unloadDarkModeObserver();
  }

  onMount(() => {
    // No dark mode for now
    if (isABC) initAutoDarkMode();

    // Set up responsive body size store
    scroll.bodyElSize = new ElementSize(() => bodyEl);
  });

  // Define static states to maintain referential equality and reduce allocation
  const STATE_INTRO = { itemsVisible: ["starfield"] };
  const STATE_TAKEOFF = { itemsVisible: ["starfield", "artemis"] };
  const STATE_EXCITEMENT = { itemsVisible: ["starfield"] };
  const STATE_DEFAULT = { itemsVisible: [] };

  type SceneState = {
    itemsVisible: string[];
    orionRotation?: [number, number, number];
  };

  const getSceneState = (
    currentSectionName: string,
    sectionProgress: number,
  ): SceneState => {
    return Match.value(currentSectionName).pipe(
      Match.withReturnType<SceneState>(),
      Match.when("intro", () => STATE_INTRO),
      Match.when("sls", () => ({
        itemsVisible: ["starfield", "orion"],
        orionRotation: [sectionProgress * Math.PI * 2, 0, 0],
      })),
      Match.when("takeoff", () => STATE_TAKEOFF),
      Match.when("excitement", () => STATE_EXCITEMENT),
      Match.orElse(() => STATE_DEFAULT),
    );
  };

  let threeCanvasState: SceneState = $derived.by(() => {
    // Use the 0-1 progress of the current section
    const progress = scroll.progressUntilNextSection ?? 0;
    const name = scroll.currentSection?.name ?? "initial";
    return getSceneState(name, progress);
  });

  function panelVisibility(panelName: string): ModelState {
    const panel = scroll.panelsCurrent.find((p) => p.name === panelName);
    if (!panel) return {};
    return { isVisible: scroll.pageScrollBottom > panel.downPage };
  }

  function hasPassedPanel(panelName: string): boolean {
    const panel = scroll.panelsCurrent.find((p) => p.name === panelName);
    if (!panel) return false;
    return scroll.pageScrollBottom > panel.downPage;
  }

  let starfieldState = $derived(panelVisibility("excitement"));
  let artemisState = $derived(panelVisibility("orion"));
  let orionState = $derived(panelVisibility("intro"));

  let cameraPosition = $derived.by(() => {
    const pageScrollBottom = scroll.pageScrollBottom;
    const sectionName = scroll.currentSection?.name ?? "initial";

    return getCameraPosition(pageScrollBottom, sectionName);
  });

  let kmsFromEarth = $derived.by(() => {
    return cameraPosition.position[2] * 1000;
  });

  const body = document.body;
  const html = document.documentElement;

  const pageHeight = document.body.scrollHeight;

  let shouldShowStats = $derived.by(() => {
    if (!hasPassedPanel("excitement")) {
      return false;
    }

    if (scroll.pageScrollBottom > pageHeight - 5000) {
      return false;
    }

    if (pipe(kmsFromEarth, Math.round, Math.abs) > 9) {
      return true;
    }
    return false;
  });
</script>

{#if isABC}
  <Portal target=".Header">
    <Header
      fadeOutProgress={scroll.currentSection.name === "initial"
        ? 0
        : scroll.currentSection.name === "intro"
          ? scroll.progressUntilNextSection
          : 1}
    />
  </Portal>

  <Portal target="[data-key='body']">
    {#if shouldShowStats}
      <div transition:fade={{ duration: 500 }}>
        <OnScreenDisplay {cameraPosition} />
      </div>
    {/if}
    <BackgroundStage>
      {#if accessibility.prefersReducedMotion}
        <ThreeSceneReducedMotion {orionState} {artemisState} />
      {:else}
        <ThreeScene {cameraPosition} {orionState} {artemisState} />
      {/if}
    </BackgroundStage>
  </Portal>

  <Panels />

  <UtilTransformSpacers />
  <UtilGetPanelData />
  <UtilGetTransitions />

  {#if isDebug}
    <Debug {cameraPosition} />
  {/if}
{:else}
  <p>This web app needs to be attached to an ABC News CoreMedia article.</p>
{/if}

<svelte:body bind:this={bodyEl} />
<svelte:window
  bind:scrollY
  bind:innerWidth={screen.innerWidth}
  bind:innerHeight={screen.innerHeight}
/>

<style lang="scss"></style>
