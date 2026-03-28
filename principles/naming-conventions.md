# Naming Conventions

**Deterministic naming rules for ASA projects.**

---

## Architecture Name

The standard described in this repository is officially called:

**ASA (AI Safe Architecture)**

### Canonical Name

**AI Safe Architecture** is the canonical and current name. The abbreviation **ASA** is used as a short-form reference.

### Historical Names

Earlier names used during development:

- Agentic-Sliced Architecture
- AI-Sliced Architecture

These refer to earlier iterations of the same core concept and are kept for historical context only. All new documentation uses **ASA (Atomic Slice Architecture)**.

---

## File Naming

### Slice Files

File names within a Slice are fixed. There is no decision to make:

| File | Convention | Example |
|------|-----------|--------|
| Spec | `slice.spec.md` | Always this exact name |
| Contract | `slice.contract.json` | Always this exact name |
| Handler | `handler.ts` | Route handler (for route/webhook slices) |
| Service | `service.ts` | Internal service (for internal-service slices) |
| Repository | `repository.ts` | Database access |
| Schemas | `schemas.ts` | Zod validation (fully generated from contract) |
| Hook | `ui/hook.ts` | React data fetching hook |
| Component | `ui/<DomainSlice>Form.tsx` | `ui/AuthLoginForm.tsx` |

This eliminates structural entropy.

---

## Directory Naming

### Domains

Domain directories use `snake_case`:

```
domains/
├── auth/
├── billing/
├── user_management/
└── notifications/
```

### Slices

Slice directories use `kebab-case`:

```
domains/auth/
├── login/
├── register/
├── reset-password/
└── logout/
```

UI files live inside the slice (not a separate `ui/` domain directory):

```
domains/auth/login/
├── handler.ts
├── schemas.ts
└── ui/
    ├── hook.ts
    └── AuthLoginForm.tsx
```

---

## Code Naming

### TypeScript

| Element | Convention | Example |
|---------|-----------|--------|
| Components | `PascalCase` | `AuthLoginForm`, `BillingSubscribeForm` |
| Hooks | `camelCase` with `use` prefix | `useAuthLogin`, `useBillingSubscribe` |
| Schemas | `PascalCase` with `Schema` suffix | `LoginRequestSchema` |
| Functions | `camelCase` | `handleLogin`, `checkPlanLimits` |
| Variables | `camelCase` | `jwtToken`, `expiresIn` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_LOGIN_ATTEMPTS` |
| Error codes | `UPPER_SNAKE_CASE` | `INVALID_CREDENTIALS` |
| Contract fields | `camelCase` | `"name": "clientName"` |
| DB table names | `snake_case` | `profiles`, `subscriptions` |
| DB column names | `snake_case` | `user_id`, `created_at` |
| Env variables | `SCREAMING_SNAKE_CASE` | `NEXT_PUBLIC_SUPABASE_URL` |

### Component Naming (deterministic, no singularization)

Components follow `{DomainPascal}{SlicePascal}{Suffix}` pattern:

| Slice | Component | Hook |
|-------|-----------|------|
| `auth/login` | `AuthLoginForm` | `useAuthLogin` |
| `invoices/create` | `InvoicesCreateForm` | `useInvoicesCreate` |
| `dashboard/summary` | `DashboardSummaryView` | `useDashboardSummary` |

No singularization — `invoices` stays `Invoices`, not `Invoice`. Fully deterministic.

---

## Spec Field Naming

All fields in `slice.spec.md` use `snake_case`:

```markdown
## Inputs
- email: string
- password: string
- remember_me: boolean

## Outputs
- jwt_token: string
- expires_in: int
- user_id: string
```

Field names must be valid identifiers. No hyphens, no spaces, no special characters.

---

## Error Code Naming

Error codes in the Spec use `UPPER_SNAKE_CASE`:

```markdown
## Errors
- INVALID_CREDENTIALS: Invalid email or password.
- USER_NOT_FOUND: No user with this email exists.
- ACCOUNT_LOCKED: Account has been locked.
```

Error codes are deterministic identifiers, not human-readable messages. The message follows the colon.

---

## Why Deterministic Naming Matters

Structural entropy is one of the root causes of codebase degradation. Mixed naming conventions across a codebase create:

- Cognitive overhead for every new contributor
- Unpredictable file locations
- Inconsistent imports and references
- AI tools generating code in conflicting styles

ASA eliminates naming decisions. File names are fixed. Directory conventions are defined. Code follows language-standard conventions. There is nothing to discuss, negotiate, or vary.

The codebase has a predictable pattern from the first Slice to the hundredth.
