/**
 * Project coordinates, resolved for both worlds this config runs in:
 * Vite (the embedded Studio, where only `import.meta.env` exists) and plain
 * Node (the `sanity` CLI running schema extract / typegen, where only
 * `process.env` does).
 */
function readEnv(key: string): string | undefined {
    const viteValue = (import.meta as { env?: Record<string, string | undefined> }).env?.[key];
    if (viteValue) return viteValue;

    if (typeof process !== 'undefined' && process.env?.[key]) return process.env[key];

    return undefined;
}

export const projectId = readEnv('PUBLIC_SANITY_PROJECT_ID') ?? 'rkp7m27a';
export const dataset = readEnv('PUBLIC_SANITY_DATASET') ?? 'production';
export const apiVersion = '2026-08-05';

/**
 * Where the Presentation tool loads the site preview from.
 *
 * Production is a static build with drafts and overlays switched off, so the
 * Studio hosted there has to preview a deployment that has them on. Locally
 * `same-origin` is exactly right — `astro dev` is that deployment.
 */
export const previewOrigin = readEnv('PUBLIC_SANITY_PREVIEW_ORIGIN') ?? 'same-origin';
