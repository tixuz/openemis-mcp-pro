---
title: عرض البنية التحتية للمؤسسة في OpenEMIS
description: يشرح هذا الدليل الإجرائي لـ OpenEMIS كيفية استرجاع بيانات الأراضي والمباني والمرافق والمياه والصرف الصحي لمؤسسة من نظام إدارة المدارس.
keywords:
  - OpenEMIS
  - نظام إدارة المدارس
  - إدارة التعليم
---

# عرض البنية التحتية للمؤسسة في OpenEMIS (الأراضي، المباني، المرافق، المياه والصرف الصحي)

**المجال:** المؤسسة  
**الجمهور:** مدير النظام، مسؤولي المرافق  
**معرف دليل التشغيل:** `view-institution-infrastructure`

## الوصف

عرض البنية التحتية المادية للمؤسسة: قطع الأراضي، المباني لكل قطعة أرض، المرافق (الكهرباء)، وسجلات المياه والصرف الصحي والنظافة (WASH). **الأراضي والمباني ليست محددة النطاق بواسطة `academic_period_id`** — تمت إزالة هذا الحقل في POCOR-8037. أما المرافق وسجلات المياه والصرف الصحي والنظافة فهي محددة النطاق بواسطة `academic_period_id`.

---

## الموارد المستخدمة

| المورد | الغرض |
|---|---|
| `institution-lands` | قطع الأراضي المسجلة للمؤسسة (بدون نطاق فترة أكاديمية) |
| `institution-buildings` | المباني المتداخلة تحت كل قطعة أرض (بدون نطاق فترة أكاديمية) |
| `infrastructure-statuses` | بحث عام: رموز الحالة IN_USE, END_OF_USAGE, CHANGE_IN_TYPE |
| `infrastructure-conditions` | بحث عام: تسميات الحالة (جيد، متوسط، سيئ، إلخ.) |
| `land-types` | بحث عام: تسميات أنواع الأراضي |
| `building-types` | بحث عام: تسميات أنواع المباني |
| `infrastructure-utility-electricities` | سجلات مرافق الكهرباء (محددة النطاق بالمؤسسة + الفترة الأكاديمية) |
| `infrastructure-wash-waters` | سجلات إمدادات المياه وجودتها (محددة النطاق بالمؤسسة + الفترة الأكاديمية) |
| `infrastructure-wash-sanitations` | أعداد مرافق الصرف الصحي حسب الجنس والوظيفية |

---

## الخطوات

| الخطوة | الإجراء | المورد | الغرض |
|---|---|---|---|
| 1 | `openemis_get` | `institution-lands` | سرد قطع الأراضي النشطة |
| 2 | `openemis_get` | `institution-buildings` | سرد المباني لكل قطعة أرض |
| 3 | `openemis_get` | `infrastructure-statuses` + جداول البحث | حل معرفات الحالة، والنوع، والشرط (بالتوازي) |
| 4 | `openemis_get` | `infrastructure-utility-electricities` | سجلات مرافق الكهرباء |
| 5 | `openemis_get` | `infrastructure-wash-waters` | سجلات المياه والصرف الصحي والنظافة للمياه |
| 6 | `openemis_get` | `infrastructure-wash-sanitations` | أعداد مرافق الصرف الصحي للمياه والصرف الصحي والنظافة |

---

## ملاحظات الخطوات

**الخطوة 1 — قطع الأراضي النشطة**  
قم بالتصفية حسب `institution_id`. **لا** تمرر `academic_period_id` — تمت إزالته من هذا المورد في POCOR-8037 وسيقوم بصمت بعدم فعل شيء أو التسبب بأخطاء. للحصول على القطع النشطة فقط، قم أيضًا بتصفية `land_status_id` لمطابقة رمز `IN_USE` من `infrastructure-statuses`. يتم حل `land_type_id` و `infrastructure_condition_id` لكل سجل في الخطوة 3.

**الخطوة 2 — المباني لكل أرض**  
قم بالتصفية حسب `institution_id` (جميع المباني) أو `institution_land_id` (مباني قطعة أرض واحدة). نفس القاعدة: **لا يوجد `academic_period_id`**. قم بالتصفية حسب `building_status_id` للسجلات ذات `IN_USE`. يتم حل `building_type_id` و `infrastructure_condition_id` لكل مبنى في الخطوة 3. يجب أن تكون مساحة المبنى أقل من مساحة الأرض الأم (يتم فرض ذلك بواسطة واجهة برمجة التطبيقات API).

**الخطوة 3 — حل جداول البحث** *(يمكن تشغيلها بالتوازي)*  
قم بجلب `infrastructure-statuses`، و`infrastructure-conditions`، و`land-types`، و`building-types` في وقت واحد — جميعها قوائم مرجعية عامة بدون عامل تصفية `institution_id` أو `academic_period_id`.

> ⚠️ **تسمية المفتاح الخارجي للحالة خاصة بالمستوى:** `land_status_id` للأراضي، `building_status_id` للمباني — كلاهما يشير إلى نفس جدول `infrastructure_statuses`. لا تخلط بين أسماء هذه المفاتيح الخارجية.

**الخطوة 4 — مرافق الكهرباء**  
قم بالتصفية حسب `institution_id` و `academic_period_id` (كلاهما مطلوب — على عكس الأراضي/المباني، المرافق محددة النطاق بالفترة). قم أيضًا بتصفية `is_current=1` لاستبعاد السجلات المحذوفة بشكل غير دائم (تمت إضافة العلامة في POCOR-9475). قم بحل `utility_electricity_type_id` عبر `/api/v5/utility-electricity-types`.

**الخطوة 5 — المياه والصرف الصحي والنظافة للمياه**  
قم بالتصفية حسب `institution_id` و `academic_period_id`. جميع أعمدة المفتاح الخارجي تتبع النمط `infrastructure_wash_water_*_id` (النوع، الوظيفية، القرب، الكمية، الجودة، إمكانية الوصول). قم بحل كل منها عبر نقطة النهاية المرجعية المطابقة `/api/v5/infrastructure-wash-water-*`.

**الخطوة 6 — المياه والصرف الصحي والنظافة للمرافق الصحية**  
قم بالتصفية حسب `institution_id` و `academic_period_id`. حقول العدد: `infrastructure_wash_sanitation_{gender}_{status}` — على سبيل المثال `male_functional`، `female_nonfunctional`، `mixed_functional`. أعمدة `total_male`، `total_female`، `total_mixed` **يتم حسابها تلقائيًا بواسطة الخلفية** في `beforeSave` — لا تحاول الكتابة إليها. يمكن جلب الخطوات 4–6 بالتوازي بمجرد معرفة `institution_id` و `academic_period_id`.

---

## المحاذير الرئيسية

- **`institution-lands` و `institution-buildings` ليس لديهما عامل تصفية `academic_period_id`** — تمت إزالته في POCOR-8037. لا تمرره أبدًا لهذين الموردين.
- **يختلف المفتاح الخارجي للحالة حسب المستوى:** `land_status_id` للأراضي، `building_status_id` للمباني — نفس جدول `infrastructure_statuses`، أسماء أعمدة مختلفة.
- **`infrastructure_ownership_id`** هو اسم المفتاح الخارجي الصحيح على كل من الأراضي والمباني (وليس `ownership_id`).
- **المرافق والمياه والصرف الصحي والنظافة تتطلب `academic_period_id`** — على عكس البنية التحتية الأساسية.
- **إجماليات المرافق الصحية للقراءة فقط** — يتم حسابها تلقائيًا بواسطة الخلفية.

---

## مثال على الاستعلام

> *"أرني البنية التحتية المادية لمدرسة أفوري الابتدائية — الأراضي، المباني، الكهرباء، والمياه."*

1. `openemis_get { resource: "institution-lands", params: { institution_id: 6 } }` → قطعتا أرض (land_status_id → IN_USE)
2. `openemis_get { resource: "institution-buildings", params: { institution_id: 6 } }` → 4 مباني
3. جلب `infrastructure-statuses`، `infrastructure-conditions`، `land-types`، `building-types` بالتوازي → حل جميع المعرفات
4. `openemis_get { resource: "infrastructure-utility-electricities", params: { institution_id: 6, academic_period_id: 1, is_current: 1 } }` → كهرباء شبكة، حالة جيدة
5. `openemis_get { resource: "infrastructure-wash-waters", params: { institution_id: 6, academic_period_id: 1 } }` → مياه موصولة بالأنابيب، وظيفية
6. `openemis_get { resource: "infrastructure-wash-sanitations", params: { institution_id: 6, academic_period_id: 1 } }` → 4 مراحيض ذكور، 4 مراحيض إناث وظيفية