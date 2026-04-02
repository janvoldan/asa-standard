---
created: 2026-04-02
updated: 2026-04-02 14:00
---

# Manifesto

**URL:** `/manifesto`
**Goal:** Philosophical/opinionated document. Why ASA exists. Not in main navigation — accessible from footer. Personal, direct, honest.

---

## Why ASA Exists

AI coding tools changed what is possible. A founder who couldn't write a line of code can now ship a working app. Someone with a clear problem and ten prompts can have a product in front of users within days. That is genuinely new.

But it created a problem that wasn't obvious at first.

---

## The Problem Nobody Talks About

When AI tools generate code, they generate it for the happy path. The login form works. The checkout page looks right. The admin panel exists.

What they don't do is think about what happens when the payment fails, when the JWT is stolen, when an authenticated user tries to access another user's data, when a developer changes the billing module and accidentally breaks authentication.

AI tools are not adversarial thinkers. They generate the expected behavior, not the protection against unexpected behavior.

The result: millions of apps built at AI speed, with AI-scale gaps. Auth bypasses. Billing vulnerabilities that cost real money. Admin panels accessible to anyone who guesses the URL. Codebases that worked fine at 10 prompts and collapsed at 100.

This is not a failure of AI tools. It is the natural consequence of building fast without boundaries.

---

## What We Got Wrong the First Time

The first version of ASA tried to solve this by controlling how AI generates code. Deterministic regeneration. Marker systems. Contract-driven pipelines. The idea was: if we structure the instructions carefully enough, the output will be predictable.

It was the wrong problem.

Non-technical founders cannot write generation specs. AI tools today are capable enough that controlling generation at that level creates more friction than value. And more importantly — the danger isn't unpredictable generation. The danger is unverified output.

A generated checkout flow that works perfectly is still dangerous if the webhook doesn't verify the Stripe signature. A generated admin panel that looks good is still dangerous if there's no server-side auth check on the route. The generation was fine. The safety was missing.

---

## What ASA Is Now

ASA is a standard for verifying and enforcing the conditions under which AI-generated code remains safe.

Not prompt choreography. Not generation pipelines. Not telling AI how to write code.

Three things:

**1. Hard boundaries**
Features are designed to be self-contained. Slices are designed not to depend on other slices. A change to billing affects only billing. Blast radius is bounded by design, not by hope.

**2. Critical system verification**
Auth, billing, admin, and environment configuration are verified against defined checks. Binary PASS/FAIL. Not "looks secure" — verified against defined checks within a defined scope.

**3. Continuous enforcement**
Rules that exist only in documentation are not rules. Every PR is checked. Unsafe changes are blocked. Enforcement runs whether or not anyone remembers to run it.

---

## What This Means in Practice

AI tools move fast. ASA makes that speed survivable.

A founder using AI tools should be able to:
- Ship quickly without creating hidden security debt
- Change the product without fearing cascading regressions
- Know, with evidence, that critical systems are correctly implemented

That's what this standard is for.

---

## What ASA Is Not

ASA is not a certification. Passing checks means passing checks — not proof of perfect security.

ASA is not a replacement for expert judgment. Some problems require a human who understands the business context, the threat model, and the specific codebase.

ASA is not a product. It is a standard. Tools and services can implement it. None of them own it.

ASA is not the final word on what makes an app safe. It is a starting point — a defined, verifiable baseline that is better than no baseline at all.

---

## The Honest Version

A large share of AI-built apps that reach paying users have at least one critical gap in auth, billing, or admin. Most founders don't know it's there. Most AI tools won't tell them.

ASA exists because "it seems to work" is not a production standard.

The goal is not to slow AI development down. The goal is to make what AI builds safe enough to last.

---

*ASA — AI Safe Architecture*
*Open standard. No vendor lock-in.*
