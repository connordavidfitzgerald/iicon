import { stegaClean } from '@sanity/client/stega';
import { urlFor, type SanityFigure } from './image';
import type { HOME_PAGE_QUERY_RESULT } from '@root/sanity.types';

/**
 * Derived from the generated query types so it always matches the `SEO`
 * projection in queries.ts. Every page's `seo` field has the same shape.
 *
 * `Partial` because pages may hand in a subset (the 404 route only sets
 * `hideFromSearch`), and every field is optional by design anyway.
 */
export type SanitySeo =
    Partial<NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>['seo']>> | null | undefined;

type Options = {
    /** The page's own SEO overrides. */
    seo: SanitySeo;
    /** Site Settings → Default SEO. Every blank field above falls back here. */
    defaults: SanitySeo;
    /** Fallback title when neither the page nor the defaults set one. */
    fallbackTitle?: string | null;
    siteName?: string | null;
    /** Absolute URL of the current page, for the canonical tag. */
    canonical: string;
};

function shareImageUrl(image: SanityFigure | null | undefined) {
    if (!image?.asset) return undefined;
    return urlFor(image).width(1200).height(630).fit('crop').url();
}

/**
 * Build the props for `astro-seo`.
 *
 * Everything here lands in `<head>`, so every value is run through
 * `stegaClean`. Stega's invisible characters are harmless in body copy — they
 * are what makes click-to-edit work — but in a title or meta description they
 * would be served to Google verbatim.
 */
export function resolveSeo({ seo, defaults, fallbackTitle, siteName, canonical }: Options) {
    const cleanSiteName = stegaClean(siteName ?? '');

    // An explicit SEO title is used verbatim. A page-supplied fallback (a case
    // study's project name, say) gets the business name appended so tabs and
    // search results stay recognisable.
    const explicitTitle = stegaClean(seo?.title ?? '');
    const composedFallback =
        fallbackTitle && cleanSiteName
            ? `${stegaClean(fallbackTitle)} | ${cleanSiteName}`
            : stegaClean(fallbackTitle ?? '');

    const title =
        explicitTitle || composedFallback || stegaClean(defaults?.title ?? '') || cleanSiteName;
    const description = stegaClean(seo?.description || defaults?.description || '');
    const image = shareImageUrl(seo?.shareImage) ?? shareImageUrl(defaults?.shareImage);
    const noindex = Boolean(seo?.hideFromSearch);

    return {
        title,
        description,
        canonical,
        noindex,
        nofollow: noindex,
        openGraph: {
            basic: {
                type: 'website',
                title,
                image: image ?? '',
                url: canonical
            },
            optional: {
                description,
                siteName: cleanSiteName
            }
        },
        twitter: {
            card: 'summary_large_image' as const,
            title,
            description,
            image,
            imageAlt: stegaClean(seo?.shareImage?.alt ?? defaults?.shareImage?.alt ?? '') || title
        },
        extend: {
            meta: [{ name: 'robots', content: noindex ? 'noindex,nofollow' : 'index,follow' }]
        }
    };
}
