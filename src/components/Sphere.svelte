<script lang="ts">
  import { T } from "@threlte/core";
  import { interactivity } from "@threlte/extras";
  import { Spring } from "svelte/motion";
  import { scroll } from "../stores/scroll.svelte";
  import { Portal } from "@threlte/extras";

  interface Props {
    position?: [number, number, number];
    color?: string;
  }

  const { position = [3, 20, 2], color = "darkgray" }: Props = $props();
</script>

<Portal id="main-portal">
  <T.Mesh {position}>
    <T.SphereGeometry args={[1, 16, 16]} />
    <T.MeshStandardMaterial {color} wireframe={false} />
  </T.Mesh>
</Portal>
