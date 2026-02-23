<script lang="ts">
  import {
    addCanvasPortalSnippet,
    removeCanvasPortalSnippet,
  } from "./CanvasPortalTarget.svelte";
  import { onDestroy, type Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  // svelte-ignore state_referenced_locally
  addCanvasPortalSnippet(children);

  onDestroy(() => {
    removeCanvasPortalSnippet(children);
  });
</script>
