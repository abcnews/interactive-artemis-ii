<script lang="ts">
  import { Canvas, T, useThrelte, useTask } from "@threlte/core";
  import { HUD, Grid, Stars, Float, SVG } from "@threlte/extras";
  import * as THREE from "three";
  import { Spring, Tween } from "svelte/motion";
  import { Match } from "effect";
  import { fade } from "svelte/transition";
  import { prefersReducedMotion } from "svelte/motion";
  import { type CameraPositionResult } from "../lib/getCameraPosition";
  import { Throttled } from "runed";
  import { scaleLinear } from "d3-scale";

  // Components
  import Sphere from "./Sphere.svelte";
  import Artemis from "./NASAArtemisGLTF/NASA_SLS-block-1-v2.svelte";
  import Orion from "./Orion/Orion_Draco_Optimized.svelte";
  import Starfield from "./Starfield.svelte";
  import StarfieldStatic from "./StarfieldStatic.svelte";
  import HUDScene from "./HUDScene.svelte";
  import Moon from "./Moon/Moon.svelte";
  import Atmosphere from "./Atmosphere.svelte";
  import Waypoint from "./Waypoint.svelte";
  import ISS from "./ISS/ISS_stationary.svelte";
  import Cornish from "./Cornish/CornishBasic.svelte";
  import Text from "./Text.svelte";
  import PostProcessing from "./PostProcessing.svelte";
  import ThreltePostProcessing from "./ThreltePostProcessing.svelte";
  import Gemini from "./Gemini.svelte";
  import DistanceMarkers from "./DistanceMarkers.svelte";
  import Gagarin from "./Gagarin.svelte";
  import GPS from "./GPS.svelte";
  import Sputnik2 from "./Sputnik2.svelte";
  import ThreeSceneZoomContainer from "./ThreeSceneZoomContainer.svelte";

  // Utils
  import { kmScale } from "~/src/lib/utils";

  // Stores
  import { scroll } from "~/src/stores/scroll.svelte";
  import { stage } from "~/src/stores/stage.svelte";
  import { gpu } from "~/src/stores/gpu.svelte";

  // Constants
  const MOON_SCALE = 3.474 / 2;
  const ATMOSPHERE_THICKNESS = 0.05;
  const SCENE_FADE_DURATION = 250;

  export type ModelState = {
    isVisible?: boolean;
    shouldFloat?: boolean;
  };

  type ComponentProps = {
    orionState: ModelState;
    artemisState: ModelState;
  };

  let {
    orionState = { isVisible: false },
    artemisState = { isVisible: false },
  }: ComponentProps = $props();

  // Scaling of the International Space Station
  // 1 unit = 1,000km = 1,000,000m
  // ISS real width = 109m = 0.000109 units
  const RAW_WIDTH = 111.99;
  const REAL_SCALE = 0.000109 / RAW_WIDTH; // ≈ 9.73e-7

  const VISIBILITY_MULTIPLIER = 100;
  const ISS_SCALE = REAL_SCALE * VISIBILITY_MULTIPLIER; // ≈ 0.000487

  let artemisOpacity = $derived.by(() => {
    return stage.getProgressBetweenSections({
      start: "artemis",
      end: "takeoff",
      endOffset: -500,
      domain: [0, 1],
      clamp: true,
    })(scroll.pageScrollBottom);
  });

  let orionOpacity = $derived.by(() => {
    const introPanel = scroll.panelsCurrent.find(
      (panel) => panel.name === "intro",
    );
    if (!introPanel) return 0;

    return scaleLinear().domain([0.7, 1.0]).range([0, 1]).clamp(true)(
      introPanel.screenProgress,
    );
  });

  const isBefore = (section: string) =>
    scroll.pageScrollBottom < stage.getDownpage(section);

  const isBetween = (start: string, end: string) =>
    scroll.pageScrollBottom >= stage.getDownpage(start) &&
    scroll.pageScrollBottom < stage.getDownpage(end);

  const currentScene = $derived.by(() => {
    if (isBefore("artemis")) return "orion";
    if (isBetween("artemis", "zoomintro")) return "artemis";
    return "launch";
  });
</script>

{#if currentScene === "orion"}
  <div
    class="stage-root orion"
    in:fade={{ duration: SCENE_FADE_DURATION }}
    style:opacity={orionOpacity}
  >
    <Canvas>
      <T.PerspectiveCamera
        makeDefault
        position={[0, 0, 0]}
        oncreate={(ref) => {}}
        fov={70}
        near={0.01}
        far={1000}
      ></T.PerspectiveCamera>

      <T.DirectionalLight position={[10, 10, 10]} />
      <T.AmbientLight intensity={0.1} />

      <Orion position={[0, 0, -10]} orionRotation={undefined} opacity={1.0} />
    </Canvas>
  </div>
{:else if currentScene === "artemis"}
  <div
    class="stage-root orion"
    in:fade={{ duration: SCENE_FADE_DURATION, delay: 0 }}
  >
    <Canvas>
      <T.PerspectiveCamera
        makeDefault
        position={[0, 0, 0]}
        oncreate={(ref) => {}}
        fov={70}
        near={0.01}
        far={1000}
      ></T.PerspectiveCamera>

      <T.DirectionalLight position={[10, 10, 10]} />
      <T.AmbientLight intensity={0.1} />

      <Orion
        position={[0, 36, -80]}
        orionRotation={undefined}
        opacity={orionOpacity}
      />

      {#if artemisState.isVisible}
        <Artemis
          position={[0, -10, -80]}
          scale={0.5}
          opacity={artemisOpacity}
        />
      {/if}
    </Canvas>
  </div>
{:else if currentScene === "launch"}
  <ThreeSceneZoomContainer cameraPosition={[0, 0, 0]} />
{/if}

<style lang="scss">
  .stage-root {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }
</style>
