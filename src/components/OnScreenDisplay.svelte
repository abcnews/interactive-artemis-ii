<script lang="ts">
  import { pipe } from "effect";
  import type { CameraPositionResult } from "~/src/lib/getCameraPosition";
  import { altitudeToTimeSec, formatTime } from "~/src/lib/timeDistance";

  let missionTime = $derived.by(() => {
    const altKm = Math.abs(cameraPosition.position[2] * 1000);
    const tSec = altitudeToTimeSec(altKm);
    return formatTime(tSec);
  });

  type Props = {
    cameraPosition: CameraPositionResult;
  };

  const { cameraPosition }: Props = $props();

  const km = $derived.by(() => {
    return pipe(
      cameraPosition.position[2],
      (n) => n * 1000,
      Math.round,
      Math.abs,
    ).toLocaleString();
  });
</script>

<div class="hud-root">
  <div class="hud-value">
    <span class="number">
      {km}km
    </span>
    <div class="number">
      {missionTime}
    </div>
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
    flex-direction: column;
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
