import { defineField, defineType } from 'sanity';
import { ImageIcon } from '@sanity/icons/Image';

/**
 * An image plus its alt text. Used anywhere an image needs a description —
 * which is everywhere, for accessibility and SEO.
 */
export const figure = defineType({
    name: 'figure',
    title: 'Image',
    type: 'image',
    icon: ImageIcon,
    options: { hotspot: true },
    fields: [
        defineField({
            name: 'alt',
            title: 'Description (alt text)',
            type: 'string',
            description:
                'Describe what is in the image for screen readers and search engines, e.g. "Black embroidered work jacket laid flat".',
            validation: (rule) =>
                rule.required().warning('Every image should be described for accessibility.')
        })
    ],
    preview: {
        select: { media: 'asset', title: 'alt' },
        prepare: ({ media, title }) => ({ media, title: title || 'Image' })
    }
});
