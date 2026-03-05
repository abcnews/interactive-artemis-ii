<script lang="ts">
  import { T, useThrelte, useTask } from "@threlte/core";
  import { useGltf, useDraco, Float, useViewport } from "@threlte/extras";
  import { onMount, onDestroy } from "svelte";
  import { Spring } from "svelte/motion";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import * as THREE from "three";

  const { invalidate } = useThrelte();

  import { ROTATION_SPEED } from "~/src/constants";

  // Assets
  import OrionGL from "~/src/assets/Orion_Draco_Optimized.glb?url";

  type Props = {
    position?: [number, number, number];
    path?: string;
    orionRotation?: [number, number, number];
  };

  const {
    position = [0, 0, 0],
    path = OrionGL,
    orionRotation = [0, 0, 0],
  }: Props = $props();

  const progress = new Spring<[number, number, number]>([0, 0, 0]);

  const dracoLoader = useDraco();
  const viewport = useViewport();

  // svelte-ignore state_referenced_locally
  const gltf = useGltf(path, {
    dracoLoader,
  });

  let rotationY = $state(0);
  let mounted = $state(false);

  $effect(() => {
    progress.target = orionRotation;
  });

  const { stop } = useTask(
    (delta) => {
      const vp = viewport.current;
      if (!vp) return; // guard against teardown race

      rotationY += delta * ROTATION_SPEED;
    },
    { autoInvalidate: false },
  );

  onMount(() => {
    mounted = true;
    return () => {
      mounted = false;
    };
  });

  onDestroy(() => {
    stop();
  });
</script>

{#if mounted && $gltf}
  <T.Group {position} rotation.y={rotationY}>
    <T is={$gltf?.scene} />
  </T.Group>
{/if}
