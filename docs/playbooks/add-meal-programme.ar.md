---
title: إضافة برنامج وجبات جديد إلى مؤسسة في OpenEMIS
description: يشرح هذا الدليل الإجرائي لـ OpenEMIS كيفية إنشاء برنامج وجبات جديد في مؤسسة باستخدام أدوات الكتابة في نظام إدارة المدارس.
keywords:
  - OpenEMIS
  - نظام إدارة المدارس
  - إدارة التعليم
---

# إضافة برنامج وجبات جديد إلى مؤسسة في OpenEMIS

**المجال:** الوجبات  
**الجمهور:** مدير النظام، محاسب، أخصائي تغذية  
**معرف الدليل التشغيلي:** `add-meal-programme`

## الوصف

إنشاء تعريف جديد لبرنامج وجبات وتعيينه لمؤسسة. التدفق من خطوتين: أولاً إنشاء سجل البرنامج العام (`meal-programmes`)، ثم تسجيل تعيين التسليم على مستوى المؤسسة (`institution-meal-programmes`). لا يوجد مكون إضافي لسير العمل — كلا الإجراءين الكتابيين مباشر وفوري. يمكن ربط أهداف التغذية وتسجيل طلاب محددين بشكل اختياري.

> ⚠️ **فخ الاسم المستعار للمفتاح الخارجي:** الحقلان `type` و `targeting` في `meal-programmes` هما **قيم تعداد نصية**، وليسا معرفات رقمية. أرسل النص (مثل `"Lunch"`، `"All Students"`) — وليس معرفًا من جدول بحث.  
> ⚠️ **اسم المفتاح الخارجي بصيغة الجمع:** المفتاح الخارجي لـ `meal-programmes` في كل من `institution-meal-programmes` و `meal-nutritional-records` هو **`meal_programmes_id`** (بحرف `s` في النهاية) — وليس `meal_programme_id`. استخدام الصيغة المفردة يؤدي إلى فشل صامت أو خطأ 422.

---

## أسئلة يجب طرحها أولاً

| السؤال | الحقل | المورد | ملاحظات |
|---|---|---|---|
| اسم البرنامج؟ | `name` | meal-programmes | مثال: "برنامج غداء حكومي 2025" |
| الرمز المختصر؟ | `code` | meal-programmes | فريد، مثال: `GLP-2025` |
| نوع الوجبة؟ (إفطار / غداء / وجبة خفيفة / عشاء) | `type` | meal-programmes | قيمة نصية — استرجاع من `meal-programme-types` لرؤية الخيارات الصالحة |
| من المستفيد؟ (جميع الطلاب / الفئات الضعيفة / الصفوف الابتدائية…) | `targeting` | meal-programmes | قيمة نصية — استرجاع من `meal-target-types` |
| تاريخ البدء؟ | `start_date` | meal-programmes | YYYY-MM-DD |
| تاريخ الانتهاء؟ | `end_date` | meal-programmes | YYYY-MM-DD، يجب أن يكون ≥ تاريخ البدء |
| الفترة الأكاديمية؟ | `academic_period_id` | meal-programmes | الحصول عليها عبر `academic-periods` |
| تاريخ التسليم في هذه المدرسة؟ | `date_received` | institution-meal-programmes | YYYY-MM-DD — عندما يصل البرنامج أولاً إلى المدرسة |
| الكمية المتوقعة / عدد الطلاب؟ | `quantity_received` | institution-meal-programmes | عدد صحيح |

---

## الموارد المستخدمة

| المورد | الغرض |
|---|---|
| `academic-periods` | بحث: معرف الفترة الأكاديمية النشطة |
| `meal-programme-types` | بحث: القيم النصية الصالحة لحقل `type` |
| `meal-target-types` | بحث: القيم النصية الصالحة لحقل `targeting` |
| `meal-implementers` | بحث: اسم المنفذ → المعرف (لـ `institution-meal-programmes`) |
| `meal-programmes` | كتابة: إنشاء تعريف البرنامج العام |
| `institution-meal-programmes` | كتابة: تعيين / تسجيل التسليم في المؤسسة |
| `meal-nutritional-records` | كتابة (اختياري): ربط أهداف التغذية بالبرنامج |

---

## الخطوات

| الخطوة | الإجراء | المورد | الغرض |
|---|---|---|---|
| 1 | `openemis_get` | `academic-periods` | الحصول على `academic_period_id` النشط |
| 2 | `openemis_get` | `meal-programme-types` | عرض قيم `type` النصية الصالحة |
| 3 | `openemis_get` | `meal-target-types` | عرض قيم `targeting` النصية الصالحة |
| 4 | `openemis_create` | `meal-programmes` | إنشاء سجل البرنامج العام |
| 5 | `openemis_create` | `institution-meal-programmes` | تعيين / تسجيل التسليم في هذه المؤسسة |
| 6 | `openemis_create` (اختياري) | `meal-nutritional-records` | ربط كل هدف تغذوي |

---

## ملاحظات الخطوات

**الخطوات 1–3 — عمليات البحث**  
استرجاع الفترة الأكاديمية باستخدام عامل التصفية `current = 1` أو الاختيار حسب الاسم. بالنسبة لـ `meal-programme-types` و `meal-target-types`، اعرض جميع القيم — اعرض سلاسل `name` للمستخدم واستخدم السلسلة المحددة في جسم طلب POST (وليس المعرف).

**الخطوة 4 — إنشاء البرنامج العام**

```json
POST /api/v5/meal-programmes
{
  "academic_period_id": 12,
  "name":               "Government Lunch Programme 2025",
  "code":               "GLP-2025",
  "type":               "Lunch",
  "targeting":          "All Students",
  "start_date":         "2025-01-06",
  "end_date":           "2025-11-28"
}
```

الاستجابة: تحتوي على `id` كـ `meal_programmes_id` للخطوة التالية.

**الخطوة 5 — التعيين للمؤسسة**

```json
POST /api/v5/institution-meal-programmes
{
  "academic_period_id":  12,
  "meal_programmes_id":  1047,
  "institution_id":      6,
  "date_received":       "2025-01-06",
  "quantity_received":   420
}
```

> ⚠️ قيد فريد على `(institution_id, date_received, meal_programmes_id)` — التسليمات المكررة لنفس المدرسة + التاريخ + البرنامج تعيد خطأ 409 تعارض.

**الخطوة 6 — ربط أهداف التغذية (اختياري)**

```json
POST /api/v5/meal-nutritional-records
{
  "meal_programmes_id":     1047,
  "nutritional_content_id": 10
}
```

كرر لكل مكون تغذوي. احصل على `nutritional_content_id` عبر `GET /api/v5/meal-nutritions`.

---

## المزالق الرئيسية

- **`type` و `targeting` قيم نصية**، وليست معرفات رقمية — استخدم سلسلة الاسم من `meal-programme-types` / `meal-target-types`، وليس `id` من جدول البحث.
- **`meal_programmes_id` بحرف `s` في النهاية** — اسم حقل المفتاح الخارجي في `institution-meal-programmes` و `meal-nutritional-records`. استخدام `meal_programme_id` (بدون `s`) يؤدي إلى فشل صامت أو إرجاع خطأ 422.
- **`nutritional_content_id`** (وليس `meal_nutrition_id` أو `nutrition_id`) — فخ مفتاح خارجي مؤكد من دليل التشغيل للقراءة، تم التحقق منه في سطح الكتابة.
- **`meal-implementers` يحتوي على حقول FieldOption** (`visible`, `order`, `default`) — قم بتضمينها في طلب PUT لتجنب إعادة التعيين إلى قيمة فارغة.
- **لا يوجد مكون إضافي لسير العمل** — كتابات الوجبات مباشرة ولا تتطلب موافقة أو خطوات سير عمل.
- **خطأ 409 عند التسليم المكرر** — القيد الفريد هو `(institution_id, date_received, meal_programmes_id)`، وليس قائمًا على الفترة.

---

## مثال على الاستعلام

> *"إضافة برنامج غداء حكومي لجميع الطلاب في مدرسة أفوري الابتدائية، يبدأ في يناير 2025، بالرمز GLP-2025."*

1. `openemis_get { resource: "academic-periods", params: { current: 1 } }` → id: 12
2. `openemis_get { resource: "meal-programme-types" }` → "Breakfast", "Lunch", "Snack"
3. `openemis_get { resource: "meal-target-types" }` → "All Students", "Vulnerable", "Primary"
4. `openemis_create { resource: "meal-programmes", body: { academic_period_id: 12, name: "Government Lunch Programme 2025", code: "GLP-2025", type: "Lunch", targeting: "All Students", start_date: "2025-01-06", end_date: "2025-11-28" } }` → id: 1047
5. `openemis_create { resource: "institution-meal-programmes", body: { academic_period_id: 12, meal_programmes_id: 1047, institution_id: 6, date_received: "2025-01-06", quantity_received: 420 } }`