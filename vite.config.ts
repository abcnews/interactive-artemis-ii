import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    cors: true,
  },
  build: {
    rollupOptions: {
      output: {
        dir: "dist",
        entryFileNames: "[name].js",
        format: "iife",
        name: "artemis2", // global variable name
      },
    },
  },
});
