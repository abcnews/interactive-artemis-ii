<script lang="ts">
  import { useTask, useThrelte } from "@threlte/core";
  import {
    BloomEffect,
    EffectComposer,
    EffectPass,
    RenderPass,
  } from "postprocessing";
  import { gpu } from "~/src/stores/gpu.svelte";

  const { scene, renderer, camera, size, autoRender, renderStage } =
    useThrelte();

  const composer = new EffectComposer(renderer, {
    multisampling: Math.min(gpu.multisampling, renderer.capabilities.maxSamples),
  });

  const renderPass = new RenderPass(scene);
  composer.addPass(renderPass);

  const bloomEffect = new BloomEffect({
    intensity: 0.4,
    luminanceThreshold: 0.15,
    luminanceSmoothing: 0.5,
    mipmapBlur: false,
    resolutionScale: 0.5,
  });

  const effectPass = new EffectPass(undefined, bloomEffect);
  composer.addPass(effectPass);

  // Keep camera in sync
  $effect(() => {
    renderPass.mainCamera = $camera;
    effectPass.mainCamera = $camera;
  });

  // Keep size in sync
  $effect(() => {
    const { width, height } = $size;
    if (width === 0 || height === 0) return;
    composer.setSize(width, height);
  });

  // Hand off rendering to the composer
  $effect(() => {
    const last = autoRender.current;
    autoRender.set(false);
    return () => autoRender.set(last);
  });

  // Cleanup
  $effect(() => {
    return () => {
      composer.removeAllPasses();
      effectPass.dispose();
      renderPass.dispose();
      composer.dispose();
    };
  });

  useTask(
    (delta) => {
      const { width, height } = $size;
      if (width === 0 || height === 0) return;
      composer.render(delta);
    },
    { stage: renderStage, autoInvalidate: false },
  );
</script>
