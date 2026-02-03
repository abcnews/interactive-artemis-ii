import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { whenOdysseyLoaded } from "@abcnews/env-utils";

let app: any;

const init = async () => {
  // Odyssey format required
  await whenOdysseyLoaded;

  app = mount(App, {
    target: document.querySelector(".Header")!,
  });
};

init();

export default app;
