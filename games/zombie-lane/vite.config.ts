import { defineConfig } from 'vite';
import {brandPlugin} from '../../packages/build-tools/src/brand.mjs';
export default defineConfig({plugins:[brandPlugin('尸潮防线')], base: './', server: { host: '0.0.0.0', port: 4180, strictPort: true }, build: { target: 'es2020', outDir: 'dist/web' } });
