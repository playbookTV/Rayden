# Rayden marketing website

The marketing site lives separately from the Nextra documentation in `packages/docs`.

Run `pnpm website` from the repository root, or `node server.mjs` here. The preview opens at `http://127.0.0.1:3002`; set `PORT` to change it.

## Editing

- `dist/index.html`: page content and semantic layout.
- `dist/styles.css`: graphite/copper visual system, responsive layouts, interaction states, and reduced-motion handling.
- `dist/app.js`: interactive component concepts, theme controls, calendar, search, filters, dialogs, and starter commands.
- `dist/assets`: original Rayden brand mark, locally hosted open-source fonts and licenses, and an original generated copper/glass artwork.

The marketing pages are authored static HTML. The showcase uses an isolated build for its real React previews. The authored `dist` folder is tracked and is the deployable output. `pnpm website:check` validates JavaScript syntax and SEO consistency.

The homepage interactive UI concepts and starter illustrations are custom website demos, not embedded instances or screenshots of the published React components/templates. Links lead to the actual documentation. Starter selectors generate real `create-rayden-app` commands. The AI section explains the companion package and does not call an AI service. Activity numbers and names are illustrative.

All demonstration interactions run locally. Only the theme Save control writes session preferences. There is no analytics, account creation, remote form submission, or actual project deployment from the demo controls.

## Hosting

The production marketing site uses the existing Vercel project `rayden-web` in `leslie-layrznets-projects`, serving `www.rayden-ui.dev` and `rayden-ui.dev`. Deploy this package as the project root; `vercel.json` serves `dist` as static assets without a build or dependency installation.

`.openai/hosting.json` identifies a separate private review site. Publishing that review site does not deploy the production marketing website. Documentation uses the separate Vercel project `rayden-docs`.

## References

React Bits informed the interactive opening; Appica the layered component showcase; UIAble the progression into starter layouts; TentUI the tactile control details. No reference-site code or branded artwork is included. The artwork in `assets/copper-glass.jpg` was generated specifically for this site.

## Search and AI discovery

The canonical public URL is `https://www.rayden-ui.dev/`. The homepage includes descriptive metadata, Open Graph/Twitter previews, and linked Organization, WebSite, WebPage, SoftwareSourceCode, and FAQPage JSON-LD. FAQ schema must match the visible answers exactly. There are no fabricated ratings or ranking claims. FAQ markup is semantic context, not a promise of a Google FAQ rich result.

- `dist/robots.txt` allows public crawling and explicitly allows OAI-SearchBot. No existing training-crawler opt-out was changed.
- `dist/sitemap.xml` lists the canonical homepage, published guides, gallery and showcase detail pages. Update `lastmod` when meaningful public content changes, not on every unrelated deployment. Documentation has its own host and is not included in this sitemap.
- `dist/llms.txt` is a concise index linking to maintained documentation and the existing component catalog. It is useful for clients that support it; Google does not use it as a ranking signal.
- `dist/indexnow-key.txt` is the publicly served ownership file for IndexNow notifications. It grants no account or deployment access. Use its contents with `keyLocation` when notifying participating engines of a changed canonical URL; do not add it to the sitemap.
- Vercel redirects `/index.html` to `/`. The existing apex-domain redirect is managed by Vercel. Canonical tags consolidate any other URL variants.
- The same Manrope and Hanken Grotesk families now load from two Latin variable WOFF2 files. Original TTF assets and licenses are retained for provenance; the site no longer requests the TTFs.

Run `pnpm website:check` for syntax and SEO consistency checks. After deployment, check the canonical URL, robots/sitemap/llms responses, schema, and redirects. Submit the sitemap through verified Google Search Console and Bing Webmaster Tools properties and monitor actual query impressions, clicks, and citations. IndexNow acknowledgement is not confirmation of indexing or ranking.

Guidance used: Google Search Essentials and AI optimization guidance, Bing Webmaster Guidelines, OpenAI crawler documentation, Schema.org, and the IndexNow protocol.

## Next.js guide

`dist/guides/nextjs.html` is served at `/guides/nextjs` using Vercel clean URLs. The article shares the homepage brand and typefaces; its additional styles and copy controls live in `dist/guide.css` and `dist/guide.js`.

Edit `scripts/build-nextjs-guide.py` for article text and `examples/nextjs-profile` for example source. The script copies source verbatim into the article and creates the downloadable ZIP. Run `python3 packages/website/scripts/build-nextjs-guide.py` from the repository root after changes. Update the article date only for substantive edits.

The example uses pinned published dependencies and a committed npm lockfile. Test it in an isolated folder with `npm ci` and `npm run build`; do not add its dependencies to the main workspace. `dist/assets/nextjs-profile.png` is an actual screenshot of the runnable example. The profile form stores demo state only in memory.

## Rayden AI guide

Edit `scripts/build-rayden-ai-guide.py`, then run it with Python 3 to regenerate `dist/guides/rayden-ai.html`. The article uses the shared guide CSS and copy controls, links to the Next.js guide, and is listed in the homepage, sitemap, and AI index. Setup and validation examples were verified through an actual stdio session against published `@raydenui/ai@0.1.5`, referencing UI 0.10.1. Recheck the published tools and version identity before updating the pinned release or feature claims. Cursor and Claude Code configuration syntax is linked to their official documentation.

## Components and blocks showcase

`/explore` is a static, searchable gallery of 22 blocks and 28 components. Detail pages use the actual published `@raydenui/ui@0.10.1` in an isolated iframe. Blocks are labelled experimental. All demonstration state stays in memory; forms, checkout, and authentication do not submit remotely.

- `showcase/catalog.json`: curated entries, categories, preview states, documentation links and published version.
- `preview/src/examples`: the actual React examples, also copied verbatim into each detail page's Code view.
- `scripts/build-showcase.py`: static pages, structured data, sitemap entries and AI discovery index.
- `dist/explore.css` and `dist/explore.js`: gallery and detail interface.
- `preview`: isolated npm project with a pinned release and lockfile; it does not change the main package dependencies.

After changing examples, run `npm ci --prefix packages/website/preview`, then `pnpm --dir packages/website build:showcase`. Start the local website preview, then run `SHOWCASE_BASE_URL=http://127.0.0.1:3002 node packages/website/scripts/capture-showcase.mjs` to recapture real screenshots. The capture and review scripts use locally installed Google Chrome through Playwright. Run `pnpm website:check` and `SHOWCASE_BASE_URL=http://127.0.0.1:3002 node packages/website/scripts/review-showcase.mjs` before publishing. Interactive workflow checks are in `scripts/check-showcase-interactions.mjs`, `scripts/check-showcase-expansion.mjs`, and `scripts/check-showcase-fifty.mjs`. Set `SHOWCASE_ONLY` to a comma-separated list of slugs for targeted capture or preview-state review. Gallery counts are generated from the catalog.

Commit the generated static pages, screenshot assets and `dist/explore-assets` together. Vercel serves these prebuilt files without installing preview dependencies. Preview frames are noindex; public detail pages contain crawlable descriptions and source even without JavaScript. Gallery filters use shareable query parameters and a canonical `/explore` URL. AI copy includes the exact example and pinned release; it does not make an AI request.
