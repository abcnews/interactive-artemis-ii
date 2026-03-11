<script lang="ts">
  import { Text } from "@threlte/extras";
  import type { ComponentProps } from "svelte";

  type Props = ComponentProps<typeof Text> & {
    text: string;
    fontSize?: number;
  };

  let { text, fontSize = 0.1, ...props }: Props = $props();
</script>

<Text {text} color="white" {fontSize}  {...props} />
