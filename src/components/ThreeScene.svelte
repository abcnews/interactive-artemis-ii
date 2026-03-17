<script lang="ts">
  import { Canvas, T, useThrelte, useTask } from "@threlte/core";
  import { HUD, Grid, Stars, Float, SVG } from "@threlte/extras";
  import * as THREE from "three";
  import { Spring } from "svelte/motion";
  import { Match } from "effect";
  import { fade } from "svelte/transition";
  import { prefersReducedMotion } from "svelte/motion";
  import { type CameraPositionResult } from "../lib/getCameraPosition";
  import { Throttled } from "runed";

  // Components
  import Sphere from "./Sphere.svelte";
  import Artemis from "./NASAArtemisGLTF/NASA_SLS-block-1-v2.svelte";
  import Orion from "./Orion/Orion_Draco_Optimized.svelte";
  import Starfield from "./Starfield.svelte";
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
  import CameraController from "./CameraController.svelte";
  import DistanceMarkers from "./DistanceMarkers.svelte";
  import Gagarin from "./Gagarin.svelte";
  import GPS from "./GPS.svelte";
  import HeadsUp from "./HUD.svelte";

  // Utils
  import { kmScale } from "~/src/lib/utils";

  // Stores
  import { scroll } from "~/src/stores/scroll.svelte";
  import { stage } from "~/src/stores/stage.svelte";
  import { onMount } from "svelte";
  import Sputnik2 from "./Sputnik2.svelte";

  // Constants
  const MOON_SCALE = 3.474 / 2;

  export type ModelState = {
    isVisible?: boolean;
    shouldFloat?: boolean;
  };

  type ComponentProps = {
    itemsVisible: string[];
    orionRotation?: [number, number, number];
    cameraZ?: number;
    cameraPosition: CameraPositionResult;
    starfieldState: ModelState;
    orionState: ModelState;
    artemisState: ModelState;
  };

  let {
    itemsVisible = [],
    orionRotation,
    cameraZ = 200,
    cameraPosition,
    starfieldState = { isVisible: false },
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

  let cameraPositionSpring = new Spring<[number, number, number]>([0, 0, 0], {
    precision: 0.00001,
  });

  const throttledPosition = new Throttled(
    () => cameraPosition.position, // reactive source
    300,
  );

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

    if (!introPanel) {
      return 0;
    }

    if (introPanel.screenProgress < 0.8) {
      return 0;
    } else {
      return 1;
    }
  });

  $effect(() => {
    if (!prefersReducedMotion.current) {
      cameraPositionSpring.set(cameraPosition.position);
      return;
    }

    cameraPositionSpring.set(throttledPosition.current, { instant: true });
  });

  const whichScene = Match.type<{ downpage: number }>().pipe(
    Match.withReturnType<string>(),
    Match.when(
      { downpage: (downpage) => downpage < stage.getDownpage("excitement") },
      () => "setup",
    ),
    Match.orElse(() => "launch"),
  );

  const MOON_Z = -406;
  const ORBIT_RADIUS = 8; // distance from moon centre
  const ORBIT_START_Z = MOON_Z + 20; // when to start orbiting
  const ORBIT_SPEED = 0.2; // radians per second
</script>

{#if whichScene({ downpage: scroll.pageScrollBottom }) === "setup"}
  <div class="stage-root setup" transition:fade={{ duration: 1000 }}>
    <Canvas>
      <T.PerspectiveCamera
        makeDefault
        position={cameraPositionSpring.current}
        oncreate={(ref) => {}}
        fov={78}
        near={0.01}
        far={1000}
      ></T.PerspectiveCamera>

      <T.DirectionalLight position={[10, 10, 10]} />
      <T.AmbientLight intensity={0.1} />

      {#if orionState.isVisible}
        <Float
          floatIntensity={orionState.shouldFloat ? 5 : 0}
          rotationIntensity={orionState.shouldFloat ? 2 : 0}
          rotationSpeed={[1, 0.5, 0.2]}
        >
          <Orion
            position={[0, 36, -70]}
            orionRotation={undefined}
            opacity={orionOpacity}
          />
        </Float>
      {/if}

      {#if artemisState.isVisible}
        <Artemis
          position={[0, -10, -70]}
          scale={0.5}
          opacity={artemisOpacity}
        />
      {/if}
    </Canvas>
  </div>
{:else}
  <div class="stage-root launch" transition:fade={{ duration: 1000 }}>
    <Canvas
      createRenderer={(canvas) => {
        return new THREE.WebGLRenderer({
          canvas,
          logarithmicDepthBuffer: true,
          antialias: true,
          alpha: true,
        });
      }}
    >
      <T.Color attach="background" args={["#0f0f0f"]} />
      <T.PerspectiveCamera
        makeDefault
        position={cameraPositionSpring.current}
        oncreate={(ref) => {}}
        fov={75}
        near={kmScale(0.01)}
        far={500}
      ></T.PerspectiveCamera>

      <!-- <CameraController
        moonArrived={cameraPositionSpring.current[2] <= ORBIT_START_Z}
      /> -->

      <T.DirectionalLight position={[500, 0, 200]} intensity={0.9} />
      <T.AmbientLight intensity={0.1} />

      <Starfield />

      <DistanceMarkers {cameraPosition} />

      <!-- <Orion
        position={[0, 0, cameraPositionSpring.current[2] - kmScale(1)]}
        rotation={[-Math.PI * 1, 0, 0]}
        scale={0.0001}
        opacity={orionOpacity}
      /> -->

      <!-- Stratosphere -->
      <Waypoint
        position={[0, 0, kmScale(-12)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(10)}
      >
        {#snippet children({ opacity })}
          <Atmosphere
            radius={kmScale(12)}
            colour="#3216ff"
            {opacity}
            thickness={0.05}
            yOffset={-0.5}
          />
        {/snippet}
      </Waypoint>

      <!-- <T.Mesh position={[0, 0, kmScale(-12.83)]} scale={1}>
        <T.BoxGeometry args={[kmScale(0.1), kmScale(0.01), kmScale(0.01)]} />
        <T.MeshNormalMaterial />
      </T.Mesh> -->

      <!-- Cornish pasty -->
      <Waypoint
        position={[0, 0, kmScale(-35.5)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(22)}
      >
        {#snippet children({ opacity })}
          <Cornish
            scale={kmScale(0.1)}
            position={[kmScale(0.1), kmScale(-0.3), kmScale(-35.5)]}
            {opacity}
          ></Cornish>
        {/snippet}
      </Waypoint>

      <!-- Mesosphere -->
      <Waypoint
        position={[0, 0, kmScale(-50)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(40)}
      >
        {#snippet children({ opacity })}
          <Atmosphere
            radius={kmScale(50)}
            colour="#3216ff"
            {opacity}
            thickness={0.02}
          />
        {/snippet}
      </Waypoint>

      <!-- Thermosphere -->
      <Waypoint
        position={[0, 0, kmScale(-87)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(30)}
      >
        {#snippet children({ opacity })}
          <Atmosphere
            radius={kmScale(87)}
            colour="#3216ff"
            {opacity}
            thickness={0.02}
          />
        {/snippet}
      </Waypoint>

      <!-- Karman line (SPACE) -->
      <Waypoint
        position={[0, 0, kmScale(-100)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(30)}
      >
        {#snippet children({ opacity })}
          <Atmosphere
            radius={kmScale(100)}
            colour="#921644"
            {opacity}
            thickness={0.02}
          />
        {/snippet}
      </Waypoint>

      <!-- Yuri Gagaran -->
      <Waypoint
        position={[0, 0, kmScale(-240)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(50)}
      >
        {#snippet children({ opacity })}
          <Gagarin
            position={[kmScale(-0.1), kmScale(-0.2), kmScale(-240)]}
            {opacity}
          />
        {/snippet}
      </Waypoint>

      <!-- ISS -->
      <Waypoint
        position={[0, 0, kmScale(-400)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(200)}
      >
        {#snippet children({ opacity })}
          <ISS
            position={[kmScale(0.01), kmScale(3), kmScale(-400)]}
            scale={ISS_SCALE}
            {opacity}
          />
        {/snippet}
      </Waypoint>

      <!-- Exosphere -->
      <Waypoint
        position={[0, 0, kmScale(-700)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(500)}
      >
        {#snippet children({ opacity })}
          <Atmosphere
            radius={kmScale(700)}
            colour="#3216ff"
            {opacity}
            thickness={0.2}
          />
        {/snippet}
      </Waypoint>

      <!-- Gemini 11 -->
      <Waypoint
        position={[0, 0, kmScale(-1369)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(200)}
      >
        {#snippet children({ opacity })}
          <Gemini
            position={[kmScale(-0.5), kmScale(-0.8), kmScale(-1369)]}
            rotation={[Math.PI * 0.1, 0, -Math.PI * 0.1]}
            scale={kmScale(0.1)}
            {opacity}
          ></Gemini>
        {/snippet}
      </Waypoint>

      <!-- Laika the dog -->
      <Waypoint
        position={[0, 0, kmScale(-1659)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(200)}
      >
        {#snippet children({ opacity })}
          <Sputnik2
            position={[kmScale(0.4), kmScale(-0.8), kmScale(-1659)]}
            rotation={[Math.PI * 0.1, 0, Math.PI * 0.02]}
            scale={kmScale(0.3)}
            {opacity}
          ></Sputnik2>
        {/snippet}
      </Waypoint>

      <!-- Outer Space -->
      <Waypoint
        position={[0, 0, kmScale(-10000)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(500)}
      >
        {#snippet children({ opacity })}
          <Atmosphere
            radius={kmScale(10000)}
            colour="#3216ff"
            {opacity}
            thickness={0.2}
          />
        {/snippet}
      </Waypoint>

      <!-- GPS -->
      <Waypoint
        position={[0, 0, kmScale(-20180)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(200)}
      >
        {#snippet children({ opacity })}
          <GPS
            position={[kmScale(0.4), kmScale(-0.8), kmScale(-20180)]}
            rotation={[-(Math.PI * 0.1), Math.PI * 0.1, Math.PI * 0.4]}
            scale={kmScale(0.01)}
            {opacity}
          ></GPS>
        {/snippet}
      </Waypoint>

      <!-- The Moon -->
      <T.Group position={[0, 0, -406]} rotation={[0, 0, -Math.PI * 1]}>
        <T.Group rotation={[0, Math.PI * 0.5, 0]}>
          <Moon
            scale={MOON_SCALE}
            cameraPosition={cameraPositionSpring.current}
          />
        </T.Group>
      </T.Group>

      <PostProcessing />
      <!-- <ThreltePostProcessing /> -->
    </Canvas>
  </div>
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
