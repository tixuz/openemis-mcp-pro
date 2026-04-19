# openemis-mcp

**جسر لغوي طبيعي بين وكلاء مدركين لبروتوكول MCP (Claude، Codex، Cursor، إلخ) وأي نسخة من OpenEMIS.**

مبني على **واجهة برمجة تطبيقات OpenEMIS Core المنشورة** (الوثائق المرجعية على [api.openemis.org/core](https://api.openemis.org/core)) و **تم التحقق منه من البداية إلى النهاية ضد العرض التوضيحي العام على [demo.openemis.org/core](https://demo.openemis.org/core)** باستخدام بيانات اعتماد حقيقية، وبيانات حقيقية، ودورات اتصال حقيقية.

اسأل بالإنجليزية:

> *"كم عدد الطلاب الحاليين في مدرسة أفوري الابتدائية؟"*

يخطط الوكيل للمكالمات، يوفر هذا MCP البيانات، وتحصل على الإجابة:

> *"مدرسة أفوري الابتدائية (الرمز P1002) لديها 553 طالبًا مسجلين حاليًا."*

أنت لا تكتب سطرًا واحدًا من الكود. أنت لا ترى JSON. أنت فقط تسأل.

> **الحالة:** الإصدار v0.3.0 — **عمليات CRUD الكاملة** للموارد غير الخاضعة لسير العمل. تعمل استعلامات القراءة ضد كل مورد في OpenEMIS v5. أدوات الكتابة (إنشاء/تحديث/حذف) نشطة لجميع الموارد التي لا تمر عبر إضافة CakePHP Workflow. الموارد الخاضعة لسير العمل (مثل الحضور، إجازة الموظفين) محظورة على مستوى الأداة ويتم توجيهها إلى دليل الإجراءات المناسب.

---

## لماذا يوجد هذا

واجهة برمجة تطبيقات OpenEMIS Core REST كبيرة جدًا — حيث يعرض سطح v5 وحده حوالي **1350 نقطة نهاية عبر ~670 موردًا**. لا يمكن لأي وكيل ذكي استيعاب كل هذا في السياق، كما أن الاستبطان الخام على طريقة Swagger يغمر المحادثة بضوضاء لا علاقة لها بسؤال المستخدم الفعلي.

يحل هذا MCP هذه المشكلة بطريقتين:

1.  **اكتشاف محدد بالنطاق.** بدلاً من إلقاء واجهة برمجة التطبيقات بأكملها في سياق الوكيل، تضيق أداة `openemis_discover(topic)` إلى ~20–30 نقطة نهاية ذات صلة بما يسأل عنه المستخدم فعليًا ("الحضور"، "الطلاب"، "التقييم") — مدعومة بحزمة معرفية صغيرة ومختارة من ملاحظات `Domain-*.md`.
2.  **أداة جلب واحدة ومركبة.** تغطي أداة `openemis_get` واحدة عمليات القائمة + المفرد + البحث المصفى عبر كل مورد. يوفر الوكيل `resource` + `id` اختياري + `params` اختياري (`_fields`, `_conditions`, `orderby`, `page`, `limit`) ويتم تمرير بقية لغة استعلام OpenEMIS من نوع CakePHP مباشرة.

النتيجة النهائية: يجيب الوكلاء على الأسئلة باللغة الطبيعية في 2–4 مكالمات أداة، وليس 30.

---

## الأدوات

| الأداة | منذ | ما تفعله |
|---|---|---|
| `openemis_health` | v0.1 | يتحقق من وصول النسخة المكونة ويبلغ عن إمكانية الوصول. يؤدي دورة تسجيل دخول حقيقية — إذا نجح هذا، ستعمل عمليات CRUD. |
| `openemis_list_domains` | v0.1 | يسرد نطاقات OpenEMIS المختارة — الحضور، التقييم، الموظفون، الطلاب، المؤسسة، الجدول، الامتحان، التقرير — كل منها مع ملخص سطر واحد. يستخدم الوكيل هذا لمعرفة *أين* يعيش السؤال. |
| `openemis_discover` | v0.1 | الإدخال: سلسلة موضوع. الإخراج: ما يصل إلى 30 نقطة نهاية ذات صلة بهذا الموضوع، مأخوذة من حزمة المعرفة الخاصة بالنطاق والبيان الوصفي لكل نسخة. يحافظ على صغر حجم المحادثات بغض النظر عن حجم واجهة برمجة التطبيقات الأساسية. |
| `openemis_list_playbooks` | v0.2 | يسرد جميع أدلة الإجراءات السبعة والعشرين المختارة مع المعرف، العنوان، النطاق، والجمهور المستهدف. يستخدم الوكيل هذا للعثور على الدليل التدريجي المناسب لمهمة على مستوى المستخدم. |
| `openemis_get_playbook` | v0.2 | الإدخال: معرف دليل إجراءات. الإخراج: دليل الإجراءات الكامل — الموارد، الخطوات المرتبة، ملاحظات التوجيه، واستعلامات المثال. |
| `openemis_get` | v0.1 | أداة قراءة موحدة. `{ resource, id?, params? }` — إذا كان `id` موجودًا، يجلب المفرد؛ وإلا يسرد مع أي مجموعة من `_fields`, `_conditions`, `orderby`, `order`, `page`, `limit`، بالإضافة إلى أي مفتاح تصفية خاص. |
| `openemis_create` | v0.3.0 | إنشاء سجل جديد. `{ resource, body }` — للموارد غير الخاضعة لسير العمل فقط. الموارد الخاضعة لسير العمل (مثل institution-staff-leave) محظورة وسيتم توجيهها إلى دليل الإجراءات المناسب. |
| `openemis_update` | v0.3.0 | تحديث سجل موجود بواسطة المعرف. `{ resource, id, body }` — للموارد غير الخاضعة لسير العمل فقط. |
| `openemis_delete` | v0.3.0 | حذف سجل بواسطة المعرف. `{ resource, id }` — للموارد غير الخاضعة لسير العمل فقط. |

سؤال تمثيلي باللغة الطبيعية مثل *"كم عدد المعلمين في مدرسة أفوري الابتدائية، وكم عدد المناصب الشاغرة؟"* يحل إلى ثلاث مكالمات `openemis_get` — مرتبطة بواسطة الوكيل، مضيقة بواسطة `_conditions`، يتم تسليمها مرة أخرى كإجابة إنجليزية واحدة. طلب كتابة مثل *"تسجيل طالب جديد"* يستخدم `openemis_get_playbook` لتحميل الدليل التدريجي خطوة بخطوة، ثم `openemis_create` لكل خطوة كتابة.

---

## تم التحقق منه ضد demo.openemis.org

تم إثبات كل ادعاء في ملف README هذا ضد النسخة التوضيحية العامة قبل كتابته:

-   `POST /api/v5/login` مع `{ username, password, api_key }` → JWT مخبأ، 331 حرفًا
-   `GET /api/v5/institutions?limit=200&_fields=id,name,code` → 24 مؤسسة تشمل `"Avory Primary School" (id=6, code P1002)`
-   `GET /api/v5/institution-students?institution_id=6&student_status_id=1&limit=1` → تقارير ترقيم الصفحات `last_page: 553` → **553 طالبًا مسجلين حاليًا**
-   `GET /api/v5/academic-periods` → 7 صفحات من بيانات السنة الأكاديمية الحقيقية
-   `GET /api/v5/absence-types` → `EXCUSED`, `UNEXCUSED`, `LATE`, إلخ.

يقوم نموذج `scripts/smoke-login.mjs` المرفق مع هذا المستودع باختبار تسجيل الدخول خطوة بخطوة حتى تتمكن من تأكيد إمكانية الوصول إلى نسختك الخاصة قبل توصيلها بـ Claude Code.

---

## الوكلاء المتوافقون

يتحدث openemis-mcp **بروتوكول Model Context Protocol** عبر stdio — أي عميل متوافق مع MCP يعمل:

| الوكيل | كيفية الاتصال |
|---|---|
| **Claude Code** (`claude` CLI) | `claude mcp add` — العميل الأساسي الذي تم اختباره، جميع الأدوات التسعة متاحة |
| **Cursor** | أضف إلى `.cursor/mcp.json` — وصول كامل للأدوات |
| **Cline / Continue** (VS Code) | أضف الخادم في إعدادات MCP |
| **Codex** | عبر جسر [gemmy-and-qwenny](https://github.com/tixuz/gemmy-and-qwenny) |
| **أي عميل MCP** | أشر إلى `node dist/server.js` مع تعيين متغيرات البيئة |

---

## التثبيت

يتطلب **Node 22+** (لـ `fetch` المدمج و `AbortController`) و **Python 3.10+** (لباني البيان الوصفي ونصوص مولد دليل الإجراءات في `mcp-openemis-gen/`). خادم MCP نفسه يعمل على Node فقط؛ Python مطلوب فقط إذا قمت بإعادة بناء البيان الوصفي من المصدر.

### من GitHub

```bash
git clone https://github.com/tixuz/openemis-mcp.git
cd openemis-mcp

npm install
npm run build

cp .env.example .env
$EDITOR .env
```

### التكوين

يصف `.env.example` كل متغير. على الأقل تحتاج إلى بيانات الاعتماد الثلاثة التي يصدرها مسؤول OpenEMIS الخاص بك:

```env
OPENEMIS_BASE_URL=https://demo.openemis.org/core   # أو نسختك الخاصة
OPENEMIS_USERNAME=admin
OPENEMIS_PASSWORD=your_password
OPENEMIS_API_KEY=your_api_key

# اختياري
OPENEMIS_TIMEOUT_MS=30000
OPENEMIS_VAULT_PATH=/absolute/path/to/domain-notes
OPENEMIS_MANIFEST_PATH=/absolute/path/to/manifest.jsonl
```

يسجل الخادم الدخول بكسل عند أول استدعاء لأداة مصادقة، بإرسال POST إلى `/api/v5/login`، وتحليل JWT من `data.token`، وتخبئته في الذاكرة. عند تلقي 401، يعيد تسجيل الدخول ويعيد المحاولة مرة واحدة.

يشير `OPENEMIS_VAULT_PATH` إلى المجلد الذي يحتوي على ملاحظات `Domain-*.md` المختارة المستخدمة بواسطة `openemis_discover`. إذا كانت مفقودة، يتراجع الاكتشاف بشكل متحفظ إلى مطابقة الكلمات الرئيسية ضد البيان الوصفي وحده.

يشير `OPENEMIS_MANIFEST_PATH` إلى إخراج JSONL للباني المرافق في `../mcp-openemis-gen/`. إذا كان غائبًا، تعيد أدوات الاكتشاف تلميحًا وديًا "البيان الوصفي لم يُبنَ بعد" — لا تتعطل.

### اختبار إمكانية الوصول

```bash
set -a && source .env && set +a
node scripts/smoke-login.mjs
```

المتوقع:

```
[Test] Loading config...
[OK] Config loaded: baseUrl=https://demo.openemis.org/core
[Test] Creating client...
[OK] Client created
[Test] Attempting login...
[OpenEMIS] Login successful; cached JWT (331 chars)
[OK] Login successful
```

### التسجيل مع Claude Code

```bash
claude mcp add openemis \
  --env OPENEMIS_BASE_URL="https://your-openemis/core" \
  --env OPENEMIS_USERNAME="…" \
  --env OPENEMIS_PASSWORD="…" \
  --env OPENEMIS_API_KEY="…" \
  --env OPENEMIS_VAULT_PATH="/absolute/path/to/vault" \
  -- node "$(pwd)/dist/server.js"

# التحقق
claude mcp list | grep openemis
# المتوقع: openemis: node /…/dist/server.js - ✓ Connected
```

أي جلسة جديدة لـ Claude Code في هذا المشروع سترى جميع الأدوات التسعة تلقائيًا.

---

## البنية

```
┌────────────────────────┐
│  Agent (Claude / …)    │     "كم عدد الطلاب الحاليين في مدرسة أفوري؟"
└───────────┬────────────┘
            │ MCP stdio (JSON-RPC)
┌───────────▼────────────┐
│  openemis-mcp          │  ← تسع أدوات مكتوبة، مخططات ZodRawShape
│  • openemis_health     │
│  • openemis_list_dom…  │  ← يقرأ Domain-*.md من الخزنة
│  • openemis_discover   │  ← موضوع → ≤30 نقطة نهاية محددة النطاق
│  • openemis_list_play… │  ← يسرد جميع أدلة الإجراءات الـ 16 الخاصة بسير العمل
│  • openemis_get_playbk │  ← يحمل دليل إجراءات بواسطة المعرف
│  • openemis_get / _create / _update / _delete   │
└───────────┬────────────┘
            │ HTTPS + Bearer JWT (مخبأ، تحديث تلقائي عند 401)
┌───────────▼────────────┐
│  OpenEMIS Core API     │  api.openemis.org/core  (مرجعي)
│  /api/v5/{resource}    │  demo.openemis.org/core (تم اختباره)
└────────────────────────┘
```

مبادئ التصميم، من أول سطر كود:

1.  **محدد النطاق، وليس كاسحة.** يمكن أن ينمو البيان الوصفي إلى آلاف نقاط النهاية؛ سياق الوكيل لن يفعل ذلك. `openemis_discover(topic)` هو القمع — كل محادثة ترى فقط الشريحة التي تحتاجها.
2.  **أدوات الكتابة في v0.3.0.** `openemis_create` / `openemis_update` / `openemis_delete` نشطة لجميع الموارد غير الخاضعة لسير العمل. الموارد الخاضعة لسير العمل (مثل الحضور، حضور الموظفين) محظورة على مستوى الأداة ويتم توجيهها إلى دليل الإجراءات المناسب.
3.  **بدون حالة بين المكالمات.** فقط JWT مخبأ في الذاكرة. لا استمرارية على القرص، لا تحليلات، لا شيء يتصل بالخارج.
4.  **خفيف فوق واجهة برمجة التطبيقات الحقيقية.** لا يخترع هذا الجسر مفاهيم جديدة — أسماء `resource` هي مسارات v5 بحروف صغيرة وشرطات، معلمات الاستعلام هي لغة `_conditions` / `_fields` الأصلية. ما تكتبه في curl يترجم 1:1.

---

## الوثائق

-   [مرجع الموارد](docs/resources.md) — جميع الموارد الـ 645 مع توفر طريقة HTTP وحالة الكتابة
-   [أدلة الإجراءات](docs/playbooks/) — 27 دليل إجراءات مختارة لسير العمل (24 قراءة · 3 كتابة)

### أدلة الإجراءات

| # | دليل الإجراءات | النطاق | الجمهور المستهدف | الترجمات |
|---|---|---|---|---|
| 1 | [عد المناصب الشاغرة](docs/playbooks/count-vacant-positions.md) | الموظفون | مسؤول، موارد بشرية | [RU](docs/playbooks/count-vacant-positions.ru.md) · [ES](docs/playbooks/count-vacant-positions.es.md) |
| 2 | [تسجيل حضور الطالب](docs/playbooks/mark-student-attendance.md) | الحضور | معلم، مسؤول | [RU](docs/playbooks/mark-student-attendance.ru.md) · [ES](docs/playbooks/mark-student-attendance.es.md) |
| 3 | [تسجيل حضور الموظفين](docs/playbooks/mark-staff-attendance.md) | الموظفون | مسؤول، موارد بشرية، معلم | [RU](docs/playbooks/mark-staff-attendance.ru.md) · [ES](docs/playbooks/mark-staff-attendance.es.md) |
| 4 | [عرض جدول الطالب](docs/playbooks/view-student-timetable.md) | الجدول | ولي أمر، طالب | [RU](docs/playbooks/view-student-timetable.ru.md) |
| 5 | [لوحة تحكم الطالب](docs/playbooks/student-dashboard.md) | الطلاب | ولي أمر، طالب | [RU](docs/playbooks/student-dashboard.ru.md) |
| 6 | [إنشاء تقرير الطالب PDF](docs/playbooks/generate-student-report-card-pdf.md) | التقرير | معلم، مسؤول | [RU](docs/playbooks/generate-student-report-card-pdf.ru.md) · [ES](docs/playbooks/generate-student-report-card-pdf.es.md) |
| 7 | [تسجيل طالب جديد](docs/playbooks/enroll-new-student.md) | الطلاب | مسؤول، مسجل | [RU](docs/playbooks/enroll-new-student.ru.md) · [ES](docs/playbooks/enroll-new-student.es.md) |
| 8 | [تسجيل حادثة سلوكية](docs/playbooks/record-behavior-incident.md) | الطلاب | معلم، مسؤول | [RU](docs/playbooks/record-behavior-incident.ru.md) · [ES](docs/playbooks/record-behavior-incident.es.md) |
| 9 | [إرسال درجات الامتحان](docs/playbooks/submit-exam-marks.md) | التقييم | معلم | [RU](docs/playbooks/submit-exam-marks.ru.md) |
| 10 | [ملخص المؤسسة](docs/playbooks/institution-summary.md) | المؤسسة | مسؤول، ولي أمر | [RU](docs/playbooks/institution-summary.ru.md) |
| 11 | [إنشاء إحصائيات المؤسسة PDF](docs/playbooks/generate-institution-statistics-pdf.md) | التقرير | مسؤول | [RU](docs/playbooks/generate-institution-statistics-pdf.ru.md) · [ES](docs/playbooks/generate-institution-statistics-pdf.es.md) |
| 12 | [عرض آخر حضور](docs/playbooks/view-latest-attendance.md) | الحضور | معلم، مسؤول، ولي أمر | |
| 13 | [عرض ملف الطالب](docs/playbooks/view-student-profile.md) | الطلاب | معلم، مسؤول | [RU](docs/playbooks/view-student-profile.ru.md) |
| 14 | [عرض درجات الطالب](docs/playbooks/view-student-marks.md) | التقييم | معلم، مسؤول، ولي أمر | [RU](docs/playbooks/view-student-marks.ru.md) |
| 15 | [عرض تقرير الفصل](docs/playbooks/view-class-report.md) | التقرير | معلم، مسؤول | [RU](docs/playbooks/view-class-report.ru.md) |
| 16 | [عرض الجدول](docs/playbooks/view-timetable.md) | الجدول | معلم، مسؤول، طالب | [RU](docs/playbooks/view-timetable.ru.md) |
| 17 | [عرض ملف المؤسسة الكامل](docs/playbooks/view-institution-profile.md) | المؤسسة | مسؤول، ولي أمر، عامة | |
| 18 | [عرض ملف الفصل الكامل](docs/playbooks/view-class-profile.md) | الطلاب | معلم، مسؤول | |
| 19 | [عرض ملف الموظف الكامل](docs/playbooks/view-staff-profile.md) | الموظفون | مسؤول، موارد بشرية | [RU](docs/playbooks/view-staff-profile.ru.md) |
| 20 | [تحسين ملف الطالب](docs/playbooks/enhance-student-profile.md) | الطلاب | معلم، مسؤول، مرشد | [ES](docs/playbooks/enhance-student-profile.es.md) |
| 21 | [عرض بنية المؤسسة](docs/playbooks/view-institution-infrastructure.md) | المؤسسة | مسؤول، مرافق | |
| 22 | [عرض وجبات المؤسسة](docs/playbooks/view-institution-meals.md) | المؤسسة | مسؤول، أخصائي تغذية، ولي أمر | |
| 23 | [عرض ملف مخاطر الطالب](docs/playbooks/view-student-risks.md) | الطلاب | مسؤول، مرشد، معلم | |
| 24 | [عرض ملخص مخاطر المؤسسة](docs/playbooks/view-institution-risks.md) | المؤسسة | مسؤول، وزارة | |
| 25 | [إضافة معدات أو أصول](docs/playbooks/add-institution-asset.md) ✏️ | البنية التحتية | مسؤول، محاسب، مرافق | |
| 26 | [تسجيل إصلاح بنية تحتية](docs/playbooks/record-infrastructure-repair.md) ✏️ | البنية التحتية | مسؤول، محاسب، مرافق | |
| 27 | [إضافة برنامج وجبات جديد](docs/playbooks/add-meal-programme.md) ✏️ | الوجبات | مسؤول، محاسب، أخصائي تغذية | |

---

## خارطة الطريق

### v0.4.0 — مصادقة المتصفح (مخطط)

اليوم، تتطلب بيانات الاعتماد `api_key` صادر يدويًا من مسؤول OpenEMIS. ستضيف v0.4.0 أداة `openemis_browser_auth` اختيارية تلغي جميع تكوينات بيانات الاعتماد اليدوية:

1.  تطلق الأداة متصفح Playwright محلي — **لا يلزم عنوان URL مستهدف مسبقًا**.
2.  يتنقل المستخدم إلى نسخة OpenEMIS الخاصة به ويسجل الدخول بشكل طبيعي.
3.  يراقب Playwright كل حركة مرور الشبكة. عندما يرى استجابة لـ **`POST */api/v5/login`** أو **`POST */api/v4/login`** (كلاهما يعيدان نفس JWT):
    - يتم استخراج **عنوان URL الأساسي** تلقائيًا من عنوان URL الطلب (مثل `https://dev-demo.openemis.org/core/api/v5/login` → الأساسي `https://dev-demo.openemis.org/core`) — لا حاجة لتكوين `OPENEMIS_BASE_URL` مسبقًا.
    - يتم استخراج **JWT** من جسم الاستجابة.
4.  يتم تخزين كلاهما في الذاكرة واستخدامهما لجميع مكالمات CRUD اللاحقة.

هذا يزيل `OPENEMIS_BASE_URL`، `OPENEMIS_USERNAME`، `OPENEMIS_PASSWORD`، و `OPENEMIS_API_KEY` كمتطلبات — المستخدم فقط يفتح المتصفح ويسجل الدخول. يعمل مع أي نسخة OpenEMIS، أي نطاق، أي نطاق فرعي، بما في ذلك بيئات التطوير، والاختبار، والإنتاج دون أي إعادة تكوين.

**تبقى بيانات الاعتماد القائمة على `.env` مدعومة بالكامل** — الإعدادات الحالية لم تتغير. مصادقة المتصفح اختيارية عبر الأداة الجديدة.

### v0.5.0 — لوحات تحكم المخاطر ✅

`view-student-risks` و `view-institution-risks` — تم إرسالها. درجات المخاطر، تفصيل لكل معيار، حالات الرعاية، قواعد التنبيه، وسجلات التسليم.

### v0.6.0 — مسارات سير العمل *(Institution Pro + Country Pro)*

أدوات الكتابة الحالية (`openemis_create`, `openemis_update`, `openemis_delete`) تنفذ عملية واحدة في كل مرة. تأخذ مسارات سير العمل هذا إلى أبعد من ذلك: **ينسق MCP دليل إجراءات متعدد الخطوات بالكامل تلقائيًا**، يحمل الحالة من خطوة إلى أخرى ويطبق التحقق قبل الالتزام في كل مرحلة.

**أداة جديدة:** `openemis_run_workflow { playbook_id, params, dry_run? }` — تقبل معرف دليل إجراءات ومعلمات إدخال منظمة، تنفذ جميع الخطوات بالتسلسل، تعيد سجل تشغيل منظم. في وضع التجربة الجافة، تبلغ عما سيتغير دون كتابة أي شيء.

يتم التحكم في مسارات سير العمل فوق Individual Pro لأن عمليات الكتابة الجماعية بالذكاء الاصطناعي على مستوى المؤسسة أو الوطني تحتاج إلى إشراف. يحتاج المعلم الذي يسجل حضور 30 طالبًا إلى السرعة؛ يحتاج مكتب المنطقة الذي يسجل 500 طالب عبر 20 مدرسة إلى التدقيق والموافقة.

| الميزة | Individual Pro | Institution Pro | Country Pro |
|---|---|---|---|
| كتابة مباشرة (سجل واحد) | ✅ | ✅ | ✅ |
| سجل تدقيق المؤسسة | — | ✅ | ✅ |
| تنفيذ مسار سير العمل | — | ✅ | ✅ |
| بوابة موافقة مسؤول المؤسسة | — | ✅ | ✅ |
| عمليات دفعة داخل مؤسسة واحدة | — | ✅ | ✅ |
| عمليات دفعة متعددة المؤسسات | — | — | ✅ |
| بوابات موافقة الوزارة | — | — | ✅ |
| لوحة تحكم إشرافية عبر المؤسسات | — | — | ✅ |
| التراجع عند الفشل الجزئي | — | — | ✅ |

---

## الخطط

| | **مجاني** | **Individual Pro** | **Institution Pro** | **Country Pro** |
|---|---|---|---|---|
| **النطاق** | أي مستخدم | شخص واحد | مدرسة واحدة | وزارة / وطني |
| **الترخيص** | MIT | BSL 1.1 | BSL 1.1 | BSL 1.1 |
| أدوات القراءة (جميع الموارد الـ 645) | ✅ | ✅ | ✅ | ✅ |
| 24 دليل إجراءات مختارة + ترجمات | ✅ | ✅ | ✅ | ✅ |
| كتابة مباشرة — سجل واحد | — | ✅ | ✅ | ✅ |
| سجل تدقيق المؤسسة | — | — | ✅ | ✅ |
| تنفيذ مسار سير العمل | — | — | ✅ | ✅ |
| بوابة موافقة مسؤول المؤسسة | — | — | ✅ | ✅ |
| عمليات دفعة داخل مؤسسة واحدة | — | — | ✅ | ✅ |
| عمليات دفعة متعددة المؤسسات | — | — | — | ✅ |
| بوابات موافقة الوزارة | — | — | — | ✅ |
| إشراف عبر المؤسسات | — | — | — | ✅ |
| التراجع عند الفشل الجزئي | — | — | — | ✅ |

→ **التسعير والوصول:** khindol.madraimov@gmail.com

---

## الترخيص

[MIT](LICENSE.md) — © 2026 خيندول مدرايموف

---

## الشكر والتقدير

تم البناء بواسطة فريق منسق من وكلاء الذكاء الاصطناعي تحت التوجيه البشري — انظر [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) للفريق الكامل: Adviser Arastu، Marshal Sunny، Samurai Haiku، Xéphyrin Xirdal، Captain Nemo، Coddy (GPT-5)، Miniqwenco (Qwen 2.5 Coder 7B)، Miniqwen (Qwen 3.5 9B)، و Gemmy (Gemma 4e4b) — لكل منهم أدوار مميزة عبر الهندسة المعمارية، الكود، التحليل، والترجمة متعددة اللغات.

---

*غير تابع لـ OpenEMIS أو القائمين عليه. هذا جسر من طرف ثالث يتحدث واجهة برمجة تطبيقات Core العامة. تبقى بيانات الاعتماد والبيانات على جهازك.*