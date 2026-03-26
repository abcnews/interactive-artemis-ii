<script lang="ts">
  import { pipe } from "effect";
  import type { CameraPositionResult } from "~/src/lib/getCameraPosition";
  import { altitudeToTimeSec, formatTime } from "~/src/lib/timeDistance";
  import { fade } from "svelte/transition";
  import HudProgressMeter from "./Progress.svelte";

  type Props = {
    cameraPosition: CameraPositionResult;
  };

  const { cameraPosition }: Props = $props();

  const altKm = $derived(Math.abs(cameraPosition.position[2] * 1000));
  // const tSec = $derived(altitudeToTimeSec(altKm));
  // const missionTime = $derived(formatTime(tSec));

  const km = $derived(pipe(altKm, Math.round).toLocaleString());

  // Time stops displaying after 25 hours (90,000 seconds)
  // const showTime = $derived(tSec < 90000);

  const showDistance = $derived(true);
</script>

<div class="hud-root">
  {#if showDistance}
    <span class="number" transition:fade={{ duration: 400 }}>
      {km}km
    </span>
  {/if}
  <HudProgressMeter currentKm={altKm} />
</div>

<style lang="scss">
  .hud-root {
    position: fixed;
    top: 20px;
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

  .number {
    font-variant-numeric: tabular-nums;
    font-size: 1.5rem;
  }
</style>
