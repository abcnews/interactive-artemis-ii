<script lang="ts">
  import { T } from "@threlte/core";
  import * as THREE from "three";
  import { kmScale } from "~/src/lib/utils";
  import { OrbitControls, Grid, FakeGlowMaterial } from "@threlte/extras";

  type Props = { radius: number; colour?: string; opacity?: number };
  let {
    radius,
    colour = "#39ff14",
    opacity = 0.3,
    thickness = 0.2,
  } = $props();
</script>

<T.Group position={[0, kmScale(-0.5), 0]} rotation={[Math.PI / 2, 0, 0]}>
  <T.Mesh>
    <FakeGlowMaterial glowColor={colour} glowIntensity={opacity} glowSharpness={1} />
    <T.TorusGeometry args={[radius, kmScale(thickness), 8, 64]} />
  </T.Mesh>
</T.Group>
