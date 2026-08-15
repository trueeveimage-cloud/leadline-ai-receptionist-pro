# Seven-day VVS pilot scorecard

Use facts from the real pilot. Do not convert this template into a public claim without the Customer's explicit written approval.

## Pilot identity

- Customer:
- Pilot dates:
- Approved call-flow version:
- Calls in scope:
- Included minutes / used minutes:
- Reviewer:

## Operational results

| Metric                      | Result | Source               |
| --------------------------- | -----: | -------------------- |
| Calls offered to Leadmap    |        | Provider log         |
| Calls answered              |        | Provider log         |
| Completed handoffs          |        | Delivery log         |
| Qualified callback requests |        | Reviewed summaries   |
| Manual-review flags         |        | QA log               |
| Failed handoffs             |        | Delivery log         |
| Duplicate or test calls     |        | QA log               |
| Average call duration       |        | Provider log         |
| Minutes consumed            |        | Provider invoice/log |

## Quality review

| Check                                   | Pass/Fail | Evidence and correction |
| --------------------------------------- | --------- | ----------------------- |
| AI disclosure occurred                  |           |                         |
| No unapproved booking promise           |           |                         |
| No unapproved price or arrival promise  |           |                         |
| Required fields captured when available |           |                         |
| Urgency label followed approved rules   |           |                         |
| Sensitive data was minimised            |           |                         |
| Human fallback worked                   |           |                         |
| Handoff reached the approved recipient  |           |                         |

Any safety incident, hidden AI identity, unauthorised promise, or unreported delivery failure requires immediate pause and review.

## Customer usefulness

- Handoffs the Customer considered useful:
- Handoffs the Customer considered noise:
- Median owner callback time, if measurable:
- Calls that would otherwise have reached voicemail, if verifiable:
- Customer-approved feedback:
- Limitations in the evidence:

## Unit economics

- Monthly plan revenue:
- Setup revenue:
- Actual voice/AI cost:
- Telephony cost:
- Allocated platform cost:
- Gross profit before owner labour:
- Gross margin:
- Owner review time:

Run the calculator with the actual cost:

```bash
npm run economics -- --plan pilot --cost 1.20 --shared 300 --minutes 500 --cac 0
```

## Decision

- [ ] Continue unchanged
- [ ] Continue after listed corrections
- [ ] Extend evaluation because volume was insufficient
- [ ] Stop because safety or usefulness is inadequate
- [ ] Reprice because gross margin is below target

Decision owner, date, and rationale:
