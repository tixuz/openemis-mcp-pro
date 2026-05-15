# OpenEMIS MCP — Resource Reference

> **675 resources** · **3355 endpoints** · v1.1.0 · OpenEMIS Core 5.10.0
>
> This is the PRO distribution — read + write. Workflow-controlled resources are blocked at the tool layer (🔒); use the appropriate playbook instead.
>
> The MCP does **not** load this table into AI context. It uses a compact
> `grouped-manifest.json` (~210 KB) with domain buckets + playbooks.
> The agent navigates by domain/playbook and pulls endpoint details on demand.

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Available |
| 🔒 | Workflow-only — use the appropriate playbook, not a direct write |
| — | Not available for this resource |

## Resources
| Resource | Domain | GET | POST | PUT | DELETE | Write Status |
|---|---|:---:|:---:|:---:|:---:|---|
| **── Institution* ──** | | | | | | |
| `institution-accreditations` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-activities` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-assets` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-associations` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-association-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-association-student` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-attachments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-attachment-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-bank-accounts` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-budgets` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-buildings` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-buses` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-buses-transport-features` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-case-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-case-links` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-case-records` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-cases` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-class-attendance-records` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-classes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-classes-custom-field-values` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-classes-secondary-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-class-grades` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-class-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-class-subjects` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-committee-attachments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-committee-meeting` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-committees` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-committee-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-competency-item-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-competency-period-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-competency-results` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-contact-persons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-courses` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-curriculars` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-curricular-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-curricular-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-custom-field-options` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-custom-fields` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-custom-field-values` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-custom-forms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-custom-forms-fields` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-custom-forms-filters` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-custom-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-custom-table-columns` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-custom-table-rows` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-departments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-expenditures` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-fees` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-fee-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-floors` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-genders` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-grades` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-incomes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-infrastructure-attachments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-lands` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-localities` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-meal-programmes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-meal-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-outcome-results` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-outcome-subject-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-ownerships` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-positions` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-program-grade-subjects` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-providers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-quality-rubric-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-quality-rubrics` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-quality-visits` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-registrations` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-repeater-survey-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-repeater-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-repeater-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-report-card-processes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-report-cards` | Institution* | ✅ | ✅ | ✅ | — | ✅ v1.0.0 live |
| `institution-risks` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-rooms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-scanned` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-schedule-curriculum-lessons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-schedule-intervals` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-schedule-lesson-details` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-schedule-lesson-rooms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-schedule-lessons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-schedule-non-curriculum-lessons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-schedule-terms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-schedule-timeslots` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-schedule-timetable-customizes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-schedule-timetables` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-sectors` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-shift-periods` | Institution* | ✅ | ✅ | — | — | ✅ v1.0.0 live |
| `institution-shifts` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-staff-appraisals` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-staff-attendance-activities` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-staff-attendances` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-staff-duties` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-staff-leave` | Institution* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `institution-staff-leave-archived` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-staff-position-profiles` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-staff-releases` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-staff-shifts` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-staff-survey-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-staff-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-staff-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-staff-transfers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-statistics` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-statuses` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-student-absence-days` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-student-absence-details` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-student-absences` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-student-admission` | Institution* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `institution-student-enrolment` | Institution* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `institution-student-risks` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-students-gpa` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-students-report-cards` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-students-report-cards-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-students-tmp` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-student-survey-answers` | Institution* | ✅ | — | — | — | — (read-only) |
| `institution-student-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-student-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-student-transfers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-student-visit-requests` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-student-visits` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-student-withdraw` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-subjects` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-subjects-rooms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-subject-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-subject-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-survey-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-textbooks` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-transport-providers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-trip-days` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-trip-passengers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-trips` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-units` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institution-visit-requests` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Staff* ──** | | | | | | |
| `staff-attachment-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-behaviour-attachments` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-behaviour-categories` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-behaviours` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-change-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-custom-field-options` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-custom-fields` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-custom-field-values` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-custom-forms` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-custom-forms-fields` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-custom-table-cells` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-custom-table-columns` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-custom-table-rows` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-duties` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-employment-statuses` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-extracurriculars` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-leave-entitlements` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-leave-policies` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-leave-policy-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-leave-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-licenses` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-licenses-classifications` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-memberships` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-payslips` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-position-categories` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-position-grades` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-position-titles` | Staff* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `staff-position-titles-grades` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-profile-templates` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-qualifications` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-qualifications-specialisations` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-qualifications-subjects` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-report-card-email-processes` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-report-card-processes` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-report-cards` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-salaries` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-salary-transactions` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-statuses` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-training-applications` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-training-categories` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-training-needs` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-trainings` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-training-self-studies` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-training-self-study-attachments` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-training-self-study-results` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `staff-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Infrastructure* ──** | | | | | | |
| `infrastructure-attachment-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-conditions` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-custom-field-options` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-custom-fields` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-custom-forms` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-custom-forms-fields` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-custom-forms-filters` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-levels` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-needs` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-need-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-ownerships` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-project-funding-sources` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-projects` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-projects-needs` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-statuses` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-utility-electricities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-utility-internets` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-utility-telephones` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-hygiene-educations` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-hygiene-quantities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-hygienes` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-hygiene-soapash-availabilities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-hygiene-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-sanitation-accessibilities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-sanitation-qualities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-sanitation-quantities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-sanitations` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-sanitation-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-sanitation-uses` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-sewage-functionalities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-sewages` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-sewage-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-waste-functionalities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-wastes` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-waste-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-water-accessibilities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-water-functionalities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-water-proximities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-water-qualities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-water-quantities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-waters` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `infrastructure-wash-water-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Student* ──** | | | | | | |
| `student-absence-reasons` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-admission-custom-field-values` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-attachment-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-attendance-marked-records` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-attendance-mark-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-attendance-per-day-periods` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-attendance-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-behaviour-attachments` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-behaviour-categories` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-behaviour-classifications` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-behaviours` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-custom-field-options` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-custom-fields` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-custom-field-values` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-custom-filters` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-custom-forms` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-custom-forms-fields` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-custom-table-cells` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-custom-table-columns` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-custom-table-rows` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-extracurriculars` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-fees` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-guardians` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-mark-type-statuses` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-mark-type-status-grades` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-meal-marked-records` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-profile-security-roles` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-profile-templates` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-report-card-email-processes` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-report-card-processes` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-report-cards` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-risks-criterias` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-statuses` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-status-updates` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-transfer-reasons` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-visit-purpose-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-visit-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `student-withdraw-reasons` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── User* ──** | | | | | | |
| `user-activities` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-attachments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-attachments-roles` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-awards` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-bank-accounts` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-body-masses` | User* | ✅ | ✅ | — | — | ✅ v1.0.0 live |
| `user-comments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-contacts` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-demographics` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-employments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-health-allergies` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-health-consultations` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-health-families` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-health-histories` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-health-immunizations` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-health-medications` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-healths` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-health-tests` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-identities` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-insurances` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-languages` | User* | ✅ | ✅ | — | — | ✅ v1.0.0 live |
| `user-nationalities` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-special-needs-assessments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-special-needs-devices` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-special-needs-diagnostics` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-special-needs-plans` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-special-needs-referrals` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `user-special-needs-services` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Training* ──** | | | | | | |
| `training-course-categories` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-courses` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-courses-prerequisites` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-courses-providers` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-courses-result-types` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-courses-specialisations` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-courses-target-populations` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-course-types` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-field-of-studies` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-levels` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-mode-deliveries` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-need-categories` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-need-competencies` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-need-standards` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-need-sub-standards` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-priorities` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-providers` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-requirements` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-result-types` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-session-evaluators` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-session-results` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-sessions` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-sessions-trainees` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-session-trainee-results` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-session-trainers` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `training-specialisations` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Scholarship* ──** | | | | | | |
| `scholarship-application-attachments` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-application-institution-choices` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-applications` | Scholarship* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `scholarship-attachment-types` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-disbursement-categories` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-financial-assistances` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-financial-assistance-types` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-funding-sources` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-institution-choice-statuses` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-institution-choice-types` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-loans` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-payment-frequencies` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-recipient-academic-standings` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-recipient-activities` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-recipient-activity-statuses` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-recipient-collections` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-recipient-disbursements` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-recipient-payment-structure-estimates` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-recipient-payment-structures` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-recipients` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarship-semesters` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Summary* ──** | | | | | | |
| `summary-area-institution-grade-attendances` | Summary* | ✅ | ✅ | — | — | ✅ v1.0.0 live |
| `summary-area-provider-grade-subject-results` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `summary-assessment-item-results` | Summary* | ✅ | ✅ | — | — | ✅ v1.0.0 live |
| `summary-grade-gender-ages` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `summary-grade-status-genders` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `summary-institution-grade-nationalities` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `summary-institution-grades` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `summary-institution-nationalities` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `summary-institution-room-types` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `summary-institutions` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `summary-institution-student-absences` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `summary-institution-student-subject-results` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `summary-isced-sectors` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `summary-programme-sector-genders` | Summary* | ✅ | ✅ | — | — | ✅ v1.0.0 live |
| `summary-programme-sector-qualification-genders` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `summary-programme-sector-specialization-genders` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `summary-student-assessments` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `summary-student-attendances` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Examination* ──** | | | | | | |
| `examination-centre-rooms` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-centre-rooms-examinations` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-centre-rooms-examinations-invigilators` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-centre-rooms-examinations-students` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-centres` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-centres-examinations` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-centres-examinations-institutions` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-centres-examinations-invigilators` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-centres-examinations-students` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-centres-examinations-subjects` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-centres-examinations-subjects-students` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-centre-special-needs` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-grading-options` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-grading-types` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-student-subject-results` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-student-subjects` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examination-subjects` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Appraisal* ──** | | | | | | |
| `appraisal-criterias` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-dropdown-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-dropdown-options` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-forms` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-forms-criterias` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-forms-criterias-scores` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-forms-criterias-scores-links` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-number-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-numbers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-periods` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-periods-types` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-score-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-slider-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-sliders` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-text-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `appraisal-types` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Education* ──** | | | | | | |
| `education-certifications` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-cycles` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-field-of-studies` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-grades` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-grades-cumulative-gpa` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-grades-gpa` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-grades-subjects` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-level-isced` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-levels` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-programme-orientations` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-programmes` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-programmes-next-programmes` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-stages` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-subjects` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-subjects-field-of-studies` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `education-systems` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Survey* ──** | | | | | | |
| `survey-filter-areas` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `survey-filter-institution-providers` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `survey-filter-institution-types` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `survey-forms` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `survey-forms-filters` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `survey-forms-questions` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `survey-question-choices` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `survey-questions` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `survey-responses` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `survey-rules` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `survey-statuses` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `survey-status-periods` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `survey-table-columns` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `survey-table-rows` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Security* ──** | | | | | | |
| `security-functions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `security-group-areas` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `security-group-institutions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `security-groups` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `security-group-users` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `security-rest-sessions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `security-role-functions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `security-roles` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `security-user-codes` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `security-user-logins` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `security-user-password-requests` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `security-users` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `security-user-sessions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Custom* ──** | | | | | | |
| `custom-field-options` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `custom-fields` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `custom-field-types` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `custom-field-values` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `custom-forms` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `custom-forms-fields` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `custom-forms-filters` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `custom-modules` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `custom-records` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `custom-table-cells` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `custom-table-columns` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `custom-table-rows` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Meal* ──** | | | | | | |
| `meal-benefits` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `meal-food-records` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `meal-implementers` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `meal-institution-programmes` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `meal-nutritional-records` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `meal-nutritions` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `meal-programmes` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `meal-programme-types` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `meal-ratings` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `meal-received` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `meal-status-types` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `meal-target-types` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Workflow* ──** | | | | | | |
| `workflow-actions` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `workflow-comments` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `workflow-models` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `workflow-rule-events` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `workflow-rules` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `workflow-statuses` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `workflow-statuses-steps` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `workflow-steps` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `workflow-steps-params` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `workflow-steps-roles` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `workflow-transitions` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Assessment* ──** | | | | | | |
| `assessment-grading-options` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `assessment-grading-types` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `assessment-item-results` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `assessment-item-results-archived` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `assessment-items` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `assessment-items-grading-types` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `assessment-item-student-exemptions` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `assessment-period-excluded-security-roles` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `assessment-periods` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Rubric* ──** | | | | | | |
| `rubric-criteria-options` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `rubric-criterias` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `rubric-sections` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `rubric-statuses` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `rubric-status-periods` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `rubric-status-programmes` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `rubric-status-roles` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `rubric-template-options` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `rubric-templates` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Special* ──** | | | | | | |
| `special-need-difficulties` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `special-needs-device-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `special-needs-diagnostics-degree` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `special-needs-diagnostics-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `special-needs-plan-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `special-needs-referrer-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `special-needs-service-classification` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `special-needs-service-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `special-need-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Report* ──** | | | | | | |
| `report-card-comment-codes` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `report-card-email-processes` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `report-card-excluded-security-roles` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `report-card-processes` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `report-cards` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `report-card-subjects` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `report-progress` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `report-queries` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Competency* ──** | | | | | | |
| `competency-criterias` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `competency-grading-options` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `competency-grading-types` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `competency-items` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `competency-items-periods` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `competency-periods` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `competency-templates` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Utility* ──** | | | | | | |
| `utility-electricity-conditions` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `utility-electricity-types` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `utility-internet-bandwidths` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `utility-internet-conditions` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `utility-internet-types` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `utility-telephone-conditions` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `utility-telephone-types` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Api* ──** | | | | | | |
| `api-authorizations` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `api-credentials` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `api-credentials-scopes` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `api-scopes` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `api-securities` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `api-securities-scopes` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Health* ──** | | | | | | |
| `health-allergy-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `health-conditions` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `health-consultation-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `health-immunization-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `health-relationships` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `health-test-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Asset* ──** | | | | | | |
| `asset-conditions` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `asset-makes` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `asset-models` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `asset-statuses` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `asset-types` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Outcome* ──** | | | | | | |
| `outcome-criterias` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `outcome-grading-options` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `outcome-grading-types` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `outcome-periods` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `outcome-templates` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── System* ──** | | | | | | |
| `system-authentications` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `system-errors` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `system-patches` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `system-processes` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `system-updates` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Config* ──** | | | | | | |
| `config-attachments` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `config-item-options` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `config-items` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `config-product-lists` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Data* ──** | | | | | | |
| `data-dictionary` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `data-management-connections` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `data-management-copy` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `data-management-logs` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Area* ──** | | | | | | |
| `area-administrative-levels` | Area* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `area-administratives` | Area* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `area-levels` | Area* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Calendar* ──** | | | | | | |
| `calendar-event-dates` | Calendar* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `calendar-events` | Calendar* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `calendar-types` | Calendar* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Class* ──** | | | | | | |
| `class-profile-processes` | Class* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `class-profiles` | Class* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `class-profile-templates` | Class* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Email* ──** | | | | | | |
| `email-process-attachments` | Email* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `email-processes` | Email* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `email-templates` | Email* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Idp* ──** | | | | | | |
| `idp-google` | Idp* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `idp-oauth` | Idp* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `idp-saml` | Idp* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Qualification* ──** | | | | | | |
| `qualification-levels` | Qualification* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `qualification-specialisations` | Qualification* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `qualification-titles` | Qualification* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Scholarships* ──** | | | | | | |
| `scholarships` | Scholarships* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarships-field-of-studies` | Scholarships* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `scholarships-scholarship-attachment-types` | Scholarships* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Textbook* ──** | | | | | | |
| `textbook-conditions` | Textbook* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `textbook-dimensions` | Textbook* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `textbook-statuses` | Textbook* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Academic* ──** | | | | | | |
| `academic-period-levels` | Academic* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `academic-periods` | Academic* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Alert* ──** | | | | | | |
| `alert-logs` | Alert* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `alert-rules` | Alert* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Alerts* ──** | | | | | | |
| `alerts` | Alerts* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `alerts-roles` | Alerts* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Building* ──** | | | | | | |
| `building-custom-field-values` | Building* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `building-types` | Building* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Case* ──** | | | | | | |
| `case-priorities` | Case* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `case-types` | Case* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Contact* ──** | | | | | | |
| `contact-options` | Contact* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `contact-types` | Contact* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Curricular* ──** | | | | | | |
| `curricular-positions` | Curricular* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `curricular-types` | Curricular* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Field* ──** | | | | | | |
| `field-options` | Field* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `field-types` | Field* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Floor* ──** | | | | | | |
| `floor-custom-field-values` | Floor* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `floor-types` | Floor* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Gpa* ──** | | | | | | |
| `gpa-grading-options` | Gpa* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `gpa-grading-types` | Gpa* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Historical* ──** | | | | | | |
| `historical-staff-leave` | Historical* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `historical-staff-positions` | Historical* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Income* ──** | | | | | | |
| `income-sources` | Income* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `income-types` | Income* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Insurance* ──** | | | | | | |
| `insurance-providers` | Insurance* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `insurance-types` | Insurance* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Land* ──** | | | | | | |
| `land-custom-field-values` | Land* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `land-types` | Land* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── License* ──** | | | | | | |
| `license-classifications` | License* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `license-types` | License* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Locale* ──** | | | | | | |
| `locale-contents` | Locale* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `locale-content-translations` | Locale* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Messaging* ──** | | | | | | |
| `messaging` | Messaging* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `messaging-security-roles` | Messaging* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Moodle* ──** | | | | | | |
| `moodle-api-created-users` | Moodle* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `moodle-api-log` | Moodle* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Room* ──** | | | | | | |
| `room-custom-field-values` | Room* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `room-types` | Room* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Salary* ──** | | | | | | |
| `salary-addition-types` | Salary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `salary-deduction-types` | Salary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Transport* ──** | | | | | | |
| `transport-features` | Transport* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `transport-statuses` | Transport* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── Workflows* ──** | | | | | | |
| `workflows` | Workflows* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `workflows-filters` | Workflows* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| **── singletons ──** | | | | | | |
| `absence-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `areas` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `assessments` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `authentication-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `backup-logs` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `bank-branches` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `banks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `behaviour-classifications` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `budget-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `bus-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `comment-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `counsellings` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `countries` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `deleted-records` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `demographic-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `department-staff` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `employment-status-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `examinations` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `expenditure-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `external-data-source-attributes` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `extracurricular-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `feeders-institutions` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `fee-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `food-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `genders` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `guardian-relations` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `guidance-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `identity-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `import-mapping` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `industries` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `inserted-records` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `institutions` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `labels` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `language-proficiencies` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `languages` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `locales` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `manuals` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `message-recipients` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `nationalities` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `notices` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `openemis-temps` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `phinxlog` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `profile-templates` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `quality-visit-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `reports` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `risk-criterias` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `risks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `shift-options` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `single-logout` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `textbooks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `themes` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `transfer-logs` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `trip-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `webhook-events` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
| `webhooks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 live |
