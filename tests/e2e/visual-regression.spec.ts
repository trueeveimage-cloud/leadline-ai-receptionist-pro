import { expect, test, type Page } from "@playwright/test";

const visualProjects = new Set(["desktop", "mobile"]);

async function prepare(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.addInitScript(() => {
    window.localStorage.setItem("lang", "sv");
  });
}

async function freezeMotion(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-delay: 0s !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
      }
      .fixed { transform: none !important; }
    `,
  });
}

async function gotoStable(page: Page, url: string) {
  await prepare(page);
  await page.goto(url, { waitUntil: "networkidle" });
  await freezeMotion(page);
  await page.waitForTimeout(250);
}

test.describe("visual regression", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    void page;
    test.skip(
      !visualProjects.has(testInfo.project.name),
      "Visual snapshots only run on desktop and mobile.",
    );
  });

  test("home", async ({ page }, testInfo) => {
    await gotoStable(page, "/");
    await expect(page).toHaveScreenshot(`home-${testInfo.project.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.08,
      animations: "disabled",
    });
  });

  test("demo section", async ({ page }, testInfo) => {
    await gotoStable(page, "/#demo");
    await expect(page).toHaveScreenshot(`demo-${testInfo.project.name}.png`, {
      fullPage: false,
      maxDiffPixelRatio: 0.08,
      animations: "disabled",
    });
  });

  test("pricing section", async ({ page }, testInfo) => {
    await gotoStable(page, "/#pricing");
    await expect(page).toHaveScreenshot(`pricing-${testInfo.project.name}.png`, {
      fullPage: false,
      maxDiffPixelRatio: 0.08,
      animations: "disabled",
    });
  });

  test("privacy page", async ({ page }, testInfo) => {
    await gotoStable(page, "/privacy");
    await expect(page).toHaveScreenshot(`privacy-${testInfo.project.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.08,
      animations: "disabled",
    });
  });
});
