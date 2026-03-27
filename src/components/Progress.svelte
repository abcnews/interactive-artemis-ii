<script lang="ts">
  import { scaleLinear } from "d3-scale";

  let { currentKm }: { currentKm: number } = $props();

  const MAX_KM = 400000;

  const kmToPercent = scaleLinear()
    .domain([0, MAX_KM])
    .range([0, 100])
    .clamp(true);

  let progressPercent = $derived(kmToPercent(currentKm));
</script>

<div class="hud-progress-meter">
  <div class="labels">
    <span class="label earth">EARTH</span>
    <span class="label moon">MOON</span>
  </div>

  <div class="track">
    <!-- The glowing filled portion of the bar -->
    <div class="fill" style="width: {progressPercent}%;">
      <!-- Little blip at the leading edge -->
      <div class="blip"></div>
    </div>

    <!-- Target reticle for the moon -->
    <div class="target-marker"></div>
  </div>
</div>

<style lang="scss">
  .hud-progress-meter {
    width: 280px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-family: "Courier New", monospace;
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.4));
  }

  .labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .label {
    font-size: 10px;
    letter-spacing: 0.2em;
    color: #fff;
    opacity: 0.7;
    text-transform: uppercase;
  }

  .track {
    position: relative;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
    overflow: visible; // Allows the blip and target marker to stick out
  }

  .fill {
    position: relative;
    height: 100%;
    background: #fff;
    border-radius: 2px;
    // Svelte's spring/tween handles the continuous values,
    // but a tiny CSS transition smooths out any micro-stutters
    transition: width 50ms linear;
    box-shadow: 0 0 8px #fff;
  }

  // The leading edge of the progress bar (looks like a ship/tracker)
  .blip {
    position: absolute;
    right: -2px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 12px;
    background: #fff;
    box-shadow: 0 0 6px #fff;
    border-radius: 1px;
  }

  // The destination marker at the end of the track
  .target-marker {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    border: 1px solid #fff;
    border-radius: 50%;
    background: transparent;
  }
</style>
