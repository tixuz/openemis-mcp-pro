# Count Vacant Positions (by institution or system-wide, optionally filtered by role)

**Domain:** Staff · **Audience:** admin, hr

A position is vacant when either (a) no staff member has been assigned to it, or (b) the total FTE (full-time equivalent) across all staff on that position is less than 1.00 (100%). This captures both "nobody assigned" and "under-staffed" cases. The query can be scoped to a single institution or run across the entire system. Filter to a specific role — such as teacher — by matching against position title names.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `institution-positions` | The primary list of defined positions — each row is a slot that can be filled by one or more staff members. |
| `institution-staff-position-profiles` | Links staff members to their position assignments, used here to check whether a position has any active occupants. |
| `staff-position-titles` | The reference catalog of position titles (Teacher, Principal, etc.) — used to filter positions by role when the user asks for a specific type. |
| `institutions` | Provides institution names and codes when scoping the query to a single school or looking up an institution by name. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Resolve role title id (if filtering by role) | `openemis_get` | Get the id for the position title matching the requested role (e.g. "teacher"). |
| 2 | Fetch positions for this institution | `openemis_get` | List all positions at the target institution, optionally filtered by the resolved title id. |
| 3 | Fetch positions system-wide (if no institution given) | `openemis_get` | Paginate through all positions across the system, optionally filtered by title. |
| 4 | Fetch staff assigned to each position | `openemis_get` | For each position, retrieve staff rows to check whether anyone is assigned and what their combined FTE is. |
| 5 | Tally vacant positions | — | A position is vacant if no active staff rows exist, or if the sum of their FTE values is below 1.0. |
| 6 | Return the count | — | Report the total number of vacant positions, with optional detail on under-staffed slots and their current FTE. |

### Step notes

**Step 1 — Resolve role title id:** Call `staff-position-titles` with a limit of 200 and request only `id` and `name` fields. Then find entries whose name contains the requested role word (case-insensitive). Note the matching `id` to pass as a filter in steps 2 or 3.

**Step 4 — Fetch staff assigned to each position:** For each position id returned in steps 2 or 3, call `institution-staff` filtered by `institution_position_id`. Request `id`, `FTE`, `staff_status_id`, and `end_date`. FTE is returned as a string like `"1.00"` — parse it to a float before summing. Only count staff rows that are currently active (not end-dated or resigned).

**Step 5 — Tally vacant positions:** A position is vacant when (returned rows = 0) OR (sum of `parseFloat(row.FTE)` across active rows < 1.0). Both conditions represent a position that needs filling.

---

## Example query

> "How many teacher positions at Lincoln Primary School are vacant?"

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English

---

## Notes

- FTE is a string like `'1.00'` in the API response — parse to float before summing.
- Only consider `institution_staff` rows that are currently active — typically `staff_status_id` corresponds to an "Assigned" or "Current" code.
- Do NOT include end-dated or resigned staff in the FTE sum (they free up the position).
