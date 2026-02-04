<script lang="ts">
  import Portal from "svelte-portal";
  import Header from "./components/Header.svelte";
  import {
    loadDarkModeObserver,
    unloadDarkModeObserver,
    setMode
  } from "./lib/darkModeSwitcher";

  $effect(() => {
    setMode(document.documentElement.getAttribute("data-scheme") as string);
    loadDarkModeObserver();
    return () => unloadDarkModeObserver();
  });
</script>

<Portal target=".Header">
  <Header></Header>
</Portal>

<style lang="scss">
</style>
