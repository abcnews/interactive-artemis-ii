<script lang="ts">
  import { onMount } from "svelte";
  import * as v from "valibot";
  import { parse as parseAlternatingCaseToObject } from "@abcnews/alternating-case-to-object";

  import { scroll } from "~/src/stores/scroll.svelte";
  import { screen } from "~/src/stores/screen.svelte";

  const ParsedSchema = v.object({
    key: v.string("Expected to be a string"),
  });

  type ParsedData = v.InferOutput<typeof ParsedSchema>;

  function getParsedData(data: unknown): ParsedData {
    return v.parse(ParsedSchema, data);
  }

  onMount(() => {
    const panels = document.querySelectorAll<HTMLElement>("[data-key='panel']");

    const mapped = [...panels].map((panel, index) => {
      console.log(index);

      return {
        name: panel.dataset.tag
          ? getParsedData(parseAlternatingCaseToObject(panel.dataset.tag)).key
          : "notset",
        downPage: panel.offsetTop,
        height: panels[index + 1]
          ? panels[index + 1].offsetTop - panel.offsetTop
          : scroll.bodyElSize.height - panel.offsetTop,
      };
    });

    console.log(mapped);
    scroll.setPanelsData(mapped);
  });
</script>
