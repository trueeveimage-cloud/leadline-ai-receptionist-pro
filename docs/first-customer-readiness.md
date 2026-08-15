# Leadmap first-customer readiness

This is the operating index for work that must be complete before signing or connecting the first VVS customer. Advertising approval is separate.

## Automated checks

Run the production integration check:

```bash
npm run preflight:prod
```

The production check includes Calendar access, Data Manager OAuth scope, required voice/tag settings, and anonymous Supabase isolation. It performs no writes.

Run the commercial and document check:

```bash
npm run preflight:business
```

Run the domain and email-DNS check:

```bash
npm run preflight:domain
```

Run unit economics with the actual configured voice, model, and telephony cost:

```bash
npm run economics -- --plan pilot --cost 1.20 --shared 300 --minutes 500 --cac 0
npm run economics -- --plan premium --cost 1.20 --shared 300 --minutes 1500 --cac 0
```

The calculator exits with a non-zero status when the target gross margin fails or the 2.50 SEK/minute overage is below the real blended minute cost.

## First-customer pack

1. [Order form draft](./vvs-pilot-order-form-draft.md)
2. [Data-processing agreement draft](./data-processing-agreement-draft.md)
3. [Onboarding questionnaire](./vvs-onboarding-questionnaire.md)
4. [Call flow and written approval](./vvs-call-flow-and-approval.md)
5. [Seven-day pilot scorecard](./vvs-pilot-scorecard.md)
6. [Invoice readiness checklist](./invoice-readiness-checklist.md)
7. [Sales and proof playbook](./first-vvs-pilot-sales-playbook.md)

## Hard gates

- Do not sign while the legal identity or VAT status is a placeholder.
- Do not sell Premium until the real included-usage margin passes the configured threshold.
- Do not connect live calls until the Customer signs the call-flow approval.
- Do not enable recording or transcription until legal basis, caller information, retention, access, deletion, and subprocessor settings are documented.
- Do not publish pilot results without source evidence and written Customer approval.
- Do not present local checks as proof that production credentials, delivery, or provider billing work.

## Official review sources

- [IMY: personuppgiftsbiträdesavtal](https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/personuppgiftsansvariga-och-personuppgiftsbitraden/personuppgiftsbitradesavtal/)
- [European Commission controller-processor standard clauses](https://eur-lex.europa.eu/legal-content/en/ALL/?uri=CELEX%3A32021D0915)
- [Skatteverket: fakturans innehåll](https://www.skatteverket.se/foretagochorganisationer/moms/saljavarorochtjanster/fakturering.4.58d555751259e4d66168000403.html)
- [IMY: access to voice recordings](https://www.imy.se/vanliga-fragor-och-svar/har-jag-ratt-att-ta-del-av-en-ljudinspelning-dar-min-rost-forekommer/)
