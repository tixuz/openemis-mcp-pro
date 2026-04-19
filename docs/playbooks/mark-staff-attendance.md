# Mark Staff Attendance (Present) OR Request Leave (Absent)

**Domain:** Staff · **Audience:** admin, hr, teacher

Two distinct flows — do not mix them. **PRESENT** is a quick check-in with optional time-in/time-out recorded via `institution-staff-attendances` (simple id primary key, no approval required). **ABSENT** means a leave request with a leave type, recorded via `institution-staff-leave`, which is workflow-controlled and requires supervisor approval before taking effect. These write to different tables and follow completely different processes.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `institution-staff-position-profiles` | Used to look up a staff member's current assignment and confirm they are active at the institution before recording attendance. |
| `institution-staff-attendances` | The write target for present check-ins — records the date, time in, optional time out, and any comment. No approval chain required. |
| `institution-staff-leave` | The write target for leave requests — requires a leave type and goes through the workflow approval chain. Read operations are always safe. |
| `staff-leave-types` | Reference catalog of leave types (Annual Leave, Sick Leave, etc.) — used to identify the correct leave type id when a leave request is being prepared. |
| `absence-types` | Reference table for absence codes — useful when recording an optional absence note alongside a staff attendance record. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Confirm v5 endpoint only | — | Present check-ins go to POST /api/v5/institution-staff-attendances; leave requests to POST /api/v5/institution-staff-leave. Never use legacy v4 paths. |
| 2 | List active staff at the institution | `openemis_get` | Fetch staff filtered by institution_id and status_id=1 to confirm the staff member's id. |
| 3 | Record present check-in | `openemis_create` | POST to institution-staff-attendances with staff_id, institution_id, academic_period_id, date, and time_in. |
| 4 | Handle leave request (absent) | — | For absence/leave, do NOT create via MCP — institution-staff-leave is workflow-controlled and requires human approval. Redirect the user to the official OpenEMIS application. |

### Step notes

**Step 3 — Record present check-in:** The body requires `staff_id`, `institution_id`, `academic_period_id`, `date` (YYYY-MM-DD), and `time_in` (HH:MM:SS). `time_out` and `comment` are optional. This writes directly to `institution-staff-attendances` with no approval step.

**Step 4 — Handle leave request:** When a user asks to mark a staff member as absent on leave, do NOT attempt to create an `institution-staff-leave` record via the MCP. Leave is workflow-controlled — a fresh POST lands in the configured initial workflow state and requires supervisor approval through the application. Respond with: "This process involves workflow and assignment for approval. Please use the official OpenEMIS application or website to submit and approve leave." You may safely read `staff-leave-types` to show the user their leave type options.

---

## Example query

> "Mark Ms. Ashton as checked in today at 8:30 AM."

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English

---

## Notes

- There is no v5 alias `staff-leaves` — use `institution-staff-leave` (singular, institution-prefixed).
- LEAVE and ATTENDANCE ARE FULLY DECOUPLED: creating a leave row does NOT auto-insert an "absent" row into institution-staff-attendances, and posting an attendance record does NOT check for overlapping leave. Before posting attendance, check institution-staff-leave for that date to avoid conflicts.
- To read a staff member's full attendance picture, you must union institution-staff-attendances and institution-staff-leave on the client side — the backend does not join them.
- For historical or migrated leave records, see `historical-staff-leave` and `institution-staff-leave-archived` — these are read-only reference resources.
- WORKFLOW WRITE WARNING: institution-staff-leave is workflow-controlled. The MCP must NOT create, update, or delete leave requests. Reading leave via openemis_get is always safe.
