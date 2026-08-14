import { test, expect, type Page } from "@playwright/test";

test.setTimeout(60_000);

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
  await page.waitForLoadState("networkidle");
  await page
    .getByRole("button", { name: /book.*demo|boka.*demo|reservar.*demo/i })
    .first()
    .click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // Fill required company and contact fields.
  await dialog
    .getByLabel(/name|namn|nombre/i)
    .fill("Jane Doe");
  await dialog
    .getByLabel(/company|företag|empresa/i)
    .fill("Nordisk VVS AB");
  await dialog
    .getByLabel(/email|e-post/i)
    .fill("jane@example.com");
  await dialog
    .getByLabel(/mobile|mobilnummer|móvil/i)
    .fill("+46 70 123 45 67");

  await dialog.getByRole("button", { name: /continue|fortsätt|continuar/i }).click();
  await dialog
    .getByLabel(/missed calls|missade samtal|llamadas perdidas/i)
    .fill("5-10");
  await dialog.getByRole("button", { name: /continue|fortsätt|continuar/i }).click();
  await dialog.getByRole("checkbox").check({ force: true });

  // Submit.
  await dialog
    .getByRole("button", { name: /send request|skicka förfrågan|enviar solicitud/i })
    .click({ force: true });

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
