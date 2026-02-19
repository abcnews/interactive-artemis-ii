<script>
  import { T } from "@threlte/core";
  import { Spring } from "svelte/motion";
  import { scroll } from "../stores/scroll.svelte";

  const scale = new Spring(1);

  $effect(() => {
    // scale.target = scroll.page / 1000;
  });
</script>

<T.Mesh position.y={4} scale={scale.current}>
  <T.BoxGeometry args={[2, 4, 1]} />
  <T.MeshNormalMaterial color="#3a7bd5" />
</T.Mesh>
