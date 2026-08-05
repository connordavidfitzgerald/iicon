import { defineQuery } from 'groq';

/**
 * Shared projections. Kept as plain string constants so Sanity TypeGen can
 * still resolve the finished query at build time.
 */
const FIGURE = `{
    alt,
    hotspot,
    crop,
    asset->{ _id, url, metadata { lqip, dimensions { width, height, aspectRatio } } }
}`;

const SEO = `{
    title,
    description,
    hideFromSearch,
    shareImage ${FIGURE}
}`;

const LINK = `{ label, href }`;

/** The shape the project grids need — used on both the home and Work pages. */
const PROJECT_CARD = `{
    _id,
    title,
    "slug": slug.current,
    thumbnail ${FIGURE},
    "disciplines": disciplines[]->title
}`;

export const SITE_SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
    siteName,
    navLinks[]{ _key, label, href },
    navCta ${LINK},
    email,
    phone,
    socialLinks[]{ _key, label, href },
    footerHeadline,
    form,
    defaultSeo ${SEO}
}`);

export const HOME_PAGE_QUERY = defineQuery(`*[_id == "homePage"][0]{
    heroImage ${FIGURE},

    approachLabel,
    approachStatement,
    approachImage ${FIGURE},
    approachBody,
    approachCta ${LINK},

    awardsLabel,
    awards[]{ _key, year, organization, title, category },

    testimonials[]->{ _id, quote, name, role },

    galleryImages[] ${FIGURE},

    servicesLabel,
    services[]->{ _id, title, description, image ${FIGURE} },

    projectsLabel,
    featuredProjects[]-> ${PROJECT_CARD},

    seo ${SEO}
}`);

export const ABOUT_PAGE_QUERY = defineQuery(`*[_id == "aboutPage"][0]{
    introLabel,
    intro,
    valuesLabel,
    values[]{ _key, body },
    contactLabel,
    seo ${SEO}
}`);

export const WORK_PAGE_QUERY = defineQuery(`*[_id == "workPage"][0]{
    heading,
    projects[]-> ${PROJECT_CARD},
    seo ${SEO}
}`);

export const CONTACT_PAGE_QUERY = defineQuery(`*[_id == "contactPage"][0]{
    seo ${SEO}
}`);

export const CASE_STUDY_SLUGS_QUERY = defineQuery(
    `*[_type == "caseStudy" && defined(slug.current)]{ "slug": slug.current }`
);

export const CASE_STUDY_QUERY = defineQuery(`*[_type == "caseStudy" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    "disciplines": disciplines[]->title,
    description,
    recognitionLabel,
    recognition,
    thumbnail ${FIGURE},
    images[] ${FIGURE},
    seo ${SEO}
}`);
