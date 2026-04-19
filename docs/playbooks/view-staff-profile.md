# View a Staff Member's Full Profile

**Domain:** Staff  
**Audience:** admin, hr  
**Playbook ID:** `view-staff-profile`

## Description

View a staff member's current and historical position profiles, leave history, historical positions, and direct contact details. Combines four resources using the correct filter keys for each — there are two distinct staff identity fields (`staff_id` vs `institution_staff_id`) that must not be confused.

---

## Resources Used

| Resource | Purpose |
|---|---|
| `institution-staff-position-profiles` | FTE, status, and position assignment history at the institution |
| `institution-staff-leave` | Leave records (approved or pending) ordered most-recent first |
| `historical-staff-positions` | Archived position title history at past institutions |
| `user-contacts` | Phone numbers and email addresses (global user table) |

---

## Steps

| Step | Action | Resource | Purpose |
|---|---|---|---|
| 1 | `openemis_get` | `institution-staff-position-profiles` | Fetch current and past position profiles |
| 2 | `openemis_get` | `institution-staff-leave` | Fetch leave history |
| 3 | `openemis_get` | `historical-staff-positions` | Fetch historical position titles |
| 4 | `openemis_get` | `user-contacts` | Fetch phone/email contact details |

---

## Step Notes

**Step 1 — Position Profiles**  
Filter by `institution_staff_id` (the school-specific assignment ID, **NOT** the global `staff_id`). To find the active record, also filter `status_id=1` and look for `end_date=null`. Order by `start_date desc`.  
> ⚠️ The `FTE` field is **uppercase** in the API response (`FTE`, not `fte`). Parse as float: `parseFloat(row.FTE)`. `end_date=null` means currently active — treat `null` as "ongoing", not as empty string.

**Step 2 — Leave History**  
Filter by `staff_id` — this is the **global person ID** (FK to `security_users`), **NOT** `institution_staff_id`. Using `institution_staff_id` here will return empty results. Add `?orderby=date_from&order=desc`.  
> ⚠️ `institution-staff-leave` is **workflow-controlled** (status_id → WorkflowSteps). GET is safe; CREATE/UPDATE/DELETE must go through the official application.

**Step 3 — Historical Positions**  
Filter by `institution_id` to scope to the current institution's history. `historical-staff-positions` tracks positional titles at past institutions; it is distinct from `institution-staff-position-profiles` which tracks FTE/status changes.

**Step 4 — Contact Details**  
Filter by `security_user_id` — this is the staff member's global user ID (same FK used in step 2 as `staff_id`). Do NOT filter by `institution_staff_id` — `user-contacts` is a global user table not scoped by institution. Resolve `contact_type_id` against `/api/v5/contact-types` to display human-readable labels (e.g. "Mobile", "Email").

---

## Key Gotchas

- **Two staff identity fields:**
  - `staff_id` = global person across all schools (FK to `security_users`) — use for leave (step 2) and contacts (step 4)
  - `institution_staff_id` = that person's assignment at a specific school — use for position-profiles (step 1)
- **`FTE` is uppercase** in the API response: `row.FTE` not `row.fte`. Parse to float before displaying or computing.
- **`institution-staff-leave` is workflow-controlled.** GET is always safe. For CREATE/UPDATE/DELETE, direct the user to the official OpenEMIS application.
- **`user-contacts` covers both phone and email** in one endpoint. `contact_type_id` must be resolved via `/api/v5/contact-types` for human-readable labels.

---

## Example Query

> *"Show me everything about teacher Sarah Lee — her position, leave taken this year, and how to reach her."*

1. `openemis_get { resource: "institution-staff-position-profiles", params: { institution_staff_id: 15, status_id: 1 } }` → FTE 1.0, Teacher Grade 3
2. `openemis_get { resource: "institution-staff-leave", params: { staff_id: 88, orderby: "date_from", order: "desc" } }` → 3 leave records
3. `openemis_get { resource: "historical-staff-positions", params: { institution_id: 6 } }` → 2 past positions
4. `openemis_get { resource: "user-contacts", params: { security_user_id: 88 } }` → mobile +60-12-345-6789
