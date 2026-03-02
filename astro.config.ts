import icon from 'astro-icon';
import postcssUtopia from 'postcss-utopia';
import postcssHelpersFunctions from '@locomotivemtl/postcss-helpers-functions';
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';
import tailwindcss from '@tailwindcss/postcss';

import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path from 'path';

import cloudflare from '@astrojs/cloudflare';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://locomotive-astro-boilerplate.vercel.app',

  vite: {
      resolve: {
          alias: {
              '@lib': path.resolve(__dirname, './src/lib')
          }
      },
      css: {
          postcss: {
              plugins: [
                  tailwindcss(),
                  postcssUtopia({
                      minWidth: 320,
                      maxWidth: 1920,
                      minSize: 12,
                      maxSize: 18,
                      positiveSteps: [1.5, 2, 3, 4, 6],
                      negativeSteps: [0.75, 0.5, 0.25],
                      customSizes: ['s-l'],
                      prefix: 'space',
                      relativeTo: 'container'
                  }),
                  postcssHelpersFunctions(),
                  postcssTailwindShortcuts()
              ]
          }
      }
  },

  integrations: [
      icon({
          iconDir: './src/assets/svgs'
      }),
      react()
  ],

  devToolbar: {
      enabled: false
  },

  image: {
      domains: ['locomotive.ca'],
      remotePatterns: [{ protocol: 'https' }]
  },

  experimental: {
      fonts: [
          {
              provider: 'local',
              name: 'ABC Monument Grotesk',
              cssVariable: '--custom-font-sans',
              fallbacks: ['sans-serif'],
              variants: [
                  {
                      weight: 400,
                      style: 'normal',
                      display: 'swap',
                      src: ['./src/assets/fonts/ABCMonumentGrotesk-Regular.ttf']
                  },
                  {
                      weight: 500,
                      style: 'normal',
                      display: 'swap',
                      src: ['./src/assets/fonts/ABCMonumentGrotesk-Medium.ttf']
                  }
              ]
          }
      ]
  },

  adapter: cloudflare()
});