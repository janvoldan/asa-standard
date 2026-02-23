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

## Backend Slice Structure

Every backend Slice follows a deterministic file structure:

```
domains/<domain>/<slice>/
├── slice.spec.md         # Human-readable specification
├── slice.contract.json   # Machine-readable contract (generated)
├── handler.py            # HTTP endpoint (FastAPI router)
├── service.py            # Business logic
├── repository.py         # Data access
├── schemas.py            # Request/response models (Pydantic)
└── tests/
    └── test_slice.py     # Slice tests
```

### File Responsibilities

| File | Purpose | Contains |
|------|---------|----------|
| `slice.spec.md` | Intent document | Purpose, inputs, outputs, behaviour, errors, side effects, dependencies |
| `slice.contract.json` | Machine interface | Structured representation of the spec (never edited manually) |
| `handler.py` | HTTP layer | FastAPI router, request/response handling |
| `service.py` | Business logic | Core implementation between marker regions |
| `repository.py` | Data access | Database queries, external data retrieval |
| `schemas.py` | Data models | Pydantic models for validation |
| `tests/` | Verification | Unit tests for the Slice |

### Example

```
domains/
├── auth/
│   ├── login/           # "User logs in with email and password"
│   ├── register/        # "User creates a new account"
│   └── logout/          # "User session is terminated"
└── billing/
    ├── create_invoice/  # "Create invoice from order data"
    └── calculate_total/ # "Calculate order total with discounts"
```

Each Slice is self-contained. `auth/login` does not import from `billing/create_invoice`.

---

## Frontend Slice Structure (Beta)

> **Note:** Frontend support is currently in beta. The structure and conventions described below are implemented but have not yet been validated on production projects. Backend enforcement is the stable, validated core of ASA.

Frontend Slices share the same contract as their backend counterpart, ensuring type safety across the stack:

```
domains/<domain>/ui/<SliceName>/
├── slice.ui.spec.md     # UI behaviour specification
├── schema.ts            # Zod validation schemas (from contract)
├── hook.ts              # Data fetching hook (SWR)
├── api.ts               # API client
├── <SliceName>.tsx      # React component
└── <SliceName>.test.tsx # Component tests
```

### Contract Alignment

Backend and frontend share the same `slice.contract.json`:

| Backend (Pydantic) | Frontend (Zod) | Source |
|--------------------|----------------|--------|
| `LoginRequest` | `LoginRequestSchema` | Same contract |
| `LoginResponse` | `LoginResponseSchema` | Same contract |

The frontend hook validates API responses against the Zod schema at runtime:

```typescript
const validated = LoginResponseSchema.safeParse(data);
if (!validated.success) {
  console.error('Contract violation: backend sent invalid data', {
    issues: validated.error.issues,
    received: data,
  });
}
```

Contract violations are explicit, not silent. The system reports exactly what is wrong.

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
├── database.py        # DB session management
├── config.py          # Configuration loading
└── adapters/
    ├── email.py       # Email service adapter
    └── payment.py     # Payment gateway adapter
```

### What Belongs in `/shared`

| Allowed | Example |
|---------|---------|
| Database session | `shared/database.py` |
| External service adapters | `shared/adapters/email.py` |
| Configuration | `shared/config.py` |
| Logging setup | `shared/logging.py` |

### What Does NOT Belong in `/shared`

| Forbidden | Reason |
|-----------|--------|
| Business logic | Belongs in Slice services |
| Validators with business rules | Duplicated per Slice |
| Domain-specific calculations | Slice-specific |

---

## The Duplication Principle

> Prefer duplication inside Slices over sharing business logic.

If two Slices need similar validation logic, duplicate it. Do not extract it to `/shared`.

```python
# Each slice has its own copy
# domains/auth/register/service.py
def _validate_password(password: str) -> bool:
    return len(password) >= 8 and any(c.isupper() for c in password)

# domains/auth/reset_password/service.py
def _validate_password(password: str) -> bool:
    return len(password) >= 8 and any(c.isupper() for c in password)
```

Why: shared helpers create coupling. Coupling creates drift. Drift breaks deterministic regeneration.

In ASA, coupling is expensive. Duplication is free.

---

## Orchestration

Slice services do not orchestrate other Slices. Multi-slice workflows live outside Slices:

```python
# flows/register_user_flow.py
async def register_user_flow(data):
    user = await user_register_service.execute(data)
    await email_send_welcome_service.execute({"email": user.email})
    await analytics_track_service.execute({"event": "user_registered", "user_id": user.id})
    return user
```

This keeps each Slice independent and testable in isolation.
