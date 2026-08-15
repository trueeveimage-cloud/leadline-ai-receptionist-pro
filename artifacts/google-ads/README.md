# Leadmap VVS Google Search import package

This package is intentionally paused. Importing it must not be treated as approval to post or enable the campaign.

## Files

- `leadmap-vvs-search-build.csv`: campaign, ad groups, exact/phrase keywords, campaign negatives, and two responsive search ads.
- `leadmap-vvs-assets.csv`: campaign-level sitelinks and callouts.
- `campaign-spec.json`: machine-readable settings and operating rules used by the local control room.

## Account settings that must be verified in Google Ads before posting

1. Billing country `Sweden`, currency `SEK`, timezone `Europe/Stockholm`.
2. Campaign name `SE | Search | VVS | Gratis samtalsaudit | 30D` and status `Paused`.
3. Search Network only. Disable Search Partners and Display.
4. Target Sweden using **Presence: people in or regularly in the location**, not Presence or Interest.
5. Languages Swedish and English; ads remain Swedish.
6. Schedule daily 06:00–23:00.
7. Auto-tagging enabled and final URL suffix:
   `utm_source=google&utm_medium=cpc&utm_campaign=se_vvs_search_30d&utm_term={keyword}&utm_content={creative}&matchtype={matchtype}&device={device}&network={network}`
8. Run Keyword Planner. Set the Maximize Clicks CPC cap to `min(60, max(25, median low-range top-of-page bid))` SEK.
9. If the forecast is below 50 clicks at 4,000 SEK, leave the campaign paused.
10. Configure a 4,000 SEK campaign total budget for 30 days. The CSV uses a paused 131.50 SEK daily placeholder because account availability for total budgets must be confirmed in the UI.
11. Pin only Headline 1 in each responsive search ad.
12. Primary conversions: `audit_submit` and calendar-confirmed `demo_booked`, counted once per click.
13. Do not enable call assets, Google lead forms, competitor terms, broad match, Performance Max, Display, Meta, Microsoft, or LinkedIn in this test.

## Approval gates

- Approval A: website/backend deployment and migration only.
- Approval B: campaign posting/enabling and exposure of the 4,000 SEK budget.

No Google Ads account, billing profile, campaign, payment method, or spend was created by this local implementation.
