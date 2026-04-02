---
created: 2026-04-02
updated: 2026-04-02 14:00
---

# Core Principles

**URL:** `/principles`
**Goal:** Define the 4 normative ASA principles. Authoritative language — "ASA requires", not "the tool does". Each principle tied to why it matters in the context of AI-built apps.

---

## What the Standard Requires

ASA is built on four principles. They apply to all three protection layers. They are not guidelines or best practices — they are the structural commitments that define what it means to build an AI-safe app.

---

### 1. Boundaries

**Every critical area must have explicit, enforced limits.**

AI tools don't know where one responsibility ends and another begins. They import whatever is available, grow files until they become monoliths, and mix infrastructure with business logic. Without explicit boundaries, the system becomes one interconnected mass where nothing can change safely.

ASA requires:
- Feature slices with defined scope and no cross-slice dependencies
- Module boundaries between auth, billing, admin, and foundation systems
- Explicit dependency direction — infrastructure does not depend on features
- Structural limits that prevent unbounded growth and context loss

A boundary that exists only in documentation is not a boundary. Boundaries must be verifiable and enforceable.

---

### 2. Verification

**Critical claims must be testable. Safety cannot be assumed.**

AI tools generate code that looks correct. It follows familiar patterns, passes lint checks, and often works during development. But it skips the checks that matter in production — signature verification, server-side auth, idempotency — not because the AI is wrong, but because these checks are invisible until something exploits the gap.

ASA requires:
- Each safety claim verified by a deterministic, automated check
- Binary PASS/FAIL results — no partial credit, no "mostly compliant"
- Checks that test implementation, not intent
- Continuous verification on every relevant change or PR

A claim that auth is secure without a check that verifies it is not verification. It is assumption.

---

### 3. Isolation

**A change should affect only its intended scope.**

When structure is intact, a change to billing affects only billing code. When structure breaks down, that same change can break authentication, corrupt admin logic, or silently disable an unrelated feature. The blast radius of a change is a structural property — it is determined by the boundaries in place before the change is made.

ASA requires:
- Slices that are designed to be independently testable and replaceable
- No shared state between slices except through explicitly defined interfaces
- Shared infrastructure that is isolated from business logic
- Structural rules that bound what a change can affect

Isolation does not happen by convention. It requires explicit enforcement.

---

### 4. Enforcement

**Safety rules must run continuously. Documentation does not enforce itself.**

A standard that exists only in a document is a starting point, not a system. Developers forget rules under deadline pressure. AI tools don't know the rules exist. Without automated enforcement, every release is a gamble on whether the current change respects the previous safety work.

ASA requires:
- Automated checks that run on every PR before merge
- CI/CD gates that block unsafe changes from reaching production
- Results that are machine-readable, reproducible, and auditable
- Enforcement that runs whether or not someone remembers to run it

The gap between "we have a rule" and "the rule is enforced" is where most safety failures live.

---

## How the Principles Relate to the Layers

| Principle | Production Foundation | Business Logic Protection | Slice Architecture |
|-----------|----------------------|--------------------------|-------------------|
| **Boundaries** | Module boundaries for auth, billing, admin | Flow boundaries for each critical user flow | Slice boundaries between features |
| **Verification** | 24 automated safety checks (active) | E2E scenario verification (planned) | 8 structural checks (active) |
| **Isolation** | Each system module is independently verifiable | Each flow is independently testable | Each slice is self-contained |
| **Enforcement** | CI/CD safety gates | CI/CD flow test gates (planned) | CI/CD structure checks |

The principles are consistent across all layers. The implementation differs by layer type.

---

## What the Principles Do Not Prescribe

ASA principles define **what** must hold, not **how** it is implemented.

The standard does not require a specific framework, tool, or vendor. Boundaries can be enforced by linters, CI checks, or manual review. Verification is automated where possible and expert-led where the layer requires human judgment. Isolation can be achieved through different directory structures or module patterns. Enforcement can run in GitHub Actions, GitLab CI, or any other pipeline.

Implementation choices are left to the team. Compliance with the principles is not.

---

## Next Steps

- [Production Foundation](/layers/production-foundation) — boundaries and verification in practice
- [Slice Architecture](/layers/slice-architecture) — isolation and enforcement in practice
- [All checks](/checks) — how principles are expressed as automated checks
- [Adoption guide](/adoption) — how to introduce ASA principles in an existing project
