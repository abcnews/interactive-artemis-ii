<script lang="ts">
  import { T } from "@threlte/core";

  interface Props {
    position?: [number, number, number];
    color?: string;
  }

  const { position = [0, 0, 0], color = "darkgray" }: Props = $props();
</script>

<T.Mesh {position}>
  <T.SphereGeometry args={[1, 16, 16]} />
  <T.MeshStandardMaterial {color} wireframe={false} />
</T.Mesh>
