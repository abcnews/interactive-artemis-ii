import { Match } from "effect";
import { scaleLinear } from "d3-scale";
import { kmScale } from "./utils";
import { stage } from "~/src/stores/stage.svelte";

type FixedWaypoint = {
  type: "fixed";
  sections: string[];
  position: [number, number, number];
};

type TransitionWaypoint = {
  type: "transition";
  section: string;
  start: string;
  end: string;
  fromPosition: [number, number, number];
  toPosition: [number, number, number];
};

type CameraWaypoint = FixedWaypoint | TransitionWaypoint;

const STARTING_POSITION: [number, number, number] = [0, 36, -60];
const TAKEOFF_POSITION: [number, number, number] = [0, 0, 0];

const WAYPOINTS: CameraWaypoint[] = [
  {
    type: "fixed",
    sections: ["initial", "intro", "orion"],
    position: STARTING_POSITION,
  },
  {
    type: "transition",
    section: "artemis",
    start: "artemis",
    end: "sls",
    fromPosition: STARTING_POSITION,
    toPosition: TAKEOFF_POSITION,
  },
  {
    type: "fixed",
    sections: ["sls", "takeoff"],
    position: TAKEOFF_POSITION,
  },
  {
    type: "transition",
    section: "excitement",
    start: "excitement",
    end: "stratosphere",
    fromPosition: [0, 0, kmScale(0)],
    toPosition: [0, 0, kmScale(-10)],
  },
  {
    type: "transition",
    section: "maxq",
    start: "maxq",
    end: "cornish",
    fromPosition: [0, 0, kmScale(-10)],
    toPosition: [0, 0, kmScale(-33)],
  },
  {
    type: "transition",
    section: "cornish",
    start: "cornish",
    end: "2mins",
    fromPosition: [0, 0, kmScale(-35)],
    toPosition: [0, 0, kmScale(-85)],
  },
  {
    type: "transition",
    section: "2mins",
    start: "2mins",
    end: "thermosphere",
    fromPosition: [0, 0, kmScale(-85)],
    toPosition: [0, 0, kmScale(-700)],
  },
];

let lastPosition: [number, number, number] = STARTING_POSITION;

export const getCameraPosition = (
  pageScrollBottom: number,
  currentSectionName: string,
): [number, number, number] => {
  /*
  This is just a dev mode test to warn about overlapping transitions
  */
  if (import.meta.env.DEV) {
    const matchingTransitions = WAYPOINTS.filter(
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

  const waypoint = WAYPOINTS.find((w) => {
    if (w.type === "fixed") {
      return w.sections.includes(currentSectionName);
    }
    const start = w.start ?? w.section;
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
