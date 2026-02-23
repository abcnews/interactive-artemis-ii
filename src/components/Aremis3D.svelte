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

  const { position = [3, 80, -10], path = artemis3D }: Props = $props();

  const gltf = $derived(useGltf(path));
</script>

{#await gltf}
  <!-- Optional placeholder mesh while loading -->
  <T.Mesh {position}>
    <T.BoxGeometry args={[0.5, 1, 0.5]} />
    <T.MeshStandardMaterial color="gray" wireframe={true} />
  </T.Mesh>
{:then model}
  <T
    is={model.scene}
    {position}
    oncreate={(ref) => {
      ref.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.metalness = 0.4;
          child.material.roughness = 0.8;
          child.material.needsUpdate = true;
        }
      });
    }}
  />
{:catch error}
  <T.Mesh {position}>
    <T.BoxGeometry args={[0.5, 1, 0.5]} />
    <T.MeshStandardMaterial color="red" />
  </T.Mesh>
{/await}
