import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { once } from "node:events";
import path from "node:path";
import { createSiteServer } from "./preview-site.mjs";
import { readCatalog, root, base } from "./site-config.mjs";
import { launchBrowser } from "./browser.mjs";
const { games } = await readCatalog(),
  results = [],
  artifacts = path.join(root, "artifacts/web");
await mkdir(artifacts, { recursive: true });
const server = createSiteServer();
server.listen(0, "127.0.0.1");
await once(server, "listening");
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
const selectors = {
  "garden-guard": {
    start: '[data-action="continue-level"]',
    confirm: '[data-action="start"]',
    pause: '[data-action="pause"]',
    resume: '[data-action="close"]',
    home: '[data-action="leave"]',
    confirmHome: '[data-action="leave:confirm"]',
    surface: '#game',
  },
  "plane-battle": {
    start: '[data-action="start"]',
    pause: '[data-action="pause"]',
    resume: '[data-action="resume"]',
    home: '[data-action="home"]',
    surface: "#game",
  },
  "zombie-lane": {
    start: '[data-action="start"]',
    pause: '[data-action="pause"]',
    resume: '[data-action="resume"]',
    home: '[data-action="home"]',
    surface: "#game",
  },
  "volley-run": {
    start: "#start-btn",
    pause: "#pause-btn",
    resume: "#modal-actions .primary-btn",
    home: "#modal-actions button",
    surface: "#world canvas",
  },
};
try {
  browser = await launchBrowser();
  for (const size of [
    { width: 320, height: 720 },
    { width: 393, height: 852 },
    { width: 1440, height: 1000 },
  ]) {
    const context = await browser.newContext({
      viewport: size,
      isMobile: size.width < 600,
      hasTouch: size.width < 600,
      deviceScaleFactor: 1,
    });
    // Exercise the selectable lightweight renderer in software-GPU CI. The
    // product's balanced/high defaults stay unchanged; native tests cover the
    // same scene with real WebGL1/2 and explicit frame advancement.
    await context.addInitScript(() =>
      localStorage.setItem(
        "volley.settings.v1",
        JSON.stringify({ quality: "low", sound: false }),
      ),
    );
    const page = await context.newPage(),
      errors = [];
    page.setDefaultTimeout(30000);
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("response", (res) => {
      if (res.status() >= 400 && !res.url().endsWith("/favicon.ico"))
        errors.push(`${res.status()} ${res.url()}`);
    });
    const fits = async () =>
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        true,
        "no horizontal overflow",
      );
    const press = async (locator) => {
      // Zombie's semantic buttons are keyboard mirrors; real pointer input goes
      // to Canvas at the exact same bounds. Exercise that actual user path.
      if (
        await locator.evaluate(
          (el) => getComputedStyle(el).pointerEvents === "none",
        )
      ) {
        const b = await locator.boundingBox();
        assert.ok(b);
        const x = b.x + b.width / 2,
          y = b.y + b.height / 2;
        if (size.width < 600) await page.touchscreen.tap(x, y);
        else await page.mouse.click(x, y);
      } else if (size.width < 600) await locator.tap();
      else await locator.click();
    };
    try {
      await page.goto(origin + base);
      assert.equal(await page.locator(".game-card").count(), games.length);
      await fits();
      for (const game of games) {
        const card = page.locator(
          `article[aria-labelledby="${game.slug}-title"]`,
        );
        await card.scrollIntoViewIfNeeded();
        assert.ok(
          await card
            .locator("img")
            .evaluate((img) => img.complete && img.naturalWidth === 840),
        );
        await press(card.locator(".guide-button"));
        assert.equal(
          await card.locator(".guide-button").getAttribute("aria-expanded"),
          "true",
        );
        assert.ok(await card.locator(".game-guide").isVisible());
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: path.join(artifacts, `portal-${size.width}.png`),
        fullPage: true,
      });
      // At 320px cover the portal and all Plane controls; full gameplay is checked
      // on touch 393px and desktop 1440px to keep software WebGL CI bounded.
      const scenarios =
        size.width === 320
          ? games.filter((g) => g.slug === "plane-battle")
          : games;
      for (const game of scenarios) {
        const ui = selectors[game.slug];
        await page.goto(`${origin}${base}games/${game.slug}/?qa=1`);
        await page.locator(ui.start).waitFor({ state: "visible" });
        await page.waitForFunction(
          () => document.documentElement.dataset.collectionState === "menu",
        );
        await fits();
        await page.locator(".collection-return").waitFor({ state: "visible" });
        await page.reload();
        await page.locator(ui.start).waitFor({ state: "visible" });
        await page.screenshot({
          path: path.join(artifacts, `${game.slug}-${size.width}-menu.png`),
        });
        if (game.slug === "plane-battle") {
          await press(page.locator('[data-action="help"]'));
          await page.locator('[data-action="close-help"]').waitFor();
          await press(page.locator('[data-action="close-help"]'));
          await press(page.locator('[data-action="mode-endless"]'));
          await press(page.locator('[data-action="difficulty-hard"]'));
          await page.reload();
          await page.locator(ui.start).waitFor();
          assert.equal(
            await page.evaluate(() => __PLANE__.snapshot().mode),
            "endless",
          );
          assert.equal(
            await page.evaluate(() => __PLANE__.snapshot().difficulty),
            "hard",
          );
          await press(page.locator('[data-action="mode-stage"]'));
          await press(page.locator('[data-action="difficulty-normal"]'));
        }
        await press(page.locator(ui.start));
        if (ui.confirm) await press(page.locator(ui.confirm));
        await page.waitForFunction(
          () => document.documentElement.dataset.collectionState === "playing",
        );
        assert.equal(
          await page.locator(".collection-return").isVisible(),
          false,
        );
        // Freeze automatic 3D progression between input checks, then advance
        // real simulation ticks below so screenshot speed cannot finish a run.
        if (game.slug === "volley-run")
          await page.evaluate(() => __VOLLEY__.manual(true));
        const box = await page.locator(ui.surface).boundingBox();
        assert.ok(box);
        const start = {
            x: box.x + box.width * 0.58,
            y: box.y + box.height * 0.65,
          },
          end = { x: box.x + box.width * 0.25, y: box.y + box.height * 0.54 };
        if (size.width < 600) {
          const cdp = await context.newCDPSession(page);
          await cdp.send("Input.dispatchTouchEvent", {
            type: "touchStart",
            touchPoints: [start],
          });
          await cdp.send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [end],
          });
          await page.waitForTimeout(220);
          await cdp.send("Input.dispatchTouchEvent", {
            type: "touchCancel",
            touchPoints: [],
          });
          await cdp.detach();
        } else {
          await page.mouse.move(start.x, start.y);
          await page.mouse.down();
          await page.mouse.move(end.x, end.y, { steps: 5 });
          await page.waitForTimeout(220);
          await page.mouse.up();
          await page.keyboard.press("ArrowRight");
        }
        if (game.slug === "volley-run") {
          const state = await page.evaluate(() => __VOLLEY__.advance(20));
          assert.equal(state.phase, "running");
        }
        await page.screenshot({
          path: path.join(artifacts, `${game.slug}-${size.width}-play.png`),
        });
        if (game.slug === "volley-run") {
          const metrics = await page.evaluate(() => __VOLLEY__.metrics());
          assert.ok(metrics.triangles > 1000);
          assert.ok(metrics.livingBlue > 0);
          assert.equal(
            await page.evaluate(() => __VOLLEY__.context().getError()),
            0,
          );
        }
        if (game.slug === "plane-battle" && size.width === 393) {
          await page.evaluate(() => window.dispatchEvent(new Event("blur")));
          await page.waitForFunction(
            () => __PLANE__.snapshot().phase === "paused",
          );
          const tick = await page.evaluate(() => __PLANE__.snapshot().tick);
          await page.evaluate(() => window.dispatchEvent(new Event("focus")));
          assert.equal(
            await page.evaluate(() => __PLANE__.snapshot().phase),
            "paused",
          );
          await press(page.locator(ui.resume));
          await page.waitForFunction(
            (tick) => __PLANE__.snapshot().tick > tick,
            tick,
          );
        }
        await press(page.locator(ui.pause));
        await page.waitForFunction(
          () => document.documentElement.dataset.collectionState === "paused",
        );
        await page.locator(".collection-return").waitFor({ state: "visible" });
        await press(page.locator(ui.resume));
        await page.waitForFunction(
          () => document.documentElement.dataset.collectionState === "playing",
        );
        await press(page.locator(ui.pause));
        const home =
          game.slug === "volley-run"
            ? page.locator(ui.home).filter({ hasText: "返回集合点" })
            : page.locator(ui.home);
        await press(home);
        if (ui.confirmHome) await press(page.locator(ui.confirmHome));
        await page.waitForFunction(
          () => document.documentElement.dataset.collectionState === "menu",
        );
        await press(page.locator(".collection-return"));
        await page.waitForURL(origin + base);
        assert.equal(await page.locator(".game-card").count(), games.length);
        results.push({
          slug: game.slug,
          width: size.width,
          flows: [
            "direct-entry",
            "reload",
            "start",
            "drag/cancel",
            "pause",
            "resume",
            "home",
            "return-to-portal",
          ],
        });
        console.log(`✓ Web ${game.slug} @ ${size.width}px`);
      }
      assert.deepEqual(errors, []);
    } finally {
      await context.close();
    }
  }
  await writeFile(
    path.join(artifacts, "report.json"),
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        portalWidths: [320, 393, 1440],
        results,
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
console.log("Web verification browser and preview server closed.");
