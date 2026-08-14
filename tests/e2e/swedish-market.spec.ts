import { expect, test } from "@playwright/test";

test("Swedish is the clean-session default with Swedish metadata and SEK pricing", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await expect(page.locator("html")).toHaveAttribute("lang", "sv");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Missa aldrig en värdefull kund igen.");
  await expect(page).toHaveTitle(/AI-receptionist för VVS-företag och elektriker/i);

  const pricing = page.locator("#pricing");
  await expect(pricing).toContainText("2 900");
  await expect(pricing).toContainText("4 900");
  await expect(pricing).toContainText("2,50 kr/min");
  await expect(pricing).not.toContainText("$");
});

test("manual language selection persists after reload", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const languageButton = page.getByRole("button", { name: "Språk" });
  if (!(await languageButton.isVisible())) {
    await page.getByRole("button", { name: "Öppna meny" }).click();
  }
  await languageButton.click();
  await page.getByRole("menuitem", { name: /English/i }).click();

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Never miss a valuable lead again.");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Never miss a valuable lead again.");
});

test("pilot CTA opens the complete online request form", async ({ page }) => {
  await page.goto("/#pricing");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Begär 7-dagars pilot" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("7-dagars pilot");
  await expect(dialog.getByLabel("Namn")).toBeVisible();
  await expect(dialog.getByLabel("Företag")).toBeVisible();
  await expect(dialog.getByLabel("E-post")).toBeVisible();
  await expect(dialog.getByLabel("Mobilnummer")).toBeVisible();
});
