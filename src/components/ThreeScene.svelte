<script lang="ts">
  import { Canvas, T, useThrelte } from "@threlte/core";
  import { HUD, Grid, Stars, Float } from "@threlte/extras";
  import * as THREE from "three";
  import { Spring } from "svelte/motion";
  import { Match } from "effect";
  import { fade } from "svelte/transition";

  import Sphere from "./Sphere.svelte";
  import Artemis from "./NASAArtemisGLTF/NASA_SLS-block-1-v2.svelte";
  import Orion from "./Orion/Orion_Draco_Optimized.svelte";
  import Starfield from "./Starfield.svelte";
  import HUDScene from "./HUDScene.svelte";
  import Moon from "./Moon/Moon.svelte";
  import Atmosphere from "./Atmosphere.svelte";
  import Waypoint from "./Waypoint.svelte";
  import ISS from "./ISS/ISS_stationary.svelte";
  import Text from "./Text.svelte";

  // Utils
  import { kmScale } from "~/src/lib/utils";

  // Stores
  import { scroll } from "~/src/stores/scroll.svelte";
  import { stage } from "~/src/stores/stage.svelte";
  import { onMount } from "svelte";

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
    cameraPosition: [number, number, number];
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

  const VISIBILITY_MULTIPLIER = 500;
  const ISS_SCALE = REAL_SCALE * VISIBILITY_MULTIPLIER; // ≈ 0.000487

  let cameraPositionSpring = new Spring<[number, number, number]>([0, 0, 0], {
    precision: 0.00001,
  });

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
    cameraPositionSpring.target = cameraPosition;
  });

  const whichScene = Match.type<{ downpage: number }>().pipe(
    Match.withReturnType<string>(),
    Match.when(
      { downpage: (downpage) => downpage < stage.getDownpage("excitement") },
      () => "setup",
    ),
    // Match.when({ downpage: (downpage) => downpage < 10000 }, () => "launch"),
    Match.orElse(() => "launch"),
  );
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
        });
      }}
    >
      <T.PerspectiveCamera
        makeDefault
        position={cameraPositionSpring.current}
        oncreate={(ref) => {}}
        fov={75}
        near={kmScale(0.01)}
        far={500}
      ></T.PerspectiveCamera>

      <T.DirectionalLight position={[500, 0, 200]} intensity={0.9} />
      <T.AmbientLight intensity={0.05} />

      <Starfield />

      <!-- <Sphere /> -->

      <T.Group position={[0, 0, -384]} rotation={[0, 0, -Math.PI * 1]}>
        <T.Group rotation={[0, Math.PI * 0.5, 0]}>
          <Moon scale={MOON_SCALE} />
        </T.Group>
      </T.Group>

      <!-- Stratosphere -->
      <Waypoint
        position={[0, 0, kmScale(-12)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(10)}
      >
        {#snippet children({ opacity })}
          <Atmosphere radius={kmScale(12)} colour="#3216ff" {opacity} />
        {/snippet}
      </Waypoint>

      <!-- <T.Mesh position={[0, 0, kmScale(-12.83)]} scale={1}>
        <T.BoxGeometry args={[kmScale(0.5), kmScale(0.1), kmScale(0.1)]} />
        <T.MeshNormalMaterial />
      </T.Mesh> -->

      <!-- Mesosphere -->
      <Waypoint
        position={[0, 0, kmScale(-50)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(10)}
      >
        {#snippet children({ opacity })}
          <Atmosphere radius={kmScale(50)} colour="#3216ff" {opacity} />
        {/snippet}
      </Waypoint>

      <!-- Thermosphere -->
      <Waypoint
        position={[0, 0, kmScale(-87)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(30)}
      >
        {#snippet children({ opacity })}
          <Atmosphere radius={kmScale(87)} colour="#3216ff" {opacity} />
        {/snippet}
      </Waypoint>

      <Waypoint
        position={[0, 0, kmScale(-340)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(300)}
      >
        {#snippet children({ opacity })}
          <ISS
            position={[0, kmScale(5), kmScale(-340)]}
            scale={ISS_SCALE}
            {opacity}
          />
        {/snippet}
      </Waypoint>

      <!-- Exosphere -->
      <Waypoint
        position={[0, 0, kmScale(-700)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(50)}
      >
        {#snippet children({ opacity })}
          <Atmosphere radius={kmScale(700)} colour="#3216ff" {opacity} />
        {/snippet}
      </Waypoint>
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

  // .launch {
  //   background-color: #0052a2;
  // }
</style>
