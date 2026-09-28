import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.SHOWCASE_BASE_URL||'http://127.0.0.1:3096';
const {items}=JSON.parse(await readFile(new URL('../showcase/catalog.json',import.meta.url),'utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
await page.goto(base+'/explore');
assert.equal(await page.locator('.library-card:visible').count(),items.filter(i=>i.type==='blocks').length);
await page.screenshot({path:'/tmp/rayden-gallery-desktop.png',fullPage:true});
await page.locator('[data-type-filter="components"]').click();assert.equal(await page.locator('.library-card:visible').count(),items.filter(i=>i.type==='components').length);
await page.locator('#library-search').fill('date picker');assert.equal(await page.locator('.library-card:visible').count(),1);
await page.locator('#library-search').fill('zzzzmissing');assert.equal(await page.locator('.library-card:visible').count(),0);
await page.locator('#clear-filters').click();assert.equal(await page.locator('.library-card:visible').count(),items.filter(i=>i.type==='components').length);
for(const item of items.filter(i => !process.env.SHOWCASE_ONLY || process.env.SHOWCASE_ONLY.split(",").includes(i.slug))){
 await page.goto(`${base}/${item.type}/${item.slug}`);
 await page.locator('#preview-loading').waitFor({state:'hidden'});
 assert.equal(await page.locator('#preview-failure').isVisible(),false,item.slug);
 const frame=page.frames().find(f=>f.url().includes('/explore-assets/'));
 await frame.waitForFunction(()=>document.documentElement.dataset.previewStatus==='ready');
 const light=await frame.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor);
 await page.locator('#preview-theme').selectOption('dark');
 await page.locator('#preview-loading').waitFor({state:'hidden'});
 await frame.waitForFunction(()=>document.documentElement.dataset.previewStatus==='ready');
 assert.notEqual(await frame.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),light,item.slug+' dark');
 await page.locator('[data-view="code"]').click();assert(await page.locator('#example-code').isVisible());
 await page.locator('[data-copy-target="example-code"]').first().click();
 assert((await page.evaluate(()=>navigator.clipboard.readText())).includes('@raydenui/ui'));
 await page.locator('[data-view="preview"]').click();
 await page.setViewportSize({width:390,height:844});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),item.slug+' outer overflow');
 const over=await frame.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
 assert(over.scroll<=over.width,item.slug+' inner horizontal overflow: '+JSON.stringify(over));
 if(item.slug==='profile-settings')await page.screenshot({path:'/tmp/rayden-detail-mobile.png',fullPage:true});
 for(const state of item.states.slice(1)){
  await page.locator('#preview-state').selectOption(state);
  await page.locator('#preview-loading').waitFor({state:'hidden'});
  assert.equal(await page.locator('#preview-failure').isVisible(),false,item.slug+' '+state);
 }
 await page.locator('#preview-reset').click();await page.locator('#preview-loading').waitFor({state:'hidden'});
 if(item.states.length>1)assert.equal(await page.locator('#preview-state').inputValue(),'default');
 await page.setViewportSize({width:1440,height:1000});
 console.log('PASS',item.slug,'theme, code, copy, mobile, states, reset');
}
await page.setViewportSize({width:390,height:844});await page.goto(base+'/explore');for (const image of await page.locator('.library-card:visible img').all()) { await image.scrollIntoViewIfNeeded(); await image.evaluate(el => el.decode()); } await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/rayden-gallery-mobile.png',fullPage:true});
assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'gallery overflow');
assert.deepEqual(errors,[]);console.log('PASS gallery filters, all catalog previews and no browser exceptions');
}finally{await browser.close();}
