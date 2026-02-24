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
  import { Effect, Match } from "effect";

  import effectTry from "~/src/lib/effectTry";

  const ParsedSchema = v.object({
    gap: v.number("Expected to be a number"),
  });

  type ParsedData = v.InferOutput<typeof ParsedSchema>;

  function getParsedData(data: unknown): ParsedData {
    return v.parse(ParsedSchema, data);
  }

  function processSpacers([first, ...rest]: Mount[]) {
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
        const spacerHTMLElement = first as unknown as HTMLElement;
        const gap = parsedValues.gap;

        spacerHTMLElement.style.setProperty(
          "margin-top",
          `${typeof gap === "number" ? gap : 100}px`,
          "important",
        );

        // Recursively process the rest of the spacers
        processSpacers(rest);
      }),
      Match.exhaustive,
    );
  }

  onMount(() => {
    let spacers = selectMounts("spacer", {
      includeOwnUsed: true,
    });

    processSpacers(spacers);
  });
</script>
