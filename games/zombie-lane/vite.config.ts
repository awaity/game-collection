import { defineConfig } from 'vite';
export default defineConfig({ base: './', server: { host: '0.0.0.0', port: 4180, strictPort: true }, build: { target: 'es2020', outDir: 'dist/web' } });
