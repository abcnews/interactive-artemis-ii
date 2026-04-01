<script lang="ts">
  import * as THREE from "three";
  import { GLTF, useDraco } from "@threlte/extras";
  import gltfUrl from "./moon_small.glb?url";
  import { T } from "@threlte/core";

  let { opacity = 1, ...props } = $props();
</script>

<T.Group {...props}>
  <GLTF url={gltfUrl} />
</T.Group>
