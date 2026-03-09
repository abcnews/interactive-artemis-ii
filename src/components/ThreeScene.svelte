<script lang="ts">
  import { Canvas, T, useThrelte } from "@threlte/core";
  import { HUD, Grid, Stars, Float } from "@threlte/extras";
  import * as THREE from "three";
  import { Spring } from "svelte/motion";
  import { Match } from "effect";
  import { fade } from "svelte/transition";

  import Sphere from "./Sphere.svelte";
  import Artemis from "./NASAArtemisGLTF/NASA_SLS-block-1-v2.svelte";
  import Orion from "./Orion.svelte";
  import Starfield from "./Starfield.svelte";
  import HUDScene from "./HUDScene.svelte";
  import Moon from "./Moon/Moon.svelte";
  import Atmosphere from "./Atmosphere.svelte";

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

  let cameraPositionSpring = new Spring<[number, number, number]>([0, 0, 0]);
  let artemisOpacity = $derived.by(() => {
    return stage.getProgressBetweenSections({
      start: "artemis",
      end: "takeoff",
      endOffset: -500,
      domain: [0, 1],
      clamp: true,
    })(scroll.pageScrollBottom);
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
  <div class="stage-root setup" transition:fade={{ duration: 2000 }}>
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
          <Orion position={[0, 36, -70]} orionRotation={undefined} />
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
  <div class="stage-root launch" transition:fade={{ duration: 2000 }}>
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
        near={0.01 / 1000}
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
      <Atmosphere radius={12 / 1000} colour="#3216ff" />

      <!-- Mesosphere -->
      <Atmosphere radius={50 / 1000} colour="#3216ff" />
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
