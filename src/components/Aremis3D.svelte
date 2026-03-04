<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { useGltf } from "@threlte/extras";
  import * as THREE from "three";

  // Assets
  import artemis3D from "~/src/assets/NASA_SLS-block-1-v2.glb?url";

  type Props = {
    position?: [number, number, number];
    path?: string;
    scale?: number;
  };

  const { position = [0, 0, 0], path = artemis3D, scale = 1 }: Props = $props();

  // svelte-ignore state_referenced_locally
  const gltf = useGltf(path);

  let rotationY = $state(0);

  useTask(
    (delta) => {
      rotationY += delta * 0.1;
    },
    { autoInvalidate: false },
  );
</script>

{#if $gltf}
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
