# ASA — Atomic Slice Architecture

**An architecture standard for AI-generated software that stays maintainable.**

---

## The Problem

What we observe in AI-generated codebases past Day 30 is a recurring class of failures:

- **Architecture drift** — logic leaking across layers, file growth without ownership clarity
- **Dependency graph corruption** — circular dependencies forming between modules, isolation impossible
- **Structural entropy** — mixed naming conventions, inconsistent file organization, no predictable pattern
- **Test infrastructure failure** — missing feedback loop, no regression safety net
- **No deployment safety net** — code goes from developer to production unchecked

These failure patterns compound over time. By the time they are visible, the system already resists safe modification.

The structural cause is not that AI writes bad code. AI optimizes locally without global structure. Each generation is locally correct but globally destructive.

---

## What ASA Is

ASA (Atomic Slice Architecture) is an architectural standard that defines how to organize, generate, and enforce structure in software systems — particularly those built or maintained with AI assistance.

ASA is **not a framework**. It is not a library. It is not a runtime dependency.

ASA is a set of rules, structures, and tooling conventions that ensure:

- Every feature lives in an isolated, self-contained **Slice**
- Code generation follows a deterministic **Spec → Contract → Skeleton** pipeline
- Business logic survives regeneration through **marker-based preservation**
- Architectural violations are caught automatically by a **boundary linter**
- AI assistants operate within explicit constraints via **governance rules**

---

## Core Principles

ASA is built on four pillars:

| Principle | Meaning |
|-----------|---------|
| **Determinism** | Same input produces identical output. No randomness, no heuristics. |
| **Zero Magic** | Explicit over implicit. Nothing is guessed. Everything is declared. |
| **Isolation** | Each Slice is a bounded context. Cross-domain imports are forbidden. |
| **Duplication Over Sharing** | Business logic is duplicated per Slice. Coupling is expensive; duplication is free. |

→ [Full principles documentation](principles/)

---

## How It Works

```
slice.spec.md  →  slice.contract.json  →  TypeScript skeleton  →  Your implementation
   (human)            (machine)              (generated)            (preserved)
```

1. **Spec** — Human-readable intent document (Markdown)
2. **Contract** — Machine-readable representation (JSON, with typed fields)
3. **Skeleton** — Generated code with marker regions (TypeScript)
4. **Implementation** — Your business logic inside markers (safe during regeneration)

→ [Contract-driven pipeline](principles/contract-driven.md)

---

## Slice Architecture

A Slice is a **vertical feature unit** — backend handler, database access, validation schemas, and UI component all in one folder:

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

Backend and frontend share the same contract, ensuring type safety across the stack.

→ [Slice architecture details](principles/slice-architecture.md)

---

## Migration: Cap, Bridge & Grow

For existing codebases, ASA provides **Cap, Bridge & Grow** — a modern adaptation of the Strangler Fig Pattern:

1. **Cap** — Quarantine legacy code. Freeze it. Stop the spread.
2. **Bridge** — Create thin adapters between legacy and new ASA Slices.
3. **Grow** — Build all new features as ASA Slices. Legacy code gradually becomes unused.

Migration happens as a side effect of development, not as a separate project.

→ [Cap, Bridge & Grow methodology](methodology/cap-and-grow.md)

---

## The Failure Patterns ASA Addresses

ASA was designed in response to five root causes observed in AI-generated and AI-maintained codebases:

| Root Cause | What Happens | ASA Response |
|------------|-------------|--------------|
| Architecture Drift | Logic leaks across layers | Slice isolation + boundary linter |
| Dependency Graph Corruption | Circular imports, cross-domain coupling | Import rules enforced via AST analysis |
| Structural Entropy | No predictable structure, naming decay | Deterministic scaffolding |
| Test Infrastructure Failure | No regression safety net | Per-slice test generation |
| No Deployment Safety Net | No automated enforcement | CI/CD integration, lint gates |

→ [Detailed failure pattern analysis](problems/ai-chaos.md)

---

## Foundation Modules

ASA defines four foundation modules that cover the most common SaaS needs:

| Module | Built On | What It Adds |
|--------|----------|-------------|
| **db** | Supabase PostgreSQL | Canonical client separation (browser/server/admin), repository boundaries, migration conventions |
| **auth** | Supabase Auth | Slice structure, middleware, profile sync, route guards, RLS policies, security-reviewed defaults |
| **payments** | Stripe | Idempotent webhook handler, subscription state machine, plan limits, entitlement checks |
| **admin** | Role-based access | Dashboard, user management, roles, impersonation, audit log |

Foundation modules are not wrappers — they add **architecture, safe defaults, and enforcement** on top of vendor primitives.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Slice Architecture](principles/slice-architecture.md) | How Slices work — full-stack vertical features |
| [Boundary Rules](principles/boundary-rules.md) | Import rules, enforcement, allowed dependencies |
| [Contract-Driven Pipeline](principles/contract-driven.md) | Spec → Contract → Skeleton pipeline |
| [Regeneration Safety](principles/regeneration-safety.md) | Marker-based code preservation |
| [Naming Conventions](principles/naming-conventions.md) | Deterministic naming and terminology |
| [Cap, Bridge & Grow](methodology/cap-and-grow.md) | Migration methodology for existing codebases |
| [AI Chaos: Root Causes](problems/ai-chaos.md) | The failure patterns ASA addresses |

---

## Tooling

The ASA CLI automates and enforces the standard:

```bash
pip install asa-standard
```

> The CLI command is `asa` (not `asa-standard`). Requires Python 3.10+.

### Diagnostic (Always Free)

| Command | Purpose |
|---------|--------|
| `asa scan [path]` | AI Chaos Index — structural risk score (0–100), 5 root causes, risk band |
| `asa scan [path] --json` | Machine-readable JSON output for CI pipelines |

### Stabilization Engine

| Command | Purpose |
|---------|--------|
| `asa stabilize [--yes] [--dry-run]` | Full stabilization flow: scan → infer → plan → apply → bridge → verify |
| `asa spec infer [path]` | Infer `.asa/spec.yaml` from existing codebase |
| `asa plan` | Dry-run — show what `asa apply` would do |
| `asa apply` | Install foundation architecture from spec |
| `asa verify [--ci]` | Verify architecture vs `.asa/spec.yaml` (CI-ready) |
| `asa repair [--auto]` | Detect architecture drift and suggest/apply fixes |

### Foundation

| Command | Purpose |
|---------|--------|
| `asa init --name <name>` | Initialize new ASA project (runnable Next.js App Router starter) |
| `asa install <module>` | Install foundation module (db-basic, auth-basic, payments-basic, admin-basic) |
| `asa lint [--strict]` | Boundary + contract + security + entitlement enforcement |
| `asa deploy [--check \| --staging \| --prod]` | Architecture-safe deployment (Vercel + Supabase) |

### Slice Management

| Command | Purpose |
|---------|--------|
| `asa slice new <domain/name>` | Create vertical slice (handler + schemas + UI + contract) |
| `asa slice update <domain/name>` | Regenerate after spec change (preserves user code) |
| `asa slice plan <spec>` | Propose slice architecture from functional spec |
| `asa slice split <name>` | Analyze oversized slice, propose split |
| `asa slice build <name>` | Internal build pipeline (contract → zod → skeleton) |
| `asa slice sync` | Validate all contracts across project |
| `asa slice analyze <name>` | Detailed slice analysis (LOC, imports, coupling) |

### UI Generation

| Command | Purpose |
|---------|--------|
| `asa ui generate <name>` | Regenerate frontend part of slice from contract |

ASA the standard is open and language-agnostic. The reference CLI implementation targets **Next.js + Supabase + Stripe on Vercel**.

---

## License

This specification is published under [CC BY-SA 4.0](LICENSE).

The standard is open. No vendor lock-in. No license fees.

---

**Version 2.1** — March 2026