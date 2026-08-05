import { defineArrayMember, defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons/User';

/**
 * The About page. Contact details are not repeated here — they come from Site
 * Settings so there is only one place to change them.
 */
export const aboutPage = defineType({
    name: 'aboutPage',
    title: 'About Page',
    type: 'document',
    icon: UserIcon,
    groups: [
        { name: 'content', title: 'Content', default: true },
        { name: 'seo', title: 'SEO & Sharing' }
    ],
    fields: [
        defineField({
            name: 'introLabel',
            title: 'Intro label',
            type: 'string',
            group: 'content',
            description: 'The small heading in the left column, currently "Information".',
            initialValue: 'Information',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'intro',
            title: 'Intro statement',
            type: 'text',
            rows: 6,
            group: 'content',
            description: 'The large paragraph at the top of the page.',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'valuesLabel',
            title: 'Values label',
            type: 'string',
            group: 'content',
            description: 'The small heading beside the values, currently "Our Values".',
            initialValue: 'Our Values',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'values',
            title: 'Values',
            type: 'array',
            group: 'content',
            description:
                'Each entry becomes one column beside the label. The layout fits two side by side.',
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'valueColumn',
                    title: 'Column',
                    fields: [
                        defineField({
                            name: 'body',
                            title: 'Text',
                            type: 'richText',
                            validation: (rule) => rule.required()
                        })
                    ],
                    preview: {
                        select: { body: 'body' },
                        prepare: ({ body }) => ({
                            title:
                                body?.[0]?.children
                                    ?.map((child: { text?: string }) => child.text)
                                    .join('') || 'Empty column'
                        })
                    }
                })
            ],
            validation: (rule) =>
                rule.max(2).warning('More than two columns will not fit the layout.')
        }),
        defineField({
            name: 'contactLabel',
            title: 'Contact label',
            type: 'string',
            group: 'content',
            description:
                'The small heading above the contact links, currently "Contact". The links themselves come from Site Settings.',
            initialValue: 'Contact',
            validation: (rule) => rule.required()
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
        prepare: () => ({ title: 'About Page' })
    }
});
