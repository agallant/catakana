import { execSync } from 'node:child_process';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

// CI sets BASE_PATH to the path the site is served from (/catakana/ on main,
// /catakana/pr-preview/pr-<N>/ for PR previews). Local dev serves from /.
const trimmed = (process.env.BASE_PATH ?? '').trim().replace(/^\/+|\/+$/g, '');
const base = trimmed ? `/${trimmed}/` : '/';

// Shown in Settings so it's clear which build a device is running.
function localSha(): string {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return 'unknown';
  }
}
const buildSha = (process.env.BUILD_SHA?.trim() || localSha()).slice(0, 7);
const buildLabel = process.env.BUILD_LABEL?.trim() || 'dev';

export default defineConfig(() => {
  const b = base;
  return {
    base: b,
    define: {
      __BUILD_SHA__: JSON.stringify(buildSha),
      __BUILD_LABEL__: JSON.stringify(buildLabel),
    },
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
          // PR previews live under the live site's scope; never answer them with the live app.
          navigateFallbackDenylist: [/\/pr-preview\//],
          cleanupOutdatedCaches: true,
        },
      }),
    ],
    build: { target: 'es2020', sourcemap: false },
    test: { environment: 'jsdom', include: ['tests/**/*.test.ts'] },
  };
});
