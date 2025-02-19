import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import alias from "@rollup/plugin-alias";
import { resolve } from "path";

const projectRootDir = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    alias({
      entries: [
        {
          find: "@",
          replacement: resolve(projectRootDir, "src"),
        },
      ],
    }),
  ],
  build: {
    lib: {
      name: "radix-vue",
      fileName: "index",
      entry: resolve(__dirname, "src/index.ts"),
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === "style.css") return "index.css";
          return chunkInfo.name as string;
        },
      },
    },
  },
});
