<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { mount, unmount } from "svelte";
  import {
    selectMounts,
    getMountValue,
    type Mount,
  } from "@abcnews/mount-utils";
  import { parse as parseAlternatingCaseToObject } from "@abcnews/alternating-case-to-object";
  import * as v from "valibot";
  import { Effect, Match } from "effect";
  import effectTry from "~/src/lib/effectTry";

  import MissionTime from "./MissionTime.svelte";

  const ParsedSchema = v.object({
    hour: v.number(),
    min: v.number(),
    sec: v.number(),
  });

  type ParsedData = v.InferOutput<typeof ParsedSchema>;

  // Track mounted instances so we can clean them up
  let mountedInstances: ReturnType<typeof mount>[] = [];

  function processMissionTimes([first, ...rest]: Mount[]) {
    if (!first) return;

    const values = getMountValue(first);
    const [error, parsedValues] = effectTry(
      Effect.try({
        try: () => v.parse(ParsedSchema, parseAlternatingCaseToObject(values)),
        catch: (e) => new Error(`Parsing failed: ${e}`),
      }),
    );

    Match.value(parsedValues).pipe(
      Match.when(null, () => console.error(error)),
      Match.not(Match.null, (parsedValues) => {
        const target = first as unknown as HTMLElement;

        const instance = mount(MissionTime, {
          target,
          props: {
            hour: parsedValues.hour,
            min: parsedValues.min,
            sec: parsedValues.sec,
          },
        });

        mountedInstances.push(instance);
        processMissionTimes(rest);
      }),
      Match.exhaustive,
    );
  }

  onMount(() => {
    const mounts = selectMounts("missiontime", { includeOwnUsed: true });
    processMissionTimes(mounts);
  });

  onDestroy(() => {
    mountedInstances.forEach((instance) => unmount(instance));
    mountedInstances = [];
  });
</script>
