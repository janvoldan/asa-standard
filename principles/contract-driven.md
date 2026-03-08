# Contract-Driven Pipeline

**How ASA transforms human intent into deterministic, regenerable code.**

---

## Overview

ASA follows a strict pipeline where every step is deterministic:

```
slice.spec.md  →  slice.contract.json  →  TypeScript skeleton  →  Implementation
   (human)            (machine)              (generated)            (preserved)
```

The Spec is the source of truth. The Contract is the derived artifact. The Skeleton is generated from the Contract. Your implementation lives inside marker regions and survives regeneration.

---

## Step 1: The Spec (`slice.spec.md`)

The Spec is a human-readable Markdown document that declares what a Slice does.

Every Spec contains 7 required sections in this exact order:

```markdown
# Purpose
User logs in with email and password. Returns JWT token.

## Inputs
- email: string
- password: string

## Outputs
- jwt_token: string
- expires_in: int

## Behaviour
- Verify user exists in database.
- Verify password matches stored hash.
- Generate JWT token with user ID claim.
- Return token with expiration time.

## Errors
- INVALID_CREDENTIALS: Invalid email or password.
- USER_NOT_FOUND: No user with this email exists.

## Side Effects
None

## Dependencies
None
```

### Spec Rules

- **Purpose** must be one sentence describing the Slice's intent
- **Inputs/Outputs** use declared types: `string`, `int`, `float`, `boolean`, `datetime`, `date`, `list<T>`, `dict`, `optional<T>`
- **Behaviour** steps are imperative and ordered — they describe the flow
- **Errors** use `UPPER_SNAKE_CASE` codes with user-facing messages
- **Side Effects** declare external writes (DB, email, queues) or `None`
- **Dependencies** list shared modules or `None`

The parser depends on this structure. Missing or misordered sections cause explicit validation errors.

---

## Step 2: The Contract (`slice.contract.json`)

The Contract is the machine-readable representation of the Spec. It is:

- **Generated** by `asa slice new` or `asa slice update`
- **Consumed** by the skeleton generator and `asa lint`
- **Never edited manually**

```json
{
  "version": "2.0",
  "domain": "auth",
  "slice": "login",
  "type": "route",
  "has_ui": true,
  "has_repository": true,
  "inputs": [
    { "name": "email", "type": "string", "required": true },
    { "name": "password", "type": "string", "required": true }
  ],
  "outputs": [
    { "name": "token", "type": "string", "required": true },
    { "name": "expiresIn", "type": "int", "required": true }
  ],
  "behaviour": [
    "Verify user exists in database.",
    "Verify password matches stored hash.",
    "Generate session token.",
    "Return token with expiration time."
  ],
  "errors": [
    { "code": "INVALID_CREDENTIALS", "message": "Invalid email or password." },
    { "code": "USER_NOT_FOUND", "message": "No user with this email exists." }
  ],
  "side_effects": [],
  "dependencies": []
}
```

The same Spec always produces the same Contract. This is the determinism guarantee.

---

## Step 3: The Skeleton

Generated code files follow a fixed structure with marker regions:

### `schemas.ts` — Zod Validation (fully generated)

```typescript
import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  expiresIn: z.number().int(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
```

### `handler.ts` — Next.js Route Handler (with markers)

```typescript
// --- ASA GENERATED START ---
import { NextRequest, NextResponse } from 'next/server';
import { LoginRequestSchema, type LoginRequest, type LoginResponse } from './schemas';
// --- ASA GENERATED END ---

// --- USER CODE START ---
export async function POST(request: NextRequest) {
  const body = await request.json();
  const input = LoginRequestSchema.parse(body);
  // TODO: implement auth/login logic
  return NextResponse.json({ token: '', expiresIn: 3600 });
}
// --- USER CODE END ---
```

---

## Step 4: Implementation

You write business logic **inside the USER CODE marker regions**:

```typescript
// --- USER CODE START ---
export async function POST(request: NextRequest) {
  const body = await request.json();
  const input = LoginRequestSchema.parse(body);
  const user = await getUserByEmail(input.email);
  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = await generateSession(user.id);
  return NextResponse.json({ token, expiresIn: 3600 });
}
// --- USER CODE END ---
```

When the Spec changes, you run `asa slice update`. Your code inside markers is preserved. Structure outside markers (imports, schemas) is updated from the new Contract.

See [Regeneration Safety](regeneration-safety.md) for details.

---

## Type Mapping

Types flow consistently from Spec through Contract to code:

| Spec Type | Contract Type | TypeScript (Zod) |
|-----------|---------------|------------------|
| `string` | `"string"` | `z.string()` |
| `int` | `"int"` | `z.number().int()` |
| `float` | `"float"` | `z.number()` |
| `boolean` | `"boolean"` | `z.boolean()` |
| `datetime` | `"datetime"` | `z.string().datetime()` |
| `date` | `"date"` | `z.string().date()` |
| `list<string>` | `"list<string>"` | `z.array(z.string())` |
| `optional<string>` | `"optional<string>"` | `z.string().optional()` |

---

## Full-Stack Contract Sharing

The same Contract generates both handler and UI code:

```
slice.contract.json
        │
        ├─→  schemas.ts      (Zod validation — used by handler and UI)
        ├─→  handler.ts      (route handler imports schemas)
        ├─→  repository.ts   (data access imports schemas)
        └─→  ui/hook.ts      (React hook imports schemas)
```

The contract is the single source of truth. Type mismatches between handler and UI are structurally impossible.

---

## The Development Loop

```
1. Write or update slice.spec.md
2. asa slice new <domain>/<slice>               (first time — creates contract + skeleton + UI)
   asa slice update <domain>/<slice>            (subsequent — regenerates, preserves user code)
3. Implement business logic inside USER CODE markers
4. asa lint <domain>/<slice>
5. Run tests
```

When requirements change, update the Spec first. Then regenerate. The pipeline ensures consistency between intent, contract, and implementation.

---

## Determinism Guarantees

- Same Spec → same Contract (always)
- Same Contract → same Skeleton (always)
- Regeneration preserves user code (marker regions)
- Linter validates boundaries and structure (every time)
- No uncontrolled drift between Spec and implementation
