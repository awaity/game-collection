import { defineConfig } from "vite";
import {brandPlugin} from '../../packages/build-tools/src/brand.mjs';
export default defineConfig({
  plugins:[brandPlugin('飞机大战')],
  base: "./",
  build: { outDir: "dist/web", emptyOutDir: true },
});
