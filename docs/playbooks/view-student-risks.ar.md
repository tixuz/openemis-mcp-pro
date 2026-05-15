---
title: عرض ملف مخاطر الطالب في OpenEMIS
description: يشرح هذا الدليل الإجرائي لـ OpenEMIS كيفية استرجاع درجات مخاطر الطلاب ومؤشرات الإنذار المبكر وقضايا الرعاية من نظام إدارة المدارس.
keywords:
  - OpenEMIS
  - مخاطر الطلاب
  - نظام إدارة المدارس
  - إدارة التعليم
---

# عرض ملف مخاطر الطالب في OpenEMIS وقضايا الرعاية

**المجال:** الطالب  
**الجمهور المستهدف:** مدير، مرشد، معلم  
**معرف الدليل:** `view-student-risks`

## الوصف

عرض درجة المخاطر المحسوبة للطالب، ومعايير المخاطر الفردية التي ساهمت فيها، وأي قضايا رعاية أو حماية تم فتحها لهذا الطالب. `institution-risks` له مفتاح أساسي مركب — لا يوجد `id` رقمي. `institution-cases` يتم التحكم به عبر سير العمل — طلبات GET آمنة دائمًا، ولكن عمليات الكتابة يجب أن تتم عبر تطبيق OpenEMIS.

---

## الموارد المستخدمة

| المورد | الغرض |
|---|---|
| `institution-student-risks` | درجة المخاطر الإجمالية للطالب للفترة الأكاديمية |
| `risks` | تعريفات المخاطر الرئيسية — الأسماء وما يقيسه كل خطر |
| `risk-criterias` | العتبة والوزن لكل معيار ضمن خطر معين |
| `student-risks-criterias` | الدرجات لكل معيار لسجل مخاطر هذا الطالب |
| `institution-cases` | قضايا الرعاية/الحماية المفتوحة لهذا الطالب |
| `case-types` | بحث عام: تسميات أنواع القضايا |
| `case-priorities` | بحث عام: تسميات الأولويات |

---

## الخطوات

| الخطوة | الإجراء | المورد | الغرض |
|---|---|---|---|
| 1 | `openemis_get` | `institution-student-risks` | جلب درجة المخاطر الإجمالية للطالب |
| 2 | `openemis_get` | `risks` | حل أسماء وتعريفات المخاطر |
| 3 | `openemis_get` | `student-risks-criterias` | تفصيل الدرجة حسب المعيار |
| 4 | `openemis_get` | `institution-cases` | سرد قضايا الرعاية المفتوحة لهذا الطالب |

---

## ملاحظات الخطوات

**الخطوة 1 — درجة مخاطر الطالب**  
الترشيح حسب `institution_id` و `academic_period_id` و `student_id` (`security_user_id` للطالب). كل من `institution_id` و `academic_period_id` مطلوبان — إغفال أي منهما يعيد نتائج عامة غير محددة عبر جميع المؤسسات والفترات. الحقل `total_risk` هو المجموع المحسوب. احتفظ بقيمة الحقل `id` للخطوة 3.

**الخطوة 2 — تعريفات المخاطر**  
الترشيح حسب `academic_period_id` — **مطلوب، لا يمكن أن يكون فارغًا** (يتم التحقق منه على مستوى واجهة البرمجة). جدول `risks` هو التعريف الرئيسي لما يقيسه كل نوع خطر لفترة معينة. حل `risk_id` من الخطوة 1 هنا. جلب `risk-criterias` مفلترًا حسب `risk_id` للحصول على `risk_value` (نطاق 1–99) و `threshold` لكل معيار.

**الخطوة 3 — التفصيل حسب المعيار**  
الترشيح حسب `institution_student_risk_id` (الـ `id` من الخطوة 1). هذا جدول ربط بمفتاح أساسي مركب (`institution_student_risk_id` + `risk_criteria_id`) — **لا يوجد `id` رقمي مستقل**. لا تستعلم باستخدام معلمة `id=` عارية. الحقل `value` يحتفظ بالدرجة المُقَيّمة لكل معيار. حل `risk_criteria_id` عبر `risk-criterias` لعرض التسميات والعتبات.

**الخطوة 4 — قضايا الرعاية**  
الترشيح حسب `institution_id`. `institution-cases` **يتم التحكم به عبر سير العمل** — `status_id` يشير إلى `workflow_steps`، وليس تعدادًا بسيطًا. طلبات GET آمنة دائمًا.

> ⚠️ لإنشاء أو تحديث القضايا، استخدم تطبيق OpenEMIS — عمليات الكتابة المباشرة عبر واجهة البرمجة تتجاوز سلسلة الموافقة والتدقيق.

`case_number` يتم إنشاؤه تلقائيًا كـ `{institution_code}-{date}-{id}`. حل `case_type_id` عبر `case-types` و `case_priority_id` عبر `case-priorities` — كلاهما بحثان عامان من نوع FieldOption بدون عامل ترشيح `institution_id` أو `academic_period_id`.

---

## المزالق الرئيسية

- **`institution-student-risks`** يتطلب كلًا من `institution_id` و `academic_period_id` — كلاهما إلزامي.
- **`risks`** يتطلب `academic_period_id` كحقل إلزامي.
- **`student-risks-criterias` هو جدول ربط بمفتاح أساسي مركب** — لا يوجد `id` رقمي. قم بالترشيح حسب `institution_student_risk_id` فقط.
- **`institution-cases` يتم التحكم به عبر سير العمل.** طلبات GET آمنة. عمليات الكتابة يجب أن تتم عبر التطبيق.
- **أسماء المفاتيح الخارجية:** `case_priority_id` (وليس `priority_id`), `case_type_id` (وليس `type_id`).

---

## مثال على الاستعلام

> *"ما هو مستوى مخاطر أحمد هذا العام وهل هناك أي قضايا رعاية مفتوحة له؟"*

1. `openemis_get { resource: "institution-student-risks", params: { institution_id: 6, academic_period_id: 1, student_id: 102 } }` → total_risk: 72, id: 445
2. `openemis_get { resource: "risks", params: { academic_period_id: 1 } }` → "Attendance Risk", "Academic Risk"
3. `openemis_get { resource: "student-risks-criterias", params: { institution_student_risk_id: 445 } }` → absence criterion: 85, marks criterion: 60
4. `openemis_get { resource: "institution-cases", params: { institution_id: 6 } }` → 1 open case, Priority: High, Type: Welfare