import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import { loadingScript } from "vite-plugin-script-loader";
import tsconfigPaths from "vite-tsconfig-paths";

// IMPORTANT: Change this on every release
const VERSION = "1.0.8";

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
        : `https://www.abc.net.au/res/sites/news-projects/interactive-artemis-ii/${VERSION}/`,
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
    resolve: {
      dedupe: ["three"],
    },
  };
});
