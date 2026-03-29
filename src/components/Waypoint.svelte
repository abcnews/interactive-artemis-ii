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

    if (ahead > 0)
      return Math.max(
        0,
        1 - (ahead - fadeInRange) / (visibleRange - fadeInRange),
      );

    // We no longer fade out when physically passed — it stays 100% opaque,
    // because it will instantly leave the camera FOV anyway and get unmounted. 
    return 1;
  });

  // Mount slightly before visible so material is ready when fade starts,
  // and actively UNMOUNT when completely passed to free up RAM and CPU!
  const shouldMount = $derived.by(() => {
    const ahead = cameraPosition[2] - position[2];
    
    // Have we not reached it yet?
    if (ahead > visibleRange * 1.1) return false;

    // Have we flown completely past it?
    // Since we no longer fade out, we can unmount it shortly after passing it.
    // Keeping a small 50% buffer ensures scrolling backwards doesn't cause visual pop-in.
    if (ahead < 0 && Math.abs(ahead) > visibleRange * 0.5) return false;
    
    return true;
  });
</script>

{#if shouldMount}
  <T.Group visible={opacity > 0}>
    {@render children({ opacity })}
  </T.Group>
{/if}
