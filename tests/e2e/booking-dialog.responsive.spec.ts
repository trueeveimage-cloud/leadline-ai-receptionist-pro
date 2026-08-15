import { test, expect, type Page } from "@playwright/test";

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
  await page.route("**/api/public/availability", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        preview: false,
        timezone: "Europe/Stockholm",
        slots: [
          {
            date: "2026-07-15",
            time: "10:00",
            startsAt: "2026-07-15T08:00:00.000Z",
            endsAt: "2026-07-15T08:30:00.000Z",
          },
          {
            date: "2026-07-16",
            time: "13:00",
            startsAt: "2026-07-16T11:00:00.000Z",
            endsAt: "2026-07-16T11:30:00.000Z",
          },
        ],
      }),
    });
  });
  await page.route("**/api/public/marketing-events", async (route) => {
    await route.fulfill({ status: 202, contentType: "application/json", body: "{}" });
  });
  await page.goto("/");
  const consent = page.getByRole("button", { name: "Endast nödvändiga" });
  await consent.waitFor({ state: "visible" });
  await consent.click();

  // The primary hero CTA is now the audit. Demo booking remains available
  // in the pricing section.
  const pricing = page.locator("#pricing");
  await pricing.scrollIntoViewIfNeeded();
  const cta = pricing
    .getByRole("button", { name: /book\s*demo|boka\s*demo|reservar\s*demo/i })
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
      const isInHorizontalScroller = await el.evaluate((node) =>
        Boolean(node.closest(".overflow-x-auto")),
      );
      if (isInHorizontalScroller) continue;
      const box = await el.boundingBox();
      if (!box) continue;
      // Allow 1px sub-pixel tolerance.
      expect(box.x + 1, `control #${i} clips on the left of the dialog`).toBeGreaterThanOrEqual(
        dialogBox!.x,
      );
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
    expect(overflow.sw, "dialog has no horizontal overflow").toBeLessThanOrEqual(overflow.cw + 1);
  });

  test("date strip and time grid are reachable on small screens", async ({ page }) => {
    const dialog = await openBookingDialog(page);

    await dialog.getByRole("textbox", { name: /namn|name/i }).fill("Anna Andersson");
    await dialog.getByRole("textbox", { name: /företag|company/i }).fill("Demo VVS AB");
    await dialog.getByRole("textbox", { name: /e-post|email/i }).fill("anna@demo-vvs.se");
    for (const checkbox of await dialog.getByRole("checkbox").all()) await checkbox.check();
    await dialog.getByRole("button", { name: /fortsätt|continue/i }).click();

    // Date pills live in a horizontally scrollable strip — at least the
    // first pill must be visible without horizontal page scroll.
    const firstDate = dialog.getByRole("button", { name: /ons|wed/i }).first();
    await expect(firstDate).toBeVisible();

    // Time slots — pick a known slot and ensure it's in the dialog box.
    const slot = dialog.getByRole("button", { name: "10:00" });
    await expect(slot).toBeVisible();
    const slotBox = await slot.boundingBox();
    const dialogBox = await dialog.boundingBox();
    expect(slotBox!.x + slotBox!.width).toBeLessThanOrEqual(dialogBox!.x + dialogBox!.width + 1);
  });
});
