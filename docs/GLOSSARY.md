---
title: OpenEMIS MCP Pro — Glossary of School Management Terms
description: Definitions of key OpenEMIS and education management terms used across the openemis-mcp-pro read+write MCP server documentation, playbooks, and resource reference.
keywords:
  - OpenEMIS
  - school management system
  - education management
  - student attendance
  - student risks
  - MCP
---

# OpenEMIS MCP Pro — Glossary of School Management Terms

This glossary defines the core terms used across the openemis-mcp-pro documentation. Each entry explains the concept, how it surfaces in OpenEMIS, and links to the relevant playbook or resource.

---

### OpenEMIS

OpenEMIS is a free, open-source school management information system developed by UNESCO and KORDIT. It runs the day-to-day administration of educational institutions at every level — from kindergartens through primary schools, secondary schools, vocational institutions, and universities — across member countries. See [openemis.org](https://www.openemis.org) and the [Resource Reference](resources.md).

### OpenEMIS Core

OpenEMIS Core is the main application layer — a CakePHP-based web app that exposes a versioned REST API (`/api/v5/`). Core 5.10.0 is the baseline for this distribution, covering 675 resources and 3355 endpoints. Earlier 5.7–5.9 deployments are also supported. See [api.openemis.org/core](https://api.openemis.org/core).

### MCP (Model Context Protocol)

MCP is an open protocol that lets AI assistants (Claude, ChatGPT, Cursor, Cline) call external tools as structured function calls. openemis-mcp-pro implements MCP over stdio (local subprocess) and HTTP (remote server), exposing nine tools that give agents read and write access to any OpenEMIS instance without requiring the agent to construct raw API calls.

### School management information system (SMIS)

A school management information system is software that centralises the administrative records of an educational institution — student enrolment, attendance, assessment, staff, infrastructure, and reporting. OpenEMIS is the UNESCO-backed SMIS used in this documentation; openemis-mcp-pro is the AI bridge that provides natural-language access to its data.

### Education management

Education management refers to the administration, planning, and oversight of educational institutions and systems — from individual schools up to ministry-level reporting. OpenEMIS supports education management at all these levels. See [CHATGPT-TEACHER-GUIDE.md](CHATGPT-TEACHER-GUIDE.md) for a practical example.

### Student attendance

Student attendance in OpenEMIS is recorded using the absence-by-omission model: only non-present events (absent, late, excused) are stored as rows in `student-attendance-marked-records`. A student with no row on a marked day is implicitly present. See the [Mark Student Attendance](playbooks/mark-student-attendance.md) and [View Latest Attendance](playbooks/view-latest-attendance.md) playbooks.

### Staff attendance

Staff attendance covers two separate flows in OpenEMIS: a simple check-in written to `institution-staff-attendances` (present, with optional time-in/time-out), and a leave request written to `institution-staff-leave` (workflow-controlled, requires supervisor approval). The two tables are decoupled and must be unioned client-side. See [Mark Staff Attendance](playbooks/mark-staff-attendance.md).

### Student risk / early-warning

OpenEMIS calculates per-student risk scores based on configurable criteria (attendance rate, academic performance, behaviour incidents). Scores above a threshold trigger alert rules that deliver notifications. The risk data lives in `institution-student-risks`, `student-risks-criterias`, and `risks`. See [View Student Risk Profile](playbooks/view-student-risks.md) and [View Institution Risk Summary](playbooks/view-institution-risks.md).

### Behavior incident

A behaviour incident is a logged disciplinary or welfare event for a student — category (bullying, disruption, welfare concern), severity, date, and follow-up action. Incidents are written to `institution-student-behavior-records` via [Record a Behaviour Incident](playbooks/record-behavior-incident.md). Accumulated incidents can contribute to a student's early-warning risk score.

### Workflow / admission queue / enrolment queue

OpenEMIS uses the CakePHP Workflow plugin to manage multi-step approval processes. The most common workflow is admission → enrolment: a student application moves through stages (submitted, reviewed, approved) before becoming an active enrolment record. Workflow-controlled resources cannot be written directly via API; use the appropriate playbook or the OpenEMIS application UI. See `explain-workflow-system` via `openemis_get_playbook`.

### Institution (kindergarten, primary, secondary, vocational, university)

An institution in OpenEMIS is any educational establishment — kindergartens, primary schools, secondary schools, secondary vocational institutions, technical colleges, and universities are all modelled as `institutions` with a `institution_type_id` that determines which features are available. The demo instance at [demo.openemis.org](https://demo.openemis.org/core) includes 24 institutions of multiple types.

### Academic period

An academic period is a named time span (academic year, semester, term) that scopes most data in OpenEMIS — enrolments, attendance, assessment, and timetables are all tied to an `academic_period_id`. Fetch the current period via `GET /api/v5/academic-periods?current=1`.

### Education grade

An education grade (e.g. Grade 1, Grade 10, Year 12) represents a level within an education system. Grades are defined in `education-grades` and linked to an `education_system_id`. Classes are assigned to grades; attendance mark types and report card configurations are also grade-scoped.

### Section / class

A section or class (`institution-classes`) is the unit of instruction — it has a homeroom teacher, a grade, a list of enrolled students, and a set of subjects. Most attendance and timetable queries are scoped to a class. See [View Full Class Profile](playbooks/view-class-profile.md).

### Exam mark / report card

An exam mark is a numeric score recorded in `assessment-item-results` for one student, one assessment item, and one academic period. The collection of marks for a period is rendered as a report card. See [Submit Exam Marks](playbooks/submit-exam-marks.md), [View Student Marks](playbooks/view-student-marks.md), and [Generate Student Report Card PDF](playbooks/generate-student-report-card-pdf.md).

### Subject / curriculum

A subject (`education-subjects`) is a taught discipline (Mathematics, Science, Language Arts). Subjects are linked to grades through the curriculum; a class has a set of active subjects (`institution-class-subjects`). Subject IDs are needed when marking attendance in SUBJECT or DAY_AND_SUBJECT mode.

### Playbook

A playbook in openemis-mcp-pro is a curated, step-by-step guide that tells an AI agent which resources to call, in which order, and with which parameters to complete a real school management task. There are 40 playbooks in this distribution — 26 read and 14 write/auth. Load any playbook with `openemis_get_playbook({ id: "playbook-id" })`.

### Resource (in MCP terms)

In openemis-mcp-pro, a resource is a kebab-case identifier that maps to one OpenEMIS API endpoint family — for example `institution-students`, `student-attendance-marked-records`, or `institution-assets`. Pass it as the `resource` parameter to `openemis_get`, `openemis_create`, `openemis_update`, or `openemis_delete`. The full list of 675 resources is in [resources.md](resources.md).

---

**Related docs:** [FAQ](FAQ.md) · [Playbooks](playbooks/) · [Resource Reference](resources.md) · [ChatGPT Teacher Guide](CHATGPT-TEACHER-GUIDE.md)
