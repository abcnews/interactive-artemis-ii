<script lang="ts">
  import { T, useThrelte, useTask } from "@threlte/core";
  import { GLTF, useGltf, useDraco } from "@threlte/extras";
  import { Spring } from "svelte/motion";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import * as THREE from "three";
  const { invalidate } = useThrelte();

  // Assets
  import OrionGL from "~/src/assets/Orion_Draco_Optimized.glb?url";
  import { duration } from "effect/Config";

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

  const gltf = $derived(
    useGltf(path, {
      dracoLoader,
    }),
  );

  let scene = $state<THREE.Group | null>(null);
  let model = $state<THREE.Group>();
  let trackedMaterials: THREE.Material[] = [];
  let trackedMasks: THREE.Mesh[] = [];

  // Shared material for all depth masks to save memory
  const depthMaterial = new THREE.MeshBasicMaterial({
    colorWrite: false,
    depthWrite: true,
    side: THREE.FrontSide,
  });

  const opacity = new Tween(0, {
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
      opacity.target = 1;
    }
  });

  $effect(() => {
    if (!scene) return;
    const val = opacity.current;
    const isTransparent = val < 1;

    // Optimized: Loop through flat arrays instead of traversing the scene graph
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

  $effect(() => {
    progress.target = orionRotation;
  });

  useTask((delta) => {
    if (model) {
      model.rotation.y += delta * 0.25;
    }
  });
</script>

{#if scene}
  <T.Group {position} rotation={progress.current}>
    <T is={scene} bind:ref={model} />
  </T.Group>
{/if}
