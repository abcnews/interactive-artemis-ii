import { screen } from "./screen.svelte";

type Section = string;

type PanelData = {
  name: Section;
  downPage: number;
};

class Scroll {
  // State
  #pageScroll = $state(0);
  panelsData: PanelData[] = $state([]);
  currentSection: Section = $derived.by(() => {
    const find = (index: number): Section => {
      if (index < 0) {
        return "initial";
      }

      const panel = this.panelsData[index];

      if (this.pageScroll + screen.innerHeight > panel.downPage) {
        return panel.name;
      }

      return find(index - 1);
    };

    return find(this.panelsData.length - 1);
  });

  // Methods
  setPanelsData(data: PanelData[]) {
    this.panelsData = data;
  }
  get pageScroll() {
    return this.#pageScroll;
  }
  set pageScroll(scrollY: number) {
    this.#pageScroll = Math.round(scrollY);
  }
}

export const scroll = new Scroll();
