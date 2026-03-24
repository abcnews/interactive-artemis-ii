<script lang="ts">
  import { fade } from "svelte/transition";
  import { scroll } from "~/src/stores/scroll.svelte";
  import { stage } from "~/src/stores/stage.svelte";

  type Overlay = {
    start: string;
    end: string;
    image?: string;
    alt?: string;
    title?: string;
    description?: string;
  };

  const overlays: Overlay[] = [
    {
      start: "spacestation",
      end: "spacestation2",
      image: "/assets/iss-diagram.png",
      title: "The International Space Station",
      description: "Orbiting 400km above Earth",
    },
    // Add more as needed
  ];

  const activeOverlay = $derived.by(() => {
    return (
      overlays.find((overlay) => {
        const startPos = stage.getDownpage(overlay.start);
        const endPos = stage.getDownpage(overlay.end);
        return (
          scroll.pageScrollBottom >= startPos &&
          scroll.pageScrollBottom < endPos
        );
      }) ?? null
    );
  });
</script>

{#if activeOverlay}
  <div class="hover-overlay" transition:fade={{ duration: 400 }}>
    {#if activeOverlay.image}
      <!-- <img src={activeOverlay.image} alt={activeOverlay.alt} /> -->
    {/if}

    {#if activeOverlay.title || activeOverlay.description}
      <div class="text-content">
        {#if activeOverlay.title}<h2>{activeOverlay.title}</h2>{/if}
        {#if activeOverlay.description}<p>{activeOverlay.description}</p>{/if}
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  .hover-overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none; // Let scroll events pass through

    // Styling
    background: hsla(0, 0%, 6%, 1);
    border: 1px solid #fca403;
    // border-radius: 8px;
    padding: 24px;
    color: white;
    max-width: 400px;
    text-align: center;
    backdrop-filter: blur(4px);

    img {
      max-width: 100%;
      height: auto;
      margin-bottom: 16px;
    }
  }
</style>
