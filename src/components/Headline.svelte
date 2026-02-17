<script lang="ts">
  import HeaderText from "./HeaderText.svelte";
  import { Canvas, T } from "@threlte/core";
  import Scene from "./ThreeScene.svelte";
  import Sphere from "./Sphere.svelte";
  import CanvasPortalTarget from "~/src/components/CanvasPortalTarget.svelte";
  import { Text } from "@threlte/extras";
  import { Text3DGeometry } from "@threlte/extras";

  import type { Snippet } from "svelte";

  let text = "Artemis II";
  let bevelEnabled = true;
  let bevelOffset = 0;
  let bevelSegments = 20;
  let bevelSize = 0.2;
  let bevelThickness = 0.1;
  let curveSegments = 12;
  let depth = 1;
  let size = 5;
  let smooth = 0.1;
</script>

<div class="stage-root">
  <Canvas>
    <T.PerspectiveCamera
      makeDefault
      position={[0, -20, 50]}
      oncreate={(ref) => {
        ref.lookAt(0, 1, 0);
      }}
    ></T.PerspectiveCamera>

    <T.DirectionalLight position={[0, 10, 10]} />

    <HeaderText
      {text}
      {bevelEnabled}
      {bevelOffset}
      {bevelSegments}
      {bevelSize}
      {bevelThickness}
      {curveSegments}
      {depth}
      {size}
      {smooth}
    />
  </Canvas>
</div>

<style lang="scss">
  .stage-root {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -90px;
    left: 0;
    z-index: -1;
  }
</style>
