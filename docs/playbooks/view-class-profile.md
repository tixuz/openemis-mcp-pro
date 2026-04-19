# View Full Class Profile

**Domain:** Student  
**Audience:** teacher, admin  
**Playbook ID:** `view-class-profile`

## Description

View a class profile: grade level assignment, enrolled student roster, active subjects, and monthly attendance summary. The attendance resource uses a composite primary key — there is no integer `id` field; always use list-style filters to fetch it.

---

## Resources Used

| Resource | Purpose |
|---|---|
| `institution-class-grades` | Resolve which education grade level this class belongs to |
| `institution-class-students` | All currently enrolled students in the class |
| `institution-class-subjects` | Subjects actively taught in this class |
| `institution-class-attendance-records` | Monthly attendance summary (daily present-student counts) |

---

## Steps

| Step | Action | Resource | Purpose |
|---|---|---|---|
| 1 | `openemis_get` | `institution-class-grades` | Resolve grade level for this class |
| 2 | `openemis_get` | `institution-class-students` | List enrolled students |
| 3 | `openemis_get` | `institution-class-subjects` | List active subjects |
| 4 | `openemis_get` | `institution-class-attendance-records` | Monthly attendance summary |

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

---

## Key Gotchas

- **Composite PK — no integer id.** `institution-class-attendance-records` primary key is `(institution_class_id, academic_period_id, year, month)`. Any call using a bare numeric `id=` filter will fail silently or return wrong data.
- **Monthly aggregates only.** This resource holds present-counts per day. It is NOT the per-student absence log — for individual absences use `student-attendance-marked-records`.
- **`null` day fields ≠ zero.** `day_X` fields return `null` for days attendance was not submitted — treat as `Pending`, not as `0 absent`.

---

## Example Query

> *"Show me class 8A's profile for the current academic period."*

1. `openemis_get { resource: "institution-class-grades", params: { institution_class_id: 42 } }` → grade 8
2. `openemis_get { resource: "institution-class-students", params: { institution_class_id: 42, academic_period_id: 1, student_status_id: 1 } }` → 28 students
3. `openemis_get { resource: "institution-class-subjects", params: { institution_class_id: 42, status: 1 } }` → 7 subjects
4. `openemis_get { resource: "institution-class-attendance-records", params: { institution_class_id: 42, academic_period_id: 1, year: 2024, month: 3 } }` → March 2024 daily counts
