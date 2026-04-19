# View Institution Risk Summary and Alert Rules

**Domain:** Institution  
**Audience:** admin, ministry  
**Playbook ID:** `view-institution-risks`

## Description

View which risks are configured for an institution, the alert rules that fire when thresholds are crossed, and recent alert delivery logs. `institution-risks` has a composite PK (`risk_id` + `institution_id`) — no integer `id` field. Alerts link to AlertRules via a **string name↔feature binding**, not an integer FK.

---

## Resources Used

| Resource | Purpose |
|---|---|
| `institution-risks` | Which risk types are configured for this institution (composite PK) |
| `risks` | Master risk definitions with names and academic period scope |
| `risk-criterias` | Threshold values and weights for each criterion |
| `alerts` | Alert definitions — what events trigger notifications |
| `alert-rules` | Notification rules — enabled/disabled, method, threshold, recipient roles |
| `alert-logs` | Recent alert delivery history with success/failure status |

---

## Steps

| Step | Action | Resource | Purpose |
|---|---|---|---|
| 1 | `openemis_get` | `institution-risks` | List risk types configured for this institution |
| 2 | `openemis_get` | `risks` + `risk-criterias` | Resolve risk names and threshold criteria |
| 3 | `openemis_get` | `alerts` | List alert definitions |
| 4 | `openemis_get` | `alert-rules` | View notification rules and enabled status |
| 5 | `openemis_get` | `alert-logs` | Check recent alert delivery history |

---

## Step Notes

**Step 1 — Institution Risk Configuration**  
Filter by `institution_id`.

> ⚠️ **Composite PK:** `institution-risks` has **no integer `id` column**. Primary key is (`risk_id` + `institution_id`). Never query by a bare `id=` parameter — it will return empty or wrong results.

`academic_period_id` is not stored on this table — period scoping is done via the `risks` master table. Resolve `risk_id` in step 2.

**Step 2 — Risk Definitions and Criteria**  
Filter `risks` by `academic_period_id` — **required, cannot be empty**. Then fetch `risk-criterias` filtered by `risk_id` to get `risk_value` (range 1–99, validated) and `threshold`. The `threshold` field uses a custom `checkCriteriaThresholdRange()` validator — text or numeric depending on risk type.

**Step 3 — Alert Definitions**  
No `institution_id` or `academic_period_id` filter on `alerts`.

> ⚠️ **Non-standard join:** `alerts.name` ↔ `alert_rules.feature` is a **string match**, not an integer FK. Do not attempt `?alert_rule_id=...` on the alerts endpoint — that parameter does not exist. Fetch `alert-rules` separately and join by matching `alerts.name` to `alert_rules.feature`.

**Step 4 — Alert Rules**  
No `institution_id` or `academic_period_id` filter. Key fields:
- `enabled` (0/1) — whether this rule is active
- `method` — notification method (e.g. "Email")
- `feature` — join key back to `alerts.name`
- `threshold` — the condition value that triggers the alert
- `security_roles` — populated via `alerts-roles` join table (composite PK: `alert_rule_id` + `security_role_id`, no integer `id`)

**Step 5 — Alert Delivery Logs**  
No `institution_id` or `academic_period_id` filter. Filter by `feature` to scope to a specific alert type, or `status=-1` to find failed deliveries. Status values: `0` = Pending, `1` = Success, `-1` = Failed. The `checksum` field is used for deduplication.

---

## Key Gotchas

- **`institution-risks` composite PK: (`risk_id` + `institution_id`)** — no integer `id`. Never use `id=` on this resource.
- **`alerts-roles` is also composite PK** (`alert_rule_id` + `security_role_id`) — no integer `id`.
- **alerts↔alert-rules join is by string:** `alerts.name` = `alert_rules.feature`. This is the most non-obvious relationship in this domain.
- **`risks.academic_period_id` is mandatory** — the resource validates it cannot be empty.
- **`alert-logs.status` values:** 0 = Pending, 1 = Success, −1 = Failed.

---

## Example Query

> *"What risks is Avory Primary configured for, and have any alerts fired recently?"*

1. `openemis_get { resource: "institution-risks", params: { institution_id: 6 } }` → risk_id: 1, risk_id: 2
2. `openemis_get { resource: "risks", params: { academic_period_id: 1 } }` → "Attendance Risk", "Academic Performance Risk"
3. `openemis_get { resource: "alerts" }` → 3 alert definitions (names: "LowAttendance", "HighAbsence", "FailingGrade")
4. `openemis_get { resource: "alert-rules", params: { } }` → "LowAttendance" rule: enabled=1, method=Email, threshold=75
5. `openemis_get { resource: "alert-logs", params: { feature: "LowAttendance" } }` → 4 emails sent (status=1), 1 failed (status=-1) last week
