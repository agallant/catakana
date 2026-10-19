import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages serves the site from /catakana/. Override with BASE_PATH if hosted elsewhere.
const base = process.env.BASE_PATH ?? '/catakana/';

export default defineConfig(() => {
  const b = base;
  return {
    base: b,
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icons/*.png', 'icons/*.svg'],
        manifest: {
          name: 'Catakana — Learn Japanese with Cats',
          short_name: 'Catakana',
          description: 'A cat-themed adventure through Japan that teaches you Japanese.',
          lang: 'en',
          theme_color: '#ff8fa3',
          background_color: '#fff6ec',
          display: 'standalone',
          orientation: 'any',
          start_url: b,
          scope: b,
          categories: ['education', 'games'],
          icons: [
            { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,json,woff2}'],
          navigateFallback: `${b}index.html`,
          cleanupOutdatedCaches: true,
        },
      }),
    ],
    build: { target: 'es2020', sourcemap: false },
    test: { environment: 'jsdom', include: ['tests/**/*.test.ts'] },
  };
});
