import { defineField, defineType } from 'sanity';
import { LinkIcon } from '@sanity/icons/Link';

/** A labelled link — used for nav items and buttons. */
export const link = defineType({
    name: 'link',
    title: 'Link',
    type: 'object',
    icon: LinkIcon,
    fields: [
        defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            description: 'The words people click on.',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'href',
            title: 'Destination',
            type: 'string',
            description:
                'A path on this site (e.g. /about) or a full address for an external site (e.g. https://instagram.com/…).',
            validation: (rule) =>
                rule.required().custom((value) => {
                    if (!value) return 'Required';
                    if (/^(\/|https?:\/\/|mailto:|tel:)/.test(value)) return true;
                    return 'Start with / for a page on this site, or https:// for an external link.';
                })
        })
    ],
    preview: {
        select: { title: 'label', subtitle: 'href' }
    }
});
