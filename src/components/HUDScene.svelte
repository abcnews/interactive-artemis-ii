<script>
  import { T } from "@threlte/core";
  import Orion from "./Orion/Orion_Draco_Optimized.svelte";
</script>

<T.PerspectiveCamera
  makeDefault
  position={[0, 0, 0]}
  oncreate={(ref) => {}}
  fov={78}
  near={0.01}
  far={1000}
></T.PerspectiveCamera>

<T.AmbientLight />

<T.Mesh position={[0, 0, 20]}>
  <T.BoxGeometry />
  <T.MeshStandardMaterial />
</T.Mesh>

<Orion position={[0, 0, -20]}/>