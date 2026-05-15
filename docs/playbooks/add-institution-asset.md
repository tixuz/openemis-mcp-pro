---
title: Add Equipment or Assets to an OpenEMIS Institution
description: This OpenEMIS playbook explains how to register new equipment or assets at a school management institution using the openemis-mcp-pro write tools.
keywords:
  - OpenEMIS
  - school management system
  - institution
  - education management
  - assets
---

# Add Equipment or Assets to an OpenEMIS Institution

**Domain:** Infrastructure  
**Audience:** admin, accountant, facilities  
**Playbook ID:** `add-institution-asset`

## Description

Record newly acquired equipment or assets at an institution — computers, desks, projectors, furniture, or any physical inventory item. One row = one physical item; to add multiple identical units, post one record per item with distinct `code` and `serial_number`. `purchase_order` and `cost` must be included in every write (present in all documented examples — treat as required even if not formally nullable).

---

## Questions to Ask First

Before writing anything, the agent must collect:

| Question | Field | Notes |
|---|---|---|
| What type of asset? (e.g. laptop, chair, projector) | `description` | Free text — be descriptive |
| How many units? | (loop count) | One POST per unit |
| What is the asset code / inventory tag? | `code` | Must be unique system-wide, e.g. `AST-2025-001` |
| Serial number(s)? | `serial_number` | One per unit; must be unique |
| Make / manufacturer? | `asset_make_id` | Lookup via `asset-makes`; skip if unknown |
| Model? | `asset_model_id` | Lookup via `asset-models`; skip if unknown |
| Purchase order number? | `purchase_order` | PO reference, e.g. `PO/2025/045` |
| Unit cost? | `cost` | Numeric, e.g. `1250.00` |

---

## Resources Used

| Resource | Purpose |
|---|---|
| `asset-makes` | Lookup: manufacturer list (Dell, HP, etc.) |
| `asset-models` | Lookup: model list (optional) |
| `institution-assets` | Write: create one record per physical unit |

---

## Steps

| Step | Action | Resource | Purpose |
|---|---|---|---|
| 1 | `openemis_get` | `asset-makes` | Resolve make name → `asset_make_id` (skip if make unknown) |
| 2 | `openemis_get` | `asset-models` | Resolve model name → `asset_model_id` (skip if model unknown) |
| 3 | `openemis_create` × N | `institution-assets` | Post one record per physical unit |

---

## Step Notes

**Step 1–2 — Lookups (Optional)**  
Only run if the user provides a make or model. Filter by name: `GET /api/v5/asset-makes?name=Dell`. If no match, proceed without the FK — both fields are optional. An invalid `asset_make_id` will be rejected with 422, so only send it when you have a valid ID.

**Step 3 — Create Asset Records**

POST body per unit:
```json
{
  "code":           "AST-2025-001",
  "description":    "Dell OptiPlex 3090 Desktop Computer",
  "serial_number":  "SN-DELL-9988776655",
  "purchase_order": "PO/2025/045",
  "cost":           1250.00,
  "asset_make_id":  12,
  "asset_model_id": 45
}
```

For N units, repeat with unique `code` (e.g. `AST-2025-001`, `AST-2025-002`) and unique `serial_number`.

> ⚠️ **PUT requires full payload.** If updating an existing asset, fetch the current record first, merge changes, then PUT the complete object. Omitting any field sets it to null.

---

## Key Gotchas

- **One row = one physical item.** There is no `quantity` field. "We bought 5 computers" = 5 POST calls.
- **`code` must be unique system-wide.** A collision returns 409. Suggest a scheme like `{INSTITUTION_CODE}-{YEAR}-{SEQ}` if the user has no existing convention.
- **`purchase_order` and `cost` are present in every documented example** — include them in every write.
- **`asset_make_id` and `asset_model_id` are optional** but must be valid IDs if sent — an invalid value causes a 422, not a silent skip.
- **No `academic_period_id`** on this resource — do not send it.

---

## Example Query

> *"We bought 2 Dell laptops for the library — serial numbers SN-001 and SN-002, cost 1,100 each, PO/2025/071."*

1. `openemis_get { resource: "asset-makes", params: { name: "Dell" } }` → id: 12
2. `openemis_create { resource: "institution-assets", body: { code: "LIB-2025-001", description: "Dell Laptop", serial_number: "SN-001", purchase_order: "PO/2025/071", cost: 1100.00, asset_make_id: 12 } }`
3. `openemis_create { resource: "institution-assets", body: { code: "LIB-2025-002", description: "Dell Laptop", serial_number: "SN-002", purchase_order: "PO/2025/071", cost: 1100.00, asset_make_id: 12 } }`

*When to use: ask "register new equipment at this school" or "add assets to the institution inventory" when an admin, accountant, or facilities manager needs to record equipment purchases in the OpenEMIS school management system.*
