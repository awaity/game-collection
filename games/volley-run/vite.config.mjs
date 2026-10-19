import { defineConfig } from "vite";
import {brandPlugin} from '../../packages/build-tools/src/brand.mjs';

export default defineConfig({
  plugins:[brandPlugin('弹幕小队')],
  base: "./",
  build: {
    outDir: "dist/client",
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.js"],
    },
  },
});
