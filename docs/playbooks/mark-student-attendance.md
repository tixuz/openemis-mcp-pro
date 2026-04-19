# Mark Student Attendance for a Class (Period Roll Call)

**Domain:** Attendance · **Audience:** teacher, admin

Daily or period-based roll call. The teacher speaks naturally ("mark Alex excused, Sam unexcused, Jordan late, all others present") and the agent resolves the class roster, fuzzy-matches names, maps phrases to absence type ids, and posts only the exception students. Every student without a row is considered PRESENT by omission — the "absence-by-omission invariant". Supports three attendance modes: DAY (whole-day roll), SUBJECT (per-subject), and DAY_AND_SUBJECT (both). The month-level aggregate updates automatically after each post — you should not write to the aggregate table directly.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `institution-class-grades` | Confirms which education grade is associated with the class, needed to look up the correct attendance mark type. |
| `institution-students` | Provides the class roster — the list of enrolled students whose names the agent will fuzzy-match against the teacher's roll call. |
| `absence-types` | Reference table mapping absence type ids to labels: 1 = Excused, 2 = Unexcused, 3 = Late. |
| `student-attendance-marked-records` | The write target — one row per exception student per period records their absence, late arrival, or excused status. |
| `student-attendance-mark-types` | Determines which attendance mode is configured for this grade and period (DAY, SUBJECT, or DAY_AND_SUBJECT). |
| `student-attendance-per-day-periods` | Lists the numbered periods in a school day for DAY or DAY_AND_SUBJECT mode attendance. |
| `institution-class-subjects` | Lists the subjects taught in this class — needed for SUBJECT or DAY_AND_SUBJECT mode to get subject ids. |
| `institution-subjects` | Provides human-readable subject names to pair with the subject ids from institution-class-subjects. |
| `institution-student-absence-details` | Optional secondary write — records the reason or comment behind an absence when the teacher provides one. |
| `student-absence-reasons` | Reference catalog of structured absence reasons (Illness, Family emergency, Weather, etc.) for pairing with free-text comments. |
| `institution-class-attendance-records` | Month-level aggregate updated automatically by the backend after each post — do not write to this directly. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Confirm v5 endpoint only | — | All writes go to POST /api/v5/student-attendance-marked-records — never to legacy v4 paths. |
| 2 | Resolve the class | `openemis_get` | Find the institution class record matching the teacher's class for the current academic period. |
| 3 | List enrolled students | `openemis_get` | Fetch the full roster of currently enrolled students in this class. |
| 4 | Detect attendance mode | `openemis_get` | Check whether the class uses DAY, SUBJECT, or DAY_AND_SUBJECT attendance mode. |
| 5 | Resolve periods (DAY / DAY_AND_SUBJECT mode) | `openemis_get` | Get the list of numbered periods in the school day for this attendance type. |
| 6 | Resolve subjects (SUBJECT / DAY_AND_SUBJECT mode) | `openemis_get` | Get the subject ids and names for this class so each attendance row includes the correct subject. |
| 7 | Load absence types and reasons | `openemis_get` | Fetch both reference tables in parallel to support natural-language phrase mapping. |
| 8 | Build the exception list | — | Identify only the non-present students from the teacher's instruction using fuzzy name matching. |
| 9 | POST exception rows | `openemis_create` | Write one absence row per exception student per period to student-attendance-marked-records. |
| 10 | POST absence details (if reason given) | `openemis_create` | For each student where the teacher gave a reason or comment, write a row to institution-student-absence-details. |

### Step notes

**Step 4 — Detect attendance mode:** This must be done before building any rows. Call `student-attendance-mark-types` filtered by `education_grade_id` and `academic_period_id`. The `student_attendance_type_id` code tells you the mode: 1 = DAY (subject_id must be 0, period varies), 2 = SUBJECT (period always 1, subject_id is a real subject), DAY_AND_SUBJECT (both vary). Do not use institution-shift-periods — that is shift scheduling only and has no attendance fields.

**Step 8 — Build the exception list:** Fuzzy-match each name the teacher mentions case-insensitively against the roster's first_name and last_name fields. If a name could match two different students, ask the teacher to clarify before posting. Everyone not mentioned is PRESENT by omission — do not create rows for them.

**Step 9 — POST exception rows:** Submit a batch with one row per exception student per period. Each row needs: `institution_id`, `academic_period_id`, `institution_class_id`, `education_grade_id`, `date`, `period`, `subject_id`, `student_id`, `absence_type_id`, and `no_scheduled_class: 0`. The table supports upsert — posting the same composite key twice updates the existing row.

**Step 10 — POST absence details:** Use the same composite key fields as the main row, plus `comment` (free text from the teacher) and/or `student_absence_reason_id` (matched from student-absence-reasons). Example: "excused because his mother is ill" → comment = 'mother is ill', student_absence_reason_id = 1 (Illness).

---

## Example query

> "Mark everyone present in 7A today except Sam who is unexcused absent and Jordan who is late."

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English

---

## Notes

- Frontend (Angular) uses a legacy path `/institutions/{institution_id}/students/{student_id}/absences`. Agents must use the v5 routes above — they are the stable contract.
- Do NOT post to `institution-class-attendance-records` directly for marking — it is a month-level aggregate that the backend updates automatically via an afterSaveCommit hook.
- ABSENCE-BY-OMISSION: once a day/period has been marked, students without a row in `student-attendance-marked-records` for that day/period are treated as PRESENT. You only need rows for students who are late, absent, or excused.
- NO-SCHEDULED-CLASS for holidays, force-majeure, or cancelled classes: POST one row with `no_scheduled_class = 99` and no per-student rows. Sentinel 0 means class WAS scheduled and happened.
- If the teacher says "everyone present", the day remains NOT_MARKED (no rows). To mark the day as taken, post at least one row or confirm with the teacher whether any student was absent.
