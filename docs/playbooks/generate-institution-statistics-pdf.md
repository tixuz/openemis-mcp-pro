# Generate Institution Statistics PDF Report

**Domain:** Report · **Audience:** admin

Admin requests a summary PDF for one institution covering enrolment, staff, and attendance statistics. This playbook describes the data lookup steps; the actual PDF is generated inside the OpenEMIS application.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `institutions` | Provides the institution id and profile — the anchor for all statistics queries. |
| `report-card-processes` | System-level process records for report generation jobs — used to track the status of a statistics generation job if triggered. |
| `institution-report-card-processes` | Institution-scoped process records that track PDF generation status for this specific institution. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Identify the report template | `openemis_get` | Look up the custom report template configured for institution statistics. |
| 2 | Start generation | `openemis_create` | POST to report-card-processes with the template id and institution id to kick off PDF generation. |
| 3 | Poll and download | `openemis_get` | Check the process status periodically until the status reaches "completed", then retrieve the download link. |

### Step notes

**Step 1 — Identify the report template:** Note that `custom-reports` is not available via the v5 REST API. Statistics PDF generation uses the report engine inside the OpenEMIS application itself. This step should involve checking `report-card-processes` or `institution-report-card-processes` for available templates configured at this institution.

**Step 2 — Start generation:** If the template is accessible via the v5 API, POST to `report-card-processes` with the template id, institution id, and any date range parameters. If the template is not accessible via v5, direct the user to trigger the PDF from the application UI.

**Step 3 — Poll and download:** Once a process id is obtained, call `institution-report-card-processes` with the process id to check its status. When status reaches "completed", the response will include a URL or file path for the generated PDF.

---

## Example query

> "Generate the annual statistics PDF for Lincoln Primary School."

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English

---

## Notes

NOTE: `custom-reports` is not available via the v5 REST API. Statistics PDF generation uses the report engine inside the application. This playbook covers data lookup only — trigger the PDF from the application UI.
