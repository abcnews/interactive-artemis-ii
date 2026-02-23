/*

Main interactive entry-point

*/

// Global CSS styles
import "./app.css";

// Type imports
import type { ComponentProps } from "svelte";

// General imports
import { mount } from "svelte";
import {
  whenOdysseyLoaded,
  prefersColorScheme,
} from "@abcnews/env-utils";
import Timeout from "await-timeout";


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
