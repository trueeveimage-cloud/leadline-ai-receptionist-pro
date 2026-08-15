import { test, expect, type Page } from "@playwright/test";

/**
 * End-to-end test: click "Book demo", fill out and submit the booking,
 * and assert the success/summary step renders correctly on both mobile
 * and desktop. The POST /api/public/leads call is intercepted so the
 * test does not depend on backend availability.
 */

async function openAndFill(page: Page) {
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
        ],
      }),
    });
  });
  await page.route("**/api/public/leads", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        bookingId: "test-booking-id",
        startsAt: "2026-07-15T08:00:00.000Z",
        endsAt: "2026-07-15T08:30:00.000Z",
        meetUrl: "https://meet.google.com/test-demo",
      }),
    });
  });
  await page.route("**/api/public/marketing-events", async (route) => {
    await route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/");
  const consent = page.getByRole("button", { name: "Endast nödvändiga" });
  await consent.waitFor({ state: "visible" });
  await consent.click();

  const pricing = page.locator("#pricing");
  await pricing.scrollIntoViewIfNeeded();
  await pricing
    .getByRole("button", { name: /book\s*demo|boka\s*demo|reservar\s*demo/i })
    .first()
    .click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // Qualify first. Availability is not shown before these details are valid.
  await dialog.getByRole("textbox", { name: /name|namn|nombre/i }).fill("Jane Doe");
  await dialog.getByRole("textbox", { name: /company|företag|empresa/i }).fill("Demo VVS AB");
  await dialog.getByRole("textbox", { name: /e-post|email/i }).fill("jane@demo-vvs.se");
  await dialog.getByRole("textbox", { name: /phone|telefon|teléfono/i }).fill("+46 70 123 45 67");
  for (const checkbox of await dialog.getByRole("checkbox").all()) await checkbox.check();

  await dialog.getByRole("button", { name: /continue|fortsätt/i }).click();
  await dialog.getByRole("button", { name: "10:00" }).click();

  await dialog.getByRole("button", { name: /continue|fortsätt/i }).click();

  // Submit.
  await dialog.getByRole("button", { name: /confirm meeting|bekräfta mötet/i }).click();

  return dialog;
}

async function assertSummaryAligned(page: Page, dialog: ReturnType<Page["getByRole"]>) {
  // Success heading.
  const success = dialog.getByText(/meeting is confirmed|mötet är bekräftat/i);
  await expect(success).toBeVisible({ timeout: 5_000 });

  // The "Done" CTA should render and be horizontally centered within
  // the dialog (the success step uses text-center + mx-auto).
  const done = dialog.getByRole("button", { name: /done|klar|listo/i });
  await expect(done).toBeVisible();

  const dialogBox = await dialog.boundingBox();
  const doneBox = await done.boundingBox();
  expect(dialogBox && doneBox).toBeTruthy();

  const dialogCenter = dialogBox!.x + dialogBox!.width / 2;
  const doneCenter = doneBox!.x + doneBox!.width / 2;
  // Allow generous tolerance for shadow / padding rounding.
  expect(
    Math.abs(dialogCenter - doneCenter),
    "Done button is roughly centered in the dialog",
  ).toBeLessThan(dialogBox!.width * 0.15);

  // The summary must not horizontally clip.
  expect(doneBox!.x).toBeGreaterThanOrEqual(dialogBox!.x);
  expect(doneBox!.x + doneBox!.width).toBeLessThanOrEqual(dialogBox!.x + dialogBox!.width + 1);
}

test.describe("Booking flow end-to-end", () => {
  test("submits booking and shows the summary step aligned", async ({ page }) => {
    const dialog = await openAndFill(page);
    await assertSummaryAligned(page, dialog);
  });
});
