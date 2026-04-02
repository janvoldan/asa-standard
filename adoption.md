---
created: 2026-04-02
updated: 2026-04-02 14:00
---

# Adoption

**URL:** `/adoption`
**Goal:** Explain how ASA is used in practice. Implementation-agnostic. No sales tone. Vibecodiq mentioned secondarily as one aligned implementation path.

---

## How ASA Is Used

ASA defines what should be true. Adoption is how a team gets there and keeps it there.

The standard is implementation-agnostic. There is no required tool, vendor, or workflow. Teams can adopt ASA through any combination of process, tooling, CI/CD enforcement, and expert review — as long as the checks are verified and the principles hold.

---

## Adoption Paths

### 1. Process-based adoption

The simplest starting point. Teams read the standard, map their codebase against the three protection layers, and identify gaps manually.

Suitable for:
- Small teams doing their first assessment
- Teams without CI/CD yet
- Early-stage apps before scaling

Limitations: Manual review is not continuous. Gaps can reappear after changes without automated detection.

---

### 2. Tooling-based adoption

Automated scanning tools verify compliance against Phase 1 checks on demand or on a schedule.

Suitable for:
- Teams that want repeatable, consistent results
- Founders who want to verify before launch or before a major release
- Teams that run scans as part of their development workflow

What tooling provides:
- Consistent PASS/FAIL results for all active checks
- Findings organized by layer (Production Foundation, Slice Architecture)
- Priority-sorted output for remediation planning

---

### 3. CI/CD enforcement

Safety checks run automatically on every pull request. Unsafe changes are blocked before they reach the main branch.

Suitable for:
- Teams with an existing CI/CD pipeline
- Apps in active development with regular changes
- Teams that want to prevent safety regressions, not just detect them

What CI/CD enforcement provides:
- Continuous verification without manual intervention
- Regression prevention: PASS checks cannot silently become FAIL
- Enforcement that runs whether or not anyone remembers to run it

For active Phase 1 checks, this is typically the most robust adoption model. Process and tooling detect gaps. CI/CD prevents them from recurring.

---

### 4. Expert review

Manual validation by someone with expertise in the relevant systems (auth, billing, admin, architecture).

Suitable for:
- Complex apps where automated checks don't cover all scenarios
- Pre-launch or pre-fundraise assessments
- Teams that want findings explained and prioritized, not just listed
- Business Logic Protection assessment (not yet covered by automated checks)

Expert review complements automated checks — it covers what static analysis cannot: business context, ownership verification, privilege escalation paths, and flow correctness.

---

## Adoption Stages

Most teams don't adopt all four paths at once. A typical progression:

**Stage 1 — Assessment**
Run an initial scan. Understand the current state across Production Foundation and Slice Architecture. Prioritize findings by P0 → P1 → P2.

**Stage 2 — Remediation**
Address critical gaps. Focus on P0 findings first. Verify fixes with a follow-up scan.

**Stage 3 — Enforcement**
Integrate checks into CI/CD. Prevent regressions from returning. New code must pass the same checks as the original assessment.

**Stage 4 — Ongoing**
Maintain enforcement as the product evolves. Add Business Logic Protection as critical flows are identified and mapped.

---

## Adopting Each Layer

### Production Foundation

Start here. These checks cover the highest-risk systems: authentication, billing, admin, and environment configuration. Most teams have gaps in at least two modules.

- Run Phase 1 checks for Production Foundation (24 checks)
- Address all P0 findings before launch
- Integrate into CI/CD to prevent regression

### Slice Architecture

Prioritize this when the codebase is growing and AI-assisted changes are becoming unpredictable.

- Run Phase 1 checks for Slice Architecture (8 checks)
- Address cross-slice imports and oversized files first
- CI/CD enforcement prevents new boundary violations

### Business Logic Protection

Currently not covered by automated Phase 1 checks. Adoption starts with manual work:

- Identify the 3–5 most critical user flows
- Define expected behavior for each as testable scenarios
- Write E2E tests (Playwright or equivalent)
- Add to CI/CD: flows must pass before deploy

---

## What ASA Does Not Prescribe

The standard defines what must be true, not how to achieve it.

ASA does not require:
- A specific framework, language, or runtime
- A specific CI/CD provider
- A specific tooling vendor
- A specific directory structure beyond the slice model

Teams can implement the principles with whatever stack and workflow works for them. The checks are the measure. The implementation is the team's choice.

---

## Vibecodiq

Vibecodiq is one implementation path aligned with the ASA standard. It provides:

- Automated scanning for Phase 1 checks
- CI/CD guard integration
- Expert assessment and remediation support
- An ASA-aligned production foundation for teams starting from scratch

Vibecodiq is not the only way to implement ASA. It is one way.

---

## Next Steps

- [Production Foundation](/layers/production-foundation) — where to start for most apps
- [Slice Architecture](/layers/slice-architecture) — structural protection
- [All checks](/checks) — the complete Phase 1 check registry
- [FAQ](/faq) — common questions about getting started
