---
title: Ver las calificaciones y resultados de evaluación de un estudiante en OpenEMIS
description: Este playbook de OpenEMIS explica cómo recuperar las calificaciones de un estudiante por asignatura o período académico del sistema de gestión escolar.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
---

# Ver las calificaciones y resultados de evaluación de un estudiante en OpenEMIS (asignatura o período)

**Dominio:** Evaluación · **Audiente:** docente, administrador, padre/madre

Recupere los resultados calificados de un estudiante desde `assessment-item-results` para una o más evaluaciones en un período académico determinado. Esta guía primero localiza las definiciones de evaluación y los identificadores de período relevantes, luego obtiene las filas de calificaciones brutas y finalmente las enriquece con los nombres de las asignaturas desde `education-subjects`. Los resultados incluyen la calificación numérica más un `grading_option_id` que puede resolverse contra la tabla de calificación de la evaluación para obtener una letra o etiqueta de aprobado/reprobado.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `institution-students` | Confirma que el estudiante está matriculado y proporciona el `institution_id`, `education_grade_id` y `academic_period_id` necesarios para filtrar las evaluaciones correctamente. |
| `assessments` | Enumera las evaluaciones disponibles (parcial, examen final, trimestral) para el grado y período académico del estudiante. |
| `assessment-periods` | Proporciona las etiquetas de período (Término 1, Semestre 2) dentro de cada evaluación para que las calificaciones puedan mostrarse con el nombre de período correcto. |
| `assessment-items` | Enumera los componentes individuales de asignatura dentro de la evaluación, incluyendo las calificaciones máximas y el `education_subject_id` para la resolución del nombre de la asignatura. |
| `assessment-item-results` | La fuente de las calificaciones reales asignadas — una fila por estudiante por ítem de evaluación. |
| `education-subjects` | Tabla de referencia para los nombres de las asignaturas — se utiliza para reemplazar los valores de `education_subject_id` con etiquetas legibles en la salida final. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Confirmar la matrícula del estudiante | `openemis_get` | Verificar que el estudiante está matriculado y recuperar los ids de grado y período necesarios para filtrar las evaluaciones. |
| 2 | Obtener evaluaciones para el grado y período | `openemis_get` | Listar las evaluaciones disponibles para el grado y período académico de este estudiante. |
| 3 | Obtener períodos de evaluación | `openemis_discover` | Resolver las etiquetas de los períodos de evaluación para que las calificaciones puedan mostrarse con el nombre de período correcto. |
| 4 | Obtener ítems de evaluación (asignaturas) | `openemis_get` | Recuperar las asignaturas evaluadas dentro de la evaluación seleccionada, incluyendo las calificaciones máximas. |
| 5 | Resolver nombres de asignaturas | `openemis_discover` | Mapear los valores de `education_subject_id` a nombres de asignaturas legibles para humanos. |
| 6 | Obtener calificaciones del estudiante | `openemis_get` | Recuperar las calificaciones reales asignadas para este estudiante en todos los ítems de evaluación. |

### Notas de los pasos

**Paso 1 — Confirmar la matrícula del estudiante:** Filtrar `institution-students` por `student_id` y `student_status_id=1`. Si el usuario proporcionó el nombre del estudiante en lugar de un id, buscar con filtro `first_name` o `last_name`. Capture `education_grade_id` y `academic_period_id` de la respuesta — son las claves de unión para las evaluaciones.

**Paso 2 — Obtener evaluaciones para el grado y período:** Filtrar `assessments` por `education_grade_id` y `academic_period_id` del paso 1. Si el usuario nombró una evaluación específica (ej. "examen final"), coincidir por nombre. Si no se especifica, devolver todas y permitir que el usuario elija u obtener resultados para todas.

**Paso 3 — Obtener períodos de evaluación:** Filtrar `assessment-periods` por `assessment_id` del paso 2 si está disponible. Coincidir el `assessment_period_id` de cada resultado con estos registros para mostrar una etiqueta de período legible junto a las calificaciones.

**Paso 4 — Obtener ítems de evaluación (asignaturas):** Filtrar `assessment-items` por `assessment_id`. Cada ítem tiene un `education_subject_id` — capture estos para la resolución del nombre de la asignatura en el paso 5. La respuesta también incluye el umbral de calificación de aprobación si está configurado.

**Paso 5 — Resolver nombres de asignaturas:** Obtener `education-subjects` sin filtros, o filtrar por `education_grade_id` para limitar el conjunto de resultados. Construya un mapa de búsqueda de `{id → nombre}` para enriquecer las filas de calificaciones en el paso 6.

**Paso 6 — Obtener calificaciones del estudiante:** Filtrar `assessment-item-results` por `student_id` y `assessment_id`. Opcionalmente filtrar por `assessment_period_id` si el usuario solicitó un término específico. Cada fila contiene `assessment_item_id` (unir con el paso 4 para la asignatura), `marks` (puntuación numérica) y `grading_option_id` (referencia de calificación con letra). Una fila faltante para una asignatura significa que la calificación aún no se ha ingresado — distinga esto de una calificación de cero.

---

## Ejemplo de consulta

> "¿Qué calificaciones obtuvo Khindol en los exámenes parciales este semestre?"

El agente hará:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar esta guía
2. Seguir los pasos anteriores
3. Devolver la respuesta en lenguaje sencillo