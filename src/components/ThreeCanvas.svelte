<script lang="ts">
  import { Canvas, T } from "@threlte/core";
  import { Spring } from "svelte/motion";

  import Sphere from "./Sphere.svelte";
  import Aremis3D from "./Aremis3D.svelte";
  import Starfield from "./Starfield.svelte";
  import { includes } from "valibot";

  const { itemsVisible = [] } = $props();
</script>

<div class="stage-root">
  <Canvas>
    <T.PerspectiveCamera
      makeDefault
      position={[0, 0, 20]}
      oncreate={(ref) => {
        ref.lookAt(0, 0, 0);
      }}
      fov={90}
      near={0.01}
      far={1000}
    ></T.PerspectiveCamera>

    <T.DirectionalLight position={[0, 10, 10]} />
    <T.AmbientLight intensity={0.15} />

    {#if itemsVisible.includes("starfield")}
      <Starfield />
    {/if}
    <Sphere />
    <Aremis3D />
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
