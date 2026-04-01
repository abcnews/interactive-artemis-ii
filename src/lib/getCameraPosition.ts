import { Match } from "effect";
import { scaleLinear } from "d3-scale";
import { stage } from "~/src/stores/stage.svelte";
import {
  waypointStore,
  type TransitionWaypoint,
  type CameraWaypoint,
} from "~/src/stores/waypoints.svelte";

let lastPosition: [number, number, number] = [0, 0, 0];
let activeWaypoint: CameraWaypoint | undefined = undefined;

/*

TODO: Fix slight bug if a panel name isn't found it just returns 
the last position, and this could be in the middle of a Spring
so it the camera position will sometimes seem inconsistent when
scrolling fast up and down between sections.

Possible easy half-fix has been implemented mostly by simply adding 
new transitions so there's no non-matches and have the from and to 
kms the same.

*/

export type CameraPositionResult = {
  position: [number, number, number];
  progress: number | null; // null when fixed or no match
};

export const getCameraPosition = (
  pageScrollBottom: number,
  currentSectionName: string,
): CameraPositionResult => {
  /*
  This is just a dev mode test to warn about overlapping transitions
  */
  if (import.meta.env.DEV) {
    const matchingTransitions = waypointStore.waypoints.filter(
      (w): w is TransitionWaypoint => {
        if (w.type !== "transition") return false;
        const isAfterStart = stage.getDownpage(w.start) <= pageScrollBottom;
        const isBeforeEnd = stage.getDownpage(w.end) > pageScrollBottom;
        return isAfterStart && isBeforeEnd;
      },
    );

    if (matchingTransitions.length > 1) {
      console.warn(
        `[cameraPosition] Overlapping transitions at scroll ${pageScrollBottom}:`,
        matchingTransitions.map((w) => w.section).join(", "),
      );
    }
  }

  const isValid = (w: CameraWaypoint) => {
    if (w.type === "fixed") {
      return w.sections.includes(currentSectionName);
    }
    const start = w.section ?? w.start;
    const isAfterStart = stage.getDownpage(start) <= pageScrollBottom;
    const isBeforeEnd = stage.getDownpage(w.end) > pageScrollBottom;
    return isAfterStart && isBeforeEnd;
  };

  if (activeWaypoint && !isValid(activeWaypoint)) {
    activeWaypoint = undefined;
  }

  if (!activeWaypoint) {
    activeWaypoint = waypointStore.waypoints.find(isValid);
  }

  const waypoint = activeWaypoint;

  const result = Match.value(waypoint).pipe(
    Match.withReturnType<CameraPositionResult>(),
    Match.when({ type: "fixed" }, (w) => ({
      position: w.position,
      progress: null,
    })),
    Match.when({ type: "transition" }, (w) => {
      const rawProgress = stage.getProgressBetweenSections({
        start: w.start,
        end: w.end,
      })(pageScrollBottom);

      let progress = rawProgress;

      if (w.slowZone) {
        // Convert Z positions → progress values within this specific transition
        const totalZ = w.toPosition[2] - w.fromPosition[2];
        const p1 = (w.slowZone.fromZ - w.fromPosition[2]) / totalZ;
        const p2 = (w.slowZone.toZ - w.fromPosition[2]) / totalZ;
        progress = createSlowZoneEasing(p1, p2, w.slowZone.factor)(rawProgress);
      }

      const position = w.fromPosition.map((from, i) =>
        scaleLinear([0, 1], [from, w.toPosition[i]]).clamp(true)(progress),
      ) as [number, number, number];

      return { position, progress };
    }),
    Match.orElse(() => ({ position: lastPosition, progress: null })),
  );

  lastPosition = result.position;

  return result;
};

// Creates a piecewise easing that redistributes scroll so the
// p1→p2 range of progress gets `factor`x more scroll than normal
function createSlowZoneEasing(p1: number, p2: number, factor: number) {
  const totalWeight = p1 + (p2 - p1) * factor + (1 - p2);
  const s1 = p1 / totalWeight;
  const s2 = s1 + ((p2 - p1) * factor) / totalWeight;

  return (t: number): number => {
    if (t <= s1) return scaleLinear([0, s1], [0, p1])(t);
    if (t <= s2) return scaleLinear([s1, s2], [p1, p2])(t);
    return scaleLinear([s2, 1], [p2, 1])(t);
  };
}
