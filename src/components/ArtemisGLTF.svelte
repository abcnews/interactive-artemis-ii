<script lang="ts">
  import { GLTF, useDraco } from "@threlte/extras";
  import artemis3D from "~/src/assets/NASA_SLS-block-1-v2-Optimized.glb?url";

  type Props = {
    position?: [number, number, number];
  };

  const { position = [0, 0, -200] }: Props = $props();
  const dracoLoader = useDraco();
</script>

<GLTF
  {position}
  scale={1}
  url={artemis3D}
  {dracoLoader}
/>
