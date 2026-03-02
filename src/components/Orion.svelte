<script lang="ts">
  import { T } from "@threlte/core";
  import { useGltf, useDraco } from "@threlte/extras";
  import * as THREE from "three";

  // Assets
  import OrionGL from "~/src/assets/Orion_Draco_Optimized.glb?url";

  type Props = {
    position?: [number, number, number];
    path?: string;
  };

  const { position = [0, 0, 0], path = OrionGL }: Props = $props();

  const dracoLoader = useDraco();

  const gltf = $derived(
    useGltf(path, {
      dracoLoader,
    }),
  );
</script>

{#if $gltf}
  <T is={$gltf.scene} {position} />
{/if}
