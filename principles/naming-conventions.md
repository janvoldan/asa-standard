# Naming Conventions

**Deterministic naming rules for ASA projects.**

---

## Architecture Name

The architecture described in this repository is officially called:

**ASA (Atomic Slice Architecture)**

### Canonical Name

**Atomic Slice Architecture** is the canonical and current name. The abbreviation **ASA** is used as a short-form reference.

### Historical Names

Earlier working names used during development:

- Agentic-Sliced Architecture
- AI-Sliced Architecture

These refer to earlier iterations of the same core concept and are kept for historical context only. All new documentation uses **ASA (Atomic Slice Architecture)**.

---

## File Naming

### Slice Files (Backend)

All files use `snake_case`:

| File | Convention | Example |
|------|-----------|---------|
| Spec | `slice.spec.md` | Always this exact name |
| Contract | `slice.contract.json` | Always this exact name |
| Handler | `handler.py` | Always this exact name |
| Service | `service.py` | Always this exact name |
| Repository | `repository.py` | Always this exact name |
| Schemas | `schemas.py` | Always this exact name |
| Tests | `test_slice.py` | Always this exact name |

File names within a Slice are fixed. There is no decision to make. This eliminates structural entropy.

### Slice Files (Frontend) — Beta

> Frontend naming conventions are implemented but not yet validated on production projects.

| File | Convention | Example |
|------|-----------|---------|
| UI Spec | `slice.ui.spec.md` | Always this exact name |
| Schema | `schema.ts` | Always this exact name |
| Hook | `hook.ts` | Always this exact name |
| API client | `api.ts` | Always this exact name |
| Component | `<SliceName>.tsx` | `Login.tsx`, `InvoiceList.tsx` |
| Test | `<SliceName>.test.tsx` | `Login.test.tsx` |

Component and test files use `PascalCase` matching the Slice name.

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

### Backend Slices

Slice directories use `snake_case`:

```
domains/auth/
├── login/
├── register/
├── reset_password/
└── logout/
```

### Frontend UI Slices (Beta)

UI slice directories use `PascalCase`:

```
domains/auth/ui/
├── Login/
├── Register/
├── ResetPassword/
└── Logout/
```

---

## Code Naming

### Python (Backend)

| Element | Convention | Example |
|---------|-----------|---------|
| Classes | `PascalCase` | `LoginService`, `LoginRequest` |
| Functions | `snake_case` | `execute`, `get_user_by_email` |
| Variables | `snake_case` | `jwt_token`, `expires_in` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_LOGIN_ATTEMPTS` |
| Error codes | `UPPER_SNAKE_CASE` | `INVALID_CREDENTIALS` |
| Spec fields | `snake_case` | `- email: string` |

### TypeScript (Frontend — Beta)

| Element | Convention | Example |
|---------|-----------|---------|
| Components | `PascalCase` | `Login`, `InvoiceList` |
| Hooks | `camelCase` with `use` prefix | `useLogin`, `useInvoiceList` |
| Schemas | `PascalCase` with `Schema` suffix | `LoginRequestSchema` |
| Variables | `camelCase` | `jwtToken`, `expiresIn` |
| Files | See file naming above | `Login.tsx`, `hook.ts` |

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

Field names must be valid Python identifiers. No hyphens, no spaces, no special characters.

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
