# Rayden marketing website

The marketing site lives separately from the Nextra documentation in `packages/docs`.

Run `pnpm website` from the repository root, or `node server.mjs` here. The preview opens at `http://127.0.0.1:3002`; set `PORT` to change it.

## Editing

- `dist/index.html`: page content and semantic layout.
- `dist/styles.css`: graphite/copper visual system, responsive layouts, interaction states, and reduced-motion handling.
- `dist/app.js`: interactive component concepts, theme controls, calendar, search, filters, dialogs, and starter commands.
- `dist/assets`: original Rayden brand mark, locally hosted open-source fonts and licenses, and an original generated copper/glass artwork.

This is a buildless static marketing site with no added dependencies. The authored `dist` folder is tracked and is the deployable output. `pnpm website:check` validates JavaScript syntax.

The interactive UI concepts and starter illustrations are custom website demos, not embedded instances or screenshots of the published React components/templates. Links lead to the actual documentation. Starter selectors generate real `create-rayden-app` commands. The AI section explains the companion package and does not call an AI service. Activity numbers and names are illustrative.

All demonstration interactions run locally. Only the theme Save control writes session preferences. There is no analytics, account creation, remote form submission, or actual project deployment from the demo controls.

## Hosting

The production marketing site uses the existing Vercel project `rayden-web` in `leslie-layrznets-projects`, serving `www.rayden-ui.dev` and `rayden-ui.dev`. Deploy this package as the project root; `vercel.json` serves `dist` as static assets without a build or dependency installation.

`.openai/hosting.json` identifies a separate private review site. Publishing that review site does not deploy the production marketing website. Documentation uses the separate Vercel project `rayden-docs`.

## References

React Bits informed the interactive opening; Appica the layered component showcase; UIAble the progression into starter layouts; TentUI the tactile control details. No reference-site code or branded artwork is included. The artwork in `assets/copper-glass.jpg` was generated specifically for this site.
