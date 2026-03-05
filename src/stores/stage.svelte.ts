import { scroll } from "./scroll.svelte";

const transitions = new Map<string, { start: number; end: number }>();

transitions.set("stars-enter", {
  start: 1000,
  end: 2000,
});

class Stage {

  starsProgress = $derived.by(() => {
    const { start, end } = transitions.get("stars-enter")!;
    const current = scroll.pageScrollBottom;

    if (current < start) return 0;
    if (current > end) return 1;

    return Number(((current - start) / (end - start)).toFixed(3));
  });
  transitionsActive = $derived.by(() => {
    const active: Record<string, number> = {};

    transitions.forEach((range, name) => {
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

    console.log(active);
    return active;
  });
}

export const stage = new Stage();
