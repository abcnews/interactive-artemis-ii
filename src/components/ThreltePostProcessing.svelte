<script lang="ts">
  import { EffectComposer } from "threlte-postprocessing";
  import { BloomEffect } from "threlte-postprocessing/effects";
</script>

<EffectComposer>
  <BloomEffect
    intensity={0.3}
    luminanceThreshold={0.2}
    luminanceSmoothing={0.3}
    mipmapBlur={true}
  />
</EffectComposer>