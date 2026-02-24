/*

Main interactive entry-point

*/

// Global CSS styles
import "./app.css";

// Type imports
import type { ComponentProps } from "svelte";

// General imports
import { mount } from "svelte";
import { whenOdysseyLoaded, prefersColorScheme } from "@abcnews/env-utils";
import Timeout from "await-timeout";

// Component imports
import App from "./App.svelte";
import Fallback from "./Fallback.svelte";

const props: ComponentProps<typeof App> = {
  prefersColorScheme,
};

async function waitForOdysseyWithTimeout() {
  return Timeout.wrap(
    whenOdysseyLoaded,
    1,
    "Timed out waiting for Odyssey to load",
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
