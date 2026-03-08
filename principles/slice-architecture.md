# Slice Architecture

**The fundamental unit of ASA: a self-contained vertical feature.**

---

## Definition

An ASA Slice is the smallest complete business operation that can be:

- Specified in a human-readable document
- Translated into a machine-readable contract
- Generated as a code skeleton
- Implemented independently
- Tested independently
- Regenerated without losing custom logic

A Slice has exactly one business intent, one input contract, and one output contract.

---

## Slice Structure

Every Slice follows a deterministic file structure:

```
domains/<domain>/<slice>/
├── slice.spec.md         # Human-readable specification
├── slice.contract.json   # Machine-readable contract (generated)
├── handler.ts            # Route handler (Next.js route handler / server action)
├── repository.ts         # Data access (Supabase queries)
├── schemas.ts            # Zod validation schemas (generated from contract)
└── ui/
    ├── hook.ts             # React data fetching hook
    └── <Component>.tsx     # React component
```

### File Responsibilities

| File | Purpose | Contains |
|------|---------|----------|
| `slice.spec.md` | Intent document | Purpose, inputs, outputs, behaviour, errors, side effects, dependencies |
| `slice.contract.json` | Machine interface | Structured representation of the spec (never edited manually) |
| `handler.ts` | HTTP layer | Next.js route handler, request/response handling |
| `repository.ts` | Data access | Database queries (Supabase) |
| `schemas.ts` | Validation | Zod schemas (fully generated from contract) |
| `ui/hook.ts` | Data fetching | React hook for API calls |
| `ui/<Component>.tsx` | UI | React component |

### Slice Types

ASA supports three Slice types, each generating different files:

| Type | Handler | UI | Repository | Example |
|------|---------|----|-----------|---------|
| **Route** | `handler.ts` (HTTP endpoint) | ✅ (default on) | ✅ (default on) | `auth/login`, `billing/subscribe` |
| **Webhook** | `handler.ts` (webhook receiver) | ❌ (always off) | ✅ (default on) | `billing/webhook` |
| **Internal service** | `service.ts` (no HTTP route) | ❌ (always off) | ✅ (default on) | `billing/check-limits` |

### Example

```
domains/
├── auth/
│   ├── login/           # "User logs in with email and password"
│   ├── register/        # "User creates a new account"
│   └── logout/          # "User session is terminated"
└── billing/
    ├── subscribe/       # "User subscribes to Pro plan" (route)
    ├── webhook/         # "Handle Stripe webhook events" (webhook)
    └── check-limits/    # "Check plan limits for user" (internal service)
```

Each Slice is self-contained. `auth/login` does not import from `billing/subscribe`.

### Runtime Adapters

Slices live in `domains/` but Next.js routes live in `app/`. ASA generates thin **runtime adapters** that wire slices to the Next.js runtime:

```typescript
// app/api/auth/login/route.ts — auto-generated, read-only
export { POST } from '@/domains/auth/login/handler';
```

Runtime adapters are strictly read-only. Business logic belongs in `domains/`, not in `app/`.

---

## Contract Alignment

Each Slice has one contract that generates both handler types (Zod schemas) and UI hooks:

```
slice.contract.json
        │
        ├─→  schemas.ts     (Zod validation — used by handler and UI)
        ├─→  handler.ts     (route handler imports schemas)
        └─→  ui/hook.ts     (React hook imports schemas)
```

The contract is the single source of truth. Type mismatches between handler and UI are structurally impossible.

---

## Granularity

### Correct Granularity

One Slice = one complete business use-case.

| Domain | Slice | Intent |
|--------|-------|--------|
| `auth` | `login` | User logs in with email and password |
| `auth` | `register` | User creates a new account |
| `billing` | `create_invoice` | Create invoice from order data |
| `payments` | `process` | Charge payment method |

### Too Coarse

If the intent cannot be expressed in one sentence, the Slice is too large.

- `user/manage` — multiple intents
- `order/process` — multiple independent decision trees
- `invoice/handle_all` — more than 10 behaviour steps

### Too Fine

If the logic is a helper or internal computation, it is not a Slice.

- `user/validate_email_format` — belongs inside a service method
- `cart/compute_total_only` — internal helper, not a business operation

---

## Organization: Domains

Slices are grouped into **Domains** — logical business areas:

```
domains/
├── auth/          # Authentication and authorization
├── billing/       # Invoicing and payments
├── users/         # User management
└── notifications/ # Email, SMS, push
```

Domains define the boundary for allowed imports. Slices within the same domain may reference each other. Cross-domain imports are forbidden.

---

## Shared Infrastructure

Infrastructure that is not business logic lives in `/shared`:

```
shared/
├── db/
│   ├── supabase-client.ts   # Canonical DB client (browser/server/admin)
│   ├── types.ts             # Database types
│   └── migrations/          # SQL migration files
├── auth/
│   ├── middleware.ts         # Session check, route protection
│   ├── session.ts           # Server-side session helpers
│   └── hooks.ts             # useUser(), useSession()
└── billing/
    ├── stripe-client.ts     # Stripe client config
    ├── plans.ts             # Plan definitions and limits
    └── hooks.ts             # useSubscription()
```

### What Belongs in `/shared`

| Allowed | Example |
|---------|--------|
| Database client | `shared/db/supabase-client.ts` |
| Auth middleware | `shared/auth/middleware.ts` |
| External service config | `shared/billing/stripe-client.ts` |
| Cross-domain hooks | `shared/auth/hooks.ts` |

### What Does NOT Belong in `/shared`

| Forbidden | Reason |
|-----------|--------|
| Business logic | Belongs in Slice handlers/services |
| Validators with business rules | Duplicated per Slice |
| Domain-specific calculations | Slice-specific |

---

## The Duplication Principle

> Prefer duplication inside Slices over sharing business logic.

If two Slices need similar validation logic, duplicate it. Do not extract it to `/shared`.

```typescript
// Each slice has its own copy
// domains/auth/register/handler.ts
function validatePassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password);
}

// domains/auth/reset-password/handler.ts
function validatePassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password);
}
```

Why: shared helpers create coupling. Coupling creates drift. Drift breaks deterministic regeneration.

In ASA, coupling is expensive. Duplication is free.

---

## Orchestration

Slice handlers do not orchestrate other Slices. Multi-slice workflows use internal service slices or server actions:

```typescript
// Server action or API route that orchestrates multiple slices
import { registerUser } from '@/domains/auth/register/handler';
import { sendWelcomeEmail } from '@/domains/notifications/welcome/service';

export async function registerAndWelcome(data: RegisterInput) {
  const user = await registerUser(data);
  await sendWelcomeEmail({ email: user.email });
  return user;
}
```

This keeps each Slice independent and testable in isolation.
