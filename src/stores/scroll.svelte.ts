type Sections = string;

class Scroll {
  page = $state(0);
  currentSection: Sections = $derived.by(() => {
    return this.page < 1000 ? "initial" : "after";
  });
}

export const scroll = new Scroll();
