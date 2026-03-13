<script lang="ts">
  import { useTask, useThrelte } from "@threlte/core";
  import {
    BloomEffect,
    EffectComposer,
    EffectPass,
    RenderPass,
    SMAAEffect,
    SMAAPreset,
  } from "postprocessing";

  import { HalfFloatType } from "three";

  const { scene, renderer, camera, size, autoRender, renderStage } =
    useThrelte();

  // const composer = new EffectComposer(renderer);
  const composer = new EffectComposer(renderer, {
    multisampling: Math.min(4, renderer.capabilities.maxSamples),
    frameBufferType: HalfFloatType,
  });
  const renderPass = new RenderPass(scene);
  composer.addPass(renderPass);

  const bloomEffect = new BloomEffect({
    intensity: 0.4,
    luminanceThreshold: 0.1,
    luminanceSmoothing: 0.5,
    mipmapBlur: true,
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
    composer.setSize($size.width, $size.height);
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
      composer.render(delta);
    },
    { stage: renderStage, autoInvalidate: false },
  );
</script>
