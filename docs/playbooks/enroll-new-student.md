# Enrol a New Student at an Institution

**Domain:** Student · **Audience:** admin, registrar

BYPASS MODE ONLY: direct enrolment works only when the system configuration has "bypass enrolment workflow" enabled. If the admission → enrolment workflow is active, use the OpenEMIS application — the workflow requires supervisor approval at each stage and cannot be driven via API alone.

> ⚠️ **Workflow gate:** This playbook only works when `Administration → System Configuration → Student → Bypass Enrolment Workflow` is enabled in system configuration. Use the official application Admission and Enrolment forms instead.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `security-users` | Creates the base user account for the student — all OpenEMIS users (students, staff, parents) share this table. |
| `user-identities` | Optionally links a national ID, passport, or other identity document to the new student's user record. |
| `student-guardians` | Optionally links a parent or guardian record to the student after enrolment. |
| `education-grades` | Reference table used to resolve the target grade name (e.g. "Grade 5") to its id for the enrolment record. |
| `academic-periods` | Provides the current academic period id — a required field on every enrolment record and the first check that the API is reachable. |
| `institution-students` | The write target — the enrolment record that links the student's user account to the institution, grade, and academic period. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Confirm bypass mode is active | `openemis_get` | Fetch the current academic period id — confirms the API is reachable before any writes are attempted. |
| 2 | Look up target education grade | `openemis_get` | Resolve the education_grade_id for the grade the student is joining. |
| 3 | Create the student user account | `openemis_create` | Create the base user record with the student's personal details. |
| 4 | Attach identity document (optional) | `openemis_create` | Link a national ID or passport number to the student's user record. |
| 5 | Enrol student into the institution | `openemis_create` | Create the enrolment record linking the student to the institution, grade, and period. |
| 6 | Link guardian contact (optional) | `openemis_create` | Associate a guardian or parent record with the student. |

### Step notes

**Step 1 — Confirm bypass mode is active:** Verify with the admin that bypass enrolment workflow is enabled in system configuration before proceeding with any writes. Call `academic-periods` with `_conditions=current:1` or pick the active period by date. Note the `academic_period_id` — it is required in steps 5 and 6.

**Step 2 — Look up target education grade:** Filter `education-grades` by name matching the grade the student is joining (e.g. filter for "Grade 5"). Note the `education_grade_id` for use in step 5.

**Step 3 — Create the student user account:** POST to `security-users` with required fields: `first_name`, `last_name`, `date_of_birth`, and `gender_id`. The response returns the new user id — save it as `student_id` for step 5.

**Step 4 — Attach identity document (optional):** POST to `user-identities` with `user_id` (from step 3), `identity_type_id`, and `number`. Skip this step if no identity document is provided.

**Step 5 — Enrol student into the institution:** POST to `institution-students` with `student_id` (from step 3), `institution_id`, `education_grade_id` (from step 2), `academic_period_id` (from step 1), and `student_status_id: 1` (Current). `start_date` defaults to today if not supplied.

**Step 6 — Link guardian contact (optional):** POST to `student-guardians` with `student_id`, `guardian_id` (the pre-existing user id of the guardian), and `guardian_relation_id`. Skip this step if no guardian information is provided.

---

## Example query

> "Enrol new student Alina Ivanova, born 2014-03-15, female, in Grade 4 at Avory Primary School."

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English
