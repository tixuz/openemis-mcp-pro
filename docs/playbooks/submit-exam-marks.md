# Submit Subject Exam Marks for an Assessment Period

**Domain:** Assessment · **Audience:** teacher

Bulk-enter per-student marks for one assessment item, commit, then verify the weighted result was calculated. This playbook locates the correct assessment and class roster, then posts one mark row per student.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `assessments` | Lists the available assessments (mid-term, final exam, quarterly) for this grade and period — the starting point for identifying which assessment to write marks for. |
| `assessment-periods` | Provides the period labels (Term 1, Semester 2) within the assessment — needed to scope the marks to the correct term. |
| `assessment-items` | Lists the individual subject components within the assessment (e.g. Mathematics, English) including maximum marks — one item per subject. |
| `assessment-item-results` | The write target — one row per student per assessment item records their numeric mark and grade. |
| `education-subjects` | Reference table for subject names, used to display which subject each assessment item corresponds to. |
| `institution-class-students` | The class roster — provides the list of student ids to enter marks for. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Get the assessment and period | `openemis_get` | Find the assessment definition for this grade and academic period to get assessment_id and period details. |
| 2 | Fetch class roster | `openemis_get` | Get the list of currently enrolled students in the class so a mark row can be prepared for each one. |
| 3 | Submit a mark per student | `openemis_create` | POST one assessment-item-results row per student with their numeric mark. |

### Step notes

**Step 1 — Get the assessment and period:** Call `assessments` filtered by `academic_period_id` and `education_grade_id`. If the teacher named a specific assessment (e.g. "final exam"), match by name. Note the `assessment_id` — it is required for steps 2 and 3. Also call `assessment-periods` filtered by `assessment_id` to get the correct `assessment_period_id`.

**Step 2 — Fetch class roster:** Call `institution-class-students` filtered by `institution_class_id`, `academic_period_id`, and `student_status_id=1` (active only). Each row gives the `student_id` needed for the mark submission.

**Step 3 — Submit a mark per student:** POST to `assessment-item-results` with `assessment_id`, `assessment_period_id`, `assessment_item_id` (identifies which subject), `student_id`, and `marks` (numeric score). Rows can be submitted individually or as a batch. After posting, verify the results were saved by fetching assessment-item-results filtered by assessment_id and student_id.

---

## Example query

> "Enter the mid-term math marks for class 8B — all students scored between 65 and 90."

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English
