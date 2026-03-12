<script lang="ts">
  import { T, useThrelte, useTask } from "@threlte/core";
  import * as THREE from "three";
  import { kmScale } from "~/src/lib/utils";

  const INTERVAL = 10000;
  const MAX_KM = 384000;
  const VISIBLE_RANGE = kmScale(20000);
  const FADE_RANGE = VISIBLE_RANGE * 0.3;

  const markers = Array.from(
    { length: Math.floor(MAX_KM / INTERVAL) },
    (_, i) => (i + 1) * INTERVAL,
  );

  let { cameraPosition } = $props();

  let camZ = $derived(cameraPosition[2]);
</script>

{#each markers as km (km)}
  {@const posZ = kmScale(-km)}
  {@const ahead = camZ - posZ}
  {@const opacity =
    ahead > VISIBLE_RANGE
      ? 0
      : ahead > 0
        ? Math.max(0, 1 - (ahead - FADE_RANGE) / (VISIBLE_RANGE - FADE_RANGE))
        : Math.max(0, 1 - Math.abs(ahead) / (VISIBLE_RANGE * 3))}
  {#if opacity > 0.01}
    <T.Mesh position={[0, 1, posZ]}>
      <T.PlaneGeometry args={[1, 0.03]} />
      <T.MeshBasicMaterial
        color="#ffffff"
        transparent
        {opacity}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </T.Mesh>
  {/if}
{/each}
