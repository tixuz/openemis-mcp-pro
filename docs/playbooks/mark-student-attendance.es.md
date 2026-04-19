# Registrar Asistencia del Estudiante para una Clase (Lista de Asistencia por Periodo)

> 📖 **Servidor de solo lectura.** Los Playbooks que crean o actualizan registros requieren **[openemis-mcp-pro](https://github.com/tixuz/openemis-mcp-pro)**.

**Dominio:** Asistencia · **Audiencia:** profesor, administrador

Lista de asistencia diaria o por periodo. El profesor expresa naturalmente ("marco a Alex justificado, a Sam injustificado, a Jordan tarde, los demás presentes") y el agente resuelve la lista de clase, busca coincidencias aproximadas de nombres, mapea las frases a los IDs de tipo de ausencia y publica solo a los estudiantes excepcionales. Todo estudiante sin una fila se considera PRESENTE por omisión — el "invariante de ausencia por omisión". Admite tres modos de asistencia: DÍA (lista de asistencia de día completo), ASIGNATURA (por asignatura) y DÍA_Y_ASIGNATURA (ambos). El agregado a nivel de mes se actualiza automáticamente después de cada publicación — usted no debe escribir en la tabla agregada directamente.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `institution-class-grades` | Confirma qué grado educativo está asociado con la clase, necesario para buscar el tipo de marca de asistencia correcto. |
| `institution-students` | Proporciona la lista de clase — la lista de estudiantes matriculados cuyos nombres el agente buscará mediante coincidencia aproximada con la lista de asistencia del profesor. |
| `absence-types` | Tabla de referencia que mapea los IDs de tipo de ausencia a etiquetas: 1 = Justificado, 2 = Injustificado, 3 = Tarde. |
| `student-attendance-marked-records` | El objetivo de escritura — una fila por estudiante excepcional por periodo registra su ausencia, llegada tardía o estado justificado. |
| `student-attendance-mark-types` | Determina qué modo de asistencia está configurado para este grado y periodo (DÍA, ASIGNATURA o DÍA_Y_ASIGNATURA). |
| `student-attendance-per-day-periods` | Enumera los periodos numerados en un día escolar para el modo de asistencia DÍA o DÍA_Y_ASIGNATURA. |
| `institution-class-subjects` | Enumera las asignaturas impartidas en esta clase — necesario para el modo ASIGNATURA o DÍA_Y_ASIGNATURA para obtener los IDs de la asignatura. |
| `institution-subjects` | Proporciona nombres de asignaturas legibles por humanos para emparejar con los IDs de asignatura de `institution-class-subjects`. |
| `institution-student-absence-details` | Escritura secundaria opcional — registra el motivo o comentario detrás de una ausencia cuando el profesor lo proporciona. |
| `student-absence-reasons` | Catálogo de referencia de motivos estructurados de ausencia (Enfermedad, Emergencia familiar, Clima, etc.) para emparejar con comentarios de texto libre. |
| `institution-class-attendance-records` | Agregado a nivel de mes actualizado automáticamente por el backend después de cada publicación — no escriba en esto directamente. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Confirmar endpoint v5 solamente | — | Todas las escrituras van a POST /api/v5/student-attendance-marked-records — nunca a las rutas heredadas v4. |
| 2 | Resolver la clase | `openemis_get` | Encuentre el registro de la clase de la institución que coincide con la clase del profesor para el periodo académico actual. |
| 3 | Listar estudiantes matriculados | `openemis_get` | Obtenga la lista completa de los estudiantes actualmente matriculados en esta clase. |
| 4 | Detectar el modo de asistencia | `openemis_get` | Verifique si la clase utiliza el modo de asistencia DÍA, ASIGNATURA o DÍA_Y_ASIGNATURA. |
| 5 | Resolver periodos (modo DÍA / DÍA_Y_ASIGNATURA) | `openemis_get` | Obtenga la lista de periodos numerados del día escolar para este tipo de asistencia. |
| 6 | Resolver asignaturas (modo ASIGNATURA / DÍA_Y_ASIGNATURA) | `openemis_get` | Obtenga los IDs y nombres de las asignaturas para esta clase para que cada fila de asistencia incluya la asignatura correcta. |
| 7 | Cargar tipos y motivos de ausencia | `openemis_get` | Obtenga ambas tablas de referencia en paralelo para soportar el mapeo de frases en lenguaje natural. |
| 8 | Construir la lista de excepciones | — | Identifique solo a los estudiantes no presentes basándose en las instrucciones del profesor utilizando coincidencia aproximada de nombres. |
| 9 | ENVIAR filas de excepción | `openemis_create` | Escriba una fila de ausencia por estudiante excepcional por periodo en `student-attendance-marked-records`. |
| 10 | ENVIAR detalles de ausencia (si se proporciona un motivo) | `openemis_create` | Para cada estudiante al que el profesor le dio un motivo o comentario, escriba una fila en `institution-student-absence-details`. |

### Notas sobre los pasos

**Paso 4 — Detectar el modo de asistencia:** Esto debe hacerse antes de construir cualquier fila. Llame a `student-attendance-mark-types` filtrado por `education_grade_id` y `academic_period_id`. El código `student_attendance_type_id` le indica el modo: 1 = DÍA (subject_id debe ser 0, periodo varía), 2 = ASIGNATURA (periodo siempre es 1, subject_id es una asignatura real), DÍA_Y_ASIGNATURA (ambos varían). No utilice `institution-shift-periods` — eso es solo programación de turnos y no tiene campos de asistencia.

**Paso 8 — Construir la lista de excepciones:** Busque coincidencias aproximadas para cada nombre que mencione el profesor, sin distinguir entre mayúsculas y minúsculas, contra los campos `first_name` y `last_name` de la lista. Si un nombre pudiera coincidir con dos estudiantes diferentes, pida al profesor que aclare antes de publicar. Todos los que no fueron mencionados son PRESENTE por omisión — no cree filas para ellos.

**Paso 9 — ENVIAR filas de excepción:** Envíe un lote con una fila por estudiante excepcional por periodo. Cada fila necesita: `institution_id`, `academic_period_id`, `institution_class_id`, `education_grade_id`, `date`, `period`, `subject_id`, `student_id`, `absence_type_id` y `no_scheduled_class: 0`. La tabla admite upsert — publicar la misma clave compuesta dos veces actualiza la fila existente.

**Paso 10 — ENVIAR detalles de ausencia:** Utilice los mismos campos de clave compuesta que la fila principal, más `comment` (texto libre del profesor) y/o `student_absence_reason_id` (coincidido de `student-absence-reasons`). Ejemplo: "justificado porque su madre está enferma" → comentario = 'mother is ill', student_absence_reason_id = 1 (Enfermedad).

---

## Consulta de ejemplo

> "Marcar presente a todos en 7A hoy excepto Sam, que está ausente injustificado, y Jordan, que llega tarde."

El agente hará lo siguiente:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar este playbook
2. Seguir los pasos anteriores
3. Devolver la respuesta en lenguaje sencillo

---

## Notas

- El Frontend (Angular) utiliza una ruta heredada `/institutions/{institution_id}/students/{student_id}/absences`. Los agentes deben usar las rutas v5 anteriores — son el contrato estable.
No envíe datos a `institution-class-attendance-records` directamente para marcar — es un agregado a nivel de mes que el backend actualiza automáticamente mediante un gancho `afterSaveCommit`.
- AUSENCIA POR OMISIÓN: una vez que se ha marcado un día/período, los estudiantes sin una fila en `student-attendance-marked-records` para ese día/período se consideran PRESENTES. Solo necesita filas para los estudiantes que llegan tarde, están ausentes o tienen una excusa.
- CLASE NO PROGRAMADA para días festivos, fuerza mayor o clases canceladas: ENVÍE una fila con `no_scheduled_class = 99` y ninguna fila por estudiante. El centinela 0 significa que la clase SÍ estaba programada y ocurrió.
- Si el profesor dice "todos presentes", el día permanece como NO_MARCADO (sin filas). Para marcar el día como tomado, envíe al menos una fila o confirme con el profesor si algún estudiante estuvo ausente.