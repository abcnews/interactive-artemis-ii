<script lang="ts">
  import { pipe } from "effect";
  import { fade } from "svelte/transition";

  type Props = {
    altitude: number;
  };

  const { altitude }: Props = $props();

  const km = $derived(pipe(altitude, Math.round).toLocaleString());

  // Each character ~11px wide + padding on both sides
  const MIN_WIDTH = 100;
  const MAX_WIDTH = 260;
  const containerWidth = $derived(
    Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, km.length * 11 + 75)),
  );
</script>

<div class="hud-container" style:width="{containerWidth}px">
  <div class="hud-root">
    <span class="kms" transition:fade={{ duration: 400 }}>
      {km}km
    </span>
  </div>
</div>

<style lang="scss">
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

    /* This is what makes it animate */
    transition: width 1000ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hud-root {
    display: flex;
    width: 100%; /* fills the animated container */
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
  }
</style>
