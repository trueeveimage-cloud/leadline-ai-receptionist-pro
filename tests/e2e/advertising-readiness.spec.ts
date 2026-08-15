import { expect, test, type Page } from "@playwright/test";

async function stubMarketingEvents(page: Page) {
  await page.route("**/api/public/marketing-events", async (route) => {
    await route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });
}

async function rejectOptionalMeasurement(page: Page) {
  const button = page.getByRole("button", {
    name: /endast nödvändiga|essential only/i,
  });
  try {
    await button.waitFor({ state: "visible", timeout: 10_000 });
    await button.click();
  } catch {
    // A stored choice means the banner does not render in this browser context.
  }
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.removeItem("leadmap-marketing-consent");
  });
  await stubMarketingEvents(page);
});

test("Google measurement loads only after explicit consent", async ({ page }) => {
  const tagId = process.env.VITE_GOOGLE_TAG_ID;
  test.skip(!tagId, "Set VITE_GOOGLE_TAG_ID to exercise consent-aware tag loading.");
  await page.route("https://www.googletagmanager.com/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });

  await page.goto("/");
  await expect(page.locator("script[data-leadmap-google-tag]")).toHaveCount(0);
  await page.getByRole("button", { name: "Godkänn mätning" }).click();

  await expect(page.locator("script[data-leadmap-google-tag]")).toHaveAttribute(
    "data-leadmap-google-tag",
    tagId!,
  );
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("leadmap-marketing-consent")))
    .toBe("granted");
  const consentUpdates = await page.evaluate(() =>
    (window.dataLayer || []).filter(
      (entry) => Array.isArray(entry) && entry[0] === "consent" && entry[1] === "update",
    ),
  );
  expect(consentUpdates).toHaveLength(1);
});

test("Swedish homepage presents the VVS audit offer and consistent pricing", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "sv");
  await expect(
    page.getByRole("heading", { level: 1, name: "Missa inte nästa VVS-jobb." }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Endast nödvändiga" })).toBeVisible({
    timeout: 10_000,
  });
  await expect(page.locator("script[data-leadmap-google-tag]")).toHaveCount(0);
  await rejectOptionalMeasurement(page);

  const pricing = page.locator("#pricing");
  await pricing.scrollIntoViewIfNeeded();
  await expect(pricing.getByText("2 900", { exact: true })).toBeVisible();
  await expect(pricing.getByText("4 900", { exact: true })).toBeVisible();
  await expect(pricing).toContainText("2,5 kr/min");
  await expect(pricing).toContainText("30 dagars uppsägning");
  await expect(page.locator("body")).not.toContainText("$");

  const viewport = page.viewportSize();
  if (viewport && viewport.width < 768) {
    await expect(page.locator("footer a.fixed")).toBeVisible();
  }
  await expectNoHorizontalOverflow(page);
});

test("English homepage is routed under /en", async ({ page }) => {
  await page.goto("/en");

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Never miss the next valuable plumbing job.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Essential only" })).toBeVisible({
    timeout: 10_000,
  });
  await rejectOptionalMeasurement(page);
  await expect(page.locator("#pricing")).toContainText("2,900");
  await expect(page.locator("#pricing")).toContainText("4,900");
  await expectNoHorizontalOverflow(page);
});

test("VVS campaign landing page labels simulated evidence truthfully", async ({ page }) => {
  await page.goto("/anvandningsfall/vvs");
  await rejectOptionalMeasurement(page);

  await expect(
    page.getByRole("heading", { level: 1, name: "Missa inte nästa VVS-jobb." }),
  ).toBeVisible();
  await expect(page.getByText("Simulerat VVS-samtal", { exact: true })).toBeVisible();
  await expect(page.getByText("Simulerat · inget ljud", { exact: true })).toBeVisible();
  await expect(page.getByText("Demo · syntetiska uppgifter", { exact: true })).toBeVisible();
  await expect(page.locator("main")).toContainText("2 900 kr/mån");
  await expect(page.locator("main")).toContainText("4 900 kr/mån");
  await expect(page.locator("main")).toContainText("Vi gör uppstarten. Ni godkänner reglerna.");
  await expect(page.locator("main")).toContainText("Ingen livekoppling innan ni är trygga.");
  await expect(page.locator("main")).toContainText("Pilotöversikt · exempeldata");
  await expect(page.locator("main")).toContainText(
    "Panelen här visar strukturen, inte verkliga kundresultat.",
  );
  const schemaText = await page
    .locator('script[type="application/ld+json"]')
    .evaluate((element) => element.textContent || "");
  expect(schemaText).toContain("Behöver vi byta telefonnummer?");
  expect(schemaText).toContain("Vad händer om vi inte godkänner testflödet?");
  await expectNoHorizontalOverflow(page);
});

test("audit submits only required fields with persisted campaign attribution", async ({ page }) => {
  let auditPayload: Record<string, unknown> | undefined;
  await page.route("**/api/public/audit-submissions", async (route) => {
    auditPayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto(
    "/missade-samtal-audit?utm_source=google&utm_medium=cpc&utm_campaign=vvs_stockholm&utm_term=jour_vvs&utm_content=ad_a&gclid=test-gclid&gbraid=test-gbraid&wbraid=test-wbraid&fbclid=test-fbclid",
  );
  await rejectOptionalMeasurement(page);

  await page.getByLabel("Företagsnamn").fill("Demo VVS AB");
  await page.getByLabel("Kontaktperson").fill("Anna Svensson");
  await page.getByLabel("Telefon eller e-post").fill("anna@demo-vvs.se");
  await page.getByRole("button", { name: "Skicka förfrågan" }).click();

  await expect.poll(() => Boolean(auditPayload)).toBe(true);
  await expect(page.getByRole("status")).toContainText("Audit klar", { timeout: 10_000 });
  await expect(page.getByRole("status")).toContainText("Ett säkert första VVS-flöde");
  await expect(page.getByRole("button", { name: "Visa bekräftade mötestider" })).toBeDisabled();
  await expect(page.getByText("Vad kan missade samtal vara värda för er?")).toBeVisible();
  expect(auditPayload).toMatchObject({
    businessName: "Demo VVS AB",
    ownerName: "Anna Svensson",
    contact: "anna@demo-vvs.se",
    city: "",
    website: "",
    missedCallsPerWeek: "",
    niche: "VVS",
    advertisingConsent: false,
    landing_path: "/missade-samtal-audit",
    page_type: "audit",
    cta_variant: "audit_form",
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "vvs_stockholm",
    utm_term: "jour_vvs",
    utm_content: "ad_a",
    gclid: "test-gclid",
    gbraid: "test-gbraid",
    wbraid: "test-wbraid",
    fbclid: "test-fbclid",
  });
  expect(auditPayload?.submissionId).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  );
});

test("local availability enforces the Stockholm booking rules", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One server-side rules check is sufficient.");
  const response = await request.get("/api/public/availability");
  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as {
    preview?: boolean;
    timezone?: string;
    rules?: {
      meetingMinutes?: number;
      bufferMinutes?: number;
      minimumNoticeHours?: number;
      maximumDemosPerDay?: number;
    };
    slots?: Array<{ date: string; time: string; startsAt: string; endsAt: string }>;
  };
  expect(body.preview).toBe(true);
  expect(body.timezone).toBe("Europe/Stockholm");
  expect(body.rules).toMatchObject({
    meetingMinutes: 30,
    bufferMinutes: 15,
    minimumNoticeHours: 12,
    maximumDemosPerDay: 2,
  });
  expect(body.slots?.length).toBeGreaterThan(0);
  for (const slot of body.slots || []) {
    expect(["10:00", "11:00", "13:00", "14:00", "15:00"]).toContain(slot.time);
    expect(new Date(slot.endsAt).getTime() - new Date(slot.startsAt).getTime()).toBe(30 * 60_000);
  }
});

test("public endpoints reject foreign browser origins", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One server-side origin check is sufficient.");
  const response = await request.post("/api/public/voice-demo-sessions", {
    headers: { Origin: "https://malicious.example", "Content-Type": "application/json" },
    data: { language: "sv", disclosureAccepted: true },
  });
  expect(response.status()).toBe(403);
});

test("thin city pages are noindex and excluded from the sitemap", async ({
  page,
  request,
}, testInfo) => {
  await page.goto("/ai-telefonist/vvs/stockholm");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");

  if (testInfo.project.name === "desktop") {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const xml = await sitemap.text();
    expect(xml).toContain("https://www.leadmap.se/anvandningsfall/vvs");
    expect(xml).not.toContain("/ai-telefonist/");
  }
});
