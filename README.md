# ASA — Atomic Slice Architecture

**A backend-first architecture standard for AI-generated software that stays maintainable.**

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
slice.spec.md  →  slice.contract.json  →  Python skeleton  →  Your implementation
   (human)            (machine)             (generated)          (preserved)
```

1. **Spec** — Human-readable intent document (Markdown)
2. **Contract** — Machine-readable representation (JSON)
3. **Skeleton** — Generated code with marker regions (Python/TypeScript)
4. **Implementation** — Your business logic inside markers (safe during regeneration)

→ [Contract-driven pipeline](principles/contract-driven.md)

---

## Slice Architecture

A Slice is the smallest complete business operation. Everything for one feature lives in one folder:

```
domains/auth/login/
├── slice.spec.md         # What it does (human-readable)
├── slice.contract.json   # What it does (machine-readable)
├── handler.py            # FastAPI endpoint
├── service.py            # Business logic
├── repository.py         # Data access
├── schemas.py            # Pydantic models
└── tests/
    └── test_slice.py
```

Frontend Slices share the same contract, ensuring type safety across the stack:

> **Note:** Frontend support is currently in beta. Backend enforcement is the stable, validated core of ASA.

```
domains/auth/ui/Login/
├── schema.ts             # Zod validation (from contract)
├── hook.ts               # Data fetching
├── api.ts                # API client
└── Login.tsx             # React component
```

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

## Documentation

| Document | Description |
|----------|-------------|
| [Slice Architecture](principles/slice-architecture.md) | How Slices work — backend (stable) and frontend (beta) |
| [Boundary Rules](principles/boundary-rules.md) | Import rules, enforcement, allowed dependencies |
| [Contract-Driven Pipeline](principles/contract-driven.md) | Spec → Contract → Skeleton pipeline |
| [Regeneration Safety](principles/regeneration-safety.md) | Marker-based code preservation |
| [Naming Conventions](principles/naming-conventions.md) | Deterministic naming and terminology |
| [Cap, Bridge & Grow](methodology/cap-and-grow.md) | Migration methodology for existing codebases |
| [AI Chaos: Root Causes](problems/ai-chaos.md) | The failure patterns ASA addresses |

---

## Tooling

A commercial CLI tool that enforces and automates ASA rules is available separately. Contact [vibecodiq.com](https://vibecodiq.com) for details.

ASA the standard is language-agnostic. It can be implemented for any language and framework.

---

## License

This specification is published under [CC BY-SA 4.0](LICENSE).

The standard is open. No vendor lock-in. No license fees.

---

**Version 1.0** — February 2026