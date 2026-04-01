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
  slowZone?: {
    fromZ: number;
    toZ: number;
    factor: number; // 2 = twice as slow, 3 = three times, etc.
  };
};

export type CameraWaypoint = FixedWaypoint | TransitionWaypoint;

const STARTING_POSITION: [number, number, number] = [0, 36, -70];
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
