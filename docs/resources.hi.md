---
title: OpenEMIS MCP Pro — स्कूल प्रबंधन प्रणाली के लिए संसाधन संदर्भ
description: पढ़ने और लिखने के MCP सर्वर के लिए HTTP विधि उपलब्धता और लेखन स्थिति के साथ OpenEMIS के सभी 675 संसाधनों का पूर्ण संदर्भ (Core 5.10.0)।
keywords:
  - OpenEMIS
  - स्कूल प्रबंधन प्रणाली
  - शिक्षा प्रबंधन
  - छात्र उपस्थिति
  - छात्र जोखिम
---

# OpenEMIS MCP Pro — स्कूल प्रबंधन प्रणाली के लिए संसाधन संदर्भ

> **675 संसाधन** · **3355 एंडपॉइंट** · v1.1.0 · OpenEMIS Core 5.10.0
>
> PRO वितरण — पठन + लेखन। वर्कफ़्लो-नियंत्रित संसाधन टूल परत पर अवरुद्ध हैं (🔒); सीधे लेखन के बजाय उपयुक्त playbook का उपयोग करें।
>
> MCP यह तालिका AI संदर्भ में **नहीं** लोड करता है। यह डोमेन बकेट + playbooks के साथ एक कॉम्पैक्ट
> `grouped-manifest.json` (~210 KB) का उपयोग करता है।
> एजेंट डोमेन/playbook द्वारा नेविगेट करता है और मांग पर एंडपॉइंट विवरण खींचता है।

## कुंजी

| प्रतीक | अर्थ |
|---|---|
| ✅ | उपलब्ध |
| 🔒 | केवल वर्कफ़्लो — सीधे लेखन के बजाय उपयुक्त playbook का उपयोग करें |
| — | इस संसाधन के लिए उपलब्ध नहीं |

## संसाधन
| संसाधन | डोमेन | GET | POST | PUT | DELETE | लेखन स्थिति |
|---|---|:---:|:---:|:---:|:---:|---|
| **── Institution* ──** | | | | | | |
| `institution-accreditations` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-activities` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-assets` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-associations` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-association-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-association-student` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-attachments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-attachment-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-bank-accounts` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-budgets` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-buildings` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-buses` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-buses-transport-features` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-case-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-case-links` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-case-records` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-cases` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-class-attendance-records` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-classes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-classes-custom-field-values` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-classes-secondary-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-class-grades` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-class-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-class-subjects` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-committee-attachments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-committee-meeting` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-committees` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-committee-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-competency-item-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-competency-period-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-competency-results` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-contact-persons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-courses` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-curriculars` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-curricular-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-curricular-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-custom-field-options` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-custom-fields` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-custom-field-values` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-custom-forms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-custom-forms-fields` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-custom-forms-filters` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-custom-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-custom-table-columns` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-custom-table-rows` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-departments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-expenditures` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-fees` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-fee-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-floors` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-genders` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-grades` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-incomes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-infrastructure-attachments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-lands` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-localities` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-meal-programmes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-meal-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-outcome-results` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-outcome-subject-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-ownerships` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-positions` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-program-grade-subjects` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-providers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-quality-rubric-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-quality-rubrics` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-quality-visits` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-registrations` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-repeater-survey-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-repeater-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-repeater-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-report-card-processes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-report-cards` | Institution* | ✅ | ✅ | ✅ | — | ✅ v1.0.0 लाइव |
| `institution-risks` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-rooms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-scanned` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-schedule-curriculum-lessons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-schedule-intervals` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-schedule-lesson-details` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-schedule-lesson-rooms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-schedule-lessons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-schedule-non-curriculum-lessons` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-schedule-terms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-schedule-timeslots` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-schedule-timetable-customizes` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-schedule-timetables` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-sectors` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-shift-periods` | Institution* | ✅ | ✅ | — | — | ✅ v1.0.0 लाइव |
| `institution-shifts` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-staff-appraisals` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-staff-attendance-activities` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-staff-attendances` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-staff-duties` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-staff-leave` | Institution* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `institution-staff-leave-archived` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-staff-position-profiles` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-staff-releases` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-staff-shifts` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-staff-survey-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-staff-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-staff-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-staff-transfers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-statistics` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-statuses` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-student-absence-days` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-student-absence-details` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-student-absences` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-student-admission` | Institution* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `institution-student-enrolment` | Institution* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `institution-student-risks` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-students-gpa` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-students-report-cards` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-students-report-cards-comments` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-students-tmp` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-student-survey-answers` | Institution* | ✅ | — | — | — | — (केवल पठन) |
| `institution-student-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-student-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-student-transfers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-student-visit-requests` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-student-visits` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-student-withdraw` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-subjects` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-subjects-rooms` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-subject-staff` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-subject-students` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-survey-answers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-surveys` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-survey-table-cells` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-textbooks` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-transport-providers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-trip-days` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-trip-passengers` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-trips` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-types` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-units` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institution-visit-requests` | Institution* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Staff* ──** | | | | | | |
| `staff-attachment-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-behaviour-attachments` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-behaviour-categories` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-behaviours` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-change-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-custom-field-options` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-custom-fields` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-custom-field-values` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-custom-forms` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-custom-forms-fields` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-custom-table-cells` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-custom-table-columns` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-custom-table-rows` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-duties` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-employment-statuses` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-extracurriculars` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-leave-entitlements` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-leave-policies` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-leave-policy-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-leave-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-licenses` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-licenses-classifications` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-memberships` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-payslips` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-position-categories` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-position-grades` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-position-titles` | Staff* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `staff-position-titles-grades` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-profile-templates` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-qualifications` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-qualifications-specialisations` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-qualifications-subjects` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-report-card-email-processes` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-report-card-processes` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-report-cards` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-salaries` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-salary-transactions` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-statuses` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-training-applications` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-training-categories` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-training-needs` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-trainings` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-training-self-studies` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-training-self-study-attachments` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-training-self-study-results` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `staff-types` | Staff* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Infrastructure* ──** | | | | | | |
| `infrastructure-attachment-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-conditions` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-custom-field-options` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-custom-fields` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-custom-forms` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-custom-forms-fields` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-custom-forms-filters` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-levels` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-needs` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-need-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-ownerships` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-project-funding-sources` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-projects` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-projects-needs` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-statuses` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-utility-electricities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-utility-internets` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-utility-telephones` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-hygiene-educations` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-hygiene-quantities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-hygienes` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-hygiene-soapash-availabilities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-hygiene-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-sanitation-accessibilities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-sanitation-qualities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-sanitation-quantities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-sanitations` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-sanitation-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-sanitation-uses` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-sewage-functionalities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-sewages` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-sewage-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-waste-functionalities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-wastes` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-waste-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-water-accessibilities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-water-functionalities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-water-proximities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-water-qualities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-water-quantities` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-waters` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `infrastructure-wash-water-types` | Infrastructure* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Student* ──** | | | | | | |
| `student-absence-reasons` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-admission-custom-field-values` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-attachment-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-attendance-marked-records` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-attendance-mark-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-attendance-per-day-periods` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-attendance-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-behaviour-attachments` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-behaviour-categories` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-behaviour-classifications` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-behaviours` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-custom-field-options` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-custom-fields` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-custom-field-values` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-custom-filters` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-custom-forms` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-custom-forms-fields` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-custom-table-cells` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-custom-table-columns` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-custom-table-rows` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-extracurriculars` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-fees` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-guardians` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-mark-type-statuses` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-mark-type-status-grades` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-meal-marked-records` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-profile-security-roles` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-profile-templates` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-report-card-email-processes` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-report-card-processes` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-report-cards` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-risks-criterias` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-statuses` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-status-updates` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-transfer-reasons` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-visit-purpose-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-visit-types` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `student-withdraw-reasons` | Student* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── User* ──** | | | | | | |
| `user-activities` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-attachments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-attachments-roles` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-awards` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-bank-accounts` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-body-masses` | User* | ✅ | ✅ | — | — | ✅ v1.0.0 लाइव |
| `user-comments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-contacts` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-demographics` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-employments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-health-allergies` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-health-consultations` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-health-families` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-health-histories` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-health-immunizations` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-health-medications` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-healths` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-health-tests` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-identities` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-insurances` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-languages` | User* | ✅ | ✅ | — | — | ✅ v1.0.0 लाइव |
| `user-nationalities` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-special-needs-assessments` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-special-needs-devices` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-special-needs-diagnostics` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-special-needs-plans` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-special-needs-referrals` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `user-special-needs-services` | User* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Training* ──** | | | | | | |
| `training-course-categories` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-courses` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-courses-prerequisites` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-courses-providers` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-courses-result-types` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-courses-specialisations` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-courses-target-populations` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-course-types` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-field-of-studies` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-levels` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-mode-deliveries` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-need-categories` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-need-competencies` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-need-standards` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-need-sub-standards` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-priorities` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-providers` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-requirements` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-result-types` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-session-evaluators` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-session-results` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-sessions` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-sessions-trainees` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-session-trainee-results` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-session-trainers` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `training-specialisations` | Training* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Scholarship* ──** | | | | | | |
| `scholarship-application-attachments` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-application-institution-choices` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-applications` | Scholarship* | ✅ | 🔒 | 🔒 | 🔒 | 🔒 workflow |
| `scholarship-attachment-types` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-disbursement-categories` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-financial-assistances` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-financial-assistance-types` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-funding-sources` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-institution-choice-statuses` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-institution-choice-types` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-loans` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-payment-frequencies` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-recipient-academic-standings` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-recipient-activities` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-recipient-activity-statuses` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-recipient-collections` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-recipient-disbursements` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-recipient-payment-structure-estimates` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-recipient-payment-structures` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-recipients` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarship-semesters` | Scholarship* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Summary* ──** | | | | | | |
| `summary-area-institution-grade-attendances` | Summary* | ✅ | ✅ | — | — | ✅ v1.0.0 लाइव |
| `summary-area-provider-grade-subject-results` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `summary-assessment-item-results` | Summary* | ✅ | ✅ | — | — | ✅ v1.0.0 लाइव |
| `summary-grade-gender-ages` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `summary-grade-status-genders` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `summary-institution-grade-nationalities` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `summary-institution-grades` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `summary-institution-nationalities` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `summary-institution-room-types` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `summary-institutions` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `summary-institution-student-absences` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `summary-institution-student-subject-results` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `summary-isced-sectors` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `summary-programme-sector-genders` | Summary* | ✅ | ✅ | — | — | ✅ v1.0.0 लाइव |
| `summary-programme-sector-qualification-genders` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `summary-programme-sector-specialization-genders` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `summary-student-assessments` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `summary-student-attendances` | Summary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Examination* ──** | | | | | | |
| `examination-centre-rooms` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-centre-rooms-examinations` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-centre-rooms-examinations-invigilators` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-centre-rooms-examinations-students` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-centres` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-centres-examinations` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-centres-examinations-institutions` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-centres-examinations-invigilators` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-centres-examinations-students` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-centres-examinations-subjects` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-centres-examinations-subjects-students` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-centre-special-needs` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-grading-options` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-grading-types` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-student-subject-results` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-student-subjects` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examination-subjects` | Examination* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Appraisal* ──** | | | | | | |
| `appraisal-criterias` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-dropdown-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-dropdown-options` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-forms` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-forms-criterias` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-forms-criterias-scores` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-forms-criterias-scores-links` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-number-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-numbers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-periods` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-periods-types` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-score-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-slider-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-sliders` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-text-answers` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `appraisal-types` | Appraisal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Education* ──** | | | | | | |
| `education-certifications` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-cycles` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-field-of-studies` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-grades` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-grades-cumulative-gpa` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-grades-gpa` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-grades-subjects` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-level-isced` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-levels` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-programme-orientations` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-programmes` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-programmes-next-programmes` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-stages` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-subjects` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-subjects-field-of-studies` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `education-systems` | Education* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Survey* ──** | | | | | | |
| `survey-filter-areas` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `survey-filter-institution-providers` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `survey-filter-institution-types` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `survey-forms` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `survey-forms-filters` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `survey-forms-questions` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `survey-question-choices` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `survey-questions` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `survey-responses` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `survey-rules` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `survey-statuses` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `survey-status-periods` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `survey-table-columns` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `survey-table-rows` | Survey* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Security* ──** | | | | | | |
| `security-functions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `security-group-areas` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `security-group-institutions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `security-groups` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `security-group-users` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `security-rest-sessions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `security-role-functions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `security-roles` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `security-user-codes` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `security-user-logins` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `security-user-password-requests` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `security-users` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `security-user-sessions` | Security* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Custom* ──** | | | | | | |
| `custom-field-options` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `custom-fields` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `custom-field-types` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `custom-field-values` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `custom-forms` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `custom-forms-fields` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `custom-forms-filters` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `custom-modules` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `custom-records` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `custom-table-cells` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `custom-table-columns` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `custom-table-rows` | Custom* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Meal* ──** | | | | | | |
| `meal-benefits` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `meal-food-records` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `meal-implementers` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `meal-institution-programmes` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `meal-nutritional-records` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `meal-nutritions` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `meal-programmes` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `meal-programme-types` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `meal-ratings` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `meal-received` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `meal-status-types` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `meal-target-types` | Meal* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Workflow* ──** | | | | | | |
| `workflow-actions` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `workflow-comments` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `workflow-models` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `workflow-rule-events` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `workflow-rules` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `workflow-statuses` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `workflow-statuses-steps` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `workflow-steps` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `workflow-steps-params` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `workflow-steps-roles` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `workflow-transitions` | Workflow* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Assessment* ──** | | | | | | |
| `assessment-grading-options` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `assessment-grading-types` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `assessment-item-results` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `assessment-item-results-archived` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `assessment-items` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `assessment-items-grading-types` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `assessment-item-student-exemptions` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `assessment-period-excluded-security-roles` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `assessment-periods` | Assessment* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Rubric* ──** | | | | | | |
| `rubric-criteria-options` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `rubric-criterias` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `rubric-sections` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `rubric-statuses` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `rubric-status-periods` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `rubric-status-programmes` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `rubric-status-roles` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `rubric-template-options` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `rubric-templates` | Rubric* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Special* ──** | | | | | | |
| `special-need-difficulties` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `special-needs-device-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `special-needs-diagnostics-degree` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `special-needs-diagnostics-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `special-needs-plan-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `special-needs-referrer-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `special-needs-service-classification` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `special-needs-service-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `special-need-types` | Special* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Report* ──** | | | | | | |
| `report-card-comment-codes` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `report-card-email-processes` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `report-card-excluded-security-roles` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `report-card-processes` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `report-cards` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `report-card-subjects` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `report-progress` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `report-queries` | Report* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Competency* ──** | | | | | | |
| `competency-criterias` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `competency-grading-options` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `competency-grading-types` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `competency-items` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `competency-items-periods` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `competency-periods` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `competency-templates` | Competency* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Utility* ──** | | | | | | |
| `utility-electricity-conditions` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `utility-electricity-types` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `utility-internet-bandwidths` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `utility-internet-conditions` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `utility-internet-types` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `utility-telephone-conditions` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `utility-telephone-types` | Utility* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Api* ──** | | | | | | |
| `api-authorizations` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `api-credentials` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `api-credentials-scopes` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `api-scopes` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `api-securities` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `api-securities-scopes` | Api* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Health* ──** | | | | | | |
| `health-allergy-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `health-conditions` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `health-consultation-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `health-immunization-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `health-relationships` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `health-test-types` | Health* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Asset* ──** | | | | | | |
| `asset-conditions` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `asset-makes` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `asset-models` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `asset-statuses` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `asset-types` | Asset* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Outcome* ──** | | | | | | |
| `outcome-criterias` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `outcome-grading-options` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `outcome-grading-types` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `outcome-periods` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `outcome-templates` | Outcome* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── System* ──** | | | | | | |
| `system-authentications` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `system-errors` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `system-patches` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `system-processes` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `system-updates` | System* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Config* ──** | | | | | | |
| `config-attachments` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `config-item-options` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `config-items` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `config-product-lists` | Config* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Data* ──** | | | | | | |
| `data-dictionary` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `data-management-connections` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `data-management-copy` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `data-management-logs` | Data* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Area* ──** | | | | | | |
| `area-administrative-levels` | Area* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `area-administratives` | Area* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `area-levels` | Area* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Calendar* ──** | | | | | | |
| `calendar-event-dates` | Calendar* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `calendar-events` | Calendar* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `calendar-types` | Calendar* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Class* ──** | | | | | | |
| `class-profile-processes` | Class* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `class-profiles` | Class* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `class-profile-templates` | Class* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Email* ──** | | | | | | |
| `email-process-attachments` | Email* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `email-processes` | Email* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `email-templates` | Email* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Idp* ──** | | | | | | |
| `idp-google` | Idp* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `idp-oauth` | Idp* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `idp-saml` | Idp* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Qualification* ──** | | | | | | |
| `qualification-levels` | Qualification* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `qualification-specialisations` | Qualification* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `qualification-titles` | Qualification* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Scholarships* ──** | | | | | | |
| `scholarships` | Scholarships* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarships-field-of-studies` | Scholarships* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `scholarships-scholarship-attachment-types` | Scholarships* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Textbook* ──** | | | | | | |
| `textbook-conditions` | Textbook* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `textbook-dimensions` | Textbook* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `textbook-statuses` | Textbook* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Academic* ──** | | | | | | |
| `academic-period-levels` | Academic* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `academic-periods` | Academic* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Alert* ──** | | | | | | |
| `alert-logs` | Alert* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `alert-rules` | Alert* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Alerts* ──** | | | | | | |
| `alerts` | Alerts* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `alerts-roles` | Alerts* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Building* ──** | | | | | | |
| `building-custom-field-values` | Building* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `building-types` | Building* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Case* ──** | | | | | | |
| `case-priorities` | Case* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `case-types` | Case* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Contact* ──** | | | | | | |
| `contact-options` | Contact* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `contact-types` | Contact* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Curricular* ──** | | | | | | |
| `curricular-positions` | Curricular* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `curricular-types` | Curricular* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Field* ──** | | | | | | |
| `field-options` | Field* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `field-types` | Field* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Floor* ──** | | | | | | |
| `floor-custom-field-values` | Floor* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `floor-types` | Floor* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Gpa* ──** | | | | | | |
| `gpa-grading-options` | Gpa* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `gpa-grading-types` | Gpa* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Historical* ──** | | | | | | |
| `historical-staff-leave` | Historical* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `historical-staff-positions` | Historical* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Income* ──** | | | | | | |
| `income-sources` | Income* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `income-types` | Income* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Insurance* ──** | | | | | | |
| `insurance-providers` | Insurance* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `insurance-types` | Insurance* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Land* ──** | | | | | | |
| `land-custom-field-values` | Land* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `land-types` | Land* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── License* ──** | | | | | | |
| `license-classifications` | License* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `license-types` | License* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Locale* ──** | | | | | | |
| `locale-contents` | Locale* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `locale-content-translations` | Locale* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Messaging* ──** | | | | | | |
| `messaging` | Messaging* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `messaging-security-roles` | Messaging* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Moodle* ──** | | | | | | |
| `moodle-api-created-users` | Moodle* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `moodle-api-log` | Moodle* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Room* ──** | | | | | | |
| `room-custom-field-values` | Room* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `room-types` | Room* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Salary* ──** | | | | | | |
| `salary-addition-types` | Salary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `salary-deduction-types` | Salary* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Transport* ──** | | | | | | |
| `transport-features` | Transport* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `transport-statuses` | Transport* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── Workflows* ──** | | | | | | |
| `workflows` | Workflows* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `workflows-filters` | Workflows* | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| **── singletons ──** | | | | | | |
| `absence-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `areas` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `assessments` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `authentication-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `backup-logs` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `bank-branches` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `banks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `behaviour-classifications` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `budget-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `bus-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `comment-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `counsellings` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `countries` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `deleted-records` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `demographic-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `department-staff` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `employment-status-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `examinations` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `expenditure-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `external-data-source-attributes` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `extracurricular-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `feeders-institutions` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `fee-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `food-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `genders` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `guardian-relations` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `guidance-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `identity-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `import-mapping` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `industries` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `inserted-records` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `institutions` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `labels` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `language-proficiencies` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `languages` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `locales` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `manuals` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `message-recipients` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `nationalities` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `notices` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `openemis-temps` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `phinxlog` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `profile-templates` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `quality-visit-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `reports` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `risk-criterias` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `risks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `shift-options` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `single-logout` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `textbooks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `themes` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `transfer-logs` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `trip-types` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `webhook-events` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
| `webhooks` | — | ✅ | ✅ | ✅ | ✅ | ✅ v1.0.0 लाइव |
