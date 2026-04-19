# openemis-mcp

**جسر لغوي طبيعي بين الوكلاء المدركين لـ MCP (Claude، Codex، Cursor، إلخ) وأي نسخة من OpenEMIS.**

مبني على **واجهة برمجة التطبيقات الأساسية المنشورة لـ OpenEMIS Core** (الوثائق المرجعية على [api.openemis.org/core](https://api.openemis.org/core)) و **تم التحقق منه من البداية إلى النهاية ضد النسخة التجريبية العامة على [demo.openemis.org/core](https://demo.openemis.org/core)** باستخدام بيانات اعتماد حقيقية، وبيانات حقيقية، ودورات اتصال حقيقية.

اسأل بالإنجليزية:

> *"كم عدد الطلاب الحاليين في مدرسة أفوري الابتدائية؟"*

يخطط الوكيل للمكالمات، يقدم هذا MCP البيانات، وتحصل على الإجابة:

> *"مدرسة أفوري الابتدائية (الرمز P1002) لديها 553 طالبًا مسجلين حاليًا."*

أنتم لا تكتبون سطرًا واحدًا من التعليمات البرمجية. أنتم لا ترون JSON. أنتم فقط تسألون.

> **الحالة:** v0.3.0 — **عمليات CRUD الكاملة** للموارد غير الخاضعة لسير العمل. تعمل استعلامات القراءة ضد كل مورد في OpenEMIS v5. أدوات الكتابة (إنشاء/تحديث/حذف) نشطة لجميع الموارد التي لا تمر عبر إضافة CakePHP Workflow. الموارد الخاضعة لسير العمل (مثل الحضور، إجازة الموظفين) محظورة على مستوى الأداة ويتم توجيهها إلى دليل الإجراءات المناسب.

---

## لماذا يوجد هذا

واجهة برمجة التطبيقات REST الأساسية لـ OpenEMIS كبيرة — حيث تعرض واجهة v5 وحدها حوالي **1350 نقطة نهاية عبر ~670 موردًا**. لا يمكن لأي وكيل ذكي استيعاب ذلك في السياق، كما أن الاستبطان الخام على طراز Swagger يغمر المحادثة بضوضاء ليس لها علاقة بسؤال المستخدم الفعلي.

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
| `openemis_list_playbooks` | v0.2 | يسرد جميع أدلة الإجراءات السبعة والعشرين المختارة مع المعرف، العنوان، النطاق، والجمهور. يستخدم الوكيل هذا للعثور على الدليل التدريجي المناسب لمهمة على مستوى المستخدم. |
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
│  • openemis_list_play… │  ← سرد جميع أدلة الإجراءات الـ 16 الخاصة بسير العمل
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

- [مرجع الموارد](docs/resources.md) — جميع الموارد الـ 645 مع توفر طريقة HTTP وحالة الكتابة
- [أدلة الإجراءات](docs/playbooks/) — 27 دليل إجراءات مختار لسير العمل (24 قراءة · 3 كتابة)
- [دليل المعلم لـ ChatGPT](docs/CHATGPT-TEACHER-GUIDE.md) — كيفية السماح للمعلمين بتسجيل الحضور عبر ChatGPT Custom GPT
- [روتين تأليف دليل الإجراءات](docs/PLAYBOOK-ROUTINE.md) — عملية من 4 خطوات لإضافة أدلة إجراءات جديدة

### أدلة الإجراءات

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

## خارطة الطريق

### v0.4.0 — مصادقة المتصفح (مخطط)

اليوم، تتطلب بيانات الاعتماد `api_key` صادر يدويًا من مسؤول OpenEMIS. ستضيف v0.4.0 أداة اختيارية `openemis_browser_auth` تلغي جميع تكوينات بيانات الاعتماد اليدوية:

1. تطلق الأداة متصفح Playwright محلي — **لا حاجة لعنوان URL مستهدف مسبقًا**.
2. يتنقل المستخدم إلى نسخة OpenEMIS الخاصة به ويسجل الدخول بشكل طبيعي.
3. يراقب Playwright كل حركة مرور الشبكة. عندما يرى استجابة لـ **`POST */api/v5/login`** أو **`POST */api/v4/login`** (كلاهما يعيدان نفس JWT):
   - يتم استخراج **عنوان URL الأساسي** تلقائيًا من عنوان URL الطلب (مثل `https://dev-demo.openemis.org/core/api/v5/login` → أساسي `https://dev-demo.openemis.org/core`) — لا حاجة لتكوين `OPENEMIS_BASE_URL` مسبقًا.
   - يتم استخراج **JWT** من جسم الاستجابة.
4. يتم تخزين كلاهما مؤقتًا في الذاكرة واستخدامهما لجميع مكالمات CRUD اللاحقة.

هذا يزيل `OPENEMIS_BASE_URL`، `OPENEMIS_USERNAME`، `OPENEMIS_PASSWORD`، و `OPENEMIS_API_KEY` كمتطلبات — المستخدم فقط يفتح متصفحًا ويسجل الدخول. يعمل مع أي نسخة OpenEMIS، أي نطاق، أي نطاق فرعي، بما في ذلك بيئات التطوير، والاختبار، والإنتاج دون أي إعادة تكوين.

**تبقى بيانات الاعتماد القائمة على `.env` مدعومة بالكامل** — الإعدادات الحالية دون تغيير. مصادقة المتصفح اختيارية عبر الأداة الجديدة.

### v0.5.0 — لوحات تحكم المخاطر ✅

`view-student-risks` و `view-institution-risks` — تم الشحن. درجات المخاطر، تفصيل حسب المعيار، حالات الرعاية، قواعد التنبيه، وسجلات التسليم.

### v0.6.0 — مسارات سير العمل *(Institution Pro + Country Pro)*

أدوات الكتابة الحالية (`openemis_create`, `openemis_update`, `openemis_delete`) تنفذ عملية واحدة في كل مرة. تأخذ مسارات سير العمل هذا إلى أبعد من ذلك: **ينسق MCP دليل إجراءات متعدد الخطوات بالكامل تلقائيًا**، يحمل الحالة من خطوة إلى أخرى ويطبق التحقق قبل الالتزام في كل مرحلة.

**أداة جديدة:** `openemis_run_workflow { playbook_id, params, dry_run? }` — يقبل معرف دليل إجراءات ومعلمات إدخال منظمة، ينفذ جميع الخطوات بالتسلسل، يعيد سجل تشغيل منظم. في وضع التجربة الجافة، يبلغ عما سيتغير دون كتابة أي شيء.

مسارات سير العمل مقيدة فوق Individual Pro لأن عمليات الكتابة الجماعية بالذكاء الاصطناعي على مستوى المؤسسة أو الوطني تحتاج إلى إشراف. معلم يسجل 30 طالبًا يحتاج إلى سرعة؛ مكتب منطقة يسجل 500 طالب عبر 20 مدرسة يحتاج إلى تدقيق وموافقة.

| الميزة | Individual Pro | Institution Pro | Country Pro |
|---|---|---|---|---|
| الكتابة المباشرة (سجل واحد) | ✅ | ✅ | ✅ |
| سجل تدقيق المؤسسة | — | ✅ | ✅ |
| تنفيذ مسار سير العمل | — | ✅ | ✅ |
| بوابة موافقة مسؤول المؤسسة | — | ✅ | ✅ |
| عمليات الدُفعات داخل مؤسسة واحدة | — | ✅ | ✅ |
| عمليات الدُفعات متعددة المؤسسات | — | — | ✅ |
| بوابات موافقة الوزارة | — | — | ✅ |
| لوحة تحكم إشرافية عبر المؤسسات | — | — | ✅ |
| التراجع عند الفشل الجزئي | — | — | ✅ |

---

## الخطط

| | **مجاني** | **Individual Pro** | **Institution Pro** | **Country Pro** |
|---|---|---|---|---|
| **النطاق**
# OpenEMIS API Bridge

**جسر API لنظام إدارة التعليم المفتوح (OpenEMIS)** — أداة سطر أوامر (CLI) وواجهة برمجة تطبيقات (API) مفتوحة المصدر للتفاعل مع واجهة برمجة تطبيقات OpenEMIS Core.

[![npm version](https://img.shields.io/npm/v/openemis-api-bridge.svg)](https://www.npmjs.com/package/openemis-api-bridge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

---

## ⚠️ تحذير: هذا مشروع تجريبي

هذا الجسر هو **أداة تجريبية** تم تطويرها من قبل مجتمع المستخدمين. إنه:
- **غير رسمي** — غير تابع لـ OpenEMIS أو المطورين الأصليين.
- **غير مدعوم** — لا توجد ضمانات للاستقرار أو الأمان.
- **للاستخدام على مسؤوليتك الخاصة** — اختبر دائمًا في بيئة غير إنتاجية أولاً.

**يتم تخزين بيانات الاعتماد والبيانات الحساسة على جهازك المحلي فقط.** لا يتم إرسال أي شيء إلى خوادم الطرف الثالث.

---

## 📌 نظرة عامة

`openemis-api-bridge` هو أداة سطر أوامر (CLI) وواجهة برمجة تطبيقات (API) تتيح لك:
- **الاستعلام** عن البيانات من OpenEMIS Core (قراءة فقط بشكل افتراضي).
- **إنشاء/تحديث/حذف** السجلات عبر واجهة برمجة التطبيقات العامة.
- **أتمتة** مهام إدارة المؤسسات التعليمية.
- **التكامل** مع أنظمة الطرف الثالث (مثل لوحات المعلومات، أدوات التحليل).
- **الترحيل** الجماعي للبيانات بين بيئات OpenEMIS.

يعمل الجسر كوسيط بين تطبيقك وواجهة برمجة تطبيقات OpenEMIS Core الرسمية، معالجة المصادقة، وإدارة الجلسات، وإعادة المحاولات التلقائية، والتحقق من الأخطاء.

---

## 🚀 البدء السريع

### التثبيت

```bash
npm install -g openemis-api-bridge
```

أو استخدام `npx` بدون تثبيت عالمي:

```bash
npx openemis-api-bridge --help
```

### التكوين الأساسي

1. **إنشاء ملف تكوين** (`openemis-config.json`):

```json
{
  "baseUrl": "https://your-openemis-instance.com",
  "username": "your_api_user",
  "password": "your_api_password",
  "institutionId": 12345,
  "academicPeriodId": 5
}
```

2. **اختبار الاتصال**:

```bash
openemis-api-bridge test-connection
```

3. **جلب بعض البيانات**:

```bash
# جلب جميع المؤسسات
openemis-api-bridge get institutions

# جلب فصول مؤسسة محددة
openemis-api-bridge get institution-classes --institution-id 12345

# جلب الطلاب في فصل معين
openemis-api-bridge get institution-class-students --institution-class-id 67890
```

---

## 📖 التوثيق الكامل

### الأوامر الأساسية

| الأمر | الوصف |
|-------|---------|
| `openemis-api-bridge get <resource>` | جلب سجلات مورد معين |
| `openemis-api-bridge create <resource>` | إنشاء سجل جديد |
| `openemis-api-bridge update <resource>` | تحديث سجل موجود |
| `openemis-api-bridge delete <resource>` | حذف سجل |
| `openemis-api-bridge test-connection` | اختبار اتصال واجهة برمجة التطبيقات |
| `openemis-api-bridge list-resources` | عرض جميع الموارد المتاحة |
| `openemis-api-bridge repl` | بدء جلسة REPL تفاعلية |

### الموارد المدعومة

يدعم الجسر **جميع نقاط نهاية واجهة برمجة تطبيقات OpenEMIS Core العامة**، بما في ذلك:

- **المؤسسات**: `institutions`, `institution-lands`, `institution-buildings`
- **الأكاديمية**: `academic-periods`, `education-grades`, `education-subjects`
- **الطلاب**: `students`, `student-admission`, `student-withdraw`
- **الموظفين**: `staff`, `staff-position-profiles`
- **الفصول**: `institution-classes`, `institution-class-students`
- **التقييمات**: `assessment-items`, `assessment-grading-types`
- **والمزيد** — استخدم `list-resources` للحصول على القائمة الكاملة.

### الخيارات الشائعة

| العلم | الوصف |
|-------|---------|
| `--config <path>` | مسار ملف التكوين (افتراضي: `./openemis-config.json`) |
| `--output <format>` | تنسيق الإخراج (`json`, `table`, `csv`) |
| `--filter <field=value>` | تصفية النتائج حسب الحقل |
| `--fields <field1,field2>` | تحديد الحقول المراد إرجاعها |
| `--limit <number>` | تحديد عدد السجلات |
| `--page <number>` | رقم الصفحة للترقيم |
| `--institution-id <id>` | تجاوز معرف المؤسسة من التكوين |
| `--academic-period-id <id>` | تجاوز الفترة الأكاديمية من التكوين |
| `--dry-run` | محاكاة العملية دون إجراء تغييرات فعلية |

---

## 🔧 الاستخدام المتقدم

### التكوين المتقدم

```json
{
  "baseUrl": "https://openemis.example.com",
  "username": "api_user",
  "password": "secure_password",
  "institutionId": 1001,
  "academicPeriodId": 2024,
  "timeout": 30000,
  "maxRetries": 3,
  "logLevel": "info",
  "cacheTtl": 300,
  "customHeaders": {
    "X-Custom-Header": "Value"
  }
}
```

### أمثلة على سيناريوهات العالم الحقيقي

#### 1. **ترحيل الطلاب من نظام قديم**

```bash
# 1. تصدير الطلاب من النظام القديم إلى CSV
# 2. تحويل CSV إلى JSON متوافق مع OpenEMIS
# 3. استيراد باستخدام الجسر

openemis-api-bridge create students --file ./students-to-import.json --batch-size 50
```

#### 2. **تحديث درجات الطلاب بشكل جماعي**

```bash
# جلب جميع التقييمات لفترة أكاديمية
openemis-api-bridge get assessments --academic-period-id 5 --output json > assessments.json

# معالجة وتحديث الدرجات
openemis-api-bridge update assessment-item-results --file ./updated-grades.json
```

#### 3. **إنشاء تقارير مخصصة**

```bash
# جلب بيانات متعددة ودمجها
openemis-api-bridge get institutions --fields id,name,code > institutions.json
openemis-api-bridge get institution-classes --institution-id 1001 > classes.json
openemis-api-bridge get students --institution-id 1001 > students.json

# استخدام jq لمعالجة JSON
jq -s '.[0] as $inst | .[1] as $classes | .[2] as $students | ...' institutions.json classes.json students.json > report.json
```

#### 4. **أتمتة عمليات بداية العام الدراسي**

```bash
#!/bin/bash
# سكريبت لإنشاء فصول جديدة لكل مؤسسة

for INST_ID in 1001 1002 1003; do
  echo "معالجة المؤسسة $INST_ID"
  
  # إنشاء فصول للصفوف 1-6
  for GRADE in 1 2 3 4 5 6; do
    openemis-api-bridge create institution-classes \
      --institution-id $INST_ID \
      --data "{\"name\": \"الصف $GRADE\", \"academic_period_id\": 2024, \"education_grade_id\": $GRADE}"
  done
done
```

### استخدام واجهة برمجة التطبيقات (API) مباشرة في Node.js

```javascript
const { OpenEMISClient } = require('openemis-api-bridge');

async function main() {
  const client = new OpenEMISClient({
    baseUrl: 'https://your-openemis-instance.com',
    username: 'api_user',
    password: 'api_password'
  });

  await client.login();
  
  // جلب جميع المؤسسات
  const institutions = await client.get('institutions');
  
  // إنشاء طالب جديد
  const newStudent = await client.create('students', {
    first_name: 'أحمد',
    last_name: 'محمد',
    gender_id: 1,
    date_of_birth: '2015-03-15'
  });
  
  // تحديث فصل
  await client.update('institution-classes', 123, {
    name: 'الصف العاشر - القسم أ'
  });
}

main().catch(console.error);
```

---

## 🔐 الأمان وأفضل الممارسات

### إدارة بيانات الاعتماد

**⚠️ لا تخزن كلمات المرور في سكريبتات النسخ الاحتياطي أو نظام التحكم بالإصدارات!**

1. **استخدام متغيرات البيئة**:
```bash
export OPENEMIS_URL="https://your-instance.com"
export OPENEMIS_USERNAME="api_user"
export OPENEMIS_PASSWORD="secret"
openemis-api-bridge get institutions
```

2. **ملفات التكوين الآمنة**:
```bash
# تخزين ملف التكوين خارج مستودع الكود
chmod 600 ~/.openemis-config.json
openemis-api-bridge --config ~/.openemis-config.json get institutions
```

3. **استخدام أدوات إدارة الأسرار** (مثل `pass`, `1password`, `Hashicorp Vault`).

### أذونات واجهة برمجة التطبيقات

- أنشئ مستخدم واجهة برمجة تطبيقات مخصصًا في OpenEMIS مع **الحد الأدنى من الأذونات المطلوبة**.
- استخدم أدوارًا مختلفة لمهام مختلفة (قراءة فقط للتقارير، كتابة للاستيراد).
- راجع الأذونات بانتظام وأزل الوصول غير الضروري.

### معالجة الأخطاء وإعادة المحاولة

يتضمن الجسر معالجة أخطاء قوية:
- **إعادة المحاولة التلقائية** لفشل الشبخة المؤقتة.
- **التراجع** للعمليات المجمعة عند الفشل الجزئي.
- **التسجيل** التفصيلي لوضع التصحيح.

```bash
# تمكين التسجيل المفصل
openemis-api-bridge get institutions --log-level debug

# تعطيل إعادة المحاولة (للفشل السريع)
openemis-api-bridge get institutions --max-retries 0
```

---

## 🐛 استكشاف الأخطاء وإصلاحها

### مشاكل الاتصال الشائعة

| المشكلة | الحل المحتمل |
|---------|---------------|
| `ECONNREFUSED` أو مهلة | تحقق من عنوان URL وفتح المنافذ (عادة 443 لـ HTTPS) |
| `401 Unauthorized` | تحقق من بيانات اعتماد المستخدم/كلمة المرور |
| `403 Forbidden` | تحقق من أذونات مستخدم واجهة برمجة التطبيقات |
| `404 Not Found` | تحقق من مسار مورد واجهة برمجة التطبيقات (قد يكون مختلفًا بين إصدارات OpenEMIS) |
| `429 Too Many Requests` | تقليل التردد، إضافة تأخيرات بين الطلبات |

### تمكين وضع التصحيح

```bash
# مستوى تسجيل عالٍ
OPENEMIS_LOG_LEVEL=debug openemis-api-bridge get institutions

# تسجيل طلبات/استجابات HTTP الخام
OPENEMIS_DEBUG=http openemis-api-bridge test-connection
```

### التحقق من التوافق مع إصدار OpenEMIS

```bash
# جلب إصدار OpenEMIS
openemis-api-bridge get system-version
```

---

## 🤝 المساهمة

نرحب بالمساهمات! راجع [دليل المساهمة](CONTRIBUTING.md) للبدء.

### طرق المساهمة

1. **الإبلاغ عن الأخطاء** — استخدم [متعقب المشكلات](https://github.com/yourusername/openemis-api-bridge/issues).
2. **طلب الميزات** — ما الذي تريد رؤيته في الإصدارات القادمة؟
3. **إرسال طلبات السحب** — تحسينات التعليمات البرمجية، التوثيق، الأمثلة.
4. **تحسين الترجمة** — المساعدة في ترجمة التوثيق للغات أخرى.
5. **شارك حالات الاستخدام** — كيف تستخدم الجسر؟ قد يساعد الآخرين.

### بيئة التطوير

```bash
# استنساخ المستودع
git clone https://github.com/yourusername/openemis-api-bridge.git
cd openemis-api-bridge

# تثبيت التبعيات
npm install

# تشغيل الاختبارات
npm test

# بناء الحزمة
npm run build

# الربط العالمي للتطوير
npm link
```

---

## 📊 مقارنة الميزات

| الميزة | CLI الأساسي | CLI المتقدم | واجهة برمجة التطبيقات (API) الأساسية | واجهة برمجة التطبيقات (API) المتقدمة |
|--------|-------------|--------------|-------------------|-------------------|
| **القراءة فقط** (GET عمليات) | ✅ | ✅ | ✅ | ✅ |
| **الكتابة** (POST/PUT/DELETE) | — | ✅ | — | ✅ |
| **التكوين من ملف** | ✅ | ✅ | ✅ | ✅ |
| **التكوين الديناميكي** (سطر الأوامر) | — | ✅ | ✅ | ✅ |
| **الترقيم التلقائي** | ✅ | ✅ | ✅ | ✅ |
| **التصفية/الفرز** | ✅ | ✅ | ✅ | ✅ |
| **العمليات المجمعة** | — | ✅ | — | ✅ |
| **وضع الجاف** (dry-run) | — | ✅ | — | ✅ |
| **التسجيل/التصحيح** | أساسي | متقدم | أساسي | متقدم |
| **التخزين المؤقت** | — | ✅ | — | ✅ |
| **المصادقة المتقدمة** (OAuth2) | — | — | — | ✅ |
| **المسارات المخصصة** | — | — | — | ✅ |
| **المعالجة المسبقة/البعدية** | — | — | — | ✅ |
| **التحقق من الصحة** | أساسي | متقدم | أساسي | متقدم |
| **الترجمة** (توثيق) | — | ✅ | — | ✅ |
| **البرامج النصية المنسقة + الترجمات** | ✅ | ✅ | ✅ | ✅ |
| **وضع stdio** (Claude Code, Cursor, Cline) | ✅ | ✅ | ✅ | ✅ |
| **وضع خادم HTTP** (تثبيت Oracle / VPS) | — | ✅ | ✅ | ✅ |
| **محول OpenAPI** (ChatGPT Custom GPT، أي عميل REST) | — | ✅ | ✅ | ✅ |
| **الكتابة المباشرة** — سجل واحد | — | ✅ | ✅ | ✅ |
| **سجل تدقيق المؤسسة** | — | — | ✅ | ✅ |
| **تنفيذ مسار سير العمل** | — | — | ✅ | ✅ |
| **بوابة موافقة مدير المؤسسة** | — | — | ✅ | ✅ |
| **العمليات المجمعة داخل مؤسسة واحدة** | — | — | ✅ | ✅ |
| **العمليات المجمعة متعددة المؤسسات** | — | — | — | ✅ |
| **بوابات موافقة الوزارة** | — | — | — | ✅ |
| **الإشراف عبر المؤسسات** | — | — | — | ✅ |
| **التراجع عند الفشل الجزئي** | — | — | — | ✅ |

→ **التسعير والوصول:** khindol.madraimov@gmail.com

---

## الترخيص

[MIT](LICENSE.md) — © 2026 خيندول مدرايموف

---

## الشكر والتقدير

تم البناء بواسطة فريق منظم من وكلاء الذكاء الاصطناعي تحت التوجيه البشري — راجع [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) للفريق الكامل: المستشار أراستو، المارشال ساني، الساموراي هايكو، زيفيرين زيردال، الكابتن نيمو، كودي (GPT-5)، ميني كوينكو (Qwen 2.5 Coder 7B)، ميني كوين (Qwen 3.5 9B)، وجيمي (Gemma 4e4b) — لكل منهم أدوار مميزة عبر الهندسة المعمارية، الكود، التحليل، والترجمة متعددة اللغات.

---

*غير تابع لـ OpenEMIS أو القائمين عليه. هذا جسر طرف ثالث يتحدث واجهة برمجة تطبيقات Core العامة. تبقى بيانات الاعتماد والبيانات على جهازك.*