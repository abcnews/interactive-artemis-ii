<script lang="ts">
  import { T } from "@threlte/core";

  // Optional: Export props to make the component reusable
  export let position: [number, number, number] = [0, 0, 0];
  export let scale = 1;
  export let color = "darkgray";
</script>

<!-- T.Mesh creates a THREE.Mesh -->
<T.Mesh {position} {scale}>
  
  <T.SphereGeometry args={[1, 16, 16]} />

  
  <T.MeshStandardMaterial {color} wireframe={false} />
</T.Mesh>
