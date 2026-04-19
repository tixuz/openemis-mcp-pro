# Look Up a Student's Marks and Assessment Results for a Subject or Period

**Domain:** Assessment · **Audience:** teacher, admin, parent

Retrieve a student's scored results from assessment-item-results for one or more assessments in a given academic period. This playbook first locates the relevant assessment definitions and period identifiers, then fetches the raw mark rows, and finally enriches them with subject names from education-subjects. Results include the numeric mark plus a grading_option_id which can be resolved against the assessment's grading table for a letter grade or pass/fail label.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `institution-students` | Confirms the student is enrolled and provides the institution_id, education_grade_id, and academic_period_id required to filter assessments correctly. |
| `assessments` | Lists the available assessments (mid-term, final exam, quarterly) for the student's grade and academic period. |
| `assessment-periods` | Provides the period labels (Term 1, Semester 2) within each assessment so marks can be displayed with the correct period name. |
| `assessment-items` | Lists the individual subject components within the assessment, including maximum marks and education_subject_id for subject name resolution. |
| `assessment-item-results` | The source of the actual scored marks — one row per student per assessment item. |
| `education-subjects` | Reference table for subject names — used to replace education_subject_id values with readable labels in the final output. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Confirm Student Enrollment | `openemis_get` | Verify the student is enrolled and retrieve the grade and period ids needed to filter assessments. |
| 2 | Fetch Assessments for the Grade and Period | `openemis_get` | List the assessments available for this student's grade and academic period. |
| 3 | Fetch Assessment Periods | `openemis_discover` | Resolve assessment period labels so marks can be displayed with the correct period name. |
| 4 | Fetch Assessment Items (Subjects) | `openemis_get` | Retrieve the assessed subjects within the selected assessment, including maximum marks. |
| 5 | Resolve Subject Names | `openemis_discover` | Map education_subject_id values to human-readable subject names. |
| 6 | Fetch Student Marks | `openemis_get` | Retrieve the actual scored marks for this student across all assessment items. |

### Step notes

**Step 1 — Confirm Student Enrollment:** Filter `institution-students` by `student_id` and `student_status_id=1`. If the user provided the student's name instead of an id, search with `first_name` or `last_name` filter. Capture `education_grade_id` and `academic_period_id` from the response — they are the join keys for assessments.

**Step 2 — Fetch Assessments for the Grade and Period:** Filter `assessments` by `education_grade_id` and `academic_period_id` from step 1. If the user named a specific assessment (e.g. "final exam"), match by name. If not specified, return all and let the user choose or fetch results for all.

**Step 3 — Fetch Assessment Periods:** Filter `assessment-periods` by `assessment_id` from step 2 if available. Match each result's `assessment_period_id` to these records to display a human-readable period label alongside the marks.

**Step 4 — Fetch Assessment Items (Subjects):** Filter `assessment-items` by `assessment_id`. Each item has an `education_subject_id` — capture these for subject name resolution in step 5. The response also includes the passing mark threshold if configured.

**Step 5 — Resolve Subject Names:** Fetch `education-subjects` with no filters, or filter by `education_grade_id` to limit the result set. Build a lookup map of `{id → name}` to enrich the marks rows in step 6.

**Step 6 — Fetch Student Marks:** Filter `assessment-item-results` by `student_id` and `assessment_id`. Optionally filter by `assessment_period_id` if the user asked for a specific term. Each row contains `assessment_item_id` (join to step 4 for subject), `marks` (numeric score), and `grading_option_id` (letter grade reference). A missing row for a subject means the mark has not yet been entered — distinguish this from a zero mark.

---

## Example query

> "What marks did Khindol get in the mid-term exams this semester?"

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English
