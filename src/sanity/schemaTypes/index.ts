import type { SchemaTypeDefinition } from 'sanity';

import { award } from './objects/award';
import { figure } from './objects/figure';
import { link } from './objects/link';
import { richText } from './objects/richText';
import { seo } from './objects/seo';

import { aboutPage } from './documents/aboutPage';
import { caseStudy } from './documents/caseStudy';
import { contactPage } from './documents/contactPage';
import { discipline } from './documents/discipline';
import { homePage } from './documents/homePage';
import { service } from './documents/service';
import { siteSettings } from './documents/siteSettings';
import { testimonial } from './documents/testimonial';
import { workPage } from './documents/workPage';

/** Documents that exist exactly once — see src/sanity/structure.ts. */
export const SINGLETON_TYPES = [
    'homePage',
    'aboutPage',
    'workPage',
    'contactPage',
    'siteSettings'
] as const;

export const schemaTypes: SchemaTypeDefinition[] = [
    // Pages
    homePage,
    aboutPage,
    workPage,
    contactPage,

    // Collections
    caseStudy,
    discipline,
    service,
    testimonial,

    // Global
    siteSettings,

    // Reusable building blocks
    award,
    figure,
    link,
    richText,
    seo
];
