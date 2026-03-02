import icon from 'astro-icon';
import postcssUtopia from 'postcss-utopia';
import postcssHelpersFunctions from '@locomotivemtl/postcss-helpers-functions';
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';
import tailwindcss from '@tailwindcss/postcss';

import react from '@astrojs/react';
import sanity from '@sanity/astro';
import { defineConfig } from 'astro/config';
import { astroImageTools } from 'astro-imagetools';

const isProd = import.meta.env.PROD;

// https://astro.build/config
export default defineConfig({
    site: 'https://locomotive-astro-boilerplate.vercel.app',
    vite: {
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
        sanity({
            projectId: 'x5h383xf',
            dataset: 'production',
            // Set useCdn to false if you're building statically.
            useCdn: false
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
                name: 'Octave',
                cssVariable: '--custom-font-sans',
                fallbacks: ['sans-serif'],
                variants: [
                    {
                        weight: 400,
                        style: 'normal',
                        display: 'swap',
                        src: ['src/assets/fonts/Octave-Regular.woff2']
                    },
                    {
                        weight: 500,
                        style: 'normal',
                        display: 'swap',
                        src: ['src/assets/fonts/Octave-Medium.woff2']
                    }
                ]
            }
        ]
    }
});
