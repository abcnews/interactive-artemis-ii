import { mount } from "svelte";
import "./app.css";
import type { Component, SvelteComponent } from "svelte";

import App from "./App.svelte";
import {
  getApplication,
  whenOdysseyLoaded,
  prefersColorScheme,
} from "@abcnews/env-utils";
import Timeout from "await-timeout";
import { isMount, getMountValue, selectMounts } from "@abcnews/mount-utils";

let app;

async function waitForOdysseyWithTimeout() {
  return Timeout.wrap(
    whenOdysseyLoaded,
    1000,
    "Timed out waiting for Odyssey to load",
  );
}

const init = async () => {
  await waitForOdysseyWithTimeout();
  app = mount(App, {
    target: document.body,
    props: { prefersColorScheme },
  });
};

init();

export default app;
