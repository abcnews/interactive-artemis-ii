<script lang="ts">
  import { Canvas, T } from "@threlte/core";
  import { fade } from "svelte/transition";
  import { type CameraPositionResult } from "../lib/getCameraPosition";
  import { scaleLinear } from "d3-scale";

  // Components
  import Artemis from "./models/NASAArtemisGLTF/NASA_SLS-block-1-v2.svelte";
  import Orion from "./models/Orion/Orion_Draco_Optimized.svelte";
  import ThreeSceneZoomContainer from "./ThreeSceneZoomContainer.svelte";

  // Utils
  import { kmScale } from "~/src/lib/utils";

  // Stores
  import { scroll } from "~/src/stores/scroll.svelte";
  import { stage } from "~/src/stores/stage.svelte";

  // Constants
  const SCENE_FADE_DURATION = 250;

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
    if (isBetween("zoomintro", "excitement")) return "launch";
    if (isBetween("excitement", "points")) return "excitement";
    if (isBetween("points", "stratosphere")) return "points";
    if (isBetween("stratosphere", "maxq")) return "troposphere";
    if (isBetween("maxq", "cornish")) return "maxq";
    if (isBetween("cornish", "cornish2")) return "cornish";
    if (isBetween("cornish2", "2mins")) return "cornish2";
    if (isBetween("2mins", "thermosphere")) return "2mins";
    if (isBetween("thermosphere", "space")) return "thermosphere";
    if (isBetween("space", "core")) return "space";
    if (isBetween("core", "yuri")) return "core";
    if (isBetween("yuri", "spacestation")) return "yuri";
    if (isBetween("spacestation", "spacestation2")) return "spacestation";
    if (isBetween("spacestation2", "exosphere")) return "spacestation2";
    if (isBetween("exosphere", "exosphere2")) return "exosphere";
    if (isBetween("exosphere2", "gemini")) return "exosphere2";
    if (isBetween("gemini", "gemini2")) return "gemini";
    if (isBetween("gemini2", "laika")) return "gemini2";
    if (isBetween("laika", "laika2")) return "laika";
    if (isBetween("laika2", "raise")) return "laika2";
    if (isBetween("raise", "preouterspace")) return "raise";
    if (isBetween("preouterspace", "outerspace")) return "preouterspace";
    if (isBetween("outerspace", "pregps")) return "outerspace";
    if (isBetween("pregps", "gps")) return "pregps";
    if (isBetween("gps", "pretranslunar")) return "gps";
    if (isBetween("pretranslunar", "translunar")) return "pretranslunar";
    if (isBetween("translunar", "moonrange")) return "translunar";
    if (isBetween("moonrange", "apollo8")) return "moonrange";
    if (isBetween("apollo8", "averagemoon")) return "apollo8";
    if (isBetween("averagemoon", "flyby1")) return "averagemoon";
    if (isBetween("flyby1", "record")) return "flyby1";
    if (isBetween("record", "endmoon")) return "record";
    if (isBetween("endmoon", "outerrange")) return "endmoon";
    return "outerrange";
  });

  let cameraPositionAbsolute = $derived.by(() => {
    if (currentScene === "orion") return [0, 0, 0];
    if (currentScene === "artemis") return [0, 36, -80];
    if (currentScene === "launch") return [0, 0, 0];
    if (currentScene === "excitement") return [0, 0, kmScale(-0)];
    if (currentScene === "points") return [0, 0, kmScale(-6)];
    if (currentScene === "troposphere") return [0, 0, kmScale(-10.5)];
    if (currentScene === "maxq") return [0, 0, kmScale(-11.5)];
    if (currentScene === "cornish") return [0, 0, kmScale(-30)];
    if (currentScene === "cornish2") return [0, 0, kmScale(-34.9)];
    if (currentScene === "2mins") return [0, 0, kmScale(-48)];
    if (currentScene === "thermosphere") return [0, 0, kmScale(-84)];
    if (currentScene === "space") return [0, 0, kmScale(-96)];
    if (currentScene === "core") return [0, 0, kmScale(-235)];
    if (currentScene === "yuri") return [0, 0, kmScale(-239.6)];
    if (currentScene === "spacestation") return [0, 0, kmScale(-393)];
    if (currentScene === "spacestation2") return [0, 0, kmScale(-398)];
    if (currentScene === "exosphere") return [0, 0, kmScale(-531)];
    if (currentScene === "exosphere2") return [0, 0, kmScale(-697)];
    if (currentScene === "gemini") return [0, 0, kmScale(-1352)];
    if (currentScene === "gemini2") return [0, 0, kmScale(-1366.5)];
    if (currentScene === "laika") return [0, 0, kmScale(-1649)];
    if (currentScene === "laika2") return [0, 0, kmScale(-1656)];
    if (currentScene === "raise") return [0, 0, kmScale(-9988)];
    if (currentScene === "preouterspace") return [0, 0, kmScale(-9998)];
    if (currentScene === "outerspace") return [0, 0, kmScale(-20122)];
    if (currentScene === "pregps") return [0, 0, kmScale(-20167)];
    if (currentScene === "gps") return [0, 0, kmScale(-20829)];
    if (currentScene === "pretranslunar") return [0, 0, kmScale(-32000)];
    if (currentScene === "translunar") {
      const zKm = cameraPosition.position[2] * 1000;
      const stepSize = 20000;

      // Handle bounds
      if (zKm > -40000) return [0, 0, kmScale(-40000)];
      if (zKm <= -350000) return [0, 0, kmScale(-350000)];

      // Calculate step index (quantizing to 10k units)
      const stepIndex = Math.floor(Math.abs(zKm) / stepSize);
      const snappedKm = stepIndex * stepSize;

      // This breaks the aliasing where every jump looks identical
      const jitterZ = (stepIndex % 5) * 2000; // Adds 0, 2000, 4000, 6000, 8000 km

      const finalKm = snappedKm + jitterZ;
      return [0, 0, kmScale(-finalKm)];
    }
    if (currentScene === "moonrange") return [0, 0, kmScale(-356000)];
    if (currentScene === "apollo8") return [0, 0, kmScale(-377349)];
    if (currentScene === "averagemoon") return [0, 0, kmScale(-384400)];
    if (currentScene === "flyby1") return [0, 0, kmScale(-385500)];
    if (currentScene === "record") return [0, 0, kmScale(-400171)];
    if (currentScene === "endmoon") return [0, 0, kmScale(-400171)];
    if (currentScene === "outerrange") return [0, 0, kmScale(-400171)];
    return [0, 0, 0];
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
{:else}
  <ThreeSceneZoomContainer
    cameraPosition={cameraPositionAbsolute}
    isOutro={currentScene === "outerrange"}
  />
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
