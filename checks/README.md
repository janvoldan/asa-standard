---
created: 2026-04-02
updated: 2026-04-02 14:00
---

# Safety Checks

**URL:** `/checks`
**Goal:** List all Phase 1 checks organized by ASA layer. Each check has ID, name, priority, and status. Clear separation between active checks and planned layer. Gateway to per-check detail pages.

---

## Overview

Phase 1 contains 32 automated safety checks across two active layers. All Phase 1 checks are automated. They are designed to produce consistent results for the same codebase and configuration.

| Layer | Checks | Status | Metric |
|-------|--------|--------|--------|
| **Production Foundation** | 24 | Active | Trust Score (A–F) |
| **Slice Architecture** | 8 | Active | AI Chaos Index (0–100) |
| **Business Logic Protection** | 0 active | Planned | — |
| **Total Phase 1** | **32** | | |

**Priority levels:**
- P0 — Critical: immediate risk of data breach, revenue fraud, or privilege escalation
- P1 — Important: significant gap that should be addressed before scaling
- P2 — Recommended: best practice improvement

---

## Production Foundation (24 checks — active)

Protects the systems that must not fail in production: authentication, billing, admin access, and baseline configuration.

### Auth Safety (8 checks)

| ID | Check | Priority |
|----|-------|----------|
| [AUTH-01](/checks/auth-01-service-role-key-not-in-client-code) | service_role key not in client code | P0 |
| [AUTH-02](/checks/auth-02-rls-enabled-on-all-tables) | RLS enabled on all tables | P0 |
| [AUTH-03](/checks/auth-03-rls-policies-have-with-check) | RLS policies have WITH CHECK | P0 |
| [AUTH-05](/checks/auth-05-no-secrets-with-next-public-prefix) | No secrets with NEXT_PUBLIC_ prefix | P0 |
| [AUTH-06](/checks/auth-06-protected-routes-redirect-unauthenticated) | Protected routes redirect unauthenticated users | P1 |
| [AUTH-11](/checks/auth-11-client-server-auth-separation) | Client/server auth separation | P0 |
| [AUTH-13](/checks/auth-13-getuser-not-getsession-server-side) | getUser() not getSession() for server-side | P0 |
| [AUTH-14](/checks/auth-14-no-eval-or-dangerouslysetinnerhtml) | No eval() or dangerouslySetInnerHTML with user data | P0 |

### Billing Safety (8 checks)

| ID | Check | Priority |
|----|-------|----------|
| [BIL-01](/checks/bil-01-stripe-secret-key-not-in-client-code) | Stripe secret key not in client code | P0 |
| [BIL-02](/checks/bil-02-webhook-signature-verification) | Webhook signature verification | P0 |
| [BIL-03](/checks/bil-03-raw-body-preservation-in-webhook) | Raw body preservation in webhook | P0 |
| [BIL-04](/checks/bil-04-idempotent-webhook-processing) | Idempotent webhook processing | P1 |
| [BIL-09](/checks/bil-09-no-client-side-billing-state-as-source-of-truth) | No client-side billing state as source of truth | P1 |
| [BIL-14](/checks/bil-14-checkout-flow-is-server-initiated) | Checkout flow is server-initiated | P0 |
| [BIL-16](/checks/bil-16-never-fulfill-on-success-url) | Never fulfill on success_url | P0 |
| [BIL-17](/checks/bil-17-pci-raw-card-data-safety) | PCI raw card data safety | P0 |

### Admin Safety (4 checks)

| ID | Check | Priority |
|----|-------|----------|
| [ADM-01](/checks/adm-01-admin-endpoints-have-server-side-auth) | Admin endpoints have server-side auth | P0 |
| [ADM-02](/checks/adm-02-admin-routes-not-accessible-without-auth) | Admin routes not accessible without auth | P0 |
| [ADM-08](/checks/adm-08-no-unprotected-debug-admin-routes) | No unprotected debug/admin routes | P0 |
| [ADM-11](/checks/adm-11-no-hardcoded-admin-credentials) | No hardcoded admin credentials | P0 |

### Foundation Safety (4 checks)

| ID | Check | Priority |
|----|-------|----------|
| [ENV-01](/checks/env-01-env-example-exists) | .env.example exists | P1 |
| [ENV-02](/checks/env-02-no-secrets-in-committed-env) | No secrets in committed .env | P0 |
| [CFG-01](/checks/cfg-01-typescript-strict-mode) | TypeScript strict mode | P1 |
| [ERR-01](/checks/err-01-global-error-boundary-exists) | Global error boundary exists | P1 |

---

## Slice Architecture (8 checks — active)

Protects the structural boundaries that keep changes predictable and prevent architectural drift.

### Architecture Checks (6 checks)

| ID | Check | Priority |
|----|-------|----------|
| [ARCH-01](/checks/arch-01-business-logic-in-dedicated-feature-directories) | Business logic in dedicated feature directories | P0 |
| [ARCH-02](/checks/arch-02-feature-directory-structure-exists) | Feature directory structure exists | P0 |
| [ARCH-03](/checks/arch-03-no-cross-slice-imports) | No cross-slice imports | P1 |
| [ARCH-04](/checks/arch-04-thin-pages) | Thin pages | P1 |
| [ARCH-05](/checks/arch-05-shared-utilities-contain-no-business-logic) | Shared utilities contain no business logic | P1 |
| [ARCH-06](/checks/arch-06-bounded-file-size) | Bounded file size | P1 |

### Structure Checks (2 checks)

| ID | Check | Priority |
|----|-------|----------|
| [STR-01](/checks/str-01-ci-cd-pipeline-exists) | CI/CD pipeline exists | P1 |
| [STR-02](/checks/str-02-test-files-exist) | Test files exist | P1 |

---

## Business Logic Protection (planned)

This layer is part of the ASA model but does not have active automated checks in Phase 1. This layer protects critical product flows — it is not a test category. Scenario definition and E2E coverage are the planned enforcement model for future phases.

[Learn more about Business Logic Protection →](/layers/business-logic-protection)

---

## How Checks Work

Each Phase 1 check has:

- **Threat thesis** — what specific risk the check addresses
- **Detection logic** — how the check determines PASS or FAIL
- **Binary result** — PASS or FAIL, no partial credit
- **Priority level** — P0 (critical), P1 (important), P2 (recommended)

Checks are static analysis — they scan the codebase without running it. They detect structural and configuration gaps, not runtime behavior.

**What checks do not cover:**
- Runtime behavior, performance, or availability
- Business logic correctness (→ Business Logic Protection)
- Compliance determinations (SOC2, HIPAA, PCI DSS)
- Penetration testing or dynamic security analysis

---

## Disclaimer

Check results are a point-in-time assessment of the submitted codebase against defined criteria. A passing result does not mean the application is free of vulnerabilities. It means the application passes the specific checks included in the current phase. Not a certification. Not a security audit.

---

## Next Steps

- [Production Foundation](/layers/production-foundation) — why these 24 checks matter
- [Slice Architecture](/layers/slice-architecture) — why these 8 checks matter
- [Terminology](/terminology) — consistent language across all checks
- [Adoption guide](/adoption) — how to start verifying your app against ASA checks
