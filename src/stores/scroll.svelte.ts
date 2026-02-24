type Section = string;

type PanelData = {
  name: Section;
  downPage: number;
};

class Scroll {
  pageScroll = $state(0);
  panelsData: PanelData[] = [
    { name: "initial", downPage: 0 },
    { name: "panel1", downPage: 1000 },
    { name: "panel2", downPage: 2000 },
    { name: "panel3", downPage: 3000 },
    { name: "end", downPage: 5000 },
  ];
  currentSection: Section = $derived.by(() => {
    const find = (index: number): Section => {
      if (index < 0) return "initial";
      const panel = this.panelsData[index];
      if (this.pageScroll > panel.downPage) return panel.name;
      return find(index - 1);
    };

    return find(this.panelsData.length - 1);
  });
}

export const scroll = new Scroll();
