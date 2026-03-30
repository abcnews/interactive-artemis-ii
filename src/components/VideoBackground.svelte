<script lang="ts">
  import backgroundVideo from "~/src/assets/Header_Video_Landscape.webm?url";
  import backgroundVideoPortrait from "~/src/assets/Header_Video_Portrait.webm?url";

  import { screen } from "~/src/stores/screen.svelte";

  function isLandscape(width: number, height: number) {
    return width > height ? true : false;
  }
</script>

<video
  autoplay
  muted
  loop
  playsinline
  preload="auto"
  src={isLandscape(screen.innerWidth, screen.innerHeight)
    ? backgroundVideo
    : backgroundVideoPortrait}
></video>

<style lang="scss">
  video {
    position: absolute;

    @media (orientation: landscape) {
      top: 50%;
      left: 0;
      width: 100%;
      transform: translateY(-50%) translateX(-3%);
    }

    @media (orientation: portrait) {
      top: 0;
      left: 50%;
      height: 100%;
      transform: translateX(-50%) translateY(-4%);
    }
  }
</style>
