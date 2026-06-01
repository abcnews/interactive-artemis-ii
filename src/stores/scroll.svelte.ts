type ElementSize = {
  readonly width: number;
  readonly height: number;
};

import { screen } from "./screen.svelte";
import { Previous } from "runed";

type PanelData = {
  name: string;
  downPage: number;
  height: number;
};

type Section = PanelData;

type PanelCurrent = PanelData & {
  pixelsFromTop: number;
  pixelsFromBottom: number;
  inViewport: boolean;
  progressUntilNext: number;
  screenProgress: number;
};

// Inline rounding — avoids the `round()` + `Number()` overhead from decimalish
function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

// Shared "initial" section object — avoids allocating a new one every tick
const INITIAL_SECTION: Section = {
  name: "initial",
  downPage: 0,
  height: 1,
};

class Scroll {
  /*
    Class state
  */

  // We are binding to window scroll in App.svelte
  #pageScroll = $state(0);
  get pageScroll() {
    return this.#pageScroll;
  }
  // Use getters and setters so we can round to nearest integer
  set pageScroll(scrollY: number) {
    this.#pageScroll = Math.round(scrollY);
  }

  // The bottom the screen
  pageScrollBottom = $derived(this.pageScroll + screen.innerHeight);
  bodyElSize: ElementSize = $state({ width: 0, height: 0 });
  panelsData: PanelData[] = $state([]);

  // Pre-allocated array — reused each tick to avoid creating new objects
  #panelsCurrentCache: PanelCurrent[] = [];

  panelsCurrent = $derived.by(() => {
    const panels = this.panelsData;
    const scrollBottom = this.pageScrollBottom;
    const viewHeight = screen.innerHeight;
    const cache = this.#panelsCurrentCache;

    // Resize cache if panel count changed (rare — only on mount/resize)
    if (cache.length !== panels.length) {
      cache.length = panels.length;
      for (let i = 0; i < panels.length; i++) {
        cache[i] = {
          name: "",
          downPage: 0,
          height: 0,
          pixelsFromTop: 0,
          pixelsFromBottom: 0,
          inViewport: false,
          progressUntilNext: 0,
          screenProgress: 0,
        };
      }
    }

    // Update in place — no new objects allocated
    for (let i = 0; i < panels.length; i++) {
      const panel = panels[i];
      const entry = cache[i];
      const pixelsFromBottom = scrollBottom - panel.downPage;
      const pixelsFromTop = viewHeight - pixelsFromBottom;

      entry.name = panel.name;
      entry.downPage = panel.downPage;
      entry.height = panel.height;
      entry.pixelsFromTop = pixelsFromTop;
      entry.pixelsFromBottom = pixelsFromBottom;
      entry.inViewport = pixelsFromTop > 0 && pixelsFromTop < viewHeight;
      entry.progressUntilNext = round3(1.0 - pixelsFromTop / panel.height);
      entry.screenProgress = round3(1.0 - pixelsFromTop / viewHeight);
    }

    // Return a shallow copy so Svelte sees a new array reference
    return [...cache];
  });

  currentSection: Section = $derived.by(() => {
    const panels = this.panelsData;

    if (panels.length === 0) {
      INITIAL_SECTION.downPage = screen.innerHeight;
      INITIAL_SECTION.height = 1;
      return INITIAL_SECTION;
    }

    const scrollBottom = this.pageScrollBottom;

    // Iterative reverse search — replaces recursive find()
    for (let i = panels.length - 1; i >= 0; i--) {
      if (scrollBottom > panels[i].downPage) {
        return panels[i];
      }
    }

    // Before the first panel
    INITIAL_SECTION.downPage = screen.innerHeight;
    INITIAL_SECTION.height = panels[0].downPage - screen.innerHeight;
    return INITIAL_SECTION;
  });

  previousSection = new Previous(() => this.currentSection);

  pixelsUntilNextSection = $derived.by(() => {
    return this.pageScrollBottom - this.currentSection.downPage;
  });

  progressUntilNextSection = $derived.by(() => {
    const { height } = this.currentSection;
    if (height === 0) return 0;
    return round3(this.pixelsUntilNextSection / height);
  });

  // Methods
  setPanelsData(data: PanelData[]) {
    this.panelsData = data;
  }
}

export const scroll = new Scroll();
