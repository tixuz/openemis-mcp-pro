---
title: Add a New Meal Programme to an OpenEMIS Institution
description: This OpenEMIS playbook explains how to create a new meal programme at a school management institution using the openemis-mcp-pro write tools.
keywords:
  - OpenEMIS
  - school management system
  - institution
  - education management
  - meal programme
---

# Add a New Meal Programme to an OpenEMIS Institution

**Domain:** Meals  
**Audience:** admin, accountant, nutritionist  
**Playbook ID:** `add-meal-programme`

## Description

Create a new meal programme definition and assign it to an institution. The flow is two-step: first create the global programme record (`meal-programmes`), then log the institution-level delivery assignment (`institution-meal-programmes`). No workflow plugin is involved — both writes are direct and immediate. Optionally link nutritional targets and enrol specific students.

> ⚠️ **FK alias trap:** `type` and `targeting` on `meal-programmes` are **string enum values**, not integer IDs. Send the string (e.g. `"Lunch"`, `"All Students"`) — not an ID from a lookup.  
> ⚠️ **Plural FK name:** The FK to `meal-programmes` in both `institution-meal-programmes` and `meal-nutritional-records` is **`meal_programmes_id`** (with trailing `s`) — not `meal_programme_id`. Using the singular form causes silent failure or 422.

---

## Questions to Ask First

| Question | Field | Resource | Notes |
|---|---|---|---|
| Programme name? | `name` | meal-programmes | e.g. "Government Lunch Programme 2025" |
| Short code? | `code` | meal-programmes | Unique, e.g. `GLP-2025` |
| Meal type? (Breakfast / Lunch / Snack / Dinner) | `type` | meal-programmes | String value — fetch from `meal-programme-types` to see valid options |
| Who receives it? (All Students / Vulnerable / Primary grades…) | `targeting` | meal-programmes | String value — fetch from `meal-target-types` |
| Start date? | `start_date` | meal-programmes | YYYY-MM-DD |
| End date? | `end_date` | meal-programmes | YYYY-MM-DD, must be ≥ start_date |
| Academic period? | `academic_period_id` | meal-programmes | Resolve via `academic-periods` |
| Delivery date at this school? | `date_received` | institution-meal-programmes | YYYY-MM-DD — when programme first reaches the school |
| Expected quantity / student count? | `quantity_received` | institution-meal-programmes | Integer |

---

## Resources Used

| Resource | Purpose |
|---|---|
| `academic-periods` | Lookup: active academic period ID |
| `meal-programme-types` | Lookup: valid string values for `type` field |
| `meal-target-types` | Lookup: valid string values for `targeting` field |
| `meal-implementers` | Lookup: implementer name → ID (for `institution-meal-programmes`) |
| `meal-programmes` | Write: create global programme definition |
| `institution-meal-programmes` | Write: assign / log delivery at institution |
| `meal-nutritional-records` | Write (optional): link nutritional targets to programme |

---

## Steps

| Step | Action | Resource | Purpose |
|---|---|---|---|
| 1 | `openemis_get` | `academic-periods` | Resolve active `academic_period_id` |
| 2 | `openemis_get` | `meal-programme-types` | List valid `type` string values |
| 3 | `openemis_get` | `meal-target-types` | List valid `targeting` string values |
| 4 | `openemis_create` | `meal-programmes` | Create the global programme record |
| 5 | `openemis_create` | `institution-meal-programmes` | Assign / log delivery at this institution |
| 6 | `openemis_create` (optional) | `meal-nutritional-records` | Link each nutritional target |

---

## Step Notes

**Steps 1–3 — Lookups**  
Fetch academic period filtered by `current = 1` or select by name. For `meal-programme-types` and `meal-target-types`, list all values — display the `name` strings to the user and use the selected string in the POST body (not the ID).

**Step 4 — Create Global Programme**

```json
POST /api/v5/meal-programmes
{
  "academic_period_id": 12,
  "name":               "Government Lunch Programme 2025",
  "code":               "GLP-2025",
  "type":               "Lunch",
  "targeting":          "All Students",
  "start_date":         "2025-01-06",
  "end_date":           "2025-11-28"
}
```

Response: captures `id` as `meal_programmes_id` for the next step.

**Step 5 — Assign to Institution**

```json
POST /api/v5/institution-meal-programmes
{
  "academic_period_id":  12,
  "meal_programmes_id":  1047,
  "institution_id":      6,
  "date_received":       "2025-01-06",
  "quantity_received":   420
}
```

> ⚠️ Unique constraint on `(institution_id, date_received, meal_programmes_id)` — duplicate delivers for the same school + date + programme return 409 Conflict.

**Step 6 — Link Nutritional Targets (Optional)**

```json
POST /api/v5/meal-nutritional-records
{
  "meal_programmes_id":     1047,
  "nutritional_content_id": 10
}
```

Repeat for each nutritional component. Resolve `nutritional_content_id` via `GET /api/v5/meal-nutritions`.

---

## Key Gotchas

- **`type` and `targeting` are string values**, not integer IDs — use the name string from `meal-programme-types` / `meal-target-types`, not the lookup table's `id`.
- **`meal_programmes_id` with trailing `s`** — the FK field name in `institution-meal-programmes` and `meal-nutritional-records`. Using `meal_programme_id` (without `s`) silently fails or returns 422.
- **`nutritional_content_id`** (not `meal_nutrition_id` or `nutrition_id`) — confirmed FK trap from read playbook, verified in write surface.
- **`meal-implementers` has FieldOption fields** (`visible`, `order`, `default`) — include them on PUT to avoid null reset.
- **No workflow plugin** — meal writes are direct and do not require approval or workflow steps.
- **409 on duplicate delivery** — the unique constraint is `(institution_id, date_received, meal_programmes_id)`, not period-based.

*When to use: ask "create a new meal programme at this school" or "add a feeding scheme for an academic period" when an admin, accountant, or nutritionist needs to set up a new meal programme in the OpenEMIS school management system.*

---

## Example Query

> *"Add a government lunch programme for all students at Avory Primary, starting January 2025, code GLP-2025."*

1. `openemis_get { resource: "academic-periods", params: { current: 1 } }` → id: 12
2. `openemis_get { resource: "meal-programme-types" }` → "Breakfast", "Lunch", "Snack"
3. `openemis_get { resource: "meal-target-types" }` → "All Students", "Vulnerable", "Primary"
4. `openemis_create { resource: "meal-programmes", body: { academic_period_id: 12, name: "Government Lunch Programme 2025", code: "GLP-2025", type: "Lunch", targeting: "All Students", start_date: "2025-01-06", end_date: "2025-11-28" } }` → id: 1047
5. `openemis_create { resource: "institution-meal-programmes", body: { academic_period_id: 12, meal_programmes_id: 1047, institution_id: 6, date_received: "2025-01-06", quantity_received: 420 } }`
