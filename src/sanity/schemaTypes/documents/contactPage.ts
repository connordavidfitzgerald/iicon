import { defineField, defineType } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons/Envelope';

/**
 * The Contact page at /contact. The page itself is just the menu and the
 * footer's contact form, so the only thing to manage here is how it appears in
 * search results and when shared.
 */
export const contactPage = defineType({
    name: 'contactPage',
    title: 'Contact Page',
    type: 'document',
    icon: EnvelopeIcon,
    fields: [
        defineField({
            name: 'seo',
            title: 'SEO & Sharing',
            type: 'seo',
            description:
                'The contact form, email and phone number on this page are edited under Site Settings → Footer and Contact & Social.',
            options: { collapsible: false }
        })
    ],
    preview: {
        prepare: () => ({ title: 'Contact Page' })
    }
});
