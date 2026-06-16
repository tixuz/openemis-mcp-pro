---
title: OpenEMIS MCP Pro — Frequently Asked Questions
description: Answers to the most common questions about OpenEMIS, the openemis-mcp-pro read+write MCP server, school management capabilities, and how AI assistants access student and staff data.
keywords:
  - OpenEMIS
  - school management system
  - education management
  - student attendance
  - student risks
  - MCP
---

# OpenEMIS MCP Pro — Frequently Asked Questions

---

## What is OpenEMIS?

OpenEMIS is a free, open-source school management information system developed by UNESCO and KORDIT. It manages the day-to-day administration of educational institutions — students, staff, attendance, assessments, infrastructure, meals, scholarships, and ministry-level reporting. OpenEMIS is deployed in kindergartens, primary schools, secondary schools, vocational institutions, and universities across UNESCO member countries. The system is available at [openemis.org](https://www.openemis.org) and its public REST API is documented at [api.openemis.org/core](https://api.openemis.org/core).

---

## What is the OpenEMIS MCP server?

openemis-mcp-pro is the read + write MCP server (Model Context Protocol) that bridges AI assistants to any OpenEMIS instance. It exposes nine tools — `openemis_health`, `openemis_list_domains`, `openemis_discover`, `openemis_list_playbooks`, `openemis_get_playbook`, `openemis_get`, `openemis_create`, `openemis_update`, and `openemis_delete` — allowing agents like Claude, ChatGPT, and Cursor to answer school management questions and write records without writing a single line of code. It runs over stdio (local Claude Code / Cursor) or HTTP (remote server for ChatGPT Custom GPT). This is the pro distribution — for the free read-only version, see [openemis-mcp](https://github.com/tixuz/openemis-mcp).

---

## What does this MCP let me ask about?

You can ask about any of the 678 OpenEMIS resources in Core 5.13.0, including: students (enrolment, profiles, contacts, special needs), staff (positions, qualifications, attendance, leave), attendance (daily roll calls, absence history, chronic absentees), assessment (exam marks, report cards), student risks and early-warning scores, institution profiles, infrastructure (buildings, land, WASH, assets), meals, timetables and schedules, academic periods, and ministry-level reporting. You can also write: mark attendance, enrol students, submit exam marks, record behaviour incidents, add assets, and set accreditation — see the [Playbooks](playbooks/) index.

---

## How does it help with school management?

The OpenEMIS Core REST API exposes 3361 endpoints across 678 resources — far too large for an AI agent to hold in context. openemis-mcp-pro solves this with domain-scoped discovery: `openemis_discover(topic)` narrows to the ~20–30 endpoints relevant to the user's actual question. Combined with 40 curated playbooks that encode expert knowledge of field names, composite primary keys, workflow rules, and common gotchas, the server lets agents answer natural-language school management questions in 2–4 tool calls, not 30.

---

## How is student attendance tracked?

OpenEMIS uses an absence-by-omission model. When a teacher marks roll, only non-present students generate rows in `student-attendance-marked-records` — a student with no row on a marked day is implicitly present. Rows carry an `absence_type_id` (Excused, Unexcused, Late) and optionally link to a reason comment in `institution-student-absence-details`. To mark attendance via this MCP, use the [Mark Student Attendance](playbooks/mark-student-attendance.md) playbook — it supports DAY, SUBJECT, and DAY_AND_SUBJECT modes. To view recent student attendance statistics, use [View Latest Attendance](playbooks/view-latest-attendance.md).

---

## How are student risks identified?

OpenEMIS calculates per-student risk scores each period based on criteria such as attendance rate and academic performance. Scores above configurable thresholds trigger alert rules that deliver notifications by email or other channels. Risk data is stored in `institution-student-risks` and `student-risks-criterias`; welfare cases are in `institution-cases`. The [View Student Risk Profile](playbooks/view-student-risks.md) playbook retrieves scores, criteria breakdowns, and open welfare cases. The [View Institution Risk Summary](playbooks/view-institution-risks.md) playbook shows the institution-level early-warning configuration and recent alert delivery logs.

---

## What is the difference between admission and enrolment?

Admission is the application stage — a prospective student's record moves through an approval workflow before being accepted. Enrolment is the active student record once admission is approved. OpenEMIS can be configured to require full workflow approval (admission → review → enrolment) or to allow direct bypass enrolment. The [Enrol a New Student](playbooks/enroll-new-student.md) playbook covers bypass-mode direct enrolment using `openemis_create`. Full workflow admission requires the OpenEMIS application UI.

---

## Which education levels does OpenEMIS support?

OpenEMIS supports kindergartens, primary schools, secondary schools, secondary vocational institutions, technical colleges, and universities. Each institution has an `institution_type_id` that determines which modules and grade structures are available. The public demo at [demo.openemis.org](https://demo.openemis.org/core) includes 24 institutions across multiple types and levels.

---

## Is this free?

Yes — OpenEMIS itself is free and open-source (MIT licence). The free openemis-mcp server ([github.com/tixuz/openemis-mcp](https://github.com/tixuz/openemis-mcp)) is also MIT-licensed and covers all 678 read resources. openemis-mcp-pro (this distribution) adds write tools (`openemis_create`, `openemis_update`, `openemis_delete`), HTTP server mode for ChatGPT Custom GPT, and per-user authentication; it is licensed under BSL 1.1 for Individual Pro, Institution Pro, and Country Pro tiers. Contact khindol.madraimov@gmail.com for pricing.

---

## What kinds of staff data can I query?

openemis-mcp-pro can retrieve: staff personal records (`security-users`), employment history and current positions (`institution-staff`, `institution-positions`), qualifications and professional development (`user-qualifications`, `user-training-results`), contact information (`user-contacts`), attendance history (`institution-staff-attendances`), and leave records (`institution-staff-leave`). To write, you can mark a staff member present or submit a leave request — see [Mark Staff Attendance](playbooks/mark-staff-attendance.md). For a full read profile, see [View Staff Profile](playbooks/view-staff-profile.md).

---

**Related docs:** [Glossary](GLOSSARY.md) · [Playbooks](playbooks/) · [Resource Reference](resources.md) · [ChatGPT Teacher Guide](CHATGPT-TEACHER-GUIDE.md)
