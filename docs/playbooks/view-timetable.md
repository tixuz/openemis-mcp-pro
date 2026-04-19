# View Timetable for a Class or Teacher

**Domain:** Schedule · **Audience:** teacher, admin, student

Retrieve the weekly schedule for a specific institution class — including day, period slot, subject, and assigned teacher — for the current or specified academic period. The timetable is stored in institution-schedule-timetables; class-grade mapping from institution-class-grades is used to enrich the response with education grade context. For a student's personal timetable view (parent or student-facing), use the view-student-timetable playbook instead.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `institution-schedule-timetables` | The timetable itself — each row is a scheduled slot with day of week, period number, subject id, and teacher assignment. Also used in step 3 to check for unscheduled gaps. |
| `institution-class-grades` | Provides the education grade associated with this class, used to label the timetable display with grade context. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Fetch Class Timetable | `openemis_get` | Retrieve all scheduled slots for the specified class and academic period. |
| 2 | Fetch Grade Information for the Class | `openemis_get` | Retrieve the education grade associated with this class to enrich the timetable display. |
| 3 | Identify Gaps or Unscheduled Periods | `openemis_discover` | Check for missing period slots by comparing fetched rows against the expected periods per day. |

### Step notes

**Step 1 — Fetch Class Timetable:** Filter `institution-schedule-timetables` by `institution_class_id` and `academic_period_id`. If the user provides a teacher name instead of a class, first resolve the `staff_id` from the staff resource, then filter timetables by `staff_id`. Each row includes `day_of_week` (integer 1–7), `period` (integer), `institution_subject_id`, and `staff_id`. Order by `day_of_week` and `period` for a readable weekly grid.

**Step 2 — Fetch Grade Information for the Class:** Filter `institution-class-grades` by `institution_class_id`. Capture `education_grade_id` to label the timetable output (e.g. "Grade 4 — Class A timetable"). In multi-grade class configurations, multiple rows may be returned — display all associated grades.

**Step 3 — Identify Gaps or Unscheduled Periods:** Group the results from step 1 by `day_of_week` and list the period numbers present for each day. If consecutive periods are missing (e.g. day 2 has periods 1, 2, 4 but not 3), note them as unscheduled or free periods in the output. This is computed by the caller — there is no "gap" field in the resource itself.

---

## Example query

> "What does class 9A's weekly timetable look like for this academic year?"

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English
