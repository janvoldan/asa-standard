# Boundary Rules

**How ASA enforces architectural isolation and prevents dependency graph corruption.**

---

## The Problem

In AI-generated codebases, the pattern usually emerges when modules start importing each other's internals. What begins as a convenience becomes circular dependencies forming between modules, cross-domain imports bypassing boundaries, and shared utilities becoming a gravity well.

The structural cause: AI optimizes locally. It finds the shortest path to make code work — even if that path violates architectural boundaries. Without enforcement, every AI-assisted change erodes isolation.

---

## The Rule

> **A Slice may only import from its own domain and from `/shared`. Cross-domain imports are forbidden.**

| From | To | Allowed |
|------|----|---------|
| `auth/login` | `auth/register` | Yes — same domain |
| `auth/login` | `shared/database` | Yes — shared infrastructure |
| `auth/login` | `billing/create_invoice` | **No — cross-domain** |
| `billing/create_invoice` | `auth/login` | **No — cross-domain** |

---

## Enforcement: AST-Based Linting

ASA enforces boundaries through static analysis of the import graph using Abstract Syntax Tree (AST) parsing.

```bash
$ npx @vibecodiq/cli guard check

❌ [LINT FAIL] Boundary violation in repository.ts:
   Line 3: Illegal import '@/domains/billing/subscribe/handler'
   -> Cannot import from other domains.
```

The linter checks every `.ts` and `.tsx` file in the Slice and verifies that:

- No imports reference other domains
- Only `shared/` modules are used for cross-cutting concerns
- No reverse dependencies exist (legacy importing from ASA domains)
- No `service_role` / admin client usage in browser-capable code
- No overly permissive RLS policies (`USING (true)`, `WITH CHECK (true)`)

---

## What the Linter Validates

| Check | Description |
|-------|-------------|
| **Cross-domain imports** | Detects imports from `domains/X` in a Slice belonging to domain `Y` |
| **Required files** | Verifies all standard Slice files exist (based on slice type) |
| **Contract validity** | Checks `slice.contract.json` is valid and matches the spec |
| **Marker integrity** | Verifies `ASA GENERATED` / `USER CODE` markers are present |
| **Security** | Detects admin client / service_role key in browser-capable files |
| **RLS** | Detects overly permissive RLS policies in SQL migrations |

---

## Allowed Dependencies

### Within a Slice

A Slice's files may import from each other freely:

```typescript
// domains/auth/login/handler.ts
import { LoginRequestSchema } from './schemas';    // ✅ Same slice
import { loginQuery } from './repository';         // ✅ Same slice
```

### Within a Domain

Slices in the same domain may reference each other:

```typescript
// domains/auth/login/handler.ts
import type { Profile } from '@/domains/auth/register/schemas';  // ✅ Same domain
```

### From Shared

Any Slice may import from `/shared`:

```typescript
// domains/billing/subscribe/handler.ts
import { createServerClient } from '@/shared/db/supabase-client';  // ✅ Shared infra
import { stripe } from '@/shared/billing/stripe-client';           // ✅ Shared adapter
```

### Forbidden

```typescript
// domains/auth/login/handler.ts
import { subscribe } from '@/domains/billing/subscribe/handler';   // ❌ Cross-domain
import { createAdminClient } from '@/shared/db/supabase-client';   // ❌ Admin client in route handler
```

---

## The Bridge Exception

In migration scenarios (Cap, Bridge & Grow), ASA Slices access legacy data through bridge adapters in `/shared/legacy_bridge`:

```typescript
// ✅ Correct — via bridge adapter
import { BillingAdapter } from '@/shared/legacy-bridge/billing';

// ❌ Forbidden — direct legacy import
import { calculateTotal } from '@/legacy/src/billing';
```

The bridge adapter is a thin translation layer — no business logic. If logic appears in the bridge, the migration has failed.

See [Cap, Bridge & Grow](../methodology/cap-and-grow.md) for details.

---

## AI Governance

Boundary rules extend to AI assistants through `.cursorrules`:

```text
# ASA Boundary Rules

## Forbidden
- DO NOT import from one domain into another
- DO NOT add business logic to /shared
- DO NOT modify files in /legacy
- DO NOT bypass the contract system

## Required
- All features must be ASA Slices in /domains
- Run `npx @vibecodiq/cli guard check` after every change
- Update spec first, then regenerate
```

AI tools (Windsurf, Cursor, Copilot) read these rules and constrain their code generation accordingly.

---

## Why Boundaries Matter

| Benefit | Mechanism |
|---------|-----------|
| **Isolation** | Changes in one domain cannot cascade to another |
| **Testability** | Each Slice tests independently, no hidden dependencies |
| **Cognitive load** | Understand one Slice at a time, not the whole system |
| **Safe regeneration** | Regenerating a Slice cannot break other domains |
| **Team ownership** | Clear responsibility per domain |
| **AI safety** | AI operates within explicit, enforceable constraints |

Without enforcement, boundaries erode. The pattern usually emerges gradually — one cross-domain import, then two, then the system is no longer decomposable.

ASA makes boundary violations visible and blocking, not just advisory.
