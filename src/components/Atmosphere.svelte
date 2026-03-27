<script lang="ts">
  import { T } from "@threlte/core";
  import * as THREE from "three";
  import { kmScale } from "~/src/lib/utils";

  type Props = {
    radius: number;
    colour?: string;
    opacity?: number;
    thickness?: number;
    yOffset?: number;
  };

  let {
    radius,
    colour = "#39ff14",
    opacity = 0.3,
    thickness = 0.01,
    yOffset = -1,
  }: Props = $props();

  // Create a procedural dashed texture unique to this atmosphere
  // so we can set the repeating scale based on its radius
  const dashTex = $derived.by(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 2;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 32, 2); 
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    // Scale dashes based on radius so they are visually 
    // the same length no matter how big the atmosphere is.
    // By forcing the dash count to be a multiple of 4, we guarantee 
    // perfect symmetry at the front, back, left, and right camera axes!
    const rawDashes = Math.max(12, Math.round(radius * 10000));
    const dashes = Math.floor(rawDashes / 4) * 4;
    texture.repeat.set(dashes, 1);
    
    // Shift the texture by exactly 25% so the center of the white dash
    // aligns with the camera, rather than the sharp edge of the dash.
    texture.offset.set(0.25, 0);
    
    return texture;
  });
</script>

<T.Group position={[0, kmScale(yOffset), 0]} rotation={[Math.PI / 2, 0, 0]}>
  <!-- Core ring — squashed flat on Z into a 2D ribbon -->
  <T.Mesh scale={[1, 1, 0.001]}>
    <T.TorusGeometry args={[radius, kmScale(thickness), 8, 128]} />
    <T.MeshBasicMaterial
      color={colour}
      transparent
      alphaMap={dashTex}
      {opacity}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  </T.Mesh>

  <!-- Glow layer 1 — wider dashed line -->
  <T.Mesh scale={[1, 1, 0.001]}>
    <T.TorusGeometry args={[radius, kmScale(thickness + 0.01), 8, 128]} />
    <T.MeshBasicMaterial
      color={colour}
      transparent
      alphaMap={dashTex}
      opacity={opacity * 0.5}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  </T.Mesh>
</T.Group>
