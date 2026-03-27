<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { BufferAttribute, Points } from "three";
  import Rand from "rand-seed";

  const rand = new Rand("artemis-ii");

  let points: Points;

  const { camera } = useThrelte();

  // Track last camera Z to skip frames where camera hasn't moved
  let lastCamZ = 0;
  const EPSILON = 0.0001; // Skip update if camera moved less than this

  useTask(() => {
    if (!points) return;

    const camZ = camera.current.position.z;

    // Skip if camera hasn't moved meaningfully
    if (Math.abs(camZ - lastCamZ) < EPSILON) return;

    lastCamZ = camZ;
    points.position.copy(camera.current.position).multiplyScalar(0.99);
  });

  const COUNT = 5000;

  const generateStars = () => {
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (rand.next() - 0.5) * 1000;
      positions[i * 3 + 1] = (rand.next() - 0.5) * 1000;
      positions[i * 3 + 2] = -rand.next() * 500;
    }
    return positions;
  };

  const starPositions = generateStars();
</script>

<T.Points bind:ref={points}>
  <T.BufferGeometry
    oncreate={(geometry) => {
      geometry.setAttribute(
        "position",
        new BufferAttribute(starPositions, 3),
      );
    }}
  />
  <T.PointsMaterial size={0.1} color="#ddd" />
</T.Points>
