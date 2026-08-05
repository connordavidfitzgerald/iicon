import { defineField, defineType } from 'sanity';
import { CommentIcon } from '@sanity/icons/Comment';

/**
 * A client quote. The home page rotates through whichever ones are selected
 * there, one every twelve seconds.
 */
export const testimonial = defineType({
    name: 'testimonial',
    title: 'Testimonial',
    type: 'document',
    icon: CommentIcon,
    fields: [
        defineField({
            name: 'quote',
            title: 'Quote',
            type: 'text',
            rows: 6,
            description:
                'Type the quote without surrounding quotation marks — those are added automatically.',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'name',
            title: 'Who said it',
            type: 'string',
            description: 'e.g. Marquisa Zrymiak',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'role',
            title: 'Their role and company',
            type: 'string',
            description: 'e.g. Employee Experience Coordinator at Janeapp',
            validation: (rule) => rule.required()
        })
    ],
    preview: {
        select: { title: 'name', role: 'role', quote: 'quote' },
        prepare: ({ title, role, quote }) => ({
            title: `${title}${role ? ` — ${role}` : ''}`,
            subtitle: quote
        })
    }
});
