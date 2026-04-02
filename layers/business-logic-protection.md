---
created: 2026-04-02
updated: 2026-04-02 14:00
---

# Business Logic Protection

**URL:** `/layers/business-logic-protection`
**Goal:** Honestly define this layer as part of the ASA model with no active Phase 1 checks. Explain what it will protect, why it matters, and the planned enforcement direction.

---

## What It Protects

Business Logic Protection is not a test category. It is the protection of critical product flows, with E2E testing as its primary enforcement mechanism.

Business Logic Protection guards the flows that define what the product actually does — the sequences of steps that make the app valuable to its users.

Every product has critical flows: onboarding, checkout, subscription management, booking, approval, fulfillment. These flows are what the founder built the product for. When they break, the product stops working — not in a security sense, but in a "the thing I'm selling no longer does what it's supposed to do" sense.

Production Foundation protects the infrastructure these flows run on. Slice Architecture protects the structure they're built within. Business Logic Protection protects the flows themselves.

---

## Why It Matters

AI tools are excellent at generating individual features. They struggle with preserving the relationships between features over time.

A checkout flow that worked yesterday can break today because an AI-assisted change to the subscription model accidentally removed a validation step. A booking flow can silently stop sending confirmation emails because a refactor moved the notification call. An approval chain can skip a step because the AI didn't know that step existed.

These regressions are invisible to infrastructure checks. Auth is fine. Billing is secure. Architecture is clean. But the product no longer does what the user expects.

Business Logic Protection exists to catch these regressions before they reach production.

---

## How It Will Be Enforced

The planned enforcement approach follows three stages:

### 1. Critical Flow Identification

Map the product's most important user flows. Not every flow — only the ones where failure means the product stops delivering value.

Examples:
- User signs up → verifies email → completes onboarding
- User selects plan → enters payment → subscription activates
- User creates booking → receives confirmation → host is notified
- Admin approves request → user is notified → access is granted

### 2. Scenario Definition

For each critical flow, define the expected behavior as testable scenarios:

- What inputs trigger the flow
- What the expected outcome is
- What side effects should occur (emails, database changes, webhooks)
- What error conditions exist and how they should be handled

### 3. Continuous Verification

Enforce scenarios through automated end-to-end tests that run in CI/CD:

- Each critical flow has at least one E2E test
- Tests verify the full path, not just individual components
- In a mature implementation, no release should pass CI without critical flow tests passing
- Regressions are caught before they reach production

---

## Current Status

**Status:** Planned — not active in Phase 1.

Business Logic Protection is part of the ASA model but does not yet have automated checks in the Phase 1 check registry. The enforcement direction described above is the planned approach for future phases.

Today, business logic protection is best achieved through:
- Manual scenario mapping during expert assessment
- Playwright or Cypress E2E tests written per critical flow
- CI/CD gates that require passing E2E tests before deploy

---

## Relationship to Other Layers

| Layer | What it protects | Example failure |
|-------|-----------------|-----------------|
| **Production Foundation** | Infrastructure safety (auth, billing, admin) | Webhook accepts forged events |
| **Business Logic Protection** | Product flow correctness | Checkout no longer sends confirmation email |
| **Slice Architecture** | Structural stability | Change to auth slice breaks billing slice |

The three layers are complementary:
- Production Foundation ensures the systems work safely
- Business Logic Protection ensures the product works correctly
- Slice Architecture ensures changes don't cascade

---

## What Business Logic Protection Does Not Cover

- Authentication, billing, or admin safety (→ Production Foundation)
- Code structure, boundaries, or coupling (→ Slice Architecture)
- Performance, availability, or scalability
- UI/UX correctness or visual regression
- General QA discipline — this layer focuses on protection of founder-critical flows, not overall test coverage

---

## Next Steps

- [Production Foundation](/layers/production-foundation) — what must not fail in production (24 active checks)
- [Slice Architecture](/layers/slice-architecture) — structural protection (8 active checks)
- [All checks](/checks) — complete Phase 1 registry
- [Adoption guide](/adoption) — how to start using ASA
