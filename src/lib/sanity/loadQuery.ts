import type { QueryParams } from 'sanity';
import { sanityClient } from 'sanity:client';

/**
 * Visual Editing is a per-deploy switch (see astro.config.ts). When it's on we
 * build in server mode, read drafts with an authenticated token and let Sanity
 * embed the invisible stega markers that power click-to-edit. When it's off —
 * i.e. the production build — we fetch published content only, so nothing
 * unpublished and no stega characters can reach the live site.
 */
export const visualEditingEnabled = import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true';

const token = import.meta.env.SANITY_API_READ_TOKEN;

if (visualEditingEnabled && !token) {
    throw new Error(
        'SANITY_API_READ_TOKEN is required when PUBLIC_SANITY_VISUAL_EDITING_ENABLED is "true". ' +
            'Add it to .env, or set the visual editing flag to "false" for a plain static build.'
    );
}

export async function loadQuery<T>({
    query,
    params
}: {
    query: string;
    params?: QueryParams;
}): Promise<T> {
    const { result } = await sanityClient.fetch<T>(query, params ?? {}, {
        filterResponse: false,
        perspective: visualEditingEnabled ? 'drafts' : 'published',
        resultSourceMap: visualEditingEnabled ? 'withKeyArraySelector' : false,
        stega: visualEditingEnabled,
        ...(visualEditingEnabled ? { token } : {}),
        useCdn: false
    });

    return result;
}
