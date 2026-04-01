<script lang="ts">
  import { onMount } from "svelte";
  import {
    getMountValue,
    selectMounts,
    type Mount,
  } from "@abcnews/mount-utils";
  import { parse as parseAlternatingCaseToObject } from "@abcnews/alternating-case-to-object";
  import * as v from "valibot";
  import { kmScale } from "~/src/lib/utils";
  import {
    waypointStore,
    type TransitionWaypoint,
  } from "../stores/waypoints.svelte";

  const ParsedSchema = v.object({
    start: v.string(),
    end: v.string(),
    from: v.number(),
    to: v.number(),
  });

  // A test for fly-by, remove later
  function getXPos({ from }: { from: number }) {
    if (from < 380700) return 0;
    else return -5;
  }

  function mountToWaypoint(mount: Mount): TransitionWaypoint | null {
    const result = v.safeParse(
      ParsedSchema,
      parseAlternatingCaseToObject(getMountValue(mount)),
    );

    if (!result.success) {
      console.error("Waypoint parse failed:", result.issues);
      return null;
    }

    const { start, end, from, to } = result.output;
    return {
      type: "transition",
      start,
      end,
      fromPosition: [0, 0, kmScale(-from)],
      toPosition: [0, 0, kmScale(-to)],
    };
  }

  onMount(() => {
    const waypoints = selectMounts("transition", { includeOwnUsed: true })
      .map(mountToWaypoint)
      .filter((w): w is TransitionWaypoint => w !== null);

    // Add custom slowdown for Hubble Telescope otherwise it zooms
    // past way too fast!
    const waypointsWithSlowdown = waypoints.map((waypoint) => {
      if (waypoint.start === "exosphere" && waypoint.end === "exosphere2") {
        return {
          ...waypoint,
          slowZone: {
            fromZ: -0.47,
            toZ: -0.56,
            factor: 50, // tune this — start with 3x and adjust
          },
        };
      }
      return waypoint;
    });

    waypointStore.setAdditionalWaypoints(waypointsWithSlowdown);
  });
</script>
