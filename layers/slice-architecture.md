---
created: 2026-04-02
updated: 2026-04-02 14:00
---

# Slice Architecture

**URL:** `/layers/slice-architecture`
**Goal:** Define what Slice Architecture protects, what structural decay looks like, how boundaries are enforced, list all 8 Phase 1 checks. Relationship to AI Chaos Index. AI wall as consequence, not definition.

---

## What It Protects

Slice Architecture protects the app from structural decay — the gradual loss of boundaries that makes every change risky and every AI prompt unpredictable.

When code is well-structured, a change to the billing flow affects only the billing code. When structure breaks down, a change to billing can break authentication, admin access, or features that seem completely unrelated. This is the fundamental problem Slice Architecture addresses.

The protection is structural: explicit boundaries between features, bounded complexity per unit, and clear dependency direction. When these rules hold, AI tools can work safely within defined scope. When they don't, every AI-generated change increases the probability of regression.

---

## What Typically Breaks

### Coupling grows silently

AI tools import whatever works. They don't track dependency direction or respect feature boundaries. Over time, every part of the codebase depends on every other part. A single change can trigger failures across unrelated features.

### Files grow beyond AI context

After many prompts, individual files grow to hundreds or thousands of lines. At that point, AI tools lose context — they contradict previous logic, introduce regressions, and can no longer reason about the file coherently. This is often the point where founders report hitting the "AI wall."

### Business logic leaks into infrastructure

Without explicit boundaries, business logic migrates into page files, shared utilities, and component hierarchies. It becomes impossible to change one feature without understanding all features. Testing in isolation becomes impractical.

### Structure stops being intentional

Without enforcement, the codebase loses its organizational intent. New features get added wherever is convenient, not where they belong. The gap between how the code is structured and how it should be structured grows with every change.

---

## How It Is Enforced

Slice Architecture is enforced through 8 automated checks that verify structural boundaries, isolation, and complexity constraints.

A **slice** is ASA's fundamental unit: a self-contained vertical feature with hard boundaries. Slices cannot depend on other slices. Shared infrastructure is explicitly separated from business logic. Each slice is designed to be independently testable and replaceable.

Enforcement verifies:
- **Isolation** — business logic lives in dedicated feature directories, not in pages or components
- **Boundaries** — no cross-slice imports exist
- **Complexity** — files and slices stay within bounded sizes
- **Dependency direction** — imports flow from slices to shared infrastructure, never between slices

---

## Phase 1 Checks

**Status:** Active in Phase 1 — 8 automated checks.
**Metric:** AI Chaos Index (0–100, higher = more structural risk).

### Architecture Checks (6)

| ID | Name | Priority | Threat |
|----|------|----------|--------|
| ARCH-01 | Business logic in dedicated feature directories | P0 | Business logic in page files or components creates the "god component" pattern — everything is coupled, nothing is testable, and AI tools amplify the chaos on every prompt. |
| ARCH-02 | Feature directory structure exists | P0 | Without dedicated feature directories, business logic has nowhere structured to go. AI tools dump everything into pages, components, or utilities — creating a monolith. |
| ARCH-03 | No cross-slice imports | P1 | Cross-slice imports create hidden coupling. When one feature imports from another, changing the first can break the second. This is the primary cause of cascading regressions in AI-generated code. |
| ARCH-04 | Thin pages | P1 | Fat page files mix routing, layout, state, and business logic in one place. AI tools generate entire features in a single page. Thin pages that delegate to feature modules are testable, replaceable, and safe for AI modification. |
| ARCH-05 | Shared utilities contain no business logic | P1 | Shared directories should contain only cross-cutting infrastructure (database clients, auth middleware, UI primitives). When business logic leaks into shared code, it couples all features — defeating isolation. |
| ARCH-06 | Bounded file size | P1 | AI tools add code to whichever file already contains related logic. After many prompts, files grow beyond the point where AI can reason about them coherently — contradicting previous logic and introducing regressions. |

### Structure Checks (2)

These two checks are not boundary rules — they verify structural enforcement readiness. Without a pipeline and tests, the architectural rules defined above cannot be continuously enforced. They are prerequisites for automated architecture enforcement.

| ID | Name | Priority | Threat |
|----|------|----------|--------|
| STR-01 | CI/CD pipeline exists | P1 | Without a CI/CD pipeline, code goes from AI tool to production unchecked. Safety scans run only when someone remembers. Regressions accumulate silently. A pipeline is the prerequisite for all automated enforcement. |
| STR-02 | Test files exist | P1 | AI tools almost never generate tests. Without any test files, every AI-generated change might break existing functionality — and nobody knows until a user reports it. |

---

## Relationship to AI Chaos Index

AI Chaos Index is the primary metric for Slice Architecture. It measures structural risk through weighted check results across five root causes:

| Root Cause | Checks | Max Points |
|------------|--------|------------|
| RC01 Architecture Drift | ARCH-01, ARCH-04, ARCH-06 | 40 |
| RC02 Dependency Corruption | ARCH-03 | 20 |
| RC03 Structural Entropy | ARCH-02, ARCH-05 | 20 |
| RC04 Test Infrastructure | STR-02 | 10 |
| RC05 Deployment Safety | STR-01 | 10 |
| **Total** | | **100** |

**Scoring:** Direct sum of fail points. Higher score = more structural chaos.

| Score | Risk Band | Meaning |
|-------|-----------|---------|
| 0–20 | Minimal | Architecture is clean, regressions unlikely |
| 21–40 | Low | Minor issues, low risk |
| 41–60 | Moderate | Structural problems present, medium regression risk |
| 61–80 | High | AI-generated changes likely cause regressions |
| 81–100 | Critical | Architecture is broken, every change is risky |

AI Chaos Index is a point-in-time structural assessment. It is not a certification or guarantee of maintainability.

---

## What Slice Architecture Does Not Cover

- Authentication, billing, or admin safety (→ Production Foundation)
- Business flow correctness (→ Business Logic Protection)
- Runtime performance, memory, or availability
- General code style, formatting, or non-structural quality concerns

Slice Architecture protects **change safety** — whether the structure allows safe modification over time. It does not assess whether the current code is correct or performant.

---

## Next Steps

- [Production Foundation](/layers/production-foundation) — what must not fail in production (24 active checks)
- [Business Logic Protection](/layers/business-logic-protection) — flow protection (planned)
- [All checks](/checks) — complete Phase 1 registry
- [Principles](/principles) — core ASA principles including isolation and boundaries
