# Parent/Student Dashboard — Latest Attendance, Behavior, Marks

**Domain:** Student · **Audience:** parent, student

Aggregate the three things parents ask about most: how often has my child been absent lately, any behavior incidents, and recent test or assessment marks. This playbook pulls all three data sets in a compact sequence and returns a single summary view.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `institution-students` | Confirms the student's current enrollment details — institution, grade, class, and academic period — as the anchor for all subsequent lookups. |
| `student-attendance-marked-records` | Provides the student's recent absence and late-arrival events (absence by omission means days without a row are present days). |
| `student-behaviours` | Lists any logged behavioral incidents — sorted by date so the most recent events appear first. |
| `assessment-item-results` | Contains the student's scored marks for each subject and assessment item in the current period. |
| `report-card-comment-codes` | Optional reference for resolving comment codes on the report card if the parent asks about teacher feedback. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Resolve student record | `openemis_get` | Fetch the student's current enrollment details to confirm identity and get the ids needed for subsequent calls. |
| 2 | Fetch latest attendance | `openemis_get` | Retrieve the most recent 30 absence/late events for the student. |
| 3 | Fetch behavior incidents | `openemis_get` | Retrieve the 10 most recent behavior incidents logged against this student. |
| 4 | Fetch recent marks | `openemis_get` | Retrieve up to 50 assessment item results for the student in the current academic period. |

### Step notes

**Step 1 — Resolve student record:** Call `institution-students` with the student's id to confirm they are enrolled and retrieve `institution_id`, `institution_class_id`, `education_grade_id`, and `academic_period_id`. These ids are the join keys for all three data sets.

**Step 2 — Fetch latest attendance:** Call `student-attendance-marked-records` filtered by `student_id`, ordered by `date` descending, with a limit of 30. Each row is an absence event (absence_type_id: 1 = Excused, 2 = Unexcused, 3 = Late). Days where the student has no row are implicitly present, provided the day was marked.

**Step 3 — Fetch behavior incidents:** Call `institution-student-behaviours` filtered by `student_id`, ordered by `date_of_behaviour` descending, with a limit of 10. Check whether any incidents exist — an empty list is a positive result to report to the parent.

**Step 4 — Fetch recent marks:** Call `assessment-item-results` filtered by `student_id` and `academic_period_id`, with a limit of 50. Each row contains the subject (via assessment_item_id), the numeric mark, and a grading_option_id for letter-grade resolution.

---

## Example query

> "How has Mariam been doing this term — attendance, behavior, and marks?"

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English
