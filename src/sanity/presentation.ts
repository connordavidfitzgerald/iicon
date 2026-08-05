import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation';

/**
 * Tells the Presentation tool which page(s) each document shows up on, so the
 * editor gets an "Open preview" shortcut from the form and the right page loads
 * when they jump between editing and previewing.
 */
export const resolve: PresentationPluginOptions['resolve'] = {
    locations: {
        homePage: defineLocations({
            select: {},
            resolve: () => ({ locations: [{ title: 'Home', href: '/' }] })
        }),
        aboutPage: defineLocations({
            select: {},
            resolve: () => ({ locations: [{ title: 'About', href: '/about' }] })
        }),
        workPage: defineLocations({
            select: {},
            resolve: () => ({ locations: [{ title: 'Work', href: '/work' }] })
        }),
        contactPage: defineLocations({
            select: {},
            resolve: () => ({ locations: [{ title: 'Contact', href: '/contact' }] })
        }),
        caseStudy: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
                locations: [
                    { title: doc?.title || 'Untitled project', href: `/${doc?.slug}` },
                    { title: 'Work', href: '/work' },
                    { title: 'Home', href: '/' }
                ]
            })
        }),
        service: defineLocations({
            select: {},
            resolve: () => ({ locations: [{ title: 'Home', href: '/' }] })
        }),
        testimonial: defineLocations({
            select: {},
            resolve: () => ({ locations: [{ title: 'Home', href: '/' }] })
        }),
        discipline: defineLocations({
            select: {},
            resolve: () => ({
                locations: [
                    { title: 'Work', href: '/work' },
                    { title: 'Home', href: '/' }
                ]
            })
        }),
        siteSettings: defineLocations({
            select: {},
            resolve: () => ({
                locations: [
                    { title: 'Home', href: '/' },
                    { title: 'About', href: '/about' },
                    { title: 'Work', href: '/work' },
                    { title: 'Contact', href: '/contact' }
                ]
            })
        })
    }
};
