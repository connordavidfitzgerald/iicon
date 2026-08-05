import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
    api: {
        projectId: 'rkp7m27a',
        dataset: 'production'
    },
    typegen: {
        // Regenerate sanity.types.ts from the schema + every defineQuery in src.
        path: './src/**/*.{ts,tsx,astro}',
        schema: 'schema.json',
        generates: './sanity.types.ts'
    }
});
