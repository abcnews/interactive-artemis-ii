class Accessibility {
  prefersReducedMotion = $state(
    document.body.classList.contains("is-reduced-motion"),
  );

  private observer: MutationObserver;

  constructor() {
    this.observer = new MutationObserver((_event) => {
      this.prefersReducedMotion =
        document.body.classList.contains("is-reduced-motion");
    });
    this.observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
      childList: false,
      characterData: false,
    });
  }

  destroy() {
    this.observer.disconnect();
  }
}

export const accessibility = new Accessibility();
