import { test, expect, type Page } from "@playwright/test";

test.setTimeout(60_000);

/**
 * Responsive regression test for the BookingDialog.
 *
 * Fails if any element inside the dialog form clips horizontally
 * (overflows past the dialog's inner content box) at the current
 * project-supported breakpoints.
 *
 * Project Playwright projects (see playwright.config.ts) drive the
 * common screen sizes: iPhone SE, iPhone 13, iPad Mini, Desktop Chrome.
 */

async function openBookingDialog(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // The Hero CTA renders the localized "Book demo" label. We match it
  // case-insensitively across en/sv/es.
  const cta = page
    .getByRole("button", { name: /book.*demo|boka.*demo|reservar.*demo/i })
    .first();
  await cta.waitFor({ state: "visible" });
  await cta.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  return dialog;
}

test.describe("BookingDialog responsive layout", () => {
  test("opens from Book demo button without horizontal clipping", async ({ page }) => {
    const dialog = await openBookingDialog(page);

    // Dialog should not exceed the viewport width.
    const dialogBox = await dialog.boundingBox();
    const viewport = page.viewportSize();
    expect(dialogBox, "dialog has a bounding box").not.toBeNull();
    expect(viewport, "viewport size is defined").not.toBeNull();
    expect(dialogBox!.x).toBeGreaterThanOrEqual(0);
    expect(dialogBox!.x + dialogBox!.width).toBeLessThanOrEqual(viewport!.width + 1);

    // Every interactive control inside the dialog must stay within the
    // dialog's inner box (no clipping past either side).
    const controls = dialog.locator("input, button, [role='button']");
    const count = await controls.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const el = controls.nth(i);
      if (!(await el.isVisible())) continue;
      const box = await el.boundingBox();
      if (!box) continue;
      // Allow 1px sub-pixel tolerance.
      expect(
        box.x + 1,
        `control #${i} clips on the left of the dialog`,
      ).toBeGreaterThanOrEqual(dialogBox!.x);
      expect(
        box.x + box.width,
        `control #${i} clips on the right of the dialog`,
      ).toBeLessThanOrEqual(dialogBox!.x + dialogBox!.width + 1);
    }

    // The form itself should not produce horizontal scroll inside the dialog.
    const overflow = await dialog.evaluate((node) => {
      const el = node as HTMLElement;
      return { sw: el.scrollWidth, cw: el.clientWidth };
    });
    expect(
      overflow.sw,
      "dialog has no horizontal overflow",
    ).toBeLessThanOrEqual(overflow.cw + 1);
  });

  test("video meeting date strip and time grid are reachable on small screens", async ({ page }) => {
    const dialog = await openBookingDialog(page);

    await dialog.getByLabel(/name|namn|nombre/i).fill("Jane Doe");
    await dialog.getByLabel(/company|företag|empresa/i).fill("Nordisk VVS AB");
    await dialog.getByLabel(/email|e-post/i).fill("jane@example.com");
    await dialog.getByLabel(/mobile|mobilnummer|móvil/i).fill("+46 70 123 45 67");
    await dialog.getByRole("button", { name: /continue|fortsätt|continuar/i }).click();
    await dialog.getByLabel(/missed calls|missade samtal|llamadas perdidas/i).fill("5");
    await dialog.getByLabel(/contact method|kontaktväg|método de contacto/i).selectOption("video");

    // Date pills live in a horizontally scrollable strip — at least the
    // first pill must be visible without horizontal page scroll.
    const firstDate = dialog.locator("button").filter({ hasText: /\d/ }).first();
    await expect(firstDate).toBeVisible();

    // Time slots — pick a known slot and ensure it's in the dialog box.
    const slot = dialog.getByRole("button", { name: "09:00", exact: true });
    await expect(slot).toBeVisible();
    const slotBox = await slot.boundingBox();
    const dialogBox = await dialog.boundingBox();
    expect(slotBox!.x + slotBox!.width).toBeLessThanOrEqual(
      dialogBox!.x + dialogBox!.width + 1,
    );
  });
});
