---
title: Ver la asistencia de estudiantes más reciente en OpenEMIS
description: Este playbook de OpenEMIS explica cómo obtener estadísticas de asistencia de estudiantes de hoy, de la semana y de ausentes crónicos del sistema de gestión escolar.
keywords:
  - OpenEMIS
  - asistencia de estudiantes
  - sistema de gestión escolar
  - gestión educativa
---

# Ver la asistencia de estudiantes más reciente en OpenEMIS — Hoy / Semana / Ausentes crónicos

**Dominio:** Asistencia · **Audiente:** docente, administrador, padre

Instantánea rápida: quiénes estuvieron ausentes hoy, totales de la semana hasta la fecha y ausentes crónicos. OpenEMIS NO almacena una fila por estudiante presente — la presencia se infiere por omisión de ausencia una vez que se marca un día. Leer la asistencia correctamente requiere tres capas: (1) qué días se tomaron realmente como listas; (2) qué días tuvieron no_scheduled_class=99 (feriado/cancelado — omitir para estadísticas); (3) para los días MARCADOS restantes, extraer los eventos de ausencia — cada estudiante matriculado sin una fila ese día está PRESENTE.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `institution-class-grades` | Confirma el(los) grado(s) educativo asignado(s) a la clase — se usa para delimitar correctamente las consultas de asistencia. |
| `institution-class-students` | Proporciona la lista completa de la clase — el denominador para calcular cuántos estudiantes estuvieron presentes vs ausentes en un día determinado. |
| `institution-class-attendance-records` | Agregado a nivel mensual que muestra qué días fueron marcados: NOT_MARKED (no se tomó lista), PARTIAL_MARKED (algunos períodos marcados) o MARKED (todos los períodos completos). También marca no_scheduled_class=99 para feriados. |
| `student-attendance-marked-records` | Los eventos de ausencia — cada fila es un registro de tardanza, ausencia o justificación de un estudiante para un día específico. Los estudiantes sin una fila en un día MARKED están implícitamente presentes. |
| `absence-types` | Tabla de referencia para las etiquetas de tipo de ausencia: 1 = Justificada, 2 = Injustificada, 3 = Tardanza. Se usa para distinguir los tipos de ausencia al calcular estadísticas. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Resolver la lista de estudiantes | `openemis_get` | Obtener la lista de la clase — la lista de estudiantes actualmente matriculados que conforman el denominador de asistencia. |
| 2 | Cargar la referencia de tipos de ausencia | `openemis_get` | Obtener la referencia de tipos de ausencia para que los eventos de ausencia puedan categorizarse como ausente, tardanza o justificado. |
| 3 | Verificar qué días fueron marcados | `openemis_get` | Consultar institution-class-attendance-records para encontrar qué días en el rango de fechas realmente tuvieron lista tomada. |
| 4 | Extraer eventos de ausencia para el rango de fechas | `openemis_get` | Obtener todas las filas de ausencia para la clase en el período objetivo. |
| 5 | Aplicar la invariante de lectura | — | Omitir días con no_scheduled_class=99; para días MARKED, contar las filas de ausencia como ausencias y calcular la presencia por omisión para todos los demás estudiantes de la lista. |

### Notas de los pasos

**Paso 1 — Resolver la lista de estudiantes:** Llame a `institution-class-students` filtrado por `institution_class_id`, `academic_period_id` y `student_status_id=1`. El conteo de estudiantes devueltos es el denominador para todos los cálculos de tasa de asistencia.

**Paso 2 — Cargar la referencia de tipos de ausencia:** Llame a `absence-types` sin filtros — esta es una pequeña tabla de referencia. Use el resultado para etiquetar cada fila de ausencia como Justificada (1), Injustificada (2) o Tardanza (3) en la salida.

**Paso 3 — Verificar qué días fueron marcados:** Llame a `institution-class-attendance-records` filtrado por `institution_class_id`, `academic_period_id`, más `year` y `month` para el período objetivo. Observe el campo state: los días NOT_MARKED no se pueden contar (no se tomó lista); los días PARTIAL_MARKED cuentan solo para los períodos que fueron marcados; los días MARKED están completamente completos. Filtre cualquier fila donde `no_scheduled_class=99` (feriado, fuerza mayor, clase cancelada) — estos NO deben contar en contra de la tasa de asistencia de ningún estudiante.

**Paso 4 — Extraer eventos de ausencia para el rango de fechas:** Llame a `student-attendance-marked-records` filtrado por `institution_class_id`, `date_from` y `date_to`, con un límite de 500 o más para clases numerosas. Estas filas son solo los eventos de ausencia.

**Paso 5 — Aplicar la invariante de lectura:** Para cada día MARKED no feriado, el número de estudiantes ausentes es igual al conteo de filas en student-attendance-marked-records para ese día. El número de estudiantes presentes es igual a (tamaño de la lista) menos (conteo de ausentes). El cálculo del "ausente crónico" debe usar solo días marcados — usar el conteo total del calendario (ej., 30 días en abril) subreportará la presencia para cualquier día que un docente olvidó tomar lista.

---

## Ejemplo de consulta

> "¿Cuántos estudiantes en la clase 7A estuvieron ausentes esta semana y quiénes han sido ausentes crónicos este trimestre?"

El agente hará:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar este playbook
2. Seguir los pasos anteriores
3. Devolver la respuesta en lenguaje sencillo

---

## Notas

- El cálculo del "ausente crónico" debe usar solo días marcados — usar el conteo total del calendario (ej., 30 días en abril) subreportará la presencia para cualquier día que un docente olvidó tomar lista.
- Sentinelas de `no_scheduled_class`: 99 = no hubo clase ese día (feriado, fuerza mayor, docente enfermo, excursión); 0 = la clase estaba programada y ocurrió. Los lectores deben filtrar por este campo.
- Para una vista de un padre o tutor de su propio hijo: filtre `student-attendance-marked-records` por `student_id` Y `institution_class_id`. Pueden ver los eventos de ausencia de su propio hijo pero no la lista completa de la clase a menos que los permisos lo permitan.