# Panel de Padres/Estudiantes — Asistencia, Comportamiento y Calificaciones Recientes

**Dominio:** Estudiante · **Audiente:** padre, estudiante

Consolida las tres cosas sobre las que los padres más preguntan: ¿con qué frecuencia ha estado ausente mi hijo/a últimamente, ha habido incidentes de comportamiento y cuáles son las calificaciones recientes de exámenes o evaluaciones? Este playbook extrae los tres conjuntos de datos en una secuencia compacta y devuelve una vista resumida única.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `institution-students` | Confirma los detalles de inscripción actual del estudiante — institución, grado, clase y período académico — como el ancla para todas las búsquedas posteriores. |
| `student-attendance-marked-records` | Proporciona los eventos recientes de ausencia y llegada tardía del estudiante (ausencia por omisión significa que los días sin una fila son días presentes). |
| `student-behaviours` | Enumera cualquier incidente de comportamiento registrado — ordenado por fecha para que los eventos más recientes aparezcan primero. |
| `assessment-item-results` | Contiene las calificaciones puntuadas del estudiante para cada asignatura y ítem de evaluación en el período actual. |
| `report-card-comment-codes` | Referencia opcional para resolver códigos de comentarios en el boletín de calificaciones si el padre pregunta sobre la retroalimentación del docente. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Resolver registro del estudiante | `openemis_get` | Obtener los detalles de inscripción actual del estudiante para confirmar su identidad y obtener los ids necesarios para las llamadas posteriores. |
| 2 | Obtener asistencia más reciente | `openemis_get` | Recuperar los 30 eventos más recientes de ausencia/llegada tardía del estudiante. |
| 3 | Obtener incidentes de comportamiento | `openemis_get` | Recuperar los 10 incidentes de comportamiento más recientes registrados para este estudiante. |
| 4 | Obtener calificaciones recientes | `openemis_get` | Recuperar hasta 50 resultados de ítems de evaluación para el estudiante en el período académico actual. |

### Notas de los pasos

**Paso 1 — Resolver registro del estudiante:** Llame a `institution-students` con el id del estudiante para confirmar que está inscrito y recuperar `institution_id`, `institution_class_id`, `education_grade_id` y `academic_period_id`. Estos ids son las claves de unión para los tres conjuntos de datos.

**Paso 2 — Obtener asistencia más reciente:** Llame a `student-attendance-marked-records` filtrado por `student_id`, ordenado por `date` descendente, con un límite de 30. Cada fila es un evento de ausencia (absence_type_id: 1 = Justificada, 2 = Injustificada, 3 = Tarde). Los días en que el estudiante no tiene fila están implícitamente presentes, siempre que el día haya sido marcado.

**Paso 3 — Obtener incidentes de comportamiento:** Llame a `institution-student-behaviours` filtrado por `student_id`, ordenado por `date_of_behaviour` descendente, con un límite de 10. Verifique si existen incidentes — una lista vacía es un resultado positivo para reportar al padre.

**Paso 4 — Obtener calificaciones recientes:** Llame a `assessment-item-results` filtrado por `student_id` y `academic_period_id`, con un límite de 50. Cada fila contiene la asignatura (vía assessment_item_id), la calificación numérica y un grading_option_id para la resolución de calificación por letra.

---

## Ejemplo de consulta

> "¿Cómo le ha ido a Mariam este trimestre — asistencia, comportamiento y calificaciones?"

El agente hará:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar este playbook
2. Seguir los pasos anteriores
3. Devolver la respuesta en lenguaje sencillo