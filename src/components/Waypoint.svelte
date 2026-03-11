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
    fadeInRange = visibleRange * 0.0001,
    children,
  }: Props = $props();

  const opacity = $derived(() => {
    const ahead = cameraPosition[2] - position[2];

    if (ahead > visibleRange) return 0;

    // Fade in — reaches 1 at fadeInRange, not at 0
    if (ahead > 0)
      return Math.max(
        0,
        1 - (ahead - fadeInRange) / (visibleRange - fadeInRange),
      );

    // Fully visible when passed
    const behind = Math.abs(ahead);
    return Math.max(0, 1 - behind / (visibleRange * 3));
  });

  const isVisible = $derived(opacity() > 0.01);
</script>

{#if isVisible}
  <T.Group>
    {@render children({ opacity: opacity() })}
  </T.Group>
{/if}
