<script lang="ts">
  import { T } from "@threlte/core";

  // Optional: Export props to make the component reusable
  export let position: [number, number, number] = [0, 0, 0];
  export let scale = 1;
  export let color = "white";
</script>

<!-- T.Mesh creates a THREE.Mesh -->
<T.Mesh {position} {scale}>
  <!-- 
    args: [radius, widthSegments, heightSegments] 
    Lower segments (e.g., 16) make the wireframe look more "retro"
  -->
  <T.SphereGeometry args={[1, 20, 20]} />

  <!-- 
    wireframe: true enables the wireframe mode 
    MeshBasicMaterial is used so we don't need to add lights to see it
  -->
  <T.MeshBasicMaterial {color} wireframe />
</T.Mesh>
