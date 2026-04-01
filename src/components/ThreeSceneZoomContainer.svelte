<script lang="ts">
  import { Canvas, T } from "@threlte/core";
  import { fade } from "svelte/transition";
  import * as THREE from "three";

  import { kmScale } from "../lib/utils";

  import { gpu } from "~/src/stores/gpu.svelte";

  // Components
  import Artemis from "./models/NASAArtemisGLTF/NASA_SLS-block-1-v2.svelte";
  import Orion from "./models/Orion/Orion_Draco_Optimized.svelte";
  import Starfield from "./Starfield.svelte";
  import StarfieldStatic from "./StarfieldStatic.svelte";
  import HUDScene from "./HUDScene.svelte";
  import Moon from "./models/Moon/Moon.svelte";
  import Atmosphere from "./Atmosphere.svelte";
  import Waypoint from "./Waypoint.svelte";
  import ISS from "./models/ISS/ISS_stationary.svelte";
  import Cornish from "./models/Cornish/CornishBasic.svelte";
  import Text from "./Text.svelte";
  import PostProcessing from "./PostProcessing.svelte";
  import Gemini from "./models/Gemini.svelte";
  import DistanceMarkers from "./DistanceMarkers.svelte";
  import Gagarin from "./models/Gagarin.svelte";
  import GPS from "./models/GPS.svelte";
  import Sputnik2 from "./models/Sputnik2.svelte";
  import Vostok1 from "./models/Vostok_1.svelte";
  import Hubble from "./models/Hubble.svelte";

  const MOON_SCALE = 3.474 / 2;
  const ATMOSPHERE_THICKNESS = 0.05;
  const STAGE_FADE_DURATION = 500;

  // IIS BASIC SCALING (NOT SCIENTIFIC)
  const RAW_WIDTH = 111.99;
  const REAL_SCALE = 0.000109 / RAW_WIDTH;

  const VISIBILITY_MULTIPLIER = 10;
  const ISS_SCALE = REAL_SCALE * VISIBILITY_MULTIPLIER;

  const { cameraPosition, isOutro = false } = $props();

  const cameraPositionSpring = $derived.by(() => {
    return {
      current: cameraPosition,
    };
  });
</script>

<div
  class="stage-root launch"
  class:faded={isOutro}
  in:fade={{
    duration: STAGE_FADE_DURATION,
  }}
>
  {#if gpu.qualityTier === "low"}
    <StarfieldStatic />
  {/if}
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
    <T.PerspectiveCamera
      makeDefault
      position={cameraPositionSpring.current}
      oncreate={(ref) => {
        // Keep the viewing angle perfectly parallel regardless of where we scroll-spawn.
        // By looking exactly 406 units ahead and 80 units down relative to its current Z location,
        // the pitch angle remains an identical -11 degrees even if we spawn close to the moon!
        const spawnZ = cameraPositionSpring.current[2];
        ref.lookAt(0, -80, spawnZ - 406);
      }}
      fov={75}
      near={kmScale(0.01)}
      far={500}
    ></T.PerspectiveCamera>

    <T.DirectionalLight position={[500, 0, 200]} intensity={0.9} />
    <T.AmbientLight intensity={0.1} />

    {#if gpu.qualityTier === "high"}
      <Starfield />
    {/if}

    <DistanceMarkers cameraPosition={cameraPositionSpring.current} />

    <!-- Troposphere - to Stratosphere -->
    <Waypoint
      position={[0, 0, kmScale(-12)]}
      cameraPosition={cameraPositionSpring.current}
      visibleRange={kmScale(10)}
    >
      {#snippet children({ opacity })}
        <Atmosphere
          radius={kmScale(12)}
          colour="#4f02ff"
          {opacity}
          thickness={ATMOSPHERE_THICKNESS}
          yOffset={-0.5}
          bloomScale={0.5}
        />
      {/snippet}
    </Waypoint>

    <!-- Cornish pasty -->
    <Waypoint
      position={[0, 0, kmScale(-35.5)]}
      cameraPosition={cameraPositionSpring.current}
      visibleRange={kmScale(22)}
    >
      {#snippet children({ opacity })}
        <Cornish
          scale={kmScale(0.07)}
          position={[kmScale(0.04), kmScale(-0.2), kmScale(-35.5)]}
          {opacity}
        ></Cornish>
      {/snippet}
    </Waypoint>

    <!-- Stratosphere end - Mesosphere start -->
    <Waypoint
      position={[0, 0, kmScale(-50)]}
      cameraPosition={cameraPositionSpring.current}
      visibleRange={kmScale(30)}
    >
      {#snippet children({ opacity })}
        <Atmosphere
          radius={kmScale(50)}
          colour="#8a52ff"
          {opacity}
          thickness={ATMOSPHERE_THICKNESS}
          bloomScale={0.5}
        />
      {/snippet}
    </Waypoint>

    <!-- Mesosphere end - Thermosphere start -->
    <Waypoint
      position={[0, 0, kmScale(-87)]}
      cameraPosition={cameraPositionSpring.current}
      visibleRange={kmScale(50)}
    >
      {#snippet children({ opacity })}
        <Atmosphere
          radius={kmScale(87)}
          colour="#d5b4ff"
          {opacity}
          thickness={ATMOSPHERE_THICKNESS}
          bloomScale={0.4}
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
          colour="#9c9c9c"
          {opacity}
          thickness={ATMOSPHERE_THICKNESS}
          bloomScale={0.5}
          dashed={true}
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
        <!-- <Gagarin
            position={[kmScale(-0.1), kmScale(-0.2), kmScale(-240)]}
            {opacity}
          /> -->
        <Vostok1
          position={[kmScale(-0.3), kmScale(-0.3), kmScale(-240)]}
          {opacity}
          scale={kmScale(0.03)}
          rotation={[Math.PI * -0.4, Math.PI * 0.0, Math.PI * -0.1]}
        />
      {/snippet}
    </Waypoint>

    <!-- ISS -->
    <Waypoint
      position={[0, 0, kmScale(-400)]}
      cameraPosition={cameraPositionSpring.current}
      visibleRange={kmScale(80)}
    >
      {#snippet children({ opacity })}
        <ISS
          position={[kmScale(0.01), kmScale(0.2), kmScale(-400)]}
          rotation={[0, 0, 0]}
          scale={ISS_SCALE}
          {opacity}
        />
      {/snippet}
    </Waypoint>

    <!-- Hubble / space jumk etc -->
    <Waypoint
      position={[0, 0, kmScale(-540)]}
      cameraPosition={cameraPositionSpring.current}
      visibleRange={kmScale(120)}
    >
      {#snippet children({ opacity })}
        <Hubble
          position={[kmScale(1.1), kmScale(-0.9), kmScale(-540)]}
          rotation={[Math.PI * 0.1, Math.PI * 0.03, Math.PI * 0.03]}
          scale={kmScale(0.008)}
          {opacity}
        ></Hubble>
      {/snippet}
    </Waypoint>

    <!-- Exosphere -->
    <Waypoint
      position={[0, 0, kmScale(-700)]}
      cameraPosition={cameraPositionSpring.current}
      visibleRange={kmScale(100)}
    >
      {#snippet children({ opacity })}
        <Atmosphere
          radius={kmScale(700)}
          colour="#4fffff"
          {opacity}
          thickness={ATMOSPHERE_THICKNESS}
          bloomScale={0.3}
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
          colour="#12f99d"
          {opacity}
          thickness={ATMOSPHERE_THICKNESS}
          bloomScale={0.4}
        />
      {/snippet}
    </Waypoint>

    <!-- GPS -->
    <Waypoint
      position={[0, 0, kmScale(-20180)]}
      cameraPosition={cameraPositionSpring.current}
      visibleRange={kmScale(5000)}
    >
      {#snippet children({ opacity })}
        <GPS
          position={[kmScale(1.2), kmScale(-1.1), kmScale(-20180)]}
          rotation={[-(Math.PI * 0.1), Math.PI * 0.1, Math.PI * 0.4]}
          scale={kmScale(0.02)}
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

    {#if gpu.postProcessingEnabled}
      <PostProcessing />
    {/if}
  </Canvas>
</div>

<style lang="scss">
  .stage-root {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }
  .stage-root.launch {
    background-color: #0f0f0f;
    transition: opacity 500ms ease;

    &.faded {
      opacity: 0;
    }
  }
</style>
