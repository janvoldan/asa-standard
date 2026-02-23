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
$ asa lint auth/login

❌ [LINT FAIL] Boundary violation in repository.py:
   Line 3: Illegal import 'domains.billing.create_invoice'
   -> Cannot import from other domains.
```

The linter checks every `.py` file in the Slice and verifies that:

- No imports reference other domains
- Only `shared/` modules are used for cross-cutting concerns
- No reverse dependencies exist (legacy importing from ASA domains)

---

## What the Linter Validates

| Check | Description |
|-------|-------------|
| **Cross-domain imports** | Detects imports from `domains.X` in a Slice belonging to domain `Y` |
| **Required files** | Verifies all standard Slice files exist |
| **Contract validity** | Checks `slice.contract.json` is valid and matches the spec |
| **Marker integrity** | Verifies `BEGIN USER CODE` / `END USER CODE` markers are present |

---

## Allowed Dependencies

### Within a Slice

A Slice's files may import from each other freely:

```python
# domains/auth/login/handler.py
from .service import LoginService        # ✅ Same slice
from .schemas import LoginRequest        # ✅ Same slice
```

### Within a Domain

Slices in the same domain may reference each other:

```python
# domains/auth/login/service.py
from domains.auth.register.schemas import UserDTO  # ✅ Same domain
```

### From Shared

Any Slice may import from `/shared`:

```python
# domains/billing/create_invoice/service.py
from shared.database import get_session           # ✅ Shared infrastructure
from shared.adapters.email import send_email      # ✅ Shared adapter
```

### Forbidden

```python
# domains/auth/login/repository.py
from domains.billing.create_invoice import InvoiceService  # ❌ Cross-domain
from legacy.src.billing import calculate_total             # ❌ Direct legacy import
```

---

## The Bridge Exception

In migration scenarios (Cap, Bridge & Grow), ASA Slices access legacy data through bridge adapters in `/shared/legacy_bridge`:

```python
# ✅ Correct — via bridge adapter
from shared.legacy_bridge.billing import BillingAdapter

# ❌ Forbidden — direct legacy import
from legacy.src.billing import calculate_total
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
- Run `asa lint` after every change
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
