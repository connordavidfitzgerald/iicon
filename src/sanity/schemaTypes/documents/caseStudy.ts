import { defineArrayMember, defineField, defineType } from 'sanity';
import { ImagesIcon } from '@sanity/icons/Images';

/**
 * A project page, e.g. /mobile-tire. The thumbnail feeds the grids on the home
 * and Work pages; everything else renders on the project page itself.
 */
export const caseStudy = defineType({
    name: 'caseStudy',
    title: 'Case Study',
    type: 'document',
    icon: ImagesIcon,
    groups: [
        { name: 'content', title: 'Project', default: true },
        { name: 'media', title: 'Images' },
        { name: 'seo', title: 'SEO & Sharing' }
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Project name',
            type: 'string',
            group: 'content',
            description: 'The large heading on the project page, e.g. "Mobile Tire".',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'slug',
            title: 'Web address',
            type: 'slug',
            group: 'content',
            description:
                'The last part of the URL, e.g. "mobile-tire" gives iicon.ca/mobile-tire. Click Generate to build it from the project name. Changing this on a live project breaks any existing links to it.',
            options: {
                source: 'title',
                maxLength: 96,
                slugify: (input) =>
                    input
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '')
                        .slice(0, 96)
            },
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'disciplines',
            title: 'Disciplines',
            type: 'array',
            group: 'content',
            description:
                'The grey line under the project name. Shown in the order you arrange them here.',
            of: [
                defineArrayMember({
                    type: 'reference',
                    to: [{ type: 'discipline' }]
                })
            ],
            validation: (rule) => rule.required().min(1).unique()
        }),
        defineField({
            name: 'description',
            title: 'Project description',
            type: 'richText',
            group: 'content',
            description: 'The text in the grey panel. Each paragraph is spaced automatically.',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'recognitionLabel',
            title: 'Awards intro line',
            type: 'string',
            group: 'content',
            description:
                'Optional italic lead-in above the award list, e.g. "Winner of the:". Leave blank if there is only one award line.'
        }),
        defineField({
            name: 'recognition',
            title: 'Awards',
            type: 'array',
            group: 'content',
            description:
                'One line per award, e.g. "PPAI Silver Pyramid Award (International)". Leave empty if the project has none.',
            of: [defineArrayMember({ type: 'string' })]
        }),
        defineField({
            name: 'thumbnail',
            title: 'Thumbnail',
            type: 'figure',
            group: 'media',
            description:
                'The square image used in the project grids on the home and Work pages. It is shown in black and white until hovered, so pick something with strong contrast.',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'images',
            title: 'Project images',
            type: 'array',
            group: 'media',
            description:
                'The full-width images running down the right side of the project page, in this order. Drag to rearrange.',
            of: [defineArrayMember({ type: 'figure' })],
            options: { layout: 'grid' },
            validation: (rule) => rule.required().min(1)
        }),
        defineField({
            name: 'seo',
            title: 'SEO & Sharing',
            type: 'seo',
            group: 'seo'
        })
    ],
    preview: {
        select: {
            title: 'title',
            media: 'thumbnail',
            slug: 'slug.current',
            discipline0: 'disciplines.0.title',
            discipline1: 'disciplines.1.title'
        },
        prepare: ({ title, media, slug, discipline0, discipline1 }) => ({
            title,
            media,
            subtitle:
                [discipline0, discipline1].filter(Boolean).join(', ') ||
                (slug ? `/${slug}` : 'No disciplines set')
        })
    }
});
