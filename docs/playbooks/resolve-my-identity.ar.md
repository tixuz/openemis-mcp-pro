---
title: حل هويتي في OpenEMIS
description: يشرح هذا الدليل الإجرائي لـ OpenEMIS كيفية تحديد هوية المستخدم المصادق عليه حاليًا في نظام إدارة المدارس وربط تسجيل الدخول بسجل الموظف.
keywords:
  - OpenEMIS
  - نظام إدارة المدارس
  - إدارة التعليم
---

# حل هويتي في OpenEMIS (من أنا في OpenEMIS؟)

**المجال:** المصادقة (Auth)  
**الجمهور:** معلم، مدير، موظف  
**معرف دليل التشغيل:** `resolve-my-identity`

## الوصف

بعد تسجيل دخول المستخدم باستخدام `openemis_login({username, password})`، اكتشف من هو من منظور OpenEMIS: معرفه في `security_users.id`، واسمه الكامل، والمؤسسات التي تم تعيينه فيها، والأدوار/الصفوف التي يشغلها. هذا هو الجسر بين "لقد قمت بالمصادقة للتو" و"أرني ما يخصني" — فبدونه يعرف الوكيل سلسلة اسم المستخدم فقط دون أي معلومات عما يمكن لهذا المستخدم رؤيته أو تدريسه أو إدارته.

قم بتشغيل هذا مباشرة بعد `openemis_login` (أو في بداية أي جلسة حيث يشير المستخدم إلى "خاصتي"، "لي"، "أنا"). قم بتخزين معرف المستخدم المحلول مؤقتًا لبقية المحادثة — لا تعيد الحل في كل مرة.

---

## الموارد المستخدمة

| المورد | الغرض |
|---|---|
| `security-users` | حل اسم المستخدم → معرف المستخدم، الاسم الأول/الأخير، البريد الإلكتروني |
| `institution-staff` | المؤسسات التي يكون فيها هذا المستخدم موظفًا نشطًا + نسبة الدوام الكامل + المنصب |
| `institution-positions` | حل `staff_position_title_id` → لقب قابل للقراءة البشرية (معلم، مدير، موارد بشرية، …) |
| `institutions` | حل أسماء المؤسسات من `institution_id` |
| `institution-classes` | صفوف الفصل الرئيسية لهذا المستخدم (`staff_id = user.id`) |
| `institution-classes-secondary-staff` | الصفوف الثانوية/المشتركة التدريس |
| `institution-subject-staff` | المواد التي يدرسها هذا المستخدم (صف واحد لكل (فصل، مادة، موظف)) |
| `security-group-users` | عضوية المجموعة الإدارية (منطقة، إقليم، أدوار النظام) |

---

## الخطوات

| الخطوة | الإجراء | المورد | الغرض |
|---|---|---|---|
| 1 | `openemis_whoami` | — | قراءة اسم المستخدم للجلسة الحالية |
| 2 | `openemis_get` | `security-users` | اسم المستخدم → معرف المستخدم + الاسم الأول/الأخير |
| 3 | `openemis_get` | `institution-staff` | في أي مؤسسات أنا موظف؟ |
| 4 | `openemis_get` | `institution-positions` | حل لقب منصبي لكل مؤسسة |
| 5 | `openemis_get` × 3 | `institution-classes` · `institution-classes-secondary-staff` · `institution-subject-staff` | الصفوف التي أدرسها (الفصل الرئيسي + الثانوي + المادة) |
| 6 | التجميع | — | إرجاع ملخص فقرة واحدة عن "من أنت" |

---

## ملاحظات الخطوات

**الخطوة 1 — فحص الجلسة**  
استدعِ `openemis_whoami` بدون معطيات. إذا كانت النتيجة تحتوي على `mode: "env-default"`، فإن المستخدم لم يستدعِ `openemis_login` بعد — الهوية الفعالة هي مستخدم ملف .env الخاص بالخادم، والذي قد يكون admin/admin في الحالات التجريبية. حذر قبل التعامل مع ذلك على أنه الهوية "الحقيقية". بالنسبة لجلسات المستخدم الفردية، تتضمن الاستجابة `username`.

**الخطوة 2 — اسم المستخدم → معرف المستخدم**  
`openemis_get('security-users', params: { _conditions: 'username:<username>', _fields: 'id,username,first_name,last_name,email,gender_id' })`. يُرجع صفًا واحدًا بالضبط في نسخة OpenEMIS مكونة بشكل صحيح (اسم المستخدم فريد). احفظ `id` — ستستخدمه في كل مكان أدناه. إذا لم يُرجع أي صفوف، فإن JWT لتسجيل الدخول صالح ولكن سجل المستخدم تم حذفه — اعرض هذا كخطأ.

**الخطوة 3 — التعيينات المؤسسية**  
`openemis_get('institution-staff', params: { _conditions: 'staff_id:<user_id>;staff_status_id:1', _fields: 'id,institution_id,institution_position_id,FTE,start_date,end_date', limit: 200 })`. `staff_status_id=1` يرشح للحالة المعين/النشط. عادةً ما يكون للمعلم النشط صف أو صفين (المؤسسة الرئيسية + مهمة اختيارية ثانية). FTE هي سلسلة عشرية ("1.00", "0.50")؛ حول إلى رقم عشري إذا كنت بحاجة إلى الجمع. لا توجد صفوف = المستخدم لديه تسجيل دخول ولكنه غير معين كموظف في أي مكان — غالبًا ما يكون هذا هو الحال لحسابات المدير.

**الخطوة 4 — لقب المنصب**  
لكل `institution_position_id` متميز من الخطوة 3، احصل على صف المنصب للحصول على `staff_position_title_id` الخاص به. ثم حل ذلك مقابل `staff-position-titles` للحصول على تسمية مثل "معلم"، "مدير"، "موارد بشرية". خزن تخطيط العنوان مؤقتًا لكل جلسة — نادرًا ما يتغير. جمّع باستخدام `?ids=`:
`openemis_get('institution-positions', params: { ids: '<csv of position ids>' })`.

**الخطوة 5 — الصفوف التي أدرسها (توسيع ثلاثي الاتجاهات)**  
الصفوف التي تشمل هذا المستخدم منتشرة عبر ثلاث جداول (نفس شكل `view-class-profile` الخطوة 5):

(أ) **الفصل الرئيسي** — `openemis_get('institution-classes', params: { _conditions: 'staff_id:<user_id>;academic_period_id:<current>', _fields: 'id,name,institution_id,education_grade_id,academic_period_id' })`. `staff_id` هنا هو المفتاح الخارجي لمعلم الفصل الرئيسي.

(ب) **المعلم الثانوي/المشارك** — `openemis_get('institution-classes-secondary-staff', params: { _conditions: 'security_user_id:<user_id>', _fields: 'id,institution_class_id' })`. ثم احصل على صفوف `institution-classes` المشار إليها باستخدام `?ids=`.

(ج) **معلم المادة** — `openemis_get('institution-subject-staff', params: { _conditions: 'security_user_id:<user_id>', _fields: 'id,institution_class_id,institution_subject_id' })`. وسّع لحل أسماء الصفوف + أسماء المواد باستخدام مكالمتين جماعيتين `?ids=`.

اجمع المجموعات الثلاث وأزل التكرار بواسطة `institution_class_id`. يجب أن يظهر الصف الذي يكون فيه المستخدم معلم الفصل الرئيسي ومعلم المادة مرة واحدة، مع سرد كلا الدورين.

**الخطوة 6 — الملخص**  
قم بتجميع إجابة فقرة واحدة مثل:

> أنت **{first_name} {last_name}** (معرف المستخدم {id}). أنت معين كـ **{position_title}** في **{institution_name}** {، وأيضًا في X إذا كان متعدد المؤسسات}. في هذه الفترة الأكاديمية لديك **{N}** صفوف: {class_1} (فصل رئيسي)، {class_2} (مادة: الرياضيات)، {class_3} (معلم مشارك)، …

استخدم هذا الملخص كسياق ضمني لأي سؤال متابعة يقول "طلابي"، "صفوفي"، "مؤسستي"، إلخ. — لا تعيد جلب هذه المعلومات في كل مرة.

---

## مثال على تسلسل الاستدعاء

```
1. openemis_login({ username: "teacher", password: "teacher" })
   → { ok: true, username: "teacher" }

2. openemis_whoami()
   → { mode: "per-user", username: "teacher", baseUrl: "https://demo.openemis.org/core" }

3. openemis_get("security-users", {
     params: { _conditions: "username:teacher", _fields: "id,first_name,last_name,email" }
   })
   → data: [{ id: 42, first_name: "Demo", last_name: "Teacher", email: "…" }]

4. openemis_get("institution-staff", {
     params: { _conditions: "staff_id:42;staff_status_id:1",
               _fields: "institution_id,institution_position_id,FTE" }
   })
   → data: [{ institution_id: 12, institution_position_id: 57, FTE: "1.00" }]

5. openemis_get("institution-classes", {
     params: { _conditions: "staff_id:42;academic_period_id:<current>",
               _fields: "id,name,education_grade_id" }
   })
   → data: [{ id: 203, name: "Grade 4 — Section A", education_grade_id: 8 }]
```

---

## المحاذير والملاحظات

- **الهوية الافتراضية للبيئة.** إذا تخطى المستخدم `openemis_login`، فإن `openemis_whoami` يُرجع `mode: "env-default"`. لا تجلب ملف تعريف طالب وتقول "هذا طفلك" في هذه الحالة — فهي بيانات اعتماد المدير/التجريبية للخادم، وليست بيانات المستخدم الحقيقي. اطلب منهم استدعاء `openemis_login` أولاً.

- **حساسية حالة أحرف اسم المستخدم.** `security_users.username` في OpenEMIS حساس لحالة الأحرف وفقًا للترتيب الافتراضي لـ MySQL في معظم التثبيتات. مرر السلسلة الدقيقة من `openemis_whoami`، وليس نسخة بأحرف صغيرة.

- **المستخدمون متعددو المؤسسات.** المديرون المعينون لمجموعة، أو المعلمون في مهمة مزدوجة، لديهم أكثر من صف في `institution-staff`. تصبح جميع الأسئلة اللاحقة ("طلابي"، "صفوفي") غامضة — اسأل المستخدم عن المؤسسة التي يقصدها، أو اذكر كل شيء مجمعًا حسب المؤسسة.

- **المدراء والموظفون غير التدريسيين.** المستخدمون الذين يكون لقب منصبهم "مدير"، "موارد بشرية"، أو "مسجل" عادةً ما يكون لديهم صفر صفوف في جداول مستوى الصف (الخطوة 5). هذا متوقع — نطاقهم هو المؤسسة بأكملها، وليس صفًا محددًا. يجب أن يقرأ الملخص "أنت مدير X" بدون قائمة صفوف.

- **الفترة الأكاديمية الحالية.** الخطوة 5 ترشح على `academic_period_id:<current>` — حل `<current>` عبر `GET academic-periods?current=1` مرة لكل جلسة وخزنه مؤقتًا.

- **انتهاء صلاحية JWT.** إذا أرجعت أي خطوة HTTP 401، فإن JWT المخزن قد انتهت صلاحيته — سيعرض MCP خطأ "يرجى استدعاء openemis_login مرة أخرى". يمكن أن يحدث هذا بعد فترات توقف طويلة؛ اطلب من المستخدم إعادة المصادقة.

- **الخصوصية.** الملخص الذي تجمعه يصبح سياقًا ضمنيًا. حافظ على إيجازه (الاسم + المنصب + المؤسسة + عدد الصفوف) — لا تفرغ البريد الإلكتروني، أو الجنس، أو تاريخ التوظيف في المحادثة إلا إذا طلب المستخدم ذلك صراحةً.