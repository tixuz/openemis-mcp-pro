# openemis-mcp

**Естественно-языковой мост между агентами, поддерживающими MCP (Claude, Codex, Cursor и др.), и любым экземпляром OpenEMIS.**

Построен поверх опубликованного **OpenEMIS Core API** (справочная документация на [api.openemis.org/core](https://api.openemis.org/core)) и **полностью протестирован на публичном демо-сервере [demo.openemis.org/core](https://demo.openemis.org/core)** с реальными учетными данными, реальными данными и реальными запросами.

Задайте вопрос на английском:

> *"How many current students are at Avory Primary?"*

Агент планирует вызовы, этот MCP доставляет данные, и вы получаете ответ:

> *"Avory Primary School (code P1002) has 553 currently enrolled students."*

Вам не нужно писать ни строчки кода. Вы не видите JSON. Вы просто спрашиваете.

> **Статус:** v0.3.0 — **полный CRUD** для ресурсов без workflow. Запросы на чтение работают для каждого ресурса OpenEMIS v5. Инструменты записи (создание/обновление/удаление) активны для всех ресурсов, которые не проходят через плагин CakePHP Workflow. Ресурсы, контролируемые workflow (посещаемость, отпуска сотрудников), заблокированы на уровне инструментов и перенаправляют на соответствующий плейбук.

---

## Зачем это нужно

REST API OpenEMIS Core обширен — только поверхность v5 предоставляет около **1350 эндпоинтов для ~670 ресурсов**. Ни один ИИ-агент не может удержать это в контексте, а сырая интроспекция в стиле Swagger заполняет диалог шумом, не имеющим отношения к реальному вопросу пользователя.

Этот MCP решает проблему двумя способами:

1.  **Обнаружение в рамках домена.** Вместо того чтобы сбрасывать весь API в контекст агента, инструмент `openemis_discover(topic)` сужает область до ~20–30 эндпоинтов, относящихся к тому, о чём на самом деле спрашивает пользователь ("посещаемость", "студенты", "оценки") — с помощью небольшого курируемого набора заметок `Domain-*.md`.
2.  **Единый, компонуемый геттер.** Один инструмент `openemis_get` охватывает список + одиночный объект + фильтрованный поиск по каждому ресурсу. Агент предоставляет `resource` + опционально `id` + опционально `params` (`_fields`, `_conditions`, `orderby`, `page`, `limit`), а остальная часть DSL запросов OpenEMIS в стиле CakePHP передаётся напрямую.

Чистый эффект: агенты отвечают на естественно-языковые вопросы за 2–4 вызова инструмента, а не за 30.

---

## Инструменты

| Инструмент | С версии | Что делает |
|---|---|---|
| `openemis_health` | v0.1 | Проверяет доступность настроенного экземпляра. Выполняет реальный цикл входа в систему — если он проходит, CRUD будет работать. |
| `openemis_list_domains` | v0.1 | Перечисляет курируемые домены OpenEMIS — Attendance, Assessment, Staff, Student, Institution, Schedule, Examination, Report — каждый с кратким описанием. Агент использует это, чтобы понять, *к какой области* относится вопрос. |
| `openemis_discover` | v0.1 | Вход: строка темы. Выход: до 30 эндпоинтов, относящихся к этой теме, взятых из набора знаний о домене и манифеста конкретного экземпляра. Сохраняет диалоги компактными независимо от размера базового API. |
| `openemis_list_playbooks` | v0.2 | Перечисляет все 27 курируемых плейбуков workflow с id, названием, доменом и аудиторией. Агент использует это, чтобы найти подходящее пошаговое руководство для задачи на уровне пользователя. |
| `openemis_get_playbook` | v0.2 | Вход: id плейбука. Выход: полный плейбук — ресурсы, упорядоченные шаги, пояснения и примеры запросов. |
| `openemis_get` | v0.1 | Унифицированный инструмент чтения. `{ resource, id?, params? }` — если присутствует `id`, извлекает одиночный объект; иначе выводит список с любой комбинацией `_fields`, `_conditions`, `orderby`, `order`, `page`, `limit`, плюс любой ключ ad-hoc фильтра. |
| `openemis_create` | v0.3.0 | Создать новую запись. `{ resource, body }` — только для ресурсов без workflow. Ресурсы, контролируемые workflow (например, institution-staff-leave), заблокированы и будут перенаправлять на соответствующий плейбук. |
| `openemis_update` | v0.3.0 | Обновить существующую запись по id. `{ resource, id, body }` — только для ресурсов без workflow. |
| `openemis_delete` | v0.3.0 | Удалить запись по id. `{ resource, id }` — только для ресурсов без workflow. |

Представительный естественно-языковой вопрос, например *"how many teachers at Avory Primary, how many vacant positions?"*, разрешается в три вызова `openemis_get` — связанных агентом, суженных с помощью `_conditions`, возвращённых в виде одного ответа на английском. Запрос на запись, например *"enrol a new student"*, использует `openemis_get_playbook` для загрузки пошагового руководства, а затем `openemis_create` для каждого шага записи.

---

## Проверено на demo.openemis.org

Каждое утверждение в этом README было проверено на публичном демо-экземпляре перед написанием:

-   `POST /api/v5/login` с `{ username, password, api_key }` → JWT кэширован, 331 символ
-   `GET /api/v5/institutions?limit=200&_fields=id,name,code` → 24 учреждения, включая `"Avory Primary School" (id=6, code P1002)`
-   `GET /api/v5/institution-students?institution_id=6&student_status_id=1&limit=1` → пагинация сообщает `last_page: 553` → **553 студента, зачисленных в настоящее время**
-   `GET /api/v5/academic-periods` → 7 страниц реальных данных об учебных годах
-   `GET /api/v5/absence-types` → `EXCUSED`, `UNEXCUSED`, `LATE` и т.д.

Пример `scripts/smoke-login.mjs`, поставляемый с этим репозиторием, выполняет тест входа в систему шаг за шагом, чтобы вы могли подтвердить доступность для своего собственного экземпляра перед подключением к Claude Code.

---

## Совместимые агенты

openemis-mcp использует **Model Context Protocol** через stdio — работает любой MCP-совместимый клиент:

| Агент | Как подключить |
|---|---|
| **Claude Code** (`claude` CLI) | `claude mcp add` — основной протестированный клиент, доступны все 9 инструментов |
| **Cursor** | Добавьте в `.cursor/mcp.json` — полный доступ к инструментам |
| **Cline / Continue** (VS Code) | Добавьте сервер в настройках MCP |
| **Codex** | Через мост [gemmy-and-qwenny](https://github.com/tixuz/gemmy-and-qwenny) |
| **Любой MCP клиент** | Укажите на `node dist/server.js` с установленными переменными окружения |

---

## Установка

Требуется **Node 22+** (для встроенных `fetch` и `AbortController`) и **Python 3.10+** (для скриптов сборщика манифеста и генератора плейбуков в `mcp-openemis-gen/`). Сам сервер MCP работает только на Node; Python нужен только если вы пересобираете манифест из исходников.

### Из GitHub

```bash
git clone https://github.com/tixuz/openemis-mcp.git
cd openemis-mcp

npm install
npm run build

cp .env.example .env
$EDITOR .env
```

### Настройка

`.env.example` документирует каждую переменную. Как минимум вам нужны три учетных данных, которые выдает ваш администратор OpenEMIS:

```env
OPENEMIS_BASE_URL=https://demo.openemis.org/core   # or your own instance
OPENEMIS_USERNAME=admin
OPENEMIS_PASSWORD=your_password
OPENEMIS_API_KEY=your_api_key

# Optional
OPENEMIS_TIMEOUT_MS=30000
OPENEMIS_VAULT_PATH=/absolute/path/to/domain-notes
OPENEMIS_MANIFEST_PATH=/absolute/path/to/manifest.jsonl
```

Сервер выполняет вход лениво при первом вызове аутентифицированного инструмента, отправляя POST на `/api/v5/login`, извлекая JWT из `data.token` и кэшируя его в памяти. При получении 401 он повторно входит в систему и повторяет попытку один раз.

`OPENEMIS_VAULT_PATH` указывает на папку, содержащую курируемые заметки `Domain-*.md`, используемые `openemis_discover`. Если они отсутствуют, обнаружение плавно деградирует до сопоставления ключевых слов только с манифестом.

`OPENEMIS_MANIFEST_PATH` указывает на вывод JSONL вспомогательного сборщика в `../mcp-openemis-gen/`. Если он отсутствует, инструменты обнаружения возвращают дружескую подсказку "manifest not built yet" — они не падают.

### Проверка доступности

```bash
set -a && source .env && set +a
node scripts/smoke-login.mjs
```

Ожидаемый результат:

```
[Test] Loading config...
[OK] Config loaded: baseUrl=https://demo.openemis.org/core
[Test] Creating client...
[OK] Client created
[Test] Attempting login...
[OpenEMIS] Login successful; cached JWT (331 chars)
[OK] Login successful
```

### Регистрация в Claude Code

```bash
claude mcp add openemis \
  --env OPENEMIS_BASE_URL="https://your-openemis/core" \
  --env OPENEMIS_USERNAME="…" \
  --env OPENEMIS_PASSWORD="…" \
  --env OPENEMIS_API_KEY="…" \
  --env OPENEMIS_VAULT_PATH="/absolute/path/to/vault" \
  -- node "$(pwd)/dist/server.js"

# Verify
claude mcp list | grep openemis
# Expected: openemis: node /…/dist/server.js - ✓ Connected
```

Любая новая сессия Claude Code в этом проекте будет автоматически видеть все девять инструментов.

---

## Архитектура

```
┌────────────────────────┐
│  Agent (Claude / …)    │     "How many current students at Avory?"
└───────────┬────────────┘
            │ MCP stdio (JSON-RPC)
┌───────────▼────────────┐
│  openemis-mcp          │  ← nine typed tools, ZodRawShape schemas
│  • openemis_health     │
│  • openemis_list_dom…  │  ← reads Domain-*.md from vault
│  • openemis_discover   │  ← topic → ≤30 scoped endpoints
│  • openemis_list_play… │  ← list all 16 workflow playbooks
│  • openemis_get_playbk │  ← load a playbook by id
│  • openemis_get / _create / _update / _delete   │
└───────────┬────────────┘
            │ HTTPS + Bearer JWT (cached, auto-refresh on 401)
┌───────────▼────────────┐
│  OpenEMIS Core API     │  api.openemis.org/core  (reference)
│  /api/v5/{resource}    │  demo.openemis.org/core (tested)
└────────────────────────┘
```

Принципы проектирования с первой строки кода:

1.  **В рамках домена, никогда не потоком.** Манифест может вырасти до тысяч эндпоинтов; контекст агента — нет. `openemis_discover(topic)` — это воронка — каждый диалог видит только нужный ему срез.
2.  **Инструменты записи в v0.3.0.** `openemis_create` / `openemis_update` / `openemis_delete` активны для всех ресурсов без workflow. Ресурсы, контролируемые workflow (посещаемость, посещаемость сотрудников), заблокированы на уровне инструментов и перенаправляют на соответствующий плейбук.
3.  **Бессостояние между вызовами.** В памяти кэшируется только JWT. Нет сохранения на диск, нет аналитики, ничего не отправляется домой.
4.  **Тонкий слой над реальным API.** Этот мост не изобретает новых концепций — имена `resource` соответствуют путям v5 в kebab-case, параметры запроса — это нативный DSL `_conditions` / `_fields`. То, что вы написали бы в curl, переводится 1:1.

---

## Документация

-   [Справочник по ресурсам](docs/resources.md) — все 645 ресурсов с доступностью HTTP-методов и статусом записи
-   [Плейбуки](docs/playbooks/) — 27 курируемых руководств по workflow (24 чтение · 3 запись)

### Плейбуки

| # | Плейбук | Домен | Аудитория | Переводы |
|---|---|---|---|---|
| 1 | [Count Vacant Positions](docs/playbooks/count-vacant-positions.md) | Staff | admin, hr | [RU](docs/playbooks/count-vacant-positions.ru.md) · [ES](docs/playbooks/count-vacant-positions.es.md) |
| 2 | [Mark Student Attendance](docs/playbooks/mark-student-attendance.md) | Attendance | teacher, admin | [RU](docs/playbooks/mark-student-attendance.ru.md) · [ES](docs/playbooks/mark-student-attendance.es.md) |
| 3 | [Mark Staff Attendance](docs/playbooks/mark-staff-attendance.md) | Staff | admin, hr, teacher | [RU](docs/playbooks/mark-staff-attendance.ru.md) · [ES](docs/playbooks/mark-staff-attendance.es.md) |
| 4 | [View Student Timetable](docs/playbooks/view-student-timetable.md) | Schedule | parent, student | [RU](docs/playbooks/view-student-timetable.ru.md) |
| 5 | [Student Dashboard](docs/playbooks/student-dashboard.md) | Student | parent, student | [RU](docs/playbooks/student-dashboard.ru.md) |
| 6 | [Generate Student Report Card PDF](docs/playbooks/generate-student-report-card-pdf.md) | Report | teacher, admin | [RU](docs/playbooks/generate-student-report-card-pdf.ru.md) · [ES](docs/playbooks/generate-student-report-card-pdf.es.md) |
| 7 | [Enrol a New Student](docs/playbooks/enroll-new-student.md) | Student | admin, registrar | [RU](docs/playbooks/enroll-new-student.ru.md) · [ES](docs/playbooks/enroll-new-student.es.md) |
| 8 | [Record a Behaviour Incident](docs/playbooks/record-behavior-incident.md) | Student | teacher, admin | [RU](docs/playbooks/record-behavior-incident.ru.md) · [ES](docs/playbooks/record-behavior-incident.es.md) |
| 9 | [Submit Exam Marks](docs/playbooks/submit-exam-marks.md) | Assessment | teacher | [RU](docs/playbooks/submit-exam-marks.ru.md) |
| 10 | [Institution Summary](docs/playbooks/institution-summary.md) | Institution | admin, parent | [RU](docs/playbooks/institution-summary.ru.md) |
| 11 | [Generate Institution Statistics PDF](docs/playbooks/generate-institution-statistics-pdf.md) | Report | admin | [RU](docs/playbooks/generate-institution-statistics-pdf.ru.md) · [ES](docs/playbooks/generate-institution-statistics-pdf.es.md) |
| 12 | [View Latest Attendance](docs/playbooks/view-latest-attendance.md) | Attendance | teacher, admin, parent | |
| 13 | [View Student Profile](docs/playbooks/view-student-profile.md) | Student | teacher, admin | [RU](docs/playbooks/view-student-profile.ru.md) |
| 14 | [View Student Marks](docs/playbooks/view-student-marks.md) | Assessment | teacher, admin, parent | [RU](docs/playbooks/view-student-marks.ru.md) |
| 15 | [View Class Report](docs/playbooks/view-class-report.md) | Report | teacher, admin | [RU](docs/playbooks/view-class-report.ru.md) |
| 16 | [View Timetable](docs/playbooks/view-timetable.md) | Schedule | teacher, admin, student | [RU](docs/playbooks/view-timetable.ru.md) |
| 17 | [View Full Institution Profile](docs/playbooks/view-institution-profile.md) | Institution | admin, parent, public | |
| 18 | [View Full Class Profile](docs/playbooks/view-class-profile.md) | Student | teacher, admin | |
| 19 | [View a Staff Member's Full Profile](docs/playbooks/view-staff-profile.md) | Staff | admin, hr | [RU](docs/playbooks/view-staff-profile.ru.md) |
| 20 | [Enhance Student Profile](docs/playbooks/enhance-student-profile.md) | Student | teacher, admin, counsellor | [ES](docs/playbooks/enhance-student-profile.es.md) |
| 21 | [View Institution Infrastructure](docs/playbooks/view-institution-infrastructure.md) | Institution | admin, facilities | |
| 22 | [View Institution Meals](docs/playbooks/view-institution-meals.md) | Institution | admin, nutritionist, parent | |
| 23 | [View Student Risk Profile](docs/playbooks/view-student-risks.md) | Student | admin, counsellor, teacher | |
| 24 | [View Institution Risk Summary](docs/playbooks/view-institution-risks.md) | Institution | admin, ministry | |
| 25 | [Add Equipment or Assets](docs/playbooks/add-institution-asset.md) ✏️ | Infrastructure | admin, accountant, facilities | |
| 26 | [Record an Infrastructure Repair](docs/playbooks/record-infrastructure-repair.md) ✏️ | Infrastructure | admin, accountant, facilities | |
| 27 | [Add a New Meal Programme](docs/playbooks/add-meal-programme.md) ✏️ | Meals | admin, accountant, nutritionist | |

---

## План разработки

### v0.4.0 — Аутентификация через браузер (запланировано)

Сегодня учетные данные требуют вручную выданный `api_key` от администратора OpenEMIS. v0.4.0 добавит опциональный инструмент `openemis_browser_auth`, который устранит всю ручную настройку учетных данных:

1.  Инструмент запускает локальный браузер Playwright — **целевой URL заранее не требуется**.
2.  Пользователь переходит к своему экземпляру OpenEMIS и входит в систему обычным образом.
3.  Playwright отслеживает весь сетевой трафик. Когда он видит ответ на **`POST */api/v5/login`** или **`POST */api/v4/login`** (оба возвращают идентичные JWT):
    -   **Базовый URL** автоматически извлекается из URL запроса (например, `https://dev-demo.openemis.org/core/api/v5/login` → базовый `https://dev-demo.openemis.org/core`) — нет необходимости предварительно настраивать `OPENEMIS_BASE_URL`.
    -   **JWT** извлекается из тела ответа.
4.  Оба кэшируются в памяти и используются для всех последующих CRUD-вызовов.

Это устраняет `OPENEMIS_BASE_URL`, `OPENEMIS_USERNAME`, `OPENEMIS_PASSWORD` и `OPENEMIS_API_KEY` как требования — пользователь просто открывает браузер и входит в систему. Работает с любым экземпляром OpenEMIS, любым доменом, любым поддоменом, включая dev, staging и production среды без какой-либо перенастройки.

**Учетные данные на основе `.env` остаются полностью поддерживаемыми** — существующие настройки не изменяются. Аутентификация через браузер является опциональной через новый инструмент.

### v0.5.0 — Дашборды рисков ✅

`view-student-risks` и `view-institution-risks` — выпущены. Оценки рисков, разбивка по критериям, случаи социального обеспечения, правила оповещений и журналы доставки.

### v0.6.0 — Маршруты Workflow *(Institution Pro + Country Pro)*

Текущие инструменты записи (`openemis_create`, `openemis_update`, `openemis_delete`) выполняют одну операцию за раз. Маршруты workflow идут дальше: MCP **автоматически оркестрирует полный многошаговый плейбук**, перенося состояние от шага к шагу и применяя предварительную валидацию на каждом этапе.

**Новый инструмент:** `openemis_run_workflow { playbook_id, params, dry_run? }` — принимает ID плейбука и структурированные входные параметры, выполняет все шаги последовательно, возвращает структурированный журнал выполнения. В режиме dry-run сообщает, что изменится, ничего не записывая.

Маршруты workflow ограничены уровнем выше Individual Pro, потому что массовые записи ИИ в масштабах учреждения или страны требуют контроля. Учителю, отмечающему 30 студентов, нужна скорость; районному управлению, зачисляющему 500 студентов в 20 школах, нужен аудит и утверждение.

| Функция | Individual Pro | Institution Pro | Country Pro |
|---|---|---|---|
| Прямая запись (одна запись) | ✅ | ✅ | ✅ |
| Журнал аудита учреждения | — | ✅ | ✅ |
| Выполнение маршрута workflow | — | ✅ | ✅ |
| Шлюз утверждения администратором учреждения | — | ✅ | ✅ |
| Пакетные операции в рамках одного учреждения | — | ✅ | ✅ |
| Многоучрежденческие пакетные операции | — | — | ✅ |
| Шлюзы утверждения министерством | — | — | ✅ |
| Панель мониторинга межучрежденческого контроля | — | — | ✅ |
| Откат при частичном сбое | — | — | ✅ |

---

## Планы

| | **Бесплатно** | **Individual Pro** | **Institution Pro** | **Country Pro** |
|---|---|---|---|---|
| **Область действия** | Любой пользователь | Один человек | Одна школа | Министерство / национальный уровень |
| **Лицензия** | MIT | BSL 1.1 | BSL 1.1 | BSL 1.1 |
| Инструменты чтения (все 645 ресурсов) | ✅ | ✅ | ✅ | ✅ |
| 24 курируемых плейбука + переводы | ✅ | ✅ | ✅ | ✅ |
| Прямая запись — одна запись | — | ✅ | ✅ | ✅ |
| Журнал аудита учреждения | — | — | ✅ | ✅ |
| Выполнение маршрута workflow | — | — | ✅ | ✅ |
| Шлюз утверждения администратором учреждения | — | — | ✅ | ✅ |
| Пакетные операции в рамках одного учреждения | — | — | ✅ | ✅ |
| Многоучрежденческие пакетные операции | — | — | — | ✅ |
| Шлюзы утверждения министерством | — | — | — | ✅ |
| Межучрежденческий контроль | — | — | — | ✅ |
| Откат при частичном сбое | — | — | — | ✅ |

→ **Цены и доступ:** khindol.madraimov@gmail.com

---

## Лицензия

[MIT](LICENSE.md) — © 2026 Khindol Madraimov

---

## Благодарности

Создано скоординированной командой ИИ-агентов под руководством человека — см. [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) для полного состава команды: Adviser Arastu, Marshal Sunny, Samurai Haiku, Xéphyrin Xirdal, Captain Nemo, Coddy (GPT-5), Miniqwenco (Qwen 2.5 Coder 7B), Miniqwen (Qwen 3.5 9B) и Gemmy (Gemma 4e4b) — каждый с определенной ролью в архитектуре, коде, анализе и многоязычном переводе.

---

*Не аффилирован с OpenEMIS или его сопровождающими. Это сторонний мост, использующий публичный Core API. Учетные данные и данные остаются на вашем компьютере.*