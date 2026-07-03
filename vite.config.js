import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PredictoWC',
        short_name: 'PredictoWC',
        description: 'Lega Pronostici Mondiali',
        theme_color: '#121212',
        background_color: '#121212',
        display: 'standalone',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3268/3268594.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
