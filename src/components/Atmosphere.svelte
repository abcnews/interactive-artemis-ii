<script lang="ts">
  import { T } from "@threlte/core";
  import * as THREE from "three";
  import { kmScale } from "~/src/lib/utils";

  type Props = { radius: number; colour?: string; opacity?: number };
  let {
    radius,
    colour = "#39ff14",
    opacity = 0.3,
    thickness = 0.01,
  } = $props();
</script>

<T.Group position={[0, kmScale(-0.5), 0]} rotation={[Math.PI / 2, 0, 0]}>
  <!-- Core ring — sharp -->
  <T.Mesh>
    <T.TorusGeometry args={[radius, kmScale(thickness), 8, 128]} />
    <T.MeshBasicMaterial
      color={colour}
      transparent
      {opacity}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  </T.Mesh>

  <!-- Glow layer 1 — slightly wider, more transparent -->
  <T.Mesh>
    <T.TorusGeometry args={[radius, kmScale(thickness + 0.01), 8, 128]} />
    <T.MeshBasicMaterial
      color={colour}
      transparent
      opacity={opacity * 0.5}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  </T.Mesh>

  <!-- Glow layer 2 — widest, most transparent -->
  <T.Mesh>
    <T.TorusGeometry args={[radius, kmScale(thickness + 0.02), 8, 128]} />
    <T.MeshBasicMaterial
      color={colour}
      transparent
      opacity={opacity * 0.3}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  </T.Mesh>
</T.Group>
