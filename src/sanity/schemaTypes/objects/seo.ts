import { defineField, defineType } from 'sanity';
import { SearchIcon } from '@sanity/icons/Search';

/**
 * Per-page search + social overrides. Every field is optional: anything left
 * blank falls back to the matching value in Site Settings.
 */
export const seo = defineType({
    name: 'seo',
    title: 'SEO & Sharing',
    type: 'object',
    icon: SearchIcon,
    options: { collapsible: true, collapsed: true },
    fields: [
        defineField({
            name: 'title',
            title: 'Browser / search title',
            type: 'string',
            description:
                'Shown in the browser tab and as the headline in Google results. Aim for under 60 characters. Leave blank to use the page title.',
            validation: (rule) =>
                rule.max(60).warning('Titles over 60 characters get cut off in search results.')
        }),
        defineField({
            name: 'description',
            title: 'Search description',
            type: 'text',
            rows: 3,
            description:
                'The grey summary text under the link in Google. Aim for 120–160 characters.',
            validation: (rule) =>
                rule
                    .max(160)
                    .warning('Descriptions over 160 characters get cut off in search results.')
        }),
        defineField({
            name: 'shareImage',
            title: 'Social share image',
            type: 'figure',
            description:
                'Used when this page is shared on LinkedIn, Facebook or in messages. Best at 1200 × 630 pixels. Leave blank to use the site-wide default.'
        }),
        defineField({
            name: 'hideFromSearch',
            title: 'Hide this page from search engines',
            type: 'boolean',
            description: 'Turn on to ask Google not to list this page.',
            initialValue: false
        })
    ]
});
