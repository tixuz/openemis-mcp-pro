---
title: Ver el horario de clases en OpenEMIS
description: Este playbook de OpenEMIS explica cómo recuperar el horario semanal de una clase o docente del sistema de gestión escolar.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
---

# Ver el Horario de Clases en OpenEMIS (Clase o Docente)

**Dominio:** Horario · **Audiencia:** docente, administrador, estudiante

Recupere el horario semanal para una clase específica de la institución — incluyendo día, franja horaria, asignatura y docente asignado — para el período académico actual o especificado. El horario se almacena en `institution-schedule-timetables`; el mapeo clase-grado de `institution-class-grades` se utiliza para enriquecer la respuesta con el contexto del grado educativo. Para una vista personal del horario de un estudiante (dirigida a padres o estudiantes), utilice el playbook `view-student-timetable` en su lugar.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `institution-schedule-timetables` | El horario en sí — cada fila es una franja programada con día de la semana, número de período, id de asignatura y asignación de docente. También se utiliza en el paso 3 para verificar si hay huecos no programados. |
| `institution-class-grades` | Proporciona el grado educativo asociado a esta clase, utilizado para etiquetar la visualización del horario con el contexto del grado. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Obtener Horario de la Clase | `openemis_get` | Recuperar todas las franjas programadas para la clase y el período académico especificados. |
| 2 | Obtener Información del Grado para la Clase | `openemis_get` | Recuperar el grado educativo asociado a esta clase para enriquecer la visualización del horario. |
| 3 | Identificar Huecos o Períodos no Programados | `openemis_discover` | Verificar si faltan franjas horarias comparando las filas obtenidas con los períodos esperados por día. |

### Notas de los pasos

**Paso 1 — Obtener Horario de la Clase:** Filtre `institution-schedule-timetables` por `institution_class_id` y `academic_period_id`. Si el usuario proporciona un nombre de docente en lugar de una clase, primero resuelva el `staff_id` desde el recurso de personal, luego filtre los horarios por `staff_id`. Cada fila incluye `day_of_week` (entero 1–7), `period` (entero), `institution_subject_id` y `staff_id`. Ordene por `day_of_week` y `period` para una cuadrícula semanal legible.

**Paso 2 — Obtener Información del Grado para la Clase:** Filtre `institution-class-grades` por `institution_class_id`. Capture `education_grade_id` para etiquetar la salida del horario (por ejemplo, "Grado 4 — Horario de la Clase A"). En configuraciones de clase multigrado, pueden devolverse múltiples filas — muestre todos los grados asociados.

**Paso 3 — Identificar Huecos o Períodos no Programados:** Agrupe los resultados del paso 1 por `day_of_week` y liste los números de período presentes para cada día. Si faltan períodos consecutivos (por ejemplo, el día 2 tiene períodos 1, 2, 4 pero no 3), anótelos como períodos no programados o libres en la salida. Esto lo calcula el llamador — no existe un campo "gap" en el recurso en sí.

---

## Ejemplo de consulta

> "¿Cómo es el horario semanal de la clase 9A para este año académico?"

El agente hará:
1. Llamará a `openemis_discover` o `openemis_list_playbooks` para encontrar este playbook
2. Seguirá los pasos anteriores
3. Devolverá la respuesta en lenguaje sencillo