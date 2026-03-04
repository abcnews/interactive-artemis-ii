<script lang="ts">
  import { Canvas, T, useThrelte } from "@threlte/core";
  import { HUD } from "@threlte/extras";
  import * as THREE from "three";
  import { Spring } from "svelte/motion";

  import Sphere from "./Sphere.svelte";
  import Aremis3D from "./Aremis3D.svelte";
  import Orion from "./Orion.svelte";
  import Starfield from "./Starfield.svelte";
  import Scene from "./HUDScene.svelte";

  type Props = {
    itemsVisible: string[];
    orionRotation?: [number, number, number];
    cameraZ?: number;
  };

  let { itemsVisible = [], orionRotation, cameraZ = 20 }: Props = $props();
</script>

<div class="stage-root">
  <!-- renderMode="always" -->
  <Canvas>
    <T.PerspectiveCamera
      makeDefault
      position={[0, 0, cameraZ]}
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

    {#if itemsVisible.includes("starfield")}
      <Starfield />
    {/if}

    {#if itemsVisible.includes("artemis")}
      <Aremis3D position={[0, 0, -150]} />
    {/if}

    {#if itemsVisible.includes("orion")}
      <!-- <Sphere position={[0, 0, 0]} /> -->
      <Orion position={[0, 0, 10]} orionRotation={undefined} />
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
