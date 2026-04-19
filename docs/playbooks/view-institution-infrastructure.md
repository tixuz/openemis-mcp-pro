# View Institution Infrastructure (Land, Buildings, Utilities, WASH)

**Domain:** Institution  
**Audience:** admin, facilities  
**Playbook ID:** `view-institution-infrastructure`

## Description

View the physical infrastructure of an institution: land parcels, buildings per land, utilities (electricity), and WASH records (water and sanitation). **Land and buildings are NOT scoped by `academic_period_id`** — that field was removed in POCOR-8037. Utilities and WASH ARE scoped by `academic_period_id`.

---

## Resources Used

| Resource | Purpose |
|---|---|
| `institution-lands` | Land parcels registered to the institution (no academic period scope) |
| `institution-buildings` | Buildings nested under each land parcel (no academic period scope) |
| `infrastructure-statuses` | Global lookup: IN_USE, END_OF_USAGE, CHANGE_IN_TYPE status codes |
| `infrastructure-conditions` | Global lookup: condition labels (Good, Fair, Poor, etc.) |
| `land-types` | Global lookup: land type labels |
| `building-types` | Global lookup: building type labels |
| `infrastructure-utility-electricities` | Electricity utility records (scoped by institution + academic period) |
| `infrastructure-wash-waters` | Water supply and quality records (scoped by institution + academic period) |
| `infrastructure-wash-sanitations` | Sanitation facility counts by gender and functionality |

---

## Steps

| Step | Action | Resource | Purpose |
|---|---|---|---|
| 1 | `openemis_get` | `institution-lands` | List active land parcels |
| 2 | `openemis_get` | `institution-buildings` | List buildings per land parcel |
| 3 | `openemis_get` | `infrastructure-statuses` + lookups | Resolve condition, status, type IDs (parallel) |
| 4 | `openemis_get` | `infrastructure-utility-electricities` | Electricity utility records |
| 5 | `openemis_get` | `infrastructure-wash-waters` | WASH water records |
| 6 | `openemis_get` | `infrastructure-wash-sanitations` | WASH sanitation counts |

---

## Step Notes

**Step 1 — Active Land Parcels**  
Filter by `institution_id`. Do **NOT** pass `academic_period_id` — it was removed from this resource in POCOR-8037 and will silently do nothing or cause errors. To get only active parcels, also filter `land_status_id` matching the `IN_USE` code from `infrastructure-statuses`. Each record's `land_type_id` and `infrastructure_condition_id` are resolved in step 3.

**Step 2 — Buildings per Land**  
Filter by `institution_id` (all buildings) or `institution_land_id` (one land's buildings). Same rule: **no `academic_period_id`**. Filter by `building_status_id` for `IN_USE` records. Each building's `building_type_id` and `infrastructure_condition_id` are resolved in step 3. Building area must be less than parent land area (enforced by the API).

**Step 3 — Resolve Lookup Tables** *(can run in parallel)*  
Fetch `infrastructure-statuses`, `infrastructure-conditions`, `land-types`, and `building-types` simultaneously — all are global reference lists with no `institution_id` or `academic_period_id` filter.

> ⚠️ **Status FK naming is level-specific:** `land_status_id` for lands, `building_status_id` for buildings — both point to the same `infrastructure_statuses` table. Do not mix these FK names.

**Step 4 — Electricity Utility**  
Filter by `institution_id` AND `academic_period_id` (both required — unlike lands/buildings, utilities ARE scoped by period). Also filter `is_current=1` to exclude soft-deleted records (flag added in POCOR-9475). Resolve `utility_electricity_type_id` via `/api/v5/utility-electricity-types`.

**Step 5 — WASH Water**  
Filter by `institution_id` AND `academic_period_id`. All FK columns follow the pattern `infrastructure_wash_water_*_id` (type, functionality, proximity, quantity, quality, accessibility). Resolve each via the matching `/api/v5/infrastructure-wash-water-*` reference endpoint.

**Step 6 — WASH Sanitation**  
Filter by `institution_id` AND `academic_period_id`. Count fields: `infrastructure_wash_sanitation_{gender}_{status}` — e.g. `male_functional`, `female_nonfunctional`, `mixed_functional`. The `total_male`, `total_female`, `total_mixed` columns are **auto-calculated by the backend** in `beforeSave` — do NOT attempt to write to them. Steps 4–6 can be fetched in parallel once `institution_id` and `academic_period_id` are known.

---

## Key Gotchas

- **`institution-lands` and `institution-buildings` have NO `academic_period_id` filter** — removed in POCOR-8037. Never pass it for these two resources.
- **Status FK varies by level:** `land_status_id` for lands, `building_status_id` for buildings — same `infrastructure_statuses` table, different column names.
- **`infrastructure_ownership_id`** is the correct FK name on both lands and buildings (not `ownership_id`).
- **Utilities and WASH require `academic_period_id`** — unlike core infrastructure.
- **Sanitation totals are read-only** — they are calculated automatically by the backend.

---

## Example Query

> *"Show me the physical infrastructure of Avory Primary School — lands, buildings, electricity, and water."*

1. `openemis_get { resource: "institution-lands", params: { institution_id: 6 } }` → 2 land parcels (land_status_id → IN_USE)
2. `openemis_get { resource: "institution-buildings", params: { institution_id: 6 } }` → 4 buildings
3. Fetch `infrastructure-statuses`, `infrastructure-conditions`, `land-types`, `building-types` in parallel → resolve all IDs
4. `openemis_get { resource: "infrastructure-utility-electricities", params: { institution_id: 6, academic_period_id: 1, is_current: 1 } }` → grid electricity, good condition
5. `openemis_get { resource: "infrastructure-wash-waters", params: { institution_id: 6, academic_period_id: 1 } }` → piped water, functional
6. `openemis_get { resource: "infrastructure-wash-sanitations", params: { institution_id: 6, academic_period_id: 1 } }` → 4 male, 4 female toilets functional
