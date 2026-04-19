# View Institution Meal Programmes and Student Participation

**Domain:** Institution  
**Audience:** admin, nutritionist, parent  
**Playbook ID:** `view-institution-meals`

## Description

View the meal programmes an institution runs, their nutritional content, and which students are enrolled. Scoped by `institution_id` and `academic_period_id`. Key gotcha: in `meal-nutritional-records` the FK to the `meal_nutritions` table is `nutritional_content_id` — **not** `meal_nutrition_id`.

---

## Resources Used

| Resource | Purpose |
|---|---|
| `institution-meal-programmes` | Meal programmes the institution runs in the current academic period |
| `meal-programme-types` | Global lookup: programme type labels |
| `meal-implementers` | Global lookup: implementing organisations |
| `meal-nutritional-records` | Join table linking programmes to nutritional content |
| `meal-benefits` | Global lookup: benefit type labels |
| `institution-meal-students` | Per-day student meal participation records |

---

## Steps

| Step | Action | Resource | Purpose |
|---|---|---|---|
| 1 | `openemis_get` | `institution-meal-programmes` | List active meal programmes for this institution/period |
| 2 | `openemis_get` | `meal-programme-types` + lookups | Resolve type, implementer, benefit IDs (parallel) |
| 3 | `openemis_get` | `meal-nutritional-records` | Fetch nutritional content per programme |
| 4 | `openemis_get` | `institution-meal-students` | List student participation records |

---

## Step Notes

**Step 1 — Institution Meal Programmes**  
Filter by `institution_id` AND `academic_period_id`. The underlying table is `meal_institution_programmes` (not `institution_meal_programmes`). Each record links to a `meal_programme_id` — capture this for step 3.

> ⚠️ **Non-standard FK aliases:** The association for programme type, target group, and implementer may appear in API responses as `type`, `targeting`, and `implementer` rather than the usual `_type_id` suffixes. Inspect the actual response keys before building further filters.

**Step 2 — Resolve Lookup Tables** *(run in parallel)*  
Fetch `meal-programme-types`, `meal-implementers`, and `meal-benefits` simultaneously — all are global reference lists.  
> Note: `meal-implementers` does **not** use the FieldOption behavior. It has only `id` and `name` — no `visible`, `order`, or `default` fields.

**Step 3 — Nutritional Records**  
Filter by `meal_programme_id` (from step 1).

> ⚠️ **Critical FK trap:** The FK to the `meal_nutritions` table on this resource is `nutritional_content_id` — **NOT** `meal_nutrition_id`. Using the wrong name will silently return empty results. Resolve `nutritional_content_id` via `/api/v5/meal-nutritions` for the nutrient name (e.g. Protein, Carbohydrates, Calories, Fat).

`meal-nutritional-records` acts as a join table (belongsToMany between programmes and nutritions). It may have a composite PK (`meal_programme_id` + `nutritional_content_id`) with no standalone integer `id` — do not query it by a bare numeric id.

**Step 4 — Student Participation**  
The API resource `institution-meal-students` maps to the `student_meal_marked_records` table — these are **per-day** meal attendance records, not a static enrollment list. Filter by `institution_id`, `academic_period_id`, and optionally `institution_class_id` or `meal_programme_id`. The `date` field records the specific participation date. `meal_benefit_id` indicates the type of benefit — resolve via `meal-benefits` from step 2.

---

## Key Gotchas

- **`nutritional_content_id`** is the FK to `meal_nutritions` in `meal-nutritional-records` — not `meal_nutrition_id`. This is the most common silent-failure trap.
- **`institution-meal-students` is per-day data**, not an enrollment list. Filter by `date` for a specific day's participation count.
- **`meal-implementers` has no FieldOption fields** (`visible`, `order`, `default` do not exist on this resource).
- **FK alias ambiguity** in `institution-meal-programmes`: programme type, target, and implementer associations may use short alias keys (`type`, `targeting`, `implementer`) rather than `_type_id` suffixes in API responses.
- Both `institution_id` and `academic_period_id` are required for `institution-meal-programmes` and `institution-meal-students`.

---

## Example Query

> *"What meal programmes does Avory Primary run this year, and what nutritional content do they provide?"*

1. `openemis_get { resource: "institution-meal-programmes", params: { institution_id: 6, academic_period_id: 1 } }` → 2 programmes (school feeding, supplementary)
2. Fetch `meal-programme-types`, `meal-implementers`, `meal-benefits` in parallel → resolve labels
3. `openemis_get { resource: "meal-nutritional-records", params: { meal_programme_id: 3 } }` → protein 15g, carbs 45g, calories 280kcal (using nutritional_content_id to resolve names)
4. `openemis_get { resource: "institution-meal-students", params: { institution_id: 6, academic_period_id: 1, meal_programme_id: 3 } }` → 312 student-day records this term
