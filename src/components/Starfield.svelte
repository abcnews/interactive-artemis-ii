<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import * as THREE from "three";
  import Rand from "rand-seed";

  const rand = new Rand("artemis-ii");

  let points: THREE.Points;

  const { camera } = useThrelte();

  useTask(() => {
    if (points) {
      points.position.copy(camera.current.position).multiplyScalar(0.999);
    }
  });

  const SHOUD_USE_SURROUNDING_SPHERE = false;

  const generateStars = () => {
    if (SHOUD_USE_SURROUNDING_SPHERE) {
      const count = 10000;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (rand.next() - 0.5) * 1000; // X: full spread
        positions[i * 3 + 1] = (rand.next() - 0.5) * 1000; // Y: full spread
        positions[i * 3 + 2] = -rand.next() * 500; // Z: 0 → -500 (forward only)
      }
      return positions;
    } else {
      const count = 10000;
      const positions = new Float32Array(count * 3);
      const radius = 400;

      for (let i = 0; i < count; i++) {
        // Random point on a sphere surface
        const theta = rand.next() * Math.PI * 2; // 0 → 360°
        const phi = Math.acos(2 * rand.next() - 1); // 0 → 180°, uniform distribution

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
      }
      return positions;
    }
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
