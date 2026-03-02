<script lang="ts">
  import { GLTF, useGltfAnimations } from "@threlte/extras";
  import artemis3D from "~/src/assets/NASA_SLS-block-1-v2.glb?url";
</script>

<GLTF
  position={[0, 0, -200]}
  scale={1}
  url={artemis3D}
/>
