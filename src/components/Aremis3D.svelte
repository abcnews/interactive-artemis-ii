<script lang="ts">
  import { T } from "@threlte/core";
  import { useGltf } from "@threlte/extras";
  import artemis3D from "~/src/assets/NASA_SLS-block-1-v2.glb?url";

  console.log(artemis3D);

  interface Props {
    position?: [number, number, number];
    path?: string;
  }

  const { position = [3, 20, 2], path = artemis3D }: Props = $props();

  const gltf = useGltf(path);
</script>

{#await gltf}
  <!-- Optional placeholder mesh while loading -->
  <T.Mesh {position}>
    <T.BoxGeometry args={[0.5, 1, 0.5]} />
    <T.MeshStandardMaterial color="gray" wireframe={true} />
  </T.Mesh>
{:then model}
  <T is={model.scene} {position} />
{:catch error}
  <T.Mesh {position}>
    <T.BoxGeometry args={[0.5, 1, 0.5]} />
    <T.MeshStandardMaterial color="red" />
  </T.Mesh>
{/await}
