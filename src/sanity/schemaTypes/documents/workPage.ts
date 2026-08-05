import { defineArrayMember, defineField, defineType } from 'sanity';
import { ThLargeIcon } from '@sanity/icons/ThLarge';

/** The Work index at /work. Singleton. */
export const workPage = defineType({
    name: 'workPage',
    title: 'Work Page',
    type: 'document',
    icon: ThLargeIcon,
    groups: [
        { name: 'content', title: 'Content', default: true },
        { name: 'seo', title: 'SEO & Sharing' }
    ],
    fields: [
        defineField({
            name: 'heading',
            title: 'Page heading',
            type: 'string',
            group: 'content',
            initialValue: 'Selected Projects',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'projects',
            title: 'Projects',
            type: 'array',
            group: 'content',
            description:
                'Every project you want listed here, in this order. Anything left out still has its own page — it just will not appear in this grid. Drag to rearrange.',
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
        prepare: () => ({ title: 'Work Page' })
    }
});
