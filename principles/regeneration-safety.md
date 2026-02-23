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

```python
class LoginService:
    def __init__(self) -> None:
        self.repo = LoginRepository()

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

---

## Regeneration Behaviour

| Region | On Regeneration |
|--------|-----------------|
| Outside markers | **Regenerated** from template and contract |
| Inside markers | **Preserved** exactly as written |

When you run `asa regenerate-slice auth/login`:

1. The generator reads the current Contract
2. It regenerates all structural code (imports, class definitions, type hints)
3. It detects marker regions and copies your code verbatim
4. The result has updated structure with preserved implementation

---

## When to Regenerate

| Scenario | Action |
|----------|--------|
| Spec changed (new inputs/outputs) | `asa generate-contract` then `asa regenerate-slice` |
| Schema needs updating | `asa regenerate-slice` (schemas regenerated, service code preserved) |
| Template improved | `asa regenerate-slice` (structural updates applied) |
| Bug in your logic | Edit directly inside markers, no regeneration needed |

---

## What Changes During Regeneration

### Updated (outside markers)

- Import statements
- Class definitions and `__init__` methods
- Pydantic model definitions (`schemas.py`)
- Router setup (`handler.py`)
- Test scaffolding

### Preserved (inside markers)

- Your `execute()` method implementation
- Your custom helper methods within marker regions
- Your endpoint customizations
- Any code between `BEGIN USER CODE` and `END USER CODE`

---

## Example: Adding a Field

Before (spec has `email` and `password`):

```python
class LoginRequest(BaseModel):
    email: str
    password: str
```

After adding `remember_me: boolean` to the spec and regenerating:

```python
class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: bool    # Added by regeneration
```

Your `service.py` implementation inside markers remains untouched. You then update your logic to use the new field.

---

## Safety Guarantees

- Marker regions are never modified by regeneration
- If markers are missing or malformed, the linter reports an error before regeneration
- Regeneration is deterministic: same contract produces same structural output
- No silent data loss: the process is explicit and auditable via `git diff`

---

## Marker Format

The marker syntax is fixed:

```
# === BEGIN USER CODE ===
(your implementation here)
# === END USER CODE ===
```

Rules:
- Markers must appear as exact strings
- One marker pair per protected region
- Nesting is not allowed
- Markers are present in `handler.py`, `service.py`, and `repository.py`

---

## Relationship to the Pipeline

Regeneration is one step in the deterministic pipeline:

```
1. Update slice.spec.md           (human edits intent)
2. asa generate-contract           (new contract from spec)
3. asa regenerate-slice            (structure updated, code preserved)
4. Update implementation           (adapt to new inputs/outputs)
5. asa lint                        (verify boundaries and structure)
```

The pipeline ensures that Spec, Contract, and Code remain in sync. Regeneration is safe because it is predictable and bounded.
