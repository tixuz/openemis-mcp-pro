---
title: Ver el resumen del boletín de calificaciones de la clase en OpenEMIS
description: Este playbook de OpenEMIS explica cómo recuperar la configuración del boletín de calificaciones, materias y resultados de evaluación de todos los estudiantes de una clase del sistema de gestión escolar.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
---

# Ver la Vista General del Boletín de Calificaciones de la Clase en OpenEMIS

**Dominio:** Reportes · **Audiencia:** docente, administrador

Recupere la configuración de la boleta de calificaciones para una clase, liste las materias incluidas en ella y obtenga los resultados de los ítems de evaluación para todos los estudiantes de ese grado y período. Esto proporciona una vista general a nivel de clase equivalente a lo que un docente ve en la pantalla de resumen de la boleta de calificaciones. Tenga en cuenta que este es un flujo de trabajo de lectura — la generación de PDF requiere un proceso asíncrono separado (consulte el playbook `generate-student-report-card-pdf`).

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `report-cards` | La definición de la boleta de calificaciones para la institución y el período académico — determina qué materias y componentes de calificación se incluyen en la boleta oficial. |
| `institution-class-grades` | Proporciona el/los `education_grade_id` asignados a esta clase, utilizados para filtrar los resultados de evaluación por grado. |
| `report-card-subjects` | Enumera las materias en la boleta de calificaciones con su orden de visualización — garantiza que la vista general de la clase coincida con el diseño de la boleta oficial. |
| `assessment-item-results` | Proporciona todas las filas de calificaciones de los estudiantes para este grado y período — la fuente de datos para la cuadrícula de resumen a nivel de clase. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Obtener la configuración de la boleta de calificaciones | `openemis_get` | Recuperar la definición de la boleta para confirmar qué materias y escala de calificación están en alcance. |
| 2 | Obtener las asignaciones de grado para la clase | `openemis_get` | Recuperar el/los `education_grade_id` para esta clase para delimitar las consultas de resultados de evaluación. |
| 3 | Obtener las materias en la boleta de calificaciones | `openemis_get` | Listar las materias incluidas en la boleta y su orden de visualización. |
| 4 | Obtener los resultados de evaluación para la clase | `openemis_get` | Extraer todas las filas de calificaciones de los estudiantes para este grado y período para construir la tabla de resumen a nivel de clase. |

### Notas de los pasos

**Paso 1 — Obtener la configuración de la boleta de calificaciones:** Filtre `report-cards` por `institution_id` y `academic_period_id`. La respuesta incluye `report_card_id` (necesario para el paso 3), la referencia a la escala de calificación y si los comentarios del docente están habilitados. Si existen múltiples boletas para el mismo período, haga coincidir por `education_grade_id` o pregunte al usuario cuál usar.

**Paso 2 — Obtener las asignaciones de grado para la clase:** Filtre `institution-class-grades` por `institution_class_id`. Una clase típicamente se asigna a un grado, pero algunas instituciones configuran clases multigrado — capture todos los valores de `education_grade_id` devueltos para usar en los pasos 3 y 4.

**Paso 3 — Obtener las materias en la boleta de calificaciones:** Filtre `report-card-subjects` por `report_card_id` del paso 1. Cada fila vincula una materia a la boleta mediante `education_subject_id`. Use esta lista para determinar qué materias mostrar en la vista general de la clase — las materias que no estén en esta lista no aparecen en la boleta oficial.

**Paso 4 — Obtener los resultados de evaluación para la clase:** Filtre `assessment-item-results` por `education_grade_id` (del paso 2) y `academic_period_id`. Para una clase grande, utilice paginación con `limit=200`. Cada fila tiene `student_id`, `assessment_item_id`, `marks` y `grading_option_id`. Agrupe por `student_id` y `assessment_item_id` para construir la cuadrícula por estudiante y por materia. Las filas con `marks=null` indican calificaciones aún no ingresadas.

---

## Ejemplo de consulta

> "Muéstreme la vista general de la boleta de calificaciones para todos los estudiantes del Grado 6 — ¿cómo se está desempeñando cada estudiante en las distintas materias?"

El agente hará:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar este playbook
2. Seguir los pasos anteriores
3. Devolver la respuesta en español claro