<script lang="ts">
  import { Canvas, T, useThrelte } from "@threlte/core";
  import { HUD, Grid } from "@threlte/extras";
  import * as THREE from "three";
  import { Spring } from "svelte/motion";

  import Sphere from "./Sphere.svelte";
  import Artemis from "./NASAArtemisGLTF/NASA_SLS-block-1-v2.svelte";
  import Orion from "./Orion.svelte";
  import Starfield from "./Starfield.svelte";
  import HUDScene from "./HUDScene.svelte";

  // Stores
  import { stage } from "~/src/stores/stage.svelte";

  export type ModelState = {
    isVisible?: boolean;
  };

  type Props = {
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
  }: Props = $props();

  let cameraPositionSpring = new Spring<[number, number, number]>([0, 0, 0]);

  $effect(() => {
    cameraPositionSpring.target = cameraPosition;
  });
</script>

<div class="stage-root">
  <Canvas>
    <T.PerspectiveCamera
      makeDefault
      position={cameraPositionSpring.current}
      oncreate={(ref) => {
        ref.lookAt(0, 0, 0);
      }}
      fov={90}
      near={0.01}
      far={1000}
    ></T.PerspectiveCamera>

    <T.DirectionalLight position={[10, 10, 10]} />
    <T.AmbientLight intensity={0.1} />

    {#if orionState.isVisible}
      <Orion position={[0, 0, 0]} orionRotation={undefined} />
    {/if}

    {#if artemisState.isVisible}
      <Artemis position={[0, -46, 0]} scale={0.5} />
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
