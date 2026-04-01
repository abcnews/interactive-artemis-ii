<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import {
    InstancedMesh,
    PlaneGeometry,
    ShaderMaterial,
    Object3D,
    DoubleSide,
    Matrix4,
  } from "three";
  import { kmScale } from "~/src/lib/utils";

  const INTERVAL = 50000;
  const MIN_KM = 40000;
  const MAX_KM = 350000;
  const VISIBLE_RANGE = kmScale(20000);
  const FADE_RANGE = VISIBLE_RANGE * 0.3;

  const markerKms = Array.from(
    { length: Math.floor((MAX_KM - MIN_KM) / INTERVAL) + 1 },
    (_, i) => MIN_KM + i * INTERVAL,
  );

  const COUNT = markerKms.length;

  type Props = {
    cameraPosition?: [number, number, number];
    alwaysVisible?: boolean;
  };

  let { cameraPosition, alwaysVisible = false }: Props = $props();

  // Shared geometry — created once
  // The first number is the width (length of the bar), the second is thickness.
  const geometry = new PlaneGeometry(1.2, 0.03);

  // Custom shader that reads per-instance opacity from instance attribute
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    toneMapped: false,
    vertexShader: `
      attribute float instanceOpacity;
      varying float vOpacity;
      void main() {
        vOpacity = instanceOpacity;
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float vOpacity;
      void main() {
        if (vOpacity < 0.01) discard;
        gl_FragColor = vec4(1.0, 1.0, 1.0, vOpacity);
      }
    `,
  });

  // Pre-compute static Z positions
  const markerPositionsZ = markerKms.map((km) => kmScale(-km));

  // Reusable dummy for matrix composition
  const dummy = new Object3D();

  // Opacity buffer — updated each frame
  const opacities = new Float32Array(COUNT);

  let meshRef: InstancedMesh | undefined = $state();

  function computeOpacity(camZ: number, posZ: number): number {
    if (alwaysVisible) return 1;
    const ahead = camZ - posZ;
    if (ahead > VISIBLE_RANGE) return 0;
    if (ahead > 0)
      return Math.max(
        0,
        1 - (ahead - FADE_RANGE) / (VISIBLE_RANGE - FADE_RANGE),
      );
    return Math.max(0, 1 - Math.abs(ahead) / (VISIBLE_RANGE * 3));
  }

  function setupInstances(mesh: InstancedMesh) {
    // Set static transforms — these never change
    for (let i = 0; i < COUNT; i++) {
      // Position the markers in space
      dummy.position.set(0, -1, markerPositionsZ[i]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // Attach the opacity instance attribute
    const opacityAttr = new THREE.InstancedBufferAttribute(opacities, 1);
    mesh.geometry.setAttribute("instanceOpacity", opacityAttr);
  }

  // We need THREE for InstancedBufferAttribute
  import * as THREE from "three";

  useTask(() => {
    if (!meshRef) return;

    const camZ = (cameraPosition && cameraPosition[2]) || 0;
    let anyChanged = false;

    for (let i = 0; i < COUNT; i++) {
      const newOpacity = computeOpacity(camZ, markerPositionsZ[i]);
      if (opacities[i] !== newOpacity) {
        opacities[i] = newOpacity;
        anyChanged = true;
      }
    }

    if (anyChanged) {
      const attr = meshRef.geometry.getAttribute("instanceOpacity");
      if (attr) {
        (attr as THREE.BufferAttribute).needsUpdate = true;
      }
    }
  });
</script>

<T.InstancedMesh
  args={[geometry, material, COUNT]}
  bind:ref={meshRef}
  frustumCulled={false}
  oncreate={(ref) => setupInstances(ref)}
/>
