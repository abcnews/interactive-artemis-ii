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

    for (const spacer of spacers) {
      const values = getMountValue(spacer);
      const parsedValues = parse(values);
      const spacerHTMLElement = spacer as unknown as HTMLElement;

      spacerHTMLElement.style.setProperty(
        "margin-top",
        `${parsedValues.height}px`,
        "important",
      );
    }
  });
</script>
