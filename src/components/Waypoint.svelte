<script lang="ts">
  import { T } from "@threlte/core";
  import type { Snippet } from "svelte";
  import * as THREE from "three";

  type Props = {
    position: [number, number, number];
    cameraPosition: [number, number, number];
    visibleRange?: number;
    fadeInRange?: number;
    children: Snippet<[{ opacity: number }]>;
  };

  let {
    position,
    cameraPosition,
    visibleRange = 20,
    fadeInRange = visibleRange * 0.3,  // fade over ??% of visible range
    children,
  }: Props = $props();

  const opacity = $derived.by(() => {
    const ahead = cameraPosition[2] - position[2];

    if (ahead > visibleRange) return 0;

    if (ahead > 0) {
      const calculatedOpacity = 1 - (ahead - fadeInRange) / (visibleRange - fadeInRange);
      // Cleanly clamp opacity between 0.0 and 1.0 to prevent shader artifacts!
      return Math.max(0, Math.min(1, calculatedOpacity));
    }

    // We no longer fade out when physically passed — it stays 100% opaque,
    // because it will instantly leave the camera FOV anyway and get unmounted. 
    return 1;
  });

  // Mount slightly before visible so material is ready when fade starts,
  // and actively UNMOUNT when completely passed to free up RAM and CPU!
  const shouldMount = $derived.by(() => {
    const ahead = cameraPosition[2] - position[2];
    
    // Have we not reached it yet?
    // We mount very generously early (2.0x) so that if the bouncy Spring camera overshoots
    // it doesn't violently mount/unmount the 3D mesh repeatedly, causing severe CPU stutters!
    if (ahead > visibleRange * 2.0) return false;

    // Have we flown completely past it?
    // We retain an extremely massive buffer (3.0x - 5.0x) behind the camera before unmounting!
    // Unmounting massive GLTFs (like Hubble) causes ThreeJS to execute heavy memory disposal scripts
    // which freezes your WebGL thread completely mid-air for a second. Let it sit in RAM safely!
    if (ahead < 0 && Math.abs(ahead) > visibleRange * 4.0) return false;
    
    return true;
  });
</script>

{#if shouldMount}
  <T.Group visible={opacity > 0}>
    {@render children({ opacity })}
  </T.Group>
{/if}
