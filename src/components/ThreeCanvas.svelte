<script lang="ts">
  import { Canvas, T } from "@threlte/core";
  import Scene from "./ThreeScene.svelte";
  import Sphere from "./Sphere.svelte";
  import CanvasPortalTarget from "~/src/components/CanvasPortalTarget.svelte";

  import type { Snippet } from "svelte";
</script>

<div class="stage-root">
  <Canvas>
    <T.PerspectiveCamera
      makeDefault
      position={[10, 10, 10]}
      oncreate={(ref) => {
        ref.lookAt(0, 1, 0);
      }}
    ></T.PerspectiveCamera>

    <T.DirectionalLight position={[0, 10, 10]} />

    <!-- <Scene /> -->
    <Sphere />
    <CanvasPortalTarget />
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
