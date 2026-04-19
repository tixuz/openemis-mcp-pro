# Ingresar calificaciones de examen por asignatura para un período de evaluación

**Dominio:** Evaluación · **Audiente:** docente

Ingrese masivamente las calificaciones por estudiante para un ítem de evaluación, confirme, y luego verifique que se calculó el resultado ponderado. Esta guía localiza la evaluación correcta y la lista de estudiantes de la clase, luego publica una fila de calificación por estudiante.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `assessments` | Enumera las evaluaciones disponibles (parcial, examen final, trimestral) para este grado y período — el punto de partida para identificar para qué evaluación ingresar calificaciones. |
| `assessment-periods` | Proporciona las etiquetas de los períodos (Término 1, Semestre 2) dentro de la evaluación — necesario para delimitar las calificaciones al término correcto. |
| `assessment-items` | Enumera los componentes individuales de asignatura dentro de la evaluación (ej. Matemáticas, Inglés) incluyendo la calificación máxima — un ítem por asignatura. |
| `assessment-item-results` | El destino de escritura — una fila por estudiante por ítem de evaluación registra su calificación numérica y nota. |
| `education-subjects` | Tabla de referencia para nombres de asignaturas, utilizada para mostrar a qué asignatura corresponde cada ítem de evaluación. |
| `institution-class-students` | La lista de estudiantes de la clase — proporciona la lista de IDs de estudiantes para ingresar calificaciones. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Obtener la evaluación y el período | `openemis_get` | Encontrar la definición de evaluación para este grado y período académico para obtener el `assessment_id` y los detalles del período. |
| 2 | Obtener la lista de estudiantes de la clase | `openemis_get` | Obtener la lista de estudiantes actualmente matriculados en la clase para preparar una fila de calificación para cada uno. |
| 3 | Enviar una calificación por estudiante | `openemis_create` | POST de una fila en `assessment-item-results` por estudiante con su calificación numérica. |

### Notas de los pasos

**Paso 1 — Obtener la evaluación y el período:** Llame a `assessments` filtrado por `academic_period_id` y `education_grade_id`. Si el docente nombró una evaluación específica (ej. "examen final"), coincida por nombre. Anote el `assessment_id` — es requerido para los pasos 2 y 3. También llame a `assessment-periods` filtrado por `assessment_id` para obtener el `assessment_period_id` correcto.

**Paso 2 — Obtener la lista de estudiantes de la clase:** Llame a `institution-class-students` filtrado por `institution_class_id`, `academic_period_id`, y `student_status_id=1` (solo activos). Cada fila proporciona el `student_id` necesario para el envío de la calificación.

**Paso 3 — Enviar una calificación por estudiante:** POST a `assessment-item-results` con `assessment_id`, `assessment_period_id`, `assessment_item_id` (identifica qué asignatura), `student_id`, y `marks` (puntaje numérico). Las filas se pueden enviar individualmente o como un lote. Después de publicar, verifique que los resultados se guardaron obteniendo `assessment-item-results` filtrado por `assessment_id` y `student_id`.

---

## Ejemplo de consulta

> "Ingrese las calificaciones de matemáticas del parcial para la clase 8B — todos los estudiantes obtuvieron entre 65 y 90."

El agente hará:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar esta guía
2. Seguir los pasos anteriores
3. Devolver la respuesta en lenguaje sencillo