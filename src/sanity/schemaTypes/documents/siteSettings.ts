import { defineArrayMember, defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons/Cog';

/**
 * Site-wide content: the things that appear on every page. Singleton — there is
 * only ever one of these, locked to the id "siteSettings" by the Studio
 * structure.
 */
export const siteSettings = defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    icon: CogIcon,
    groups: [
        { name: 'general', title: 'General', default: true },
        { name: 'navigation', title: 'Navigation' },
        { name: 'contact', title: 'Contact & Social' },
        { name: 'footer', title: 'Footer' },
        { name: 'seo', title: 'Default SEO' }
    ],
    fields: [
        defineField({
            name: 'siteName',
            title: 'Business name',
            type: 'string',
            group: 'general',
            description: 'Used in browser tabs and when pages are shared.',
            validation: (rule) => rule.required()
        }),

        defineField({
            name: 'navLinks',
            title: 'Menu links',
            type: 'array',
            group: 'navigation',
            description: 'The links beside the logo, in this order. Drag to rearrange.',
            of: [defineArrayMember({ type: 'link' })],
            validation: (rule) => rule.required().min(1)
        }),
        defineField({
            name: 'navCta',
            title: 'Right-hand link',
            type: 'link',
            group: 'navigation',
            description: 'The link on the far right of the menu, currently "Get in touch".',
            validation: (rule) => rule.required()
        }),

        defineField({
            name: 'email',
            title: 'Email address',
            type: 'string',
            group: 'contact',
            description: 'Shown in the footer and on the About page.',
            validation: (rule) => rule.required().email()
        }),
        defineField({
            name: 'phone',
            title: 'Phone number',
            type: 'string',
            group: 'contact',
            description: 'Displayed exactly as you type it, e.g. +1 416 509 4715.',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social profiles',
            type: 'array',
            group: 'contact',
            description: 'Listed on the About page. Drag to rearrange.',
            of: [defineArrayMember({ type: 'link' })]
        }),

        defineField({
            name: 'footerHeadline',
            title: 'Footer headline',
            type: 'text',
            rows: 2,
            group: 'footer',
            description:
                'The large text above the contact form. Press Enter to control where the line breaks.',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'form',
            title: 'Contact form labels',
            type: 'object',
            group: 'footer',
            options: { collapsible: true, collapsed: true },
            description: 'The wording of the form beside the footer headline.',
            fields: [
                defineField({
                    name: 'nameLabel',
                    title: 'Name question',
                    type: 'string',
                    initialValue: "What's your name?*"
                }),
                defineField({
                    name: 'emailLabel',
                    title: 'Email question',
                    type: 'string',
                    initialValue: 'Your email*'
                }),
                defineField({
                    name: 'messageLabel',
                    title: 'Message question',
                    type: 'string',
                    initialValue: 'What did you have in mind?*'
                }),
                defineField({
                    name: 'submitLabel',
                    title: 'Button text',
                    type: 'string',
                    initialValue: 'Submit'
                })
            ]
        }),

        defineField({
            name: 'defaultSeo',
            title: 'Default SEO & Sharing',
            type: 'seo',
            group: 'seo',
            description:
                'Used on any page that has not set its own. The share image here is the fallback for the whole site.',
            options: { collapsible: false }
        })
    ],
    preview: {
        prepare: () => ({ title: 'Site Settings' })
    }
});
