<p align="center">
  <img src="assets/logo.png" alt="openemis-mcp logo" width="320">
</p>

# openemis-mcp

**جسر لغوي طبيعي بين الوكلاء المدركين لـ MCP (Claude، Codex، Cursor، إلخ) وأي نسخة من OpenEMIS.**

OpenEMIS هو نظام معلومات إدارة مدرسية مجاني ومفتوح المصدر طورته اليونسكو وKORDIT، ويُستخدم في رياض الأطفال والمدارس ومؤسسات التعليم المهني الثانوي والجامعات.

مبني على **واجهة برمجة التطبيقات الأساسية المنشورة لـ OpenEMIS Core** (الوثائق المرجعية على [api.openemis.org/core](https://api.openemis.org/core)) و **تم التحقق منه من البداية إلى النهاية ضد النسخة التجريبية العامة على [demo.openemis.org/core](https://demo.openemis.org/core)** باستخدام بيانات اعتماد حقيقية، وبيانات حقيقية، ودورات اتصال حقيقية.

اسأل بالإنجليزية:

> *"كم عدد الطلاب الحاليين في مدرسة أفوري الابتدائية؟"*

يخطط الوكيل للمكالمات، يقدم هذا MCP البيانات، وتحصل على الإجابة:

> *"مدرسة أفوري الابتدائية (الرمز P1002) لديها 553 طالبًا مسجلين حاليًا."*

أنتم لا تكتبون سطرًا واحدًا من التعليمات البرمجية. أنتم لا ترون JSON. أنتم فقط تسألون.

> **الحالة:** v1.0.0 — **عمليات CRUD الكاملة** للموارد غير الخاضعة لسير العمل. تعمل استعلامات القراءة ضد كل مورد في OpenEMIS v5. أدوات الكتابة (إنشاء/تحديث/حذف) نشطة لجميع الموارد التي لا تمر عبر إضافة CakePHP Workflow. الموارد الخاضعة لسير العمل (مثل الحضور، إجازة الموظفين) محظورة على مستوى الأداة ويتم توجيهها إلى دليل الإجراءات المناسب.

---

## لماذا يوجد هذا

واجهة برمجة التطبيقات REST الأساسية لـ OpenEMIS كبيرة — حيث تعرض واجهة v5 وحدها **3,355 نقطة نهاية عبر 675 موردًا** (Core 5.10.0). لا يمكن لأي وكيل ذكي استيعاب ذلك في السياق، كما أن الاستبطان الخام على طراز Swagger يغمر المحادثة بضوضاء ليس لها علاقة بسؤال المستخدم الفعلي.

يحل هذا MCP هذه المشكلة بطريقتين:

1. **اكتشاف محدد بالنطاق.** بدلاً من إلقاء واجهة برمجة التطبيقات بأكملها في سياق الوكيل، تضيق أداة `openemis_discover(topic)` إلى ~20–30 نقطة نهاية ذات صلة بما يسأل عنه المستخدم فعليًا ("الحضور"، "الطلاب"، "التقييم") — مدعومة بحزمة معرفية صغيرة ومختارة من ملاحظات `Domain-*.md`.
2. **أداة جلب واحدة ومركبة.** أداة `openemis_get` واحدة تغطي القائمة + المفرد + البحث المصفى عبر كل مورد. يوفر الوكيل `resource` + `id` اختياري + `params` اختياري (`_fields`, `_conditions`, `orderby`, `page`, `limit`) ويتم تمرير بقية لغة استعلام OpenEMIS من طراز CakePHP مباشرة.

النتيجة النهائية: يجيب الوكلاء على الأسئلة باللغة الطبيعية في 2–4 مكالمات أداة، وليس 30.

---

## الأدوات

| الأداة | منذ | ما الذي تفعله |
|---|---|---|
| `openemis_health` | v0.1 | يتحقق من وصول النسخة المكونة ويبلغ عن إمكانية الوصول. يقوم بدورة تسجيل دخول حقيقية — إذا نجح هذا، ستعمل عمليات CRUD. |
| `openemis_list_domains` | v0.1 | يسرد نطاقات OpenEMIS المختارة — الحضور، التقييم، الموظفون، الطلاب، المؤسسة، الجدول الزمني، الامتحان، التقرير — كل منها مع ملخص سطر واحد. يستخدم الوكيل هذا لمعرفة *أين* يعيش السؤال. |
| `openemis_discover` | v0.1 | الإدخال: سلسلة موضوع. الإخراج: ما يصل إلى 30 نقطة نهاية ذات صلة بهذا الموضوع، مأخوذة من حزمة المعرفة الخاصة بالنطاق والبيان الوصفي لكل نسخة. يحافظ على صغر المحادثات بغض النظر عن حجم واجهة برمجة التطبيقات الأساسية. |
| `openemis_list_playbooks` | v0.2 | يسرد جميع أدلة الإجراءات الـ 40 المختارة مع المعرف، العنوان، النطاق، والجمهور. يستخدم الوكيل هذا للعثور على الدليل التدريجي المناسب لمهمة على مستوى المستخدم. |
| `openemis_get_playbook` | v0.2 | الإدخال: معرف دليل الإجراءات. الإخراج: دليل الإجراءات الكامل — الموارد، الخطوات المرتبة، ملاحظات التوجيه، واستعلامات المثال. |
| `openemis_get` | v0.1 | أداة قراءة موحدة. `{ resource, id?, params? }` — إذا كان `id` موجودًا، يجلب المفرد؛ وإلا يسرد مع أي مجموعة من `_fields`, `_conditions`, `orderby`, `order`, `page`, `limit`، بالإضافة إلى أي مفتاح تصفية خاص. |
| `openemis_create` | v0.3.0 | إنشاء سجل جديد. `{ resource, body }` — الموارد غير الخاضعة لسير العمل فقط. الموارد الخاضعة لسير العمل (مثل institution-staff-leave) محظورة وسيتم توجيهها إلى دليل الإجراءات المناسب. |
| `openemis_update` | v0.3.0 | تحديث سجل موجود بواسطة المعرف. `{ resource, id, body }` — الموارد غير الخاضعة لسير العمل فقط. |
| `openemis_delete` | v0.3.0 | حذف سجل بواسطة المعرف. `{ resource, id }` — الموارد غير الخاضعة لسير العمل فقط. |

سؤال باللغة الطبيعية ممثل مثل *"كم عدد المعلمين في مدرسة أفوري الابتدائية، وكم عدد الوظائف الشاغرة؟"* يحل إلى ثلاث مكالمات `openemis_get` — مرتبطة بواسطة الوكيل، مضبوطة بواسطة `_conditions`، يتم تسليمها مرة أخرى كإجابة إنجليزية واحدة. طلب كتابة مثل *"تسجيل طالب جديد"* يستخدم `openemis_get_playbook` لتحميل الدليل التدريجي، ثم `openemis_create` لكل خطوة كتابة.

---

## تم التحقق منه ضد demo.openemis.org

تم إثبات كل ادعاء في ملف README هذا ضد النسخة التجريبية العامة قبل كتابته:

- `POST /api/v5/login` مع `{ username, password, api_key }` → JWT مخبأ، 331 حرفًا
- `GET /api/v5/institutions?limit=200&_fields=id,name,code` → 24 مؤسسة تشمل `"Avory Primary School" (id=6, code P1002)`
- `GET /api/v5/institution-students?institution_id=6&student_status_id=1&limit=1` → ترقيم الصفحات يبلغ `last_page: 553` → **553 طالبًا مسجلين حاليًا**
- `GET /api/v5/academic-periods` → 7 صفحات من بيانات السنة الأكاديمية الحقيقية
- `GET /api/v5/absence-types` → `EXCUSED`, `UNEXCUSED`, `LATE`, إلخ.

يقوم نموذج `scripts/smoke-login.mjs` المرفق مع هذا المستودع بتنفيذ اختبار تسجيل الدخول خطوة بخطوة حتى تتمكنوا من تأكيد إمكانية الوصول إلى نسختكم الخاصة قبل توصيلها بـ Claude Code.

---

## الوكلاء المتوافقون

يتحدث openemis-mcp **بروتوكول سياق النموذج (Model Context Protocol)** عبر stdio — أي عميل متوافق مع MCP يعمل:

**وضع Stdio (الجهاز المحلي)** — يتصل كعملية فرعية:

| الوكيل | كيفية الاتصال |
|---|---|
| **Claude Code** (`claude` CLI) | `claude mcp add` — العميل الأساسي المختبر، جميع الأدوات التسعة متاحة |
| **Cursor** | إضافة إلى `.cursor/mcp.json` — وصول كامل للأدوات |
| **Cline / Continue** (VS Code) | إضافة خادم في إعدادات MCP |
| **Codex** | عبر جسر [gemmy-and-qwenny](https://github.com/tixuz/gemmy-and-qwenny) |
| **أي عميل MCP** | الإشارة إلى `node dist/server.js` مع تعيين متغيرات البيئة |

**وضع خادم HTTP** (`OPENEMIS_TRANSPORT=http`، تثبيت مرة واحدة على Oracle/VPS) — يتصل عبر URL:

| العميل | كيفية الاتصال |
|---|---|
| **Claude Code** (عن بُعد) | `claude mcp add --transport http --url http://your-server:3000/mcp --header "Authorization: Bearer <token>"` |
| **Cursor / Cline** | إضافة عنوان URL لـ MCP عن بُعد في الإعدادات |
| **ChatGPT** (Custom GPT) | استيراد المخطط من `http://your-server:3000/openapi.json` → Actions → رمز Bearer |
| **أي عميل HTTP** | واجهة برمجة التطبيقات REST على `/api/*` — انظر [دليل المعلم](docs/CHATGPT-TEACHER-GUIDE.md) |

---

## التثبيت

يتطلب **Node 22+** (لـ `fetch` المدمج و `AbortController`) و **Python 3.10+** (لباني البيان الوصفي ونصوص مولد دليل الإجراءات في `mcp-openemis-gen/`). خادم MCP نفسه يعمل على Node فقط؛ Python مطلوب فقط إذا أعدتم بناء البيان الوصفي من المصدر.

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

`.env.example` يوثق كل متغير. على الأقل تحتاجون إلى بيانات الاعتماد الثلاثة التي يصدرها مسؤول OpenEMIS الخاص بكم:

```env
OPENEMIS_BASE_URL=https://demo.openemis.org/core   # أو نسختكم الخاصة
OPENEMIS_USERNAME=admin
OPENEMIS_PASSWORD=your_password
OPENEMIS_API_KEY=your_api_key

# اختياري
OPENEMIS_TIMEOUT_MS=30000
OPENEMIS_VAULT_PATH=/absolute/path/to/domain-notes
OPENEMIS_MANIFEST_PATH=/absolute/path/to/manifest.jsonl
```

يسجل الخادم دخولًا بكسل عند أول استدعاء لأداة مصادقة، بإرسال POST إلى `/api/v5/login`، وتحليل JWT من `data.token`، وتخزينه مؤقتًا في الذاكرة. عند حدوث خطأ 401، يعيد تسجيل الدخول ويعيد المحاولة مرة واحدة.

يشير `OPENEMIS_VAULT_PATH` إلى المجلد الذي يحتوي على ملاحظات `Domain-*.md` المختارة المستخدمة بواسطة `openemis_discover`. إذا كانت مفقودة، يتدهور الاكتشاف بشكل متحفظ إلى مطابقة الكلمات الرئيسية ضد البيان الوصفي وحده.

يشير `OPENEMIS_MANIFEST_PATH` إلى إخراج JSONL للباني المرافق في `../mcp-openemis-gen/`. إذا كان غائبًا، تعيد أدوات الاكتشاف تلميحًا ودودًا "البيان الوصفي لم يُبنَ بعد" — لا تتعطل.

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

### وضع الخادم (Oracle Always Free / أي VPS)

اضبط `OPENEMIS_TRANSPORT=http` للتشغيل كخادم HTTP دائم بدلاً من عملية فرعية محلية. قم بالتثبيت مرة واحدة على خادمكم؛ يتصل كل عميل متوافق مع MCP (Claude Code، Cursor، Cline، Windsurf) عبر URL.

**على خادمكم:**

```bash
git clone https://github.com/tixuz/openemis-mcp-pro.git
cd openemis-mcp-pro
npm install && npm run build
cp .env.example .env
$EDITOR .env          # تعيين بيانات الاعتماد + OPENEMIS_TRANSPORT=http + OPENEMIS_AUTH_TOKEN
node dist/server.js
```

**.env لوضع الخادم:**

```env
OPENEMIS_BASE_URL=https://your-openemis/core
OPENEMIS_USERNAME=admin
OPENEMIS_PASSWORD=your_password
OPENEMIS_API_KEY=your_api_key

OPENEMIS_TRANSPORT=http
OPENEMIS_PORT=3000

# التوليد: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
OPENEMIS_AUTH_TOKEN=your-secret-token-here
```

**الاتصال من Claude Code (عن بُعد):**

```bash
claude mcp add openemis-remote \
  --transport http \
  --url "http://your-server:3000/mcp" \
  --header "Authorization: Bearer your-secret-token-here"
```

**مسبار الصحة** (المراقبة / فحوصات الوقت التشغيلي):

```bash
curl http://your-server:3000/health
# {"ok":true,"transport":"http","baseUrl":"https://your-openemis/core"}
```

> ⚠️ **اضبط دائمًا `OPENEMIS_AUTH_TOKEN`** قبل تعريض المنفذ للعامة. بدونه، تكون نقطة النهاية مفتوحة لأي شخص يمكنه الوصول إلى IP الخاص بكم.

---

## البنية

```
┌────────────────────────┐
│  الوكيل (Claude / …)    │     "كم عدد الطلاب الحاليين في مدرسة أفوري؟"
└───────────┬────────────┘
            │ MCP stdio (JSON-RPC)
┌───────────▼────────────┐
│  openemis-mcp          │  ← تسع أدوات مكتوبة، مخططات ZodRawShape
│  • openemis_health     │
│  • openemis_list_dom…  │  ← يقرأ Domain-*.md من الخزنة
│  • openemis_discover   │  ← موضوع → ≤30 نقطة نهاية محددة النطاق
│  • openemis_list_play… │  ← سرد جميع أدلة الإجراءات الـ 40 الخاصة بسير العمل
│  • openemis_get_playbk │  ← تحميل دليل إجراءات بواسطة المعرف
│  • openemis_get / _create / _update / _delete   │
└───────────┬────────────┘
            │ HTTPS + Bearer JWT (مخبأ، تحديث تلقائي عند 401)
┌───────────▼────────────┐
│  واجهة برمجة التطبيقات الأساسية لـ OpenEMIS Core     │  api.openemis.org/core  (مرجعي)
│  /api/v5/{resource}    │  demo.openemis.org/core (مختبر)
└────────────────────────┘
```

مبادئ التصميم، من أول سطر برمجي:

1. **محدد النطاق، وليس الفيضان.** يمكن أن ينمو البيان الوصفي إلى آلاف نقاط النهاية؛ سياق الوكيل لن يفعل. `openemis_discover(topic)` هو القمع — كل محادثة ترى فقط الشريحة التي تحتاجها.
2. **أدوات الكتابة في v0.3.0.** `openemis_create` / `openemis_update` / `openemis_delete` نشطة لجميع الموارد غير الخاضعة لسير العمل. الموارد الخاضعة لسير العمل (مثل الحضور، حضور الموظفين) محظورة على مستوى الأداة ويتم توجيهها إلى دليل الإجراءات المناسب.
3. **بدون حالة بين المكالمات.** فقط JWT مخبأ في الذاكرة. لا استمرارية على القرص، لا تحليلات، لا شيء يتصل بالخارج.
4. **خفيف فوق واجهة برمجة التطبيقات الحقيقية.** لا يخترع هذا الجسر مفاهيم جديدة — أسماء `resource` هي مسارات v5 بحروف كباب، معلمات الاستعلام هي لغة `_conditions` / `_fields` الأصلية. ما تكتبونه في curl يترجم 1:1.

---

## التوثيق

- [مرجع الموارد](docs/resources.md) — جميع الموارد الـ 675 مع توفر طريقة HTTP وحالة الكتابة (Core 5.10.0)
- [أدلة الإجراءات](docs/playbooks/) — 40 دليل إجراءات مختار لسير العمل (26 قراءة · 14 كتابة/مصادقة)
- [دليل المعلم لـ ChatGPT](docs/CHATGPT-TEACHER-GUIDE.md) — كيفية السماح للمعلمين بتسجيل الحضور عبر ChatGPT Custom GPT
- [روتين تأليف دليل الإجراءات](docs/PLAYBOOK-ROUTINE.md) — عملية من 4 خطوات لإضافة أدلة إجراءات جديدة

### أدلة الإجراءات

> **جديد في v1.1.0:** تمت إضافة 9 أدلة إجراءات جديدة لـ OpenEMIS Core 5.10.0 — اعتماد / تسجيل المدرسة، ميزانية المؤسسة، تاريخ غياب الطالب، سجل تدقيق نشاط المستخدم، قائمة الفصل، حالة قائمة انتظار القبول / التسجيل، وشرح عام لنظام سير العمل. المعرّفات: `diagnose-alert-delivery`, `view-school-accreditation`, `view-school-registration`, `view-institution-budget`, `query-student-absence-history`, `query-user-activity-audit-log`, `view-class-roster`, `set-school-accreditation` ✏️, `set-school-registration` ✏️, `mark-student-meal-participation` ✏️, `view-admission-and-enrolment-queue-state`, `explain-workflow-system`. متوفرة عبر `openemis_get_playbook` — حاليًا بالإنجليزية فقط؛ ملفات markdown الفردية والترجمات ستصدر في إصدار لاحق.

| # | دليل الإجراءات | النطاق | الجمهور | الترجمات |
|---|---|---|---|---|
| 1 | [عد الوظائف الشاغرة](docs/playbooks/count-vacant-positions.md) | الموظفون | مسؤول، موارد بشرية | [RU](docs/playbooks/count-vacant-positions.ru.md) · [ES](docs/playbooks/count-vacant-positions.es.md) · [HI](docs/playbooks/count-vacant-positions.hi.md) · [AR](docs/playbooks/count-vacant-positions.ar.md) |
| 2 | [تسجيل حضور الطالب](docs/playbooks/mark-student-attendance.md) | الحضور | معلم، مسؤول | [RU](docs/playbooks/mark-student-attendance.ru.md) · [ES](docs/playbooks/mark-student-attendance.es.md) · [HI](docs/playbooks/mark-student-attendance.hi.md) · [AR](docs/playbooks/mark-student-attendance.ar.md) |
| 3 | [تسجيل حضور الموظفين](docs/playbooks/mark-staff-attendance.md) | الموظفون | مسؤول، موارد بشرية، معلم | [RU](docs/playbooks/mark-staff-attendance.ru.md) · [ES](docs/playbooks/mark-staff-attendance.es.md) · [HI](docs/playbooks/mark-staff-attendance.hi.md) · [AR](docs/playbooks/mark-staff-attendance.ar.md) |
| 4 | [عرض جدول الطالب الزمني](docs/playbooks/view-student-timetable.md) | الجدول الزمني | ولي أمر، طالب | [RU](docs/playbooks/view-student-timetable.ru.md) · [ES](docs/playbooks/view-student-timetable.es.md) · [HI](docs/playbooks/view-student-timetable.hi.md) · [AR](docs/playbooks/view-student-timetable.ar.md) |
| 5 | [لوحة تحكم الطالب](docs/playbooks/student-dashboard.md) | الطلاب | ولي أمر، طالب | [RU](docs/playbooks/student-dashboard.ru.md) · [ES](docs/playbooks/student-dashboard.es.md) · [HI](docs/playbooks/student-dashboard.hi.md) · [AR](docs/playbooks/student-dashboard.ar.md) |
| 6 | [إنشاء تقرير الطالب PDF](docs/playbooks/generate-student-report-card-pdf.md) | التقرير | معلم، مسؤول | [RU](docs/playbooks/generate-student-report-card-pdf.ru.md) · [ES](docs/playbooks/generate-student-report-card-pdf.es.md) · [HI](docs/playbooks/generate-student-report-card-pdf.hi.md) · [AR](docs/playbooks/generate-student-report-card-pdf.ar.md) |
| 7 | [تسجيل طالب جديد](docs/playbooks/enroll-new-student.md) | الطلاب | مسؤول، مسجل | [RU](docs/playbooks/enroll-new-student.ru.md) · [ES](docs/playbooks/enroll-new-student.es.md) · [HI](docs/playbooks/enroll-new-student.hi.md) · [AR](docs/playbooks/enroll-new-student.ar.md) |
| 8 | [تسجيل حادثة سلوكية](docs/playbooks/record-behavior-incident.md) | الطلاب | معلم، مسؤول | [RU](docs/playbooks/record-behavior-incident.ru.md) · [ES](docs/playbooks/record-behavior-incident.es.md) · [HI](docs/playbooks/record-behavior-incident.hi.md) · [AR](docs/playbooks/record-behavior-incident.ar.md) |
| 9 | [إرسال درجات الامتحان](docs/playbooks/submit-exam-marks.md) | التقييم | معلم | [RU](docs/playbooks/submit-exam-marks.ru.md) · [ES](docs/playbooks/submit-exam-marks.es.md) · [HI](docs/playbooks/submit-exam-marks.hi.md) · [AR](docs/playbooks/submit-exam-marks.ar.md) |
| 10 | [ملخص المؤسسة](docs/playbooks/institution-summary.md) | المؤسسة | مسؤول، ولي أمر | [RU](docs/playbooks/institution-summary.ru.md) · [ES](docs/playbooks/institution-summary.es.md) · [HI](docs/playbooks/institution-summary.hi.md) · [AR](docs/playbooks/institution-summary.ar.md) |
| 11 | [إنشاء إحصائيات المؤسسة PDF](docs/playbooks/generate-institution-statistics-pdf.md) | التقرير | مسؤول | [RU](docs/playbooks/generate-institution-statistics-pdf.ru.md) · [ES](docs/playbooks/generate-institution-statistics-pdf.es.md) · [HI](docs/playbooks/generate-institution-statistics-pdf.hi.md) · [AR](docs/playbooks/generate-institution-statistics-pdf.ar.md) |
| 12 | [عرض آخر حضور](docs/playbooks/view-latest-attendance.md) | الحضور | معلم، مسؤول، ولي أمر | [RU](docs/playbooks/view-latest-attendance.ru.md) · [ES](docs/playbooks/view-latest-attendance.es.md) · [HI](docs/playbooks/view-latest-attendance.hi.md) · [AR](docs/playbooks/view-latest-attendance.ar.md) |
| 13 | [عرض ملف الطالب الشخصي](docs/playbooks/view-student-profile.md) | الطلاب | معلم، مسؤول | [RU](docs/playbooks/view-student-profile.ru.md) · [ES](docs/playbooks/view-student-profile.es.md) · [HI](docs/playbooks/view-student-profile.hi.md) · [AR](docs/playbooks/view-student-profile.ar.md) |
| 14 | [عرض درجات الطالب](docs/playbooks/view-student-marks.md) | التقييم | معلم، مسؤول، ولي أمر | [RU](docs/playbooks/view-student-marks.ru.md) · [ES](docs/playbooks/view-student-marks.es.md) · [HI](docs/playbooks/view-student-marks.hi.md) · [AR](docs/playbooks/view-student-marks.ar.md) |
| 15 | [عرض تقرير الفصل](docs/playbooks/view-class-report.md) | التقرير | معلم، مسؤول | [RU](docs/playbooks/view-class-report.ru.md) · [ES](docs/playbooks/view-class-report.es.md) · [HI](docs/playbooks/view-class-report.hi.md) · [AR](docs/playbooks/view-class-report.ar.md) |
| 16 | [عرض الجدول الزمني](docs/playbooks/view-timetable.md) | الجدول الزمني | معلم، مسؤول، طالب | [RU](docs/playbooks/view-timetable.ru.md) · [ES](docs/playbooks/view-timetable.es.md) · [HI](docs/playbooks/view-timetable.hi.md) · [AR](docs/playbooks/view-timetable.ar.md) |
| 17 | [عرض ملف المؤسسة الشخصي الكامل](docs/playbooks/view-institution-profile.md) | المؤسسة | مسؤول، ولي أمر، عامة | [RU](docs/playbooks/view-institution-profile.ru.md) · [ES](docs/playbooks/view-institution-profile.es.md) · [HI](docs/playbooks/view-institution-profile.hi.md) · [AR](docs/playbooks/view-institution-profile.ar.md) |
| 18 | [عرض ملف الفصل الشخصي الكامل](docs/playbooks/view-class-profile.md) | الطلاب | معلم، مسؤول | [RU](docs/playbooks/view-class-profile.ru.md) · [ES](docs/playbooks/view-class-profile.es.md) · [HI](docs/playbooks/view-class-profile.hi.md) · [AR](docs/playbooks/view-class-profile.ar.md) |
| 19 | [عرض ملف الموظف الشخصي الكامل](docs/playbooks/view-staff-profile.md) | الموظفون | مسؤول، موارد بشرية | [RU](docs/playbooks/view-staff-profile.ru.md) · [ES](docs/playbooks/view-staff-profile.es.md) · [HI](docs/playbooks/view-staff-profile.hi.md) · [AR](docs/playbooks/view-staff-profile.ar.md) |
| 20 | [تحسين ملف الطالب الشخصي](docs/playbooks/enhance-student-profile.md) | الطلاب | معلم، مسؤول، مرشد | [RU](docs/playbooks/enhance-student-profile.ru.md) · [ES](docs/playbooks/enhance-student-profile.es.md) · [HI](docs/playbooks/enhance-student-profile.hi.md) · [AR](docs/playbooks/enhance-student-profile.ar.md) |
| 21 | [عرض بنية المؤسسة التحتية](docs/playbooks/view-institution-infrastructure.md) | المؤسسة | مسؤول، مرافق | [RU](docs/playbooks/view-institution-infrastructure.ru.md) · [ES](docs/playbooks/view-institution-infrastructure.es.md) · [HI](docs/playbooks/view-institution-infrastructure.hi.md) · [AR](docs/playbooks/view-institution-infrastructure.ar.md) |
| 22 | [عرض وجبات المؤسسة](docs/playbooks/view-institution-meals.md) | المؤسسة | مسؤول، أخصائي تغذية، ولي أمر | [RU](docs/playbooks/view-institution-meals.ru.md) · [ES](docs/playbooks/view-institution-meals.es.md) · [HI](docs/playbooks/view-institution-meals.hi.md) · [AR](docs/playbooks/view-institution-meals.ar.md) |
| 23 | [عرض ملف مخاطر الطالب](docs/playbooks/view-student-risks.md) | الطلاب | مسؤول، مرشد، معلم | [RU](docs/playbooks/view-student-risks.ru.md) · [ES](docs/playbooks/view-student-risks.es.md) · [HI](docs/playbooks/view-student-risks.hi.md) · [AR](docs/playbooks/view-student-risks.ar.md) |
| 24 | [عرض ملخص مخاطر المؤسسة](docs/playbooks/view-institution-risks.md) | المؤسسة | مسؤول، وزارة | [RU](docs/playbooks/view-institution-risks.ru.md) · [ES](docs/playbooks/view-institution-risks.es.md) · [HI](docs/playbooks/view-institution-risks.hi.md) · [AR](docs/playbooks/view-institution-risks.ar.md) |
| 25 | [إضافة معدات أو أصول ✏️](docs/playbooks/add-institution-asset.md) | البنية التحتية | مسؤول، محاسب، مرافق | [RU](docs/playbooks/add-institution-asset.ru.md) · [ES](docs/playbooks/add-institution-asset.es.md) · [HI](docs/playbooks/add-institution-asset.hi.md) · [AR](docs/playbooks/add-institution-asset.ar.md) |
| 26 | [تسجيل إصلاح بنية تحتية ✏️](docs/playbooks/record-infrastructure-repair.md) | البنية التحتية | مسؤول، محاسب، مرافق | [RU](docs/playbooks/record-infrastructure-repair.ru.md) · [ES](docs/playbooks/record-infrastructure-repair.es.md) · [HI](docs/playbooks/record-infrastructure-repair.hi.md) · [AR](docs/playbooks/record-infrastructure-repair.ar.md) |
| 27 | [إضافة برنامج وجبات جديد ✏️](docs/playbooks/add-meal-programme.md) | الوجبات | مسؤول، محاسب، أخصائي تغذية | [RU](docs/playbooks/add-meal-programme.ru.md) · [ES](docs/playbooks/add-meal-programme.es.md) · [HI](docs/playbooks/add-meal-programme.hi.md) · [AR](docs/playbooks/add-meal-programme.ar.md) |

---

## الخطط

| | **مجاني** | **Individual Pro** | **Institution Pro** | **Country Pro** |
|---|---|---|---|---|
| **النطاق** | أي مستخدم | شخص واحد | مدرسة واحدة | وزارة / وطني |
| **الترخيص** | MIT | BSL 1.1 | BSL 1.1 | BSL 1.1 |
| أدوات القراءة (جميع الموارد الـ 675، Core 5.10.0) | ✅ | ✅ | ✅ | ✅ |
| 40 دليل إجراءات مختار (26 قراءة · 14 كتابة/مصادقة · 28 مع ترجمات) | ✅ | ✅ | ✅ | ✅ |
| وضع stdio (Claude Code، Cursor، Cline) | ✅ | ✅ | ✅ | ✅ |
| **وضع خادم HTTP** (تثبيت Oracle / VPS) | — | ✅ | ✅ | ✅ |
| **محول OpenAPI** (ChatGPT Custom GPT، أي عميل REST) | — | ✅ | ✅ | ✅ |
| الكتابة المباشرة — سجل واحد | — | ✅ | ✅ | ✅ |
| سجل تدقيق المؤسسة | — | — | ✅ | ✅ |
| تنفيذ مسار سير العمل | — | — | ✅ | ✅ |
| بوابة موافقة مسؤول المؤسسة | — | — | ✅ | ✅ |
| عمليات الدُفعات داخل مؤسسة واحدة | — | — | ✅ | ✅ |
| عمليات الدُفعات متعددة المؤسسات | — | — | — | ✅ |
| بوابات موافقة الوزارة | — | — | — | ✅ |
| الإشراف عبر المؤسسات | — | — | — | ✅ |
| التراجع عند الفشل الجزئي | — | — | — | ✅ |

→ **التسعير والوصول:** khindol.madraimov@gmail.com

---

## الترخيص

[MIT](LICENSE.md) — © 2026 خيندول مدرايموف

---

## الشكر والتقدير

تم البناء بواسطة فريق منظم من وكلاء الذكاء الاصطناعي تحت التوجيه البشري — راجع [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) للفريق الكامل: المستشار أراستو، المارشال ساني، الساموراي هايكو، زيفيرين زيردال، الكابتن نيمو، كودي (GPT-5)، ميني كوينكو (Qwen 2.5 Coder 7B)، ميني كوين (Qwen 3.5 9B)، وجيمي (Gemma 4e4b) — لكل منهم أدوار مميزة عبر الهندسة المعمارية، الكود، التحليل، والترجمة متعددة اللغات.

---

*غير تابع لـ OpenEMIS أو القائمين عليه. هذا جسر طرف ثالث يتحدث واجهة برمجة تطبيقات Core العامة. تبقى بيانات الاعتماد والبيانات على جهازك.*
