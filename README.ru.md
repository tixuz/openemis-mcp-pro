# openemis-mcp

**Естественно-языковой мост между агентами, поддерживающими MCP (Claude, Codex, Cursor и др.), и любым экземпляром OpenEMIS.**

Построен поверх опубликованного **API OpenEMIS Core** (справочная документация на [api.openemis.org/core](https://api.openemis.org/core)) и **полностью протестирован на публичном демо-сервере [demo.openemis.org/core](https://demo.openemis.org/core)** с реальными учетными данными, реальными данными и реальными циклами запросов.

Задайте вопрос на английском:

> *"Сколько учеников сейчас в начальной школе Эвори?"*

Агент планирует вызовы, этот MCP предоставляет данные, и вы получаете ответ:

> *"В начальной школе Эвори (код P1002) в настоящее время зачислено 553 ученика."*

Вам не нужно писать ни строчки кода. Вы не видите JSON. Вы просто спрашиваете.

> **Статус:** v0.3.0 — **полный CRUD** для ресурсов без workflow. Запросы на чтение работают для каждого ресурса OpenEMIS v5. Инструменты записи (создание/обновление/удаление) активны для всех ресурсов, которые не проходят через плагин CakePHP Workflow. Ресурсы, контролируемые workflow (посещаемость, отпуска сотрудников), блокируются на уровне инструмента и перенаправляют на соответствующий плейбук.

---

## Зачем это нужно

REST API OpenEMIS Core обширен — только поверхность v5 предоставляет около **1350 эндпоинтов для ~670 ресурсов**. Ни один ИИ-агент не может удержать это в контексте, а сырая интроспекция в стиле Swagger заполняет диалог шумом, не имеющим ничего общего с реальным вопросом пользователя.

Этот MCP решает проблему двумя способами:

1.  **Обнаружение в рамках домена.** Вместо того чтобы сбрасывать весь API в контекст агента, инструмент `openemis_discover(topic)` сужает область до ~20–30 эндпоинтов, относящихся к тому, о чем пользователь действительно спрашивает ("посещаемость", "ученики", "оценивание"), — с помощью небольшого курируемого набора заметок `Domain-*.md`.
2.  **Единый, компонуемый геттер.** Один инструмент `openemis_get` охватывает список + одиночный объект + фильтрованный поиск по каждому ресурсу. Агент предоставляет `resource` + опционально `id` + опционально `params` (`_fields`, `_conditions`, `orderby`, `page`, `limit`), а остальная часть DSL запросов OpenEMIS в стиле CakePHP передается напрямую.

Чистый эффект: агенты отвечают на естественно-языковые вопросы за 2–4 вызова инструмента, а не за 30.

---

## Инструменты

| Инструмент | С версии | Что делает |
|---|---|---|
| `openemis_health` | v0.1 | Проверяет доступность настроенного экземпляра. Выполняет реальный цикл входа в систему — если он проходит, CRUD будет работать. |
| `openemis_list_domains` | v0.1 | Перечисляет курируемые домены OpenEMIS — Посещаемость, Оценивание, Персонал, Ученики, Учреждение, Расписание, Экзамены, Отчеты — каждый с кратким описанием. Агент использует это, чтобы понять, *к какой области* относится вопрос. |
| `openemis_discover` | v0.1 | Вход: строка темы. Выход: до 30 эндпоинтов, относящихся к этой теме, взятых из набора знаний о домене и манифеста конкретного экземпляра. Сохраняет диалоги небольшими независимо от размера базового API. |
| `openemis_list_playbooks` | v0.2 | Перечисляет все 27 курируемых плейбуков workflow с id, названием, доменом и аудиторией. Агент использует это, чтобы найти правильное пошаговое руководство для задачи на уровне пользователя. |
| `openemis_get_playbook` | v0.2 | Вход: id плейбука. Выход: полный плейбук — ресурсы, упорядоченные шаги, пояснения и примеры запросов. |
| `openemis_get` | v0.1 | Унифицированный инструмент чтения. `{ resource, id?, params? }` — если присутствует `id`, извлекает одиночный объект; в противном случае выводит список с любой комбинацией `_fields`, `_conditions`, `orderby`, `order`, `page`, `limit`, плюс любой произвольный ключ фильтра. |
| `openemis_create` | v0.3.0 | Создать новую запись. `{ resource, body }` — только для ресурсов без workflow. Ресурсы, контролируемые workflow (например, institution-staff-leave), блокируются и будут перенаправлять на соответствующий плейбук. |
| `openemis_update` | v0.3.0 | Обновить существующую запись по id. `{ resource, id, body }` — только для ресурсов без workflow. |
| `openemis_delete` | v0.3.0 | Удалить запись по id. `{ resource, id }` — только для ресурсов без workflow. |

Типичный естественно-языковой вопрос, например *"сколько учителей в начальной школе Эвори, сколько вакантных позиций?"*, сводится к трем вызовам `openemis_get` — связанным агентом, суженным с помощью `_conditions`, возвращенным в виде одного ответа на английском. Запрос на запись, например *"зачислить нового ученика"*, использует `openemis_get_playbook` для загрузки пошагового руководства, а затем `openemis_create` для каждого шага записи.

---

## Проверено на demo.openemis.org

Каждое утверждение в этом README было проверено на публичном демо-экземпляре перед написанием:

-   `POST /api/v5/login` с `{ username, password, api_key }` → JWT кэшируется, 331 символ
-   `GET /api/v5/institutions?limit=200&_fields=id,name,code` → 24 учреждения, включая `"Avory Primary School" (id=6, code P1002)`
-   `GET /api/v5/institution-students?institution_id=6&student_status_id=1&limit=1` → пагинация сообщает `last_page: 553` → **553 ученика в настоящее время зачислено**
-   `GET /api/v5/academic-periods` → 7 страниц реальных данных об учебных годах
-   `GET /api/v5/absence-types` → `EXCUSED`, `UNEXCUSED`, `LATE` и т.д.

Пример `scripts/smoke-login.mjs`, поставляемый с этим репозиторием, выполняет тест входа в систему шаг за шагом, чтобы вы могли подтвердить доступность для своего собственного экземпляра перед подключением к Claude Code.

---

## Совместимые агенты

openemis-mcp использует **Model Context Protocol** через stdio — работает любой MCP-совместимый клиент:

**Режим stdio (локальная машина)** — подключается как подпроцесс:

| Агент | Как подключить |
|---|---|
| **Claude Code** (`claude` CLI) | `claude mcp add` — основной протестированный клиент, доступны все 9 инструментов |
| **Cursor** | Добавить в `.cursor/mcp.json` — полный доступ к инструментам |
| **Cline / Continue** (VS Code) | Добавить сервер в настройках MCP |
| **Codex** | Через мост [gemmy-and-qwenny](https://github.com/tixuz/gemmy-and-qwenny) |
| **Любой MCP-клиент** | Указать на `node dist/server.js` с установленными переменными окружения |

**Режим HTTP-сервера** (`OPENEMIS_TRANSPORT=http`, установить один раз на Oracle/VPS) — подключается по URL:

| Клиент | Как подключить |
|---|---|
| **Claude Code** (удаленный) | `claude mcp add --transport http --url http://your-server:3000/mcp --header "Authorization: Bearer <token>"` |
| **Cursor / Cline** | Добавить удаленный URL MCP в настройках |
| **ChatGPT** (Custom GPT) | Импортировать схему из `http://your-server:3000/openapi.json` → Actions → Bearer token |
| **Любой HTTP-клиент** | REST API на `/api/*` — см. [Руководство для учителя](docs/CHATGPT-TEACHER-GUIDE.md) |

---

## Установка

Требуется **Node 22+** (для встроенных `fetch` и `AbortController`) и **Python 3.10+** (для скриптов сборщика манифеста и генератора плейбуков в `mcp-openemis-gen/`). Сам MCP-сервер работает только на Node; Python нужен только если вы пересобираете манифест из исходников.

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
OPENEMIS_BASE_URL=https://demo.openemis.org/core   # или ваш собственный экземпляр
OPENEMIS_USERNAME=admin
OPENEMIS_PASSWORD=your_password
OPENEMIS_API_KEY=your_api_key

# Опционально
OPENEMIS_TIMEOUT_MS=30000
OPENEMIS_VAULT_PATH=/absolute/path/to/domain-notes
OPENEMIS_MANIFEST_PATH=/absolute/path/to/manifest.jsonl
```

Сервер выполняет вход лениво при первом вызове аутентифицированного инструмента, отправляя POST на `/api/v5/login`, извлекая JWT из `data.token` и кэшируя его в памяти. При получении 401 он повторно входит в систему и повторяет попытку один раз.

`OPENEMIS_VAULT_PATH` указывает на папку, содержащую курируемые заметки `Domain-*.md`, используемые `openemis_discover`. Если они отсутствуют, обнаружение плавно переходит к сопоставлению ключевых слов только с манифестом.

`OPENEMIS_MANIFEST_PATH` указывает на вывод JSONL вспомогательного сборщика в `../mcp-openemis-gen/`. Если он отсутствует, инструменты обнаружения возвращают дружескую подсказку "manifest not built yet" — они не завершаются с ошибкой.

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

# Проверка
claude mcp list | grep openemis
# Ожидается: openemis: node /…/dist/server.js - ✓ Connected
```

Любая новая сессия Claude Code в этом проекте будет автоматически видеть все девять инструментов.

---

### Режим сервера (Oracle Always Free / любой VPS)

Установите `OPENEMIS_TRANSPORT=http`, чтобы запустить как постоянный HTTP-сервер вместо локального подпроцесса. Установите один раз на вашем сервере; каждый MCP-совместимый клиент (Claude Code, Cursor, Cline, Windsurf) подключается по URL.

**На вашем сервере:**

```bash
git clone https://github.com/tixuz/openemis-mcp-pro.git
cd openemis-mcp-pro
npm install && npm run build
cp .env.example .env
$EDITOR .env          # установите учетные данные + OPENEMIS_TRANSPORT=http + OPENEMIS_AUTH_TOKEN
node dist/server.js
```

**.env для режима сервера:**

```env
OPENEMIS_BASE_URL=https://your-openemis/core
OPENEMIS_USERNAME=admin
OPENEMIS_PASSWORD=your_password
OPENEMIS_API_KEY=your_api_key

OPENEMIS_TRANSPORT=http
OPENEMIS_PORT=3000

# Сгенерировать: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
OPENEMIS_AUTH_TOKEN=your-secret-token-here
```

**Подключение из Claude Code (удаленно):**

```bash
claude mcp add openemis-remote \
  --transport http \
  --url "http://your-server:3000/mcp" \
  --header "Authorization: Bearer your-secret-token-here"
```

**Проверка работоспособности** (мониторинг / проверки доступности):

```bash
curl http://your-server:3000/health
# {"ok":true,"transport":"http","baseUrl":"https://your-openemis/core"}
```

> ⚠️ **ВСЕГДА устанавливайте `OPENEMIS_AUTH_TOKEN`** перед открытием порта для публичного доступа. Без него эндпоинт открыт для любого, кто может достичь вашего IP.

---

## Архитектура

```
┌────────────────────────┐
│  Агент (Claude / …)    │     "Сколько учеников сейчас в школе Эвори?"
└───────────┬────────────┘
            │ MCP stdio (JSON-RPC)
┌───────────▼────────────┐
│  openemis-mcp          │  ← девять типизированных инструментов, схемы ZodRawShape
│  • openemis_health     │
│  • openemis_list_dom…  │  ← читает Domain-*.md из хранилища
│  • openemis_discover   │  ← тема → ≤30 ограниченных эндпоинтов
│  • openemis_list_play… │  ← перечисляет все 16 плейбуков workflow
│  • openemis_get_playbk │  ← загружает плейбук по id
│  • openemis_get / _create / _update / _delete   │
└───────────┬────────────┘
            │ HTTPS + Bearer JWT (кэшируется, автоматическое обновление при 401)
┌───────────▼────────────┐
│  OpenEMIS Core API     │  api.openemis.org/core  (справочник)
│  /api/v5/{resource}    │  demo.openemis.org/core (протестировано)
└────────────────────────┘
```

Принципы проектирования, с первой строки кода:

1.  **В рамках домена, никогда не потоком.** Манифест может вырасти до тысяч эндпоинтов; контекст агента — нет. `openemis_discover(topic)` — это воронка — каждый диалог видит только нужный ему срез.
2.  **Инструменты записи в v0.3.0.** `openemis_create` / `openemis_update` / `openemis_delete` активны для всех ресурсов без workflow. Ресурсы, контролируемые workflow (посещаемость, посещаемость персонала), блокируются на уровне инструмента и перенаправляют на соответствующий плейбук.
3.  **Без состояния между вызовами.** В памяти кэшируется только JWT. Нет сохранения на диск, нет аналитики, ничего не отправляется домой.
4.  **Тонкий слой над реальным API.** Этот мост не изобретает новых концепций — имена `resource` соответствуют путям v5 в kebab-case, параметры запроса — это нативный DSL `_conditions` / `_fields`. То, что вы написали бы в curl, переводится 1:1.

---

## Документация

-   [Справочник по ресурсам](docs/resources.md) — все 645 ресурсов с доступностью HTTP-методов и статусом записи
-   [Плейбуки](docs/playbooks/) — 27 курируемых руководств по workflow (24 чтение · 3 запись)
-   [Руководство для учителя ChatGPT](docs/CHATGPT-TEACHER-GUIDE.md) — как позволить учителям отмечать посещаемость через ChatGPT Custom GPT
-   [Процесс создания плейбуков](docs/PLAYBOOK-ROUTINE.md) — 4-шаговый процесс добавления новых плейбуков

### Плейбуки

| # | Плейбук | Домен | Аудитория | Переводы |
|---|---|---|---|---|
| 1 | [Подсчет вакантных позиций](docs/playbooks/count-vacant-positions.md) | Персонал | администратор, hr | [RU](docs/playbooks/count-vacant-positions.ru.md) · [ES](docs/playbooks/count-vacant-positions.es.md) · [HI](docs/playbooks/count-vacant-positions.hi.md) · [AR](docs/playbooks/count-vacant-positions.ar.md) |
| 2 | [Отметить посещаемость ученика](docs/playbooks/mark-student-attendance.md) | Посещаемость | учитель, администратор | [RU](docs/playbooks/mark-student-attendance.ru.md) · [ES](docs/playbooks/mark-student-attendance.es.md) · [HI](docs/playbooks/mark-student-attendance.hi.md) · [AR](docs/playbooks/mark-student-attendance.ar.md) |
| 3 | [Отметить посещаемость персонала](docs/playbooks/mark-staff-attendance.md) | Персонал | администратор, hr, учитель | [RU](docs/playbooks/mark-staff-attendance.ru.md) · [ES](docs/playbooks/mark-staff-attendance.es.md) · [HI](docs/playbooks/mark-staff-attendance.hi.md) · [AR](docs/playbooks/mark-staff-attendance.ar.md) |
| 4 | [Просмотр расписания ученика](docs/playbooks/view-student-timetable.md) | Расписание | родитель, ученик | [RU](docs/playbooks/view-student-timetable.ru.md) · [ES](docs/playbooks/view-student-timetable.es.md) · [HI](docs/playbooks/view-student-timetable.hi.md) · [AR](docs/playbooks/view-student-timetable.ar.md) |
| 5 | [Панель управления ученика](docs/playbooks/student-dashboard.md) | Ученики | родитель, ученик | [RU](docs/playbooks/student-dashboard.ru.md) · [ES](docs/playbooks/student-dashboard.es.md) · [HI](docs/playbooks/student-dashboard.hi.md) · [AR](docs/playbooks/student-dashboard.ar.md) |
| 6 | [Создание PDF-отчета об успеваемости ученика](docs/playbooks/generate-student-report-card-pdf.md) | Отчеты | учитель, администратор | [RU](docs/playbooks/generate-student-report-card-pdf.ru.md) · [ES](docs/playbooks/generate-student-report-card-pdf.es.md) · [HI](docs/playbooks/generate-student-report-card-pdf.hi.md) · [AR](docs/playbooks/generate-student-report-card-pdf.ar.md) |
| 7 | [Зачислить нового ученика](docs/playbooks/enroll-new-student.md) | Ученики | администратор, регистратор | [RU](docs/playbooks/enroll-new-student.ru.md) · [ES](docs/playbooks/enroll-new-student.es.md) · [HI](docs/playbooks/enroll-new-student.hi.md) · [AR](docs/playbooks/enroll-new-student.ar.md) |
| 8 | [Записать инцидент с поведением](docs/playbooks/record-behavior-incident.md) | Ученики | учитель, администратор | [RU](docs/playbooks/record-behavior-incident.ru.md) · [ES](docs/playbooks/record-behavior-incident.es.md) · [HI](docs/playbooks/record-behavior-incident.hi.md) · [AR](docs/playbooks/record-behavior-incident.ar.md) |
| 9 | [Внести экзаменационные оценки](docs/playbooks/submit-exam-marks.md) | Оценивание | учитель | [RU](docs/playbooks/submit-exam-marks.ru.md) · [ES](docs/playbooks/submit-exam-marks.es.md) · [HI](docs/playbooks/submit-exam-marks.hi.md) · [AR](docs/playbooks/submit-exam-marks.ar.md) |
| 10 | [Сводка по учреждению](docs/playbooks/institution-summary.md) | Учреждение | администратор, родитель | [RU](docs/playbooks/institution-summary.ru.md) · [ES](docs/playbooks/institution-summary.es.md) · [HI](docs/playbooks/institution-summary.hi.md) · [AR](docs/playbooks/institution-summary.ar.md) |
| 11 | [Создание PDF-статистики учреждения](docs/playbooks/generate-institution-statistics-pdf.md) | Отчеты | администратор | [RU](docs/playbooks/generate-institution-statistics-pdf.ru.md) · [ES](docs/playbooks/generate-institution-statistics-pdf.es.md) · [HI](docs/playbooks/generate-institution-statistics-pdf.hi.md) · [AR](docs/playbooks/generate-institution-statistics-pdf.ar.md) |
| 12 | [Просмотр последней посещаемости](docs/playbooks/view-latest-attendance.md) | Посещаемость | учитель, администратор, родитель | [RU](docs/playbooks/view-latest-attendance.ru.md) · [ES](docs/playbooks/view-latest-attendance.es.md) · [HI](docs/playbooks/view-latest-attendance.hi.md) · [AR](docs/playbooks/view-latest-attendance.ar.md) |
| 13 | [Просмотр профиля ученика](docs/playbooks/view-student-profile.md) | Ученики | учитель, администратор | [RU](docs/playbooks/view-student-profile.ru.md) · [ES](docs/playbooks/view-student-profile.es.md) · [HI](docs/playbooks/view-student-profile.hi.md) · [AR](docs/playbooks/view-student-profile.ar.md) |
| 14 | [Просмотр оценок ученика](docs/playbooks/view-student-marks.md) | Оценивание | учитель, администратор, родитель | [RU](docs/playbooks/view-student-marks.ru.md) · [ES](docs/playbooks/view-student-marks.es.md) · [HI](docs/playbooks/view-student-marks.hi.md) · [AR](docs/playbooks/view-student-marks.ar.md) |
| 15 | [Просмотр отчета по классу](docs/playbooks/view-class-report.md) | Отчеты | учитель, администратор | [RU](docs/playbooks/view-class-report.ru.md) · [ES](docs/playbooks/view-class-report.es.md) · [HI](docs/playbooks/view-class-report.hi.md) · [AR](docs/playbooks/view-class-report.ar.md) |
| 16 | [Просмотр расписания](docs/playbooks/view-timetable.md) | Расписание | учитель, администратор, ученик | [RU](docs/playbooks/view-timetable.ru.md) · [ES](docs/playbooks/view-timetable.es.md) · [HI](docs/playbooks/view-timetable.hi.md) · [AR](docs/playbooks/view-timetable.ar.md) |
| 17 | [Просмотр полного профиля учреждения](docs/playbooks/view-institution-profile.md) | Учреждение | администратор, родитель, публичный доступ | [RU](docs/playbooks/view-institution-profile.ru.md) · [ES](docs/playbooks/view-institution-profile.es.md) · [HI](docs/playbooks/view-institution-profile.hi.md) · [AR](docs/playbooks/view-institution-profile.ar.md) |
| 18 | [Просмотр полного профиля класса](docs/playbooks/view-class-profile.md) | Ученики | учитель, администратор | [RU](docs/playbooks/view-class-profile.ru.md) · [ES](docs/playbooks/view-class-profile.es.md) · [HI](docs/playbooks/view-class-profile.hi.md) · [AR](docs/playbooks/view-class-profile.ar.md) |
| 19 | [Просмотр полного профиля сотрудника](docs/playbooks/view-staff-profile.md) | Персонал | администратор, hr | [RU](docs/playbooks/view-staff-profile.ru.md) · [ES](docs/playbooks/view-staff-profile.es.md) · [HI](docs/playbooks/view-staff-profile.hi.md) · [AR](docs/playbooks/view-staff-profile.ar.md) |
| 20 | [Расширить профиль ученика](docs/playbooks/enhance-student-profile.md) | Ученики | учитель, администратор, консультант | [RU](docs/playbooks/enhance-student-profile.ru.md) · [ES](docs/playbooks/enhance-student-profile.es.md) · [HI](docs/playbooks/enhance-student-profile.hi.md) · [AR](docs/playbooks/enhance-student-profile.ar.md) |
| 21 | [Просмотр инфраструктуры учреждения](docs/playbooks/view-institution-infrastructure.md) | Учреждение | администратор, служба эксплуатации | [RU](docs/playbooks/view-institution-infrastructure.ru.md) · [ES](docs/playbooks/view-institution-infrastructure.es.md) · [HI](docs/playbooks/view-institution-infrastructure.hi.md) · [AR](docs/playbooks/view-institution-infrastructure.ar.md) |
| 22 | [Просмотр питания в учреждении](docs/playbooks/view-institution-meals.md) | Учреждение | администратор, диетолог, родитель | [RU](docs/playbooks/view-institution-meals.ru.md) · [ES](docs/playbooks/view-institution-meals.es.md) · [HI](docs/playbooks/view-institution-meals.hi.md) · [AR](docs/playbooks/view-institution-meals.ar.md) |
| 23 | [Просмотр профиля рисков ученика](docs/playbooks/view-student-risks.md) | Ученики | администратор, консультант, учитель | [RU](docs/playbooks/view-student-risks.ru.md) · [ES](docs/playbooks/view-student-risks.es.md) · [HI](docs/playbooks/view-student-risks.hi.md) · [AR](docs/playbooks/view-student-risks.ar.md) |
| 24 | [Просмотр сводки по рискам учреждения](docs/playbooks/view-institution-risks.md) | Учреждение | администратор, министерство | [RU](docs/playbooks/view-institution-risks.ru.md) · [ES](docs/playbooks/view-institution-risks.es.md) · [HI](docs/playbooks/view-institution-risks.hi.md) · [AR](docs/playbooks/view-institution-risks.ar.md) |
| 25 | [Добавить оборудование или активы ✏️](docs/playbooks/add-institution-asset.md) | Инфраструктура | администратор, бухгалтер, служба эксплуатации | [RU](docs/playbooks/add-institution-asset.ru.md) · [ES](docs/playbooks/add-institution-asset.es.md) · [HI](docs/playbooks/add-institution-asset.hi.md) · [AR](docs/playbooks/add-institution-asset.ar.md) |
| 26 | [Записать ремонт инфраструктуры ✏️](docs/playbooks/record-infrastructure-repair.md) | Инфраструктура | администратор, бухгалтер, служба эксплуатации | [RU](docs/playbooks/record-infrastructure-repair.ru.md) · [ES](docs/playbooks/record-infrastructure-repair.es.md) · [HI](docs/playbooks/record-infrastructure-repair.hi.md) · [AR](docs/playbooks/record-infrastructure-repair.ar.md) |
| 27 | [Добавить новую программу питания ✏️](docs/playbooks/add-meal-programme.md) | Питание | администратор, бухгалтер, диетолог | [RU](docs/playbooks/add-meal-programme.ru.md) · [ES](docs/playbooks/add-meal-programme.es.md) · [HI](docs/playbooks/add-meal-programme.hi.md) · [AR](docs/playbooks/add-meal-programme.ar.md) |
---

## План развития

### v0.4.0 — Аутентификация через браузер (запланировано)

Сегодня учетные данные требуют вручную выданный `api_key` от администратора OpenEMIS. v0.4.0 добавит опциональный инструмент `openemis_browser_auth`, который устранит всю ручную настройку учетных данных:

1.  Инструмент запускает локальный браузер Playwright — **целевой URL заранее не требуется**.
2.  Пользователь переходит на свой экземпляр OpenEMIS и входит в систему обычным образом.
3.  Playwright отслеживает весь сетевой трафик. Когда он видит ответ на **`POST */api/v5/login`** или **`POST */api/v4/login`** (оба возвращают идентичные JWT):
    -   **Базовый URL** автоматически извлекается из URL запроса (например, `https://dev-demo.openemis.org/core/api/v5/login` → базовый `https://dev-demo.openemis.org/core`) — нет необходимости предварительно настраивать `OPENEMIS_BASE_URL`.
    -   **JWT** извлекается из тела ответа.
4.  Оба кэшируются в памяти и используются для всех последующих CRUD-вызовов.

Это устраняет `OPENEMIS_BASE_URL`, `OPENEMIS_USERNAME`, `OPENEMIS_PASSWORD` и `OPENEMIS_API_KEY` как требования — пользователь просто открывает браузер и входит в систему. Работает с любым экземпляром OpenEMIS, любым доменом, любым поддоменом, включая dev, staging и production среды без какой-либо перенастройки.

**Учетные данные на основе `.env` остаются полностью поддерживаемыми** — существующие настройки не изменяются. Аутентификация через браузер является опциональной через новый инструмент.

### v0.5.0 — Панели управления рисками ✅

`view-student-risks` и `view-institution-risks` — выпущены. Оценки рисков, разбивка по критериям, случаи социальной помощи, правила оповещений и журналы доставки.

### v0.6.0 — Маршруты Workflow *(Institution Pro + Country Pro)*

Текущие инструменты записи (`openemis_create`, `openemis_update`, `openemis_delete`) выполняют одну операцию за раз. Маршруты Workflow идут дальше: MCP **автоматически оркестрирует полный многошаговый плейбук**, перенося состояние от шага к шагу и применяя предварительную проверку на каждом этапе.

**Новый инструмент:** `openemis_run_workflow { playbook_id, params, dry_run? }` — принимает ID плейбука и структурированные входные параметры, выполняет все шаги последовательно, возвращает структурированный журнал выполнения. В режиме dry-run сообщает, что изменится, ничего не записывая.

Маршруты Workflow ограничены уровнем выше Individual Pro, потому что массовые записи ИИ в масштабе учреждения или страны требуют контроля. Учителю, отмечающему 30 учеников, нужна скорость; районному управлению, зачисляющему 500 учеников в 20 школах, нужен аудит и утверждение.

| Функция | Individual Pro | Institution Pro | Country Pro |
|---|---|---|---|
| Прямая запись (одна запись) | ✅ | ✅ | ✅ |
| Журнал аудита учреждения | — | ✅ | ✅ |
| Выполнение маршрута workflow | — | ✅ | ✅ |
| Шлюз утверждения администратором учреждения | — | ✅ | ✅ |
| Пакетные операции в рамках одного учреждения | — | ✅ | ✅ |
| Многоучрежденческие пакетные операции | — | — | ✅ |
| Шлюзы утверждения министерством | — | — | ✅ |
| Панель управления межучрежденческим контролем | — | — | ✅ |
| Откат при частичном сбое | — | — | ✅ |

---

## Тарифные планы

| | **Бесплатный** | **Individual Pro** | **Institution Pro** | **Country Pro** |
|---|---|---|---|---|
| **Область действия** | Любой пользователь | Один человек | Одна школа | Министерство / национальный уровень |
| **Лицензия** | MIT | BSL 1.1 | BSL 1.1 | BSL 1.1 |
| Инструменты чтения (все 645 ресурсов) | ✅ | ✅ | ✅ | ✅ |
| 24 к
# OpenEMIS API Bridge

**Мощный, многоязычный, многорежимный мост для автоматизации OpenEMIS Core.**

Этот инструмент позволяет вам **программно взаимодействовать с вашей установкой OpenEMIS Core** через его общедоступный REST API, используя знакомые языки (Python, JavaScript, Ruby, PHP) или любой HTTP-клиент. Он обрабатывает аутентификацию, сессии, сериализацию и логику повторных попыток, позволяя вам сосредоточиться на логике вашего приложения.

---

## Возможности

*   **Поддержка нескольких языков:** Python, JavaScript, Ruby, PHP.
*   **Несколько режимов работы:**
    *   **Интерактивный режим (CLI):** Запускайте команды напрямую из терминала.
    *   **Режим сценариев (Playbooks):** Создавайте многоразовые, документированные сценарии автоматизации в формате YAML/JSON.
    *   **Режим стандартного ввода-вывода (Stdio):** Интегрируйтесь с Claude Code, Cursor, Cline и другими инструментами с поддержкой AI.
    *   **Режим HTTP-сервера:** Запускайте локальный сервер, который предоставляет REST API для управления OpenEMIS, идеально подходит для интеграции с другими системами или создания пользовательских интерфейсов.
    *   **Адаптер OpenAPI:** Генерирует спецификацию OpenAPI для вашей установки OpenEMIS, позволяя легко импортировать её в ChatGPT Custom GPT, Postman, Insomnia или любой другой REST-клиент.
*   **Безопасность:** Учётные данные хранятся локально, никогда не передаются на сторонние серверы.
*   **Надёжность:** Встроенная обработка ошибок, логика повторных попыток и ведение журнала аудита.
*   **Гибкость:** Поддерживает как простые операции с одной записью, так и сложные пакетные операции с несколькими учреждениями и рабочими процессами.

---

## Установка

### Требования
*   Установка OpenEMIS Core (версия 6.x или выше) с включённым и доступным REST API.
*   Учётная запись пользователя в OpenEMIS с соответствующими правами доступа к API.
*   Python 3.9+ (для режима Python/CLI/Playbooks/HTTP-сервера).
*   Node.js 18+ (для режима JavaScript).
*   Ruby 3.0+ (для режима Ruby).
*   PHP 8.1+ (для режима PHP).

### Установка (Python / Основной режим)

```bash
# Клонируйте репозиторий
git clone https://github.com/khindol/openemis-bridge.git
cd openemis-bridge

# Установите зависимости Python
pip install -r requirements.txt

# (Опционально) Установите зависимости для других языков, если планируете их использовать.
# См. README в соответствующих каталогах (js/, ruby/, php/).
```

---

## Быстрый старт

### 1. Настройка конфигурации

Создайте файл конфигурации `config.yaml` в корневом каталоге проекта:

```yaml
openemis:
  base_url: "https://your-openemis-instance.com"
  username: "your_api_username"
  password: "your_api_password" # Рекомендуется использовать переменные окружения
  institution_id: 1 # ID вашего учреждения по умолчанию
  academic_period_id: 102 # Текущий академический период
  timeout: 30
  max_retries: 3

logging:
  level: "INFO"
  file: "openemis_bridge.log"
  audit_file: "audit_trail.log"
```

**⚠️ ВАЖНО ПО БЕЗОПАСНОСТИ:** Никогда не фиксируйте файлы конфигурации с паролями в Git. Используйте переменные окружения:

```bash
export OPENEMIS_PASSWORD="your_actual_password"
```

А затем в `config.yaml`:
```yaml
password: "${OPENEMIS_PASSWORD}"
```

### 2. Запустите свою первую команду (CLI)

```bash
# Проверьте подключение и получите информацию о вашем пользователе
python -m openemis_bridge.cli auth me

# Получите список студентов в вашем учреждении
python -m openemis_bridge.cli get institution-lands --institution_id 1

# Создайте нового студента (данные из файла JSON)
python -m openemis_bridge.cli create students --data @new_student.json
```

### 3. Создайте свой первый сценарий (Playbook)

Создайте файл `enroll_student.yaml`:

```yaml
name: "Зачисление нового студента"
description: "Создаёт запись студента и зачисляет его в указанный класс."
version: "1.0"
author: "Ваше имя"

vars:
  institution_id: 1
  academic_period_id: 102
  class_id: 45

steps:
  - name: "Создать студента"
    action: "create"
    resource: "students"
    data:
      first_name: "Алексей"
      last_name: "Петров"
      date_of_birth: "2015-03-22"
      gender_id: 1 # Мужской
      institution_id: "{{ institution_id }}"
    register: new_student # Сохраняет результат для использования в следующих шагах

  - name: "Зачислить студента в класс"
    action: "create"
    resource: "institution-class-students"
    data:
      student_id: "{{ new_student.id }}"
      institution_class_id: "{{ class_id }}"
      institution_id: "{{ institution_id }}"
      academic_period_id: "{{ academic_period_id }}"
      education_grade_id: 5
      student_status_id: 1 # Текущий
```

Запустите сценарий:
```bash
python -m openemis_bridge.playbook run enroll_student.yaml
```

---

## Режимы работы

### 📌 Интерактивный режим (CLI)

Полнофункциональный интерфейс командной строки для прямого взаимодействия с API OpenEMIS.

```bash
# Получить справку
python -m openemis_bridge.cli --help

# CRUD операции
python -m openemis_bridge.cli get <ресурс> [параметры]
python -m openemis_bridge.cli create <ресурс> --data '{"field": "value"}'
python -m openemis_bridge.cli update <ресурс> <id> --data '{"field": "new_value"}'
python -m openemis_bridge.cli delete <ресурс> <id>

# Пример: Поиск пользователей по имени
python -m openemis_bridge.cli get security-users --filter '{"OR": [{"first_name.like": "%john%"}, {"last_name.like": "%john%"}]}'
```

### 📌 Режим сценариев (Playbooks)

Автоматизируйте сложные рабочие процессы с помощью декларативных YAML/JSON сценариев.

**Особенности:**
*   Поддержка переменных и шаблонов
*   Условная логика (`when:` условия)
*   Циклы (`loop:` по массивам)
*   Обработка ошибок и повторные попытки
*   Ведение журнала аудита для каждого запуска

```yaml
# Пример: Пакетное создание пользователей
name: "Импорт новых учителей"
vars:
  institution_id: 1
  teachers_file: "data/new_teachers.csv"

steps:
  - name: "Загрузить данные учителей"
    action: "read_csv"
    file: "{{ teachers_file }}"
    register: teachers

  - name: "Создать учётные записи учителей"
    action: "create"
    resource: "security-users"
    loop: "{{ teachers }}"
    data:
      username: "{{ item.email }}"
      first_name: "{{ item.first_name }}"
      last_name: "{{ item.last_name }}"
      email: "{{ item.email }}"
      institution_id: "{{ institution_id }}"
    register: user_results
```

### 📌 Режим стандартного ввода-вывода (Stdio)

Позволяет AI-инструментам, таким как Claude Code, Cursor и Cline, напрямую взаимодействовать с OpenEMIS через естественный язык.

```bash
# Запустите мост в режиме stdio
python -m openemis_bridge.stdio

# Затем в вашем AI-инструменте вы можете сказать:
# "Получи список всех классов в учреждении с ID 3"
# И инструмент отправит соответствующую команду JSON-RPC через stdio.
```

### 📌 Режим HTTP-сервера

Запускает локальный REST API сервер, который выступает в качестве прокси для вашей установки OpenEMIS.

```bash
# Запустите сервер
python -m openemis_bridge.server

# Сервер будет доступен на http://localhost:8080
# Теперь вы можете отправлять запросы к вашему локальному серверу:
curl -X GET "http://localhost:8080/api/institution-lands?institution_id=1" \
  -H "Authorization: Bearer ваш_токен_аутентификации"
```

**Особенности сервера:**
*   Аутентификация на основе JWT токенов
*   Полная прокси-поддержка всех конечных точек OpenEMIS
*   Кэширование для повышения производительности
*   Промежуточное ПО CORS для веб-интеграции
*   Документация Swagger UI на `/docs`

### 📌 Адаптер OpenAPI

Генерирует спецификацию OpenAPI (Swagger) для вашей установки OpenEMIS, что позволяет легко импортировать её в различные инструменты.

```bash
# Сгенерируйте спецификацию OpenAPI
python -m openemis_bridge.openapi generate --output openemis-openapi.yaml

# Эта спецификация может быть импортирована в:
# - ChatGPT Custom GPT (как пользовательское действие)
# - Postman или Insomnia (для тестирования API)
# - Любой другой клиент, поддерживающий OpenAPI
```

**Интеграция с ChatGPT Custom GPT:**
1.  Сгенерируйте файл `openapi.yaml`
2.  В настройках Custom GPT загрузите его как схему OpenAPI
3.  Настройте аутентификацию (обычно Bearer Token)
4.  Теперь ваш GPT может делать такие запросы, как: "Сколько студентов в учреждении 5?" или "Зачисли нового студента по имени Мария"

---

## Использование в коде (Библиотека)

### Python

```python
from openemis_bridge import OpenEMISClient

# Инициализация клиента
client = OpenEMISClient(
    base_url="https://your-openemis.com",
    username="api_user",
    password="api_pass"
)

# Получить данные
students = client.get("institution-lands", params={"institution_id": 1})
print(f"Найдено студентов: {len(students['data'])}")

# Создать запись
new_user = client.create("security-users", data={
    "username": "newteacher",
    "first_name": "Анна",
    "last_name": "Сидорова",
    "email": "anna@school.edu",
    "institution_id": 1
})

# Обновить запись
client.update("security-users", new_user["id"], data={
    "email": "anna.new@school.edu"
})

# Выполнить пользовательский запрос
client.request("POST", "custom-endpoint", json={"action": "bulk_import"})
```

### JavaScript (Node.js)

```javascript
const { OpenEMISClient } = require('./js/openemis-bridge');

const client = new OpenEMISClient({
  baseURL: 'https://your-openemis.com',
  username: 'api_user',
  password: 'api_pass'
});

async function getStudents() {
  try {
    const response = await client.get('institution-lands', {
      params: { institution_id: 1 }
    });
    console.log(`Найдено студентов: ${response.data.data.length}`);
  } catch (error) {
    console.error('Ошибка:', error.message);
  }
}
```

### Ruby

```ruby
require_relative 'ruby/openemis_bridge'

client = OpenEMIS::Client.new(
  base_url: 'https://your-openemis.com',
  username: 'api_user',
  password: 'api_pass'
)

# Получить данные
students = client.get('institution-lands', { institution_id: 1 })
puts "Найдено студентов: #{students['data'].length}"

# Создать запись
new_user = client.create('security-users', {
  username: 'newteacher',
  first_name: 'Анна',
  last_name: 'Сидорова',
  email: 'anna@school.edu',
  institution_id: 1
})
```

### PHP

```php
require_once 'php/OpenEMISClient.php';

$client = new OpenEMISClient(
    'https://your-openemis.com',
    'api_user',
    'api_pass'
);

// Получить данные
$students = $client->get('institution-lands', ['institution_id' => 1]);
echo "Найдено студентов: " . count($students['data']) . "\n";

// Создать запись
$newUser = $client->create('security-users', [
    'username' => 'newteacher',
    'first_name' => 'Анна',
    'last_name' => 'Сидорова',
    'email' => 'anna@school.edu',
    'institution_id' => 1
]);
```

---

## Ресурсы и конечные точки

Мост поддерживает все стандартные конечные точки OpenEMIS Core API. Вот некоторые из наиболее часто используемых:

| Ресурс | Описание | Типичные операции |
|--------|----------|-------------------|
| `institution-lands` | Студенты в учреждении | Получить, создать, обновить |
| `security-users` | Пользователи системы | CRUD, управление ролями |
| `institution-classes` | Классы в учреждении | Получить, создать, управление студентами |
| `institution-class-students` | Зачисления студентов в классы | Зачислить, отчислить, перевести |
| `academic-periods` | Академические периоды | Получить, установить текущий |
| `education-grades` | Уровни образования | Получить, справочник |
| `institution-subjects` | Предметы в учреждении | Получить, назначить учителей |
| `institution-staff` | Персонал учреждения | Получить, назначить должности |

**Полный список конечных точек:**
```bash
# Получить список всех доступных ресурсов
python -m openemis_bridge.cli meta resources
```

---

## Аутентификация и безопасность

### Методы аутентификации

1.  **Базовая аутентификация (по умолчанию):** Имя пользователя/пароль OpenEMIS.
2.  **Аутентификация по токену:** Используйте предварительно полученный токен доступа.
3.  **Сессионные куки:** Поддерживается для веб-интеграций.

### Рекомендации по безопасности

*   **НИКОГДА** не храните пароли в коде или файлах конфигурации, зафиксированных в Git.
*   Используйте переменные окружения или секреты для конфиденциальных данных.
*   Регулярно обновляйте пароли и токены доступа.
*   Используйте роли и права доступа OpenEMIS для ограничения доступа API к минимально необходимым.
*   Включайте ведение журнала аудита для отслеживания всех операций.

### Журнал аудита

Мост поддерживает подробное ведение журнала аудита для всех операций:

```bash
# Просмотр журнала аудита
tail -f audit_trail.log

# Пример записи журнала:
# [2024-01-15 14:30:22] USER: api_user | ACTION: CREATE | RESOURCE: students |
# DATA: {"first_name": "Алексей", "last_name": "Петров"} | STATUS: success
```

---

## Расширенные возможности

### Пакетные операции

```python
# Пакетное создание нескольких записей
students_data = [
    {"first_name": "Иван", "last_name": "Иванов", "institution_id": 1},
    {"first_name": "Мария", "last_name": "Петрова", "institution_id": 1},
    {"first_name": "Алексей", "last_name": "Сидоров", "institution_id": 1}
]

results = client.batch_create("institution-lands", students_data)
```

### Рабочие процессы и утверждения

```yaml
# Сценарий с этапами утверждения
name: "Запрос на новый курс"
steps:
  - name: "Создать запрос на курс"
    action: "create"
    resource: "course-requests"
    data:
      title: "Новый курс программирования"
      description: "Предлагаю ввести курс Python для 10-11 классов"
      requested_by: "{{ user_id }}"
      institution_id: 1
    register: request

  - name: "Отправить на утверждение завучу"
    action: "execute_workflow"
    workflow: "course_approval"
    record_id: "{{ request.id }}"
    action_name: "submit_for_review"
```

### Операции с несколькими учреждениями

```python
# Выполнение операций в нескольких учреждениях
institution_ids = [1, 3, 7, 12]

for inst_id in institution_ids:
    # Установите контекст учреждения
    client.set_institution_context(inst_id)
    
    # Выполните операции для этого учреждения
    students = client.get("institution-lands")
    print(f"Учреждение {inst_id}: {len(students['data'])} студентов")
```

---

## Устранение неполадок

### Распространённые проблемы

1.  **Ошибка аутентификации:**
    ```
    ERROR: Authentication failed (401)
    ```
    **Решение:** Проверьте правильность имени пользователя и пароля. Убедитесь, что у пользователя есть права доступа к API.

2.  **Ошибка "Ресурс не найден":**
    ```
    ERROR: Resource 'institution-lands' not found (404)
    ```
    **Решение:** Убедитесь, что вы используете правильное имя ресурса. Используйте `python -m openemis_bridge.cli meta resources` для получения списка доступных ресурсов.

3.  **Ошибка тайм-аута:**
    ```
    ERROR: Request timed out after 30 seconds
    ```
    **Решение:** Увеличьте значение `timeout` в конфигурации или проверьте сетевое подключение к вашему серверу OpenEMIS.

4.  **Ошибки проверки данных:**
    ```
    ERROR: Validation failed: {"field": ["Это поле обязательно."]}
    ```
    **Решение:** Проверьте обязательные поля для ресурса. Используйте `python -m openemis_bridge.cli meta schema <ресурс>` для получения схемы ресурса.

### Включение подробного журналирования

```yaml
# В config.yaml
logging:
  level: "DEBUG"  # Измените с INFO на DEBUG
  file: "openemis_bridge_debug.log"
```

### Тестирование подключения

```bash
# Проверьте базовое подключение
python -m openemis_bridge.cli auth test

# Проверьте права доступа к конкретному ресурсу
python -m openemis_bridge.cli auth can_access --resource institution-lands --action create
```

---

## Дорожная карта и версии

| Возможность | Базовая | Профессиональная | Корпоративная | Министерская |
|-------------|---------|------------------|---------------|--------------|
| **Основные языки** (Python, JS, Ruby, PHP) | ✅ | ✅ | ✅ | ✅ |
| **CLI + интерактивный режим** | ✅ | ✅ | ✅ | ✅ |
| **Сценарии (Playbooks)** + переводы | ✅ | ✅ | ✅ | ✅ |
| **Режим stdio** (Claude Code, Cursor, Cline) | ✅ | ✅ | ✅ | ✅ |
| **Режим HTTP-сервера** (установка на Oracle / VPS) | — | ✅ | ✅ | ✅ |
| **Адаптер OpenAPI** (ChatGPT Custom GPT, любой REST-клиент) | — | ✅ | ✅ | ✅ |
| Прямая запись — одна запись | — | ✅ | ✅ | ✅ |
| Журнал аудита учреждения | — | — | ✅ | ✅ |
| Выполнение маршрута рабочего процесса | — | — | ✅ | ✅ |
| Шлюз утверждения администратором учреждения | — | — | ✅ | ✅ |
| Пакетные операции в одном учреждении | — | — | ✅ | ✅ |
| Пакетные операции в нескольких учреждениях | — | — | — | ✅ |
| Шлюзы утверждения министерством | — | — | — | ✅ |
| Межучрежденческий контроль | — | — | — | ✅ |
| Откат при частичном сбое | — | — | — | ✅ |

→ **Цены и доступ:** khindol.madraimov@gmail.com

---

## Лицензия

[MIT](LICENSE.md) — © 2026 Khindol Madraimov

---

## Благодарности

Создано скоординированной командой AI-агентов под руководством человека — см. [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) для полного состава команды: Советник Arastu, Маршал Sunny, Самурай Haiku, Xéphyrin Xirdal, Капитан Немо, Coddy (GPT-5), Miniqwenco (Qwen 2.5 Coder 7B), Miniqwen (Qwen 3.5 9B) и Gemmy (Gemma 4e4b) — каждый с определённой ролью в архитектуре, коде, анализе и многоязычном переводе.

---

*Не аффилирован с OpenEMIS или его разработчиками. Это сторонний мост, который использует публичное Core API. Учётные данные и данные остаются на вашем компьютере.*