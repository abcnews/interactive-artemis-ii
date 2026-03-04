<script lang="ts">
  import { T, useThrelte, useTask } from "@threlte/core";
  import { useGltf, useDraco, Float, useViewport } from "@threlte/extras";
  import { Spring } from "svelte/motion";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import * as THREE from "three";

  const { invalidate } = useThrelte();

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

  const gltf = $derived(
    useGltf(path, {
      dracoLoader,
    }),
  );

  let rotationY = $state(0);

  $effect(() => {
    progress.target = orionRotation;
  });

  useTask(
    (delta) => {
      rotationY += delta * 0.1;
    },
    { autoInvalidate: false },
  );
</script>

{#if $gltf?.scene}
  <Float>
    <T.Group {position} rotation.y={rotationY}>
      <T is={$gltf?.scene} />
    </T.Group>
  </Float>
{/if}
