<script lang="ts">
  import { T } from "@threlte/core";
  import type { Snippet } from "svelte";
  import * as THREE from "three";

  type Props = {
    position: [number, number, number];
    cameraPosition: [number, number, number];
    visibleRange?: number; // scene units — how far away before it appears
    children: Snippet<[{ opacity: number }]>;
  };

  let {
    position,
    cameraPosition,
    visibleRange = 20,
    children,
  }: Props = $props();

  // Distance ahead of camera (positive = ahead, negative = behind/passed)
  const distZ = $derived(cameraPosition[2] - position[2]);

  const opacity = $derived(() => {
    // Units ahead of camera (positive = still to come)
    const ahead = cameraPosition[2] - position[2];

    // Fade in on approach
    if (ahead > 0) return Math.max(0, 1 - ahead / visibleRange);

    // Fade out slowly after passing — uses a wider range behind
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
