---
title: Resolve My Identity — Who Am I In OpenEMIS?
description: This OpenEMIS playbook explains how to resolve the current authenticated user's identity in the school management system, linking their login to a staff or user record.
keywords:
  - OpenEMIS
  - school management system
  - education management
  - authentication
  - per-user auth
---

# Resolve My Identity — Who Am I In OpenEMIS?

**Domain:** Auth
**Audience:** teacher, admin, staff
**Playbook ID:** `resolve-my-identity`

## Description

After a user logs in with `openemis_login({username, password})`, figure out who they are in OpenEMIS terms: their `security_users.id`, their full name, which institutions they're assigned to, and what roles/classes they hold. This is the bridge between "I just authenticated" and "show me my stuff" — without it an agent knows the username string but nothing about what that user can see, teach, or manage.

Run this right after `openemis_login` (or at the start of any session where the user refers to "my", "mine", "me"). Cache the resolved user id for the rest of the conversation — don't re-resolve on every turn.

---

## Resources Used

| Resource | Purpose |
|---|---|
| `security-users` | Resolve username → user id, first/last name, email |
| `institution-staff` | Institutions where this user is an active staff member + FTE + position |
| `institution-positions` | Resolve `staff_position_title_id` → human-readable title (teacher, principal, HR, …) |
| `institutions` | Resolve institution names from `institution_id` |
| `institution-classes` | Homeroom classes for this user (`staff_id = user.id`) |
| `institution-classes-secondary-staff` | Secondary/co-taught classes |
| `institution-subject-staff` | Subjects this user teaches (one row per (class, subject, staff)) |
| `security-group-users` | Administrative group membership (area, region, system roles) |

---

## Steps

| Step | Action | Resource | Purpose |
|---|---|---|---|
| 1 | `openemis_whoami` | — | Read the current session's username |
| 2 | `openemis_get` | `security-users` | Username → user id + first/last name |
| 3 | `openemis_get` | `institution-staff` | Which institutions am I staff at? |
| 4 | `openemis_get` | `institution-positions` | Resolve my position title per institution |
| 5 | `openemis_get` × 3 | `institution-classes` · `institution-classes-secondary-staff` · `institution-subject-staff` | Classes I teach (homeroom + secondary + subject) |
| 6 | Compose | — | Return a one-paragraph "who you are" summary |

---

## Step Notes

**Step 1 — Session check**
Call `openemis_whoami` with no arguments. If the result has `mode: "env-default"`, the user has NOT called `openemis_login` yet — the effective identity is the server's .env user, which may be admin/admin on demo instances. Warn before treating that as the "real" identity. For per-user sessions the response includes `username`.

**Step 2 — Username → user id**
`openemis_get('security-users', params: { _conditions: 'username:<username>', _fields: 'id,username,first_name,last_name,email,gender_id' })`. Returns exactly one row on a well-formed OpenEMIS instance (username is unique). Save the `id` — you'll use it everywhere below. If zero rows come back the login JWT is valid but the user record was deleted — surface this as an error.

**Step 3 — Institution assignments**
`openemis_get('institution-staff', params: { _conditions: 'staff_id:<user_id>;staff_status_id:1', _fields: 'id,institution_id,institution_position_id,FTE,start_date,end_date', limit: 200 })`. `staff_status_id=1` filters to Assigned/Active. An active teacher typically has one or two rows (home institution + optional second assignment). FTE is a decimal string ("1.00", "0.50"); parse to float if you need to sum. No rows = the user has a login but isn't assigned as staff anywhere — often the case for admin accounts.

**Step 4 — Position title**
For each distinct `institution_position_id` from step 3, fetch the position row to get its `staff_position_title_id`. Then resolve that against `staff-position-titles` to get a label like "Teacher", "Principal", "HR". Cache the title mapping per session — it rarely changes. Batch with `?ids=`:
`openemis_get('institution-positions', params: { ids: '<csv of position ids>' })`.

**Step 5 — Classes I teach (three-way fan-out)**
Classes that involve this user are spread across three tables (same shape as `view-class-profile` step 5):

(a) **Homeroom** — `openemis_get('institution-classes', params: { _conditions: 'staff_id:<user_id>;academic_period_id:<current>', _fields: 'id,name,institution_id,education_grade_id,academic_period_id' })`. `staff_id` here is the homeroom teacher FK.

(b) **Secondary/co-teacher** — `openemis_get('institution-classes-secondary-staff', params: { _conditions: 'security_user_id:<user_id>', _fields: 'id,institution_class_id' })`. Then fetch the referenced `institution-classes` rows with `?ids=`.

(c) **Subject teacher** — `openemis_get('institution-subject-staff', params: { _conditions: 'security_user_id:<user_id>', _fields: 'id,institution_class_id,institution_subject_id' })`. Fan out to resolve class names + subject names with two `?ids=` batch calls.

Union the three sets and dedupe by `institution_class_id`. A class where the user is BOTH homeroom AND subject teacher should appear once, with both roles listed.

**Step 6 — Summary**
Compose a one-paragraph answer like:

> You are **{first_name} {last_name}** (user id {id}). You are assigned as **{position_title}** at **{institution_name}**{, and also at X if multi-institution}. This academic period you have **{N}** classes: {class_1} (homeroom), {class_2} (subject: Mathematics), {class_3} (co-teacher), …

Use this summary as the implicit context for any follow-up question that says "my students", "my classes", "my institution", etc. — don't re-fetch these for every turn.

---

## Example Call Sequence

```
1. openemis_login({ username: "teacher", password: "teacher" })
   → { ok: true, username: "teacher" }

2. openemis_whoami()
   → { mode: "per-user", username: "teacher", baseUrl: "https://demo.openemis.org/core" }

3. openemis_get("security-users", {
     params: { _conditions: "username:teacher", _fields: "id,first_name,last_name,email" }
   })
   → data: [{ id: 42, first_name: "Demo", last_name: "Teacher", email: "…" }]

4. openemis_get("institution-staff", {
     params: { _conditions: "staff_id:42;staff_status_id:1",
               _fields: "institution_id,institution_position_id,FTE" }
   })
   → data: [{ institution_id: 12, institution_position_id: 57, FTE: "1.00" }]

5. openemis_get("institution-classes", {
     params: { _conditions: "staff_id:42;academic_period_id:<current>",
               _fields: "id,name,education_grade_id" }
   })
   → data: [{ id: 203, name: "Grade 4 — Section A", education_grade_id: 8 }]
```

---

## Gotchas & Notes

- **Env-default identity.** If the user skipped `openemis_login`, `openemis_whoami` returns `mode: "env-default"`. Do NOT fetch a student profile and say "this is your child" in that case — it's the server's admin / demo credentials, not the real user. Ask them to call `openemis_login` first.

- **Username case-sensitivity.** OpenEMIS `security_users.username` is case-sensitive per MySQL's default collation on most installs. Pass the exact string from `openemis_whoami`, not a lowercased copy.

- **Multi-institution users.** Principals assigned to a cluster, or teachers on dual assignment, have >1 rows in `institution-staff`. All downstream questions ("my students", "my classes") become ambiguous — ask the user which institution they mean, or list everything grouped by institution.

- **Admins & non-teaching staff.** Users whose position title is "Principal", "HR", or "Registrar" will typically have zero rows in the class-level tables (step 5). That's expected — their scope is the whole institution, not a specific class. The summary should read "You are the Principal of X" with no class list.

- **Current academic period.** Step 5 filters on `academic_period_id:<current>` — resolve `<current>` via `GET academic-periods?current=1` once per session and cache it.

- **JWT expiry.** If any step returns HTTP 401, the stored JWT has expired — the MCP will surface a "please call openemis_login again" error. This can happen after long idle periods; ask the user to re-authenticate.

- **Privacy.** The summary you compose becomes implicit context. Keep it terse (name + position + institution + class count) — don't dump email, gender, or hire date into the conversation unless the user explicitly asks.

*When to use: ask "who am I in this OpenEMIS instance" or "show my classes and institution" at the start of a session when a teacher, admin, or staff member needs to establish their identity context in the school management system.*
