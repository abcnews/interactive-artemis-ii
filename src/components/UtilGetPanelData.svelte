<script lang="ts">
  import { onMount } from "svelte";
  import * as v from "valibot";
  import { parse as parseAlternatingCaseToObject } from "@abcnews/alternating-case-to-object";

  import { scroll } from "~/src/stores/scroll.svelte";

  const ParsedSchema = v.object({
    key: v.string("Expected to be a string"),
  });

  type ParsedData = v.InferOutput<typeof ParsedSchema>;

  function getParsedData(data: unknown): ParsedData {
    return v.parse(ParsedSchema, data);
  }

  onMount(() => {
    const panels = document.querySelectorAll<HTMLElement>("[data-key='panel']");

    const mapped = [...panels].map((panel) => {
      if (panel.dataset.tag) {
        return {
          name: getParsedData(parseAlternatingCaseToObject(panel.dataset.tag))
            .key,
          downPage: panel.offsetTop,
        };
      } else return { name: "notset", downPage: panel.offsetTop };
    });

    console.log(mapped);
    scroll.setPanelsData(mapped);
  });
</script>
