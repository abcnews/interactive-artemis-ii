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

      // Clamp 0-1
      return Math.max(0, Math.min(1, calculatedOpacity));
    }

    // Fully visible when passed 
    return 1;
  });

  // Mount slightly before visible
  // Unmount when completely passed
  // Watch for big models unmounting and freezing up the scene
  const shouldMount = $derived.by(() => {
    const ahead = cameraPosition[2] - position[2];
    
    if (ahead > visibleRange * 2.0) return false;
    if (ahead < 0 && Math.abs(ahead) > visibleRange * 4.0) return false;
    
    return true;
  });
</script>

{#if shouldMount}
  <T.Group visible={opacity > 0}>
    {@render children({ opacity })}
  </T.Group>
{/if}
