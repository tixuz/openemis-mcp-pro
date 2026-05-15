---
title: Ver perfil del estudiante en OpenEMIS
description: Este playbook de OpenEMIS explica cómo recuperar el registro de inscripción completo de un estudiante, los contactos de tutores y el historial de asistencia de estudiantes del sistema de gestión escolar.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - asistencia de estudiantes
  - gestión educativa
---

# Ver perfil del estudiante en OpenEMIS, contactos de tutores e historial de ausencias

**Dominio:** Estudiante · **Audiencia:** docente, administrador

Recupere el registro completo de inscripción de un estudiante, la lista de tutores asociados a él y su historial reciente de ausencias en un solo flujo de trabajo. El paso de tutores enriquece cada contacto con el tipo de relación (por ejemplo, madre, padre, tutor legal) al resolver la tabla de búsqueda de relaciones de tutores. El historial de ausencias se obtiene de student-attendance-marked-records — cada fila es un evento de ausencia o retraso; los días sin fila están implícitamente presentes.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `institution-students` | Proporciona los detalles de inscripción actual del estudiante — institución, grado, clase y período académico — como el ancla para el resto del flujo de trabajo. |
| `student-guardians` | Enumera todos los tutores vinculados a este estudiante, incluidos los datos de contacto y el ID del tipo de relación para cada uno. |
| `guardian-relations` | Tabla de referencia de etiquetas de tipo de relación (Madre, Padre, Tutor Legal, etc.) — se utiliza para convertir el guardian_relation_id en un nombre para mostrar legible por humanos. |
| `student-attendance-marked-records` | Proporciona los eventos recientes de ausencia, retraso y justificados del estudiante ordenados por fecha — la ausencia por omisión significa que los días sin fila fueron días presentes. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Obtener registro de inscripción del estudiante | `openemis_get` | Recuperar los detalles de inscripción actual del estudiante, incluidos institución, grado educativo, clase y período académico. |
| 2 | Obtener contactos de tutores | `openemis_get` | Recuperar todos los registros de tutores vinculados a este estudiante, incluidos los datos de contacto y el ID del tipo de relación. |
| 3 | Resolver tipos de relación de tutores | `openemis_discover` | Buscar la lista completa de etiquetas de tipo de relación para que cada guardian_relation_id pueda mostrarse como una etiqueta legible por humanos. |
| 4 | Obtener historial de ausencias | `openemis_get` | Recuperar los eventos recientes de ausencia, retraso y justificados del estudiante para dar una visión rápida de los patrones de asistencia. |

### Notas de los pasos

**Paso 1 — Obtener registro de inscripción del estudiante:** Filtrar `institution-students` por `student_id` y opcionalmente `academic_period_id`. Incluir campos: `id`, `student_id`, `institution_id`, `institution_class_id`, `education_grade_id`, `academic_period_id`, `student_status_id`. Si `student_status_id=1` no está configurado, el estudiante puede aparecer en múltiples períodos — delimite al actual. Capture `institution_class_id` y `education_grade_id` para el paso del historial de ausencias.

**Paso 2 — Obtener contactos de tutores:** Filtrar `student-guardians` por `student_id`. Espere campos como `guardian_relation_id`, `first_name`, `last_name`, `contact_number` y `email`. Un estudiante puede tener de 0 a 4 tutores; un resultado vacío es válido, especialmente para estudiantes mayores. El `guardian_relation_id` se resolverá en el siguiente paso.

**Paso 3 — Resolver tipos de relación de tutores:** Esta es una pequeña tabla de referencia — obtenga `guardian-relations` sin necesidad de filtros. Construya un mapa de búsqueda de `{id → name}` y reemplace el `guardian_relation_id` de cada tutor con su etiqueta. Omita este paso si el solicitante solo necesita números de contacto y no necesita mostrar la etiqueta de relación.

**Paso 4 — Obtener historial de ausencias:** Filtrar `student-attendance-marked-records` por `student_id`, ordenado por `date` descendente, con un límite de 30 para los eventos más recientes. Cada fila tiene `absence_type_id` (1 = Justificado, 2 = Injustificado, 3 = Retraso) y `date`. Recuerde: solo se almacenan las filas de excepción — un estudiante sin fila en un día MARCADO dado estuvo PRESENTE por omisión. Para verificar totales en un período específico, también filtre por `date_from` y `date_to`.

---

## Consulta de ejemplo

> "Muéstreme el perfil de Mariam, la información de contacto de sus tutores y con qué frecuencia ha estado ausente este mes."

El agente hará:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar este playbook
2. Seguir los pasos anteriores
3. Devolver la respuesta en lenguaje sencillo