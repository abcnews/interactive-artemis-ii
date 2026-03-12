<!-- I think we're using threlte-postprocessing now -->

<script lang="ts">
  import { useTask, useThrelte } from "@threlte/core";
  import {
    BloomEffect,
    EffectComposer,
    EffectPass,
    RenderPass,
  } from "postprocessing";

  const { scene, renderer, camera, size, autoRender, renderStage } = useThrelte();

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene);
  composer.addPass(renderPass);

  const bloomEffect = new BloomEffect({
    intensity: 0.1,
    luminanceThreshold: 0.1,
    luminanceSmoothing: 0.3,
    mipmapBlur: true,
  });

  const bloomPass = new EffectPass(undefined, bloomEffect);
  composer.addPass(bloomPass);

  // Keep camera in sync
  $effect(() => {
    renderPass.mainCamera = $camera;
    bloomPass.mainCamera = $camera;
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
      bloomPass.dispose();
      renderPass.dispose();
      composer.dispose();
    };
  });

  useTask(
    (delta) => {
      composer.render(delta);
    },
    { stage: renderStage, autoInvalidate: false }
  );
</script>
