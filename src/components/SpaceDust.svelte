<!-- SpaceDust.svelte -->
<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import * as THREE from "three";
  import Rand from "rand-seed";

  const { camera } = useThrelte();
  const rand = new Rand("artemis-dust");

  const count = 3000;
  const pos = new Float32Array(count * 3);

  // Distribute in a tube along the Z travel path
  // Spread wide on X/Y, long on Z ahead of starting point
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (rand.next() - 0.5) * 40;   // X: tight corridor
    pos[i * 3 + 1] = (rand.next() - 0.5) * 40;   // Y
    pos[i * 3 + 2] = -(rand.next() * 600);         // Z: spread ahead of camera
  }

  let geo: THREE.BufferGeometry;

  const WRAP_BEHIND = 20;   // how far behind camera before wrapping
  const WRAP_AHEAD  = 600;  // how far ahead to reposition it

  useTask(() => {
    if (!geo) return;
    const camZ = camera.current.position.z;
    const attr = geo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      const pz = attr.getZ(i);
      // If dust has passed behind the camera, fling it ahead
      if (pz > camZ + WRAP_BEHIND) {
        attr.setXYZ(
          i,
          (rand.next() - 0.5) * 40,
          (rand.next() - 0.5) * 40,
          camZ - WRAP_AHEAD * rand.next()
        );
      }
    }

    attr.needsUpdate = true;
  });
</script>

<T.Points>
  <T.BufferGeometry
    bind:ref={geo}
    oncreate={(g) => {
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    }}
  />
  <T.PointsMaterial
    size={0.15}
    color="#aaccff"
    transparent
    opacity={0.25}
    depthWrite={false}
    blending={THREE.AdditiveBlending}
  />
</T.Points>