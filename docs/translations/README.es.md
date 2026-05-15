---
title: openemis-mcp-pro — Servidor MCP de lectura y escritura para el sistema de gestión escolar OpenEMIS
description: openemis-mcp-pro es el servidor MCP de lectura y escritura que conecta asistentes de IA al sistema de gestión escolar OpenEMIS — 675 recursos, 3355 endpoints, 40 playbooks.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
  - asistencia de estudiantes
  - riesgos de estudiantes
  - servidor MCP
---

<p align="center">
  <img src="assets/logo.png" alt="openemis-mcp-pro logo — puente de IA de lectura y escritura para el sistema de gestión escolar OpenEMIS" width="320">
</p>

# openemis-mcp-pro — Puente de IA de lectura y escritura para el sistema de gestión escolar OpenEMIS

**Un puente de lenguaje natural entre agentes compatibles con MCP (Claude, Codex, Cursor, etc.) y cualquier instancia de OpenEMIS — con acceso completo de lectura y escritura.**

OpenEMIS es un sistema de gestión escolar gratuito y de código abierto desarrollado por UNESCO y KORDIT, utilizado desde jardines de infancia hasta universidades y centros de formación profesional.

Construido sobre la **API de OpenEMIS Core publicada** (documentación de referencia en [api.openemis.org/core](https://api.openemis.org/core)) y **verificado de extremo a extremo contra la demo pública en [demo.openemis.org/core](https://demo.openemis.org/core)** con credenciales reales, datos reales y viajes de ida y vuelta reales.

Pregunte en inglés:

> *"¿Cuántos estudiantes actuales hay en Avory Primary?"*

El agente planifica las llamadas, este MCP entrega los datos y usted obtiene la respuesta:

> *"La Escuela Primaria Avory (código P1002) tiene 553 estudiantes matriculados actualmente."*

Usted nunca escribe una línea de código. Usted nunca ve JSON. Usted solo pregunta.

> **Estado:** v1.0.0 — **CRUD completo** para recursos sin flujo de trabajo. Las consultas de lectura funcionan para cada recurso de OpenEMIS v5. Las herramientas de escritura (crear/actualizar/eliminar) están activas para todos los recursos que no pasan por el plugin CakePHP Workflow. Los recursos controlados por flujo de trabajo (asistencia, licencia del personal) están bloqueados a nivel de herramienta y redirigen al playbook apropiado.

---

## Por qué existe esto

La API REST de OpenEMIS Core es grande — solo la superficie de v5 expone **3 355 endpoints en 675 recursos** (Core 5.10.0). Ningún agente de IA puede mantener eso en contexto, y la introspección cruda al estilo Swagger inunda una conversación con ruido que no tiene nada que ver con la pregunta real del usuario.

Este MCP resuelve eso de dos maneras:

1.  **Descubrimiento con alcance de dominio.** En lugar de volcar toda la API en el contexto del agente, la herramienta `openemis_discover(topic)` se limita a los ~20–30 endpoints relevantes sobre lo que el usuario realmente está preguntando ("asistencia", "estudiantes", "evaluación") — impulsado por un pequeño paquete de conocimiento curado de notas `Domain-*.md`.
2.  **Un único getter componible.** Una herramienta `openemis_get` cubre lista + singleton + búsqueda filtrada en todos los recursos. El agente proporciona `resource` + opcional `id` + opcional `params` (`_fields`, `_conditions`, `orderby`, `page`, `limit`) y el resto del DSL de consulta estilo CakePHP de OpenEMIS se mapea directamente.

El efecto neto: los agentes responden preguntas en lenguaje natural en 2–4 llamadas a herramientas, no en 30.

---

## Herramientas

| Herramienta | Desde | Qué hace |
|---|---|---|
| `openemis_health` | v0.1 | Hace ping a la instancia configurada e informa la accesibilidad. Realiza un viaje de ida y vuelta de inicio de sesión real — si esto pasa, CRUD funcionará. |
| `openemis_list_domains` | v0.1 | Enumera los dominios curados de OpenEMIS — Asistencia, Evaluación, Personal, Estudiante, Institución, Horario, Examen, Reporte — cada uno con un resumen de una línea. El agente usa esto para averiguar *dónde* vive una pregunta. |
| `openemis_discover` | v0.1 | Entrada: una cadena de tema. Salida: hasta 30 endpoints relevantes para ese tema, extraídos del paquete de conocimiento del dominio y del manifiesto por instancia. Mantiene las conversaciones pequeñas sin importar cuán grande sea la API subyacente. |
| `openemis_list_playbooks` | v0.2 | Enumera los 40 playbooks de flujo de trabajo curados con id, título, dominio y audiencia. El agente usa esto para encontrar la guía paso a paso correcta para una tarea a nivel de usuario. |
| `openemis_get_playbook` | v0.2 | Entrada: un id de playbook. Salida: el playbook completo — recursos, pasos ordenados, notas de orientación y consultas de ejemplo. |
| `openemis_get` | v0.1 | Herramienta de lectura unificada. `{ resource, id?, params? }` — si `id` está presente, obtiene el singleton; de lo contrario, enumera con cualquier combinación de `_fields`, `_conditions`, `orderby`, `order`, `page`, `limit`, más cualquier clave de filtro ad-hoc. |
| `openemis_create` | v0.3.0 | Crea un nuevo registro. `{ resource, body }` — solo recursos sin flujo de trabajo. Los recursos controlados por flujo de trabajo (ej. institution-staff-leave) están bloqueados y redirigirán al playbook apropiado. |
| `openemis_update` | v0.3.0 | Actualiza un registro existente por id. `{ resource, id, body }` — solo recursos sin flujo de trabajo. |
| `openemis_delete` | v0.3.0 | Elimina un registro por id. `{ resource, id }` — solo recursos sin flujo de trabajo. |

Una pregunta representativa en lenguaje natural como *"¿cuántos maestros en Avory Primary, cuántos puestos vacantes?"* se resuelve en tres llamadas `openemis_get` — encadenadas por el agente, reducidas por `_conditions`, entregadas como una única respuesta en inglés. Una solicitud de escritura como *"matricular a un nuevo estudiante"* usa `openemis_get_playbook` para cargar la guía paso a paso, luego `openemis_create` para cada paso de escritura.

---

## Verificado contra demo.openemis.org

Cada afirmación en este README se probó contra la instancia de demostración pública antes de escribirse:

-   `POST /api/v5/login` con `{ username, password, api_key }` → JWT almacenado en caché, 331 caracteres
-   `GET /api/v5/institutions?limit=200&_fields=id,name,code` → 24 instituciones incl. `"Avory Primary School" (id=6, code P1002)`
-   `GET /api/v5/institution-students?institution_id=6&student_status_id=1&limit=1` → la paginación reporta `last_page: 553` → **553 estudiantes matriculados actualmente**
-   `GET /api/v5/academic-periods` → 7 páginas de datos reales de año académico
-   `GET /api/v5/absence-types` → `EXCUSED`, `UNEXCUSED`, `LATE`, etc.

El ejemplo `scripts/smoke-login.mjs` incluido en este repositorio realiza la prueba de inicio de sesión paso a paso para que pueda confirmar la accesibilidad contra su propia instancia antes de conectarla a Claude Code.

---

## Agentes compatibles

openemis-mcp habla el **Model Context Protocol** sobre stdio — cualquier cliente compatible con MCP funciona:

**Modo stdio (máquina local)** — se conecta como un subproceso:

| Agente | Cómo conectarse |
|---|---|
| **Claude Code** (`claude` CLI) | `claude mcp add` — cliente principal probado, las 9 herramientas disponibles |
| **Cursor** | Agregar a `.cursor/mcp.json` — acceso completo a herramientas |
| **Cline / Continue** (VS Code) | Agregar servidor en la configuración de MCP |
| **Codex** | A través del puente [gemmy-and-qwenny](https://github.com/tixuz/gemmy-and-qwenny) |
| **Cualquier cliente MCP** | Apuntar a `node dist/server.js` con las variables de entorno configuradas |

**Modo servidor HTTP** (`OPENEMIS_TRANSPORT=http`, instalar una vez en Oracle/VPS) — se conecta por URL:

| Cliente | Cómo conectarse |
|---|---|
| **Claude Code** (remoto) | `claude mcp add --transport http --url http://your-server:3000/mcp --header "Authorization: Bearer <token>"` |
| **Cursor / Cline** | Agregar URL MCP remota en la configuración |
| **ChatGPT** (GPT personalizado) | Importar esquema desde `http://your-server:3000/openapi.json` → Acciones → Token Bearer |
| **Cualquier cliente HTTP** | API REST en `/api/*` — ver [Guía para Docentes](docs/CHATGPT-TEACHER-GUIDE.md) |

---

## Instalación

Requiere **Node 22+** (para `fetch` y `AbortController` integrados) y **Python 3.10+** (para los scripts del generador de manifiestos y playbooks en `mcp-openemis-gen/`). El servidor MCP en sí es solo Node; Python solo se necesita si reconstruye el manifiesto desde el código fuente.

### Desde GitHub

```bash
git clone https://github.com/tixuz/openemis-mcp.git
cd openemis-mcp

npm install
npm run build

cp .env.example .env
$EDITOR .env
```

### Configurar

`.env.example` documenta cada variable. Como mínimo necesita las tres credenciales que su administrador de OpenEMIS emite:

```env
OPENEMIS_BASE_URL=https://demo.openemis.org/core   # o su propia instancia
OPENEMIS_USERNAME=admin
OPENEMIS_PASSWORD=your_password
OPENEMIS_API_KEY=your_api_key

# Opcional
OPENEMIS_TIMEOUT_MS=30000
OPENEMIS_VAULT_PATH=/absolute/path/to/domain-notes
OPENEMIS_MANIFEST_PATH=/absolute/path/to/manifest.jsonl
```

El servidor inicia sesión de forma diferida en la primera llamada a herramienta autenticada, haciendo POST a `/api/v5/login`, extrayendo el JWT de `data.token` y almacenándolo en caché en memoria. En un error 401, vuelve a iniciar sesión y lo reintenta una vez.

`OPENEMIS_VAULT_PATH` apunta a la carpeta que contiene las notas curadas `Domain-*.md` utilizadas por `openemis_discover`. Si falta, el descubrimiento se degrada con gracia a coincidencia de palabras clave solo contra el manifiesto.

`OPENEMIS_MANIFEST_PATH` apunta a la salida JSONL del constructor complementario en `../mcp-openemis-gen/`. Si está ausente, las herramientas de descubrimiento devuelven una pista amigable de "manifiesto aún no construido" — no fallan.

### Prueba de humo de accesibilidad

```bash
set -a && source .env && set +a
node scripts/smoke-login.mjs
```

Resultado esperado:

```
[Test] Loading config...
[OK] Config loaded: baseUrl=https://demo.openemis.org/core
[Test] Creating client...
[OK] Client created
[Test] Attempting login...
[OpenEMIS] Login successful; cached JWT (331 chars)
[OK] Login successful
```

### Registrar con Claude Code

```bash
claude mcp add openemis \
  --env OPENEMIS_BASE_URL="https://your-openemis/core" \
  --env OPENEMIS_USERNAME="…" \
  --env OPENEMIS_PASSWORD="…" \
  --env OPENEMIS_API_KEY="…" \
  --env OPENEMIS_VAULT_PATH="/absolute/path/to/vault" \
  -- node "$(pwd)/dist/server.js"

# Verificar
claude mcp list | grep openemis
# Esperado: openemis: node /…/dist/server.js - ✓ Connected
```

Cualquier nueva sesión de Claude Code en este proyecto verá automáticamente las nueve herramientas.

---

### Modo servidor (Oracle Always Free / cualquier VPS)

Configure `OPENEMIS_TRANSPORT=http` para ejecutar como un servidor HTTP persistente en lugar de un subproceso local. Instálelo una vez en su servidor; cada cliente compatible con MCP (Claude Code, Cursor, Cline, Windsurf) se conecta por URL.

**En su servidor:**

```bash
git clone https://github.com/tixuz/openemis-mcp-pro.git
cd openemis-mcp-pro
npm install && npm run build
cp .env.example .env
$EDITOR .env          # configurar credenciales + OPENEMIS_TRANSPORT=http + OPENEMIS_AUTH_TOKEN
node dist/server.js
```

**.env para modo servidor:**

```env
OPENEMIS_BASE_URL=https://your-openemis/core
OPENEMIS_USERNAME=admin
OPENEMIS_PASSWORD=your_password
OPENEMIS_API_KEY=your_api_key

OPENEMIS_TRANSPORT=http
OPENEMIS_PORT=3000

# Generar: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
OPENEMIS_AUTH_TOKEN=your-secret-token-here
```

**Conectarse desde Claude Code (remoto):**

```bash
claude mcp add openemis-remote \
  --transport http \
  --url "http://your-server:3000/mcp" \
  --header "Authorization: Bearer your-secret-token-here"
```

**Sonda de salud** (monitoreo / comprobaciones de disponibilidad):

```bash
curl http://your-server:3000/health
# {"ok":true,"transport":"http","baseUrl":"https://your-openemis/core"}
```

> ⚠️ **Siempre configure `OPENEMIS_AUTH_TOKEN`** antes de exponer el puerto públicamente. Sin él, el endpoint está abierto para cualquiera que pueda alcanzar su IP.

---

## Arquitectura

```
┌────────────────────────┐
│  Agente (Claude / …)    │     "¿Cuántos estudiantes actuales en Avory?"
└───────────┬────────────┘
            │ MCP stdio (JSON-RPC)
┌───────────▼────────────┐
│  openemis-mcp          │  ← nueve herramientas tipadas, esquemas ZodRawShape
│  • openemis_health     │
│  • openemis_list_dom…  │  ← lee Domain-*.md desde el vault
│  • openemis_discover   │  ← tema → ≤30 endpoints con alcance
│  • openemis_list_play… │  ← enumera los 40 playbooks de flujo de trabajo
│  • openemis_get_playbk │  ← carga un playbook por id
│  • openemis_get / _create / _update / _delete   │
└───────────┬────────────┘
            │ HTTPS + Bearer JWT (en caché, auto-refresco en 401)
┌───────────▼────────────┐
│  API de OpenEMIS Core  │  api.openemis.org/core  (referencia)
│  /api/v5/{recurso}     │  demo.openemis.org/core (probado)
└────────────────────────┘
```

Principios de diseño, desde la primera línea de código:

1.  **Con alcance de dominio, nunca manguera contra incendios.** El manifiesto puede crecer a miles de endpoints; el contexto del agente no lo hará. `openemis_discover(topic)` es el embudo — cada conversación solo ve la porción que necesita.
2.  **Herramientas de escritura en v0.3.0.** `openemis_create` / `openemis_update` / `openemis_delete` están activas para todos los recursos sin flujo de trabajo. Los recursos controlados por flujo de trabajo (asistencia, asistencia del personal) están bloqueados a nivel de herramienta y redirigen al playbook apropiado.
3.  **Sin estado entre llamadas.** Solo el JWT se almacena en caché en memoria. Sin persistencia en disco, sin análisis, nada llama a casa.
4.  **Delgado sobre la API real.** Este puente no inventa nuevos conceptos — los nombres de `resource` son rutas en kebab-case v5, los parámetros de consulta son el DSL nativo `_conditions` / `_fields`. Lo que escribiría en curl se traduce 1:1.

---

## Documentación

-   [Referencia de Recursos](docs/resources.md) — los 675 recursos con disponibilidad de método HTTP y estado de escritura (Core 5.10.0)
-   [Playbooks](docs/playbooks/) — 40 guías de flujo de trabajo curadas (26 lectura · 14 escritura/auth)
-   [Guía para Docentes de ChatGPT](docs/CHATGPT-TEACHER-GUIDE.md) — cómo permitir que los docentes marquen asistencia a través de GPT personalizado de ChatGPT
-   [Rutina de Autoría de Playbooks](docs/PLAYBOOK-ROUTINE.md) — proceso de 4 pasos para agregar nuevos playbooks
-   [Glosario](docs/GLOSSARY.es.md) — definiciones de términos clave de OpenEMIS y gestión educativa
-   [Preguntas frecuentes](docs/FAQ.es.md) — preguntas frecuentes sobre OpenEMIS y este servidor MCP

### Playbooks

> **Nuevo en v1.1.0:** se añadieron 9 nuevos playbooks para OpenEMIS Core 5.10.0 — acreditación / registro escolar, presupuesto de institución, historial de ausencias de estudiantes, registro de auditoría de actividad del usuario, lista de clase, estado de la cola de admisión / matrícula y explicación general del sistema de workflow. IDs: `diagnose-alert-delivery`, `view-school-accreditation`, `view-school-registration`, `view-institution-budget`, `query-student-absence-history`, `query-user-activity-audit-log`, `view-class-roster`, `set-school-accreditation` ✏️, `set-school-registration` ✏️, `mark-student-meal-participation` ✏️, `view-admission-and-enrolment-queue-state`, `explain-workflow-system`. Accesibles vía `openemis_get_playbook` — actualmente sólo en inglés; los archivos markdown individuales y las traducciones llegarán en una versión posterior.

| # | Playbook | Dominio | Audiencia | Traducciones |
|---|---|---|---|---|
| 1 | [Contar Puestos Vacantes](docs/playbooks/count-vacant-positions.md) | Personal | admin, rr.hh. | [RU](docs/playbooks/count-vacant-positions.ru.md) · [ES](docs/playbooks/count-vacant-positions.es.md) · [HI](docs/playbooks/count-vacant-positions.hi.md) · [AR](docs/playbooks/count-vacant-positions.ar.md) |
| 2 | [Marcar Asistencia de Estudiante](docs/playbooks/mark-student-attendance.md) | Asistencia | docente, admin | [RU](docs/playbooks/mark-student-attendance.ru.md) · [ES](docs/playbooks/mark-student-attendance.es.md) · [HI](docs/playbooks/mark-student-attendance.hi.md) · [AR](docs/playbooks/mark-student-attendance.ar.md) |
| 3 | [Marcar Asistencia del Personal](docs/playbooks/mark-staff-attendance.md) | Personal | admin, rr.hh., docente | [RU](docs/playbooks/mark-staff-attendance.ru.md) · [ES](docs/playbooks/mark-staff-attendance.es.md) · [HI](docs/playbooks/mark-staff-attendance.hi.md) · [AR](docs/playbooks/mark-staff-attendance.ar.md) |
| 4 | [Ver Horario del Estudiante](docs/playbooks/view-student-timetable.md) | Horario | padre, estudiante | [RU](docs/playbooks/view-student-timetable.ru.md) · [ES](docs/playbooks/view-student-timetable.es.md) · [HI](docs/playbooks/view-student-timetable.hi.md) · [AR](docs/playbooks/view-student-timetable.ar.md) |
| 5 | [Panel de Control del Estudiante](docs/playbooks/student-dashboard.md) | Estudiante | padre, estudiante | [RU](docs/playbooks/student-dashboard.ru.md) · [ES](docs/playbooks/student-dashboard.es.md) · [HI](docs/playbooks/student-dashboard.hi.md) · [AR](docs/playbooks/student-dashboard.ar.md) |
| 6 | [Generar PDF de Boletín de Calificaciones del Estudiante](docs/playbooks/generate-student-report-card-pdf.md) | Reporte | docente, admin | [RU](docs/playbooks/generate-student-report-card-pdf.ru.md) · [ES](docs/playbooks/generate-student-report-card-pdf.es.md) · [HI](docs/playbooks/generate-student-report-card-pdf.hi.md) · [AR](docs/playbooks/generate-student-report-card-pdf.ar.md) |
| 7 | [Matricular a un Nuevo Estudiante](docs/playbooks/enroll-new-student.md) | Estudiante | admin, registrador | [RU](docs/playbooks/enroll-new-student.ru.md) · [ES](docs/playbooks/enroll-new-student.es.md) · [HI](docs/playbooks/enroll-new-student.hi.md) · [AR](docs/playbooks/enroll-new-student.ar.md) |
| 8 | [Registrar un Incidente de Conducta](docs/playbooks/record-behavior-incident.md) | Estudiante | docente, admin | [RU](docs/playbooks/record-behavior-incident.ru.md) · [ES](docs/playbooks/record-behavior-incident.es.md) · [HI](docs/playbooks/record-behavior-incident.hi.md) · [AR](docs/playbooks/record-behavior-incident.ar.md) |
| 9 | [Enviar Calificaciones de Examen](docs/playbooks/submit-exam-marks.md) | Evaluación | docente | [RU](docs/playbooks/submit-exam-marks.ru.md) · [ES](docs/playbooks/submit-exam-marks.es.md) · [HI](docs/playbooks/submit-exam-marks.hi.md) · [AR](docs/playbooks/submit-exam-marks.ar.md) |
| 10 | [Resumen de la Institución](docs/playbooks/institution-summary.md) | Institución | admin, padre | [RU](docs/playbooks/institution-summary.ru.md) · [ES](docs/playbooks/institution-summary.es.md) · [HI](docs/playbooks/institution-summary.hi.md) · [AR](docs/playbooks/institution-summary.ar.md) |
| 11 | [Generar PDF de Estadísticas de la Institución](docs/playbooks/generate-institution-statistics-pdf.md) | Reporte | admin | [RU](docs/playbooks/generate-institution-statistics-pdf.ru.md) · [ES](docs/playbooks/generate-institution-statistics-pdf.es.md) · [HI](docs/playbooks/generate-institution-statistics-pdf.hi.md) · [AR](docs/playbooks/generate-institution-statistics-pdf.ar.md) |
| 12 | [Ver Última Asistencia](docs/playbooks/view-latest-attendance.md) | Asistencia | docente, admin, padre | [RU](docs/playbooks/view-latest-attendance.ru.md) · [ES](docs/playbooks/view-latest-attendance.es.md) · [HI](docs/playbooks/view-latest-attendance.hi.md) · [AR](docs/playbooks/view-latest-attendance.ar.md) |
| 13 | [Ver Perfil del Estudiante](docs/playbooks/view-student-profile.md) | Estudiante | docente, admin | [RU](docs/playbooks/view-student-profile.ru.md) · [ES](docs/playbooks/view-student-profile.es.md) · [HI](docs/playbooks/view-student-profile.hi.md) · [AR](docs/playbooks/view-student-profile.ar.md) |
| 14 | [Ver Calificaciones del Estudiante](docs/playbooks/view-student-marks.md) | Evaluación | docente, admin, padre | [RU](docs/playbooks/view-student-marks.ru.md) · [ES](docs/playbooks/view-student-marks.es.md) · [HI](docs/playbooks/view-student-marks.hi.md) · [AR](docs/playbooks/view-student-marks.ar.md) |
| 15 | [Ver Reporte de Clase](docs/playbooks/view-class-report.md) | Reporte | docente, admin | [RU](docs/playbooks/view-class-report.ru.md) · [ES](docs/playbooks/view-class-report.es.md) · [HI](docs/playbooks/view-class-report.hi.md) · [AR](docs/playbooks/view-class-report.ar.md) |
| 16 | [Ver Horario](docs/playbooks/view-timetable.md) | Horario | docente, admin, estudiante | [RU](docs/playbooks/view-timetable.ru.md) · [ES](docs/playbooks/view-timetable.es.md) · [HI](docs/playbooks/view-timetable.hi.md) · [AR](docs/playbooks/view-timetable.ar.md) |
| 17 | [Ver Perfil Completo de la Institución](docs/playbooks/view-institution-profile.md) | Institución | admin, padre, público | [RU](docs/playbooks/view-institution-profile.ru.md) · [ES](docs/playbooks/view-institution-profile.es.md) · [HI](docs/playbooks/view-institution-profile.hi.md) · [AR](docs/playbooks/view-institution-profile.ar.md) |
| 18 | [Ver Perfil Completo de Clase](docs/playbooks/view-class-profile.md) | Estudiante | docente, admin | [RU](docs/playbooks/view-class-profile.ru.md) · [ES](docs/playbooks/view-class-profile.es.md) · [HI](docs/playbooks/view-class-profile.hi.md) · [AR](docs/playbooks/view-class-profile.ar.md) |
| 19 | [Ver el Perfil Completo de un Miembro del Personal](docs/playbooks/view-staff-profile.md) | Personal | admin, rr.hh. | [RU](docs/playbooks/view-staff-profile.ru.md) · [ES](docs/playbooks/view-staff-profile.es.md) · [HI](docs/playbooks/view-staff-profile.hi.md) · [AR](docs/playbooks/view-staff-profile.ar.md) |
| 20 | [Mejorar el Perfil del Estudiante](docs/playbooks/enhance-student-profile.md) | Estudiante | docente, admin, consejero | [RU](docs/playbooks/enhance-student-profile.ru.md) · [ES](docs/playbooks/enhance-student-profile.es.md) · [HI](docs/playbooks/enhance-student-profile.hi.md) · [AR](docs/playbooks/enhance-student-profile.ar.md) |
| 21 | [Ver Infraestructura de la Institución](docs/playbooks/view-institution-infrastructure.md) | Institución | admin, instalaciones | [RU](docs/playbooks/view-institution-infrastructure.ru.md) · [ES](docs/playbooks/view-institution-infrastructure.es.md) · [HI](docs/playbooks/view-institution-infrastructure.hi.md) · [AR](docs/playbooks/view-institution-infrastructure.ar.md) |
| 22 | [Ver Comidas de la Institución](docs/playbooks/view-institution-meals.md) | Institución | admin, nutricionista, padre | [RU](docs/playbooks/view-institution-meals.ru.md) · [ES](docs/playbooks/view-institution-meals.es.md) · [HI](docs/playbooks/view-institution-meals.hi.md) · [AR](docs/playbooks/view-institution-meals.ar.md) |
| 23 | [Ver Perfil de Riesgo del Estudiante](docs/playbooks/view-student-risks.md) | Estudiante | admin, consejero, docente | [RU](docs/playbooks/view-student-risks.ru.md) · [ES](docs/playbooks/view-student-risks.es.md) · [HI](docs/playbooks/view-student-risks.hi.md) · [AR](docs/playbooks/view-student-risks.ar.md) |
| 24 | [Ver Resumen de Riesgos de la Institución](docs/playbooks/view-institution-risks.md) | Institución | admin, ministerio | [RU](docs/playbooks/view-institution-risks.ru.md) · [ES](docs/playbooks/view-institution-risks.es.md) · [HI](docs/playbooks/view-institution-risks.hi.md) · [AR](docs/playbooks/view-institution-risks.ar.md) |
| 25 | [Agregar Equipo o Activos ✏️](docs/playbooks/add-institution-asset.md) | Infraestructura | admin, contador, instalaciones | [RU](docs/playbooks/add-institution-asset.ru.md) · [ES](docs/playbooks/add-institution-asset.es.md) · [HI](docs/playbooks/add-institution-asset.hi.md) · [AR](docs/playbooks/add-institution-asset.ar.md) |
| 26 | [Registrar una Reparación de Infraestructura ✏️](docs/playbooks/record-infrastructure-repair.md) | Infraestructura | admin, contador, instalaciones | [RU](docs/playbooks/record-infrastructure-repair.ru.md) · [ES](docs/playbooks/record-infrastructure-repair.es.md) · [HI](docs/playbooks/record-infrastructure-repair.hi.md) · [AR](docs/playbooks/record-infrastructure-repair.ar.md) |
| 27 | [Agregar un Nuevo Programa de Alimentación ✏️](docs/playbooks/add-meal-programme.md) | Comidas | admin, contador, nutricionista | [RU](docs/playbooks/add-meal-programme.ru.md) · [ES](docs/playbooks/add-meal-programme.es.md) · [HI](docs/playbooks/add-meal-programme.hi.md) · [AR](docs/playbooks/add-meal-programme.ar.md) |

---

## Planes

| | **Gratuito** | **Individual Pro** | **Institution Pro** | **Country Pro** |
|---|---|---|---|---|
| **Alcance** | Cualquier usuario | Una persona | Una escuela | Ministerio / nacional |
| **Licencia** | MIT | BSL 1.1 | BSL 1.1 | BSL 1.1 |
| Herramientas de lectura (los 675 recursos, Core 5.10.0) | ✅ | ✅ | ✅ | ✅ |
| 40 playbooks curados (26 lectura · 14 escritura/auth · 28 con traducciones) | ✅ | ✅ | ✅ | ✅ |
| Modo stdio (Claude Code, Cursor, Cline) | ✅ | ✅ | ✅ | ✅ |
| **Modo servidor HTTP** (Oracle / VPS) | — | ✅ | ✅ | ✅ |
| **Adaptador OpenAPI** (ChatGPT Custom GPT, cualquier cliente REST) | — | ✅ | ✅ | ✅ |
| Escritura directa — registro único | — | ✅ | ✅ | ✅ |
| Traza de auditoría de institución | — | — | ✅ | ✅ |
| Ejecución de ruta de flujo de trabajo | — | — | ✅ | ✅ |
| Puerta de aprobación de administrador de institución | — | — | ✅ | ✅ |
| Operaciones por lotes dentro de una institución | — | — | ✅ | ✅ |
| Operaciones por lotes multi-institución | — | — | — | ✅ |
| Puertas de aprobación del ministerio | — | — | — | ✅ |
| Supervisión entre instituciones | — | — | — | ✅ |
| Reversión en caso de fallo parcial | — | — | — | ✅ |

→ **Precios y acceso:** khindol.madraimov@gmail.com

---

## Licencia

[MIT](LICENSE.md) — © 2026 Khindol Madraimov

---

## Agradecimientos

Construido por un equipo coordinado de agentes de IA bajo dirección humana — consulte [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) para ver el equipo completo: Adviser Arastu, Marshal Sunny, Samurai Haiku, Xéphyrin Xirdal, Captain Nemo, Coddy (GPT-5), Miniqwenco (Qwen 2.5 Coder 7B), Miniqwen (Qwen 3.5 9B), y Gemmy (Gemma 4e4b) — cada uno con roles distintos en arquitectura, código, análisis y traducción multilingüe.

---

*No afiliado a OpenEMIS o sus mantenedores. Este es un puente de terceros que utiliza la API Core pública. Las credenciales y los datos permanecen en su máquina.*
