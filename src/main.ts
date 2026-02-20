// Global CSS styles
import "./app.css";

// General imports
import { mount } from "svelte";
import {
  getApplication,
  whenOdysseyLoaded,
  prefersColorScheme,
} from "@abcnews/env-utils";
import Timeout from "await-timeout";
import { isMount, getMountValue, selectMounts } from "@abcnews/mount-utils";
import type { ComponentProps } from "svelte";

// Component imports
import App from "./App.svelte";

const props: ComponentProps<typeof App> = {
  prefersColorScheme,
};

let app;

async function waitForOdysseyWithTimeout() {
  return Timeout.wrap(
    whenOdysseyLoaded,
    5000,
    "Timed out waiting for Odyssey to load",
  );
}

const init = async () => {
  await waitForOdysseyWithTimeout();
  app = mount(App, {
    target: document.body,
    props: props,
  });
};

init();

export default app;
