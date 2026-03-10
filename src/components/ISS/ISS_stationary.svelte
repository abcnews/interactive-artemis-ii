<script lang="ts">
  import * as THREE from "three";
  import { Environment, GLTF, OrbitControls, useDraco } from "@threlte/extras";
  import gltfUrl from "./ISS_stationary-transformed.glb?url";
  import { T } from "@threlte/core";

  let { opacity, ...props } = $props();

  let dracoLoader = useDraco();

  const greyMaterial = new THREE.MeshStandardMaterial({
    color: "#aaaaaa",
    roughness: 0.8,
    metalness: 0.4,
    transparent: true,  // must be true upfront, can't toggle later
    opacity: 1,
  });

  $effect(() => {
    greyMaterial.opacity = opacity;
  });
</script>

<T.Group {...props}>
  <GLTF
    url={gltfUrl}
    {dracoLoader}
    oncreate={(ref) => {
      ref.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = greyMaterial;
        }
      });
    }}
  ></GLTF>
</T.Group>
