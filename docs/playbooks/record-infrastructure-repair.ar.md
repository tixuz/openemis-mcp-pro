---
title: تسجيل إصلاح بنية تحتية في OpenEMIS
description: يشرح هذا الدليل الإجرائي لـ OpenEMIS كيفية تسجيل إصلاح أو ترميم بنية تحتية في مؤسسة باستخدام أدوات الكتابة في نظام إدارة المدارس.
keywords:
  - OpenEMIS
  - نظام إدارة المدارس
  - إدارة التعليم
---

# تسجيل إصلاح أو ترميم بنية تحتية في OpenEMIS

**المجال:** البنية التحتية  
**الجمهور المستهدف:** مدير النظام، محاسب، موظفو المرافق  
**معرف دليل الإجراءات:** `record-infrastructure-repair`

## الوصف

سجل مشروع إصلاح أو ترميم أو صيانة تم إنجازه أو قيد التنفيذ في مؤسسة تعليمية — مثل ترميم دورات المياه، إصلاح السقف، إعادة طلاء فصل دراسي، استبدال مضخة المياه. يتم تخزين السجل في `infrastructure-needs`، الذي يتتبع دورة الحياة الكاملة: متى تم تحديد المشكلة، ومتى بدأ العمل، ومتى اكتمل. **لا ترسل** حقل `code` — فهو يُنشَأ تلقائيًا من قبل الخادم بشكل غير متزامن (أعد جلب السجل بعد الإنشاء لاسترداده).

---

## أسئلة يجب طرحها أولاً

| السؤال | الحقل | ملاحظات |
|---|---|---|
| ما الذي تم إصلاحه / ترميمه؟ | `name` | عنوان مختصر، مثال: "كتلة المرافق الصحية أ — ترميم مرحاضين" |
| صف العمل الذي تم تنفيذه | `description` | تفاصيل: ما الذي تم استبداله، المقاول، نطاق العمل |
| متى تم تحديد المشكلة لأول مرة؟ | `date_determined` | YYYY-MM-DD، مطلوب — لا يمكن أن يكون تاريخًا مستقبليًا |
| متى بدأ العمل؟ | `date_started` | YYYY-MM-DD، اختياري |
| متى اكتمل العمل؟ | `date_completed` | YYYY-MM-DD، اختياري (اتركه فارغًا إذا كان العمل لا يزال مستمرًا) |
| هل هناك تقرير أو اسم ملف وثيقة؟ | `file_name` | سلسلة نصية مرجعية اختيارية، مثال: `restoration_report.pdf` |

---

## الموارد المستخدمة

| المورد | الغرض |
|---|---|
| `institution-buildings` | قراءة: العثور على سجل المبنى ذي الصلة للرجوع إليه (اختياري) |
| `infrastructure-needs` | كتابة: إنشاء مدخل سجل الإصلاح/الترميم |

---

## الخطوات

| الخطوة | الإجراء | المورد | الغرض |
|---|---|---|---|
| 1 | `openemis_get` | `institution-buildings` | العثور على معرف المبنى للرجوع السردي (اختياري) |
| 2 | `openemis_create` | `infrastructure-needs` | تسجيل الإصلاح مع جميع حقول التاريخ |

---

## ملاحظات الخطوات

**الخطوة 1 — البحث عن المبنى (اختياري)**  
قم بالتصفية باستخدام `institution_id` لعرض قائمة المباني. هذه الخطوة هي للسياق السردي فقط — `infrastructure-needs` لا يحتوي على مفتاح أجنبي صارم إلى `institution-buildings` في مجموعة الحقول الموثقة. استخدم اسم المبنى في حقلي `name` و `description` لجعل السجل قابلاً للتتبع.

**الخطوة 2 — إنشاء سجل الإصلاح**

نص POST:
```json
{
  "name":            "Sanitation Block A — 2 Toilets Restored",
  "description":     "Replaced damaged cisterns and fixtures in 2 female toilets. Contractor: City Plumbers Ltd. Final inspection passed.",
  "date_determined": "2025-04-01",
  "date_started":    "2025-04-10",
  "date_completed":  "2025-04-15",
  "file_name":       "toilet_restoration_final_report.pdf"
}
```

لإصلاح **قيد التنفيذ** (العمل لم يكتمل بعد)، احذف `date_completed`:
```json
{
  "name":            "Roof Repair — Main Block",
  "description":     "Leaking roof over classrooms 3–5. Emergency repair in progress.",
  "date_determined": "2025-04-18",
  "date_started":    "2025-04-19"
}
```

لإغلاق سجل **قيد التنفيذ**، استخدم PUT مع الحمولة الكاملة:
```json
PUT /institution-needs/{id}
{
  "name":            "Roof Repair — Main Block",
  "description":     "...(original text)...",
  "date_determined": "2025-04-18",
  "date_started":    "2025-04-19",
  "date_completed":  "2025-04-25",
  "file_name":       "roof_inspection_final.pdf"
}
```

> ⚠️ **لا ترسل `code` أبدًا في نص POST.** الخادم يقوم بإنشائه بشكل غير متزامن. قد يعيد استجابة POST قيمة `code: null` — أعد الجلب باستخدام GET لاسترداد الكود المُنشأ.

> ⚠️ **يتطلب PUT الحمولة الكاملة.** قم دائمًا بجلب السجل الحالي، ودمج الحقول الجديدة، ثم أرسل الكائن الكامل باستخدام PUT. حذف حقل يؤدي إلى تعيينه كقيمة فارغة (null).

---

## المشاكل الشائعة الرئيسية

- **`date_determined` مطلوب ولا يمكن أن يكون تاريخًا مستقبليًا** — تاريخ مستقبلي يسبب خطأ 422.
- **`code` يُنشَأ تلقائيًا** — لا ترسله في POST. أعد الجلب بعد الإنشاء إذا كنت بحاجة إلى عرضه.
- **لا يوجد تحديث لمفتاح أجنبي للحالة على المباني موثق.** جدول البحث `infrastructure-conditions` موجود ولكن نقطة النهاية `institution-buildings` لا تعرض `infrastructure_condition_id` في سطح الكتابة الموثق لها. لا تحاول إجراء تحديثات للحالة على المباني باستخدام PUT — سيتم تجاهل الحقل بصمت أو سيسبب خطأ 422.
- **لا يوجد `academic_period_id`** على هذا المورد.

---

## مثال على الاستعلام

> *"قمنا بترميم مرحاضين في مبنى الفتيات. بدأ العمل في 10 أبريل، واكتمل في 15 أبريل."*

1. `openemis_get { resource: "institution-buildings", params: { institution_id: 6 } }` → "Girls' Sanitation Block" (id: 14)
2. `openemis_create { resource: "infrastructure-needs", body: { name: "Girls' Sanitation Block — 2 Toilets Restored", description: "Replaced cisterns and flush fittings in 2 female toilets. Block identified as Building 14.", date_determined: "2025-04-01", date_started: "2025-04-10", date_completed: "2025-04-15" } }`