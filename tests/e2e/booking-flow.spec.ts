import { test, expect, type Page } from "@playwright/test";

/**
 * End-to-end test: click "Book demo", fill out and submit the booking,
 * and assert the success/summary step renders correctly on both mobile
 * and desktop. The POST /api/public/leads call is intercepted so the
 * test does not depend on backend availability.
 */

async function openAndFill(page: Page) {
  await page.route("**/api/public/leads", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, id: "test-lead-id" }),
    });
  });

  await page.goto("/");
  await page
    .getByRole("button", { name: /book\s*demo|boka\s*demo|reservar\s*demo/i })
    .first()
    .click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // Fill required text fields by their labels (i18n-aware).
  await dialog
    .getByLabel(/name|namn|nombre/i)
    .fill("Jane Doe");
  await dialog
    .getByLabel(/company|företag|empresa/i)
    .fill("Aurora Clinic");
  await dialog
    .getByLabel(/phone|telefon|teléfono/i)
    .fill("+45 22 33 44 55");

  // Pick the first date pill (date strip auto-defaults to first too,
  // but clicking confirms interaction works at this viewport).
  const dateButtons = dialog.locator("button").filter({ hasText: /\d/ });
  await dateButtons.first().click();

  // Pick a known time slot.
  await dialog.getByRole("button", { name: "10:00" }).click();

  // Submit.
  await dialog
    .getByRole("button", { name: /request call|begär samtal|solicitar llamada/i })
    .click();

  return dialog;
}

async function assertSummaryAligned(page: Page, dialog: ReturnType<Page["getByRole"]>) {
  // Success heading.
  const success = dialog.getByText(
    /request received|förfrågan mottagen|solicitud recibida/i,
  );
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
  expect(doneBox!.x + doneBox!.width).toBeLessThanOrEqual(
    dialogBox!.x + dialogBox!.width + 1,
  );
}

test.describe("Booking flow end-to-end", () => {
  test("submits booking and shows the summary step aligned", async ({ page }) => {
    const dialog = await openAndFill(page);
    await assertSummaryAligned(page, dialog);
  });
});
