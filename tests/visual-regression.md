# Visual Regression Tests

The Leadmap website has Playwright screenshot coverage for:

- home
- demo section
- pricing section
- privacy page

Snapshots run at desktop and mobile widths only. Animations and transitions are disabled during capture so tests focus on major spacing, overflow, and layout regressions instead of tiny motion differences.

Run the checks:

```bash
npm run test:e2e -- tests/e2e/visual-regression.spec.ts
```

Update baselines intentionally after a reviewed design change:

```bash
npm run test:e2e -- tests/e2e/visual-regression.spec.ts --update-snapshots
```

Do not update snapshots to hide broken spacing, clipped text, accidental color-mode bugs, or mobile overflow. Fix the UI first, then update snapshots only when the new design is the intended baseline.
