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

    // Fully visible when passed, fade out behind
    const behind = Math.abs(ahead);
    return Math.max(0, 1 - behind / (visibleRange * 3));
  });

  // Mount slightly before visible so material is ready when fade starts
  const shouldMount = $derived.by(() => {
    const ahead = cameraPosition[2] - position[2];
    return ahead < visibleRange * 1.1;
  });
</script>

{#if shouldMount}
  <T.Group visible={opacity > 0}>
    {@render children({ opacity })}
  </T.Group>
{/if}
