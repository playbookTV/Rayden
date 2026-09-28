"""Render the guide's code from the tested example and create its download."""
from pathlib import Path
from html import escape
import json
import zipfile

root = Path(__file__).resolve().parents[1]
example = root / 'examples/nextjs-profile'
dist = root / 'dist'
url = 'https://www.rayden-ui.dev/guides/nextjs'
title = 'How to use Rayden UI with Next.js App Router'
description = 'Build a working Next.js profile form with Rayden UI. Install the React components, import styles, add a client boundary, and download the complete TypeScript example.'
date = '2026-09-23'
def block(label, code, id):
    return f'<div class="guide-code"><div class="guide-code-head"><span>{escape(label)}</span><button class="guide-copy" type="button" data-copy-code="{id}" aria-label="Copy {escape(label)}">Copy</button></div><pre tabindex="0" aria-label="{escape(label)} code"><code id="{id}">{escape(code.rstrip())}</code></pre></div>'
def snippet(file, id):
    return block(file, (example / file).read_text(), id)

schema = {'@context': 'https://schema.org', '@graph': [
    {'@type': 'TechArticle', '@id': url+'#article', 'headline': title, 'description': description,
     'url': url, 'mainEntityOfPage': url, 'datePublished': date, 'dateModified': date,
     'inLanguage': 'en', 'author': {'@type': 'Organization', 'name': 'Rayden UI', 'url': 'https://www.rayden-ui.dev/'},
     'publisher': {'@type': 'Organization', 'name': 'Rayden UI', 'url': 'https://www.rayden-ui.dev/'},
     'image': 'https://www.rayden-ui.dev/assets/nextjs-profile.png', 'proficiencyLevel': 'Beginner',
     'dependencies': 'Next.js App Router, React, TypeScript, @raydenui/ui'},
    {'@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': 1, 'name': 'Rayden UI', 'item': 'https://www.rayden-ui.dev/'},
        {'@type': 'ListItem', 'position': 2, 'name': 'Rayden UI with Next.js', 'item': url}]}]}
page = f'''<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#101011"><title>{title} | Rayden UI</title>
<meta name="description" content="{description}"><link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-image-preview:large"><meta name="author" content="Rayden UI">
<meta property="og:type" content="article"><meta property="og:site_name" content="Rayden UI">
<meta property="og:title" content="{title}"><meta property="og:description" content="{description}"><meta property="og:url" content="{url}">
<meta property="og:image" content="https://www.rayden-ui.dev/assets/nextjs-profile.png"><meta property="og:image:alt" content="The working Rayden UI profile form built in this Next.js guide">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{title}"><meta name="twitter:description" content="{description}"><meta name="twitter:image" content="https://www.rayden-ui.dev/assets/nextjs-profile.png">
<meta property="article:published_time" content="{date}"><meta property="article:modified_time" content="{date}">
<link rel="icon" href="/assets/rayden-mark.svg" type="image/svg+xml">
<link rel="preload" href="/assets/manrope-latin-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/fonts.css"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/guide.css">
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script><script src="/guide.js" defer></script>
</head><body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="nav-shell"><nav class="nav container" aria-label="Main navigation">
<a class="brand" href="/" aria-label="Rayden UI home"><img src="/assets/rayden-logo.svg" alt="Rayden" width="241" height="99"></a>
<div class="guide-nav"><a href="/explore?type=components">Components</a><a href="/#guides">Guides</a><a href="https://rayden-docs.vercel.app/">Documentation ↗</a></div>
</nav></header>
<main id="main" class="container">
<header class="guide-hero">
<nav class="guide-breadcrumb" aria-label="Breadcrumb"><a href="/">Rayden UI</a><span aria-hidden="true">/</span><span aria-current="page">Next.js guide</span></nav>
<div class="guide-hero-grid"><div>
<p class="guide-kicker">BUILD WITH RAYDEN · GUIDE 01</p>
<h1>{title}</h1>
<p class="guide-lead">From a fresh app to your first interactive form. Real components, a small client boundary, and every file you need.</p>
<div class="guide-meta"><span>By Rayden UI</span><time datetime="{date}">23 September 2026</time><span>TypeScript · App Router</span></div>
<a class="button primary guide-download" href="/examples/nextjs-profile.zip" download>Download the example <span aria-hidden="true">↓</span></a>
</div><figure class="guide-preview"><img src="/assets/nextjs-profile.png" width="720" height="660" alt="Working profile form with a display name field and a Save display name button" fetchpriority="high"><figcaption>The example you’ll build, using Rayden’s Input and Button.</figcaption></figure></div>
</header>
<div class="guide-layout"><aside class="guide-toc"><nav aria-label="On this page"><p>ON THIS PAGE</p><div>
<a href="#overview">What you’ll build</a><a href="#install">01 · Install</a><a href="#styles">02 · Load the styles</a><a href="#form">03 · Build the form</a><a href="#page">04 · Add the page</a><a href="#run">05 · Run and check</a><a href="#questions">Common questions</a>
</div></nav></aside>
<article class="guide-article">
<section id="overview"><h2>How does Rayden work with Next.js?</h2>
<p>Install <code>@raydenui/ui</code>, import <code>@raydenui/ui/styles.css</code> in your root layout, and use a Client Component for interactive UI. Your page and layout can stay as Server Components. Rayden ships compiled styles, so this example needs no Tailwind configuration.</p>
<p>You’ll build a profile form that accepts a display name and confirms the change. It uses Rayden’s <code>Input</code> and <code>Button</code>, native form submission, and React state. The name stays in memory and resets when you reload; there is no account service or database.</p>
<p class="guide-version">Example versions: Rayden UI 0.10.1, Next.js 16.3.6, React 19.3.0. Use Node.js 22 LTS or newer and npm. Already have an App Router project? Start with the Rayden install below and adapt the files to your existing layout.</p>
</section>
<section id="install"><h2>01. Install Rayden UI</h2>
<p>For a fresh project, the download above includes every file in this guide and a dependency lockfile. Unzip it, open the <code>nextjs-profile</code> folder in your terminal, then run:</p>
{block('Terminal · downloaded example', 'npm ci\nnpm run dev', 'code-download')}
<p>To follow along in a new app of your own, run <code>npx create-next-app@latest my-rayden-app</code>. Choose TypeScript and App Router. The example uses a root-level <code>app</code> directory and plain CSS. If you choose a <code>src</code> directory, put the files below in <code>src/app</code> instead.</p>
<p>Inside an existing or freshly created Next.js project, add the tested Rayden version:</p>
{block('Terminal · existing Next.js app', 'npm install @raydenui/ui@0.10.1', 'code-install')}
<p>You don’t need a Rayden provider for the two components used here. Consult the documentation when adding components with their own provider requirements.</p>
</section>
<section id="styles"><h2>02. Import the component styles once</h2>
<p>Load Rayden’s stylesheet from the root layout, followed by your app’s global styles. In an existing project, keep your metadata, fonts, and providers; add the imports to your current layout.</p>
{snippet('app/layout.tsx', 'code-layout')}
<p>Keep <code>layout.tsx</code> on the server. Next.js supports importing external CSS in the App Router, and the form will define its own client boundary.</p>
</section>
<section id="form"><h2>03. Create the interactive form</h2>
<p>Add <code>app/profile-form.tsx</code>. The <code>"use client"</code> directive belongs before the imports because this component uses state and event handlers.</p>
{snippet('app/profile-form.tsx', 'code-form')}
<p><code>Input</code> supplies the visible label and helper text. Its value stays controlled by React. The save button is disabled for empty or whitespace-only names, and the form trims the name before displaying a confirmation. The status region announces that confirmation to assistive technology.</p>
<div class="guide-note"><p>For a real account settings page, replace the in-memory update with your authenticated server action or API. Validate the name on the server and handle pending, success, and error states before treating the change as saved.</p></div>
</section>
<section id="page"><h2>04. Compose the page</h2>
<p>Render the form from a Server Component. The heading and surrounding content do not need to become Client Components just because the form is interactive.</p>
{snippet('app/page.tsx', 'code-page')}
<p>Add the following app styles. These classes handle the page layout; Rayden’s stylesheet handles the input and button. For an existing app, merge them into your stylesheet rather than replacing its current rules.</p>
{snippet('app/globals.css', 'code-css')}
</section>
<section id="run"><h2>05. Run it and check the behaviour</h2>
<p>Start the development server with <code>npm run dev</code> and open <code>http://localhost:3000</code> (or the address printed in your terminal). Enter a name, then select <strong>Save display name</strong>.</p>
<ul><li>An empty name leaves the save button disabled.</li><li>A valid name produces a confirmation below the button.</li><li>Editing the name clears the previous confirmation.</li><li>Reloading resets the form, because this example has no persistent storage.</li></ul>
<p>Before deploying your own app, check its production build:</p>
{block('Terminal · production check', 'npm run build\nnpm start', 'code-build')}
</section>
<section id="questions"><h2>Common questions</h2>
<h3>Why do the components look unstyled?</h3><p>Check that the root layout imports <code>@raydenui/ui/styles.css</code>. Restart the development server after installing the package. If the import is present, inspect your app’s global CSS for broad rules that override component colours, borders, or spacing.</p>
<h3>Do I need Tailwind CSS?</h3><p>No. This example uses the package’s compiled stylesheet and ordinary CSS. If you want Tailwind utilities in your own app, follow the separate <a href="https://rayden-docs.vercel.app/getting-started/tailwind">Tailwind setup guide</a>.</p>
<h3>Why am I getting an event handler or useState error?</h3><p>Put <code>"use client"</code> at the top of the file that defines the interactive form. Keep its event handlers inside that client boundary. Do not pass ordinary callback functions from a Server Component into the form.</p>
<h3>Does this work with the Pages Router?</h3><p>This guide is written for App Router. In a Pages Router project, global CSS belongs in <code>pages/_app.tsx</code>; its routing and layout files differ. Follow the <a href="https://nextjs.org/docs/pages/getting-started/css">Next.js Pages Router CSS instructions</a> for that setup.</p>
</section>
<section class="guide-links"><h2>Keep building</h2><p>Want your coding assistant to work from Rayden’s component contracts? Follow the <a href="/guides/rayden-ai">Rayden AI setup guide</a> to connect the MCP companion and validate proposed props.</p><p>Explore the <a href="https://rayden-docs.vercel.app/components/button">Button API</a>, <a href="https://rayden-docs.vercel.app/components/input">Input API</a>, and <a href="https://rayden-docs.vercel.app/design-tokens">design tokens</a> when you’re ready to adapt the form to your product.</p>
<p>For the framework concepts used here, see Next.js’s official guides to <a href="https://nextjs.org/docs/app/getting-started/installation">installation</a>, <a href="https://nextjs.org/docs/app/getting-started/server-and-client-components">Server and Client Components</a>, and <a href="https://nextjs.org/docs/app/getting-started/css">CSS</a>.</p>
<a class="button primary guide-download" href="/examples/nextjs-profile.zip" download>Get the complete example <span aria-hidden="true">↓</span></a>
</section>
</article></div></main>
<footer class="container"><div class="footer-top"><a class="brand" href="/" aria-label="Rayden UI home"><img src="/assets/rayden-logo.svg" alt="Rayden" width="241" height="99"></a><p>Open-source React UI, built with care.</p><div><a href="https://rayden-docs.vercel.app/">Docs</a><a href="https://github.com/playbookTV/Rayden">GitHub</a><a href="https://www.npmjs.com/package/@raydenui/ui">npm</a></div></div><div class="footer-bottom"><span>© 2026 Rayden UI</span><span>Open source. Open possibilities.</span><a href="#main">Back to top ↑</a></div></footer>
<p id="copy-status" class="sr-only" role="status"></p>
</body></html>'''
(dist / 'guides/nextjs.html').write_text(page)
with zipfile.ZipFile(dist / 'examples/nextjs-profile.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for name in ['package.json', 'package-lock.json', 'tsconfig.json', 'README.md', 'app/layout.tsx', 'app/page.tsx', 'app/profile-form.tsx', 'app/globals.css']:
        archive.write(example / name, 'nextjs-profile/' + name)
print('Built Next.js guide and complete example download.')
