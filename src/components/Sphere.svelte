<script lang="ts">
  import { T } from "@threlte/core";
  import { interactivity } from "@threlte/extras";
  import { Spring } from "svelte/motion";
  import { scroll } from "../stores/scroll.svelte";

  interface Props {
    position?: [number, number, number];
    color?: string;
  }

  const { position = [3, 20, 2], color = "darkgray" }: Props = $props();

  interactivity();
  const scale = new Spring(1);

  $effect(() => {
    // scale.target = scroll.page / 80000;
  });
</script>

<!-- T.Mesh creates a THREE.Mesh -->
<T.Mesh {position} scale={scale.current}>
  <T.SphereGeometry args={[1, 16, 16]} />
  <T.MeshStandardMaterial {color} wireframe={false} />
</T.Mesh>
