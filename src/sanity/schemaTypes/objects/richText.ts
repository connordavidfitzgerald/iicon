import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Deliberately restricted rich text: paragraphs, bold, italic and links.
 *
 * Headings, lists and images are left out on purpose — the site's typography is
 * set by the design, so letting editors introduce heading levels here would
 * break the visual rhythm rather than help.
 */
export const richText = defineType({
    name: 'richText',
    title: 'Text',
    type: 'array',
    of: [
        defineArrayMember({
            type: 'block',
            styles: [{ title: 'Paragraph', value: 'normal' }],
            lists: [],
            marks: {
                decorators: [
                    { title: 'Bold', value: 'strong' },
                    { title: 'Italic', value: 'em' }
                ],
                annotations: [
                    defineArrayMember({
                        name: 'link',
                        title: 'Link',
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'href',
                                title: 'Destination',
                                type: 'string',
                                description:
                                    'A path on this site (e.g. /work) or a full address (e.g. https://example.com).',
                                validation: (rule) => rule.required()
                            })
                        ]
                    })
                ]
            }
        })
    ]
});
