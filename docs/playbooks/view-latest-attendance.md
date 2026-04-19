# Read Attendance Stats for a Class — Today / Week / Chronic Absentees

**Domain:** Attendance · **Audience:** teacher, admin, parent

Quick snapshot: who was absent today, week-to-date totals, and chronic absentees. OpenEMIS does NOT store a row per present student — presence is inferred by absence-by-omission once a day is marked. Reading attendance correctly requires three layers: (1) which days were actually taken as rolls; (2) which days had no_scheduled_class=99 (holiday/cancelled — skip for stats); (3) for the remaining MARKED days, pull absence events — every rostered student without a row that day is PRESENT.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `institution-class-grades` | Confirms the education grade(s) assigned to the class — used to scope attendance queries correctly. |
| `institution-class-students` | Provides the full class roster — the denominator for computing how many students were present vs absent on any given day. |
| `institution-class-attendance-records` | Month-level aggregate showing which days were marked: NOT_MARKED (no roll taken), PARTIAL_MARKED (some periods marked), or MARKED (all periods complete). Also flags no_scheduled_class=99 for holidays. |
| `student-attendance-marked-records` | The absence events — each row is one student's late, absent, or excused record for a specific day. Students without a row on a MARKED day are implicitly present. |
| `absence-types` | Reference table for absence type labels: 1 = Excused, 2 = Unexcused, 3 = Late. Used to distinguish absence types when computing stats. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Resolve roster | `openemis_get` | Fetch the class roll — the list of currently enrolled students who make up the attendance denominator. |
| 2 | Load absence-type lookup | `openemis_get` | Fetch the absence type reference so absence events can be categorised as absent, late, or excused. |
| 3 | Check which days were marked | `openemis_get` | Query institution-class-attendance-records to find which days in the date range actually had roll taken. |
| 4 | Pull absence events for the date range | `openemis_get` | Fetch all absence rows for the class across the target period. |
| 5 | Apply the reading invariant | — | Skip no_scheduled_class=99 days; for MARKED days, count absence rows as absences and compute present-by-omission for all other roster students. |

### Step notes

**Step 1 — Resolve roster:** Call `institution-class-students` filtered by `institution_class_id`, `academic_period_id`, and `student_status_id=1`. The count of returned students is the denominator for all attendance rate calculations.

**Step 2 — Load absence-type lookup:** Call `absence-types` with no filters — this is a small reference table. Use the result to label each absence row as Excused (1), Unexcused (2), or Late (3) in the output.

**Step 3 — Check which days were marked:** Call `institution-class-attendance-records` filtered by `institution_class_id`, `academic_period_id`, plus `year` and `month` for the target period. Look at the state field: NOT_MARKED days cannot be counted (no roll was taken); PARTIAL_MARKED days count only for the periods that were marked; MARKED days are fully complete. Filter out any rows where `no_scheduled_class=99` (holiday, force-majeure, cancelled class) — these must not count against any student's attendance rate.

**Step 4 — Pull absence events for the date range:** Call `student-attendance-marked-records` filtered by `institution_class_id`, `date_from`, and `date_to`, with a limit of 500 or more for busy classes. These rows are the absence events only.

**Step 5 — Apply the reading invariant:** For each MARKED non-holiday day, the number of absent students equals the count of rows in student-attendance-marked-records for that day. The number of present students equals (roster size) minus (absent count). The "chronic absentee" calculation must use marked days only — using the full calendar count will under-report presence for any day a teacher forgot to take roll.

---

## Example query

> "How many students in class 7A were absent this week, and who has been chronically absent this term?"

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English

---

## Notes

- The "chronic absentee" calculation must use marked days only — using the full calendar count (e.g., 30 days in April) will under-report presence for any day a teacher forgot to take roll.
- `no_scheduled_class` sentinels: 99 = no class that day (holiday, force-majeure, teacher sick, field trip); 0 = class was scheduled and happened. Readers must filter on this field.
- For a parent or guardian view of their own child: filter `student-attendance-marked-records` by `student_id` AND `institution_class_id`. They can see their own child's absence events but not the full class roster unless permissions allow it.
