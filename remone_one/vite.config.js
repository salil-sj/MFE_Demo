import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remote_one',
      filename: 'remoteEntry.js',
      exposes: {
        './Remote': './src/components/Remote.jsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5173,
  }
});