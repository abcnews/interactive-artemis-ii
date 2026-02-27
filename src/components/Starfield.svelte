<script lang="ts">
  import { T } from "@threlte/core";
  import * as THREE from "three";
  import Rand from 'rand-seed';

  const rand = new Rand('artemis-ii');
</script>

<!-- TODO: only render necessary stars -->
<T.Points>
  <T.BufferGeometry
    oncreate={(geo) => {
      const count = 100000;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        pos[i] = (rand.next() - 0.5) * 5000;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    }}
  />
  <T.PointsMaterial size={0.1} color="#ffffff" />
</T.Points>
