<script lang="ts">
  import { T , useTask, useThrelte} from "@threlte/core";
  import * as THREE from "three";
  import Rand from "rand-seed";

  // Seed-based random number generator
  const rand = new Rand("artemis-ii");

  let points: THREE.Points;

  const { camera } = useThrelte();

  useTask(() => {
    if (points) {
      points.position.copy(camera.current.position);
    }
  });
</script>

<T.Points bind:ref={points}>
  <T.BufferGeometry
    oncreate={(geo) => {
      const count = 10000;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        pos[i] = (rand.next() - 0.5) * 500;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    }}
  />
  <T.PointsMaterial size={0.1} color="#ffffff" />
</T.Points>
