<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
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

  // TODO: Make sure no stars are generated too close
  const generateStars = () => {
    const count = 10000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (rand.next() - 0.5) * 500;
    }
    return positions;
  };
</script>

<T.Points bind:ref={points}>
  <T.BufferGeometry
    oncreate={(geometry) => {
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(generateStars(), 3),
      );
    }}
  />
  <T.PointsMaterial size={0.1} color="#ffffff" />
</T.Points>
