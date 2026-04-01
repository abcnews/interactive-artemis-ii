import { SvelteMap } from "svelte/reactivity";
import { scaleLinear } from "d3-scale";
import { scroll } from "./scroll.svelte";

type Transition = {
  start: number;
  end: number;
};


class Stage {
  transitions = new SvelteMap<string, Transition>();

  starsProgress = $derived.by(() => {
    const range = this.transitions.get("stars-enter");
    if (!range) return 0;
    const { start, end } = range;
    const current = scroll.pageScrollBottom;

    if (current < start) return 0;
    if (current > end) return 1;

    return Number(((current - start) / (end - start)).toFixed(3));
  });
  
  transitionsActive = $derived.by(() => {
    const active: Record<string, number> = {};

    this.transitions.forEach((range, name) => {
      const current = scroll.pageScrollBottom;
      if (current < range.start) {
        active[name] = 0;
      } else if (current > range.end) {
        active[name] = 1;
      } else {
        active[name] = Number(
          ((current - range.start) / (range.end - range.start)).toFixed(3),
        );
      }
    });
    return active;
  });

  getDownpage(nameOrDownpage: string) {
    if (typeof nameOrDownpage === "string") {
      const panelData = scroll.panelsData.find(
        (panel) => panel.name === nameOrDownpage,
      );
      return panelData?.downPage || 0;
    } else {
      return nameOrDownpage;
    }
  }
  getProgressBetweenSections({
    start,
    end,
    startOffset = 0,
    endOffset = 0,
    domain = [0, 1],
    clamp = false
  }: {
    start: string;
    end: string;
    startOffset?: number;
    endOffset?: number;
    domain?: [number, number];
    clamp?: boolean;
  }) {
    return scaleLinear(
      [
        this.getDownpage(start) + startOffset,
        this.getDownpage(end) + endOffset,
      ],
      domain,
    ).clamp(clamp);
  }
}

export const stage = new Stage();
