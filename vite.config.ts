import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import { loadingScript } from "vite-plugin-script-loader";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [svelte(), loadingScript(), tsconfigPaths()],
    server: {
      origin: "http://127.0.0.1:5173",
      cors: true,
    },
    base:
      command === "serve"
        ? "/"
        : "https://www.abc.net.au/res/sites/news-projects/interactive-artemis-ii/dist/",
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ["three", "@threlte/core", "@threlte/extras"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});
