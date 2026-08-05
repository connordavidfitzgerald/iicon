import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import type { HOME_PAGE_QUERY_RESULT } from '@root/sanity.types';

const builder = createImageUrlBuilder({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET
});

/**
 * Build a Sanity CDN URL for an image. Respects the hotspot/crop an editor set
 * in the Studio, and the CDN serves WebP/AVIF automatically when the browser
 * supports it — so there's no need to ask for a format.
 */
export function urlFor(source: SanityImageSource) {
    return builder.image(source).auto('format');
}

/**
 * Derived from the generated query types rather than hand-written, so it can't
 * drift out of sync with the `FIGURE` projection in queries.ts.
 */
export type SanityFigure = NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>['heroImage']>;

/**
 * A `srcset` across the widths the layout actually uses, so phones don't pull
 * down a 2400px file.
 */
const DEFAULT_WIDTHS = [480, 768, 1024, 1440, 1920, 2400];

export function buildSrcSet(source: SanityImageSource, widths: number[] = DEFAULT_WIDTHS) {
    return widths.map((width) => `${urlFor(source).width(width).url()} ${width}w`).join(', ');
}
