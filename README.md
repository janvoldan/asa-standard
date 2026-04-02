# ASA — AI Safe Architecture

An open standard for protecting AI-built apps through clear boundaries, critical safety checks, and structural discipline.

ASA defines three protection layers: **Production Foundation**, **Business Logic Protection**, and **Slice Architecture**. Open specification. No vendor lock-in.

**Website:** [asastandard.org](https://asastandard.org)

---

## The Problem

AI tools generate apps fast. But speed without boundaries creates:

- **Silent safety gaps** — auth bypasses, unverified webhooks, exposed secrets that only surface when exploited
- **Business logic regressions** — changes to one flow break another, with no automated verification
- **Architectural drift** — after many AI prompts, the codebase becomes a monolith where every change risks breaking something unrelated

ASA exists because modern AI needs hard boundaries, not prompt choreography.

---

## Three Protection Layers

### 1. Production Foundation

Protects the systems that must not fail in production: authentication, billing, admin access, environment safety, and deployment configuration.

**Status:** Active in Phase 1 — 24 automated checks.

[Full documentation →](layers/production-foundation.md)

### 2. Business Logic Protection

Protects the flows that define what the product does: onboarding, checkout, subscription changes. Protection comes through explicit flow definition, scenario mapping, and continuous verification.

**Status:** Planned — not active in Phase 1.

[Full documentation →](layers/business-logic-protection.md)

### 3. Slice Architecture

Protects the app from structural decay, cascading regressions, and the "AI wall". Slices are self-contained vertical features with hard boundaries that prevent coupling and limit blast radius.

**Status:** Active in Phase 1 — 8 automated checks.

[Full documentation →](layers/slice-architecture.md)

---

## Implementation Status

| Layer | Phase 1 Checks | Status | Metric |
|-------|---------------|--------|--------|
| **Production Foundation** | 24 checks | Active | Trust Score (A–F) |
| **Slice Architecture** | 8 checks | Active | AI Chaos Index (0–100) |
| **Business Logic Protection** | 0 active | Planned | — |
| **Total Phase 1** | **32 checks** | | |

All Phase 1 checks are automated. They are designed to produce consistent results for the same codebase and configuration.

---

## Core Principles

| Principle | Meaning |
|-----------|---------|
| **Boundaries** | Every critical area must have explicit, enforced limits. |
| **Verification** | Critical claims must be testable. Binary PASS/FAIL, not opinions. |
| **Isolation** | A change should affect only the intended scope. Blast radius is bounded. |
| **Enforcement** | Safety rules must run continuously, not live only in documentation. |

[Full principles →](principles.md)

---

## Tooling

The reference implementation is the **Vibecodiq CLI**:

```bash
npx @vibecodiq/cli scan              # Safety scan — Trust Score (A-F)
npx @vibecodiq/cli scan --architecture  # Architecture scan — AI Chaos Index
npx @vibecodiq/cli scan --all        # Full scan — both scores
npx @vibecodiq/cli guard init        # Install CI enforcement
```

The standard is open and implementation-agnostic. The CLI is one implementation. [CLI Documentation →](https://vibecodiq.com/cli)

---

## Documentation

| Document | Description |
|----------|-------------|
| [Production Foundation](layers/production-foundation.md) | Auth, billing, admin, environment safety — 24 checks |
| [Business Logic Protection](layers/business-logic-protection.md) | Critical flow protection — planned |
| [Slice Architecture](layers/slice-architecture.md) | Boundaries, isolation, drift prevention — 8 checks |
| [Core Principles](principles.md) | Boundaries, Verification, Isolation, Enforcement |
| [Safety Checks](checks/) | All 32 Phase 1 checks with detail |
| [Terminology](terminology.md) | Consistent vocabulary across all layers |
| [Adoption](adoption.md) | How to start using ASA |
| [FAQ](faq.md) | Common questions |
| [Manifesto](manifesto.md) | Why ASA exists |

---

## Legacy Concepts

Earlier versions of ASA included generation-era workflows (deterministic regeneration, marker-based preservation, contract-driven pipelines). These are no longer part of the active standard.

[View archive →](archive/)

---

## License

This specification is published under [CC BY-SA 4.0](LICENSE).

The standard is open. No vendor lock-in. No license fees.

---

**Version 4.0** — April 2026

- [asastandard.org](https://asastandard.org) — web documentation
- [vibecodiq.com](https://vibecodiq.com) — implementation services
- [Vibecodiq CLI](https://www.npmjs.com/package/@vibecodiq/cli) — npm package
