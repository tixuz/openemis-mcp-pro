# Enhance Student Profile with Contacts, Nationality, and Special Needs

**Domain:** Student  
**Audience:** teacher, admin, counsellor  
**Playbook ID:** `enhance-student-profile`

## Description

Augment an existing student profile view by fetching direct contact details, nationality assignments, special-needs assessments, and special-needs plans. All four enhancement resources filter by `security_user_id` (the student's global user ID from `security_users`), **NOT** by `student_id` (the enrollment FK). Empty results for special-needs are valid — most students have no records.

---

## Resources Used

| Resource | Purpose |
|---|---|
| `institution-students` | Confirm active enrollment and resolve `security_user_id` |
| `user-contacts` | Phone numbers and email addresses |
| `user-nationalities` | Nationality assignments (supports dual citizenship) |
| `user-special-needs-assessments` | Special educational needs (SEN) assessments |
| `user-special-needs-plans` | Individual Education Plans (IEPs) or similar plans |

---

## Steps

| Step | Action | Resource | Purpose |
|---|---|---|---|
| 1 | `openemis_get` | `institution-students` | Confirm active enrollment; capture `security_user_id` |
| 2 | `openemis_get` | `user-contacts` | Fetch phone/email contact details |
| 3 | `openemis_get` | `user-nationalities` | Fetch nationality assignments |
| 4 | `openemis_get` | `user-special-needs-assessments` | Fetch SEN assessments |
| 5 | `openemis_get` | `user-special-needs-plans` | Fetch SEN plans / IEPs |

---

## Step Notes

**Step 1 — Confirm Enrollment and Resolve `security_user_id`**  
Filter by `student_id` and `student_status_id=1`. The `student_id` field on `institution-students` **IS** the `security_user_id` (FK to `security_users`). Capture it — steps 2 through 5 all filter by `security_user_id`.

**Step 2 — Contact Details**  
Filter by `security_user_id` — the global user ID from step 1. Do NOT filter by `student_id` alone — `user-contacts` is a global user table and the FK is `security_user_id`. Resolve `contact_type_id` via `/api/v5/contact-types` for human-readable labels (e.g. "Mobile", "Email"). `preferred=true/1` marks the primary contact of each type.

**Step 3 — Nationality Assignments**  
Filter by `security_user_id`. Multiple rows are valid (dual citizenship). Use `preferred=true` to identify the primary nationality. Resolve `nationality_id` via `/api/v5/nationalities` for the country name.

**Step 4 — SEN Assessments**  
Filter by `security_user_id`. An **empty result is valid and common** — most students have no SEN assessments. Resolve `special_need_type_id` via `/api/v5/special-need-types` and `special_need_difficulty_id` via `/api/v5/special-need-difficulties` for human-readable labels. `file_content` is always `null` in list responses — call `GET /{id}` if the file is needed.

**Step 5 — SEN Plans**  
Filter by `security_user_id` and optionally `academic_period_id`.  
> ⚠️ **SPELLING:** The FK field on this resource is `special_needs_plan_types_id` (plural "needs") — **NOT** `special_need_plan_type_id` (singular). Using the wrong spelling will silently fail. An empty result is valid — most students have no plans. `file_content` is always `null` in list responses.

---

## Key Gotchas

- **All four enhancement resources use `security_user_id`** as the filter key — the student's global FK to `security_users`. The `institution-students.student_id` column IS that same `security_user_id`.
- **Empty results are expected and valid** for special-needs resources. Do NOT treat an empty array as an error — most students have no SEN assessments or plans.
- **`user-special-needs-plans` FK spelling:** `special_needs_plan_types_id` (plural). Resolve via `/api/v5/special-needs-plan-types`.
- **`file_content` is always `null` in list responses** for both SEN resources — to save bandwidth. Call `GET /{id}` on a specific record to retrieve the base64 file.
- **Steps 2–5 can be fetched in parallel** once `security_user_id` is known from step 1.

---

## Example Query

> *"Give me the full profile for student Ahmad — contacts, nationality, and any special needs records."*

1. `openemis_get { resource: "institution-students", params: { student_id: 102, student_status_id: 1 } }` → security_user_id=102
2. `openemis_get { resource: "user-contacts", params: { security_user_id: 102 } }` → mobile +60-11-222-3333
3. `openemis_get { resource: "user-nationalities", params: { security_user_id: 102 } }` → Malaysian (preferred)
4. `openemis_get { resource: "user-special-needs-assessments", params: { security_user_id: 102 } }` → [] (none)
5. `openemis_get { resource: "user-special-needs-plans", params: { security_user_id: 102 } }` → [] (none)
