<script lang="ts">
  import { Canvas, T, useThrelte, useTask } from "@threlte/core";
  import { HUD, Grid, Stars, Float, SVG } from "@threlte/extras";
  import * as THREE from "three";
  import { Spring } from "svelte/motion";
  import { Match } from "effect";
  import { fade } from "svelte/transition";
  import { type CameraPositionResult } from "../lib/getCameraPosition";
  import { Throttled } from "runed";
  import { scaleLinear } from "d3-scale";

  // Components
  import Artemis from "./models/NASAArtemisGLTF/NASA_SLS-block-1-v2.svelte";
  import Orion from "./models/Orion/Orion_Draco_Optimized.svelte";
  import Starfield from "./Starfield.svelte";
  import StarfieldStatic from "./StarfieldStatic.svelte";
  import Moon from "./models/Moon/Moon.svelte";
  import Atmosphere from "./Atmosphere.svelte";
  import Waypoint from "./Waypoint.svelte";
  import ISS from "./models/ISS/ISS_stationary.svelte";
  import Cornish from "./models/Cornish/CornishBasic.svelte";
  import PostProcessing from "./PostProcessing.svelte";
  import Gemini from "./models/Gemini.svelte";
  import DistanceMarkers from "./DistanceMarkers.svelte";
  import Gagarin from "./models/Gagarin.svelte";
  import Vostok1 from "./models/Vostok_1.svelte";
  import GPS from "./models/GPS.svelte";
  import Sputnik2 from "./models/Sputnik2.svelte";
  import Hubble from "./models/Hubble.svelte";

  // Utils
  import { kmScale } from "~/src/lib/utils";

  // Stores
  import { scroll } from "~/src/stores/scroll.svelte";
  import { stage } from "~/src/stores/stage.svelte";
  import { accessibility } from "~/src/stores/accessibility.svelte";
  import { gpu } from "~/src/stores/gpu.svelte";

  // Constants
  const MOON_SCALE = 3.474 / 2;
  const ATMOSPHERE_THICKNESS = 0.1;
  const STAGE_FADE_DURATION = 500;

  export type ModelState = {
    isVisible?: boolean;
    shouldFloat?: boolean;
  };

  type ComponentProps = {
    cameraPosition: CameraPositionResult;
    orionState: ModelState;
    artemisState: ModelState;
  };

  let {
    cameraPosition,
    orionState = { isVisible: false },
    artemisState = { isVisible: false },
  }: ComponentProps = $props();

  // Scaling of the International Space Station
  // 1 unit = 1,000km = 1,000,000m
  // ISS real width = 109m = 0.000109 units
  const RAW_WIDTH = 111.99;
  const REAL_SCALE = 0.000109 / RAW_WIDTH; // ≈ 9.73e-7

  const VISIBILITY_MULTIPLIER = 10;
  const ISS_SCALE = REAL_SCALE * VISIBILITY_MULTIPLIER; // ≈ 0.000487

  let cameraPositionSpring = new Spring<[number, number, number]>([0, 0, 0], {
    precision: 0.00001,
  });

  let orionPosSpring = new Spring(0, {
    stiffness: 0.2,
    damping: 2,
  });

  const throttledPosition = new Throttled(
    () => cameraPosition.position, // reactive source
    1000,
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

  let targetOrionY = $derived.by(() => {
    const introPanel = scroll.panelsCurrent.find(
      (panel) => panel.name === "intro",
    );

    // If not visible, keep it safely below the camera's view
    if (!introPanel) return 10;

    // screenProgress 0.0 -> Orion starts below the frame (e.g. Y = 16)
    // screenProgress 0.8 -> Orion reaches its final position (Y = 36) and "docks"
    return scaleLinear()
      .domain([0.0, 1.2]) // Matches your old 0.8 pop-in point
      .range([10, 36]) // Tune '10' so it enters the bottom of the screen exactly as you scroll
      .clamp(true)(introPanel.screenProgress);
  });

  // Smooth fade in as it rises, rather than a hard pop
  let orionOpacity = $derived.by(() => {
    const introPanel = scroll.panelsCurrent.find(
      (panel) => panel.name === "intro",
    );
    if (!introPanel) return 0;

    return scaleLinear().domain([0.0, 0.2]).range([0, 1]).clamp(true)(
      introPanel.screenProgress,
    );
  });

  $effect(() => {
    // Max camera
    cameraPositionSpring.set(
      cameraPosition.position[2] < -400
        ? [0, 0, -400]
        : cameraPosition.position,
    );
  });

  $effect(() => {
    orionPosSpring.target = targetOrionY;
  });

  const whichScene = Match.type<{ downpage: number }>().pipe(
    Match.withReturnType<string>(),
    Match.when(
      { downpage: (downpage) => downpage < stage.getDownpage("zoomintro") },
      () => "setup",
    ),
    Match.when(
      {
        downpage: (downpage) =>
          downpage >= stage.getDownpage("zoomintro") &&
          downpage < stage.getDownpage("outerrange"),
      },
      () => "zoomsection",
    ),
    Match.when(
      { downpage: (downpage) => downpage >= stage.getDownpage("outerrange") },
      () => "outro",
    ),
    Match.orElse(() => "unknown"),
  );
</script>

{#if whichScene({ downpage: scroll.pageScrollBottom }) === "setup"}
  <div
    class="stage-root setup"
    transition:fade={{ duration: STAGE_FADE_DURATION }}
  >
    <Canvas>
      <T.PerspectiveCamera
        makeDefault
        position={cameraPositionSpring.current}
        oncreate={(ref) => {}}
        fov={70}
        near={0.01}
        far={1000}
      ></T.PerspectiveCamera>

      <T.DirectionalLight position={[10, 10, 10]} />
      <T.AmbientLight intensity={0.1} />

      {#if orionState.isVisible}
        <Float
          floatIntensity={orionState.shouldFloat ? kmScale(10) : 0}
          rotationIntensity={orionState.shouldFloat ? kmScale(100) : 0}
          rotationSpeed={[1, 0.5, 0.2]}
        >
          <Orion
            position={[0, orionPosSpring.current, -80]}
            orionRotation={undefined}
            opacity={orionOpacity}
          />
        </Float>
      {/if}

      {#if artemisState.isVisible}
        <Artemis
          position={[0, -10, -80]}
          scale={0.5}
          opacity={artemisOpacity}
        />
      {/if}
    </Canvas>
  </div>
{:else if whichScene({ downpage: scroll.pageScrollBottom }) === "zoomsection"}
  <div
    class="stage-root launch"
    in:fade={{
      duration: STAGE_FADE_DURATION,
    }}
    out:fade={{
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
            thickness={ATMOSPHERE_THICKNESS}
            yOffset={-0.5}
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
            colour="#F5276C"
            {opacity}
            thickness={ATMOSPHERE_THICKNESS}
          />
        {/snippet}
      </Waypoint>

      <!-- Mesosphere end - Thermosphere start -->
      <Waypoint
        position={[0, 0, kmScale(-87)]}
        cameraPosition={cameraPositionSpring.current}
        visibleRange={kmScale(40)}
      >
        {#snippet children({ opacity })}
          <Atmosphere
            radius={kmScale(87)}
            colour="#F5B027"
            {opacity}
            thickness={ATMOSPHERE_THICKNESS}
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
            colour="#00A36C"
            {opacity}
            thickness={ATMOSPHERE_THICKNESS}
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
            position={[kmScale(-0.1), kmScale(-0.1), kmScale(-240)]}
            {opacity}
            scale={kmScale(0.01)}
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
            position={[kmScale(1.5), kmScale(-1.7), kmScale(-540)]}
            rotation={[Math.PI * 0.08, Math.PI * 0.03, Math.PI * 0.03]}
            scale={kmScale(0.01)}
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
            colour="#3216ff"
            {opacity}
            thickness={ATMOSPHERE_THICKNESS}
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
            colour="#9648D5"
            {opacity}
            thickness={ATMOSPHERE_THICKNESS}
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
{:else if whichScene({ downpage: scroll.pageScrollBottom }) === "outro"}
  <div class="stage-root outro"></div>
{/if}

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
  }
</style>
