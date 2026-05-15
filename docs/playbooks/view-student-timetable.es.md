---
title: Ver el horario del estudiante en OpenEMIS
description: Este playbook de OpenEMIS explica cómo recuperar el horario personal de clases de un estudiante del sistema de gestión escolar.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
---

# Ver el Horario de un Estudiante en OpenEMIS (Vista de Padre/Madre o Estudiante)

**Dominio:** Horario · **Audiencia:** padre/madre, estudiante

Dado un ID de estudiante, devuelve el horario de clases — asignaturas, docentes, aulas y franjas horarias para el período académico actual. Esta es la vista personal que un estudiante o padre/madre vería, mostrando la clase específica en la que el estudiante está matriculado.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `institution-students` | Proporciona el vínculo entre el estudiante y su clase matriculada, recuperando el `institution_class_id` necesario para buscar el horario. |
| `institution-class-grades` | Confirma el grado educativo asociado a la clase, utilizado para enriquecer la visualización del horario con el contexto del grado. |
| `institution-class-subjects` | Enumera las asignaturas impartidas en esta clase, utilizadas para emparejar las entradas de las franjas del horario con los nombres de las asignaturas. |
| `institution-subject-staff` | Vincula las asignaturas con los docentes asignados para impartirlas, permitiendo que el horario muestre quién enseña cada clase. |
| `institution-schedule-timetables` | El horario en sí — cada fila es una franja programada con día, período, asignatura, docente y, opcionalmente, aula. |
| `institution-rooms` | Mapea los IDs de aula a nombres o códigos de aula para que el horario pueda mostrar la ubicación física de cada franja. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Resolver estudiante a clase | `openemis_get` | Buscar la matrícula actual del estudiante para obtener su `institution_class_id` e `institution_id`. |
| 2 | Leer el horario de la clase | `openemis_get` | Obtener todas las franjas programadas para esa clase y período académico. |
| 3 | Enriquecer con detalles de asignatura, personal y aula | `openemis_get` | Unir nombres de asignaturas, nombres de docentes y nombres de aulas para producir un horario legible. |

### Notas de los pasos

**Paso 1 — Resolver estudiante a clase:** Llame a `institution-students` filtrado por `student_id` y `academic_period_id`, solicitando los campos `institution_class_id`, `institution_id` y `education_grade_id`. Use `student_status_id=1` para asegurarse de que solo se devuelva la matrícula activa actual, no registros históricos de años anteriores.

**Paso 2 — Leer el horario de la clase:** Llame a `institution-timetable` (o `institution-schedule-timetables`) filtrado por `institution_class_id` y `academic_period_id`. Cada fila contiene `day_of_week` (entero 1–7), un número de período, un ID de asignatura y un ID de personal. Ordene por `day_of_week` y período para una cuadrícula legible.

**Paso 3 — Enriquecer con detalles de asignatura, personal y aula:** Obtenga los nombres de las asignaturas desde `institution-class-subjects` e `institution-subjects`, los nombres de los docentes desde `institution-subject-staff` y los nombres de las aulas desde `institution-rooms`. Utilícelos para reemplazar los IDs con etiquetas legibles en la salida final del horario.

---

## Ejemplo de consulta

> "¿Cuál es el horario de clases de Mariam para este trimestre?"

El agente hará:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar este playbook
2. Seguir los pasos anteriores
3. Devolver la respuesta en lenguaje sencillo