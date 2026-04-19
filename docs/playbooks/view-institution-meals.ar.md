# عرض برامج الوجبات المدرسية ومشاركة الطلاب

**المجال:** المؤسسة التعليمية  
**الجمهور المستهدف:** مدير النظام، أخصائي التغذية، ولي الأمر  
**معرف دليل التشغيل:** `view-institution-meals`

## الوصف

عرض برامج الوجبات التي تديرها المؤسسة التعليمية، ومحتواها الغذائي، والطلاب المسجلين فيها. يتم تحديد النطاق باستخدام `institution_id` و `academic_period_id`. نقطة انتباه رئيسية: في `meal-nutritional-records` فإن المفتاح الخارجي (FK) لجدول `meal_nutritions` هو `nutritional_content_id` — **وليس** `meal_nutrition_id`.

---

## الموارد المستخدمة

| المورد | الغرض |
|---|---|
| `institution-meal-programmes` | برامج الوجبات التي تديرها المؤسسة في الفترة الأكاديمية الحالية |
| `meal-programme-types` | قائمة مرجعية عامة: تسميات أنواع البرامج |
| `meal-implementers` | قائمة مرجعية عامة: المنظمات المنفذة |
| `meal-nutritional-records` | جدول الربط الذي يربط البرامج بالمحتوى الغذائي |
| `meal-benefits` | قائمة مرجعية عامة: تسميات أنواع المزايا |
| `institution-meal-students` | سجلات مشاركة الطلاب في الوجبات لكل يوم |

---

## الخطوات

| الخطوة | الإجراء | المورد | الغرض |
|---|---|---|---|
| 1 | `openemis_get` | `institution-meal-programmes` | سرد برامج الوجبات النشطة لهذه المؤسسة/الفترة |
| 2 | `openemis_get` | `meal-programme-types` + القوائم المرجعية | حل معرفات النوع والمنفذ والمزايا (بالتوازي) |
| 3 | `openemis_get` | `meal-nutritional-records` | جلب المحتوى الغذائي لكل برنامج |
| 4 | `openemis_get` | `institution-meal-students` | سرد سجلات مشاركة الطلاب |

---

## ملاحظات الخطوات

**الخطوة 1 — برامج الوجبات بالمؤسسة**  
الترشيح باستخدام `institution_id` و `academic_period_id`. الجدول الأساسي هو `meal_institution_programmes` (وليس `institution_meal_programmes`). كل سجل يرتبط بـ `meal_programme_id` — احتفظ بهذه القيمة للخطوة 3.

> ⚠️ **أسماء مفاتيح خارجية غير قياسية:** قد تظهر الارتباطات الخاصة بنوع البرنامج والفئة المستهدفة والمنفذ في استجابات API كـ `type` و `targeting` و `implementer` بدلاً من اللواحق المعتادة `_type_id`. افحص مفاتيح الاستجابة الفعلية قبل بناء عوامل تصفية إضافية.

**الخطوة 2 — حل القوائم المرجعية** *(تشغيل بالتزامن)*  
جلب `meal-programme-types` و `meal-implementers` و `meal-benefits` في نفس الوقت — جميعها قوائم مرجعية عامة.  
> ملاحظة: `meal-implementers` **لا** تستخدم سلوك FieldOption. تحتوي فقط على `id` و `name` — ولا تحتوي على حقول `visible` أو `order` أو `default`.

**الخطوة 3 — السجلات الغذائية**  
الترشيح باستخدام `meal_programme_id` (من الخطوة 1).

> ⚠️ **فخ المفتاح الخارجي الحرج:** المفتاح الخارجي (FK) لجدول `meal_nutritions` في هذا المورد هو `nutritional_content_id` — **وليس** `meal_nutrition_id`. استخدام الاسم الخاطئ سيعيد نتائج فارغة بصمت. قم بحل `nutritional_content_id` عبر `/api/v5/meal-nutritions` للحصول على اسم المغذيات (مثل البروتين، الكربوهيدرات، السعرات الحرارية، الدهون).

يعمل `meal-nutritional-records` كجدول ربط (belongsToMany بين البرامج والمغذيات). قد يحتوي على مفتاح أساسي مركب (`meal_programme_id` + `nutritional_content_id`) بدون `id` عدد صحيح مستقل — لا تستعلم عنه باستخدام معرف رقمي عادي.

**الخطوة 4 — مشاركة الطلاب**  
مورد API `institution-meal-students` يطابق جدول `student_meal_marked_records` — هذه سجلات **يومية** لحضور الوجبات، وليست قائمة تسجيل ثابتة. قم بالترشيح باستخدام `institution_id` و `academic_period_id`، واختياريًا `institution_class_id` أو `meal_programme_id`. يسجل حقل `date` تاريخ المشاركة المحدد. يشير `meal_benefit_id` إلى نوع الميزة — قم بحلها عبر `meal-benefits` من الخطوة 2.

---

## نقاط الانتباه الرئيسية

- **`nutritional_content_id`** هو المفتاح الخارجي (FK) لـ `meal_nutritions` في `meal-nutritional-records` — وليس `meal_nutrition_id`. هذا هو الفخ الأكثر شيوعًا للفشل الصامت.
- **`institution-meal-students` هي بيانات يومية**، وليست قائمة تسجيل. قم بالترشيح باستخدام `date` للحصول على عدد المشاركات ليوم محدد.
- **`meal-implementers` لا تحتوي على حقول FieldOption** (الحقول `visible` و `order` و `default` غير موجودة في هذا المورد).
- **غموض أسماء المفاتيح الخارجية** في `institution-meal-programmes`: قد تستخدم ارتباطات نوع البرنامج والفئة المستهدفة والمنفذ مفاتيح مختصرة (`type` و `targeting` و `implementer`) بدلاً من اللواحق `_type_id` في استجابات API.
- كل من `institution_id` و `academic_period_id` مطلوبان لـ `institution-meal-programmes` و `institution-meal-students`.

---

## مثال على الاستعلام

> *"ما هي برامج الوجبات التي تديرها مدرسة أفوري الابتدائية هذا العام، وما هو محتواها الغذائي؟"*

1. `openemis_get { resource: "institution-meal-programmes", params: { institution_id: 6, academic_period_id: 1 } }` → برنامجان (تغذية مدرسية، تكميلية)
2. جلب `meal-programme-types` و `meal-implementers` و `meal-benefits` بالتزامن → حل التسميات
3. `openemis_get { resource: "meal-nutritional-records", params: { meal_programme_id: 3 } }` → بروتين 15 جم، كربوهيدرات 45 جم، سعرات حرارية 280 كيلو كالوري (باستخدام nutritional_content_id لحل الأسماء)
4. `openemis_get { resource: "institution-meal-students", params: { institution_id: 6, academic_period_id: 1, meal_programme_id: 3 } }` → 312 سجل طالب-يوم هذا الفصل الدراسي