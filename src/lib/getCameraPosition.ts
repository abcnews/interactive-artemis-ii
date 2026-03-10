import { Match } from "effect";
import { scaleLinear } from "d3-scale";
import { kmScale } from "./utils";
import { stage } from "~/src/stores/stage.svelte";
import {
  waypointStore,
  type TransitionWaypoint,
} from "~/src/stores/waypoints.svelte";

let lastPosition: [number, number, number] = [0, 0, 0];

/*

TODO: Fix slight bug if a panel name isn't found it just returns 
the last position, and this could be in the middle of a Spring
so it the camera position will sometimes seem inconsistent when
scrolling fast up and down between sections.

*/

export const getCameraPosition = (
  pageScrollBottom: number,
  currentSectionName: string,
): [number, number, number] => {
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

  const waypoint = waypointStore.waypoints.find((w) => {
    if (w.type === "fixed") {
      return w.sections.includes(currentSectionName);
    }
    const start = w.section ?? w.start;
    const isAfterStart = stage.getDownpage(start) <= pageScrollBottom;
    const isBeforeEnd = stage.getDownpage(w.end) > pageScrollBottom;
    return isAfterStart && isBeforeEnd;
  });

  const position = Match.value(waypoint).pipe(
    Match.withReturnType<[number, number, number]>(),
    Match.when({ type: "fixed" }, (w) => w.position),
    Match.when({ type: "transition" }, (w) => {
      const progress = stage.getProgressBetweenSections({
        start: w.start,
        end: w.end,
      })(pageScrollBottom);

      return w.fromPosition.map((from, i) =>
        scaleLinear([0, 1], [from, w.toPosition[i]]).clamp(true)(progress),
      ) as [number, number, number];
    }),
    Match.orElse(() => lastPosition),
  );

  lastPosition = position;
  return position;
};
