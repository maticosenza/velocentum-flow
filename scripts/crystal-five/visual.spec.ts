import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const ARTIFACTS = resolve(import.meta.dirname, "artifacts");
const fixtureUrl = (name: string) => `file://${resolve(ARTIFACTS, name)}`;

/** Captura el escenario con fuentes ya resueltas y sin animaciones. */
async function capture(page: import("@playwright/test").Page, fixture: string): Promise<Buffer> {
  await page.goto(fixtureUrl(fixture));
  await page.evaluate(() => document.fonts.ready);
  const stage = page.locator(".stage");
  await expect(stage).toBeVisible();
  return stage.screenshot({ animations: "disabled", caret: "hide", scale: "css" });
}

/**
 * Diff de píxeles hecho dentro del propio Chromium: decodifica los dos PNG en canvas y
 * compara los cuatro canales de cada píxel. Devuelve el conteo exacto, no una tolerancia.
 */
async function pixelDiff(page: import("@playwright/test").Page, a: Buffer, b: Buffer) {
  return page.evaluate(
    async ([srcA, srcB]) => {
      const load = (src: string) =>
        new Promise<HTMLImageElement>((res, rej) => {
          const img = new Image();
          img.onload = () => res(img);
          img.onerror = () => rej(new Error("no se pudo decodificar el PNG"));
          img.src = src;
        });
      const [imgA, imgB] = await Promise.all([load(srcA), load(srcB)]);
      if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
        return { differentPixels: -1, maxChannelDelta: -1, width: imgA.width, height: imgA.height };
      }
      const data = (img: HTMLImageElement) => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        ctx.clearRect(0, 0, img.width, img.height);
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, img.width, img.height).data;
      };
      const da = data(imgA);
      const db = data(imgB);
      let differentPixels = 0;
      let maxChannelDelta = 0;
      for (let i = 0; i < da.length; i += 4) {
        let pixelDiffers = false;
        for (let c = 0; c < 4; c += 1) {
          const delta = Math.abs((da[i + c] as number) - (db[i + c] as number));
          if (delta > 0) {
            pixelDiffers = true;
            if (delta > maxChannelDelta) maxChannelDelta = delta;
          }
        }
        if (pixelDiffers) differentPixels += 1;
      }
      return { differentPixels, maxChannelDelta, width: imgA.width, height: imgA.height };
    },
    [`data:image/png;base64,${a.toString("base64")}`, `data:image/png;base64,${b.toString("base64")}`],
  );
}

test("pixel diff cero: sin control, antes (49fc3dc) vs después", async ({ page }) => {
  const antes = await capture(page, "fixture-antes.html");
  const despues = await capture(page, "fixture-despues.html");
  const result = await pixelDiff(page, antes, despues);
  console.log(
    `  sin control : ${result.width}x${result.height}  bytes iguales=${antes.equals(despues)}  ` +
      `pixeles distintos=${result.differentPixels}  delta max de canal=${result.maxChannelDelta}`,
  );
  expect(result.differentPixels).toBe(0);
  expect(result.maxChannelDelta).toBe(0);
});

test("pixel diff cero: control identidad vs baseline 49fc3dc", async ({ page }) => {
  const antes = await capture(page, "fixture-antes.html");
  const controlado = await capture(page, "fixture-controlado.html");
  const result = await pixelDiff(page, antes, controlado);
  console.log(
    `  control={{}}: ${result.width}x${result.height}  bytes iguales=${antes.equals(controlado)}  ` +
      `pixeles distintos=${result.differentPixels}  delta max de canal=${result.maxChannelDelta}`,
  );
  expect(result.differentPixels).toBe(0);
  expect(result.maxChannelDelta).toBe(0);
});

test("control negativo: el diff detecta una diferencia real", async ({ page }) => {
  const antes = await capture(page, "fixture-antes.html");
  const canario = await capture(page, "fixture-canario.html");
  const result = await pixelDiff(page, antes, canario);
  console.log(
    `  canario     : suelo al factor 0.2258064516 -> pixeles distintos=${result.differentPixels}  ` +
      `delta max de canal=${result.maxChannelDelta}`,
  );
  expect(result.differentPixels).toBeGreaterThan(0);
});

test("el fixture del baseline es el artefacto publicado", async () => {
  const publicado = readFileSync(resolve(ARTIFACTS, "visual-fixture.html"), "utf8");
  const antes = readFileSync(resolve(ARTIFACTS, "fixture-antes.html"), "utf8");
  expect(antes).toBe(publicado);
});
