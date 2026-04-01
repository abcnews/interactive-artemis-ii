const makeOdysseyDark = () => {
  document.documentElement.classList.add("is-dark-mode");
  const main = document.querySelector<HTMLElement>(".Main");
  const header = document.querySelector<HTMLElement>(".Header");

  header?.classList.add("is-dark");
  if (header) header.dataset.scheme = "dark";
  if (main) main.dataset.scheme = "dark";

  const blocks = document.querySelectorAll(".Block") as NodeListOf<HTMLElement>;

  blocks.forEach((block) => {
    block.classList.add("has-dark");
    block.dataset.scheme = "dark";
  });
};

const makeOdysseyLight = () => {
  document.documentElement.classList.remove("is-dark-mode");

  const main = document.querySelector<HTMLElement>(".Main");
  const header = document.querySelector<HTMLElement>(".Header");

  header?.classList.remove("is-dark");
  if (header) header.dataset.scheme = "light";
  if (main) main.dataset.scheme = "light";

  const blocks = document.querySelectorAll(".Block") as NodeListOf<HTMLElement>;

  blocks.forEach((block) => {
    block.classList.remove("has-dark");
    block.dataset.scheme = "light";
  });
};

export const setMode = (dataScheme: string) => {
  if (dataScheme === "dark") {
    makeOdysseyDark();
  } else {
    makeOdysseyLight();
  }
};

const doMutation = (mutations: any) => {
  mutations.forEach((mutation: any) => {
    if (mutation.type === "attributes") {
      const dataScheme = mutation.target.getAttribute("data-scheme");
      setMode(dataScheme);
    }
  });
};

const observer = new MutationObserver(doMutation);

export const loadDarkModeObserver = () => {
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-scheme"],
  });
};

export const unloadDarkModeObserver = () => {
  observer.disconnect();
};
