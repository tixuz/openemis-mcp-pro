---
title: View Full Class Profile in OpenEMIS
description: This OpenEMIS playbook explains how to retrieve a complete class profile from the school management system, including enrolled students, teacher roster, and subject assignments.
keywords:
  - OpenEMIS
  - school management system
  - education management
  - student attendance
  - class profile
---

# View Full Class Profile in OpenEMIS

**Domain:** Student  
**Audience:** teacher, admin  
**Playbook ID:** `view-class-profile`

## Description

View a class profile: grade level assignment, enrolled student roster, active subjects, monthly attendance summary, and the full teacher roster (homeroom + secondary + subject teachers). The attendance resource uses a composite primary key — there is no integer `id` field; always use list-style filters to fetch it. The teacher roster is spread across three tables and requires a fan-out + dedupe.

---

## Resources Used

| Resource | Purpose |
|---|---|
| `institution-classes` | The class row itself — carries `staff_id` (the homeroom teacher FK) |
| `institution-class-grades` | Resolve which education grade level this class belongs to |
| `institution-class-students` | All currently enrolled students in the class |
| `institution-class-subjects` | Subjects actively taught in this class |
| `institution-subjects` | Resolve subject names from `institution_subject_id` |
| `institution-class-attendance-records` | Monthly attendance summary (daily present-student counts) |
| `institution-classes-secondary-staff` | Co-teachers / secondary staff assigned to the class |
| `institution-subject-staff` | Subject teachers — one row per (subject, staff) pairing |

---

## Steps

| Step | Action | Resource | Purpose |
|---|---|---|---|
| 1 | `openemis_get` | `institution-class-grades` | Resolve grade level for this class |
| 2 | `openemis_get` | `institution-class-students` | List enrolled students |
| 3 | `openemis_get` | `institution-class-subjects` | List active subjects |
| 4 | `openemis_get` | `institution-class-attendance-records` | Monthly attendance summary |
| 5 | `openemis_get` × 3 | `institution-classes` · `institution-classes-secondary-staff` · `institution-subject-staff` | Teacher roster (fan out, union, dedupe by `staff_id`) |

---

## Step Notes

**Step 1 — Class Grade Assignment**  
Filter by `institution_class_id`. Returns the `education_grade_id` — a mapping table (class ↔ grade). Typically one row per class, but multi-grade configurations are valid.

**Step 2 — Enrolled Students**  
Filter by `institution_class_id` and `academic_period_id`. Set `student_status_id=1` to return only currently enrolled students. This is a join table — the `id` field here is the enrollment record id, not the student id. `student_id` is the FK to `security_users`.

**Step 3 — Active Subjects**  
Filter by `institution_class_id` and `status=1` to return only active subjects. Subject names are not included — only `institution_subject_id` FK. Resolve names separately via `institution-subjects` if needed.

**Step 4 — Monthly Attendance Summary**  
> ⚠️ **CRITICAL:** `institution-class-attendance-records` has **NO integer `id` field**. Its primary key is composite: `(institution_class_id, academic_period_id, year, month)`. **NEVER** pass an `id=` param — it will return empty or error.

Use list filters only:
```
?institution_class_id={id}&academic_period_id={period}&year={year}&month={month}
```
Alternatively use the composite-key path:
```
GET /institution-class-attendance-records/institution_class_id/{X}/academic_period_id/{Y}/year/{Z}/month/{M}
```
`day_1` through `day_31` fields hold the daily present count; `null` means attendance was not yet submitted for that day.

**Step 5 — Teacher Roster**  
No single endpoint returns the full teacher list for a class. Fan out across three tables and union by `staff_id`:

**(a) Homeroom teacher** — on the class row itself:
```
openemis_get { resource: "institution-classes", id: 42 }
→ row.staff_id  (single security_users FK; may be null)
```

**(b) Secondary / co-teachers** — dedicated join table (composite PK, no integer `id`):
```
openemis_get { resource: "institution-classes-secondary-staff",
               params: { institution_class_id: 42 } }
→ rows with secondary_staff_id (FK to security_users)
```

**(c) Subject teachers** — one row per (subject, staff) pair. NOT filterable by `institution_class_id` directly; fan out over the `institution_subject_id` list from step 3:
```
for each institution_subject_id in step 3:
  openemis_get { resource: "institution-subject-staff",
                 params: { institution_subject_id: subjId } }
→ rows with staff_id
```

**Dedupe + name resolution.** A person can appear in multiple lists (homeroom teacher often also teaches a subject). Union by `staff_id`, then resolve names in one call:
```
openemis_get { resource: "security-users",
               params: { ids: "13,42,99" } }
```

---

## Key Gotchas

- **Composite PK — no integer id.** `institution-class-attendance-records` primary key is `(institution_class_id, academic_period_id, year, month)`. Any call using a bare numeric `id=` filter will fail silently or return wrong data.
- **Monthly aggregates only.** This resource holds present-counts per day. It is NOT the per-student absence log — for individual absences use `student-attendance-marked-records`.
- **`null` day fields ≠ zero.** `day_X` fields return `null` for days attendance was not submitted — treat as `Pending`, not as `0 absent`.
- **Teacher roster is fragmented.** Homeroom lives on `institution-classes.staff_id`, co-teachers on `institution-classes-secondary-staff`, subject teachers on `institution-subject-staff`. There is no single endpoint that unions them — fan out and dedupe.
- **`institution-classes-secondary-staff` composite PK.** `(institution_class_id, secondary_staff_id)`. Use list filters — don't pass a numeric `id=`.
- **`institution-subject-staff` is not class-filterable.** Filter by `institution_subject_id` only; iterate over the class's subject IDs from step 3.
- **Role-based visibility is a client concern today.** Principals, VPs, and admins need to see *all* classes in their institution, but the API provides no "classes I'm allowed to view" endpoint yet. The reverse query ("what classes can this `staff_id` see?") requires the same 3-table fan-out plus a role check — a dedicated core endpoint is on the OpenEMIS roadmap.

---

## Example Query

> *"Show me class 8A's profile for the current academic period."*

1. `openemis_get { resource: "institution-class-grades", params: { institution_class_id: 42 } }` → grade 8
2. `openemis_get { resource: "institution-class-students", params: { institution_class_id: 42, academic_period_id: 1, student_status_id: 1 } }` → 28 students
3. `openemis_get { resource: "institution-class-subjects", params: { institution_class_id: 42, status: 1 } }` → 7 subjects (IDs `[101, 102, …, 107]`)
4. `openemis_get { resource: "institution-class-attendance-records", params: { institution_class_id: 42, academic_period_id: 1, year: 2024, month: 3 } }` → March 2024 daily counts
5. Teacher roster:
   - `openemis_get { resource: "institution-classes", id: 42 }` → homeroom `staff_id=7`
   - `openemis_get { resource: "institution-classes-secondary-staff", params: { institution_class_id: 42 } }` → co-teachers `[12, 19]`
   - `openemis_get { resource: "institution-subject-staff", params: { institution_subject_id: 101 } }` × 7 → subject teachers `[7, 23, 41, 58, …]`
   - Union + dedupe → `{7, 12, 19, 23, 41, 58, …}`
   - `openemis_get { resource: "security-users", params: { ids: "7,12,19,23,41,58" } }` → names in one call

*When to use: ask "show me the full profile for class 8A" or "who are the teachers and students in this class" when a teacher or admin needs a complete class view from the OpenEMIS school management system.*
