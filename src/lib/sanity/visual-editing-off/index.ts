/**
 * Stand-in for `@sanity/astro/visual-editing` in builds with Visual Editing
 * off (see the alias in astro.config.ts). The real component shares modules
 * with the embedded Studio, and Astro's CSS graph follows those shared modules
 * and links the Studio's stylesheet — including its global reset — into every
 * page, even though the component renders nothing. Not importing it at all is
 * the only way to keep that CSS off the static site.
 */
export { default as VisualEditing } from './VisualEditing.astro';
