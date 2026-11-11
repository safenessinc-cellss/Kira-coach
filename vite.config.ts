import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'KIRA 2.1 · by Safeness Inc.',
          short_name: 'KIRA 2.1',
          description: 'Ecosistema de bienestar, coaching e inteligencia artificial',
          theme_color: '#0B0F17',
          icons: [
            {
              src: '/images/11.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/images/11.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 15 * 1024 * 1024
        }
      })
    ],
    define: {
      'process.env': {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || "",
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: false,
      ws: false,
    },
  };
});
