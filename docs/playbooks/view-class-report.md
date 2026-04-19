# View Class-Level Report Card Overview for a Grade

**Domain:** Report · **Audience:** teacher, admin

Retrieve the report card configuration for a class, list the subjects included in it, and pull the assessment item results for all students in that grade and period. This gives a class-level overview equivalent to what a teacher sees on the report card summary screen. Note that this is a read workflow — PDF generation requires a separate async process (see the generate-student-report-card-pdf playbook).

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `report-cards` | The report card definition for the institution and academic period — determines which subjects and grading components are included in the official report card. |
| `institution-class-grades` | Provides the education_grade_id(s) assigned to this class, used to filter assessment results by grade. |
| `report-card-subjects` | Lists the subjects on the report card with their display order — ensures the class overview matches the official report card layout. |
| `assessment-item-results` | Provides all student mark rows for this grade and period — the data source for the class-level summary grid. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Fetch Report Card Configuration | `openemis_get` | Retrieve the report card definition to confirm which subjects and grading scale are in scope. |
| 2 | Fetch Grade Assignments for the Class | `openemis_get` | Retrieve the education_grade_id(s) for this class to scope assessment result queries. |
| 3 | Fetch Subjects on the Report Card | `openemis_get` | List the subjects included on the report card and their display order. |
| 4 | Fetch Assessment Results for the Class | `openemis_get` | Pull all student mark rows for this grade and period to construct the class-level summary table. |

### Step notes

**Step 1 — Fetch Report Card Configuration:** Filter `report-cards` by `institution_id` and `academic_period_id`. The response includes `report_card_id` (needed for step 3), the grading scale reference, and whether teacher comments are enabled. If multiple report cards exist for the same period, match by `education_grade_id` or ask the user which one to use.

**Step 2 — Fetch Grade Assignments for the Class:** Filter `institution-class-grades` by `institution_class_id`. A class typically maps to one grade, but some institutions configure multi-grade classes — capture all `education_grade_id` values returned for use in steps 3 and 4.

**Step 3 — Fetch Subjects on the Report Card:** Filter `report-card-subjects` by `report_card_id` from step 1. Each row links a subject to the report card via `education_subject_id`. Use this list to determine which subjects to show in the class overview — subjects not in this list do not appear on the official report card.

**Step 4 — Fetch Assessment Results for the Class:** Filter `assessment-item-results` by `education_grade_id` (from step 2) and `academic_period_id`. For a large class, paginate using `limit=200`. Each row has `student_id`, `assessment_item_id`, `marks`, and `grading_option_id`. Group by `student_id` and `assessment_item_id` to build the per-student per-subject grid. Rows with `marks=null` indicate grades not yet entered.

---

## Example query

> "Show me the report card overview for all students in Grade 6 — how is each student performing across subjects?"

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English
