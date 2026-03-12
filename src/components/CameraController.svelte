<script lang="ts">
  import { useThrelte } from "@threlte/core";
  import * as THREE from "three";

  const { size, camera } = useThrelte();

  // The FOV you want at your "design" aspect ratio (e.g. 16:9 desktop)
  const HFOV = 90; // horizontal FOV in degrees — stays constant

  $effect(() => {
    const aspect = $size.width / $size.height;
    const cam = $camera as THREE.PerspectiveCamera;

    // Convert desired horizontal FOV to vertical FOV for this aspect ratio
    cam.fov = THREE.MathUtils.radToDeg(
      2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(HFOV) / 2) / aspect)
    );
    cam.aspect = aspect;
    cam.updateProjectionMatrix();
  });
</script>