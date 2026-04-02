---
created: 2026-04-02
updated: 2026-04-02 14:00
---

# FAQ

**URL:** `/faq`
**Goal:** Answer common questions about ASA, the 3-layer model, checks, and adoption. Framed around the standard, not a product. Clear, direct answers.

---

## About the Standard

**What is ASA?**

ASA — AI Safe Architecture — is an open standard for protecting AI-built apps. It defines three protection layers (Production Foundation, Business Logic Protection, and Slice Architecture), a set of automated safety checks, and the principles that make AI-generated code safe over time.

ASA does not prescribe how AI tools should generate code. It defines the boundaries and verification needed to keep AI-generated code safe after it's generated.

---

**Who is ASA for?**

ASA is for founders, developers, and teams building with AI coding tools (Lovable, Cursor, Replit, Bolt, and similar). It is particularly relevant for apps that handle real users, payments, or sensitive data — where gaps in auth, billing, or admin create immediate production risk.

---

**Is ASA only for Supabase and Stripe apps?**

Phase 1 checks are focused on the most common stack for AI-built SaaS apps: Next.js, Supabase (auth, database), and Stripe (payments). The principles — boundaries, verification, isolation, enforcement — apply to any stack.

Future phases will extend check coverage to additional vendors and patterns.

---

**Is ASA a certification?**

No. ASA check results are a point-in-time assessment of whether a codebase passes defined checks. A passing result does not mean the application is free of vulnerabilities. It means the application passes the specific checks included in the current phase.

ASA is not a security audit, compliance certification, or penetration test. It does not fulfill SOC2, HIPAA, PCI DSS, or any other regulatory requirement.

---

**What does "open standard" mean here?**

ASA defines checks, principles, and terminology publicly. Any team or tool can implement the checks. It is not tied to the use of any specific vendor or tool.

---

## The 3 Layers

**What is Production Foundation?**

The layer that protects systems that must not fail in production: authentication, billing, admin access, and environment configuration. Phase 1 includes 24 automated checks across these four modules.

[Learn more →](/layers/production-foundation)

---

**What is Business Logic Protection?**

The layer that protects the flows that define what the product does — onboarding, checkout, booking, approval. This layer is part of the ASA model but does not have active automated checks in Phase 1. It is not a test category — it is protection of founder-critical flows, with scenario definition and E2E coverage as its planned enforcement model.

[Learn more →](/layers/business-logic-protection)

---

**What is Slice Architecture?**

The layer that protects the structural boundaries that keep changes predictable. It enforces slice isolation, prevents cross-slice coupling, and bounds complexity. Phase 1 includes 8 automated checks. This layer prevents the "AI wall" — the point where every change causes unexpected regressions.

[Learn more →](/layers/slice-architecture)

---

**Why are there only 32 checks in Phase 1 if there are more checks in the registry?**

Phase 1 contains the checks selected for the highest confidence and lowest false-positive rate in active public results. Additional checks exist in the registry but are being validated before inclusion.

More checks are not always better. A scan with many false positives is worse than a smaller scan with reliable results.

---

## Checks and Results

**What does a PASS result mean?**

The check found no evidence of the specified gap under its current detection logic.

A PASS does not mean the area is fully secure — only that the specific check passed. Security is a defense-in-depth problem. Phase 1 covers the most critical automated checks, not every possible attack surface.

---

**What does a FAIL result mean?**

The check found evidence of the specified gap. The finding has a defined threat thesis and priority level. P0 findings require immediate attention before production.

---

**What is the difference between P0, P1, and P2?**

- **P0 — Critical:** Immediate risk of data breach, revenue fraud, or privilege escalation. Must be addressed before production.
- **P1 — Important:** Significant gap that should be addressed before scaling.
- **P2 — Recommended:** Best practice improvement with low immediate risk.

---

**Are checks deterministic?**

Phase 1 checks are designed to produce consistent results for the same codebase and configuration. They are static analysis — they scan code structure and patterns, not runtime behavior.

---

**Why doesn't ASA cover runtime behavior or performance?**

Static analysis can verify structural and configuration properties reliably. Runtime behavior (performance, availability, race conditions) requires dynamic testing in a running environment. These are different tools for different problems. ASA focuses on the structural and configuration gaps that static analysis can detect reliably.

---

## Adoption

**How do I start?**

The simplest first step: run a scan against your codebase for Phase 1 Production Foundation checks. Review the findings by priority. Address P0 findings before launch.

[Adoption guide →](/adoption)

---

**Do I need to adopt all three layers at once?**

No. Most teams start with Production Foundation — it covers the highest-risk systems. Slice Architecture becomes important when the codebase is growing and AI-assisted changes are becoming harder to predict. Business Logic Protection builds on top of both once critical flows are identified and mapped.

---

**Can ASA be adopted without any specific tool?**

Yes. The principles and check criteria are defined in the standard. Teams can adopt ASA through manual review, their own tooling, or any tool that implements the checks. ASA does not require a specific vendor.

---

**What is the difference between ASA and a security audit?**

A security audit is a comprehensive, expert-led evaluation of a system's security posture. It typically includes dynamic testing, penetration testing, code review, and threat modeling.

ASA automated checks are static analysis. They detect specific structural and configuration gaps in a codebase. They are faster and cheaper than a full audit, but narrower in scope.

ASA is a complement to security reviews, not a replacement.

---

## Legacy

**What happened to the old ASA generation workflows?**

Earlier versions of ASA included generation-era workflows: deterministic regeneration, marker-based code preservation, contract-driven pipelines, and spec-to-skeleton generation. These were designed to control how AI generates code.

The current ASA standard focuses instead on controlling the boundaries and verification needed to keep AI-generated code safe — regardless of how it was generated. The generation-era concepts are archived, not active.

[Legacy concepts →](/archive/legacy-generation-workflows)

---

## Next Steps

- [Production Foundation](/layers/production-foundation) — the right starting point for most apps
- [All checks](/checks) — the complete Phase 1 check registry
- [Adoption guide](/adoption) — how to get started
- [Terminology](/terminology) — consistent language across the standard
