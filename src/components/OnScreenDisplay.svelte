<script lang="ts">
  import { accessibility } from "~/src/stores/accessibility.svelte";
  import { fade } from "svelte/transition";
  import { Throttled } from "runed";

  type Props = {
    altitude: number;
  };

  const { altitude }: Props = $props();

  const km = $derived.by(() => {
    const rounded = Math.round(altitude);
    return rounded.toLocaleString();
  });

  const throttledKm = new Throttled(() => km, 250);

  // Each character ~11px wide + padding on both sides
  const MIN_WIDTH = 100;
  const MAX_WIDTH = 260;
  const containerWidth = $derived(
    Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, km.length * 11 + 75)),
  );

  let finalKm = $derived.by(() => {
    if (accessibility.prefersReducedMotion) return throttledKm.current;
    return km;
  });
</script>

<div class="hud-container" style:width="{containerWidth}px">
  <div class="hud-root">
    <span class="kms" transition:fade={{ duration: 400 }}>
      {finalKm}km
    </span>
  </div>
</div>

<style lang="scss">
  @use "../styles/breakpoints.scss";

  .hud-container {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    padding: 5px 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
    border-radius: 32px;
    background: #212121;

    transition: width 1000ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hud-root {
    display: flex;
    width: 100%;
    height: 30px;
    flex-direction: column;
    justify-content: center;
    color: #b3b3b3;
    text-align: center;
    font-family: "abcsans condensed", ABCSans, "ABC Sans Nova", sans-serif;
    font-size: 18px;
    font-weight: 300;
    line-height: 15px;
    letter-spacing: 0.54px;

    @include breakpoints.for-tablet-up {
      height: 34px;
      font-size: 20px;
    }
    @include breakpoints.for-desktop-up {
      height: 36px;
      font-size: 22px;
    }
  }
</style>
