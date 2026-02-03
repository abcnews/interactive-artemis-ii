import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { whenDOMReady, whenOdysseyLoaded } from "@abcnews/env-utils";

await whenDOMReady;
await whenOdysseyLoaded;

const app = mount(App, {
  target: document.querySelector(".Header")!,
});

export default app;
