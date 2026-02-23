# Contract-Driven Pipeline

**How ASA transforms human intent into deterministic, regenerable code.**

---

## Overview

ASA follows a strict pipeline where every step is deterministic:

```
slice.spec.md  →  slice.contract.json  →  Code skeleton  →  Implementation
   (human)            (machine)            (generated)       (preserved)
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

- **Generated** by `asa generate-contract`
- **Consumed** by `asa generate-skeleton` and `asa lint`
- **Never edited manually**

```json
{
  "version": "1.0",
  "domain": "auth",
  "slice": "login",
  "inputs": {
    "email": "string",
    "password": "string"
  },
  "outputs": {
    "jwt_token": "string",
    "expires_in": "int"
  },
  "behaviour": [
    "Verify user exists in database.",
    "Verify password matches stored hash.",
    "Generate JWT token with user ID claim.",
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

### `schemas.py` — Pydantic Models

```python
from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    jwt_token: str
    expires_in: int
```

### `handler.py` — FastAPI Endpoint

```python
from fastapi import APIRouter
from .service import LoginService
from .schemas import LoginRequest, LoginResponse

router = APIRouter()

# === BEGIN USER CODE ===
@router.post("")
def handle_login(request: LoginRequest) -> LoginResponse:
    service = LoginService()
    return service.execute(request)
# === END USER CODE ===
```

### `service.py` — Business Logic

```python
from .repository import LoginRepository
from .schemas import LoginRequest, LoginResponse

class LoginService:
    def __init__(self) -> None:
        self.repo = LoginRepository()

    # === BEGIN USER CODE ===
    def execute(self, request: LoginRequest) -> LoginResponse:
        # TODO: implement using repo
        raise NotImplementedError()
    # === END USER CODE ===
```

---

## Step 4: Implementation

You write business logic **inside the marker regions**:

```python
    # === BEGIN USER CODE ===
    def execute(self, request: LoginRequest) -> LoginResponse:
        user = self.repo.get_user_by_email(request.email)
        if not user:
            raise UserNotFoundError()
        if not verify_password(request.password, user.password_hash):
            raise InvalidCredentialsError()
        token = generate_jwt(user.id)
        return LoginResponse(jwt_token=token, expires_in=3600)
    # === END USER CODE ===
```

When the Spec changes, you regenerate. Your code inside markers is preserved. Structure outside markers is updated from the new Contract.

See [Regeneration Safety](regeneration-safety.md) for details.

---

## Type Mapping

Types flow consistently from Spec through Contract to code:

| Spec Type | Contract Type | Python (Pydantic) | TypeScript (Zod) |
|-----------|---------------|-------------------|------------------|
| `string` | `"string"` | `str` | `z.string()` |
| `int` | `"int"` | `int` | `z.number()` |
| `float` | `"float"` | `float` | `z.number()` |
| `boolean` | `"boolean"` | `bool` | `z.boolean()` |
| `datetime` | `"datetime"` | `datetime` | `z.string().datetime()` |
| `list<string>` | `"list<string>"` | `List[str]` | `z.array(z.string())` |
| `optional<string>` | `"optional<string>"` | `Optional[str]` | `z.string().optional()` |

---

## Full-Stack Contract Sharing (Frontend: Beta)

> **Note:** Frontend code generation from contracts is currently in beta. Backend contract generation and enforcement is stable.

The same Contract generates both backend and frontend code:

```
slice.contract.json
        │
        ├─→  schemas.py    (Pydantic — backend validation, stable)
        └─→  schema.ts     (Zod — frontend validation, beta)
```

Backend defines the contract. Frontend consumes it. Both are generated from the same source. The goal is to make type mismatches between frontend and backend structurally impossible.

---

## The Development Loop

```
1. Write or update slice.spec.md
2. asa generate-contract <domain>/<slice>
3. asa generate-skeleton <domain>/<slice>     (first time)
   asa regenerate-slice <domain>/<slice>      (subsequent times)
4. Implement business logic inside markers
5. asa lint <domain>/<slice>
6. Run tests
```

When requirements change, update the Spec first. Then regenerate. The pipeline ensures consistency between intent, contract, and implementation.

---

## Determinism Guarantees

- Same Spec → same Contract (always)
- Same Contract → same Skeleton (always)
- Regeneration preserves user code (marker regions)
- Linter validates boundaries and structure (every time)
- No uncontrolled drift between Spec and implementation
