<script lang="ts">
  import { pipe } from "effect";
  const { cameraPosition } = $props();
</script>

<div class="hud-root">
  <div class="hud-value">
    <span class="number">
      {pipe(
        cameraPosition[2],
        (n) => n * 1000,
        Math.round,
        Math.abs,
      ).toLocaleString()}
    </span>
    <span class="unit">km</span>
  </div>
</div>

<style lang="scss">
  .hud-root {
    position: fixed;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: white;
    font-family: "abcsans", "fallback sans", sans-serif;
    text-align: center;
    filter: drop-shadow(0 0 3px grey);
  }

  .hud-value {
    font-size: 36px;
    font-weight: 700;
    letter-spacing: 0.05em;
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .number {
    font-variant-numeric: tabular-nums;
  }

  .unit {
    font-size: 16px;
    opacity: 0.9;
    align-self: flex-end;
    margin-bottom: 8px;
  }
</style>
