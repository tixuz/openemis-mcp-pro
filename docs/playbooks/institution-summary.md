---
title: Institution Summary — Students, Staff, and Vacant Positions in OpenEMIS
description: This OpenEMIS playbook explains how to get a quick summary of an institution's student count, staff count, and vacant positions from the school management system.
keywords:
  - OpenEMIS
  - school management system
  - institution
  - education management
  - staff
---

# Institution Summary in OpenEMIS — Counts of Students, Staff, and Vacant Positions

**Domain:** Institution · **Audience:** admin, parent

The classic "tell me about this school" query. A single institution lookup followed by three count calls using pagination metadata to get totals without downloading every record.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `institutions` | Resolves the institution name or code to a record id and provides the school's basic profile information. |
| `institution-students` | Provides the total count of currently enrolled students by reading the pagination metadata (last_page) rather than downloading all records. |
| `institution-staff-position-profiles` | Used to count active staff at the institution via the same pagination approach. |
| `institution-positions` | Provides the count of vacant positions at the institution. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Resolve institution | `openemis_get` | Look up the institution by name to get its id and basic profile. |
| 2 | Count current students | `openemis_get` | Fetch one student row to read the last_page value, which equals the total current enrolment. |
| 3 | Count active staff | `openemis_get` | Fetch one staff row to read the last_page value, which equals the total active staff count. |
| 4 | Count vacant positions | `openemis_get` | Fetch one position row filtered by vacant status to read the last_page count. |

### Step notes

**Step 1 — Resolve institution:** Call `institutions` filtered by `name` (e.g. "Avory Primary"), requesting only `id`, `name`, and `code` fields. Note the `institution_id` — it is the filter key for all subsequent calls.

**Step 2 — Count current students:** Call `institution-students` with `institution_id`, `student_status_id=1`, and `limit=1`. The response's `last_page` field (or equivalent pagination total) equals the total number of currently enrolled students. You do not need to paginate through all records.

**Step 3 — Count active staff:** Call `institution-staff` with `institution_id`, `status_id=1`, and `limit=1`. Read `last_page` for the total active staff count.

**Step 4 — Count vacant positions:** Call `institution-positions` with `institution_id`, `status='vacant'`, and `limit=1`. Read `last_page` for the total vacant position count.

---

## Example query

> "Give me a summary of Avory Primary School — how many students, staff, and vacant positions?"

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English

*When to use: ask "tell me about this school" or "how many students and staff are at this institution" when an admin or parent wants a quick school management summary from OpenEMIS.*
