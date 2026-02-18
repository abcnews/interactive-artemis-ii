<script lang="ts">
  import backgroundVideo from "~/src/assets/Overview 01-1_ProRes4444_16x9-1-hevc-safari.mp4?url";
</script>

<video
  autoplay
  muted
  loop
  playsinline
  preload="auto"
  src={backgroundVideo}
></video>

<style lang="scss">
  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>