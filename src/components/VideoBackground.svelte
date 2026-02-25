<script lang="ts">
  import backgroundVideo from "~/src/assets/Overview 01-1_ProRes4444_16x9-1-vp9-chrome.webm?url";
  import backgroundVideoPortrait from "~/src/assets/Overview 01-1_ProRes4444_390x844-1-vp9-chrome.webm?url";
</script>

<!-- <div class="video-container"> -->
<video autoplay muted loop playsinline preload="auto" src={backgroundVideo}
></video>

<!-- </div> -->

<style lang="scss">
  /* .video-container {

    video {
      object-fit: cover;
    }
  } */

  video {
    /* width: 100%; */
    /* height: 100%; */
    /* object-fit: cover; */
    position: absolute;

    @media (orientation: landscape) {
      top: 50%;
      left: 0;
      width: 100%;
      transform: translateY(-50%);
    }

    @media (orientation: portrait) {
      top: 0;
      left: 50%;
      width: 100vh;
      transform: translateX(-50%);
    }
  }
</style>
