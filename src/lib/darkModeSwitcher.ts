const makeOdysseyDark = () => {
  document.documentElement.classList.add("is-dark-mode");
  const main = document.querySelector(".Main") as HTMLElement;
  const header = document.querySelector(".Header") as HTMLElement;

  header?.classList.add("is-dark");
  header.dataset.scheme = "dark";
  main.dataset.scheme = "dark";
};

const makeOdysseyLight = () => {
  document.documentElement.classList.remove("is-dark-mode");

  const main = document.querySelector(".Main") as HTMLElement;
  const header = document.querySelector(".Header") as HTMLElement;

  header?.classList.remove("is-dark");
  header.dataset.scheme = "light";
  main.dataset.scheme = "light";
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
