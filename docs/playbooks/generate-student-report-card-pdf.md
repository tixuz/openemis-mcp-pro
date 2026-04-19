# Generate a Student's Report Card (PDF)

**Domain:** Report · **Audience:** teacher, admin

Triggers the asynchronous report card generator for one student. Returns a process id that the caller polls until the PDF is ready for download. This is a two-phase workflow: kick off generation, then wait for the status to reach "completed" before fetching the download link.

---

## Resources

| Resource | Role in this workflow |
|---|---|
| `institution-students-report-cards` | Holds the final report card record once generation completes, including the PDF download URL. |
| `institution-report-cards` | Lists the report card templates configured for the institution and academic period — the starting point for identifying which template to generate. |
| `institution-report-card-processes` | The write target for triggering generation and the poll target for checking status — each row tracks one generation job. |
| `report-card-processes` | System-level process records for report card generation jobs, used as an alternative or complementary status endpoint. |
| `report-card-email-processes` | Tracks email delivery jobs if the report card is set up to be emailed to guardians after generation. |
| `report-card-subjects` | Lists which subjects are included on the report card template — useful context before triggering generation. |
| `report-card-comment-codes` | Reference for comment codes that may appear on the generated report card (e.g., teacher narrative codes). |
| `institution-students-report-cards-comments` | Stores the teacher comments attached to this student's report card, included in the PDF output. |

---

## Steps

| # | Title | Tool | Purpose |
|---|---|---|---|
| 1 | Identify the configured report card | `openemis_get` | Find the report card template for this institution and academic period to get the report_card_id. |
| 2 | Kick off generation | `openemis_create` | POST to institution-report-card-processes to start the async PDF generation job. |
| 3 | Poll for completion | `openemis_get` | Check the process status periodically until it reaches "completed". |
| 4 | Fetch the PDF URL | `openemis_get` | Once completed, retrieve the download link from institution-students-report-cards. |

### Step notes

**Step 1 — Identify the configured report card:** Call `institution-report-cards` filtered by `institution_id` and `academic_period_id`. If multiple templates exist for the same period (e.g. one per grade), narrow by `education_grade_id` or ask the user which one to use. Note the `report_card_id` — it is required for both the generate call and the final fetch.

**Step 2 — Kick off generation:** POST to `institution-report-card-processes` with `institution_id`, `student_id`, and `report_card_id` in the body. The response includes a process id — save it for the polling step.

**Step 3 — Poll for completion:** Call `institution-report-card-processes` with the process id to check the status field. Generation is asynchronous — poll at a reasonable interval (e.g., every few seconds) until the status is "completed" or an error state is returned.

**Step 4 — Fetch the PDF URL:** Call `institution-students-report-cards` filtered by `student_id` and `report_card_id`. The completed record will contain the URL or file path for downloading the generated PDF.

---

## Example query

> "Generate a report card PDF for student Mariam for the current term."

The agent will:
1. Call `openemis_discover` or `openemis_list_playbooks` to find this playbook
2. Follow the steps above
3. Return the answer in plain English
