# Rayden UI + Next.js profile form

A complete App Router example for https://www.rayden-ui.dev/guides/nextjs.

Use Node.js 22 LTS or newer. From this folder:

    npm ci
    npm run dev

Open http://localhost:3000. Enter a name and select Save display name. Changes exist only in React state and reset on reload; this example has no backend or account storage.

To check a production build:

    npm run build
    npm start

Uses published @raydenui/ui 0.10.1, Next.js 16.3.6 and React 19.3.0. Tailwind setup is not required: the package provides compiled styles. The page and root layout remain Server Components; only the interactive form has a client boundary.

Rayden UI is MIT-licensed: https://github.com/playbookTV/Rayden/blob/main/LICENSE
