# See a Student's Timetable (Parent / Student View)

**Domain:** Schedule · **Audience:** parent, student

Given a student id, return the class timetable — subjects, teachers, rooms, and time slots for the current academic period. This is the personal view a student or parent would see, showing the specific class the student is enrolled in.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `institution-students` | Provides the link between the student and their enrolled class, retrieving the institution_class_id needed to look up the timetable. |
| `institution-class-grades` | Confirms the education grade associated with the class, used to enrich the timetable display with grade context. |
| `institution-class-subjects` | Lists the subjects taught in this class, used to match timetable slot entries with subject names. |
| `institution-subject-staff` | Links subjects to the teachers assigned to teach them, enabling the timetable to show who teaches each class. |
| `institution-schedule-timetables` | The timetable itself — each row is one scheduled slot with day, period, subject, teacher, and optionally room. |
| `institution-rooms` | Maps room ids to room names or codes so the timetable can display the physical location for each slot. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Resolve student to class | `openemis_get` | Look up the student's current enrollment to get their institution_class_id and institution_id. |
| 2 | Read the class timetable | `openemis_get` | Fetch all scheduled slots for that class and academic period. |
| 3 | Enrich with subject, staff, and room details | `openemis_get` | Join subject names, teacher names, and room names to produce a readable timetable. |

### Step notes

**Step 1 — Resolve student to class:** Call `institution-students` filtered by `student_id` and `academic_period_id`, requesting fields `institution_class_id`, `institution_id`, and `education_grade_id`. Use `student_status_id=1` to ensure only the current active enrollment is returned, not historical records from past years.

**Step 2 — Read the class timetable:** Call `institution-timetable` (or `institution-schedule-timetables`) filtered by `institution_class_id` and `academic_period_id`. Each row contains day_of_week (integer 1–7), a period number, a subject id, and a staff id. Order by day_of_week and period for a readable grid.

**Step 3 — Enrich with subject, staff, and room details:** Fetch subject names from `institution-class-subjects` and `institution-subjects`, teacher names from `institution-subject-staff`, and room names from `institution-rooms`. Use these to replace ids with human-readable labels in the final timetable output.

---

## Example query

> "What is Mariam's class schedule for this term?"

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English
