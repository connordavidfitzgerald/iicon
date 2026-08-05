import { defineField, defineType } from 'sanity';
import { CaseIcon } from '@sanity/icons/Case';

/**
 * One entry in the Services list on the home page. Hovering the name on desktop
 * (or tapping it on mobile) reveals the image and description below.
 */
export const service = defineType({
    name: 'service',
    title: 'Service',
    type: 'document',
    icon: CaseIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Service name',
            type: 'string',
            description: 'e.g. Product Sourcing',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
            description: 'The paragraph that appears beside the image. One or two sentences.',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'figure',
            description: 'Shown at a 4:3 ratio next to the service name.',
            validation: (rule) => rule.required()
        })
    ],
    preview: {
        select: { title: 'title', subtitle: 'description', media: 'image' }
    }
});
