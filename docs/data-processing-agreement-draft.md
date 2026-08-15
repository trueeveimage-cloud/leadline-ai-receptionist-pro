# Data-processing agreement draft

> Internal Article 28 GDPR draft, not legal advice. It contains intentional blockers and must not be signed until the parties, processing details, subprocessors, locations, safeguards, retention periods, and security measures are verified. IMY's Article 28 guidance and the European Commission controller-processor clauses should be used during legal review.

Review sources: [IMY Article 28 guidance](https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/personuppgiftsansvariga-och-personuppgiftsbitraden/personuppgiftsbitradesavtal/) and [European Commission controller-processor clauses](https://eur-lex.europa.eu/legal-content/en/ALL/?uri=CELEX%3A32021D0915).

## 1. Parties and roles

**Controller:** [CUSTOMER LEGAL NAME], [CUSTOMER ORGANISATION NUMBER], [CUSTOMER ADDRESS].

**Processor:** [LEGAL COMPANY NAME], [ORGANISATION NUMBER], [BUSINESS ADDRESS] ("Leadmap").

The Controller determines why the caller data is processed and the essential means. Leadmap processes it only for the documented VVS call-answering and handoff service.

## 2. Subject, duration, nature, and purpose

- Subject: answering selected calls, asking approved questions, creating transcripts or summaries where enabled, and sending approved handoffs.
- Duration: the service term plus the verified deletion/export period.
- Nature: collection, structuring, temporary storage, retrieval, summarisation, transmission, restriction, and deletion.
- Purpose: provide the Customer's approved call flow and operational handoff. Data may not be used to train a general model or for Leadmap advertising unless separately documented and lawful.

## 3. Data and data subjects

Potential personal data: caller name, phone number, email, service address or municipality, free-text service need, urgency, preferred callback time, voice recording if enabled, transcript, summary, and technical logs.

Data subjects: callers, prospective customers, Customer staff, and other persons mentioned during a call.

The pilot must instruct callers not to provide special-category data, payment-card data, passwords, identity documents, or unnecessary information. Unexpected sensitive information is handled under the incident and deletion procedures.

## 4. Documented instructions

Leadmap processes personal data only according to the signed order form, onboarding questionnaire, approved call-flow document, and later written instructions. If an instruction appears to violate applicable data-protection law, Leadmap informs the Controller without undue delay and may pause the affected processing.

## 5. Confidentiality and access

Personnel and contractors with access must be bound by confidentiality, use individual accounts, receive only the access necessary for their role, and lose access promptly when it is no longer required.

## 6. Security measures

The final agreement must attach verified measures covering:

- encryption in transit and at rest where supported;
- service-role secrets kept server-side and least-privilege database access;
- MFA for production administration;
- logging and review of privileged access;
- rate limits and abuse controls;
- backup and restoration arrangements;
- deletion and retention jobs;
- incident detection and escalation;
- separation of demo data from customer production data;
- recurring review of the AI script, summaries, and human fallback.

## 7. Subprocessors

General written authorisation is proposed for the verified list below. Leadmap must notify the Controller before adding or replacing a subprocessor and provide a reasonable objection period.

| Subprocessor                 | Purpose                                                            | Processing location                | Transfer safeguard     | Status  |
| ---------------------------- | ------------------------------------------------------------------ | ---------------------------------- | ---------------------- | ------- |
| Retell AI                    | Voice-agent infrastructure                                         | [SUBPROCESSOR LOCATION TO CONFIRM] | [SAFEGUARD TO CONFIRM] | Blocked |
| Supabase                     | Database and authentication                                        | [SUBPROCESSOR LOCATION TO CONFIRM] | [SAFEGUARD TO CONFIRM] | Blocked |
| Hosting provider             | Application hosting                                                | [SUBPROCESSOR LOCATION TO CONFIRM] | [SAFEGUARD TO CONFIRM] | Blocked |
| Transactional email provider | Handoff delivery                                                   | [SUBPROCESSOR LOCATION TO CONFIRM] | [SAFEGUARD TO CONFIRM] | Blocked |
| Google Calendar/Meet         | Demo scheduling only, unless separately enabled for customer calls | [SUBPROCESSOR LOCATION TO CONFIRM] | [SAFEGUARD TO CONFIRM] | Blocked |

Equivalent Article 28 obligations must flow down to each subprocessor. Leadmap remains responsible for its subprocessors as required by law.

## 8. International transfers

Personal data may not be transferred outside the EEA unless the transfer mechanism, destination, subprocessor, supplementary measures, and Controller instruction are documented. The final subprocessor appendix must identify each relevant transfer.

## 9. Assistance and rights

Leadmap assists the Controller, taking account of the processing and available information, with access, correction, deletion, restriction, portability, objections, security assessments, and supervisory-authority enquiries. Requests received directly from a caller are forwarded to the Controller unless law requires another response.

## 10. Incidents

Leadmap notifies the Controller without undue delay after becoming aware of a personal-data breach and supplies available information about the nature, affected data and people, likely consequences, containment, remediation, and contact point. The final agreement must specify the operational contact and target notification window: [INCIDENT WINDOW TO CONFIRM].

## 11. Audit and compliance information

Leadmap supplies information reasonably necessary to demonstrate compliance and permits proportionate audits under agreed confidentiality, security, timing, and cost conditions. An audit may not expose another customer's data or weaken system security.

## 12. Return and deletion

At termination, Leadmap returns or deletes personal data according to the Controller's documented choice unless law requires retention. Production retention values remain blocked until verified:

- Audio: [RETENTION TO CONFIRM]
- Transcripts: [RETENTION TO CONFIRM]
- Summaries/handoffs: [RETENTION TO CONFIRM]
- Security and delivery logs: [RETENTION TO CONFIRM]
- Backups: [RETENTION TO CONFIRM]

Deletion must include active systems and expiry from backups under the documented backup cycle.

## 13. Signatures

| Controller   | Processor    |
| ------------ | ------------ |
| Name: [NAME] | Name: [NAME] |
| Role: [ROLE] | Role: [ROLE] |
| Date: [DATE] | Date: [DATE] |
| Signature:   | Signature:   |
