# ASA — AI Safe Architecture

**An open standard for AI-generated software that stays safe, maintainable, and scalable.**

---

## The Problem

AI tools build features fast. But they don't verify that the critical foundation — auth, billing, and admin — is implemented safely. And they don't maintain architectural boundaries as the codebase grows.

What we observe in AI-generated codebases past Day 30:

- **Safety gaps** — broken auth, exposed billing keys, unprotected admin routes
- **Architecture drift** — logic leaking across layers, file growth without ownership
- **Dependency corruption** — cross-domain coupling, one change breaks three features
- **Structural entropy** — mixed conventions, no predictable pattern
- **No enforcement** — code goes from AI prompt to production unchecked

These patterns compound. By the time they're visible, the system resists safe modification.

The cause is not that AI writes bad code. AI optimizes locally without global awareness. Each prompt is locally correct but globally destructive.

---

## What ASA Is

ASA (AI Safe Architecture) is a standard that defines:

1. **Safety checks** — what to verify in billing, auth, admin, and architecture
2. **Architecture rules** — how to organize code so AI-generated changes stay isolated
3. **Enforcement tooling** — how to block unsafe changes automatically

ASA is **not a framework**. It is not a library. It is not a runtime dependency.

---

## Two Dimensions

### L2 — Safety (Billing, Auth, Admin)

29 automated checks across the critical foundation layers:

| Module | Phase 1 Checks | What It Catches |
|--------|---------------|-----------------|
| **Billing** | 8 checks | Stripe key exposure, unsigned webhooks, client-side checkout, missing idempotency |
| **Auth** | 8 checks | service_role exposure, missing RLS, client-side auth, session spoofing |
| **Admin** | 4 checks | Unprotected admin routes, hardcoded credentials, exposed debug endpoints |
| **Architecture** | 5 checks | Missing domain boundaries, cross-domain imports, bloated pages |
| **Foundation** | 4 checks | Missing .env.example, committed secrets, no strict mode, no error boundary |

Each check has a dedicated documentation page: [asastandard.org/checks](https://asastandard.org/checks)

### L1 — Architecture (Slice Isolation)

Every feature lives in an isolated, self-contained **Slice**:

```
domains/auth/login/
├── slice.spec.md         # What it does (human-readable)
├── slice.contract.json   # What it does (machine-readable)
├── handler.ts            # Next.js route handler
├── repository.ts         # Database access (Supabase)
├── schemas.ts            # Zod validation schemas
└── ui/
    ├── hook.ts             # React data fetching hook
    └── AuthLoginForm.tsx   # React component
```

**Key rule:** Slices only import from their own domain and `shared/`. Cross-domain imports are forbidden. This guarantees that changing one feature cannot break another.

---

## Core Principles

| Principle | Meaning |
|-----------|---------|
| **Determinism** | Same input produces identical output. No randomness, no heuristics. |
| **Zero Magic** | Explicit over implicit. Nothing is guessed. Everything is declared. |
| **Isolation** | Each Slice is a bounded context. Cross-domain imports are forbidden. |
| **Duplication Over Sharing** | Business logic is duplicated per Slice. Coupling is expensive; duplication is free. |

-> [Full principles documentation](principles/)

---

## Tooling

The reference implementation is the **Vibecodiq CLI** — a TypeScript scanner targeting Next.js + Supabase + Stripe.

```bash
npx @vibecodiq/cli scan
```

### Scan — Find Safety Gaps

| Command | Purpose |
|---------|---------|
| `npx @vibecodiq/cli scan` | Safety scan: auth, billing, admin, env, error handling (29 Phase 1 checks) |
| `npx @vibecodiq/cli scan --architecture` | Architecture scan: domain boundaries, thin pages, cross-imports |
| `npx @vibecodiq/cli scan --all` | Full scan: safety + architecture |
| `npx @vibecodiq/cli scan --fix` | Safety scan + AI-generated fix prompts for every finding |
| `npx @vibecodiq/cli scan --json` | Machine-readable JSON output for CI pipelines |

### Guard — Prevent Regression

| Command | Purpose |
|---------|---------|
| `npx @vibecodiq/cli guard init` | Install safety CI enforcement (GitHub Actions) |
| `npx @vibecodiq/cli guard init --all` | Install safety + architecture CI enforcement |
| `npx @vibecodiq/cli guard check` | Run architecture checks locally |

### Foundation — Install Safe Modules

| Command | Purpose |
|---------|---------|
| `npx @vibecodiq/cli install auth` | Auth module: login, register, session, middleware, RLS |
| `npx @vibecodiq/cli install payments` | Payments module: Stripe checkout, webhooks, subscriptions |
| `npx @vibecodiq/cli install admin` | Admin module: RBAC, audit log, user management |
| `npx @vibecodiq/cli install foundation` | All three modules + DB utilities |

The standard is open and language-agnostic. The CLI is the reference implementation.

-> [Vibecodiq CLI](https://vibecodiq.com)

---

## FIX vs REBUILD

ASA defines two distinct workflows:

| | FIX | REBUILD |
|---|---|---|
| **Scan mode** | `scan` (safety only) | `scan --all` (safety + architecture) |
| **Guard mode** | `guard init` (safety only) | `guard init --all` (safety + architecture) |
| **What it checks** | Auth, billing, admin, env, errors | + domain slices, boundaries, thin pages |
| **Code structure** | Stays as-is (can be chaotic) | Rewritten into ASA slices |
| **New code** | Can be chaotic (but safe) | Must be in slices |

**Rule:** You can't have half the app in chaos and half in slices — that creates cross-imports, duplication, and confusion. Either the entire app is in slices (REBUILD), or it isn't (FIX).

---

## Failure Patterns ASA Addresses

| Root Cause | What Happens | ASA Response |
|------------|-------------|--------------|
| Auth Misconfiguration | Missing RLS, exposed keys, client-side auth | Safety checks (L2) |
| Billing Logic Exposure | Unsigned webhooks, client-side checkout | Safety checks (L2) |
| Admin Privilege Escalation | Unprotected admin routes, hardcoded creds | Safety checks (L2) |
| Architecture Drift | Logic leaks across layers | Slice isolation + boundary linter (L1) |
| Dependency Corruption | Cross-domain coupling | Import rules enforced via AST (L1) |
| Structural Entropy | No predictable structure | Deterministic scaffolding (L1) |

-> [Detailed failure pattern analysis](problems/ai-chaos.md)

---

## Foundation Modules

Pre-built, ASA-compliant modules for the most common SaaS needs:

| Module | Built On | What It Adds |
|--------|----------|-------------|
| **auth** | Supabase Auth | Server-side sessions, middleware, RLS policies, route guards |
| **payments** | Stripe | Idempotent webhooks, subscription state machine, entitlement checks |
| **admin** | Role-based access | RBAC, audit log, user management, impersonation |

Foundation modules are not wrappers — they add **architecture, safe defaults, and enforcement** on top of vendor primitives.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Safety Checks](checks/) | 29 Phase 1 checks across billing, auth, admin, architecture, foundation |
| [Slice Architecture](principles/slice-architecture.md) | How Slices work — full-stack vertical features |
| [Boundary Rules](principles/boundary-rules.md) | Import rules, enforcement, allowed dependencies |
| [Contract-Driven Pipeline](principles/contract-driven.md) | Spec -> Contract -> Skeleton pipeline |
| [Regeneration Safety](principles/regeneration-safety.md) | Marker-based code preservation |
| [Naming Conventions](principles/naming-conventions.md) | Deterministic naming and terminology |
| [AI Chaos: Root Causes](problems/ai-chaos.md) | The failure patterns ASA addresses |

---

## License

This specification is published under [CC BY-SA 4.0](LICENSE).

The standard is open. No vendor lock-in. No license fees.

---

**Version 3.0** — March 2026

*Previously known as "Atomic Slice Architecture". Renamed to "AI Safe Architecture" to reflect the expanded scope: safety checks + architecture enforcement.*
