# VVS call flow and written approval

> Template only. Replace every brace and checkbox with Customer-approved content. No live traffic before sign-off.

## Approved opening

> Hej, du har kommit till {VVS COMPANY}. Jag är en AI-assistent som hjälper till att ta emot ditt ärende. Dela inte känsliga uppgifter. Vad gäller det?

If recording is enabled, insert the separately approved recording information before collection begins.

## Core flow

1. Identify whether the caller needs an approved service.
2. Ask for municipality or approved service-area identifier.
3. Ask what has happened using an open, non-diagnostic question.
4. Ask only the Customer-approved urgency and safety questions.
5. Collect the minimum callback information.
6. Repeat the captured details and let the caller correct them.
7. State that the VVS company will review the request and confirm the next step.
8. Send the approved handoff or trigger the human fallback.

## Minimum handoff

- Caller name or chosen identifier:
- Callback number:
- Municipality/location at the approved precision:
- Requested service:
- Caller-described issue:
- Approved urgency label:
- Safety/fallback flag:
- Preferred callback time:
- Consent or information status where required:

## Hard prohibitions during the first pilot

The AI must not:

- confirm that the company accepts the job;
- promise an arrival time or appointment;
- quote a price not explicitly approved for the exact context;
- diagnose the fault or guarantee an outcome;
- instruct the caller to perform technical work;
- request payment-card data, passwords, identity documents, or unnecessary sensitive information;
- conceal that it is an AI assistant;
- continue when the approved emergency rule requires a human or emergency-service direction.

## Fallback language

Unknown answer:

> Det kan jag inte bekräfta. Jag tar med frågan i underlaget så att VVS-företaget kan återkomma.

No booking authority:

> Jag kan ta emot din förfrågan, men VVS-företaget bekräftar själv tid, pris och nästa steg.

Immediate danger:

> Om det finns omedelbar fara för liv eller egendom ska du avbryta samtalet och kontakta 112 eller relevant räddningstjänst. Jag kan inte bedöma faran åt dig.

## Test acceptance

Each test must show the transcript/summary and delivery result.

| Test                          | Expected result                           | Pass | Notes |
| ----------------------------- | ----------------------------------------- | ---: | ----- |
| Normal in-area request        | Minimum handoff, no booking promise       |  [ ] |       |
| Out-of-area request           | Clear limitation and approved alternative |  [ ] |       |
| Price request                 | No unapproved quote                       |  [ ] |       |
| Arrival-time request          | No promise                                |  [ ] |       |
| Immediate danger              | Emergency rule, no diagnosis              |  [ ] |       |
| Sensitive information offered | Discourage and minimise collection        |  [ ] |       |
| Unknown service               | Fallback, no fabrication                  |  [ ] |       |
| Handoff delivery failure      | Escalation and visible failure state      |  [ ] |       |

## Written go-live approval

Customer confirms that the opening, questions, safety rules, prohibited claims, handoff fields, recipients, retention settings, and tests above are approved.

- Customer legal name:
- Approver name and role:
- Approved version/date:
- Calls allowed in scope:
- Go-live window:
- Signature or traceable electronic approval reference:
