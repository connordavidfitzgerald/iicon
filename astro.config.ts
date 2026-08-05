import icon from 'astro-icon';
import postcssUtopia from 'postcss-utopia';
import postcssHelpersFunctions from '@locomotivemtl/postcss-helpers-functions';
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';
import tailwindcss from '@tailwindcss/postcss';

import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';
import path from 'path';

import sitemap from '@astrojs/sitemap';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// astro.config.ts runs before Astro loads .env, so read the same PUBLIC_*
// variables the pages use via Vite's loader.
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, PUBLIC_SANITY_VISUAL_EDITING_ENABLED } =
    loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

const visualEditingEnabled = PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true';

// https://astro.build/config
export default defineConfig({
    adapter: cloudflare(),
    site: 'https://iicon.ca',
    // Visual Editing needs draft content resolved per-request, so the preview
    // deploy renders on demand. Production leaves the flag off and stays static.
    output: visualEditingEnabled ? 'server' : 'static',
    redirects: {
        // The old page lived at a mixed-case path; the Sanity slug is lowercase.
        '/thirty6Xposures': '/thirty6xposures'
    },
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
                        maxWidth: 2560,
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
        sanity({
            projectId: PUBLIC_SANITY_PROJECT_ID,
            dataset: PUBLIC_SANITY_DATASET,
            apiVersion: '2026-08-05',
            // The CDN can't serve drafts, and static builds want fresh content.
            useCdn: false,
            // Client-facing Studio: iicon.ca/studio
            studioBasePath: '/studio',
            stega: {
                studioUrl: '/studio'
            }
        }),
        react(),
        sitemap({
            // The Studio is a private admin route, not a page for Google.
            filter: (page) => !page.includes('/studio'),
            // Astro's directory format appends a slash; drop it so sitemap
            // entries match the canonical URLs in each page's <head>.
            serialize: (item) => ({ ...item, url: item.url.replace(/(.+)\/$/, '$1') })
        })
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
    }
});
