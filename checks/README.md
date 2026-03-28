# Safety Checks

**32 automated checks for AI-built apps across billing, auth, admin, architecture, and foundation.**

Each check documents a specific safety gap commonly found in AI-generated codebases, why it matters, and how to fix it.

---

## Overview

| Module | Checks | Priority | What It Catches |
|--------|--------|----------|-----------------|
| **Billing** | 8 | 3x P0, 5x P1 | Stripe key exposure, unsigned webhooks, client-side checkout, missing idempotency |
| **Auth** | 8 | 3x P0, 5x P1 | service_role exposure, missing RLS, client-side auth, session spoofing, eval injection |
| **Admin** | 4 | 3x P0, 1x P1 | Unprotected admin routes, hardcoded credentials, exposed debug endpoints |
| **Architecture** | 5 | 2x P0, 2x P1, 1x P2 | Missing domain boundaries, cross-domain imports, bloated pages |
| **Foundation** | 4 | 1x P0, 3x P1 | Missing .env.example, committed secrets, no strict mode, no error boundary |

**Total: 32 checks**

---

## Billing Safety (8 checks)

| ID | Name | Priority |
|----|------|----------|
| BIL-01 | Stripe secret key not in client code | P0 |
| BIL-02 | Webhook signature verification | P0 |
| BIL-03 | Raw body preservation for webhook | P0 |
| BIL-04 | Idempotent webhook processing | P1 |
| BIL-09 | No client-side billing state | P1 |
| BIL-14 | Server-initiated checkout | P1 |
| BIL-16 | Fulfillment via webhook, not success URL | P1 |
| BIL-17 | No raw card data handling (PCI) | P1 |

---

## Auth Safety (8 checks)

| ID | Name | Priority |
|----|------|----------|
| AUTH-01 | service_role key not in client bundle | P0 |
| AUTH-02 | RLS enabled on all user tables | P0 |
| AUTH-03 | RLS policies have WITH CHECK | P0 |
| AUTH-05 | No secrets with NEXT_PUBLIC_ prefix | P1 |
| AUTH-06 | Server-side auth on protected routes | P1 |
| AUTH-11 | Client/server auth separation | P1 |
| AUTH-13 | getUser() not getSession() server-side | P1 |
| AUTH-14 | No eval()/dangerouslySetInnerHTML with user data | P1 |

---

## Admin Safety (4 checks)

| ID | Name | Priority |
|----|------|----------|
| ADM-01 | Admin endpoints have server-side auth | P0 |
| ADM-02 | Admin routes not accessible without auth | P0 |
| ADM-08 | No unprotected debug/test routes | P0 |
| ADM-11 | No hardcoded admin credentials | P1 |

---

## Architecture (8 checks)

| ID | Name | Priority |
|----|------|----------|
| ARCH-01 | Business logic in domains/ | P0 |
| ARCH-02 | domains/ directory exists | P0 |
| ARCH-03 | No cross-domain imports | P1 |
| ARCH-04 | Pages are thin wrappers (< 80 LOC) | P1 |
| ARCH-05 | shared/ has no business logic | P2 |
| ARCH-06 | File size limit (> 500 LOC) | P1 |
| STR-01 | CI/CD pipeline exists | P1 |
| STR-02 | Test files exist | P1 |

---

## Foundation (4 checks)

| ID | Name | Priority |
|----|------|----------|
| ENV-01 | .env.example exists | P1 |
| ENV-02 | .env not committed to git | P0 |
| CFG-01 | TypeScript strict mode enabled | P1 |
| ERR-01 | Global error boundary exists | P1 |

---

## Severity

| Level | Label | Meaning |
|-------|-------|---------|
| **P0** | Critical Security Risk | Must fix before launch. Blocks Trust Score grade A. |
| **P1** | Important Gap | Should fix before accepting paying users. |
| **P2** | Recommended Improvement | Good practice, lower risk. |

---

## Detailed Documentation

Each check has a dedicated page on [asastandard.org/checks](https://asastandard.org/checks) with:
- Why it matters (business impact)
- The problem (code examples of what AI generates)
- The fix (code examples of the correct pattern)
- References (OWASP, CWE, vendor docs)

---

## Tooling

Scan your app against all 32 checks:

```bash
npx @vibecodiq/cli scan
```

Get AI-generated fix prompts for every finding:

```bash
npx @vibecodiq/cli scan --fix
```

Enforce checks on every PR:

```bash
npx @vibecodiq/cli guard init
```

-> [vibecodiq.com/scan](https://vibecodiq.com/scan)
