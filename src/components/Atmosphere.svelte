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
    dashed?: boolean;
  };

  let {
    radius,
    colour = "#39ff14",
    opacity = 0.3,
    thickness = 0.01,
    yOffset = -1,
    dashed = false,
  }: Props = $props();

  const dashTex = $derived.by(() => {
    if (!dashed) return null;

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 2;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 32, 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    const rawDashes = Math.max(12, Math.round(radius * 10000));
    const dashes = Math.floor(rawDashes / 4) * 4;
    texture.repeat.set(dashes, 1);
    texture.offset.set(0.25, 0);

    return texture;
  });
</script>

<T.Group position={[0, kmScale(yOffset), 0]} rotation={[Math.PI / 2, 0, 0]}>
  <T.Mesh scale={[1, 1, 0.001]}>
    <T.TorusGeometry args={[radius, kmScale(thickness), 8, 128]} />
    <T.MeshBasicMaterial
      color={colour}
      transparent
      alphaMap={dashTex ?? undefined}
      {opacity}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  </T.Mesh>

  <T.Mesh scale={[1, 1, 0.001]}>
    <T.TorusGeometry args={[radius, kmScale(thickness + 0.01), 8, 128]} />
    <T.MeshBasicMaterial
      color={colour}
      transparent
      alphaMap={dashTex ?? undefined}
      opacity={opacity * 0.5}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  </T.Mesh>
</T.Group>
