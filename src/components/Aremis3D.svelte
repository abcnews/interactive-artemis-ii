<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { useGltf, useDraco } from "@threlte/extras";
  import * as THREE from "three";
  import { onMount } from "svelte";

  // Assets
  import artemis3D from "~/src/assets/NASA_SLS-block-1-v2-Optimized.glb?url";

  import { ROTATION_SPEED } from "~/src/constants";

  const dracoLoader = useDraco();

  type Props = {
    position?: [number, number, number];
    path?: string;
    scale?: number;
  };

  const { position = [0, 0, 0], path = artemis3D, scale = 1 }: Props = $props();

  let mounted = $state(false);

  // svelte-ignore state_referenced_locally
  const gltf = useGltf(path, {
    dracoLoader,
  });

  let rotationY = $state(0);

  useTask(
    (delta) => {
      rotationY += delta * ROTATION_SPEED;
    },
    { autoInvalidate: false },
  );

  onMount(() => {
    mounted = true;
    return () => {
      mounted = false;
    };
  });
</script>

{#if mounted && $gltf}
  <T
    is={$gltf.scene}
    {position}
    {scale}
    rotation.y={rotationY}
    oncreate={(ref) => {
      ref.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.transparent = true;
          child.material.opacity = 0.5;
        }
      });
    }}
  />
{/if}
