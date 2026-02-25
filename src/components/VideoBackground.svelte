<script lang="ts">
  import backgroundVideo from "~/src/assets/Overview 01-1_ProRes4444_16x9-1-vp9-chrome.webm?url";
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
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
