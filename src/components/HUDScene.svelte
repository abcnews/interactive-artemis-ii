<script>
  import { T } from "@threlte/core";
</script>

<T.OrthographicCamera
  makeDefault
  position={[0, 0, 10]}
  oncreate={(ref) => ref.lookAt(0, 0, 0)}
  zoom={50}
/>

<T.AmbientLight />

<T.Mesh>
  <T.BoxGeometry />
  <T.MeshStandardMaterial />
</T.Mesh>
