---
title: عرض ملخص مخاطر المؤسسة في OpenEMIS
description: يشرح هذا الدليل الإجرائي لـ OpenEMIS كيفية استرجاع ملخص مخاطر الطلاب على مستوى المؤسسة وتكوين قواعد التنبيه من نظام إدارة المدارس.
keywords:
  - OpenEMIS
  - مخاطر الطلاب
  - نظام إدارة المدارس
  - إدارة التعليم
---

# عرض ملخص مخاطر المؤسسة في OpenEMIS وقواعد التنبيه

**المجال:** المؤسسة  
**الجمهور:** مدير النظام، الوزارة  
**معرف دليل التشغيل:** `view-institution-risks`

## الوصف

عرض المخاطر المُهيأة لمؤسسة ما، وقواعد التنبيه التي يتم تشغيلها عند تجاوز العتبات، وسجلات تسليم التنبيهات الحديثة. يحتوي `institution-risks` على مفتاح أساسي مركب (`risk_id` + `institution_id`) — **لا يوجد حقل عدد صحيح `id`**. ترتبط التنبيهات بقواعد التنبيه `AlertRules` عبر **ربط نصي للاسم↔الميزة**، وليس عبر مفتاح أجنبي عدد صحيح.

---

## الموارد المستخدمة

| المورد | الغرض |
|---|---|
| `institution-risks` | أنواع المخاطر المُهيأة لهذه المؤسسة (مفتاح أساسي مركب) |
| `risks` | تعريفات المخاطر الرئيسية مع أسمائها ونطاق الفترة الأكاديمية |
| `risk-criterias` | قيم العتبات والأوزان لكل معيار |
| `alerts` | تعريفات التنبيهات — الأحداث التي تُطلق الإشعارات |
| `alert-rules` | قواعد الإشعارات — مفعل/معطل، الطريقة، العتبة، أدوار المستلمين |
| `alert-logs` | سجل تسليم التنبيهات الحديث مع حالة النجاح/الفشل |

---

## الخطوات

| الخطوة | الإجراء | المورد | الغرض |
|---|---|---|---|
| 1 | `openemis_get` | `institution-risks` | سرد أنواع المخاطر المُهيأة لهذه المؤسسة |
| 2 | `openemis_get` | `risks` + `risk-criterias` | حل أسماء المخاطر ومعايير العتبة |
| 3 | `openemis_get` | `alerts` | سرد تعريفات التنبيهات |
| 4 | `openemis_get` | `alert-rules` | عرض قواعد الإشعارات وحالة التفعيل |
| 5 | `openemis_get` | `alert-logs` | التحقق من سجل تسليم التنبيهات الحديث |

---

## ملاحظات الخطوات

**الخطوة 1 — تهيئة مخاطر المؤسسة**  
الترشيح بواسطة `institution_id`.

> ⚠️ **المفتاح الأساسي المركب:** `institution-risks` **لا يحتوي على عمود عدد صحيح `id`**. المفتاح الأساسي هو (`risk_id` + `institution_id`). لا تستعلم أبدًا باستخدام معلمة `id=` مجردة — ستعيد نتائج فارغة أو خاطئة.

`academic_period_id` غير مخزن في هذه الجدول — يتم تحديد النطاق الزمني عبر جدول `risks` الرئيسي. قم بحل `risk_id` في الخطوة 2.

**الخطوة 2 — تعريفات المخاطر والمعايير**  
رَشِّح `risks` بواسطة `academic_period_id` — **مطلوب، لا يمكن أن يكون فارغًا**. ثم استرجع `risk-criterias` مُرشَّحة بواسطة `risk_id` للحصول على `risk_value` (نطاق 1–99، مُتحقَّق منه) و `threshold`. يستخدم حقل `threshold` مدقق `checkCriteriaThresholdRange()` المخصص — نصي أو رقمي حسب نوع الخطر.

**الخطوة 3 — تعريفات التنبيهات**  
لا يوجد مرشح `institution_id` أو `academic_period_id` على `alerts`.

> ⚠️ **الربط غير القياسي:** `alerts.name` ↔ `alert_rules.feature` هو **تطابق نصي**، وليس مفتاحًا أجنبيًا عدد صحيح. لا تحاول استخدام `?alert_rule_id=...` على نقطة نهاية التنبيهات — هذه المعلمة غير موجودة. استرجع `alert-rules` بشكل منفصل واربطها بمطابقة `alerts.name` مع `alert_rules.feature`.

**الخطوة 4 — قواعد التنبيه**  
لا يوجد مرشح `institution_id` أو `academic_period_id`. الحقول الرئيسية:
- `enabled` (0/1) — ما إذا كانت هذه القاعدة نشطة
- `method` — طريقة الإشعار (مثال: "Email")
- `feature` — مفتاح الربط العائد إلى `alerts.name`
- `threshold` — قيمة الشرط التي تُطلق التنبيه
- `security_roles` — مُعبَّأة عبر جدول الربط `alerts-roles` (مفتاح أساسي مركب: `alert_rule_id` + `security_role_id`، لا يوجد عدد صحيح `id`)

**الخطوة 5 — سجلات تسليم التنبيهات**  
لا يوجد مرشح `institution_id` أو `academic_period_id`. رَشِّح بواسطة `feature` لتحديد نوع تنبيه معين، أو `status=-1` للعثور على عمليات التسليم الفاشلة. قيم الحالة: `0` = معلق، `1` = ناجح، `-1` = فاشل. يُستخدم حقل `checksum` لإزالة التكرار.

---

## المزالق الرئيسية

- **المفتاح الأساسي المركب لـ `institution-risks`: (`risk_id` + `institution_id`)** — لا يوجد عدد صحيح `id`. لا تستخدم `id=` على هذا المورد أبدًا.
- **`alerts-roles` أيضًا مفتاح أساسي مركب** (`alert_rule_id` + `security_role_id`) — لا يوجد عدد صحيح `id`.
- **الربط بين التنبيهات وقواعد التنبيه هو نصي:** `alerts.name` = `alert_rules.feature`. هذه هي العلاقة الأقل وضوحًا في هذا المجال.
- **`risks.academic_period_id` إلزامي** — يتحقق المورد من أنه لا يمكن أن يكون فارغًا.
- **قيم `alert-logs.status`:** 0 = معلق، 1 = ناجح، −1 = فاشل.

---

## مثال على الاستعلام

> *"ما هي المخاطر المُهيأة لمدرسة أفوري الابتدائية، وهل تم إطلاق أي تنبيهات مؤخرًا؟"*

1. `openemis_get { resource: "institution-risks", params: { institution_id: 6 } }` → risk_id: 1, risk_id: 2
2. `openemis_get { resource: "risks", params: { academic_period_id: 1 } }` → "Attendance Risk", "Academic Performance Risk"
3. `openemis_get { resource: "alerts" }` → 3 تعريفات تنبيه (أسماء: "LowAttendance", "HighAbsence", "FailingGrade")
4. `openemis_get { resource: "alert-rules", params: { } }` → قاعدة "LowAttendance": enabled=1, method=Email, threshold=75
5. `openemis_get { resource: "alert-logs", params: { feature: "LowAttendance" } }` → 4 رسائل بريد إلكتروني مرسلة (status=1)، 1 فاشلة (status=-1) الأسبوع الماضي