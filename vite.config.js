import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    cssMinify: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
