# Cap, Bridge & Grow

**A migration methodology for existing codebases. A modern adaptation of the Strangler Fig Pattern for the AI era.**

---

## Overview

Cap, Bridge & Grow is the ASA methodology for integrating structured architecture into existing, production codebases without requiring a full rewrite.

The pattern is designed for teams that:

- Have a running application with accumulated technical debt
- Cannot afford downtime or a rewrite project
- Need to stop architecture drift immediately
- Want to add new features without touching legacy code

---

## The Three Phases

### Phase 1: Cap (Quarantine)

**Goal:** Stop the spread of architectural decay immediately.

1. Move all existing application code into a `/legacy` directory
2. Mark legacy code as read-only via governance rules (`.cursorrules`)
3. Application continues to run unchanged

```
your-project/
├── legacy/              # Frozen legacy code (READ ONLY)
│   ├── src/
│   ├── app/
│   └── ...
├── domains/             # New ASA Slices (created in Phase 3)
├── shared/
│   └── legacy_bridge/   # Adapters (created in Phase 2)
└── .cursorrules         # AI governance: legacy is off-limits
```

**Rules for `/legacy`:**
- Do not modify
- Do not refactor
- Do not add features
- Read only

The Cap is immediate. It requires no code changes to legacy. The application runs exactly as before, just from a different directory path.

---

### Phase 2: Bridge (Adaptation Layer)

**Goal:** Establish safe communication between legacy code and new ASA Slices.

The Bridge is a thin translation layer in `/shared/legacy_bridge`. It provides read-only access to legacy data without exposing legacy internals to ASA Slices.

```python
# shared/legacy_bridge/billing.py

from legacy.src.billing.models import Invoice as LegacyInvoice

class BillingAdapter:
    def get_invoice_by_id(self, invoice_id: int) -> dict:
        legacy_invoice = LegacyInvoice.objects.get(id=invoice_id)
        return {
            "id": legacy_invoice.id,
            "amount": legacy_invoice.total_amount,
            "status": legacy_invoice.status_code,
            "created_at": legacy_invoice.created_at.isoformat(),
        }
```

**Bridge rules:**
- Thin (typically under 50 lines per adapter)
- Stateless
- Pure data transformation
- No business logic, no conditionals based on business rules

> If logic appears in the bridge, the migration has failed.

**The boundary rule:**

ASA Slices never import from `/legacy`. They only import from `/shared/legacy_bridge`.

```python
# Forbidden
from legacy.src.billing import calculate_total

# Correct
from shared.legacy_bridge.billing import BillingAdapter
```

---

### Phase 3: Grow (Value-First Development)

**Goal:** Build all new features as ASA Slices. Legacy code gradually becomes unused.

```bash
asa create-slice billing/calculate_overage
# Edit the spec
asa generate-contract billing/calculate_overage
asa generate-skeleton billing/calculate_overage
# Implement business logic
asa lint billing/calculate_overage
```

New Slices access legacy data through bridge adapters:

```python
# domains/billing/calculate_overage/service.py

from shared.legacy_bridge.billing import BillingAdapter

class CalculateOverageService:
    def __init__(self) -> None:
        self.legacy_billing = BillingAdapter()

    # === BEGIN USER CODE ===
    def execute(self, request):
        invoice_data = self.legacy_billing.get_invoice_by_id(request.invoice_id)
        overage = max(0, invoice_data["amount"] - request.limit)
        return CalculateOverageResponse(overage_amount=overage)
    # === END USER CODE ===
```

Over time, as new features replace legacy functionality, the legacy code becomes dead code and can be removed.

```
Request for change  ->  New ASA Slice  ->  Legacy becomes unused  ->  Remove legacy
```

This is migration as a side effect of development, not a separate project.

---

## Key Principles

### One Backend Runtime

There is one shared backend, not two separate ones. ASA defines how code is organized inside that runtime, not a separate deployment.

```
backend/
├── legacy/                # Frozen world
├── shared/legacy_bridge/  # Adaptation layer
├── domains/               # ASA world (new code only)
└── main.py                # Single app startup
```

### One Database

ASA Slices share the same database as legacy code. No data duplication. Bridge adapters translate data formats, not data locations.

### One Auth System

Authentication is shared. ASA does not introduce a parallel auth system.

---

## Architecture After Migration

```
your-project/
├── legacy/                    # Gradually shrinking
│   └── ...
├── domains/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── billing/
│   │   ├── create_invoice/
│   │   └── calculate_overage/
│   └── ...
├── shared/
│   ├── legacy_bridge/
│   │   ├── billing.py
│   │   └── user.py
│   ├── database.py
│   └── config.py
├── .cursorrules
└── main.py
```

---

## Timeline

| Phase | When | Effort | Risk |
|-------|------|--------|------|
| **Cap** | Day 1 | Minimal (move files, add `.cursorrules`) | Zero (no code changes) |
| **Bridge** | Week 1 | Low (thin adapters per legacy module) | Low (read-only access) |
| **Grow** | Ongoing | Normal development effort | Zero (new code only) |

There is no "migration project." There is no sprint dedicated to rewriting. New value is created in ASA Slices. Legacy code decays naturally.

---

## Risk Comparison

| Approach | Risk | Duration | Disruption |
|----------|------|----------|------------|
| Full rewrite | High (second system effect) | Months to years | Significant |
| Selective refactor | Medium (blast radius unpredictable) | Weeks per module | Moderate |
| Cap, Bridge & Grow | Low (new code only, legacy untouched) | Incremental | Zero |

---

## AI Governance During Migration

```text
# .cursorrules

/legacy/**
- DO NOT MODIFY
- DO NOT REFACTOR
- DO NOT ADD FEATURES
- READ ONLY

/domains/**
- All new features as ASA Slices
- Business logic ONLY in service.py
- No cross-domain imports

/shared/legacy_bridge/**
- Data transformation ONLY
- No business logic
- No decision making
```

AI tools that read `.cursorrules` will respect these boundaries. The linter (`asa lint`) enforces them programmatically.
