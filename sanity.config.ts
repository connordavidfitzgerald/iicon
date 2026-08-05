import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';

import { schemaTypes, SINGLETON_TYPES } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';
import { resolve } from './src/sanity/presentation';
import { apiVersion, dataset, previewOrigin, projectId } from './src/sanity/env';

const singletons: string[] = [...SINGLETON_TYPES];

export default defineConfig({
    name: 'iicon',
    title: 'IICON Creative Strategies',
    projectId,
    dataset,

    plugins: [
        structureTool({ structure }),
        presentationTool({
            resolve,
            previewUrl: { origin: previewOrigin, preview: '/' }
        }),
        // Query playground. Hidden from the client below; useful for debugging.
        visionTool({ defaultApiVersion: apiVersion })
    ],

    schema: {
        types: schemaTypes,
        // Singletons are reachable only through the structure, so they must not
        // appear in the global "Create new" menu.
        templates: (prev) => prev.filter((template) => !singletons.includes(template.schemaType))
    },

    document: {
        // Remove Duplicate / Delete from singletons — there should only ever be
        // one, and deleting one would blank a page on the live site.
        actions: (prev, { schemaType }) =>
            singletons.includes(schemaType)
                ? prev.filter(
                      ({ action }) => !['duplicate', 'delete', 'unpublish'].includes(action ?? '')
                  )
                : prev
    },

    tools: (prev, { currentUser }) => {
        const isAdministrator = currentUser?.roles.some((role) => role.name === 'administrator');
        // Vision is a developer tool; keep it out of the way for editors.
        return isAdministrator ? prev : prev.filter((tool) => tool.name !== 'vision');
    }
});
