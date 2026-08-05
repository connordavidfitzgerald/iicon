# Sanity CMS — developer notes

Every word and image on iicon.ca comes from Sanity. There is no hard-coded page
content left in `src/pages`.

- **Project:** IICON — `rkp7m27a`, dataset `production`
- **Manage:** https://www.sanity.io/manage/project/rkp7m27a
- **Studio:** `/studio` on whatever origin the site is served from
  (`localhost:4321/studio` in development, `iicon.ca/studio` in production)

## How the pieces fit

```
src/sanity/                 Studio: schema, navigation, preview locations
  schemaTypes/              Content model (documents + reusable objects)
  structure.ts              Left-hand navigation and singleton wiring
  presentation.ts           Which page each document appears on
  env.ts                    Project coordinates for both Vite and the CLI
sanity.config.ts            Studio config — mounted at /studio by @sanity/astro
sanity.cli.ts               CLI config for schema extract + typegen

src/lib/sanity/
  queries.ts                Every GROQ query, one per page
  loadQuery.ts              Published vs. draft fetching, stega on/off
  image.ts                  Sanity CDN URL builder + srcset
  seo.ts                    Page SEO with Site Settings fallbacks
```

Pages fetch in their frontmatter and pass data down. Two components do the
repetitive work: `SanityImage.astro` (responsive `srcset`, LQIP placeholder,
hotspot-aware cropping) and `PortableText.astro` (rich text).

## The two build modes

`astro.config.ts` switches on one environment variable:

| `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` | Output   | Content   | Stega | Use             |
| :------------------------------------- | :------- | :-------- | :---- | :-------------- |
| unset / `false`                        | `static` | published | no    | **production**  |
| `true`                                 | `server` | drafts    | yes   | preview + local |

Production stays exactly as static as it was before the CMS landed — the same
prerendered HTML, no per-request Sanity call, and no invisible stega characters
in the markup. Visual Editing needs drafts resolved per request, so it can't be
static; that's why it lives on a separate deployment.

`resolveSeo()` runs every `<head>` value through `stegaClean`, so titles and meta
descriptions are safe even in the preview build. Verified: zero zero-width
characters inside `<head>` with Visual Editing on.

## Environment variables

Copy `.env.example` to `.env` for local work. `.env` is gitignored and holds a
real read token.

| Variable                               | Where                | Notes                                          |
| :------------------------------------- | :------------------- | :--------------------------------------------- |
| `PUBLIC_SANITY_PROJECT_ID`             | everywhere           | `rkp7m27a`                                     |
| `PUBLIC_SANITY_DATASET`                | everywhere           | `production`                                   |
| `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` | preview + local only | `true`                                         |
| `SANITY_API_READ_TOKEN`                | preview + local only | Viewer token. Server-only — never `PUBLIC_`.   |
| `PUBLIC_SANITY_PREVIEW_ORIGIN`         | production only      | URL of the preview deployment (see next steps) |

## Remaining setup

Three things need access to the Cloudflare account, so they're left for you:

1. **Preview deployment.** In Cloudflare Pages, set
   `PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true` and `SANITY_API_READ_TOKEN` on the
   **Preview** environment only. Production must not have them.
2. **Point the Studio at it.** Set `PUBLIC_SANITY_PREVIEW_ORIGIN` on the
   **Production** environment to the preview deployment's URL. Without this the
   Studio's Preview tab iframes the static production site, which shows published
   content with no click-to-edit. Locally this is unset and `same-origin` (the
   dev server) is correct.
3. **Rebuild on publish.** Create a Cloudflare Pages deploy hook, then add it in
   Sanity under Manage → API → Webhooks, triggered on create/update/delete for
   the `production` dataset. Publishing then redeploys the static site in a
   minute or two.

CORS origins for `localhost:4321`, `iicon.ca` and `www.iicon.ca` are already
registered.

## Working with the schema

```sh
npm run typegen   # regenerate schema.json + sanity.types.ts
```

Run this after any schema or query change — `sanity.types.ts` is what gives the
pages their types, and `astro check` will fail if it's stale. Both generated
files are committed so CI doesn't have to run typegen.

Two things to know when editing schema:

- **Icons.** `@sanity/icons` v5 only exports `Icon`/`icons` from the package
  root. Import individual icons from their subpath: `@sanity/icons/Star`, not
  `@sanity/icons`. The root import type-checks but breaks the Vite build.
- **Singletons** are enforced in `structure.ts` via `documentId`, not by any
  schema flag. `sanity.config.ts` also strips their create/duplicate/delete
  actions so a page document can't be removed by accident.

## Re-seeding

`scripts/seed.ts` is the original migration: it uploads the images from
`src/assets/images` and recreates every document. It's idempotent — collection
documents are matched on a stable field before being created and image assets
dedupe on their hash — but it does `createOrReplace` the five singletons, so
**running it again overwrites any edits made to the page documents in the
Studio.** It's kept for reference and for rebuilding a fresh dataset.

```sh
SANITY_WRITE_TOKEN=... npm run seed
```

It needs an Editor token; the only token that exists now is read-only, so create
a temporary one and delete it afterwards.
