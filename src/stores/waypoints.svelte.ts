import { kmScale } from "~/src/lib/utils";

export type FixedWaypoint = {
  type: "fixed";
  sections: string[];
  position: [number, number, number];
};

export type TransitionWaypoint = {
  type: "transition";
  section?: string;
  start: string;
  end: string;
  fromPosition: [number, number, number];
  toPosition: [number, number, number];
};

type CameraWaypoint = FixedWaypoint | TransitionWaypoint;

const STARTING_POSITION: [number, number, number] = [0, 36, -60];
const TAKEOFF_POSITION: [number, number, number] = [0, 0, 0];

const INITIAL_WAYPOINTS: CameraWaypoint[] = [
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

class Waypoints {
  constructor(initialWaypoints: CameraWaypoint[] = []) {
    this.waypoints = initialWaypoints;
  }

  waypoints: CameraWaypoint[] = $state([]);

  setAdditionalWaypoints(additionalWaypoints: CameraWaypoint[]) {
    this.waypoints = [...INITIAL_WAYPOINTS, ...additionalWaypoints];
  }
}

export const waypointStore = new Waypoints(INITIAL_WAYPOINTS);
