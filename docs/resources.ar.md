# OpenEMIS MCP — مرجع الموارد

> **675 موردًا** · **3355 نقطة نهاية** · v1.1.0 · OpenEMIS Core 5.10.0
>
> التوزيع الاحترافي — قراءة + كتابة. الموارد التي يتحكم بها workflow محظورة على طبقة الأداة (🔒)؛ استخدم playbook المناسب بدلاً من الكتابة المباشرة.
>
> لا يقوم MCP بتحميل هذا الجدول إلى سياق الذكاء الاصطناعي. بل يستخدم ملفًا مضغوطًا
> `grouped-manifest.json` (~210 KB) مع حزم المجالات و playbooks.
> ينتقل الوكيل عبر المجال/الـ playbook ويسحب تفاصيل نقطة النهاية عند الطلب.

## وسائل الإيضاح

| الرمز | المعنى |
|---|---|
| ✅ | متاح |
| 🔒 | workflow فقط — استخدم الـ playbook المناسب، وليس الكتابة المباشرة |
| — | غير متاح لهذا المورد |

## الموارد
| المورد | المجال | GET | POST | PUT | DELETE | حالة الكتابة |
|---|---|:---:|:---:|:---:|:---:|---|
| **── Institution* ──** | | | | | | |
| `institution-accreditations` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-activities` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-assets` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-associations` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-association-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-association-student` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-attachments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-attachment-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-bank-accounts` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-budgets` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-buildings` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-buses` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-buses-transport-features` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-case-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-case-links` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-case-records` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-cases` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-class-attendance-records` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-classes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-classes-custom-field-values` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-classes-secondary-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-class-grades` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-class-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-class-subjects` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-committee-attachments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-committee-meeting` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-committees` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-committee-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-competency-item-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-competency-period-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-competency-results` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-contact-persons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-courses` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-curriculars` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-curricular-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-curricular-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-custom-field-options` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-custom-fields` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-custom-field-values` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-custom-forms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-custom-forms-fields` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-custom-forms-filters` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-custom-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-custom-table-columns` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-custom-table-rows` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-departments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-expenditures` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-fees` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-fee-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-floors` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-genders` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-grades` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-incomes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-infrastructure-attachments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-lands` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-localities` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-meal-programmes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-meal-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-outcome-results` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-outcome-subject-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-ownerships` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-positions` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-program-grade-subjects` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-providers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-quality-rubric-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-quality-rubrics` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-quality-visits` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-registrations` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-repeater-survey-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-repeater-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-repeater-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-report-card-processes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-report-cards` | Institution* | ✅ | ✅ | ✅ | — | ✅ v1.0.0 مباشر |
| `institution-risks` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-rooms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-scanned` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-schedule-curriculum-lessons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-schedule-intervals` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-schedule-lesson-details` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-schedule-lesson-rooms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-schedule-lessons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-schedule-non-curriculum-lessons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-schedule-terms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-schedule-timeslots` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-schedule-timetable-customizes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-schedule-timetables` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-sectors` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-shift-periods` | Institution* | ✅ | ✅ | — | — | ✅ v1.0.0 مباشر |
| `institution-shifts` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-staff-appraisals` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-staff-attendance-activities` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-staff-attendances` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-staff-duties` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-staff-leave` | Institution* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `institution-staff-leave-archived` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-staff-position-profiles` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-staff-releases` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-staff-shifts` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-staff-survey-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-staff-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-staff-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-staff-transfers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-statistics` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-statuses` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-student-absence-days` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-student-absence-details` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-student-absences` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-student-admission` | Institution* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `institution-student-enrolment` | Institution* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `institution-student-risks` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-students-gpa` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-students-report-cards` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-students-report-cards-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-students-tmp` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-student-survey-answers` | Institution* | ✅ | — | — | — | — (للقراءة فقط) |
| `institution-student-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-student-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-student-transfers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-student-visit-requests` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-student-visits` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-student-withdraw` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-subjects` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-subjects-rooms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-subject-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-subject-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-survey-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-textbooks` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-transport-providers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-trip-days` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-trip-passengers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-trips` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-units` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institution-visit-requests` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Staff* ──** | | | | | | |
| `staff-attachment-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-behaviour-attachments` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-behaviour-categories` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-behaviours` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-change-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-custom-field-options` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-custom-fields` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-custom-field-values` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-custom-forms` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-custom-forms-fields` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-custom-table-cells` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-custom-table-columns` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-custom-table-rows` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-duties` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-employment-statuses` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-extracurriculars` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-leave-entitlements` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-leave-policies` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-leave-policy-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-leave-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-licenses` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-licenses-classifications` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-memberships` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-payslips` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-position-categories` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-position-grades` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-position-titles` | Staff* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `staff-position-titles-grades` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-profile-templates` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-qualifications` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-qualifications-specialisations` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-qualifications-subjects` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-report-card-email-processes` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-report-card-processes` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-report-cards` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-salaries` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-salary-transactions` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-statuses` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-training-applications` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-training-categories` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-training-needs` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-trainings` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-training-self-studies` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-training-self-study-attachments` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-training-self-study-results` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `staff-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Infrastructure* ──** | | | | | | |
| `infrastructure-attachment-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-conditions` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-custom-field-options` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-custom-fields` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-custom-forms` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-custom-forms-fields` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-custom-forms-filters` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-levels` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-needs` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-need-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-ownerships` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-project-funding-sources` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-projects` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-projects-needs` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-statuses` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-utility-electricities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-utility-internets` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-utility-telephones` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-hygiene-educations` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-hygiene-quantities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-hygienes` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-hygiene-soapash-availabilities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-hygiene-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-sanitation-accessibilities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-sanitation-qualities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-sanitation-quantities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-sanitations` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-sanitation-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-sanitation-uses` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-sewage-functionalities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-sewages` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-sewage-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-waste-functionalities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-wastes` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-waste-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-water-accessibilities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-water-functionalities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-water-proximities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-water-qualities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-water-quantities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-waters` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `infrastructure-wash-water-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Student* ──** | | | | | | |
| `student-absence-reasons` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-admission-custom-field-values` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-attachment-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-attendance-marked-records` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-attendance-mark-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-attendance-per-day-periods` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-attendance-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-behaviour-attachments` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-behaviour-categories` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-behaviour-classifications` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-behaviours` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-custom-field-options` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-custom-fields` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-custom-field-values` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-custom-filters` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-custom-forms` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-custom-forms-fields` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-custom-table-cells` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-custom-table-columns` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-custom-table-rows` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-extracurriculars` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-fees` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-guardians` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-mark-type-statuses` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-mark-type-status-grades` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-meal-marked-records` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-profile-security-roles` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-profile-templates` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-report-card-email-processes` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-report-card-processes` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-report-cards` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-risks-criterias` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-statuses` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-status-updates` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-transfer-reasons` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-visit-purpose-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-visit-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `student-withdraw-reasons` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── User* ──** | | | | | | |
| `user-activities` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-attachments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-attachments-roles` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-awards` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-bank-accounts` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-body-masses` | User* | ✅ | ✅ | — | — | ✅ v1.0.0 مباشر |
| `user-comments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-contacts` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-demographics` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-employments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-health-allergies` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-health-consultations` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-health-families` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-health-histories` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-health-immunizations` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-health-medications` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-healths` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-health-tests` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-identities` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-insurances` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-languages` | User* | ✅ | ✅ | — | — | ✅ v1.0.0 مباشر |
| `user-nationalities` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-special-needs-assessments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-special-needs-devices` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-special-needs-diagnostics` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-special-needs-plans` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-special-needs-referrals` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `user-special-needs-services` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Training* ──** | | | | | | |
| `training-course-categories` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-courses` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-courses-prerequisites` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-courses-providers` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-courses-result-types` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-courses-specialisations` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-courses-target-populations` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-course-types` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-field-of-studies` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-levels` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-mode-deliveries` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-need-categories` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-need-competencies` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-need-standards` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-need-sub-standards` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-priorities` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-providers` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-requirements` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-result-types` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-session-evaluators` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-session-results` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-sessions` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-sessions-trainees` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-session-trainee-results` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-session-trainers` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `training-specialisations` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Scholarship* ──** | | | | | | |
| `scholarship-application-attachments` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-application-institution-choices` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-applications` | Scholarship* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `scholarship-attachment-types` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-disbursement-categories` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-financial-assistances` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-financial-assistance-types` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-funding-sources` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-institution-choice-statuses` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-institution-choice-types` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-loans` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-payment-frequencies` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-recipient-academic-standings` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-recipient-activities` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-recipient-activity-statuses` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-recipient-collections` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-recipient-disbursements` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-recipient-payment-structure-estimates` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-recipient-payment-structures` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-recipients` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarship-semesters` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Summary* ──** | | | | | | |
| `summary-area-institution-grade-attendances` | Summary* | ✅ | ✅ | — | — | ✅ v1.0.0 مباشر |
| `summary-area-provider-grade-subject-results` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `summary-assessment-item-results` | Summary* | ✅ | ✅ | — | — | ✅ v1.0.0 مباشر |
| `summary-grade-gender-ages` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `summary-grade-status-genders` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `summary-institution-grade-nationalities` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `summary-institution-grades` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `summary-institution-nationalities` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `summary-institution-room-types` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `summary-institutions` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `summary-institution-student-absences` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `summary-institution-student-subject-results` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `summary-isced-sectors` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `summary-programme-sector-genders` | Summary* | ✅ | ✅ | — | — | ✅ v1.0.0 مباشر |
| `summary-programme-sector-qualification-genders` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `summary-programme-sector-specialization-genders` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `summary-student-assessments` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `summary-student-attendances` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Examination* ──** | | | | | | |
| `examination-centre-rooms` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-centre-rooms-examinations` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-centre-rooms-examinations-invigilators` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-centre-rooms-examinations-students` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-centres` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-centres-examinations` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-centres-examinations-institutions` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-centres-examinations-invigilators` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-centres-examinations-students` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-centres-examinations-subjects` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-centres-examinations-subjects-students` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-centre-special-needs` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-grading-options` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-grading-types` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-student-subject-results` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-student-subjects` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examination-subjects` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Appraisal* ──** | | | | | | |
| `appraisal-criterias` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-dropdown-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-dropdown-options` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-forms` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-forms-criterias` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-forms-criterias-scores` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-forms-criterias-scores-links` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-number-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-numbers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-periods` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-periods-types` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-score-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-slider-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-sliders` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-text-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `appraisal-types` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Education* ──** | | | | | | |
| `education-certifications` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-cycles` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-field-of-studies` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-grades` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-grades-cumulative-gpa` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-grades-gpa` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-grades-subjects` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-level-isced` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-levels` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-programme-orientations` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-programmes` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-programmes-next-programmes` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-stages` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-subjects` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-subjects-field-of-studies` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `education-systems` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Survey* ──** | | | | | | |
| `survey-filter-areas` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `survey-filter-institution-providers` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `survey-filter-institution-types` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `survey-forms` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `survey-forms-filters` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `survey-forms-questions` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `survey-question-choices` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `survey-questions` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `survey-responses` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `survey-rules` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `survey-statuses` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `survey-status-periods` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `survey-table-columns` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `survey-table-rows` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Security* ──** | | | | | | |
| `security-functions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `security-group-areas` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `security-group-institutions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `security-groups` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `security-group-users` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `security-rest-sessions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `security-role-functions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `security-roles` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `security-user-codes` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `security-user-logins` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `security-user-password-requests` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `security-users` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `security-user-sessions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Custom* ──** | | | | | | |
| `custom-field-options` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `custom-fields` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `custom-field-types` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `custom-field-values` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `custom-forms` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `custom-forms-fields` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `custom-forms-filters` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `custom-modules` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `custom-records` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `custom-table-cells` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `custom-table-columns` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `custom-table-rows` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Meal* ──** | | | | | | |
| `meal-benefits` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `meal-food-records` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `meal-implementers` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `meal-institution-programmes` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `meal-nutritional-records` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `meal-nutritions` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `meal-programmes` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `meal-programme-types` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `meal-ratings` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `meal-received` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `meal-status-types` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `meal-target-types` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Workflow* ──** | | | | | | |
| `workflow-actions` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `workflow-comments` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `workflow-models` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `workflow-rule-events` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `workflow-rules` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `workflow-statuses` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `workflow-statuses-steps` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `workflow-steps` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `workflow-steps-params` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `workflow-steps-roles` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `workflow-transitions` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Assessment* ──** | | | | | | |
| `assessment-grading-options` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `assessment-grading-types` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `assessment-item-results` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `assessment-item-results-archived` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `assessment-items` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `assessment-items-grading-types` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `assessment-item-student-exemptions` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `assessment-period-excluded-security-roles` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `assessment-periods` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Rubric* ──** | | | | | | |
| `rubric-criteria-options` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `rubric-criterias` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `rubric-sections` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `rubric-statuses` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `rubric-status-periods` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `rubric-status-programmes` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `rubric-status-roles` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `rubric-template-options` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `rubric-templates` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Special* ──** | | | | | | |
| `special-need-difficulties` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `special-needs-device-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `special-needs-diagnostics-degree` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `special-needs-diagnostics-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `special-needs-plan-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `special-needs-referrer-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `special-needs-service-classification` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `special-needs-service-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `special-need-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Report* ──** | | | | | | |
| `report-card-comment-codes` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `report-card-email-processes` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `report-card-excluded-security-roles` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `report-card-processes` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `report-cards` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `report-card-subjects` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `report-progress` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `report-queries` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Competency* ──** | | | | | | |
| `competency-criterias` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `competency-grading-options` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `competency-grading-types` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `competency-items` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `competency-items-periods` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `competency-periods` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `competency-templates` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Utility* ──** | | | | | | |
| `utility-electricity-conditions` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `utility-electricity-types` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `utility-internet-bandwidths` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `utility-internet-conditions` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `utility-internet-types` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `utility-telephone-conditions` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `utility-telephone-types` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Api* ──** | | | | | | |
| `api-authorizations` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `api-credentials` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `api-credentials-scopes` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `api-scopes` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `api-securities` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `api-securities-scopes` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Health* ──** | | | | | | |
| `health-allergy-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `health-conditions` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `health-consultation-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `health-immunization-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `health-relationships` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `health-test-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Asset* ──** | | | | | | |
| `asset-conditions` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `asset-makes` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `asset-models` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `asset-statuses` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `asset-types` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Outcome* ──** | | | | | | |
| `outcome-criterias` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `outcome-grading-options` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `outcome-grading-types` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `outcome-periods` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `outcome-templates` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── System* ──** | | | | | | |
| `system-authentications` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `system-errors` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `system-patches` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `system-processes` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `system-updates` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Config* ──** | | | | | | |
| `config-attachments` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `config-item-options` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `config-items` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `config-product-lists` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Data* ──** | | | | | | |
| `data-dictionary` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `data-management-connections` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `data-management-copy` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `data-management-logs` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Area* ──** | | | | | | |
| `area-administrative-levels` | Area* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `area-administratives` | Area* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `area-levels` | Area* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Calendar* ──** | | | | | | |
| `calendar-event-dates` | Calendar* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `calendar-events` | Calendar* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `calendar-types` | Calendar* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Class* ──** | | | | | | |
| `class-profile-processes` | Class* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `class-profiles` | Class* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `class-profile-templates` | Class* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Email* ──** | | | | | | |
| `email-process-attachments` | Email* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `email-processes` | Email* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `email-templates` | Email* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Idp* ──** | | | | | | |
| `idp-google` | Idp* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `idp-oauth` | Idp* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `idp-saml` | Idp* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Qualification* ──** | | | | | | |
| `qualification-levels` | Qualification* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `qualification-specialisations` | Qualification* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `qualification-titles` | Qualification* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Scholarships* ──** | | | | | | |
| `scholarships` | Scholarships* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarships-field-of-studies` | Scholarships* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `scholarships-scholarship-attachment-types` | Scholarships* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Textbook* ──** | | | | | | |
| `textbook-conditions` | Textbook* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `textbook-dimensions` | Textbook* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `textbook-statuses` | Textbook* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Academic* ──** | | | | | | |
| `academic-period-levels` | Academic* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `academic-periods` | Academic* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Alert* ──** | | | | | | |
| `alert-logs` | Alert* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `alert-rules` | Alert* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Alerts* ──** | | | | | | |
| `alerts` | Alerts* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `alerts-roles` | Alerts* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Building* ──** | | | | | | |
| `building-custom-field-values` | Building* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `building-types` | Building* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Case* ──** | | | | | | |
| `case-priorities` | Case* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `case-types` | Case* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Contact* ──** | | | | | | |
| `contact-options` | Contact* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `contact-types` | Contact* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Curricular* ──** | | | | | | |
| `curricular-positions` | Curricular* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `curricular-types` | Curricular* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Field* ──** | | | | | | |
| `field-options` | Field* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `field-types` | Field* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Floor* ──** | | | | | | |
| `floor-custom-field-values` | Floor* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `floor-types` | Floor* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Gpa* ──** | | | | | | |
| `gpa-grading-options` | Gpa* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `gpa-grading-types` | Gpa* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Historical* ──** | | | | | | |
| `historical-staff-leave` | Historical* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `historical-staff-positions` | Historical* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Income* ──** | | | | | | |
| `income-sources` | Income* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `income-types` | Income* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Insurance* ──** | | | | | | |
| `insurance-providers` | Insurance* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `insurance-types` | Insurance* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Land* ──** | | | | | | |
| `land-custom-field-values` | Land* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `land-types` | Land* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── License* ──** | | | | | | |
| `license-classifications` | License* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `license-types` | License* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Locale* ──** | | | | | | |
| `locale-contents` | Locale* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `locale-content-translations` | Locale* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Messaging* ──** | | | | | | |
| `messaging` | Messaging* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `messaging-security-roles` | Messaging* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Moodle* ──** | | | | | | |
| `moodle-api-created-users` | Moodle* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `moodle-api-log` | Moodle* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Room* ──** | | | | | | |
| `room-custom-field-values` | Room* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `room-types` | Room* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Salary* ──** | | | | | | |
| `salary-addition-types` | Salary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `salary-deduction-types` | Salary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Transport* ──** | | | | | | |
| `transport-features` | Transport* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `transport-statuses` | Transport* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── Workflows* ──** | | | | | | |
| `workflows` | Workflows* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `workflows-filters` | Workflows* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| **── موارد فردية ──** | | | | | | |
| `absence-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `areas` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `assessments` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `authentication-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `backup-logs` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `bank-branches` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `banks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `behaviour-classifications` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `budget-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `bus-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `comment-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `counsellings` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `countries` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `deleted-records` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `demographic-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `department-staff` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `employment-status-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `examinations` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `expenditure-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `external-data-source-attributes` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `extracurricular-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `feeders-institutions` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `fee-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `food-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `genders` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `guardian-relations` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `guidance-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `identity-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `import-mapping` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `industries` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `inserted-records` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `institutions` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `labels` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `language-proficiencies` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `languages` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `locales` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `manuals` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `message-recipients` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `nationalities` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `notices` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `openemis-temps` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `phinxlog` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `profile-templates` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `quality-visit-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `reports` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `risk-criterias` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `risks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `shift-options` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `single-logout` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `textbooks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `themes` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `transfer-logs` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `trip-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `webhook-events` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
| `webhooks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 مباشر |
