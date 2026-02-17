import { mount } from "svelte";
import "./app.css";

import App from "./App.svelte";
import { whenOdysseyLoaded } from "@abcnews/env-utils";
import Timeout from "await-timeout";
import { isMount, getMountValue, selectMounts } from "@abcnews/mount-utils";
import { Effect, Console } from "effect";

let app: any;

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
    props: { testing: true },
  });
};

init();


export default app;
