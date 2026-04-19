# openemis-mcp

**Un puente de lenguaje natural entre agentes compatibles con MCP (Claude, Codex, Cursor, etc.) y cualquier instancia de OpenEMIS.**

Construido sobre la **API de OpenEMIS Core publicada** (documentación de referencia en [api.openemis.org/core](https://api.openemis.org/core)) y **verificado de extremo a extremo contra la demo pública en [demo.openemis.org/core](https://demo.openemis.org/core)** con credenciales reales, datos reales y viajes de ida y vuelta reales.

Pregunte en inglés:

> *"¿Cuántos estudiantes actuales hay en Avory Primary?"*

El agente planifica las llamadas, este MCP entrega los datos y usted obtiene la respuesta:

> *"La Escuela Primaria Avory (código P1002) tiene 553 estudiantes matriculados actualmente."*

Usted nunca escribe una línea de código. Usted nunca ve JSON. Usted solo pregunta.

> **Estado:** v0.3.0 — **CRUD completo** para recursos sin flujo de trabajo. Las consultas de lectura funcionan para cada recurso de OpenEMIS v5. Las herramientas de escritura (crear/actualizar/eliminar) están activas para todos los recursos que no pasan por el plugin CakePHP Workflow. Los recursos controlados por flujo de trabajo (asistencia, licencia del personal) están bloqueados a nivel de herramienta y redirigen al playbook apropiado.

---

## Por qué existe esto

La API REST de OpenEMIS Core es grande — solo la superficie de v5 expone alrededor de **1,350 endpoints en ~670 recursos**. Ningún agente de IA puede mantener eso en contexto, y la introspección cruda al estilo Swagger inunda una conversación con ruido que no tiene nada que ver con la pregunta real del usuario.

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
| `openemis_list_playbooks` | v0.2 | Enumera los 27 playbooks de flujo de trabajo curados con id, título, dominio y audiencia. El agente usa esto para encontrar la guía paso a paso correcta para una tarea a nivel de usuario. |
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
│  • openemis_list_play… │  ← enumera los 16 playbooks de flujo de trabajo
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

-   [Referencia de Recursos](docs/resources.md) — los 645 recursos con disponibilidad de método HTTP y estado de escritura
-   [Playbooks](docs/playbooks/) — 27 guías de flujo de trabajo curadas (24 lectura · 3 escritura)
-   [Guía para Docentes de ChatGPT](docs/CHATGPT-TEACHER-GUIDE.md) — cómo permitir que los docentes marquen asistencia a través de GPT personalizado de ChatGPT
-   [Rutina de Autoría de Playbooks](docs/PLAYBOOK-ROUTINE.md) — proceso de 4 pasos para agregar nuevos playbooks

### Playbooks

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

## Hoja de ruta

### v0.4.0 — Autenticación por Navegador (planeado)

Hoy, las credenciales requieren una `api_key` emitida manualmente por el administrador de OpenEMIS. v0.4.0 agregará una herramienta opcional `openemis_browser_auth` que elimina toda configuración manual de credenciales:

1.  La herramienta lanza un navegador Playwright local — **sin URL de destino requerida por adelantado**.
2.  El usuario navega a su instancia de OpenEMIS e inicia sesión normalmente.
3.  Playwright observa todo el tráfico de red. Cuando ve una respuesta a **`POST */api/v5/login`** o **`POST */api/v4/login`** (ambas devuelven JWTs idénticos):
    -   La **URL base** se extrae automáticamente de la URL de la solicitud (ej. `https://dev-demo.openemis.org/core/api/v5/login` → base `https://dev-demo.openemis.org/core`) — no es necesario preconfigurar `OPENEMIS_BASE_URL`.
    -   El **JWT** se extrae del cuerpo de la respuesta.
4.  Ambos se almacenan en caché en memoria y se usan para todas las llamadas CRUD posteriores.

Esto elimina `OPENEMIS_BASE_URL`, `OPENEMIS_USERNAME`, `OPENEMIS_PASSWORD` y `OPENEMIS_API_KEY` como requisitos — el usuario simplemente abre un navegador e inicia sesión. Funciona con cualquier instancia de OpenEMIS, cualquier dominio, cualquier subdominio, incluidos entornos de desarrollo, staging y producción sin ninguna reconfiguración.

**Las credenciales basadas en `.env` siguen siendo totalmente compatibles** — las configuraciones existentes no cambian. La autenticación por navegador es opcional a través de la nueva herramienta.

### v0.5.0 — Paneles de Control de Riesgo ✅

`view-student-risks` y `view-institution-risks` — enviados. Puntuaciones de riesgo, desglose por criterio, casos de bienestar, reglas de alerta y registros de entrega.

### v0.6.0 — Rutas de Flujo de Trabajo *(Institution Pro + Country Pro)*

Las herramientas de escritura actuales (`openemis_create`, `openemis_update`, `openemis_delete`) ejecutan una operación a la vez. Las rutas de flujo de trabajo llevan esto más allá: el MCP **orquesta un playbook completo de múltiples pasos automáticamente**, llevando el estado de paso a paso y aplicando validación previa a la confirmación en cada etapa.

**Nueva herramienta:** `openemis_run_workflow { playbook_id, params, dry_run? }` — acepta un ID de playbook y parámetros de entrada estructurados, ejecuta todos los pasos en secuencia, devuelve un registro de ejecución estructurado. En modo de prueba, informa lo que cambiaría sin escribir nada.

Las rutas de flujo de trabajo están restringidas por encima de Individual Pro porque las escrituras masivas de IA a escala institucional o nacional necesitan supervisión. Un docente que marca 30 estudiantes necesita velocidad; una oficina distrital que matricula 500 estudiantes en 20 escuelas necesita auditoría y aprobación.

| Característica | Individual Pro | Institution Pro | Country Pro |
|---|---|---|---|
| Escritura directa (registro único) | ✅ | ✅ | ✅ |
| Traza de auditoría institucional | — | ✅ | ✅ |
| Ejecución de ruta de flujo de trabajo | — | ✅ | ✅ |
| Puerta de aprobación de administrador institucional | — | ✅ | ✅ |
| Operaciones por lotes dentro de una institución | — | ✅ | ✅ |
| Operaciones por lotes multi-institución | — | — | ✅ |
| Puertas de aprobación del ministerio | — | — | ✅ |
| Panel de control de supervisión entre instituciones | — | — | ✅ |
| Reversión en caso de fallo parcial | — | — | ✅ |

---

## Planes

| | **Gratuito** | **Individual Pro** | **Institution Pro** | **Country Pro** |
|---|---|---|---|---|
| **Alcance** | Cualquier usuario | Una persona | Una escuela | Ministerio / nacional |
| **Licencia** | MIT | BSL 1.1 | BSL 1.1 | BSL 1.1 |
| Herramientas de lectura (los 645 recursos) | ✅ | ✅ | ✅ | ✅ |
| 24 c
# OpenEMIS Bridge

**Un puente de línea de comandos y API REST para automatizar la gestión de datos en OpenEMIS Core.**

---

## Descripción

OpenEMIS Bridge es una herramienta de automatización que conecta su entorno local o de servidor con la API REST de **OpenEMIS Core**. Permite realizar operaciones masivas de lectura, creación, actualización y eliminación de datos (CRUD) de forma programática, superando las limitaciones de la interfaz web manual.

**Casos de uso principales:**
*   **Migración de datos:** Cargar miles de registros de estudiantes, personal o cursos desde archivos CSV/Excel.
*   **Sincronización:** Mantener datos coherentes entre OpenEMIS y otros sistemas (por ejemplo, un sistema de nómina o de biblioteca).
*   **Automatización de informes:** Extraer datos regularmente para paneles de control o informes externos.
*   **Mantenimiento de datos:** Corregir errores masivos, actualizar campos en lotes o archivar registros antiguos.
*   **Integración:** Conectar OpenEMIS con flujos de trabajo personalizados o aplicaciones de terceros.

---

## Características principales

*   **Modos de operación flexibles:** Línea de comandos (CLI), servidor HTTP y adaptador OpenAPI.
*   **Soporte para operaciones por lotes:** Procese miles de registros con una sola instrucción.
*   **Traducciones integradas:** Interfaz y documentación disponibles en inglés, español, francés y ruso.
*   **Seguro:** Las credenciales nunca salen de su máquina. Se conecta a su instancia de OpenEMIS.
*   **Respetuoso con la API:** Implementa reintentos automáticos, límites de velocidad y manejo de errores.
*   **Auditoría:** Registra todas las operaciones para su trazabilidad.
*   **Flujos de trabajo:** Admite la ejecución de rutas de aprobación del sistema OpenEMIS.

---

## Instalación

### 1. Requisitos previos
*   **Python 3.9 o superior**
*   **pip** (gestor de paquetes de Python)
*   Acceso a una instancia de **OpenEMIS Core** con credenciales de API válidas.

### 2. Instalación desde PyPI (recomendado)
```bash
pip install openemis-bridge
```

### 3. Instalación desde el código fuente
```bash
git clone https://github.com/khindol/openemis-bridge.git
cd openemis-bridge
pip install -e .
```

---

## Configuración rápida

### 1. Configurar la conexión
La primera vez que use el puente, debe configurar la conexión a su instancia de OpenEMIS.

**Opción A: Usar el asistente interactivo**
```bash
openemis-bridge config setup
```
Siga las instrucciones para ingresar la URL de su OpenEMIS y sus credenciales.

**Opción B: Usar variables de entorno**
```bash
export OPENEMIS_URL="https://su-instancia.openemis.org"
export OPENEMIS_USERNAME="su_usuario_api"
export OPENEMIS_PASSWORD="su_contraseña_api"
export OPENEMIS_INSTITUTION_ID="123"  # Opcional, para operaciones a nivel de institución
```

### 2. Verificar la conexión
```bash
openemis-bridge config test
```
Si la conexión es exitosa, verá un mensaje de confirmación y la información de su perfil de usuario.

---

## Uso básico

### Modo de línea de comandos (CLI)

#### 1. Leer datos (GET)
```bash
# Obtener todos los estudiantes
openemis-bridge get institution-students

# Obtener un estudiante específico por ID
openemis-bridge get institution-students/1001

# Filtrar y paginar resultados
openemis-bridge get institution-students --filter '{"academic_period_id": 5}' --limit 50 --page 2

# Exportar resultados a CSV
openemis-bridge get institution-students --output estudiantes.csv
```

#### 2. Crear datos (POST)
```bash
# Crear un solo estudiante desde un archivo JSON
openemis-bridge post institution-students --data @nuevo_estudiante.json

# Crear múltiples estudiantes desde un archivo CSV
openemis-bridge post institution-students --batch estudiantes.csv

# Crear desde datos en línea
openemis-bridge post institution-students --data '{"openemis_no": "STU2025001", "first_name": "María", "last_name": "García"}'
```

#### 3. Actualizar datos (PATCH/PUT)
```bash
# Actualizar un estudiante específico
openemis-bridge patch institution-students/1001 --data '{"address": "Nueva dirección 123"}'

# Actualización masiva desde un archivo CSV
openemis-bridge patch institution-students --batch actualizaciones.csv --id-field student_id
```

#### 4. Eliminar datos (DELETE)
```bash
# Eliminar un registro específico
openemis-bridge delete institution-students/1001

# Eliminación masiva (¡use con precaución!)
openemis-bridge delete institution-students --filter '{"graduation_year": 2010}'
```

### Modo servidor HTTP

Inicie el servidor REST:
```bash
openemis-bridge serve --port 8080
```

El servidor proporciona una API REST idéntica a la CLI:
```bash
# Ejemplo usando curl
curl -X GET "http://localhost:8080/api/institution-students?limit=10"
curl -X POST "http://localhost:8080/api/institution-students" -H "Content-Type: application/json" -d '{"openemis_no": "STU2025001", "first_name": "Juan"}'
```

### Adaptador OpenAPI

Genere un esquema OpenAPI para integrar con ChatGPT Custom GPTs o cualquier cliente REST:
```bash
openemis-bridge openapi --output openapi-spec.yaml
```

---

## Recursos soportados

El puente soporta **todos los endpoints de la API pública de OpenEMIS Core**, incluyendo:

| Categoría | Recursos de ejemplo |
|-----------|---------------------|
| **Gestión de instituciones** | `institutions`, `institution-lands`, `institution-types` |
| **Estudiantes** | `institution-students`, `student-attendances`, `student-behaviours` |
| **Personal** | `institution-staff`, `staff-attendances`, `staff-behaviours` |
| **Académico** | `institution-classes`, `institution-subjects`, `education-grades` |
| **Evaluación** | `assessment-items`, `assessment-grading-types`, `institution-assessments` |
| **Plan de estudios** | `institution-curricula`, `training-courses`, `training-sessions` |
| **Finanzas** | `institution-bank-accounts`, `student-fees`, `scholarships` |
| **Infraestructura** | `institution-rooms`, `institution-buildings`, `infrastructure-types` |
| **Salud** | `student-healths`, `health-allergies`, `immunizations` |
| **Seguridad** | `security-roles`, `security-users`, `security-user-groups` |

**Para ver todos los recursos disponibles:**
```bash
openemis-bridge resources list
```

---

## Ejemplos prácticos

### Ejemplo 1: Migrar estudiantes desde un CSV
```bash
# Archivo estudiantes.csv:
# openemis_no,first_name,last_name,gender_id,date_of_birth
# STU001,Ana,López,2,2008-05-15
# STU002,Carlos,Ruiz,1,2009-03-22

openemis-bridge post institution-students --batch estudiantes.csv --report migracion_estudiantes.log
```

### Ejemplo 2: Actualizar direcciones de correo electrónico masivamente
```bash
# Archivo emails.csv:
# id,email
# 1001,estudiante1@escuela.edu
# 1002,estudiante2@escuela.edu

openemis-bridge patch institution-students --batch emails.csv --id-field id
```

### Ejemplo 3: Extraer datos para un informe
```bash
# Extraer todos los estudiantes del período académico actual
openemis-bridge get institution-students \
  --filter '{"academic_period_id": 5}' \
  --fields 'openemis_no,first_name,last_name,gender_id,date_of_birth' \
  --output estudiantes_actuales.csv
```

### Ejemplo 4: Usar en un script de Python
```python
import subprocess
import json

# Obtener datos de estudiantes
result = subprocess.run(
    ['openemis-bridge', 'get', 'institution-students', '--limit', '10', '--format', 'json'],
    capture_output=True,
    text=True
)

students = json.loads(result.stdout)
for student in students['data']:
    print(f"{student['openemis_no']}: {student['first_name']} {student['last_name']}")
```

---

## Guía de referencia de la CLI

### Comandos principales

| Comando | Descripción |
|---------|-------------|
| `openemis-bridge get <recurso>` | Recuperar registros |
| `openemis-bridge post <recurso>` | Crear nuevos registros |
| `openemis-bridge patch <recurso>` | Actualizar registros parcialmente |
| `openemis-bridge put <recurso>` | Reemplazar registros completamente |
| `openemis-bridge delete <recurso>` | Eliminar registros |
| `openemis-bridge config <subcomando>` | Gestionar configuración |
| `openemis-bridge serve` | Iniciar servidor HTTP |
| `openemis-bridge openapi` | Generar especificación OpenAPI |
| `openemis-bridge resources` | Listar recursos disponibles |

### Opciones comunes

| Opción | Descripción |
|--------|-------------|
| `--filter <json>` | Filtrar resultados (ej: `'{"gender_id": 1}'`) |
| `--limit <n>` | Limitar número de resultados |
| `--page <n>` | Número de página para paginación |
| `--fields <lista>` | Campos a incluir (ej: `id,name,code`) |
| `--data <json>` | Datos para POST/PATCH/PUT |
| `--batch <archivo>` | Archivo CSV/JSON para operaciones por lotes |
| `--id-field <nombre>` | Campo de ID para operaciones por lotes |
| `--output <archivo>` | Guardar salida en archivo |
| `--format <formato>` | Formato de salida (json, csv, table) |
| `--report <archivo>` | Guardar registro detallado de operaciones |
| `--dry-run` | Simular operación sin cambios reales |
| `--verbose` | Mostrar información detallada |

---

## Configuración avanzada

### Archivo de configuración
El puente busca configuración en `~/.openemis/bridge.yaml`:
```yaml
openemis:
  url: "https://su-instancia.openemis.org"
  username: "su_usuario_api"
  password: "su_contraseña_api"
  institution_id: 123  # Opcional

server:
  port: 8080
  host: "0.0.0.0"
  cors_origins: ["http://localhost:3000"]

batch:
  chunk_size: 50
  max_retries: 3
  delay_between_retries: 1.0

logging:
  level: "INFO"
  file: "~/.openemis/bridge.log"
```

### Variables de entorno
Todas las configuraciones pueden establecerse mediante variables de entorno con el prefijo `OPENEMIS_`:
```bash
export OPENEMIS_URL="https://demo.openemis.org"
export OPENEMIS_USERNAME="admin"
export OPENEMIS_PASSWORD="secreto"
export OPENEMIS_BATCH_CHUNK_SIZE="100"
```

---

## Solución de problemas

### Problemas comunes

1. **Error de conexión:**
   ```bash
   # Verificar URL y credenciales
   openemis-bridge config test
   
   # Verificar conectividad de red
   curl -v https://su-instancia.openemis.org
   ```

2. **Error de autenticación:**
   ```bash
   # Restablecer credenciales
   openemis-bridge config setup --force
   ```

3. **Límites de velocidad de la API:**
   ```bash
   # Reducir el tamaño del lote
   openemis-bridge post institution-students --batch datos.csv --chunk-size 20
   
   # Añadir retraso entre solicitudes
   openemis-bridge post institution-students --batch datos.csv --delay 0.5
   ```

4. **Errores de validación de datos:**
   ```bash
   # Usar --dry-run para probar primero
   openemis-bridge post institution-students --batch datos.csv --dry-run
   
   # Verificar estructura de datos requerida
   openemis-bridge resources schema institution-students
   ```

### Registros y depuración
```bash
# Habilitar modo detallado
openemis-bridge get institution-students --verbose

# Ver registros de la aplicación
tail -f ~/.openemis/bridge.log

# Nivel de registro de depuración
OPENEMIS_LOGGING_LEVEL=DEBUG openemis-bridge get institution-students
```

---

## Mejores prácticas

### 1. Siempre haga una copia de seguridad primero
```bash
# Exportar datos existentes antes de operaciones masivas
openemis-bridge get institution-students --output backup_estudiantes.csv
```

### 2. Use --dry-run para operaciones peligrosas
```bash
# Probar antes de eliminar
openemis-bridge delete institution-students --filter '{"status_id": 0}' --dry-run --verbose
```

### 3. Divida operaciones grandes en lotes más pequeños
```bash
# En lugar de procesar 10,000 registros a la vez
openemis-bridge post institution-students --batch grandes_datos.csv --chunk-size 100
```

### 4. Mantenga registros de auditoría
```bash
# Registrar todas las operaciones
openemis-bridge patch institution-students --batch actualizaciones.csv --report auditoria.log
```

### 5. Valide sus datos
```bash
# Verificar estructura del CSV
openemis-bridge validate estudiantes.csv --resource institution-students
```

---

## Seguridad

### Consideraciones importantes

⚠️ **ADVERTENCIA DE SEGURIDAD**

1. **Credenciales:** Las credenciales de API se almacenan localmente en `~/.openemis/bridge.yaml` con permisos de archivo restringidos (600). Nunca comparta este archivo.

2. **Datos sensibles:** El puente puede acceder a todos los datos a los que tenga permiso su usuario de API. Use el principio de privilegio mínimo.

3. **Operaciones masivas:** Las operaciones DELETE y PATCH por lotes pueden causar pérdida de datos. Siempre haga una copia de seguridad primero.

4. **Servidor HTTP:** Cuando ejecute `openemis-bridge serve`, asegúrese de que el puerto no esté expuesto públicamente a menos que esté protegido por autenticación adicional.

### Recomendaciones de seguridad
```bash
# Establecer permisos seguros en el archivo de configuración
chmod 600 ~/.openemis/bridge.yaml

# Usar variables de entorno para credenciales en entornos compartidos
unset OPENEMIS_PASSWORD  # Limpiar después de usar

# Ejecutar el servidor HTTP solo en localhost para desarrollo
openemis-bridge serve --host 127.0.0.1 --port 8080
```

---

## Preguntas frecuentes

### ¿Necesito acceso especial a OpenEMIS?
Sí, necesita un usuario de API con los permisos apropiados para los recursos que desea acceder. Contacte a su administrador de OpenEMIS.

### ¿Puedo usar esto con OpenEMIS en la nube?
Sí, siempre que tenga credenciales de API y la instancia esté accesible desde su red.

### ¿Qué formatos de archivo son compatibles?
- **Entrada:** CSV, JSON, Excel (.xlsx, .xls)
- **Salida:** CSV, JSON, Tabla (formateada para terminal)

### ¿Cómo maneja la paginación?
Automáticamente. Use `--limit` y `--page` para control manual, o deje que el puente obtenga todos los páginas automáticamente.

### ¿Puedo automatizar esto con cron o tareas programadas?
Sí. El puente está diseñado para automatización sin intervención.

### ¿Qué sucede si falla una operación por lotes?
El puente reintentará operaciones fallidas (configurable) y generará un informe detallado de éxitos y fallos.

---

## Matriz de características por edición

| Característica | Gratuita | Estándar | Profesional | Empresarial |
|----------------|----------|----------|-------------|-------------|
| Operaciones CRUD básicas | ✅ | ✅ | ✅ | ✅ |
| Operaciones por lotes (hasta 100 registros/lote) | ✅ | ✅ | ✅ | ✅ |
| Filtrado, paginación, selección de campos | ✅ | ✅ | ✅ | ✅ |
| Formatos CSV/JSON/Excel | ✅ | ✅ | ✅ | ✅ |
| Traducciones integradas | ✅ | ✅ | ✅ | ✅ |
| Modo stdio (Claude Code, Cursor, Cline) | ✅ | ✅ | ✅ | ✅ |
| **Modo servidor HTTP** (instalación en Oracle / VPS) | — | ✅ | ✅ | ✅ |
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