import type { StructureBuilder, StructureResolver } from 'sanity/structure';
import { CaseIcon } from '@sanity/icons/Case';
import { CogIcon } from '@sanity/icons/Cog';
import { CommentIcon } from '@sanity/icons/Comment';
import { DocumentsIcon } from '@sanity/icons/Documents';
import { EnvelopeIcon } from '@sanity/icons/Envelope';
import { HomeIcon } from '@sanity/icons/Home';
import { ImagesIcon } from '@sanity/icons/Images';
import { TagIcon } from '@sanity/icons/Tag';
import { ThLargeIcon } from '@sanity/icons/ThLarge';
import { UserIcon } from '@sanity/icons/User';
import type { ComponentType } from 'react';

import { SINGLETON_TYPES } from './schemaTypes';

/**
 * A document that exists exactly once. Pinning `documentId` to the type name is
 * what makes it a singleton — there is no schema flag for this. The matching id
 * is what the front-end queries by (`*[_id == "homePage"][0]`).
 */
function singleton(
    S: StructureBuilder,
    type: (typeof SINGLETON_TYPES)[number],
    title: string,
    icon: ComponentType
) {
    return S.listItem()
        .title(title)
        .id(type)
        .icon(icon)
        .child(S.document().schemaType(type).documentId(type).title(title));
}

/**
 * Studio navigation. Ordered the way the site reads: pages first in the order
 * they appear in the menu, then the content that feeds them, then settings.
 */
export const structure: StructureResolver = (S) =>
    S.list()
        .title('IICON')
        .items([
            singleton(S, 'homePage', 'Home Page', HomeIcon),
            singleton(S, 'aboutPage', 'About Page', UserIcon),
            singleton(S, 'workPage', 'Work Page', ThLargeIcon),
            singleton(S, 'contactPage', 'Contact Page', EnvelopeIcon),

            S.divider(),

            S.listItem()
                .title('Case Studies')
                .id('caseStudies')
                .icon(DocumentsIcon)
                .child(
                    S.list()
                        .title('Case Studies')
                        .items([
                            S.documentTypeListItem('caseStudy')
                                .title('All Case Studies')
                                .icon(ImagesIcon),
                            S.divider(),
                            S.documentTypeListItem('discipline').title('Disciplines').icon(TagIcon)
                        ])
                ),

            S.documentTypeListItem('service').title('Services').icon(CaseIcon),
            S.documentTypeListItem('testimonial').title('Testimonials').icon(CommentIcon),

            S.divider(),

            singleton(S, 'siteSettings', 'Site Settings', CogIcon)
        ]);

/**
 * Anything not explicitly placed above would otherwise show up twice, and the
 * singletons must never be listed as creatable collections.
 */
export const HIDDEN_FROM_CREATION = [...SINGLETON_TYPES];

/** Every type that already has a home in the structure above. */
export const PLACED_TYPES = [
    ...SINGLETON_TYPES,
    'caseStudy',
    'discipline',
    'service',
    'testimonial'
];
