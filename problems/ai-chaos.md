# AI Chaos: The Failure Patterns ASA Addresses

**A systematic analysis of recurring failures in AI-generated and AI-maintained codebases.**

---

## Context

What we observe in AI-generated codebases past Day 30 is a recurring class of failures. These are not random bugs. They are systemic failure patterns with identifiable root causes.

The pattern usually emerges when AI-assisted applications move from prototype to production. During the initial build, AI generates functional code quickly. Over time, as features accumulate and requirements change, the codebase enters a state where every modification carries unpredictable risk.

This class of problems is still poorly understood because the symptoms appear gradual. By the time they are visible, the system already resists safe modification.

---

## Five Root Causes

### RC01: Architecture Drift

The architecture slowly dissolves. AI optimizes locally without global structure. Each generation is locally correct but globally destructive.

**What happens:**
- Oversized files accumulating business logic
- Business logic migrating into wrong layers
- Cross-layer dependencies forming silently
- Scaffold code mixed with custom logic without separation
- Full-file rewrites erasing previous architectural decisions

**What teams report:**
- "Every change breaks something else"
- "6 months ago it worked fine, now every change is expensive"
- "Nobody knows which file owns which logic"

**ASA response:** Slice isolation ensures each feature lives in a bounded, deterministic structure. The boundary linter detects logic leaking across layers before it compounds.

---

### RC02: Dependency Graph Corruption

Modules start importing each other's internals. What begins as a convenience becomes isolation impossible — everything depends on everything.

**What happens:**
- Circular dependencies forming between modules
- Cross-domain imports bypassing boundaries
- Shared utilities becoming a gravity well (everything imports from one place)
- Deep transitive dependency chains

**What teams report:**
- "Can't test one part without breaking another"
- "Every PR is a risk"

**ASA response:** Import rules enforced via AST analysis. Cross-domain imports are forbidden and caught by the linter. The dependency graph remains acyclic by design.

---

### RC03: Structural Entropy

No deterministic structure. Naming conventions mix. File organization is inconsistent. The codebase has no predictable pattern.

**What happens:**
- Mixed naming conventions across the codebase (camelCase, snake_case, PascalCase in the same module)
- Inconsistent file organization — mix of flat and nested structures
- Duplicate code locations — models defined in three different places
- Missing standard files — no README, no tests directory, no configuration

**What teams report:**
- "Nobody understands the code anymore"
- "We handed it off and the new team can't work with it"
- "Estimates are unpredictable"

**ASA response:** Deterministic scaffolding. Every Slice follows an identical file structure with fixed file names. There are no naming decisions to make. New developers orient in minutes, not weeks.

---

### RC04: Test Infrastructure Failure

Missing feedback loop. No regression safety net. Tests are absent, stale, or never run. Errors pass directly to production.

**What happens:**
- Test coverage below meaningful threshold
- Entire modules without a single test
- Stale tests importing functions that no longer exist

**What teams report:**
- "Every deployment is a prayer"
- "We're afraid to touch anything"
- "The app works in dev, breaks in production"

**ASA response:** Per-slice test generation. Every generated Slice includes a test file. The structure makes testing natural — each Slice has clear inputs, outputs, and behaviour defined in the spec.

---

### RC05: No Deployment Safety Net

No automated enforcement. Code goes from developer to production unchecked. Even if RC01–RC04 are addressed, without enforcement they return.

**What happens:**
- No CI/CD configuration present
- CI pipeline exists but has no lint step
- CI pipeline exists but has no test step
- No pre-commit hooks — unsafe changes pass silently
- No branch protection — direct push to main possible

**What teams report:**
- "We shipped a bug that should have been caught automatically"
- "There's no safety check before deployment"

**ASA response:** The boundary linter (`asa lint`) integrates into CI/CD pipelines. Boundary violations, missing files, and contract mismatches are caught before code reaches production. The system has an immune system.

---

## How These Compound

These root causes do not appear in isolation. They reinforce each other:

```
Architecture Drift
        +
Dependency Graph Corruption
        +
Structural Entropy
        =
A codebase where every change is a gamble

        +
Test Infrastructure Failure
        +
No Deployment Safety Net
        =
No way to catch the consequences
```

The failure mode appears when earlier decisions fall out of enforcement. The initial structure may have been reasonable. But without automated boundary enforcement, each AI-assisted change introduces small violations that accumulate into systemic breakdown.

---

## The Structural Cause

The structural cause is not that AI writes bad code. Modern AI tools produce locally correct implementations.

The problem is that AI optimizes for the immediate task without maintaining global invariants:

| What AI Does Well | What AI Does Poorly |
|-------------------|---------------------|
| Implement a function | Maintain cross-module boundaries |
| Fix a specific bug | Preserve import direction rules |
| Generate a component | Maintain consistent naming across files |
| Write a test | Ensure test infrastructure stays connected |

ASA addresses this by making global invariants explicit, machine-readable, and automatically enforced. The architecture protects itself — regardless of whether changes come from human developers or AI agents.

---

## Observation Methodology

These root causes were identified through systematic analysis of AI-generated codebases, including:

- Repository structure analysis (file organization, naming patterns, dependency graphs)
- Import graph analysis (circular dependencies, cross-domain violations, transitive chains)
- Test infrastructure audit (coverage, staleness, CI integration)
- Deployment pipeline review (enforcement gates, branch protection, automation)

Each root cause maps to specific, detectable failure patterns with defined thresholds. This is not opinion — it is structured observation.
