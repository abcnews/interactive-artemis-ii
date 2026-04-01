<script lang="ts">
  import backgroundVideo from "~/src/assets/Overview 01-1_ProRes4444_16x9-1-vp9-chrome.webm?url";
  import backgroundVideoPortrait from "~/src/assets/Overview 01-1_ProRes4444_390x844-1-vp9-chrome.webm?url";
  import backgroundVideoSafari from "~/src/assets/Overview 01-1_ProRes4444_16x9-1-hevc-safari.mp4?url";
  import backgroundVideoPortraitSafari from "~/src/assets/Overview 01-1_ProRes4444_390x844-1-hevc-safari.mp4?url";

  import { screen } from "~/src/stores/screen.svelte";

  function isLandscape(width: number, height: number) {
    return width > height ? true : false;
  }

  const supportsHEVC = (() => {
    if (typeof document === "undefined") return false;
    const probe = document.createElement("video");
    return probe.canPlayType('video/mp4; codecs="hvc1"') !== "";
  })();

  let videoEl: HTMLVideoElement;
  let landscape = $derived(isLandscape(screen.innerWidth, screen.innerHeight));

  let src = $derived(
    supportsHEVC
      ? landscape
        ? backgroundVideoSafari
        : backgroundVideoPortraitSafari
      : landscape
        ? backgroundVideo
        : backgroundVideoPortrait,
  );

  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    landscape;
    videoEl?.load();
  });
</script>

<!-- <video bind:this={videoEl} autoplay muted loop playsinline preload="auto">
  <source
    src={landscape ? backgroundVideoSafari : backgroundVideoPortraitSafari}
    type="video/mp4"
  />
  <source
    src={landscape ? backgroundVideo : backgroundVideoPortrait}
    type="video/webm"
  />
</video> -->

<video bind:this={videoEl} autoplay muted loop playsinline preload="auto">
  <source {src} type={supportsHEVC ? "video/mp4" : "video/webm"} />
</video>

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
