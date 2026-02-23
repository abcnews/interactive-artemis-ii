<script lang="ts">
  import { T } from "@threlte/core";
  import * as THREE from "three";
</script>

<T.Points>
  <T.BufferGeometry
    oncreate={(geo) => {
      const count = 2000;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        pos[i] = (Math.random() - 0.5) * 500;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    }}
  />
  <T.PointsMaterial size={0.1} color="#ffffff" />
</T.Points>
