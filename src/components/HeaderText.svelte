<script lang="ts">
  import { T } from "@threlte/core";
  import {
    Align,
    Environment,
    Float,
    OrbitControls,
    Text3DGeometry,
  } from "@threlte/extras";

  let {
    text,
    bevelEnabled,
    bevelOffset,
    bevelSegments,
    bevelSize,
    bevelThickness,
    curveSegments,
    depth,
    size,
    smooth,
  } = $props();
</script>

<Align>
  {#snippet children({ align })}
    <T.Mesh>
      <Text3DGeometry
        {text}
        {bevelEnabled}
        {bevelOffset}
        {bevelSegments}
        {bevelSize}
        {bevelThickness}
        {curveSegments}
        {depth}
        {size}
        {smooth}
        oncreate={() => {
          align();
        }}
      />
      <T.MeshNormalMaterial
        color="#4DfFf0"
        toneMapped={false}
        metalness={0.5}
        roughness={0.1}
      />
    </T.Mesh>
  {/snippet}
</Align>

<!-- <Environment url="/textures/equirectangular/hdr/shanghai_riverside_1k.hdr" /> -->

<!-- <T.PerspectiveCamera makeDefault position.y={0} position.z={20} fov={90}>
  <OrbitControls enableDamping enablePan={false} enableZoom={false} />
</T.PerspectiveCamera> -->
