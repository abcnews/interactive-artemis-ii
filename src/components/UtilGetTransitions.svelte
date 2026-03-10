<!--
Utility component to add spacing in the DOM
-->

<script lang="ts">
  import { onMount } from "svelte";
  import {
    isMount,
    getMountValue,
    selectMounts,
    type Mount,
  } from "@abcnews/mount-utils";
  import { parse as parseAlternatingCaseToObject } from "@abcnews/alternating-case-to-object";
  import * as v from "valibot";
  import { kmScale } from "~/src/lib/utils";
  import { Effect, Match } from "effect";
  import { screen } from "../stores/screen.svelte";
  import {
    waypointStore,
    type TransitionWaypoint,
  } from "../stores/waypoints.svelte";

  import effectTry from "~/src/lib/effectTry";

  const ParsedSchema = v.object({
    start: v.string(),
    end: v.string(),
    from: v.number(),
    to: v.number(),
  });

  type ParsedData = v.InferOutput<typeof ParsedSchema>;

  function getParsedData(data: unknown): ParsedData {
    return v.parse(ParsedSchema, data);
  }

  let additionalWaypoints: TransitionWaypoint[] = [];

  function processTransitions([first, ...rest]: Mount[]) {
    if (!first) {
      // Nothing left to do
      return;
    }

    // Process current spacer
    const values = getMountValue(first);
    const [error, parsedValues] = effectTry(
      Effect.try({
        try: () => getParsedData(parseAlternatingCaseToObject(values)),
        catch: (e) => new Error(`Parsing failed: ${e}`),
      }),
    );

    Match.value(parsedValues).pipe(
      Match.when(null, () => console.error(error)),
      Match.not(Match.null, (parsedValues) => {
        const { start, end, from, to } = parsedValues;

        additionalWaypoints = [
          ...additionalWaypoints,
          {
            type: "transition",
            start: start,
            end: end,
            fromPosition: [0, 0, kmScale(from)],
            toPosition: [0, 0, kmScale(-to)],
          },
        ];

        console.log(start, end, from, to);

        // Recursively process the rest of the spacers
        processTransitions(rest);
      }),
      Match.exhaustive,
    );
  }

  onMount(() => {
    let transitions = selectMounts("transition", {
      includeOwnUsed: true,
    });

    processTransitions(transitions);

    // TODO: Make this "additionalWaypoints" more declarative later if you can
    waypointStore.setAdditionalWaypoints(additionalWaypoints);
  });
</script>
