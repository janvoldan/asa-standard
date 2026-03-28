# Regeneration Safety

**How ASA preserves your implementation when structure changes.**

---

## The Problem

Code generators face a fundamental dilemma:

- **Regenerate everything** — Custom implementation is lost
- **Never regenerate** — Code drifts from specification

This compounds over time. Teams stop regenerating because they fear losing work. The gap between spec and implementation grows. Eventually, the spec becomes fiction.

---

## The ASA Solution: Marker-Based Preservation

ASA uses explicit markers to define protected regions in generated code:

```typescript
// --- ASA GENERATED START ---
// Auto-generated. Do NOT edit this section.
import { NextRequest, NextResponse } from 'next/server';
import { LoginRequestSchema, type LoginRequest } from './schemas';
// --- ASA GENERATED END ---

// --- USER CODE START ---
// Your custom logic below. Preserved during regeneration.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const input = LoginRequestSchema.parse(body);
  const user = await getUserByEmail(input.email);
  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  return NextResponse.json({ token: generateJwt(user.id) });
}
// --- USER CODE END ---
```

---

## Regeneration Behaviour

| Region | On Regeneration |
|--------|-----------------|
| Outside markers | **Regenerated** from template and contract |
| Inside markers | **Preserved** exactly as written |

When you regenerate a Slice:

1. The generator reads the current Contract
2. It regenerates all structural code (imports, class definitions, type hints)
3. It detects marker regions and copies your code verbatim
4. The result has updated structure with preserved implementation

---

## When to Regenerate

| Scenario | Action |
|----------|--------|
| Spec changed (new inputs/outputs) | Regenerate from spec (regenerates contract + skeleton) |
| Schema needs updating | Regenerate from spec (schemas regenerated, handler code preserved) |
| Template improved | Regenerate from spec (structural updates applied) |
| Bug in your logic | Edit directly inside markers, no regeneration needed |

---

## What Changes During Regeneration

### Updated (outside markers)

- Import statements
- Type definitions and schema interfaces
- Zod validation schemas (`schemas.ts` — fully regenerated)
- Hook type signatures
- Runtime adapters (`app/api/.../route.ts`)

### Preserved (inside markers)

- Your handler implementation (route logic, business rules)
- Your custom helper functions within marker regions
- Your React component JSX and styling
- Any code between `// --- USER CODE START ---` and `// --- USER CODE END ---`

---

## Example: Adding a Field

Before (spec has `email` and `password`):

```typescript
export const LoginRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});
```

After adding `remember_me: boolean` to the spec and regenerating:

```typescript
export const LoginRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
  rememberMe: z.boolean().optional(),  // Added by regeneration
});
```

Your `handler.ts` implementation inside markers remains untouched. You then update your logic to use the new field.

---

## Safety Guarantees

- Marker regions are never modified by regeneration
- If markers are missing or malformed, the linter reports an error before regeneration
- Regeneration is deterministic: same contract produces same structural output
- No silent data loss: the process is explicit and auditable via `git diff`

---

## Marker Format

ASA uses two marker pairs:

```typescript
// --- ASA GENERATED START ---
// Auto-generated code. Do NOT edit. Overwritten during regeneration.
// --- ASA GENERATED END ---

// --- USER CODE START ---
// Your custom logic. This section is preserved during regeneration.
// --- USER CODE END ---
```

Rules:
- Markers must appear as exact strings
- Generated regions are fully overwritten during regeneration
- User code regions are preserved verbatim
- Nesting is not allowed
- If markers are missing or damaged, regeneration creates a backup and skips the file
- Markers are present in `handler.ts`, `service.ts`, `repository.ts`, `ui/hook.ts`, and `ui/<Component>.tsx`
- `schemas.ts` is always fully regenerated (no markers needed)

---

## Relationship to the Pipeline

Regeneration is one step in the deterministic pipeline:

```
1. Update slice.spec.md                         (human edits intent)
2. Regenerate contract + skeleton from spec      (user code preserved)
3. Update implementation                         (adapt to new inputs/outputs)
4. Run boundary linter                           (verify boundaries and structure)
```

The pipeline ensures that Spec, Contract, and Code remain in sync. Regeneration is safe because it is predictable and bounded.
