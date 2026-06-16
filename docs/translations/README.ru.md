---
title: openemis-mcp-pro — MCP-сервер чтения и записи для управления образованием OpenEMIS
description: openemis-mcp-pro — MCP-сервер чтения и записи, который подключает ИИ-ассистентов к школьной информационной системе OpenEMIS — 678 ресурсов, 3361 эндпоинтов, 40 плейбуков.
keywords:
  - OpenEMIS
  - школьная информационная система
  - управление образованием
  - посещаемость учеников
  - риски учеников
  - MCP сервер
---

<p align="center">
  <img src="assets/logo.png" alt="openemis-mcp-pro логотип — ИИ-мост чтения и записи для управления образованием OpenEMIS" width="320">
</p>

# openemis-mcp-pro — ИИ-мост чтения и записи для управления образованием OpenEMIS

**Естественно-языковой мост между агентами, поддерживающими MCP (Claude, Codex, Cursor и др.), и любым экземпляром OpenEMIS — с полным доступом на чтение и запись.**

OpenEMIS — бесплатная открытая школьная информационная система от ЮНЕСКО и KORDIT, используется в детских садах, школах, средних профессиональных и высших учебных заведениях.

Построен поверх опубликованного **API OpenEMIS Core** (справочная документация на [api.openemis.org/core](https://api.openemis.org/core)) и **полностью протестирован на публичном демо-сервере [demo.openemis.org/core](https://demo.openemis.org/core)** с реальными учетными данными, реальными данными и реальными циклами запросов.

Задайте вопрос на английском:

> *"Сколько учеников сейчас в начальной школе Эвори?"*

Агент планирует вызовы, этот MCP предоставляет данные, и вы получаете ответ:

> *"В начальной школе Эвори (код P1002) в настоящее время зачислено 553 ученика."*

Вам не нужно писать ни строчки кода. Вы не видите JSON. Вы просто спрашиваете.

> **Статус:** v1.0.0 — **полный CRUD** для ресурсов без workflow. Запросы на чтение работают для каждого ресурса OpenEMIS v5. Инструменты записи (создание/обновление/удаление) активны для всех ресурсов, которые не проходят через плагин CakePHP Workflow. Ресурсы, контролируемые workflow (посещаемость, отпуска сотрудников), блокируются на уровне инструмента и перенаправляют на соответствующий плейбук.

---

## Зачем это нужно

REST API OpenEMIS Core обширен — только поверхность v5 предоставляет **3 361 эндпоинтов для 678 ресурсов** (Core 5.13.0). Ни один ИИ-агент не может удержать это в контексте, а сырая интроспекция в стиле Swagger заполняет диалог шумом, не имеющим ничего общего с реальным вопросом пользователя.

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
| `openemis_list_playbooks` | v0.2 | Перечисляет все 40 курируемых плейбуков workflow с id, названием, доменом и аудиторией. Агент использует это, чтобы найти правильное пошаговое руководство для задачи на уровне пользователя. |
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
│  • openemis_list_play… │  ← перечисляет все 40 плейбуков workflow
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

-   [Справочник по ресурсам](docs/resources.md) — все 678 ресурсов с доступностью HTTP-методов и статусом записи (Core 5.13.0)
-   [Плейбуки](docs/playbooks/) — 40 курируемых руководств по workflow (26 чтение · 14 запись/auth)
-   [Руководство для учителя ChatGPT](docs/CHATGPT-TEACHER-GUIDE.md) — как позволить учителям отмечать посещаемость через ChatGPT Custom GPT
-   [Процесс создания плейбуков](docs/PLAYBOOK-ROUTINE.md) — 4-шаговый процесс добавления новых плейбуков
-   [Глоссарий](docs/GLOSSARY.ru.md) — определения ключевых терминов OpenEMIS и управления образованием
-   [FAQ](docs/FAQ.ru.md) — часто задаваемые вопросы об OpenEMIS и этом MCP-сервере

### Плейбуки

> **Новое в v1.1.0:** добавлено 9 новых плейбуков для OpenEMIS Core 5.10.0 — аккредитация / регистрация школ, бюджет учреждения, история отсутствий ученика, журнал аудита действий пользователя, состав класса, состояние очереди приёма / зачисления и общее объяснение системы workflow. Идентификаторы: `diagnose-alert-delivery`, `view-school-accreditation`, `view-school-registration`, `view-institution-budget`, `query-student-absence-history`, `query-user-activity-audit-log`, `view-class-roster`, `set-school-accreditation` ✏️, `set-school-registration` ✏️, `mark-student-meal-participation` ✏️, `view-admission-and-enrolment-queue-state`, `explain-workflow-system`. Доступны через `openemis_get_playbook` — пока только на английском; переводы и отдельные markdown-файлы выйдут позже.

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

## Тарифные планы

| | **Бесплатный** | **Individual Pro** | **Institution Pro** | **Country Pro** |
|---|---|---|---|---|
| **Область действия** | Любой пользователь | Один человек | Одна школа | Министерство / национальный уровень |
| **Лицензия** | MIT | BSL 1.1 | BSL 1.1 | BSL 1.1 |
| Инструменты чтения (все 678 ресурсов, Core 5.13.0) | ✅ | ✅ | ✅ | ✅ |
| 40 курируемых плейбуков (26 чтение · 14 запись/auth · 28 с переводами) | ✅ | ✅ | ✅ | ✅ |
| Режим stdio (Claude Code, Cursor, Cline) | ✅ | ✅ | ✅ | ✅ |
| **Режим HTTP-сервера** (Oracle / VPS) | — | ✅ | ✅ | ✅ |
| **Адаптер OpenAPI** (ChatGPT Custom GPT, любой REST-клиент) | — | ✅ | ✅ | ✅ |
| Прямая запись — одна запись | — | ✅ | ✅ | ✅ |
| Аудит действий по учреждению | — | — | ✅ | ✅ |
| Выполнение маршрута workflow | — | — | ✅ | ✅ |
| Шлюз утверждения администратором учреждения | — | — | ✅ | ✅ |
| Пакетные операции в одном учреждении | — | — | ✅ | ✅ |
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

Создано скоординированной командой AI-агентов под руководством человека — см. [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) для полного состава команды: Советник Arastu, Маршал Sunny, Самурай Haiku, Xéphyrin Xirdal, Капитан Немо, Coddy (GPT-5), Miniqwenco (Qwen 2.5 Coder 7B), Miniqwen (Qwen 3.5 9B) и Gemmy (Gemma 4e4b) — каждый с определённой ролью в архитектуре, коде, анализе и многоязычном переводе.

---

*Не аффилирован с OpenEMIS или его разработчиками. Это сторонний мост, который использует публичное Core API. Учётные данные и данные остаются на вашем компьютере.*
