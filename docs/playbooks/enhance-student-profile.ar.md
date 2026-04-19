# تعزيز ملف الطالب بالجهات الاتصال والجنسية والاحتياجات الخاصة

**المجال:** الطالب  
**الجمهور:** معلم، مدير، مرشد  
**معرف الدليل:** `enhance-student-profile`

## الوصف

قم بتعزيز عرض ملف الطالب الحالي من خلال جلب تفاصيل الاتصال المباشرة، وتعيينات الجنسية، وتقييمات الاحتياجات الخاصة، وخطط الاحتياجات الخاصة. جميع موارد التعزيز الأربعة تُرشَّح بواسطة `security_user_id` (معرف المستخدم العام للطالب من `security_users`)، **وليس** بواسطة `student_id` (المفتاح الخارجي للتسجيل). النتائج الفارغة للاحتياجات الخاصة صالحة — معظم الطلاب ليس لديهم سجلات.

---

## الموارد المستخدمة

| المورد | الغرض |
|---|---|
| `institution-students` | تأكيد التسجيل النشط وحل `security_user_id` |
| `user-contacts` | أرقام الهواتف وعناوين البريد الإلكتروني |
| `user-nationalities` | تعيينات الجنسية (تدعم ازدواجية الجنسية) |
| `user-special-needs-assessments` | تقييمات الاحتياجات التعليمية الخاصة (SEN) |
| `user-special-needs-plans` | الخطط التعليمية الفردية (IEP) أو خطط مماثلة |

---

## الخطوات

| الخطوة | الإجراء | المورد | الغرض |
|---|---|---|---|
| 1 | `openemis_get` | `institution-students` | تأكيد التسجيل النشط؛ التقاط `security_user_id` |
| 2 | `openemis_get` | `user-contacts` | جلب تفاصيل الاتصال بالهاتف/البريد الإلكتروني |
| 3 | `openemis_get` | `user-nationalities` | جلب تعيينات الجنسية |
| 4 | `openemis_get` | `user-special-needs-assessments` | جلب تقييمات الاحتياجات التعليمية الخاصة (SEN) |
| 5 | `openemis_get` | `user-special-needs-plans` | جلب خطط الاحتياجات التعليمية الخاصة (SEN) / الخطط التعليمية الفردية (IEP) |

---

## ملاحظات الخطوات

**الخطوة 1 — تأكيد التسجيل وحل `security_user_id`**  
الترشيح بواسطة `student_id` و `student_status_id=1`. حقل `student_id` في `institution-students` **هو** نفسه `security_user_id` (مفتاح خارجي إلى `security_users`). قم بالتقاطه — جميع الخطوات من 2 إلى 5 تُرشَّح بواسطة `security_user_id`.

**الخطوة 2 — تفاصيل الاتصال**  
الترشيح بواسطة `security_user_id` — معرف المستخدم العام من الخطوة 1. لا تُرشِّح بواسطة `student_id` وحده — `user-contacts` هو جدول مستخدم عام والمفتاح الخارجي هو `security_user_id`. قم بحل `contact_type_id` عبر `/api/v5/contact-types` للحصول على تسميات قابلة للقراءة (مثل "جوال"، "بريد إلكتروني"). `preferred=true/1` يُحدِّد جهة الاتصال الأساسية لكل نوع.

**الخطوة 3 — تعيينات الجنسية**  
الترشيح بواسطة `security_user_id`. وجود صفوف متعددة صالح (ازدواجية الجنسية). استخدم `preferred=true` لتحديد الجنسية الأساسية. قم بحل `nationality_id` عبر `/api/v5/nationalities` للحصول على اسم الدولة.

**الخطوة 4 — تقييمات الاحتياجات التعليمية الخاصة (SEN)**  
الترشيح بواسطة `security_user_id`. **النتيجة الفارغة صالحة وشائعة** — معظم الطلاب ليس لديهم تقييمات للاحتياجات التعليمية الخاصة. قم بحل `special_need_type_id` عبر `/api/v5/special-need-types` و `special_need_difficulty_id` عبر `/api/v5/special-need-difficulties` للحصول على تسميات قابلة للقراءة. `file_content` يكون دائمًا `null` في استجابات القائمة — استدعِ `GET /{id}` إذا كان الملف مطلوبًا.

**الخطوة 5 — خطط الاحتياجات التعليمية الخاصة (SEN)**  
الترشيح بواسطة `security_user_id` واختياريًا `academic_period_id`.  
> ⚠️ **الإملاء:** حقل المفتاح الخارجي في هذا المورد هو `special_needs_plan_types_id` (جمع "needs") — **وليس** `special_need_plan_type_id` (مفرد). استخدام الإملاء الخاطئ سيفشل بصمت. النتيجة الفارغة صالحة — معظم الطلاب ليس لديهم خطط. `file_content` يكون دائمًا `null` في استجابات القائمة.

---

## المزالق الرئيسية

- **جميع موارد التعزيز الأربعة تستخدم `security_user_id`** كمفتاح ترشيح — المفتاح الخارجي العام للطالب إلى `security_users`. عمود `institution-students.student_id` هو نفسه `security_user_id`.
- **النتائج الفارغة متوقعة وصالحة** لموارد الاحتياجات الخاصة. لا تعامل المصفوفة الفارغة على أنها خطأ — معظم الطلاب ليس لديهم تقييمات أو خطط للاحتياجات التعليمية الخاصة.
- **إملاء المفتاح الخارجي لـ `user-special-needs-plans`:** `special_needs_plan_types_id` (جمع). قم بحله عبر `/api/v5/special-needs-plan-types`.
- **`file_content` يكون دائمًا `null` في استجابات القائمة** لكلا موردي الاحتياجات التعليمية الخاصة — لتوفير عرض النطاق الترددي. استدعِ `GET /{id}` على سجل محدد لاسترداد الملف بصيغة base64.
- **يمكن جلب الخطوات 2–5 بالتوازي** بمجرد معرفة `security_user_id` من الخطوة 1.

---

## مثال على الاستعلام

> *"أعطني الملف الكامل للطالب أحمد — جهات الاتصال، الجنسية، وأي سجلات للاحتياجات الخاصة."*

1. `openemis_get { resource: "institution-students", params: { student_id: 102, student_status_id: 1 } }` → security_user_id=102
2. `openemis_get { resource: "user-contacts", params: { security_user_id: 102 } }` → mobile +60-11-222-3333
3. `openemis_get { resource: "user-nationalities", params: { security_user_id: 102 } }` → Malaysian (preferred)
4. `openemis_get { resource: "user-special-needs-assessments", params: { security_user_id: 102 } }` → [] (none)
5. `openemis_get { resource: "user-special-needs-plans", params: { security_user_id: 102 } }` → [] (none)