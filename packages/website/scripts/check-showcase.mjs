import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const catalog=JSON.parse(await readFile(new URL('../showcase/catalog.json',import.meta.url),'utf8'));
const routes=['/explore',...catalog.items.map(i=>`/${i.type}/${i.slug}`)];
const canonical='https://www.rayden-ui.dev';
const decode=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&amp;/g,'&');
for(const route of routes){
 const html=await readFile(resolve(root,`.${route}.html`),'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,route);
 assert(html.includes(`rel="canonical" href="${canonical}${route}"`),route);
 assert.doesNotMatch(html,/noindex/i);
 JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 for(const match of html.matchAll(/(?:href|src)="(\/(?!\/)[^"]*)"/g)){
  const url=new URL(decode(match[1]),canonical);let file=url.pathname;
  file=file==='/'?'/index.html':extname(file)?file:`${file}.html`;
  await access(resolve(root,'.'+file));
 }
 for(const item of catalog.items.filter(i=>route===`/${i.type}/${i.slug}`)){
  const source=await readFile(new URL(`../preview/src/examples/${item.slug}.tsx`,import.meta.url),'utf8');
  assert.equal(decode(html.match(/<code id="example-code">(.*?)<\/code>/s)[1]),source,'Preview and copied source must match');
  assert(html.includes(`@raydenui/ui ${catalog.version}`));
  if(item.type==='blocks')assert(html.includes('Experimental'));
 }
}
const gallery=await readFile(resolve(root,'explore.html'),'utf8');
assert.equal((gallery.match(/class="library-card"/g)||[]).length,catalog.items.length);
for(const item of catalog.items)for(const suffix of ['', '-mobile'])await access(resolve(root,`assets/showcase/${item.slug}${suffix}.png`));
const preview=await readFile(resolve(root,'explore-assets/preview.html'),'utf8');
assert(preview.includes('noindex'));
for(const match of preview.matchAll(/(?:src|href)="(\/[^"?]+)"/g))await access(resolve(root,'.'+match[1]));
console.log(`Showcase checks passed: ${routes.length} crawlable pages, real matching example source, metadata, links, thumbnails and preview build.`);
