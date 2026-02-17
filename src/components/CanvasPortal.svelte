<script lang="ts">
  import {
    addCanvasPortalSnippet,
    removeCanvasPortalSnippet,
  } from "~/src/components/CanvasPortalTarget.svelte";
  import { onDestroy, type Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  addCanvasPortalSnippet(children);

  onDestroy(() => {
    removeCanvasPortalSnippet(children);
  });
</script>
