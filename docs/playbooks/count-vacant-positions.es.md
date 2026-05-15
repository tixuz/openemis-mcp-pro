---
title: Contar puestos vacantes en OpenEMIS
description: Este playbook de OpenEMIS explica cómo contar los puestos vacantes en una institución o en todo el sistema de gestión escolar.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
---

# Contar Puestos Vacantes en OpenEMIS (por institución o a nivel de sistema)


**Dominio:** Personal · **Audiencia:** admin, hr

Un puesto está vacante cuando o bien (a) no se le ha asignado ningún miembro del personal, o bien (b) el FTE (Equivalente de Tiempo Completo) total de todo el personal en ese puesto es inferior a 1.00 (100%). Esto captura tanto los casos de "nadie asignado" como los de "infra-dotación". La consulta puede acotarse a una única institución o ejecutarse en todo el sistema. Para filtrar por un rol específico —como profesor—, se debe hacer coincidir contra los nombres del título del puesto.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `institution-positions` | La lista principal de puestos definidos: cada fila es una plaza que puede ser ocupada por uno o más miembros del personal. |
| `institution-staff-position-profiles` | Vincula a los miembros del personal con sus asignaciones de puesto, utilizado aquí para verificar si un puesto tiene ocupantes activos. |
| `staff-position-titles` | El catálogo de referencia de títulos de puestos (Profesor, Director, etc.) — utilizado para filtrar los puestos por rol cuando el usuario solicita un tipo específico. |
| `institutions` | Proporciona nombres y códigos de las instituciones al acotar la consulta a una escuela o buscar una institución por nombre. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Resolver el id del título del rol (si se filtra por rol) | `openemis_get` | Obtener el id del título del puesto que coincide con el rol solicitado (p. ej., "profesor"). |
| 2 | Obtener puestos para esta institución | `openemis_get` | Listar todos los puestos en la institución objetivo, opcionalmente filtrados por el id de título resuelto. |
| 3 | Obtener puestos a nivel de sistema (si no se proporciona una institución) | `openemis_get` | Paginarse a través de todos los puestos en todo el sistema, opcionalmente filtrados por título. |
| 4 | Obtener personal asignado a cada puesto | `openemis_get` | Para cada puesto, recuperar las filas de personal para verificar si alguien está asignado y cuál es su FTE combinado. |
| 5 | Contar puestos vacantes | — | Un puesto está vacío si no existen filas de personal activas, o si la suma de sus valores FTE es inferior a 1.0. |
| 6 | Devolver el conteo | — | Informar el número total de puestos vacantes, con detalle opcional sobre las plazas infra-dotadas y su FTE actual. |

### Notas del paso

**Paso 1 — Resolver el id del título del rol:** Llame a `staff-position-titles` con un límite de 200 y solicite solo los campos `id` y `name`. Luego, encuentre las entradas cuyo nombre contenga la palabra del rol solicitado (sin distinción entre mayúsculas y minúsculas). Anote el `id` coincidente para pasarlo como filtro en los pasos 2 o 3.

**Paso 4 — Obtener personal asignado a cada puesto:** Para cada id de puesto devuelto en los pasos 2 o 3, llame a `institution-staff` filtrado por `institution_position_id`. Solicite `id`, `FTE`, `staff_status_id` y `end_date`. FTE se devuelve como una cadena, por ejemplo `"1.00"` — analícela a un flotante antes de sumarla. Solo cuente las filas de personal que estén actualmente activas (no tengan fecha de finalización o hayan renunciado).

**Paso 5 — Contar puestos vacantes:** Un puesto está vacío cuando (filas devueltas = 0) O (la suma de `parseFloat(row.FTE)` en las filas activas < 1.0). Ambas condiciones representan un puesto que necesita ser cubierto.

---

## Consulta de ejemplo

> "¿Cuántos puestos de profesor en Lincoln Primary School están vacantes?"

El agente hará lo siguiente:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar este flujo de trabajo.
2. Seguir los pasos anteriores.
3. Devolver la respuesta en lenguaje sencillo.

---

## Notas

- FTE es una cadena como `'1.00'` en la respuesta de la API — analícela a flotante antes de sumarla.
- Considere solo las filas de `institution_staff` que estén actualmente activas — típicamente, `staff_status_id` corresponde a un código de "Asignado" o "Actual".
- NO incluya al personal con fecha de finalización o que haya renunciado en la suma del FTE (ellos liberan el puesto).