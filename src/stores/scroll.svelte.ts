type ElementSize = {
  readonly width: number;
  readonly height: number;
};

import { screen } from "./screen.svelte";
import { Previous } from "runed";
import { round } from "decimalish";

type PanelData = {
  name: string;
  downPage: number;
  height: number;
};

type Section = PanelData;

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

  // Throttled in App.svelte due to Runed not working outside component root
  throttledPageScroll = $state(0);

  // The bottom the screen
  pageScrollBottom = $derived(this.throttledPageScroll + screen.innerHeight);

  bodyElSize: ElementSize = $state({ width: 0, height: 0 });
  panelsData: PanelData[] = $state([]);
  currentSection: Section = $derived.by(() => {
    if (this.panelsData.length === 0) {
      return {
        name: "initial",
        downPage: screen.innerHeight,
        height: 1,
      };
    }

    const find = (index: number): Section => {
      if (index < 0) {
        return {
          name: "initial",
          downPage: screen.innerHeight,
          height: this.panelsData[0].downPage - screen.innerHeight,
        };
      }

      const panel = this.panelsData[index];

      if (this.pageScrollBottom > panel.downPage) {
        return panel;
      }

      return find(index - 1);
    };

    return find(this.panelsData.length - 1);
  });
  previousSection = new Previous(() => this.currentSection);
  pixelsThroughSection = $derived.by(() => {
    const { downPage } = this.currentSection;
    return this.pageScrollBottom - downPage;
  });
  progressThrough = $derived.by(() => {
    const { height } = this.currentSection;
    if (height === 0) {
      return 0;
    } else {
      return Number(round(this.pixelsThroughSection / height, { places: 3 }));
    }
  });

  // Methods
  setPanelsData(data: PanelData[]) {
    this.panelsData = data;
  }
}

export const scroll = new Scroll();
