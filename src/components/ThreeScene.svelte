<script lang="ts">
  import { Canvas, T, useThrelte } from "@threlte/core";
  import { HUD, Grid } from "@threlte/extras";
  import * as THREE from "three";
  import { Spring } from "svelte/motion";

  import Sphere from "./Sphere.svelte";
  import Aremis3D from "./Aremis3D.svelte";
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
    starfieldState: ModelState;
    orionState: ModelState;
    artemisState: ModelState
  };

  let {
    itemsVisible = [],
    cameraZ = 200,
    orionRotation,
    starfieldState = { isVisible: false },
    orionState = { isVisible: false },
    artemisState = { isVisible: false },
  }: Props = $props();

  let cameraZSpring = new Spring(0);

  $effect(() => {
    cameraZSpring.target = cameraZ;
  });
</script>

<div class="stage-root">
  <!-- renderMode="always" -->
  <Canvas>
    <T.PerspectiveCamera
      makeDefault
      position={[0, 0, cameraZSpring.current]}
      oncreate={(ref) => {
        ref.lookAt(0, 0, 0);
      }}
      fov={90}
      near={0.01}
      far={1000}
    ></T.PerspectiveCamera>

    <T.DirectionalLight position={[10, 10, 10]} />
    <T.AmbientLight intensity={0.1} />

    <!-- <HUD>
      <Scene />
    </HUD> -->

      <!-- <Starfield /> -->


    {#if orionState.isVisible}
      <Orion position={[0, 0, 0]} orionRotation={undefined} />
    {/if}

    {#if artemisState.isVisible}
      <Aremis3D position={[0, -46, 0]} scale={0.5} />
    {/if} 

    <!-- <Grid type="grid" infiniteGrid={true} plane="xy" cellColor="green" gridSize={1000}>
      <T.BoxGeometry />
    </Grid> -->
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
