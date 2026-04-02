---
created: 2026-04-02
updated: 2026-04-02 14:00
---

# Terminology

**URL:** `/terminology`
**Goal:** Define the consistent language (LCL) used across all ASA layers, checks, reports, and tooling. Terms are grouped by layer. Short definitions, binary where possible.

---

## Why Consistent Terminology Matters

ASA uses a defined vocabulary across all three layers. The same terms appear in check names, scan reports, documentation, and expert assessments. Consistent terminology means a finding in a report maps directly to a concept on this page — no translation required.

This vocabulary is derived from the ASA Latent Category Language (LCL) — the canonical internal vocabulary for diagnostic expressions. The terms on this page are the public-facing subset: clear enough for founders and developers to use without needing to know the underlying diagnostic codes.

---

## Cross-Layer Terms

Terms that apply across all three protection layers.

| Term | Definition |
|------|------------|
| **PASS** | The check found no evidence of the specified gap or violation. |
| **FAIL** | The check found evidence of the specified gap or violation. |
| **P0 — Critical** | Immediate risk of data breach, revenue fraud, or privilege escalation. Must be addressed before production. |
| **P1 — Important** | Significant gap that should be addressed before scaling or growth. |
| **P2 — Recommended** | Best practice improvement. Low immediate risk, but increases long-term stability. |
| **Phase 1** | The current active check set — 32 automated checks across Production Foundation and Slice Architecture. Business Logic Protection is part of the ASA model but has no active checks in Phase 1. |
| **Blast radius** | The scope of impact when a change introduces a regression. A well-isolated system has bounded blast radius — a change affects only its intended slice. |
| **Enforcement** | Automated, continuous verification that safety rules hold. Enforcement runs whether or not someone remembers to run it. |

---

## Production Foundation Terms

Terms used in Auth Safety, Billing Safety, Admin Safety, and Foundation Safety checks.

| Term | Definition |
|------|------------|
| **Foundation breach** | A gap in a critical production system — auth, billing, admin, or environment configuration — that creates immediate risk. |
| **Unsafe auth path** | A code path where authentication or authorization is missing, bypassed, or performed only on the client side. |
| **Unsafe billing path** | A code path where payment processing can be tampered, bypassed, or fulfilled without verified webhook confirmation. |
| **Permission gap** | A missing ownership check, role verification, or Row Level Security policy that allows unauthorized data access. |
| **Unverified webhook** | A webhook handler that processes events without verifying the signature — allowing forged events to trigger real business actions. |
| **Secret exposure** | A secret key (API key, service_role key, Stripe key) present in client-side code or committed to version control. |
| **Client-side billing state** | Subscription status, pricing, or entitlements stored in browser state (localStorage, useState) rather than verified server-side. |
| **Unsafe admin action** | An admin operation accessible without server-side role verification — any authenticated user can perform admin functions. |
| **Privilege escalation** | A path that allows a user to gain elevated permissions (e.g., admin role) without authorization from an existing privileged user. |
| **RLS** | Row Level Security — Supabase/PostgreSQL feature that restricts which rows a user can read or write. Missing RLS can allow authenticated users to access rows they should not access. |

---

## Business Logic Protection Terms

Terms used in the planned Business Logic Protection layer.

| Term | Definition |
|------|------------|
| **Critical flow** | A user flow whose failure means the product stops delivering its core value — onboarding, checkout, subscription management, approval, fulfillment. |
| **Logic regression** | A change that breaks a critical flow without breaking infrastructure checks. Auth is fine, billing is secure, but the product no longer does what the founder expects. |
| **Flow drift** | Gradual divergence between the intended behavior of a critical flow and its actual behavior after multiple AI-assisted changes. |
| **Scenario definition** | An explicit, testable description of a critical flow: inputs, expected outputs, side effects, and error conditions. |
| **Unprotected critical flow** | A founder-critical flow with no automated verification — it can regress silently and only surfaces when a user reports it. |
| **Release without flow proof** | A deployment that reaches production without passing verification of critical flows. |

---

## Slice Architecture Terms

Terms used in Architecture and Structure checks.

| Term | Definition |
|------|------------|
| **Slice** | ASA's fundamental structural unit. A self-contained vertical feature with hard boundaries. Slices are designed not to depend on other slices. |
| **Boundary violation** | A forbidden import between slices. One feature's code directly imports from another feature's internal code. |
| **Cross-slice dependency** | A dependency between two slices. Creates coupling — a change to one slice can break another. |
| **Slice sprawl** | A codebase with many poorly defined, overlapping slices where boundaries have eroded over time. |
| **Oversized slice** | A slice or file that has grown beyond the complexity bound — making it difficult for AI tools to reason about it coherently. |
| **Architecture drift** | Gradual loss of structural boundaries over time, as AI-generated changes add code wherever is convenient rather than where it belongs. |
| **Isolation failure** | A slice that has developed dependencies on other slices, shared state, or business logic in shared infrastructure — defeating its self-contained nature. |
| **AI wall** | The point where architectural decay has progressed to the point where every AI-generated change introduces regressions. A consequence of unchecked architecture drift, not a root cause. |
| **Thin page** | A page file that delegates business logic to feature modules. Thin pages are safe targets for AI modification. |
| **Fat page** | A page file that contains business logic, state management, and routing in a single file. Fat pages are high-risk targets for AI modification. |
| **Shared infrastructure** | Code that is used across slices: database clients, auth middleware, UI primitives. Shared infrastructure should contain no business logic. |

---

## Metrics

| Term | Definition |
|------|------------|
| **Trust Score** | A 0–100 score measuring how many Production Foundation checks the app passes. Graded A–F. Higher is better. |
| **AI Chaos Index** | A 0–100 score measuring structural risk in Slice Architecture checks. Higher means more chaos. 0 = minimal structural risk. |
| **Grade A (90–100)** | Low risk — no critical gaps in covered scope. |
| **Grade B (80–89)** | Moderate risk — minor gaps, address before scaling. |
| **Grade C (70–79)** | Elevated risk — significant gaps in one or more modules. |
| **Grade D (55–69)** | High risk — critical issues found. |
| **Grade F (0–54)** | Critical risk — major gaps across modules. |

---

## Next Steps

- [Production Foundation](/layers/production-foundation) — full context for foundation terms
- [Slice Architecture](/layers/slice-architecture) — full context for architecture terms
- [Business Logic Protection](/layers/business-logic-protection) — full context for flow terms
- [All checks](/checks) — where these terms appear in practice
