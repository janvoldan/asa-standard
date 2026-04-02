---
created: 2026-04-02
updated: 2026-04-02 14:00
---

# Production Foundation

**URL:** `/layers/production-foundation`
**Goal:** Define what Production Foundation protects, what typically breaks, how it is enforced, list all 24 Phase 1 checks with threat theses. Relationship to Trust Score.

---

## What It Protects

Production Foundation protects the systems that must not fail when real users interact with the app: authentication, billing, admin access, environment configuration, and error handling.

These are not features — they are infrastructure. A broken login page is a bug. A missing RLS policy is a data breach. A webhook without signature verification is revenue fraud waiting to happen.

AI tools generate code for the happy path. They build login forms, checkout flows, and admin panels that work in development. But they skip the safety checks that matter in production: Is the session verified server-side? Is the webhook signature checked? Can any user access admin routes by guessing the URL?

Production Foundation defines what "safe" means for these critical systems.

---

## What Typically Breaks

### Auth failures expose user data

A missing Row Level Security policy means any logged-in user can read another user's data. A client-side auth check means any browser tool can bypass it. The `service_role` key in client code gives every visitor full database access. These gaps are invisible until someone exploits them.

### Billing failures cause revenue loss

An unverified webhook means a failed payment still triggers subscription activation. A client-side price check means users can buy at $0. Checkout created on the client means the amount can be tampered. These failures only show up in the bank account.

### Admin failures enable privilege escalation

An unprotected admin route means any user can access admin functions by guessing the URL. A hardcoded admin credential means one leaked env file compromises everything. Debug routes left from development give attackers known entry points with no protection.

### Foundation gaps create deployment failures

Missing `.env.example` means new developers skip critical variables. Committed secrets in `.env` expose all credentials to anyone with repo access. Without TypeScript strict mode, AI tools generate code with implicit `any` that crashes at runtime. Without an error boundary, any unhandled exception shows users a white screen.

---

## How It Is Enforced

Production Foundation is enforced through 24 automated safety checks organized into four modules:

1. **Auth Safety** — verifies that authentication and authorization are implemented correctly
2. **Billing Safety** — verifies that payment processing is secure against manipulation
3. **Admin Safety** — verifies that admin access is properly restricted
4. **Foundation Safety** — verifies baseline configuration and error handling

Each check has a defined threat thesis, detection logic, and binary PASS/FAIL result. Checks are deterministic — the same codebase always produces the same result.

Enforcement can happen through:
- **Automated scanning** — run checks against the codebase
- **CI/CD integration** — block PRs that introduce safety regressions
- **Expert review** — manual validation of findings

---

## Phase 1 Checks

**Status:** Active in Phase 1 — 24 automated checks.
**Metric:** Trust Score (0–100, Grade A–F).

### Auth Safety (8 checks)

| ID | Name | Priority | Threat |
|----|------|----------|--------|
| AUTH-01 | service_role key not in client code | P0 | The service_role key bypasses all Row Level Security. If exposed in client code, any visitor has full unrestricted database access. |
| AUTH-02 | RLS enabled on all tables | P0 | Without RLS, any authenticated user can read/write all rows in a table. A single missing policy means full database exposure. |
| AUTH-03 | RLS policies have WITH CHECK | P0 | Policies without WITH CHECK allow unrestricted INSERT/UPDATE even when SELECT is restricted. Users can write data they shouldn't. |
| AUTH-05 | No secrets with NEXT_PUBLIC_ prefix | P0 | NEXT_PUBLIC_ variables are bundled into browser JavaScript. If a secret key uses this prefix, it's visible to every visitor in DevTools. |
| AUTH-06 | Protected routes redirect unauthenticated users | P1 | Without server-side auth enforcement, protected pages and data can be reached or rendered before client-side auth runs. Middleware-level redirect is the only reliable way to prevent unauthorized access. |
| AUTH-11 | Client/server auth separation | P0 | A single generic createClient() for both browser and server leads to auth token leaks across boundaries, session spoofing, and CSRF. |
| AUTH-13 | getUser() not getSession() for server-side | P0 | getSession() reads JWT from cookies without server-side verification. An attacker can forge a JWT cookie and bypass auth. getUser() verifies the token server-side. |
| AUTH-14 | No eval() or dangerouslySetInnerHTML with user data | P0 | eval() and dangerouslySetInnerHTML are the most common XSS vectors in React apps. Any user-controlled input through these functions enables script execution. |

### Billing Safety (8 checks)

| ID | Name | Priority | Threat |
|----|------|----------|--------|
| BIL-01 | Stripe secret key not in client code | P0 | Stripe secret keys grant full API access. If exposed in client code, any visitor can create charges, refund payments, read customer data. |
| BIL-02 | Webhook signature verification | P0 | Without constructEvent() signature verification, anyone can send fake webhook events — granting premium subscriptions or triggering refunds. |
| BIL-03 | Raw body preservation in webhook | P0 | If the webhook body is parsed before signature verification, the signature check fails or is skipped. This allows forged webhook events. |
| BIL-04 | Idempotent webhook processing | P1 | Stripe retries failed webhooks. Without idempotency, the same event processes multiple times — duplicate subscriptions or double charges. |
| BIL-09 | No client-side billing state as source of truth | P1 | If subscription status lives in localStorage or useState, users can manipulate it in DevTools and bypass paywalls. |
| BIL-14 | Checkout flow is server-initiated | P0 | If checkout sessions are created client-side, the price can be tampered. A user could pay $0 for a $100 product. |
| BIL-16 | Never fulfill on success_url | P0 | Stripe's success_url redirect is not proof of payment. Users can navigate directly to the success URL without paying. Fulfillment must happen in webhook. |
| BIL-17 | PCI raw card data safety | P0 | Handling raw card numbers in application code puts the business under PCI DSS scope. Stripe Elements handle card data in a PCI-compliant iframe. |

### Admin Safety (4 checks)

| ID | Name | Priority | Threat |
|----|------|----------|--------|
| ADM-01 | Admin endpoints have server-side auth | P0 | Admin API endpoints without server-side role verification allow any authenticated user to perform admin operations. Most common privilege escalation vector. |
| ADM-02 | Admin routes not accessible without auth | P0 | Admin pages without auth guards are accessible to anyone who knows the URL. AI tools generate admin routes without server-side protection. |
| ADM-08 | No unprotected debug/admin routes | P0 | Debug, seed, and test routes left from development are accessible in production without auth. These are the easiest targets — known paths, no protection. |
| ADM-11 | No hardcoded admin credentials | P0 | Hardcoded admin passwords or tokens in source code mean anyone with repo access is automatically an admin. AI tools frequently generate default credentials that never get removed. |

### Foundation Safety (4 checks)

| ID | Name | Priority | Threat |
|----|------|----------|--------|
| ENV-01 | .env.example exists | P1 | Without .env.example, new developers don't know what environment variables are needed. They skip critical variables or receive real secrets over insecure channels. |
| ENV-02 | No secrets in committed .env | P0 | Committed .env files expose all credentials to anyone with repo access. AI tools frequently generate .env files with real keys and forget .gitignore. |
| CFG-01 | TypeScript strict mode | P1 | Without strict mode, TypeScript allows implicit any and unchecked null access. AI tools generate code with any types extensively. Strict mode forces correctly typed code. |
| ERR-01 | Global error boundary exists | P1 | Without an error boundary, any unhandled exception crashes the entire React app — white screen. AI-generated code rarely includes error boundaries. |

---

## Relationship to Trust Score

Trust Score is the primary metric for Production Foundation. It measures how many safety checks the app passes across auth, billing, admin, and foundation.

| Grade | Score | Meaning |
|-------|-------|---------|
| A | 90–100 | Low risk — no critical gaps in covered scope |
| B | 80–89 | Moderate risk — minor gaps, fix before scaling |
| C | 70–79 | Elevated risk — significant gaps in 1+ modules |
| D | 55–69 | High risk — critical issues found |
| F | 0–54 | Critical risk — major gaps across modules |

**Scoring:** Each FAIL deducts points based on priority (P0: -5, P1: -3, P2: -2). Hard gates: any P0 failure blocks Grade A; three or more P0 failures cap at Grade C.

Trust Score is a point-in-time assessment of the submitted code. It is not a certification, security audit, or guarantee of production safety.

---

## What Production Foundation Does Not Cover

- Business logic correctness (→ Business Logic Protection)
- Architecture structure and boundaries (→ Slice Architecture)
- Runtime behavior, performance, or availability
- Compliance determinations (SOC2, HIPAA, PCI DSS)
- Penetration testing or dynamic security analysis

---

## Next Steps

- [View all 32 checks](/checks) — complete Phase 1 registry
- [Slice Architecture](/layers/slice-architecture) — structural protection
- [Business Logic Protection](/layers/business-logic-protection) — flow protection (planned)
- [Adoption guide](/adoption) — how to start using ASA
