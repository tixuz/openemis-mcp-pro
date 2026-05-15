---
title: View a Student's Risk Profile and Welfare Cases in OpenEMIS
description: This OpenEMIS playbook explains how to retrieve student risk scores, early-warning flags, welfare cases, and alert rules from the school management system.
keywords:
  - OpenEMIS
  - student risks
  - school management system
  - education management
  - early-warning
---

# View a Student's Risk Profile and Welfare Cases in OpenEMIS

**Domain:** Student  
**Audience:** admin, counsellor, teacher  
**Playbook ID:** `view-student-risks`

## Description

View a student's calculated risk score, the individual risk criteria that contributed to it, and any welfare or safeguarding cases opened for that student. `institution-risks` has a composite PK — no integer `id`. `institution-cases` is workflow-controlled — GET is always safe, but writes must go through the OpenEMIS application.

---

## Resources Used

| Resource | Purpose |
|---|---|
| `institution-student-risks` | Student's overall risk score for the academic period |
| `risks` | Master risk definitions — names and what each risk measures |
| `risk-criterias` | Threshold and weight for each criterion within a risk |
| `student-risks-criterias` | Per-criterion scores for this student's risk record |
| `institution-cases` | Welfare/safeguarding cases opened for this student |
| `case-types` | Global lookup: case type labels |
| `case-priorities` | Global lookup: priority labels |

---

## Steps

| Step | Action | Resource | Purpose |
|---|---|---|---|
| 1 | `openemis_get` | `institution-student-risks` | Fetch student's total risk score |
| 2 | `openemis_get` | `risks` | Resolve risk names and definitions |
| 3 | `openemis_get` | `student-risks-criterias` | Break down score by criterion |
| 4 | `openemis_get` | `institution-cases` | List open welfare cases for this student |

---

## Step Notes

**Step 1 — Student Risk Score**  
Filter by `institution_id` AND `academic_period_id` AND `student_id` (student's `security_user_id`). Both `institution_id` and `academic_period_id` are required — omitting either returns unscoped global results across all institutions and periods. The `total_risk` field is the calculated aggregate. Capture the `id` field for step 3.

**Step 2 — Risk Definitions**  
Filter by `academic_period_id` — **required, cannot be empty** (validated at the API level). The `risks` table is the master definition of what each risk type measures for a given period. Resolve `risk_id` from step 1 here. Fetch `risk-criterias` filtered by `risk_id` to get the `risk_value` (1–99 range) and `threshold` for each criterion.

**Step 3 — Per-Criterion Breakdown**  
Filter by `institution_student_risk_id` (the `id` from step 1). This is a composite-PK join table (`institution_student_risk_id` + `risk_criteria_id`) — **no standalone integer `id`**. Do NOT query by a bare `id=` parameter. The `value` field holds the evaluated score for each criterion. Resolve `risk_criteria_id` via `risk-criterias` to show labels and thresholds.

**Step 4 — Welfare Cases**  
Filter by `institution_id`. `institution-cases` is **workflow-controlled** — `status_id` references `workflow_steps`, not a simple enum. GET is always safe.

> ⚠️ For creating or updating cases, use the OpenEMIS application — direct API writes bypass the approval and audit chain.

`case_number` is auto-generated as `{institution_code}-{date}-{id}`. Resolve `case_type_id` via `case-types` and `case_priority_id` via `case-priorities` — both are global FieldOption lookups with no `institution_id` or `academic_period_id` filter.

---

## Key Gotchas

- **`institution-student-risks`** requires both `institution_id` AND `academic_period_id` — both mandatory.
- **`risks`** requires `academic_period_id` as a mandatory field.
- **`student-risks-criterias` is a composite-PK join table** — no integer `id`. Filter by `institution_student_risk_id` only.
- **`institution-cases` is workflow-controlled.** GET is safe. Writes must go through the application.
- **FK names:** `case_priority_id` (not `priority_id`), `case_type_id` (not `type_id`).

---

## Example Query

> *"What is Ahmad's risk level this year and are there any welfare cases open for him?"*

1. `openemis_get { resource: "institution-student-risks", params: { institution_id: 6, academic_period_id: 1, student_id: 102 } }` → total_risk: 72, id: 445
2. `openemis_get { resource: "risks", params: { academic_period_id: 1 } }` → "Attendance Risk", "Academic Risk"
3. `openemis_get { resource: "student-risks-criterias", params: { institution_student_risk_id: 445 } }` → absence criterion: 85, marks criterion: 60
4. `openemis_get { resource: "institution-cases", params: { institution_id: 6 } }` → 1 open case, Priority: High, Type: Welfare

*When to use: ask "what are this student's risk scores" or "does this student have any welfare cases" when a counsellor, admin, or teacher needs early-warning and student risk data from the OpenEMIS school management system.*
