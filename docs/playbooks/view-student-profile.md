# View Student Profile, Guardian Contacts, and Absence History

**Domain:** Student · **Audience:** teacher, admin

Retrieve a student's full enrollment record, the list of guardians associated with them, and their recent absence history in one workflow. The guardian step enriches each contact with the relationship type (e.g., mother, father, legal guardian) by resolving the guardian-relations lookup table. Absence history is fetched from student-attendance-marked-records — each row is an absence or late event; days with no row are implicitly present.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `institution-students` | Provides the student's current enrollment details — institution, grade, class, and academic period — as the anchor for the rest of the workflow. |
| `student-guardians` | Lists all guardians linked to this student, including contact details and the relationship type id for each. |
| `guardian-relations` | Reference table of relationship type labels (Mother, Father, Legal Guardian, etc.) — used to turn the guardian_relation_id into a human-readable display name. |
| `student-attendance-marked-records` | Provides the student's recent absence, late, and excused events ordered by date — absence by omission means days without a row were present days. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Fetch Student Enrollment Record | `openemis_get` | Retrieve the student's current enrollment details including institution, education grade, class, and academic period. |
| 2 | Fetch Guardian Contacts | `openemis_get` | Retrieve all guardian records linked to this student, including contact details and relationship type id. |
| 3 | Resolve Guardian Relationship Types | `openemis_discover` | Look up the full list of relationship type labels so each guardian_relation_id can be displayed as a human-readable label. |
| 4 | Fetch Absence History | `openemis_get` | Retrieve the student's recent absence, late, and excused events to give a quick overview of attendance patterns. |

### Step notes

**Step 1 — Fetch Student Enrollment Record:** Filter `institution-students` by `student_id` and optionally `academic_period_id`. Include fields: `id`, `student_id`, `institution_id`, `institution_class_id`, `education_grade_id`, `academic_period_id`, `student_status_id`. If `student_status_id=1` is not set, the student may appear in multiple periods — narrow to the current one. Capture `institution_class_id` and `education_grade_id` for the absence history step.

**Step 2 — Fetch Guardian Contacts:** Filter `student-guardians` by `student_id`. Expect fields such as `guardian_relation_id`, `first_name`, `last_name`, `contact_number`, and `email`. A student may have 0–4 guardians; an empty result is valid, especially for older students. The `guardian_relation_id` will be resolved in the next step.

**Step 3 — Resolve Guardian Relationship Types:** This is a small reference table — fetch `guardian-relations` with no filters needed. Build a lookup map of `{id → name}` and replace each guardian's `guardian_relation_id` with its label. Skip this step if the caller only needs contact numbers and does not need to display the relationship label.

**Step 4 — Fetch Absence History:** Filter `student-attendance-marked-records` by `student_id`, ordered by `date` descending, with a limit of 30 for the most recent events. Each row has `absence_type_id` (1 = Excused, 2 = Unexcused, 3 = Late) and `date`. Remember: only exception rows are stored — a student with no row on a given MARKED day was PRESENT by omission. To check totals over a specific period, also filter by `date_from` and `date_to`.

---

## Example query

> "Show me Mariam's profile, her guardians' contact information, and how often she's been absent this month."

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English
