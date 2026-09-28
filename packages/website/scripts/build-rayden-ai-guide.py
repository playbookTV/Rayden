"""Build the Rayden AI guide. Examples verified against published AI 0.1.5."""
from pathlib import Path
from html import escape
import json

root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
url = 'https://www.rayden-ui.dev/guides/rayden-ai'
title = 'How to use Rayden AI with your coding assistant'
description = 'Connect Rayden AI to Cursor or Claude Code through MCP. Discover React components, inspect props, use design tokens, and validate your UI with practical prompts.'
date = '2026-09-23'
def block(label, code, id):
    return f'<div class="guide-code"><div class="guide-code-head"><span>{escape(label)}</span><button class="guide-copy" type="button" data-copy-code="{id}" aria-label="Copy {escape(label)}">Copy</button></div><pre tabindex="0" aria-label="{escape(label)} code"><code id="{id}">{escape(code.rstrip())}</code></pre></div>'
config = {'mcpServers': {'rayden': {'type': 'stdio', 'command': 'npx', 'args': ['-y', '@raydenui/ai@0.1.5']}}}
first_prompt = '''Use the Rayden MCP tools before writing code.
1. Call get_catalog and report the reference UI and AI versions.
2. Compare the UI reference with my project's installed @raydenui/ui version.
3. Discover the available components with get_components.
4. Inspect Button and Input with get_component_props and get_component_guidance.
Tell me which imports and props you will use. Flag any version mismatch.'''
build_prompt = '''Build a small profile form in my Next.js App Router project using Rayden UI.
First inspect the existing app and the Rayden guidance for Button and Input.
Use a labelled display-name input, a save button, and a status message.
Keep interactive state in a Client Component and import Rayden styles once.
Validate the proposed component props with validate_component_usage.
Use in-memory demo state only and say clearly that it resets on reload.
After implementation, run the build and check keyboard interaction.'''
invalid = {'component': 'Button', 'props': {'size': 'md'}}
valid = {'component': 'Button', 'props': {'size': 'sm', 'variant': 'primary'}}
schema = {'@context': 'https://schema.org', '@graph': [
 {'@type': 'TechArticle', '@id': url+'#article', 'headline': title, 'description': description, 'url': url,
  'mainEntityOfPage': url, 'datePublished': date, 'dateModified': date, 'inLanguage': 'en',
  'author': {'@type': 'Organization', 'name': 'Rayden UI', 'url': 'https://www.rayden-ui.dev/'},
  'publisher': {'@type': 'Organization', 'name': 'Rayden UI', 'url': 'https://www.rayden-ui.dev/'},
  'proficiencyLevel': 'Beginner', 'dependencies': 'Node.js, npm, an MCP client supporting local stdio servers, @raydenui/ai 0.1.5'},
 {'@type': 'BreadcrumbList', 'itemListElement': [
  {'@type': 'ListItem', 'position': 1, 'name': 'Rayden UI', 'item': 'https://www.rayden-ui.dev/'},
  {'@type': 'ListItem', 'position': 2, 'name': 'Rayden AI guide', 'item': url}]}]}
page = f'''<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#101011">
<title>{title} | Rayden UI</title><meta name="description" content="{description}"><link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-image-preview:large"><meta name="author" content="Rayden UI">
<meta property="og:type" content="article"><meta property="og:site_name" content="Rayden UI"><meta property="og:title" content="{title}">
<meta property="og:description" content="{description}"><meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="{title}"><meta name="twitter:description" content="{description}">
<meta property="article:published_time" content="{date}"><meta property="article:modified_time" content="{date}">
<link rel="icon" href="/assets/rayden-mark.svg" type="image/svg+xml"><link rel="preload" href="/assets/manrope-latin-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/fonts.css"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/guide.css">
<script type="application/ld+json">{json.dumps(schema,ensure_ascii=False)}</script><script src="/guide.js" defer></script>
</head><body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="nav-shell"><nav class="nav container" aria-label="Main navigation">
<a class="brand" href="/" aria-label="Rayden UI home"><img src="/assets/rayden-logo.svg" alt="Rayden" width="241" height="99"></a>
<div class="guide-nav"><a href="/explore?type=components">Components</a><a href="/#guides">Guides</a><a href="https://rayden-docs.vercel.app/">Documentation ↗</a></div>
</nav></header><main id="main" class="container">
<header class="guide-hero"><nav class="guide-breadcrumb" aria-label="Breadcrumb"><a href="/">Rayden UI</a><span aria-hidden="true">/</span><span aria-current="page">Rayden AI guide</span></nav>
<div class="guide-hero-grid"><div><p class="guide-kicker">BUILD WITH RAYDEN · GUIDE 02</p><h1>{title}</h1>
<p class="guide-lead">Give your assistant the component knowledge it needs. Connect the MCP companion, check the API, and build with fewer guesses.</p>
<div class="guide-meta"><span>By Rayden UI</span><time datetime="{date}">23 September 2026</time><span>MCP · Cursor · Claude Code</span></div>
<a class="button primary guide-download" href="#connect">Connect your assistant <span aria-hidden="true">↓</span></a>
</div><div class="ai-guide-preview" aria-label="Example of Rayden component validation">
<div class="ai-guide-preview-head"><span>RAYDEN AI</span><span>Component check</span></div>
<p class="ai-guide-preview-label">THE PROPOSED PROP</p><pre><code>Button · size: "md"</code></pre>
<div class="ai-guide-check"><span aria-hidden="true">↳</span><div><strong>Check the contract.</strong><p>Button accepts <code>sm</code> or <code>lg</code>.</p></div></div>
<p class="ai-guide-preview-label">THE CORRECTION</p><pre><code>Button · size: "sm"</code></pre>
<div class="ai-guide-check is-valid"><span aria-hidden="true">✓</span><div><strong>Assessed props pass.</strong><p>Then build and test the interface.</p></div></div>
<p class="ai-guide-preview-caption">A real validation example from @raydenui/ai 0.1.5.</p>
</div></div></header>
<div class="guide-layout"><aside class="guide-toc"><nav aria-label="On this page"><p>ON THIS PAGE</p><div>
<a href="#overview">What is Rayden AI?</a><a href="#connect">01 · Connect</a><a href="#discover">02 · Discover</a><a href="#validate">03 · Validate</a><a href="#build">04 · Build</a><a href="#tools">The tools</a><a href="#questions">Common questions</a>
</div></nav></aside><article class="guide-article">
<section id="overview"><h2>What is Rayden AI?</h2>
<p>Rayden AI is the <code>@raydenui/ai</code> companion package for Rayden UI. It gives compatible coding assistants access to component contracts, import paths, design-token references, and layout recipes through the Model Context Protocol (MCP). Your assistant can look up the library’s API before proposing code.</p>
<p>The MCP server supplies reference information and component-usage checks. Your coding assistant handles the conversation and any edits to your project. The <code>@raydenui/ui</code> package remains the library that renders your React interface.</p>
<p class="guide-version">This guide was checked against published Rayden AI 0.1.5, whose catalog describes Rayden UI 0.10.1 and the Citrionus flavor. It includes a tested example of catching and correcting an unsupported Button size.</p>
</section>
<section id="connect"><h2>01. Connect your coding assistant</h2>
<p>You need Node.js and npm available to your assistant, plus a client that can launch local <code>stdio</code> MCP servers. Use a current supported Node.js LTS release. No Rayden API key is required; your chosen AI client has its own account and model requirements.</p>
<p>Check that the published executable starts by running:</p>
{block('Terminal · check the executable', 'npx -y @raydenui/ai@0.1.5 --help\nnpx -y @raydenui/ai@0.1.5 --version', 'ai-code-check')}
<p>The version command should print <code>0.1.5</code>. The <code>-y</code> flag lets npm install the package without a prompt. This guide pins a release so the examples stay reproducible; use <code>@latest</code> when you intentionally want the newest published reference.</p>
<h3>Cursor</h3><p>Create or update <code>.cursor/mcp.json</code> in your project. If it already contains servers, merge the <code>rayden</code> entry into its existing <code>mcpServers</code> object.</p>
{block('.cursor/mcp.json', json.dumps(config, indent=2), 'ai-code-cursor')}
<p>Open Cursor’s MCP settings, enable the server, and check that its tools appear. This uses Cursor’s <a href="https://cursor.com/docs/mcp">project-level MCP configuration</a>.</p>
<h3>Claude Code</h3><p>From your project directory, add the same server using Claude Code’s CLI:</p>
{block('Terminal · Claude Code', 'claude mcp add --transport stdio rayden -- npx -y @raydenui/ai@0.1.5\nclaude mcp get rayden', 'ai-code-claude')}
<p>In a Claude Code session, use <code>/mcp</code> to check its connection. The command above uses the default local scope. See <a href="https://code.claude.com/docs/en/mcp">Claude Code’s MCP guide</a> for shared project configuration and client-specific troubleshooting.</p>
<div class="guide-note"><p>For another local MCP client, use command <code>npx</code> and arguments <code>["-y", "@raydenui/ai@0.1.5"]</code>. Configuration file locations and formats depend on the client. Rayden’s server uses stdio, so there is no server URL to paste into a remote connector.</p></div>
</section>
<section id="discover"><h2>02. Discover before you generate</h2>
<p>Start with a small request that proves the assistant can use the tools. Paste this into your connected assistant:</p>
{block('Prompt · inspect the library', first_prompt, 'ai-code-discover')}
<p>Look for actual tool calls in the assistant’s activity. A useful response identifies the reference versions, the real component exports, and their supported props. A generic explanation of Rayden without tool calls does not confirm that the connection works.</p>
<p>The catalog is a versioned snapshot. It does not read your project’s installed packages. Ask the assistant to compare the returned <code>uiVersion</code> with your app’s dependency version before applying the guidance. <code>get_catalog</code> can take an exact <code>uiVersion</code>; an unsupported version returns an error.</p>
</section>
<section id="validate"><h2>03. Catch an unsupported prop</h2>
<p>A model might assume every library has a medium button. In the tested Rayden reference, Button’s supported sizes are <code>sm</code> and <code>lg</code>. Ask your assistant to call <code>validate_component_usage</code> with:</p>
{block('Tool arguments · unsupported size', json.dumps(invalid, indent=2), 'ai-code-invalid')}
<p>The result contains <code>valid: false</code> and this error:</p>
{block('Returned error', 'Button.size expects ButtonSize | undefined (sm, lg).', 'ai-code-error')}
<p>Correct the size, then validate again:</p>
{block('Tool arguments · supported props', json.dumps(valid, indent=2), 'ai-code-valid')}
<p>This call returns <code>valid: true</code> with no errors for the assessed props. It is still necessary to test the rendered component: the response’s <code>notAssessed</code> field explains checks outside the validator’s scope, including runtime accessibility and event behaviour.</p>
</section>
<section id="build"><h2>04. Turn the reference into a working UI</h2>
<p>Give the assistant a concrete task, the framework context, and an explicit check to perform. For a small Next.js form, try:</p>
{block('Prompt · build a profile form', build_prompt, 'ai-code-build')}
<p>The companion does not install the UI package into your app. If your project needs Rayden, install a release that matches the reference and import <code>@raydenui/ui/styles.css</code> once in your app entry point or root layout. Our <a href="/guides/nextjs">Next.js guide</a> includes a complete, downloadable form you can use alongside this prompt.</p>
<h3>Two more prompts to try</h3>
{block('Prompt · review existing code', 'Review my existing Rayden components. Inspect their exact exports and props with the MCP tools. Validate each proposed prop correction, explain any version mismatch, and keep unrelated code unchanged. Report runtime checks that still need testing.', 'ai-code-review')}
{block('Prompt · explore a layout', 'Use get_layout_recipes to discover available layouts for a settings screen. Inspect the components and design-token references used by the closest recipe. Propose a composition using supported exports, and identify any app-specific state or backend logic I still need to implement.', 'ai-code-layout')}
</section>
<section id="tools"><h2>What tools does Rayden AI provide?</h2>
<div class="guide-table-wrap"><table class="guide-table"><thead><tr><th scope="col">Tool</th><th scope="col">Use it to</th></tr></thead><tbody>
<tr><td><code>get_catalog</code></td><td>Check the reference version, flavor, capabilities, and catalog.</td></tr>
<tr><td><code>get_components</code></td><td>Discover component families, real exports, and import paths.</td></tr>
<tr><td><code>get_component_props</code></td><td>Inspect a component’s props and inherited attributes.</td></tr>
<tr><td><code>get_component_guidance</code></td><td>Get component-specific guidance and a reusable prompt.</td></tr>
<tr><td><code>get_tokens</code></td><td>Look up authored design-token reference values.</td></tr>
<tr><td><code>get_layout_recipes</code></td><td>Explore authored examples for composing layouts.</td></tr>
<tr><td><code>validate_component_usage</code></td><td>Check proposed props and supported immediate child composition.</td></tr>
</tbody></table></div>
<p>Tool availability and reference data may change between releases. Discover the connected server’s tools instead of assuming that every feature in a repository checkout is published.</p>
</section>
<section id="questions"><h2>Common questions</h2>
<h3>The terminal is waiting. Is the server broken?</h3><p>Running the command without <code>--help</code> or <code>--version</code> starts a stdio server that waits for MCP messages. Let your client launch that process. It does not open a website or listen on an HTTP port.</p>
<h3>Why can’t my assistant see the tools?</h3><p>Check that Node.js and <code>npx</code> are available in the environment used by the client, that the JSON is valid, and that the server is enabled. Try the help command in that environment, inspect the client’s server log, and reconnect after changing the configuration.</p>
<h3>Does validation guarantee correct code?</h3><p>No. It checks supported names, required props, enum values, primitive types, inherited attributes, and supported immediate composition constraints. It does not certify a whole React application, callback behaviour, or accessibility in the browser. Review <code>errors</code>, <code>warnings</code>, and <code>notAssessed</code>, then run your app’s normal checks.</p>
<h3>Can Rayden AI edit Figma?</h3><p>The package includes component anatomy and design references, but its MCP server does not control Figma. A design workflow needs separately available Figma tools. Token reference data also does not represent every runtime dark-mode override.</p>
<h3>Can I use the reference without MCP?</h3><p>Yes. The package exposes a JavaScript API, including <code>getCatalog</code>, <code>getComponentGuidance</code>, and <code>validateComponentUsage</code>. The <a href="https://github.com/playbookTV/Rayden/tree/main/packages/rayden-ai">package README</a> documents those imports. The docs also publish an <a href="https://rayden-docs.vercel.app/llms.txt">agent index</a> and <a href="https://rayden-docs.vercel.app/ai/catalog.json">component catalog</a>; check their stated reference versions.</p>
</section>
<section class="guide-links"><h2>Keep building</h2><p>Use the <a href="/guides/nextjs">Next.js profile form tutorial</a> for a runnable starting point, explore the <a href="https://rayden-docs.vercel.app/ai-integration">AI integration reference</a>, or check the <a href="https://www.npmjs.com/package/@raydenui/ai">published Rayden AI package</a> for releases.</p><a class="button primary guide-download" href="#connect">Back to setup <span aria-hidden="true">↑</span></a></section>
</article></div></main>
<footer class="container"><div class="footer-top"><a class="brand" href="/" aria-label="Rayden UI home"><img src="/assets/rayden-logo.svg" alt="Rayden" width="241" height="99"></a><p>Open-source React UI, built with care.</p><div><a href="/#guides">Guides</a><a href="https://rayden-docs.vercel.app/">Docs</a><a href="https://github.com/playbookTV/Rayden">GitHub</a></div></div><div class="footer-bottom"><span>© 2026 Rayden UI</span><span>Open source. Open possibilities.</span><a href="#main">Back to top ↑</a></div></footer><p id="copy-status" class="sr-only" role="status"></p>
</body></html>'''
(dist / 'guides/rayden-ai.html').write_text(page)
print('Built Rayden AI guide.')
