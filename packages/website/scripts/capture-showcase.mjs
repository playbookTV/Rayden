import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const base=process.env.SHOWCASE_BASE_URL || 'http://127.0.0.1:3002';
const catalog=JSON.parse(await readFile(new URL('../showcase/catalog.json',import.meta.url),'utf8'));
const output=fileURLToPath(new URL('../dist/assets/showcase/',import.meta.url));
await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 for(const item of catalog.items.filter(i => !process.env.SHOWCASE_ONLY || process.env.SHOWCASE_ONLY.split(",").includes(i.slug))){
  for(const [suffix,viewport] of [['',item.thumbnailViewport || {width:900,height:560}],['-mobile',{width:390,height:300}]]){
   const page=await browser.newPage({viewport,deviceScaleFactor:1,reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(`${base}/explore-assets/preview?example=${item.slug}&state=${item.thumbnailState||'default'}`,{waitUntil:'networkidle'});
   await page.waitForFunction(()=>document.documentElement.dataset.previewStatus==='ready');
   await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
   if(errors.length)throw Error(item.slug+': '+errors.join('; '));
   if(suffix && item.thumbnailMobileScroll) await page.evaluate(y=>scrollTo(0,y),item.thumbnailMobileScroll);
   await page.screenshot({path:`${output}${item.slug}${suffix}.png`});
   await page.close();
  }
  console.log(`Captured published example: ${item.slug}`);
 }
} finally {await browser.close();}
