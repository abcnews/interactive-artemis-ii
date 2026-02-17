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
  import { parse, stringify } from "@abcnews/alternating-case-to-object";

  onMount(() => {
    let spacers = selectMounts("spacer", {
      includeOwnUsed: true,
    });

    function processSpacers(spacers: Mount[], index = 0) {
      // Base case: if we've processed all spacers, return
      if (index >= spacers.length) {
        return;
      }

      // Process current spacer
      const spacer = spacers[index];
      const values = getMountValue(spacer);
      const parsedValues = parse(values);
      const spacerHTMLElement = spacer as unknown as HTMLElement;
      const gap = parsedValues.gap;

      console.log(parsedValues);

      spacerHTMLElement.style.setProperty(
        "margin-top",
        `${typeof gap === "number" ? gap : 100}px`,
        "important",
      );

      // Recursive case: process next spacer
      processSpacers(spacers, index + 1);
    }

    processSpacers(spacers);
  });
</script>
