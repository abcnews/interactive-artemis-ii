<script lang="ts">
  import { Canvas, T } from "@threlte/core";
  import { fade } from "svelte/transition";
  import * as THREE from "three";

  import { kmScale } from "../lib/utils";

  import { gpu } from "~/src/stores/gpu.svelte";

  // Components
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

  const MOON_SCALE = 3.474 / 2;
  const ATMOSPHERE_THICKNESS = 0.05;
  const STAGE_FADE_DURATION = 500;

  // IIS BASIC SCALING (NOT SCIENTIFIC)
  const RAW_WIDTH = 111.99;
  const REAL_SCALE = 0.000109 / RAW_WIDTH;

  const VISIBILITY_MULTIPLIER = 10;
  const ISS_SCALE = REAL_SCALE * VISIBILITY_MULTIPLIER;

  const { cameraPosition } = $props();
</script>

<div
  class="stage-root launch"
  in:fade={{ duration: STAGE_FADE_DURATION, delay: 0 }}
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
    {#if gpu.qualityTier === "high"}
      <T.Color attach="background" args={["#0f0f0f"]} />
    {/if}
    <T.PerspectiveCamera
      makeDefault
      position={cameraPosition}
      oncreate={(ref) => {
        ref.lookAt(0, -80, -406);
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

    <DistanceMarkers {cameraPosition} />

    <!-- Stratosphere -->
    <Waypoint
      position={[0, 0, kmScale(-12)]}
      {cameraPosition}
      visibleRange={kmScale(10)}
    >
      {#snippet children({ opacity })}
        <Atmosphere
          radius={kmScale(12)}
          colour="#3216ff"
          {opacity}
          thickness={ATMOSPHERE_THICKNESS}
          yOffset={-0.5}
        />
      {/snippet}
    </Waypoint>

    <!-- Cornish pasty -->
    <Waypoint
      position={[0, 0, kmScale(-35.5)]}
      {cameraPosition}
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
      {cameraPosition}
      visibleRange={kmScale(40)}
    >
      {#snippet children({ opacity })}
        <Atmosphere
          radius={kmScale(50)}
          colour="#3216ff"
          {opacity}
          thickness={ATMOSPHERE_THICKNESS}
        />
      {/snippet}
    </Waypoint>

    <!-- Thermosphere -->
    <Waypoint
      position={[0, 0, kmScale(-87)]}
      {cameraPosition}
      visibleRange={kmScale(30)}
    >
      {#snippet children({ opacity })}
        <Atmosphere
          radius={kmScale(87)}
          colour="#3216ff"
          {opacity}
          thickness={ATMOSPHERE_THICKNESS}
        />
      {/snippet}
    </Waypoint>

    <!-- Karman line (SPACE) -->
    <Waypoint
      position={[0, 0, kmScale(-100)]}
      {cameraPosition}
      visibleRange={kmScale(30)}
    >
      {#snippet children({ opacity })}
        <Atmosphere
          radius={kmScale(100)}
          colour="#3216ff"
          {opacity}
          thickness={ATMOSPHERE_THICKNESS}
        />
      {/snippet}
    </Waypoint>

    <!-- Yuri Gagaran -->
    <Waypoint
      position={[0, 0, kmScale(-240)]}
      {cameraPosition}
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
      {cameraPosition}
      visibleRange={kmScale(80)}
    >
      {#snippet children({ opacity })}
        <ISS
          position={[kmScale(0.01), kmScale(0.2), kmScale(-400)]}
          scale={ISS_SCALE}
          {opacity}
        />
      {/snippet}
    </Waypoint>

    <!-- Exosphere -->
    <Waypoint
      position={[0, 0, kmScale(-700)]}
      {cameraPosition}
      visibleRange={kmScale(500)}
    >
      {#snippet children({ opacity })}
        <Atmosphere
          radius={kmScale(700)}
          colour="#3216ff"
          {opacity}
          thickness={ATMOSPHERE_THICKNESS}
        />
      {/snippet}
    </Waypoint>

    <!-- Gemini 11 -->
    <Waypoint
      position={[0, 0, kmScale(-1369)]}
      {cameraPosition}
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
      {cameraPosition}
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
      {cameraPosition}
      visibleRange={kmScale(500)}
    >
      {#snippet children({ opacity })}
        <Atmosphere
          radius={kmScale(10000)}
          colour="#3216ff"
          {opacity}
          thickness={ATMOSPHERE_THICKNESS}
        />
      {/snippet}
    </Waypoint>

    <!-- GPS -->
    <Waypoint
      position={[0, 0, kmScale(-20180)]}
      {cameraPosition}
      visibleRange={kmScale(5000)}
    >
      {#snippet children({ opacity })}
        <GPS
          position={[kmScale(0.4), kmScale(-0.8), kmScale(-20180)]}
          rotation={[-(Math.PI * 0.1), Math.PI * 0.1, Math.PI * 0.4]}
          scale={kmScale(0.02)}
          {opacity}
        ></GPS>
      {/snippet}
    </Waypoint>

    <!-- The Moon -->
    <T.Group position={[0, 0, -406]} rotation={[0, 0, -Math.PI * 1]}>
      <T.Group rotation={[0, Math.PI * 0.5, 0]}>
        <Moon scale={MOON_SCALE} {cameraPosition} />
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
</style>