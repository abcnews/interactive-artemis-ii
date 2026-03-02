<script lang="ts">
  import { T } from "@threlte/core";
  import { useGltf } from "@threlte/extras";
  import * as THREE from "three";

  // Assets
  import artemis3D from "~/src/assets/NASA_SLS-block-1-v2.glb?url";

  type Props = {
    position?: [number, number, number];
    path?: string;
  };

  const { position = [0, 0, -200], path = artemis3D }: Props = $props();

  const gltf = $derived(useGltf(path));
</script>

<!-- {#await gltf}

{:then model} -->

{#if $gltf}
  <T
    is={$gltf.scene}
    {position}
    oncreate={(ref) => {
      ref.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // child.material.metalness = 0.4;
          // child.material.roughness = 0.8;
          // child.material.needsUpdate = true;
        }
      });
    }}
  />
{/if}
<!-- {:catch error}

{/await} -->
