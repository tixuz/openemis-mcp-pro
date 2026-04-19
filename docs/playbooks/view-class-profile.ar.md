# عرض الملف الشخصي الكامل للصف

**المجال:** الطالب  
**الجمهور:** معلم، مدير  
**معرف الدليل:** `view-class-profile`

## الوصف

عرض الملف الشخصي للصف: تعيين مستوى الصف، قائمة الطلاب المسجلين، المواد النشطة، وملخص الحضور الشهري. يستخدم مورد الحضور مفتاحًا أوليًا مركبًا — لا يوجد حقل `id` رقمي؛ استخدم دائمًا عوامل التصفية من نوع القائمة لجلب البيانات.

---

## الموارد المستخدمة

| المورد | الغرض |
|---|---|
| `institution-class-grades` | تحديد مستوى الصف التعليمي الذي ينتمي إليه هذا الصف |
| `institution-class-students` | جميع الطلاب المسجلين حاليًا في الصف |
| `institution-class-subjects` | المواد التي يتم تدريسها بشكل نشط في هذا الصف |
| `institution-class-attendance-records` | ملخص الحضور الشهري (أعداد الطلاب الحاضرين يوميًا) |

---

## الخطوات

| الخطوة | الإجراء | المورد | الغرض |
|---|---|---|---|
| 1 | `openemis_get` | `institution-class-grades` | تحديد مستوى الصف لهذا الصف |
| 2 | `openemis_get` | `institution-class-students` | سرد الطلاب المسجلين |
| 3 | `openemis_get` | `institution-class-subjects` | سرد المواد النشطة |
| 4 | `openemis_get` | `institution-class-attendance-records` | ملخص الحضور الشهري |

---

## ملاحظات الخطوات

**الخطوة 1 — تعيين صف الصف**  
قم بالتصفية حسب `institution_class_id`. يُرجع `education_grade_id` — وهو جدول تعيين (صف ↔ مستوى). عادةً ما يكون هناك صف واحد لكل صف، ولكن التكوينات متعددة المستويات صالحة.

**الخطوة 2 — الطلاب المسجلون**  
قم بالتصفية حسب `institution_class_id` و `academic_period_id`. اضبط `student_status_id=1` لإرجاع الطلاب المسجلين حاليًا فقط. هذا جدول ارتباط — حقل `id` هنا هو معرف سجل التسجيل، وليس معرف الطالب. `student_id` هو المفتاح الخارجي لـ `security_users`.

**الخطوة 3 — المواد النشطة**  
قم بالتصفية حسب `institution_class_id` و `status=1` لإرجاع المواد النشطة فقط. أسماء المواد غير مدرجة — فقط المفتاح الخارجي `institution_subject_id`. قم بتحديد الأسماء بشكل منفصل عبر `institution-subjects` إذا لزم الأمر.

**الخطوة 4 — ملخص الحضور الشهري**  
> ⚠️ **هام:** `institution-class-attendance-records` **ليس له حقل `id` رقمي**. مفتاحه الأولي مركب: `(institution_class_id, academic_period_id, year, month)`. **لا تمرر أبدًا** معامل `id=` — سيعيد فارغًا أو خطأ.

استخدم عوامل التصفية القائمة فقط:
```
?institution_class_id={id}&academic_period_id={period}&year={year}&month={month}
```
بدلاً من ذلك، استخدم مسار المفتاح المركب:
```
GET /institution-class-attendance-records/institution_class_id/{X}/academic_period_id/{Y}/year/{Z}/month/{M}
```
تحتفظ الحقول من `day_1` إلى `day_31` بعدد الحاضرين يوميًا؛ `null` يعني أنه لم يتم تقديم الحضور لذلك اليوم بعد.

---

## المشاكل الشائعة الرئيسية

- **المفتاح الأولي المركب — لا يوجد معرف رقمي.** المفتاح الأولي لـ `institution-class-attendance-records` هو `(institution_class_id, academic_period_id, year, month)`. أي استدعاء يستخدم عامل تصفية `id=` رقميًا عاديًا سيفشل بصمت أو يعيد بيانات خاطئة.
- **المجاميع الشهرية فقط.** يحتفظ هذا المورد بعدد الحاضرين لكل يوم. إنه **ليس** سجل الغياب لكل طالب — للغياب الفردي استخدم `student-attendance-marked-records`.
- **الحقول اليومية `null` ≠ صفر.** تُرجع الحقول `day_X` قيمة `null` للأيام التي لم يُقدم فيها الحضور — عالجها على أنها `معلق`، وليس `0 غائب`.

---

## مثال على الاستعلام

> *"أرني الملف الشخصي للصف 8A للفترة الأكاديمية الحالية."*

1. `openemis_get { resource: "institution-class-grades", params: { institution_class_id: 42 } }` → الصف 8
2. `openemis_get { resource: "institution-class-students", params: { institution_class_id: 42, academic_period_id: 1, student_status_id: 1 } }` → 28 طالبًا
3. `openemis_get { resource: "institution-class-subjects", params: { institution_class_id: 42, status: 1 } }` → 7 مواد
4. `openemis_get { resource: "institution-class-attendance-records", params: { institution_class_id: 42, academic_period_id: 1, year: 2024, month: 3 } }` → الأعداد اليومية لشهر مارس 2024