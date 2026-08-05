import { defineArrayMember, defineField, defineType } from 'sanity';
import { HomeIcon } from '@sanity/icons/Home';

/** The home page, top to bottom. Singleton. */
export const homePage = defineType({
    name: 'homePage',
    title: 'Home Page',
    type: 'document',
    icon: HomeIcon,
    groups: [
        { name: 'hero', title: 'Hero', default: true },
        { name: 'approach', title: 'Our Approach' },
        { name: 'awards', title: 'Awards' },
        { name: 'testimonials', title: 'Testimonials' },
        { name: 'gallery', title: 'Photo Strip' },
        { name: 'services', title: 'Services' },
        { name: 'projects', title: 'Projects' },
        { name: 'seo', title: 'SEO & Sharing' }
    ],
    fields: [
        defineField({
            name: 'heroImage',
            title: 'Hero image',
            type: 'figure',
            group: 'hero',
            description: 'The full-height image directly under the logo.',
            validation: (rule) => rule.required()
        }),

        defineField({
            name: 'approachLabel',
            title: 'Section label',
            type: 'string',
            group: 'approach',
            description: 'The small sticky heading, currently "Our Approach".',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'approachStatement',
            title: 'Opening statement',
            type: 'text',
            rows: 4,
            group: 'approach',
            description: 'The large paragraph that animates in line by line.',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'approachImage',
            title: 'Section image',
            type: 'figure',
            group: 'approach',
            description: 'The wide landscape image below the opening statement.',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'approachBody',
            title: 'Supporting paragraph',
            type: 'text',
            rows: 4,
            group: 'approach',
            description: 'The smaller paragraph to the left of the button.',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'approachCta',
            title: 'Button',
            type: 'link',
            group: 'approach',
            description: 'Currently "Learn More", pointing at /about.',
            validation: (rule) => rule.required()
        }),

        defineField({
            name: 'awardsLabel',
            title: 'Section label',
            type: 'string',
            group: 'awards',
            initialValue: 'Awards',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'awards',
            title: 'Awards',
            type: 'array',
            group: 'awards',
            description: 'One row per award, newest first. Drag to rearrange.',
            of: [defineArrayMember({ type: 'award' })]
        }),

        defineField({
            name: 'testimonials',
            title: 'Testimonials',
            type: 'array',
            group: 'testimonials',
            description:
                'The quotes that fade in and out in the grey panel, one every twelve seconds. Drag to change the order.',
            of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })],
            validation: (rule) => rule.unique()
        }),

        defineField({
            name: 'galleryImages',
            title: 'Photo strip',
            type: 'array',
            group: 'gallery',
            description:
                'The images that scroll sideways across the page. They loop continuously, so any number works — five to ten looks best.',
            of: [defineArrayMember({ type: 'figure' })],
            options: { layout: 'grid' }
        }),

        defineField({
            name: 'servicesLabel',
            title: 'Section label',
            type: 'string',
            group: 'services',
            initialValue: 'Services',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'services',
            title: 'Services',
            type: 'array',
            group: 'services',
            description: 'Shown in this order. Drag to rearrange.',
            of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
            validation: (rule) => rule.unique()
        }),

        defineField({
            name: 'projectsLabel',
            title: 'Section label',
            type: 'string',
            group: 'projects',
            initialValue: 'Selected Projects',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'featuredProjects',
            title: 'Featured projects',
            type: 'array',
            group: 'projects',
            description:
                'The projects shown on the home page. The desktop grid fits them two across, so an even number looks best. Drag to rearrange.',
            of: [defineArrayMember({ type: 'reference', to: [{ type: 'caseStudy' }] })],
            validation: (rule) => rule.unique()
        }),

        defineField({
            name: 'seo',
            title: 'SEO & Sharing',
            type: 'seo',
            group: 'seo',
            options: { collapsible: false }
        })
    ],
    preview: {
        select: { media: 'heroImage' },
        prepare: ({ media }) => ({ title: 'Home Page', media })
    }
});
