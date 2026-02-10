<script lang="ts">
  import { Canvas, T } from "@threlte/core";
  import Scene from "./ThreeScene.svelte";
  import Sphere from "./Sphere.svelte";
  import { OrbitControls } from "@threlte/extras";
</script>

<div class="stage-root">
  <Canvas>
    <T.PerspectiveCamera
      makeDefault
      position={[10, 10, 10]}
      oncreate={(ref) => {
        ref.lookAt(0, 1, 0);
      }}
    >
      <OrbitControls enableDamping />
    </T.PerspectiveCamera>

    <Scene />
    <Sphere />
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
