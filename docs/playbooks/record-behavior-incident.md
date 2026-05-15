---
title: Record a Student Behaviour Incident in OpenEMIS
description: This OpenEMIS playbook explains how to log a student behaviour incident in the school management system, including category lookup and severity classification.
keywords:
  - OpenEMIS
  - school management system
  - student risks
  - behaviour incident
  - education management
---

# Record a Student Behaviour Incident in OpenEMIS

**Domain:** Student · **Audience:** teacher, admin

Log a behaviour incident against a student: look up categories and severity classifications, then write the incident record with a description and follow-up action. Available in v0.3.0 write tools.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `student-behaviour-categories` | Reference list of incident types (e.g. Bullying, Tardiness, Vandalism) — provides the category id to attach to the incident record. |
| `student-behaviour-classifications` | Reference list of severity levels (Minor, Major, Critical) — provides the classification id that indicates how serious the incident was. |
| `student-behaviours` | The write target — the incident record linked to the student, institution, and academic period, including the description and any follow-up action. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | List behaviour categories | `openemis_get` | Get the id for the category that matches the incident (e.g. Bullying, Tardiness). |
| 2 | List severity classifications | `openemis_get` | Get the id for the severity level (Minor, Major, Critical). |
| 3 | Write the incident record | `openemis_create` | Create the behaviour record linked to the student, institution, and academic period. |

### Step notes

**Step 1 — List behaviour categories:** Fetch all rows from `student-behaviour-categories`. Review the names and note the `category_id` that best matches the incident type being recorded. This id is required in step 3.

**Step 2 — List severity classifications:** Fetch all rows from `student-behaviour-classifications`. Note the `classification_id` for the appropriate severity level (Minor, Major, or Critical). This id is required in step 3.

**Step 3 — Write the incident record:** POST to `student-behaviours` with the following required fields: `student_id`, `institution_id`, `academic_period_id`, `date_of_behaviour` (YYYY-MM-DD), `description` (narrative of what happened), `student_behaviour_category_id` (from step 1), and `student_behaviour_classification_id` (from step 2). Optional fields: `action_taken` (what the teacher or admin did in response) and `follow_up_date` (if a follow-up is scheduled).

---

## Example query

> "Log a minor bullying incident for student James on April 15th — he was teasing a classmate during recess."

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English

*When to use: ask "log a behaviour incident" or "record a disciplinary event for a student" when a teacher or admin needs to document a student behaviour incident in the OpenEMIS school management system.*
