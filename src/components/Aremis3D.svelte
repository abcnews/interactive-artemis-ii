<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { useGltf, useDraco } from "@threlte/extras";
  import * as THREE from "three";
  import { onMount } from "svelte";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  // Assets
  import artemis3D from "~/src/assets/NASA_SLS-block-1-v2-Optimized.glb?url";

  import { ROTATION_SPEED } from "~/src/constants";

  const dracoLoader = useDraco();
  const { invalidate } = useThrelte();

  type Props = {
    position?: [number, number, number];
    path?: string;
    scale?: number;
    opacity?: number;
  };

  const { position = [0, 0, 0], path = artemis3D, scale = 1, opacity = 0.5 }: Props = $props();

  let mounted = $state(false);

  // svelte-ignore state_referenced_locally
  const gltf = useGltf(path, {
    dracoLoader,
  });

  let rotationY = $state(0);
  let scene = $state<THREE.Group | null>(null);
  let trackedMaterials: THREE.Material[] = [];
  let trackedMasks: THREE.Mesh[] = [];

  // Shared material for all depth masks to save memory
  const depthMaterial = new THREE.MeshBasicMaterial({
    colorWrite: false,
    depthWrite: true,
    side: THREE.FrontSide,
  });

  const opacityTween = new Tween(0, {
    duration: 3000,
    easing: cubicOut,
  });

  $effect(() => {
    if ($gltf?.scene) {
      const s = $gltf.scene.clone(true);
      const materials: THREE.Material[] = [];
      const masks: THREE.Mesh[] = [];

      s.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.userData.isDepthMask) return;

          if (child.material) {
            const original = child.material;
            if (Array.isArray(original)) {
              const clones = original.map((m) => m.clone());
              child.material = clones;
              materials.push(...clones);
            } else {
              const clone = original.clone();
              child.material = clone;
              materials.push(clone);
            }
          }

          const depthMesh = new THREE.Mesh(child.geometry, depthMaterial);
          depthMesh.userData.isDepthMask = true;
          child.add(depthMesh);
          masks.push(depthMesh);
        }
      });

      trackedMaterials = materials;
      trackedMasks = masks;
      scene = s;
    }
  });

  $effect(() => {
    opacityTween.target = opacity;
  });

  $effect(() => {
    if (!scene) return;
    const val = opacityTween.current;
    const isTransparent = val < 1;

    for (const m of trackedMaterials) {
      m.transparent = isTransparent;
      m.opacity = val;
      m.depthWrite = !isTransparent;
    }

    for (const mask of trackedMasks) {
      mask.visible = isTransparent;
    }

    invalidate();
  });

  useTask(
    (delta) => {
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
</script>

{#if mounted && scene}
  <T.Group {position} {scale} rotation.y={rotationY}>
    <T is={scene} />
  </T.Group>
{/if}
