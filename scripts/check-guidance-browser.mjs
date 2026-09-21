import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseURL = process.env.RAYDEN_DOCS_URL ?? "http://127.0.0.1:3001";
const output = process.env.RAYDEN_QA_OUTPUT ?? "/tmp/rayden-pilot-qa";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
    : {}),
});
console.log("Browser launched.");
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseURL });
  const page = await context.newPage();
  await page.bringToFront();
  page.setDefaultTimeout(30000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(`${baseURL}/ai-integration`, { waitUntil: "domcontentloaded" });
  console.log("Guidance page loaded.");
  await page.getByLabel("Component", { exact: true }).selectOption("Spinner");
  await page.getByText("Read or select the prompt", { exact: true }).click();
  const spinnerPrompt = await page.getByLabel("Spinner agent prompt").inputValue();
  assert.match(spinnerPrompt, /Spinner/);
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  await page.getByText("Prompt copied.", { exact: true }).waitFor();
  console.log("Prompt copy succeeded.");
  const readClipboard = () =>
    page.evaluate(() =>
      Promise.race([
        navigator.clipboard.readText(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Clipboard read timed out")), 5000)
        ),
      ])
    );
  assert.equal(await readClipboard(), spinnerPrompt);
  await page.getByLabel("Component", { exact: true }).selectOption("RaydenChart");
  assert.match(
    await page.getByLabel("RaydenChart agent prompt").inputValue(),
    /@raydenui\/ui\/chart/
  );
  await page.screenshot({ path: `${output}/guidance-desktop.png`, fullPage: true });
  await page.getByLabel("Component", { exact: true }).selectOption("Pressable");
  assert.match(
    await page.getByLabel("Pressable agent prompt").inputValue(),
    /@raydenui\/ui\/motion/
  );

  await page.goto(`${baseURL}/components/button`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  await page.getByText("Prompt copied.", { exact: true }).waitFor();
  assert.match(await readClipboard(), /Button/);

  await page.goto(`${baseURL}/ai-integration/distribution`, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Registry item", { exact: true }).selectOption("motion-tabs");
  assert.equal(
    await page.getByLabel("Install command", { exact: true }).inputValue(),
    "pnpm dlx shadcn@4.21.0 add @rayden/motion-tabs"
  );
  await page.getByRole("button", { name: "Copy namespace", exact: true }).click();
  await page.getByText("Namespace configuration copied.", { exact: true }).waitFor();
  const namespace = JSON.parse(await readClipboard());
  assert.match(namespace.registries["@rayden"], /\/r\/citrionus-.*-pilot\.1\/\{name\}\.json$/);

  await page.goto(`${baseURL}/motion`, { waitUntil: "domcontentloaded" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByLabel("Motion preset", { exact: true }).selectOption("playful");
  await page.getByText(/Effective motion: reduced/).waitFor();
  const trigger = page.getByRole("button", { name: "Open motion modal", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Motion follows the task", exact: true });
  await dialog.waitFor({ state: "visible" });
  assert.equal(
    await dialog.evaluate(
      (element) =>
        element
          .getAnimations({ subtree: true })
          .filter((animation) => animation.playState === "running").length
    ),
    0
  );
  await dialog.getByRole("button", { name: "Done", exact: true }).click();
  await dialog.waitFor({ state: "detached" });
  assert.equal(await trigger.evaluate((element) => element === document.activeElement), true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByLabel("Motion preset", { exact: true }).selectOption("snappy");
  await page.getByText(/Effective motion: snappy/).waitFor();
  await page.getByRole("tab", { name: "Overview", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(
    await page.getByRole("tab", { name: "Activity", exact: true }).getAttribute("aria-selected"),
    "true"
  );
  await page.screenshot({ path: `${output}/motion-desktop.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1
    ),
    true
  );
  await page.screenshot({ path: `${output}/motion-mobile.png`, fullPage: true });

  // Clipboard-denied browsers retain a selectable fallback rather than reporting success.
  await page.goto(`${baseURL}/components/modal`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: async () => {
        throw new Error("Denied");
      },
    })
  );
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  await page.getByText("Select the prompt below and copy it manually.", { exact: true }).waitFor();
  assert.deepEqual(errors, [], "Unexpected browser errors");
  console.log(
    `Guidance, clipboard fallback, registry selection, keyboard, native modal focus, actual reduced-motion emulation, and mobile layout passed. Screenshots: ${output}`
  );
  await context.close();
} finally {
  await browser.close();
}
