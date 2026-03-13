<script lang="ts">
  import { SVG } from "@threlte/extras";
  import { T, useTask } from "@threlte/core";
  import * as THREE from "three";
  import svgSource from "~/src/assets/Vostok-1-v1.svg?url";
  import { kmScale } from "../lib/utils";

  const SVG_WIDTH = 229.12;
  const SVG_HEIGHT = 755.22;

  let { opacity = 0.1, position, scale = kmScale(0.001), ...props } = $props();

  let svgMaterials = $state<THREE.MeshBasicMaterial[]>([]);
  let svgRef: THREE.Group | undefined;

  // Try to collect materials each frame until we find them
  const { stop } = useTask(() => {
    if (!svgRef || svgMaterials.length > 0) {
      stop();
      return;
    }

    const found: THREE.MeshBasicMaterial[] = [];

    svgRef.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];

      mats.forEach((mat) => {
        const m = mat as THREE.MeshBasicMaterial;
        m.color.set(0.3, 0.3, 0.3);
        m.opacity = opacity;
        m.depthWrite = true; // prevent bloom bleed-through
        m.needsUpdate = true;
        found.push(m);
      });
    });

    if (found.length > 0) {
      svgMaterials = found;
      stop();
    }
  });

  $effect(() => {
    svgMaterials.forEach((mat) => {
      mat.opacity = opacity;
    });
  });
</script>

<T.Group
  position={[-(SVG_WIDTH * scale) / 2, (SVG_HEIGHT * scale) / 2, 0]}
  {...props}
>
  <SVG
    src={svgSource}
    {scale}
    {position}
    oncreate={(ref) => {
      svgRef = ref;
    }}
  />
</T.Group>
