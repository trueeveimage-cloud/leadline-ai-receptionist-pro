# Conversion-focused homepage refresh

Goal: get more service-business owners to click **Book demo** without changing the brand or visual style.

## Diagnosis — what's hurting conversion today

Current order: Hero → Stats → Marquee → Process → **Pain** → Pricing → FAQ → FinalCTA.

1. **Pain comes after Process.** Classic landing-page flow is *Hook → Pain → Solution → Proof → Offer → Objections → CTA*. Right now you explain *how it works* before the visitor feels *why they need it*. They bounce before reaching pricing.
2. **No "what you actually get" section.** Process tells the steps, but there's no visual of the product (call transcript, SMS summary, dashboard). Visitors can't picture the outcome.
3. **No testimonials / named customers.** Stats and a logo marquee help, but a real quote from a plumber or clinic owner is 10× more persuasive for this audience.
4. **Pricing has no risk reversal.** No "7-day pilot", "no setup fee", "cancel anytime", or money-back line near the price = hesitation.
5. **One CTA verb everywhere.** "Book demo" is fine, but a secondary low-commitment CTA ("Hear a 60-sec sample call") captures visitors not ready to talk to sales.
6. **FAQ is generic.** Only 3 questions, none address the real objections (price, AI sounding robotic, missed nuance, language support, integration with existing number).
7. **Hero subtitle is feature-led, not outcome-led.** "Answers calls, collects details…" → reframe around money saved / jobs won.
8. **No urgency or scarcity.** "Live in 7 days" is buried — should be a hero badge.

## Proposed new flow

```text
Hero  (outcome headline + sample-call CTA next to Book demo)
  ↓
Pain  (moved up — agitate the missed-call cost)
  ↓
Solution / Product preview  (NEW — show the SMS summary + transcript)
  ↓
Process  (3 steps, kept)
  ↓
Stats + Marquee  (consolidated into one trust band)
  ↓
Testimonials  (NEW — 2-3 quotes, even if from pilot users)
  ↓
Pricing  (+ risk-reversal strip: "7-day pilot · no setup fee · cancel anytime")
  ↓
FAQ  (expanded to 6-8, objection-focused)
  ↓
FinalCTA  (sharpened)
```

## Concrete changes

### 1. Hero
- Rewrite headline to outcome: *"Stop losing jobs to missed calls."*
- Subtitle: *"Leadmap's AI receptionist answers every call, qualifies the lead, and texts you a booking-ready summary. Live in 7 days."*
- Two CTAs: primary **Book demo**, secondary **Hear a sample call** (opens a 60s audio modal).
- Add a tiny trust strip under the CTAs: "⭐ Built in Sweden · 🇸🇪🇬🇧🇪🇸 Speaks 3 languages · Live in 7 days".

### 2. Move Pain above Process
Just reorder in `src/routes/index.tsx`. No new code.

### 3. New Solution / Product preview section
Reuse `ConversationPreview.tsx` (already exists). Show the SMS lead summary on phone mockup + a transcript snippet side-by-side. Caption: *"This is what lands in your phone after every call."*

### 4. Testimonials section (NEW)
3 cards with quote, name, business type, city. If no real ones yet, mark them as pilot users — but get at least one real quote before publishing.

### 5. Pricing
- Add a horizontal strip directly above the cards: **"7-day pilot · no setup fee · cancel anytime · keep your number"**.
- Add a small "Most popular" tag on the Premium card.
- Add micro-copy under each price: e.g. *"≈ cost of one missed job per month."*

### 6. FAQ expansion
Add: *Will it sound robotic? · Does it work with my current phone number? · What languages does it speak? · What happens if it can't answer a question? · Can I listen to past calls?*

### 7. Final CTA
Change from generic to specific: *"See it answer a call about your business — book a 15-min demo."*

## Out of scope for this plan
- New brand/colors/typography (kept as-is)
- Backend or pricing changes
- Multi-page expansion (single landing page stays)
- Real testimonial sourcing (you'll provide quotes; I'll wire them in)

## Open questions before I build
1. Do you have **any real pilot quotes** I can use, or should I add placeholder cards labeled "Pilot user"?
2. Do you have a **sample call recording** for the "Hear a sample call" CTA, or should I drop that CTA for now?
3. OK to rewrite the **hero headline** to the outcome-led version above, or do you want to keep "Never miss a valuable lead again."?
