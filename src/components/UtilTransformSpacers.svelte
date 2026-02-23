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
  import { parse as parseA2O } from "@abcnews/alternating-case-to-object";
  import * as v from "valibot";

  const ParsedSchema = v.object({
    gap: v.number(),
  });

  type ParsedData = v.InferOutput<typeof ParsedSchema>;

  function getParsedData(data: unknown): ParsedData {
    return v.parse(ParsedSchema, data);
  }

  function processSpacers([first, ...rest]: Mount[]) {
    if (!first) {
      // Finished processing
      return;
    }

    // Process current spacer
    const values = getMountValue(first);
    const parsedValues = getParsedData(parseA2O(values));
    const spacerHTMLElement = first as unknown as HTMLElement;
    const gap = parsedValues.gap;

    spacerHTMLElement.style.setProperty(
      "margin-top",
      `${typeof gap === "number" ? gap : 100}px`,
      "important",
    );

    // Recursive case: process next spacer
    processSpacers(rest);
  }

  onMount(() => {
    let spacers = selectMounts("spacer", {
      includeOwnUsed: true,
    });

    processSpacers(spacers);
  });
</script>
