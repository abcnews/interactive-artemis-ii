/*

Main interactive entry-point

*/

// Global CSS styles
import "./styles/app.scss";

// Type imports
import type { ComponentProps } from "svelte";

// General imports
import { mount } from "svelte";
import { whenOdysseyLoaded, prefersColorScheme } from "@abcnews/env-utils";
import Timeout from "await-timeout";
import "./lib/inlineStyleText/";

// Component imports
import App from "./App.svelte";
import Fallback from "./Fallback.svelte";

const props: ComponentProps<typeof App> = {
  prefersColorScheme,
};

async function waitForOdysseyWithTimeout() {
  return Timeout.wrap(
    whenOdysseyLoaded,
    15000,
    "Timed out waiting for Odyssey to load. Please try again.",
  );
}

async function tryMount(target: HTMLElement) {
  try {
    await waitForOdysseyWithTimeout();

    return [
      null,
      mount(App, {
        target: target,
        props: props,
      }),
    ];
  } catch (error) {
    return [
      error,
      mount(Fallback, {
        target: target,
      }),
    ];
  }
}

const init = async () => {
  const [error, result] = await tryMount(document.body);
  if (error) console.error(error);
  return result;
};

const instance = init();
export default instance;

/*
  Development code

  Code for development that I don't necessarily need in production.
*/

// Threlte's useViewport throws an error on teardown during hot reload.
if (import.meta.env.DEV) {
  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason?.message?.includes("getWorldPosition")) {
      event.preventDefault(); // suppresses the console error
    }
  });
}
