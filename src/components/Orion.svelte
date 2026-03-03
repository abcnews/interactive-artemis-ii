<script lang="ts">
  import { T } from "@threlte/core";
  import { useGltf, useDraco } from "@threlte/extras";
  import * as THREE from "three";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  // Assets
  import OrionGL from "~/src/assets/Orion_Draco_Optimized.glb?url";

  type Props = {
    position?: [number, number, number];
    path?: string;
    orionRotation?: [number, number, number];
  };

  const {
    position = [0, 0, 0],
    path = OrionGL,
    orionRotation = [0, 0, 0],
  }: Props = $props();

  const dracoLoader = useDraco();

  const gltf = $derived(
    useGltf(path, {
      dracoLoader,
    }),
  );

  const opacity = new Tween(0, {
    duration: 3500,
    easing: cubicOut,
  });

  $effect(() => {
    opacity.target = 1;
  });

  $effect(() => {
    if (!$gltf) return;
    const val = opacity.current;
    $gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.transparent = true;
        child.material.opacity = val;
      }
    });
  });
</script>

{#if $gltf}
  <T is={$gltf.scene} {position} rotation={orionRotation} />
{/if}
