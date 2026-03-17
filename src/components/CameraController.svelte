<script lang="ts">
  import { useTask, useThrelte } from "@threlte/core";
  import * as THREE from "three";

  type Props = {
    moonArrived?: boolean;
  };

  let { moonArrived = true }: Props = $props();

  const { camera } = useThrelte();

  const MOON_Z = -406;
  const ORBIT_RADIUS = 8;
  const ORBIT_SPEED = 0.2;

  let orbitAngle = $state(0);

  useTask((delta) => {
   
    if (!moonArrived) return;

    orbitAngle += delta * ORBIT_SPEED;
    
    camera.current.position.set(
      Math.sin(orbitAngle) * ORBIT_RADIUS,
      0,
      MOON_Z + Math.cos(orbitAngle) * ORBIT_RADIUS,
    );
    (camera.current as THREE.PerspectiveCamera).lookAt(0, 0, MOON_Z);
  });

  // The FOV you want at your "design" aspect ratio (e.g. 16:9 desktop)
  // const HFOV = 90; // horizontal FOV in degrees — stays constant

  // This was an attempt to do horizontal FOV as well
  // as vertical but it threw off the first Artemis section

  // $effect(() => {
  //   const aspect = $size.width / $size.height;
  //   const cam = $camera as THREE.PerspectiveCamera;

  //   // Convert desired horizontal FOV to vertical FOV for this aspect ratio
  //   cam.fov = THREE.MathUtils.radToDeg(
  //     2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(HFOV) / 2) / aspect)
  //   );
  //   cam.aspect = aspect;
  //   cam.updateProjectionMatrix();
  // });
</script>
