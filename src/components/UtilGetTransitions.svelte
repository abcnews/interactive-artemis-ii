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

  const Y_POS = 0;

  const ParsedSchema = v.object({
    start: v.string(),
    end: v.string(),
    from: v.number(),
    to: v.number(),
  });

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
      fromPosition: [0, Y_POS, kmScale(-from)],
      toPosition: [0, Y_POS, kmScale(-to)],
    };
  }

  onMount(() => {
    const waypoints = selectMounts("transition", { includeOwnUsed: true })
      .map(mountToWaypoint)
      .filter((w): w is TransitionWaypoint => w !== null);

    waypointStore.setAdditionalWaypoints(waypoints);
  });
</script>
