# View Full Institution Profile

**Domain:** Institution  
**Audience:** admin, parent, public  
**Playbook ID:** `view-institution-profile`

## Description

View detailed information about an institution: core record, active grades, locality, and contact persons. Steps follow the canonical order — core institution fetch first, then grades, then locality resolution, then contacts.

---

## Resources Used

| Resource | Purpose |
|---|---|
| `institutions` | Core record: name, code, address, telephone, locality_id, institution type |
| `institution-grades` | Grade levels offered by the institution in the active academic period |
| `institution-localities` | Global reference table: resolve locality_id to a human-readable name |
| `institution-contact-persons` | Named contact persons with designation, phone, mobile, and email |

---

## Steps

| Step | Action | Resource | Purpose |
|---|---|---|---|
| 1 | `openemis_get` | `institutions` | Fetch the core institution record by id, name, or code |
| 2 | `openemis_get` | `institution-grades` | List grade levels active for this institution and academic period |
| 3 | `openemis_get` | `institution-localities` | Resolve locality_id to a human-readable locality name |
| 4 | `openemis_get` | `institution-contact-persons` | List named contact persons for the institution |

---

## Step Notes

**Step 1 — Core Institution Record**  
Filter by `id`, `name`, or `code`. Always add `?is_deleted=0` to exclude soft-deleted records — `DELETE` on the institutions endpoint sets `is_deleted=1`; the row stays in the DB. The response's `locality_id` integer will be resolved in step 3. `GET /api/v5/institutions/{id}` returns more detail than the list endpoint; prefer the single-record fetch once you have the id.

**Step 2 — Active Grades Offered**  
Filter by `institution_id` (from step 1) and `academic_period_id`. Without both filters the endpoint returns a global dump. Returns an empty array if no grades are configured — that is valid for new institutions. Use `?_fields=id,education_grade_id,start_date,end_date` to trim the payload.

**Step 3 — Resolve Locality Name**  
`institution-localities` is a **GLOBAL master reference list** — it has **no** `institution_id` filter parameter. Fetch all entries (or cache once per session), then match the institution's `locality_id` to the correct row. Do NOT attempt `?institution_id=...` — that parameter is not supported on this resource and will return an empty or unfiltered result.

**Step 4 — Contact Persons**  
Filter by `institution_id`. A record with `preferred=1` is the primary contact (`preferred` is stored as tinyint 0/1, cast to boolean for display). An empty result is valid — some institutions have no separate contacts beyond the `contact_person` field on the institutions record itself.

---

## Key Gotchas

- **`is_deleted=0` is essential** on the institutions fetch — soft-deleted schools remain in the DB and will appear in list results without this filter.
- **`institution-localities` has NO institution-specific filter.** It is a standalone reference table. To find which locality an institution belongs to, read `locality_id` from the institutions record and look it up in this table.
- **`contact_person` on the institutions record is a free-text string**, NOT a FK to `security_users`. Separate, richer contact records live in `institution-contact-persons` filtered by `institution_id`.
- **Step order is intentional:** core record first (provides `locality_id` and `institution_id` for subsequent steps), then grades (depends on `institution_id`), then locality (global lookup needing only `locality_id` from step 1), then contacts (depends on `institution_id`).

---

## Example Query

> *"Show me the full profile for Avory Primary School — grades offered, locality, and who to call."*

1. `openemis_get { resource: "institutions", params: { name: "Avory Primary", is_deleted: 0 } }` → id=6, locality_id=2
2. `openemis_get { resource: "institution-grades", params: { institution_id: 6, academic_period_id: 1 } }` → grades 1–6
3. `openemis_get { resource: "institution-localities" }` → match locality_id=2 → "Selangor"
4. `openemis_get { resource: "institution-contact-persons", params: { institution_id: 6 } }` → Jane Doe, Principal
