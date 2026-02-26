<script lang="ts">
  import { onMount } from "svelte";
  import * as v from "valibot";
  import { parse as parseA2O } from "@abcnews/alternating-case-to-object";

  import { scroll } from "~/src/stores/scroll.svelte";

  const ParsedSchema = v.object({
    key: v.string("Expected to be a string"),
  });

  type ParsedData = v.InferOutput<typeof ParsedSchema>;

  function getParsedData(data: unknown): ParsedData {
    return v.parse(ParsedSchema, data);
  }

  $effect(() => {
    const panels = document.querySelectorAll<HTMLElement>("[data-key='panel']");
    const mapped = [...panels].map((panel, index) => {
      return {
        name: panel.dataset.tag
          ? getParsedData(parseA2O(panel.dataset.tag)).key
          : "notset",
        downPage: panel.offsetTop,
        height: panels[index + 1]
          ? panels[index + 1].offsetTop - panel.offsetTop
          : scroll.bodyElSize.height - panel.offsetTop,
      };
    });
    scroll.setPanelsData(mapped);
  });
</script>
