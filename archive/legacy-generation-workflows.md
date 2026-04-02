---
created: 2026-04-02
updated: 2026-04-02 14:00
---

# Legacy: Generation-Era Workflows

**URL:** `/archive/legacy-generation-workflows`
**Goal:** Honestly archive the generation-era ASA concepts. One page, clearly marked as historical. Explains why these concepts are no longer active without pretending they never existed.

---

> These concepts reflect an earlier phase of ASA, focused on controlling how AI generates code. They are no longer part of the active ASA standard.

---

## What This Archive Contains

Early versions of ASA included a set of workflows designed to make AI code generation predictable and repeatable. These were built around the idea that if you gave AI tools structured enough instructions and constraints, generation could be made deterministic.

The workflows included:

**Deterministic regeneration**
A process for regenerating parts of a codebase from structured specifications while preserving existing logic. The goal was to make AI generation repeatable — the same spec would always produce the same output.

**Marker-based code preservation**
A convention for marking sections of code that should be preserved across regeneration cycles. Markers told the AI tool what not to touch when regenerating surrounding code.

**Contract-driven generation**
Specifications ("contracts") defined the intended structure of a feature before generation. The AI tool was expected to follow the contract when generating code.

**Spec-to-skeleton generation**
A workflow that converted high-level feature specifications into code skeletons — stub files and directory structures that the AI tool would then fill in.

**Slice-level generation pipeline**
A structured pipeline for generating, reviewing, and assembling code at the slice level, with explicit handoff points between human review and AI generation.

---

## Why These Concepts Are No Longer Active

Modern AI coding tools (Lovable, Cursor, Replit, Bolt, and similar) have changed how founders build apps. The generation-era workflows assumed that precise, structured instructions could make AI generation reliable.

In practice:

- Non-technical founders cannot write structured generation specs
- AI tools today are capable enough that controlling generation at this level creates more friction than value
- The real risk is not unpredictable generation — it is unsafe output: auth gaps, billing vulnerabilities, architectural decay

The current ASA standard focuses on a different problem: **not controlling how AI generates code, but verifying and enforcing the conditions under which AI-generated code remains safe**.

This shift means:
- No prompt choreography
- No generation pipelines
- No marker conventions

Instead: boundaries, checks, enforcement.

---

## How the Current Standard Addresses the Same Goals

| Legacy goal | Current emphasis |
|-------------|-----------------|
| Deterministic regeneration | Consistent verification + bounded blast radius (same checks, same results; changes affect only the intended slice) |
| Marker-based preservation | Slice boundaries + CI/CD guard (structural isolation limits what changes can affect; enforcement catches regressions) |
| Contract-driven generation | Check-based verification (PASS/FAIL against defined criteria, not generation specs) |
| Spec-to-skeleton pipeline | ASA-aligned production foundation (safe starting point, not a generation workflow) |
| Slice-level generation | Slice Architecture checks (verifies structure exists and holds, not how it was generated) |

---

## Historical Note

ASA was originally called "Atomic Slice Architecture" and focused on making AI code generation structured and repeatable. The core insight about slices — self-contained vertical features with hard boundaries — remains valid and is the foundation of the current Slice Architecture layer.

What changed is the framing: from "how to guide AI generation" to "how to keep AI-generated code safe over time."

---

## Next Steps

- [Homepage](/), [Principles](/principles) — the current ASA model
- [Slice Architecture](/layers/slice-architecture) — how slice concepts evolved
- [Adoption guide](/adoption) — how to start with the current standard
