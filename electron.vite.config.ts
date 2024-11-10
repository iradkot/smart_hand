import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    resolve: {
      alias: {
        src: resolve(__dirname, 'src')
      }
    },
    plugins: [externalizeDepsPlugin()],
    build: {
      sourcemap: true, // Enable source maps for main
      outDir: 'out/main'
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      sourcemap: true, // Enable source maps for main
      outDir: 'out/preload'
    }
  },
  renderer: {
    resolve: {
      alias: {
        src: resolve(__dirname, 'src')
      }
    },
    plugins: [react()],
    build: {
      sourcemap: true, // Enable source maps for renderer
      outDir: 'out/renderer'
    }
  }
});
