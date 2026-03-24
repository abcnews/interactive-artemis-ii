const artemisProfile = [
  { timeSec: 0, altKm: 0 },
  { timeSec: 71, altKm: 12.83 }, // 0:01:11
  { timeSec: 198, altKm: 87 }, // 0:03:18
  { timeSec: 240, altKm: 100 }, // 0:04:00
  { timeSec: 600, altKm: 2191 }, // 0:10:00
  { timeSec: 3 * 3600 + 24 * 60 + 15, altKm: 22278 }, // 3:24:15
  { timeSec: 25 * 3600, altKm: 38117 }, // 25:00:00
  // { timeSec: /* ... */, altKm: 406000 }, // etc
].sort((a, b) => a.altKm - b.altKm);

import { scaleLinear } from "d3-scale";

const altitudes = artemisProfile.map((d) => d.altKm);
const times = artemisProfile.map((d) => d.timeSec);

export const altitudeToTimeSec = scaleLinear()
  .domain(altitudes)
  .range(times)
  .clamp(true); // Don't extrapolate beyond first/last keyframe

export function formatTime(tSec: number): string {
  const sign = tSec < 0 ? "-" : "";
  tSec = Math.abs(Math.round(tSec));
  const h = Math.floor(tSec / 3600);
  const m = Math.floor((tSec % 3600) / 60);
  const s = tSec % 60;
  if (h > 0)
    return `${sign}${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${sign}${m}:${s.toString().padStart(2, "0")}`;
}
