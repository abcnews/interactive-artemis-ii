import { mount } from "svelte";
import "./app.css";
import type { Component, SvelteComponent } from "svelte";
import { type Readable } from "svelte/store";

import App from "./App.svelte";
import {
  getApplication,
  whenOdysseyLoaded,
  prefersColorScheme,
} from "@abcnews/env-utils";
import Timeout from "await-timeout";
import { isMount, getMountValue, selectMounts } from "@abcnews/mount-utils";
import { type AppProps } from "./App.svelte";

let app;

async function waitForOdysseyWithTimeout() {
  return Timeout.wrap(
    whenOdysseyLoaded,
    1000,
    "Timed out waiting for Odyssey to load",
  );
}

const props: AppProps = {
  prefersColorScheme,
};

const init = async () => {
  await waitForOdysseyWithTimeout();
  app = mount(App, {
    target: document.body,
    props: props,
  });
};

init();

export default app;
