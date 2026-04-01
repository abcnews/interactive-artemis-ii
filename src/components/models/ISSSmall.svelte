<script lang="ts">
  import * as THREE from "three";
  import { GLTF, useDraco } from "@threlte/extras";
  import gltfUrl from "~/src/assets/ISSSmall_compressed.glb?url";
  import { T } from "@threlte/core";

  let { opacity = 1, ...props } = $props();

  let dracoLoader = useDraco();

  const LINE_COLOR = "#ff6a00";

  const darkMaterial = new THREE.MeshBasicMaterial({
    color: "#1a0800",
    transparent: true,
    opacity: 0.15,
  });

  let lineMaterials = $state<THREE.LineBasicMaterial[]>([]);

  $effect(() => {
    darkMaterial.opacity = opacity * 0.15;
    // Iterating the $state array ensures the effect re-tracks when new materials are added
    lineMaterials.forEach((mat) => (mat.opacity = opacity));
  });
</script>

<T.Group {...props}>
  <GLTF
    {dracoLoader}
    url={gltfUrl}
    oncreate={(ref) => {
      ref.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;

        const edges = new THREE.EdgesGeometry(child.geometry, 5);
        const lineMat = new THREE.LineBasicMaterial({
          color: LINE_COLOR,
          transparent: true,
          opacity: 1,
        });

        lineMaterials.push(lineMat);

        // THREE.LineSegments has no updateMatrixWorld recursion bug
        const lineSegs = new THREE.LineSegments(edges, lineMat);
        child.add(lineSegs);
        child.material = darkMaterial;
      });
    }}
  />
</T.Group>
