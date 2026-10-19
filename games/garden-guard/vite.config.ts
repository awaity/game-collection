import { defineConfig } from 'vite';
import {brandPlugin} from '../../packages/build-tools/src/brand.mjs';
export default defineConfig({plugins:[brandPlugin('花园守卫')], base: './', build: { outDir: 'dist/web', target: 'es2020' }, server: { strictPort: true } });
