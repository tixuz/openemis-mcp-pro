# openemis-mcp

**Un puente en lenguaje natural entre agentes compatibles con MCP (Claude, Codex, Cursor, etc.) y cualquier instancia de OpenEMIS.**

Construido sobre la **API pública de OpenEMIS Core** (documentación de referencia en [api.openemis.org/core](https://api.openemis.org/core)) y **verificado de extremo a extremo contra la demo pública en [demo.openemis.org/core](https://demo.openemis.org/core)** con credenciales reales, datos reales y viajes de ida y vuelta reales.

Pregunte en inglés:

> *"¿Cuántos estudiantes actuales hay en Avory Primary?"*

El agente planifica las llamadas, este MCP entrega los datos, y usted obtiene la respuesta:

> *"Avory Primary School (código P1002) tiene 553 estudiantes matriculados actualmente."*

Usted nunca escribe una línea de código. Nunca ve JSON. Solo pregunta.

> **Estado:** v0.3.0 — **CRUD completo** para recursos sin flujo de trabajo. Las consultas de lectura funcionan para todos los recursos de OpenEMIS v5. Las herramientas de escritura (crear/actualizar/eliminar) están activas para todos los recursos que no pasan por el plugin CakePHP Workflow. Los recursos controlados por flujo de trabajo (asistencia, licencia de personal) están bloqueados a nivel de herramienta y redirigen al playbook apropiado.

---

## Por qué existe esto

La API REST de OpenEMIS Core es extensa — solo la superficie de v5 expone alrededor de **1,350 endpoints en ~670 recursos**. Ningún agente de IA puede mantener eso en contexto, y la introspección cruda al estilo Swagger inunda una conversación con ruido que no tiene nada que ver con la pregunta real del usuario.

Este MCP resuelve eso de dos maneras:

1.  **Descubrimiento con alcance de dominio.** En lugar de volcar toda la API en el contexto del agente, la herramienta `openemis_discover(tema)` se enfoca en los ~20–30 endpoints relevantes para lo que el usuario realmente está preguntando ("asistencia", "estudiantes", "evaluación") — impulsado por un pequeño paquete de conocimiento curado de notas `Domain-*.md`.
2.  **Un único getter componible.** Una sola herramienta `openemis_get` cubre lista + singleton + búsqueda filtrada en todos los recursos. El agente proporciona `resource` + opcional `id` + opcional `params` (`_fields`, `_conditions`, `orderby`, `page`, `limit`) y el resto del DSL de consulta estilo CakePHP de OpenEMIS se mapea directamente.

El efecto neto: los agentes responden preguntas en lenguaje natural en 2–4 llamadas a herramientas, no en 30.

---

## Herramientas

| Herramienta | Desde | Qué hace |
|---|---|---|
| `openemis_health` | v0.1 | Hace ping a la instancia configurada e informa la accesibilidad. Realiza un viaje de ida y vuelta de inicio de sesión real — si esto pasa, el CRUD funcionará. |
| `openemis_list_domains` | v0.1 | Enumera los dominios curados de OpenEMIS — Asistencia, Evaluación, Personal, Estudiante, Institución, Horario, Examen, Reporte — cada uno con un resumen de una línea. El agente usa esto para averiguar *dónde* vive una pregunta. |
| `openemis_discover` | v0.1 | Entrada: una cadena de tema. Salida: hasta 30 endpoints relevantes para ese tema, extraídos del paquete de conocimiento del dominio y del manifiesto por instancia. Mantiene las conversaciones pequeñas sin importar cuán grande sea la API subyacente. |
| `openemis_list_playbooks` | v0.2 | Enumera los 27 playbooks de flujo de trabajo curados con id, título, dominio y audiencia. El agente usa esto para encontrar la guía paso a paso correcta para una tarea a nivel de usuario. |
| `openemis_get_playbook` | v0.2 | Entrada: un id de playbook. Salida: el playbook completo — recursos, pasos ordenados, notas de orientación y consultas de ejemplo. |
| `openemis_get` | v0.1 | Herramienta de lectura unificada. `{ resource, id?, params? }` — si `id` está presente, obtiene el singleton; de lo contrario, lista con cualquier combinación de `_fields`, `_conditions`, `orderby`, `order`, `page`, `limit`, más cualquier clave de filtro ad-hoc. |
| `openemis_create` | v0.3.0 | Crear un nuevo registro. `{ resource, body }` — solo recursos sin flujo de trabajo. Los recursos controlados por flujo de trabajo (ej. institution-staff-leave) están bloqueados y redirigirán al playbook apropiado. |
| `openemis_update` | v0.3.0 | Actualizar un registro existente por id. `{ resource, id, body }` — solo recursos sin flujo de trabajo. |
| `openemis_delete` | v0.3.0 | Eliminar un registro por id. `{ resource, id }` — solo recursos sin flujo de trabajo. |

Una pregunta representativa en lenguaje natural como *"¿cuántos maestros en Avory Primary, cuántos puestos vacantes?"* se resuelve en tres llamadas `openemis_get` — encadenadas por el agente, reducidas por `_conditions`, entregadas como una sola respuesta en inglés. Una solicitud de escritura como *"matricular un nuevo estudiante"* usa `openemis_get_playbook` para cargar la guía paso a paso, luego `openemis_create` para cada paso de escritura.

---

## Verificado contra demo.openemis.org

Cada afirmación en este README se probó contra la instancia de demo pública antes de ser escrita:

-   `POST /api/v5/login` con `{ username, password, api_key }` → JWT almacenado en caché, 331 caracteres
-   `GET /api/v5/institutions?limit=200&_fields=id,name,code` → 24 instituciones incl. `"Avory Primary School" (id=6, code P1002)`
-   `GET /api/v5/institution-students?institution_id=6&student_status_id=1&limit=1` → la paginación reporta `last_page: 553` → **553 estudiantes matriculados actualmente**
-   `GET /api/v5/academic-periods` → 7 páginas de datos reales de años académicos
-   `GET /api/v5/absence-types` → `EXCUSED`, `UNEXCUSED`, `LATE`, etc.

El ejemplo `scripts/smoke-login.mjs` incluido en este repositorio realiza la prueba de inicio de sesión paso a paso para que pueda confirmar la accesibilidad contra su propia instancia antes de conectarla a Claude Code.

---

## Agentes compatibles

openemis-mcp habla el **Model Context Protocol** sobre stdio — cualquier cliente compatible con MCP funciona:

| Agente | Cómo conectarse |
|---|---|
| **Claude Code** (`claude` CLI) | `claude mcp add` — cliente principal probado, las 9 herramientas disponibles |
| **Cursor** | Agregar a `.cursor/mcp.json` — acceso completo a herramientas |
| **Cline / Continue** (VS Code) | Agregar servidor en la configuración de MCP |
| **Codex** | A través del puente [gemmy-and-qwenny](https://github.com/tixuz/gemmy-and-qwenny) |
| **Cualquier cliente MCP** | Apuntar a `node dist/server.js` con las variables de entorno configuradas |

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
OPENEMIS_PASSWORD=su_contraseña
OPENEMIS_API_KEY=su_api_key

# Opcional
OPENEMIS_TIMEOUT_MS=30000
OPENEMIS_VAULT_PATH=/ruta/absoluta/a/domain-notes
OPENEMIS_MANIFEST_PATH=/ruta/absoluta/a/manifest.jsonl
```

El servidor inicia sesión de forma perezosa en la primera llamada a herramienta autenticada, haciendo POST a `/api/v5/login`, extrayendo el JWT de `data.token` y almacenándolo en caché en memoria. En un error 401, vuelve a iniciar sesión y lo reintenta una vez.

`OPENEMIS_VAULT_PATH` apunta a la carpeta que contiene las notas curadas `Domain-*.md` utilizadas por `openemis_discover`. Si falta, el descubrimiento se degrada elegantemente a coincidencia de palabras clave solo contra el manifiesto.

`OPENEMIS_MANIFEST_PATH` apunta a la salida JSONL del constructor complementario en `../mcp-openemis-gen/`. Si está ausente, las herramientas de descubrimiento devuelven una pista amigable de "manifiesto aún no construido" — no fallan.

### Probar la accesibilidad

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
  --env OPENEMIS_BASE_URL="https://su-openemis/core" \
  --env OPENEMIS_USERNAME="…" \
  --env OPENEMIS_PASSWORD="…" \
  --env OPENEMIS_API_KEY="…" \
  --env OPENEMIS_VAULT_PATH="/ruta/absoluta/a/vault" \
  -- node "$(pwd)/dist/server.js"

# Verificar
claude mcp list | grep openemis
# Esperado: openemis: node /…/dist/server.js - ✓ Connected
```

Cualquier nueva sesión de Claude Code en este proyecto verá automáticamente las nueve herramientas.

---

## Arquitectura

```
┌────────────────────────┐
│  Agente (Claude / …)   │     "¿Cuántos estudiantes actuales en Avory?"
└───────────┬────────────┘
            │ MCP stdio (JSON-RPC)
┌───────────▼────────────┐
│  openemis-mcp          │  ← nueve herramientas tipadas, esquemas ZodRawShape
│  • openemis_health     │
│  • openemis_list_dom…  │  ← lee Domain-*.md desde el vault
│  • openemis_discover   │  ← tema → ≤30 endpoints con alcance
│  • openemis_list_play… │  ← lista los 16 playbooks de flujo de trabajo
│  • openemis_get_playbk │  ← carga un playbook por id
│  • openemis_get / _create / _update / _delete   │
└───────────┬────────────┘
            │ HTTPS + Bearer JWT (en caché, auto-refresco en 401)
┌───────────▼────────────┐
│  API de OpenEMIS Core  │  api.openemis.org/core  (referencia)
│  /api/v5/{resource}    │  demo.openemis.org/core (probado)
└────────────────────────┘
```

Principios de diseño, desde la primera línea de código:

1.  **Con alcance de dominio, nunca manguera.** El manifiesto puede crecer a miles de endpoints; el contexto del agente no lo hará. `openemis_discover(tema)` es el embudo — cada conversación solo ve la porción que necesita.
2.  **Herramientas de escritura en v0.3.0.** `openemis_create` / `openemis_update` / `openemis_delete` están activas para todos los recursos sin flujo de trabajo. Los recursos controlados por flujo de trabajo (asistencia, staff-attendance) están bloqueados a nivel de herramienta y redirigen al playbook apropiado.
3.  **Sin estado entre llamadas.** Solo el JWT se almacena en caché en memoria. Sin persistencia en disco, sin análisis, nada llama a casa.
4.  **Delgado sobre la API real.** Este puente no inventa nuevos conceptos — los nombres de `resource` son rutas kebab-case de v5, los parámetros de consulta son el DSL nativo `_conditions` / `_fields`. Lo que escribiría en curl se traduce 1:1.

---

## Documentación

-   [Referencia de Recursos](docs/resources.md) — los 645 recursos con disponibilidad de método HTTP y estado de escritura
-   [Playbooks](docs/playbooks/) — 27 guías de flujo de trabajo curadas (24 lectura · 3 escritura)

### Playbooks

| # | Playbook | Dominio | Audiencia | Traducciones |
|---|---|---|---|---|
| 1 | [Contar Puestos Vacantes](docs/playbooks/count-vacant-positions.md) | Personal | admin, hr | [RU](docs/playbooks/count-vacant-positions.ru.md) · [ES](docs/playbooks/count-vacant-positions.es.md) |
| 2 | [Marcar Asistencia de Estudiante](docs/playbooks/mark-student-attendance.md) | Asistencia | maestro, admin | [RU](docs/playbooks/mark-student-attendance.ru.md) · [ES](docs/playbooks/mark-student-attendance.es.md) |
| 3 | [Marcar Asistencia de Personal](docs/playbooks/mark-staff-attendance.md) | Personal | admin, hr, maestro | [RU](docs/playbooks/mark-staff-attendance.ru.md) · [ES](docs/playbooks/mark-staff-attendance.es.md) |
| 4 | [Ver Horario del Estudiante](docs/playbooks/view-student-timetable.md) | Horario | padre, estudiante | [RU](docs/playbooks/view-student-timetable.ru.md) |
| 5 | [Panel del Estudiante](docs/playbooks/student-dashboard.md) | Estudiante | padre, estudiante | [RU](docs/playbooks/student-dashboard.ru.md) |
| 6 | [Generar PDF de Boletín de Calificaciones del Estudiante](docs/playbooks/generate-student-report-card-pdf.md) | Reporte | maestro, admin | [RU](docs/playbooks/generate-student-report-card-pdf.ru.md) · [ES](docs/playbooks/generate-student-report-card-pdf.es.md) |
| 7 | [Matricular un Nuevo Estudiante](docs/playbooks/enroll-new-student.md) | Estudiante | admin, registrador | [RU](docs/playbooks/enroll-new-student.ru.md) · [ES](docs/playbooks/enroll-new-student.es.md) |
| 8 | [Registrar un Incidente de Conducta](docs/playbooks/record-behavior-incident.md) | Estudiante | maestro, admin | [RU](docs/playbooks/record-behavior-incident.ru.md) · [ES](docs/playbooks/record-behavior-incident.es.md) |
| 9 | [Enviar Calificaciones de Examen](docs/playbooks/submit-exam-marks.md) | Evaluación | maestro | [RU](docs/playbooks/submit-exam-marks.ru.md) |
| 10 | [Resumen de la Institución](docs/playbooks/institution-summary.md) | Institución | admin, padre | [RU](docs/playbooks/institution-summary.ru.md) |
| 11 | [Generar PDF de Estadísticas de la Institución](docs/playbooks/generate-institution-statistics-pdf.md) | Reporte | admin | [RU](docs/playbooks/generate-institution-statistics-pdf.ru.md) · [ES](docs/playbooks/generate-institution-statistics-pdf.es.md) |
| 12 | [Ver Última Asistencia](docs/playbooks/view-latest-attendance.md) | Asistencia | maestro, admin, padre | |
| 13 | [Ver Perfil del Estudiante](docs/playbooks/view-student-profile.md) | Estudiante | maestro, admin | [RU](docs/playbooks/view-student-profile.ru.md) |
| 14 | [Ver Calificaciones del Estudiante](docs/playbooks/view-student-marks.md) | Evaluación | maestro, admin, padre | [RU](docs/playbooks/view-student-marks.ru.md) |
| 15 | [Ver Reporte de Clase](docs/playbooks/view-class-report.md) | Reporte | maestro, admin | [RU](docs/playbooks/view-class-report.ru.md) |
| 16 | [Ver Horario](docs/playbooks/view-timetable.md) | Horario | maestro, admin, estudiante | [RU](docs/playbooks/view-timetable.ru.md) |
| 17 | [Ver Perfil Completo de la Institución](docs/playbooks/view-institution-profile.md) | Institución | admin, padre, público | |
| 18 | [Ver Perfil Completo de la Clase](docs/playbooks/view-class-profile.md) | Estudiante | maestro, admin | |
| 19 | [Ver Perfil Completo de un Miembro del Personal](docs/playbooks/view-staff-profile.md) | Personal | admin, hr | [RU](docs/playbooks/view-staff-profile.ru.md) |
| 20 | [Mejorar el Perfil del Estudiante](docs/playbooks/enhance-student-profile.md) | Estudiante | maestro, admin, consejero | [ES](docs/playbooks/enhance-student-profile.es.md) |
| 21 | [Ver Infraestructura de la Institución](docs/playbooks/view-institution-infrastructure.md) | Institución | admin, instalaciones | |
| 22 | [Ver Comidas de la Institución](docs/playbooks/view-institution-meals.md) | Institución | admin, nutricionista, padre | |
| 23 | [Ver Perfil de Riesgo del Estudiante](docs/playbooks/view-student-risks.md) | Estudiante | admin, consejero, maestro | |
| 24 | [Ver Resumen de Riesgos de la Institución](docs/playbooks/view-institution-risks.md) | Institución | admin, ministerio | |
| 25 | [Agregar Equipo o Activos](docs/playbooks/add-institution-asset.md) ✏️ | Infraestructura | admin, contador, instalaciones | |
| 26 | [Registrar una Reparación de Infraestructura](docs/playbooks/record-infrastructure-repair.md) ✏️ | Infraestructura | admin, contador, instalaciones | |
| 27 | [Agregar un Nuevo Programa de Comidas](docs/playbooks/add-meal-programme.md) ✏️ | Comidas | admin, contador, nutricionista | |

---

## Hoja de ruta

### v0.4.0 — Autenticación por Navegador (planeado)

Hoy, las credenciales requieren una `api_key` emitida manualmente por el administrador de OpenEMIS. v0.4.0 agregará una herramienta opcional `openemis_browser_auth` que elimina toda configuración manual de credenciales:

1.  La herramienta lanza un navegador Playwright local — **sin URL de destino requerida por adelantado**.
2.  El usuario navega a su instancia de OpenEMIS e inicia sesión normalmente.
3.  Playwright observa todo el tráfico de red. Cuando ve una respuesta a **`POST */api/v5/login`** o **`POST */api/v4/login`** (ambos devuelven JWTs idénticos):
    -   La **URL base** se extrae automáticamente de la URL de la solicitud (ej. `https://dev-demo.openemis.org/core/api/v5/login` → base `https://dev-demo.openemis.org/core`) — no es necesario preconfigurar `OPENEMIS_BASE_URL`.
    -   El **JWT** se extrae del cuerpo de la respuesta.
4.  Ambos se almacenan en caché en memoria y se usan para todas las llamadas CRUD posteriores.

Esto elimina `OPENEMIS_BASE_URL`, `OPENEMIS_USERNAME`, `OPENEMIS_PASSWORD` y `OPENEMIS_API_KEY` como requisitos — el usuario simplemente abre un navegador e inicia sesión. Funciona con cualquier instancia de OpenEMIS, cualquier dominio, cualquier subdominio, incluidos entornos de desarrollo, staging y producción sin ninguna reconfiguración.

**Las credenciales basadas en `.env` siguen siendo totalmente compatibles** — las configuraciones existentes no cambian. La autenticación por navegador es opcional a través de la nueva herramienta.

### v0.5.0 — Paneles de Riesgo ✅

`view-student-risks` y `view-institution-risks` — enviados. Puntuaciones de riesgo, desglose por criterio, casos de bienestar, reglas de alerta y registros de entrega.

### v0.6.0 — Rutas de Flujo de Trabajo *(Institution Pro + Country Pro)*

Las herramientas de escritura actuales (`openemis_create`, `openemis_update`, `openemis_delete`) ejecutan una operación a la vez. Las rutas de flujo de trabajo llevan esto más lejos: el MCP **orquesta un playbook completo de múltiples pasos automáticamente**, llevando el estado de paso a paso y aplicando validación previa al commit en cada etapa.

**Nueva herramienta:** `openemis_run_workflow { playbook_id, params, dry_run? }` — acepta un ID de playbook y parámetros de entrada estructurados, ejecuta todos los pasos en secuencia, devuelve un registro de ejecución estructurado. En modo de prueba seca, informa lo que cambiaría sin escribir nada.

Las rutas de flujo de trabajo están limitadas por encima de Individual Pro porque las escrituras masivas de IA a escala institucional o nacional necesitan supervisión. Un maestro que marca 30 estudiantes necesita velocidad; una oficina distrital que matricula 500 estudiantes en 20 escuelas necesita auditoría y aprobación.

| Característica | Individual Pro | Institution Pro | Country Pro |
|---|---|---|---|---|
| Escritura directa (registro único) | ✅ | ✅ | ✅ |
| Traza de auditoría institucional | — | ✅ | ✅ |
| Ejecución de ruta de flujo de trabajo | — | ✅ | ✅ |
| Puerta de aprobación de administrador institucional | — | ✅ | ✅ |
| Operaciones por lotes dentro de una institución | — | ✅ | ✅ |
| Operaciones por lotes multi-institución | — | — | ✅ |
| Puertas de aprobación del ministerio | — | — | ✅ |
| Panel de supervisión entre instituciones | — | — | ✅ |
| Reversión en caso de fallo parcial | — | — | ✅ |

---

## Planes

| | **Gratuito** | **Individual Pro** | **Institution Pro** | **Country Pro** |
|---|---|---|---|---|
| **Alcance** | Cualquier usuario | Una persona | Una escuela | Ministerio / nacional |
| **Licencia** | MIT | BSL 1.1 | BSL 1.1 | BSL 1.1 |
| Herramientas de lectura (todos los 645 recursos) | ✅ | ✅ | ✅ | ✅ |
| 24 playbooks curados + traducciones | ✅ | ✅ | ✅ | ✅ |
| Escritura directa — registro único | — | ✅ | ✅ | ✅ |
| Traza de auditoría institucional | — | — | ✅ | ✅ |
| Ejecución de ruta de flujo de trabajo | — | — | ✅ | ✅ |
| Puerta de aprobación de administrador institucional | — | — | ✅ | ✅ |
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

*No afiliado a OpenEMIS o sus mantenedores. Este es un puente de terceros que habla la API Core pública. Las credenciales y los datos permanecen en su máquina.*