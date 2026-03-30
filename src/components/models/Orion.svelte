<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { useGltf, useDraco, Float, useViewport } from "@threlte/extras";
  import { onMount, onDestroy } from "svelte";

  import { ROTATION_SPEED } from "~/src/constants";

  // Assets
  import OrionGL from "~/src/assets/Orion_Draco_Optimized.glb?url";

  type Props = {
    position?: [number, number, number];
    path?: string;
    orionRotation?: [number, number, number];
  };

  const { position = [0, 0, 0], path = OrionGL }: Props = $props();

  const dracoLoader = useDraco();
  const viewport = useViewport();

  // svelte-ignore state_referenced_locally
  const gltf = useGltf(path, {
    dracoLoader,
  });

  let rotationY = $state(0);
  let mounted = $state(false);

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
