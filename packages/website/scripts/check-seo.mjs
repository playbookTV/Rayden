import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
const root = fileURLToPath(new URL("../dist/", import.meta.url));
const page = await readFile(resolve(root, "index.html"), "utf8");
const canonical = "https://www.rayden-ui.dev/";
const showcase = JSON.parse(await readFile(new URL("../showcase/catalog.json", import.meta.url), "utf8"));
const normalize = (value) =>
  value
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
assert.equal((page.match(/<h1\b/g) || []).length, 1, "Use one main heading");
assert.match(page, /<h1>React components\./);
assert.equal((page.match(/rel="canonical"/g) || []).length, 1);
assert.match(page, /<link\s+rel="canonical"\s+href="https:\/\/www\.rayden-ui\.dev\/"/);
assert.doesNotMatch(page, /noindex/i, "Public homepage must remain indexable");
for (const key of ["og:title", "og:description", "og:image", "og:url", "twitter:card"])
  assert(page.includes(`"${key}"`), key);
const schema = JSON.parse(
  page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]
);
assert.equal(schema["@context"], "https://schema.org");
const graph = schema["@graph"];
for (const type of ["Organization", "WebSite", "WebPage", "SoftwareSourceCode", "FAQPage"])
  assert(
    graph.some((n) => n["@type"] === type),
    type
  );
const ids = graph.map((node) => node["@id"]);
assert.equal(new Set(ids).size, ids.length, "Unique schema entity IDs");
assert.equal(graph.find((n) => n["@type"] === "WebPage").url, canonical);
assert.equal(graph.find((n) => n["@type"] === "SoftwareSourceCode").isAccessibleForFree, true);
const visibleFaqs = [
  ...page.matchAll(/<details\b[^>]*>[\s\S]*?<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g),
].map((m) => [normalize(m[1]), normalize(m[2])]);
const questions = graph.find((n) => n["@type"] === "FAQPage").mainEntity;
assert.equal(visibleFaqs.length, questions.length, "Schema must mirror visible answers");
questions.forEach((q, i) => assert.deepEqual([q.name, q.acceptedAnswer.text], visibleFaqs[i]));
const robots = await readFile(resolve(root, "robots.txt"), "utf8");
assert.match(robots, /User-agent: \*\s+Allow: \//);
assert.match(robots, /User-agent: OAI-SearchBot\s+Allow: \//);
assert(robots.includes(`Sitemap: ${canonical}sitemap.xml`));
const sitemap = await readFile(resolve(root, "sitemap.xml"), "utf8");
assert.deepEqual(
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]).sort(),
  [canonical, `${canonical}guides/nextjs`, `${canonical}guides/rayden-ai`, `${canonical}explore`, ...showcase.items.map(item => `${canonical}${item.type}/${item.slug}`)].sort()
);
const files = new Set([...page.matchAll(/(?:src|href)="(\/(?!\/)[^"#?]+)"/g)].map((m) => m[1]));
for (const file of ["fonts.css", "styles.css"]) {
  const css = await readFile(resolve(root, file), "utf8");
  for (const m of css.matchAll(/url\(["']?(\/[^"')]+)["']?\)/g)) files.add(m[1]);
}
for (const file of files) await access(resolve(root, "." + file + (file.startsWith("/guides/") ? ".html" : "")));
const fonts = await readFile(resolve(root, "fonts.css"), "utf8");
assert.doesNotMatch(fonts, /\.ttf/);
assert.match(fonts, /font-display:\s*swap/);
const llms = await readFile(resolve(root, "llms.txt"), "utf8");
assert(llms.includes(canonical));
assert(llms.includes("https://rayden-docs.vercel.app/ai/catalog.json"));
assert.match((await readFile(resolve(root, "indexnow-key.txt"), "utf8")).trim(), /^[a-f0-9]{32}$/);
console.log(
  `SEO checks passed: canonical, metadata, ${questions.length} matching FAQ answers, structured entities, crawl rules, sitemap, AI index, and ${files.size} local assets.`
);

const guide = await readFile(resolve(root, "guides/nextjs.html"), "utf8");
assert.equal((guide.match(/<h1\b/g) || []).length, 1);
assert(guide.includes(`rel="canonical" href="${canonical}guides/nextjs"`));
assert.doesNotMatch(guide, /noindex/i);
const guideGraph = JSON.parse(guide.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
assert.equal(guideGraph.find(n => n["@type"] === "TechArticle").url, `${canonical}guides/nextjs`);
assert.equal(guideGraph.find(n => n["@type"] === "BreadcrumbList").itemListElement.length, 2);
for (const match of guide.matchAll(/(?:src|href)="(\/(?!\/)[^"#?]+)"/g)) {
  const path = match[1];
  await access(resolve(root, path === "/" ? "index.html" : "." + path + (path.startsWith("/guides/") ? ".html" : "")));
}
for (const match of guide.matchAll(/href="#([^"]+)"/g)) assert(guide.includes(`id="${match[1]}"`), `Broken guide anchor: ${match[1]}`);
const decode = s => s.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&amp;/g,"&");
for (const [id, file] of [["code-layout","layout.tsx"],["code-form","profile-form.tsx"],["code-page","page.tsx"],["code-css","globals.css"]]) {
  const rendered = guide.match(new RegExp(`<code id="${id}">([\\s\\S]*?)</code>`))[1];
  const source = await readFile(new URL(`../examples/nextjs-profile/app/${file}`, import.meta.url), "utf8");
  assert.equal(decode(rendered), source.trimEnd(), `Guide snippet drift: ${file}`);
}
assert(llms.includes(`${canonical}guides/nextjs`));
console.log("Guide checks passed: metadata, article schema, links, assets, anchors, exact example source and discovery indexes.");

const aiGuide = await readFile(resolve(root, "guides/rayden-ai.html"), "utf8");
assert.equal((aiGuide.match(/<h1\b/g) || []).length, 1);
assert(aiGuide.includes(`rel="canonical" href="${canonical}guides/rayden-ai"`));
assert.doesNotMatch(aiGuide, /noindex/i);
const aiGraph = JSON.parse(aiGuide.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
assert.equal(aiGraph.find(n => n["@type"] === "TechArticle").url, `${canonical}guides/rayden-ai`);
assert.equal(aiGraph.find(n => n["@type"] === "BreadcrumbList").itemListElement.length, 2);
for (const match of aiGuide.matchAll(/(?:src|href)="(\/(?!\/)[^"#?]+)"/g)) {
  const path = match[1];
  await access(resolve(root, path === "/" ? "index.html" : "." + path + (path.startsWith("/guides/") ? ".html" : "")));
}
for (const match of aiGuide.matchAll(/href="#([^"]+)"/g)) assert(aiGuide.includes(`id="${match[1]}"`), `Broken AI guide anchor: ${match[1]}`);
for (const id of ["ai-code-cursor", "ai-code-invalid", "ai-code-valid"]) {
 const snippet = aiGuide.match(new RegExp(`<code id="${id}">([\\s\\S]*?)</code>`))[1];
 const data = JSON.parse(decode(snippet));
 if (id === "ai-code-cursor") assert.deepEqual(data.mcpServers.rayden, {type:"stdio", command:"npx", args:["-y", "@raydenui/ai@0.1.5"]});
 else assert.equal(data.component, "Button");
}
assert(guide.includes('href="/guides/rayden-ai"'));
assert(page.includes('href="/guides/rayden-ai"'));
assert(llms.includes(`${canonical}guides/rayden-ai`));
console.log("Rayden AI guide checks passed: article metadata, links, anchors, valid MCP configuration and discovery indexes.");
