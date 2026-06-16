---
title: OpenEMIS MCP Pro — Referencia de Recursos para la gestión educativa
description: Referencia completa de los 678 recursos de OpenEMIS con disponibilidad de métodos HTTP y estado de escritura para el servidor MCP de lectura y escritura (Core 5.13.0).
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
  - asistencia de estudiantes
  - riesgos de estudiantes
---

# OpenEMIS MCP Pro — Referencia de Recursos para la gestión educativa

> **678 recursos** · **3361 endpoints** · v1.2.0 · OpenEMIS Core 5.13.0
>
> la distribución PRO — lectura + escritura. Los recursos controlados por workflow están bloqueados en la capa de herramienta (🔒); usa el playbook correspondiente en lugar de escritura directa.
>
> El MCP **no** carga esta tabla en el contexto de la IA. Utiliza un
> `grouped-manifest.json` compacto (~210 KB) con dominios y playbooks.
> El agente navega por dominio/playbook y obtiene los detalles del endpoint bajo demanda.

## Leyenda

| Símbolo | Significado |
|---|---|
| ✅ | Disponible |
| 🔒 | Solo workflow — usa el playbook apropiado, no escritura directa |
| — | No disponible para este recurso |

## Recursos
| Recurso | Dominio | GET | POST | PUT | DELETE | Estado de Escritura |
|---|---|:---:|:---:|:---:|:---:|---|
| **── Institution* ──** | | | | | | |
| `institution-accreditations` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-activities` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-assets` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-associations` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-association-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-association-student` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-attachments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-attachment-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-bank-accounts` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-budgets` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-buildings` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-buses` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-buses-transport-features` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-case-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-case-links` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-case-records` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-cases` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-class-attendance-records` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-classes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-classes-custom-field-values` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-classes-secondary-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-class-grades` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-class-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-class-subjects` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-committee-attachments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-committee-meeting` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-committees` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-committee-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-competency-item-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-competency-period-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-competency-results` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-contact-persons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-courses` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-curriculars` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-curricular-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-curricular-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-custom-field-options` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-custom-fields` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-custom-field-values` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-custom-forms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-custom-forms-fields` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-custom-forms-filters` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-custom-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-custom-table-columns` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-custom-table-rows` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-departments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-expenditures` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-fees` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-fee-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-floors` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-genders` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-grades` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-incomes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-infrastructure-attachments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-lands` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-localities` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-meal-programmes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-meal-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-outcome-results` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-outcome-subject-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-ownerships` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-positions` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-program-grade-subjects` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-providers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-quality-rubric-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-quality-rubrics` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-quality-visits` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-registrations` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-repeater-survey-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-repeater-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-repeater-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-report-card-processes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-report-cards` | Institution* | ✅ | ✅ | ✅ | — | ✅ v1.0.0 en vivo |
| `institution-risks` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-rooms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-scanned` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-schedule-curriculum-lessons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-schedule-intervals` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-schedule-lesson-details` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-schedule-lesson-rooms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-schedule-lessons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-schedule-non-curriculum-lessons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-schedule-terms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-schedule-timeslots` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-schedule-timetable-customizes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-schedule-timetables` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-sectors` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-shift-periods` | Institution* | ✅ | ✅ | — | — | ✅ v1.0.0 en vivo |
| `institution-shifts` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-staff-appraisals` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-staff-attendance-activities` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-staff-attendances` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-staff-duties` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-staff-leave` | Institution* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `institution-staff-leave-archived` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-staff-position-profiles` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-staff-releases` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-staff-shifts` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-staff-survey-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-staff-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-staff-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-staff-transfers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-statistics` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-statuses` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-student-absence-days` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-student-absence-details` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-student-absences` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-student-admission` | Institution* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `institution-student-enrolment` | Institution* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `institution-student-risks` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-students-gpa` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-students-report-cards` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-students-report-cards-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-students-tmp` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-student-survey-answers` | Institution* | ✅ | — | — | — | — (solo lectura) |
| `institution-student-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-student-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-student-transfers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-student-visit-requests` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-student-visits` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-student-withdraw` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-subjects` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-subjects-rooms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-subject-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-subject-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-survey-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-textbooks` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-transport-providers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-trip-days` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-trip-passengers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-trips` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-units` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institution-visit-requests` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Staff* ──** | | | | | | |
| `staff-attachment-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-behaviour-attachments` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-behaviour-categories` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-behaviours` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-change-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-custom-field-options` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-custom-fields` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-custom-field-values` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-custom-forms` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-custom-forms-fields` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-custom-table-cells` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-custom-table-columns` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-custom-table-rows` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-duties` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-employment-statuses` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-extracurriculars` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-leave-entitlements` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-leave-policies` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-leave-policy-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-leave-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-licenses` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-licenses-classifications` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-memberships` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-payslips` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-position-categories` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-position-grades` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-position-titles` | Staff* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `staff-position-titles-grades` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-profile-templates` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-qualifications` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-qualifications-specialisations` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-qualifications-subjects` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-report-card-email-processes` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-report-card-processes` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-report-cards` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-salaries` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-salary-transactions` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-statuses` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-training-applications` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-training-categories` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-training-needs` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-trainings` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-training-self-studies` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-training-self-study-attachments` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-training-self-study-results` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `staff-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Infrastructure* ──** | | | | | | |
| `infrastructure-attachment-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-conditions` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-custom-field-options` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-custom-fields` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-custom-forms` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-custom-forms-fields` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-custom-forms-filters` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-levels` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-needs` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-need-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-ownerships` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-project-funding-sources` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-projects` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-projects-needs` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-statuses` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-utility-electricities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-utility-internets` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-utility-telephones` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-hygiene-educations` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-hygiene-quantities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-hygienes` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-hygiene-soapash-availabilities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-hygiene-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-sanitation-accessibilities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-sanitation-qualities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-sanitation-quantities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-sanitations` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-sanitation-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-sanitation-uses` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-sewage-functionalities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-sewages` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-sewage-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-waste-functionalities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-wastes` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-waste-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-water-accessibilities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-water-functionalities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-water-proximities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-water-qualities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-water-quantities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-waters` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `infrastructure-wash-water-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Student* ──** | | | | | | |
| `student-absence-reasons` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-admission-custom-field-values` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-attachment-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-attendance-marked-records` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-attendance-mark-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-attendance-per-day-periods` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-attendance-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-behaviour-attachments` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-behaviour-categories` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-behaviour-classifications` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-behaviours` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-custom-field-options` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-custom-fields` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-custom-field-values` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-custom-filters` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-custom-forms` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-custom-forms-fields` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-custom-table-cells` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-custom-table-columns` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-custom-table-rows` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-extracurriculars` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-fees` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-guardians` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-mark-type-statuses` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-mark-type-status-grades` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-meal-marked-records` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-profile-security-roles` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-profile-templates` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-report-card-email-processes` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-report-card-processes` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-report-cards` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-risks-criterias` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-statuses` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-status-updates` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-transfer-reasons` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-visit-purpose-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-visit-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `student-withdraw-reasons` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── User* ──** | | | | | | |
| `user-activities` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-attachments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-attachments-roles` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-awards` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-bank-accounts` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-body-masses` | User* | ✅ | ✅ | — | — | ✅ v1.0.0 en vivo |
| `user-comments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-contacts` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-demographics` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-employments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-health-allergies` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-health-consultations` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-health-families` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-health-histories` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-health-immunizations` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-health-medications` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-healths` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-health-tests` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-identities` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-insurances` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-languages` | User* | ✅ | ✅ | — | — | ✅ v1.0.0 en vivo |
| `user-nationalities` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-special-needs-assessments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-special-needs-devices` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-special-needs-diagnostics` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-special-needs-plans` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-special-needs-referrals` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `user-special-needs-services` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Training* ──** | | | | | | |
| `training-course-categories` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-courses` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-courses-prerequisites` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-courses-providers` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-courses-result-types` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-courses-specialisations` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-courses-target-populations` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-course-types` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-field-of-studies` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-levels` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-mode-deliveries` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-need-categories` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-need-competencies` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-need-standards` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-need-sub-standards` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-priorities` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-providers` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-requirements` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-result-types` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-session-evaluators` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-session-results` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-sessions` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-sessions-trainees` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-session-trainee-results` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-session-trainers` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `training-specialisations` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Scholarship* ──** | | | | | | |
| `scholarship-application-attachments` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-application-institution-choices` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-applications` | Scholarship* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `scholarship-attachment-types` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-disbursement-categories` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-financial-assistances` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-financial-assistance-types` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-funding-sources` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-institution-choice-statuses` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-institution-choice-types` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-loans` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-payment-frequencies` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-recipient-academic-standings` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-recipient-activities` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-recipient-activity-statuses` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-recipient-collections` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-recipient-disbursements` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-recipient-payment-structure-estimates` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-recipient-payment-structures` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-recipients` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarship-semesters` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Summary* ──** | | | | | | |
| `summary-area-institution-grade-attendances` | Summary* | ✅ | ✅ | — | — | ✅ v1.0.0 en vivo |
| `summary-area-provider-grade-subject-results` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `summary-assessment-item-results` | Summary* | ✅ | ✅ | — | — | ✅ v1.0.0 en vivo |
| `summary-grade-gender-ages` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `summary-grade-status-genders` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `summary-institution-grade-nationalities` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `summary-institution-grades` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `summary-institution-nationalities` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `summary-institution-room-types` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `summary-institutions` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `summary-institution-student-absences` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `summary-institution-student-subject-results` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `summary-isced-sectors` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `summary-programme-sector-genders` | Summary* | ✅ | ✅ | — | — | ✅ v1.0.0 en vivo |
| `summary-programme-sector-qualification-genders` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `summary-programme-sector-specialization-genders` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `summary-student-assessments` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `summary-student-attendances` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Examination* ──** | | | | | | |
| `examination-centre-rooms` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-centre-rooms-examinations` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-centre-rooms-examinations-invigilators` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-centre-rooms-examinations-students` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-centres` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-centres-examinations` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-centres-examinations-institutions` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-centres-examinations-invigilators` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-centres-examinations-students` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-centres-examinations-subjects` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-centres-examinations-subjects-students` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-centre-special-needs` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-grading-options` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-grading-types` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-student-subject-results` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-student-subjects` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examination-subjects` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Appraisal* ──** | | | | | | |
| `appraisal-criterias` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-dropdown-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-dropdown-options` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-forms` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-forms-criterias` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-forms-criterias-scores` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-forms-criterias-scores-links` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-number-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-numbers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-periods` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-periods-types` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-score-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-slider-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-sliders` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-text-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `appraisal-types` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Education* ──** | | | | | | |
| `education-certifications` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-cycles` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-field-of-studies` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-grades` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-grades-cumulative-gpa` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-grades-gpa` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-grades-subjects` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-level-isced` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-levels` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-programme-orientations` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-programmes` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-programmes-next-programmes` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-stages` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-subjects` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-subjects-field-of-studies` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `education-systems` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Survey* ──** | | | | | | |
| `survey-filter-areas` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `survey-filter-institution-providers` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `survey-filter-institution-types` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `survey-forms` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `survey-forms-filters` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `survey-forms-questions` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `survey-question-choices` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `survey-questions` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `survey-responses` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `survey-rules` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `survey-statuses` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `survey-status-periods` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `survey-table-columns` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `survey-table-rows` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Security* ──** | | | | | | |
| `security-functions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `security-group-areas` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `security-group-institutions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `security-groups` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `security-group-users` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `security-rest-sessions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `security-role-functions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `security-roles` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `security-user-codes` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `security-user-logins` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `security-user-password-requests` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `security-users` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `security-user-sessions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Custom* ──** | | | | | | |
| `custom-field-options` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `custom-fields` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `custom-field-types` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `custom-field-values` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `custom-forms` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `custom-forms-fields` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `custom-forms-filters` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `custom-modules` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `custom-records` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `custom-table-cells` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `custom-table-columns` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `custom-table-rows` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Meal* ──** | | | | | | |
| `meal-benefits` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `meal-food-records` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `meal-implementers` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `meal-institution-programmes` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `meal-nutritional-records` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `meal-nutritions` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `meal-programmes` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `meal-programme-types` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `meal-ratings` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `meal-received` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `meal-status-types` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `meal-target-types` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Workflow* ──** | | | | | | |
| `workflow-actions` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `workflow-comments` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `workflow-models` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `workflow-rule-events` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `workflow-rules` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `workflow-statuses` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `workflow-statuses-steps` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `workflow-steps` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `workflow-steps-params` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `workflow-steps-roles` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `workflow-transitions` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Assessment* ──** | | | | | | |
| `assessment-grading-options` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `assessment-grading-types` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `assessment-item-results` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `assessment-item-results-archived` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `assessment-items` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `assessment-items-grading-types` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `assessment-item-student-exemptions` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `assessment-period-excluded-security-roles` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `assessment-periods` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Rubric* ──** | | | | | | |
| `rubric-criteria-options` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `rubric-criterias` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `rubric-sections` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `rubric-statuses` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `rubric-status-periods` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `rubric-status-programmes` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `rubric-status-roles` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `rubric-template-options` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `rubric-templates` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Special* ──** | | | | | | |
| `special-need-difficulties` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `special-needs-device-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `special-needs-diagnostics-degree` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `special-needs-diagnostics-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `special-needs-plan-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `special-needs-referrer-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `special-needs-service-classification` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `special-needs-service-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `special-need-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Report* ──** | | | | | | |
| `report-card-comment-codes` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `report-card-email-processes` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `report-card-excluded-security-roles` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `report-card-processes` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `report-cards` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `report-card-subjects` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `report-progress` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `report-queries` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Competency* ──** | | | | | | |
| `competency-criterias` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `competency-grading-options` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `competency-grading-types` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `competency-items` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `competency-items-periods` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `competency-periods` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `competency-templates` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Utility* ──** | | | | | | |
| `utility-electricity-conditions` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `utility-electricity-types` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `utility-internet-bandwidths` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `utility-internet-conditions` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `utility-internet-types` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `utility-telephone-conditions` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `utility-telephone-types` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Api* ──** | | | | | | |
| `api-authorizations` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `api-credentials` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `api-credentials-scopes` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `api-scopes` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `api-securities` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `api-securities-scopes` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Health* ──** | | | | | | |
| `health-allergy-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `health-conditions` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `health-consultation-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `health-immunization-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `health-relationships` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `health-test-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Asset* ──** | | | | | | |
| `asset-conditions` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `asset-makes` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `asset-models` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `asset-statuses` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `asset-types` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Outcome* ──** | | | | | | |
| `outcome-criterias` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `outcome-grading-options` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `outcome-grading-types` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `outcome-periods` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `outcome-templates` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── System* ──** | | | | | | |
| `system-authentications` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `system-errors` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `system-patches` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `system-processes` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `system-updates` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Config* ──** | | | | | | |
| `config-attachments` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `config-item-options` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `config-items` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `config-product-lists` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Data* ──** | | | | | | |
| `data-dictionary` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `data-management-connections` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `data-management-copy` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `data-management-logs` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Area* ──** | | | | | | |
| `area-administrative-levels` | Area* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `area-administratives` | Area* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `area-levels` | Area* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Calendar* ──** | | | | | | |
| `calendar-event-dates` | Calendar* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `calendar-events` | Calendar* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `calendar-types` | Calendar* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Class* ──** | | | | | | |
| `class-profile-processes` | Class* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `class-profiles` | Class* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `class-profile-templates` | Class* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Email* ──** | | | | | | |
| `email-process-attachments` | Email* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `email-processes` | Email* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `email-templates` | Email* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Idp* ──** | | | | | | |
| `idp-google` | Idp* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `idp-oauth` | Idp* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `idp-saml` | Idp* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Qualification* ──** | | | | | | |
| `qualification-levels` | Qualification* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `qualification-specialisations` | Qualification* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `qualification-titles` | Qualification* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Scholarships* ──** | | | | | | |
| `scholarships` | Scholarships* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarships-field-of-studies` | Scholarships* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `scholarships-scholarship-attachment-types` | Scholarships* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Textbook* ──** | | | | | | |
| `textbook-conditions` | Textbook* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `textbook-dimensions` | Textbook* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `textbook-statuses` | Textbook* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Academic* ──** | | | | | | |
| `academic-period-levels` | Academic* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `academic-periods` | Academic* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Alert* ──** | | | | | | |
| `alert-logs` | Alert* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `alert-rules` | Alert* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Alerts* ──** | | | | | | |
| `alerts` | Alerts* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `alerts-roles` | Alerts* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Building* ──** | | | | | | |
| `building-custom-field-values` | Building* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `building-types` | Building* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Case* ──** | | | | | | |
| `case-priorities` | Case* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `case-types` | Case* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Contact* ──** | | | | | | |
| `contact-options` | Contact* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `contact-types` | Contact* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Curricular* ──** | | | | | | |
| `curricular-positions` | Curricular* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `curricular-types` | Curricular* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Field* ──** | | | | | | |
| `field-options` | Field* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `field-types` | Field* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Floor* ──** | | | | | | |
| `floor-custom-field-values` | Floor* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `floor-types` | Floor* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Gpa* ──** | | | | | | |
| `gpa-grading-options` | Gpa* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `gpa-grading-types` | Gpa* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Historical* ──** | | | | | | |
| `historical-staff-leave` | Historical* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `historical-staff-positions` | Historical* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Income* ──** | | | | | | |
| `income-sources` | Income* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `income-types` | Income* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Insurance* ──** | | | | | | |
| `insurance-providers` | Insurance* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `insurance-types` | Insurance* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Land* ──** | | | | | | |
| `land-custom-field-values` | Land* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `land-types` | Land* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── License* ──** | | | | | | |
| `license-classifications` | License* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `license-types` | License* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Locale* ──** | | | | | | |
| `locale-contents` | Locale* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `locale-content-translations` | Locale* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Messaging* ──** | | | | | | |
| `messaging` | Messaging* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `messaging-security-roles` | Messaging* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Moodle* ──** | | | | | | |
| `moodle-api-created-users` | Moodle* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `moodle-api-log` | Moodle* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Room* ──** | | | | | | |
| `room-custom-field-values` | Room* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `room-types` | Room* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Salary* ──** | | | | | | |
| `salary-addition-types` | Salary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `salary-deduction-types` | Salary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Transport* ──** | | | | | | |
| `transport-features` | Transport* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `transport-statuses` | Transport* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Workflows* ──** | | | | | | |
| `workflows` | Workflows* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `workflows-filters` | Workflows* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| **── Task* ──** | | | | | | |
| `task-failures` | Task* | ✅ | — | — | — | — (solo lectura) |
| `task-jobs` | Task* | ✅ | — | — | — | — (solo lectura) |
| **── singletons ──** | | | | | | |
| `absence-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `areas` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `assessments` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `authentication-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `backup-logs` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `bank-branches` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `banks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `behaviour-classifications` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `budget-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `bus-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `comment-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `counsellings` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `countries` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `deleted-records` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `demographic-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `department-staff` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `employment-status-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `examinations` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `expenditure-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `external-data-source-attributes` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `extracurricular-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `feeders-institutions` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `fee-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `food-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `genders` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `guardian-relations` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `guidance-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `identity-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `import-mapping` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `industries` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `inserted-records` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `institutions` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `labels` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `language-proficiencies` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `languages` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `locales` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `manuals` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `message-recipients` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `nationalities` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `notices` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `openemis-temps` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `phinxlog` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `profile-templates` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `quality-visit-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `reports` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `risk-criterias` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `risks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `shift-options` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `single-logout` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `tasks` | — | ✅ | — | — | — | — (solo lectura) |
| `textbooks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `themes` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `transfer-logs` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `trip-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `webhook-events` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
| `webhooks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 en vivo |
