<script lang="ts">
  import { Canvas, T } from "@threlte/core";
  import Scene from "./ThreeScene.svelte";
  import Sphere from "./Sphere.svelte";
  import CanvasPortalTarget from "~/src/components/CanvasPortalTarget.svelte";
  import * as THREE from "three";

  import type { Snippet } from "svelte";
</script>

<div class="stage-root">
  <Canvas>
    <T.PerspectiveCamera
      makeDefault
      position={[0, 0, 10]}
      oncreate={(ref) => {
        ref.lookAt(0, 4, 0);
      }}
      fov={60}
      near={0.01}
      far={1000}
    ></T.PerspectiveCamera>

    <T.DirectionalLight position={[0, 10, 10]} />

    <T.Points>
      <T.BufferGeometry
        oncreate={(geo) => {
          const count = 2000;
          const pos = new Float32Array(count * 3);
          for (let i = 0; i < count * 3; i++) {
            pos[i] = (Math.random() - 0.5) * 500;
          }
          geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        }}
      />
      <T.PointsMaterial size={0.1} color="#ffffff" />
    </T.Points>

    <Scene />
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
