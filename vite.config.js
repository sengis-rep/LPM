import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Lotus Premium Mart',
        short_name: 'LPM',
        theme_color: '#ffffff',
        display: 'standalone', // Hides the browser bar so it looks native
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  server: {
    fs: {
      // Allows Vite to read files one directory up (your new shared folder)
      allow: ['..']
    }
  }
});