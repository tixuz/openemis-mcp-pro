---
title: Resumen de la institución en OpenEMIS — estudiantes, personal y puestos vacantes
description: Este playbook de OpenEMIS explica cómo obtener un resumen rápido de una institución incluyendo el conteo de estudiantes, personal y puestos vacantes del sistema de gestión escolar.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
---

# Resumen de la institución en OpenEMIS — Conteos de estudiantes, personal y puestos vacantes

**Dominio:** Institución · **Audiencia:** administrador, padre

La consulta clásica "cuénteme sobre esta escuela". Una búsqueda única de la institución seguida de tres llamadas de conteo que utilizan los metadatos de paginación para obtener los totales sin descargar cada registro.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `institutions` | Resuelve el nombre o código de la institución a un id de registro y proporciona la información básica del perfil de la escuela. |
| `institution-students` | Proporciona el conteo total de estudiantes actualmente matriculados leyendo los metadatos de paginación (last_page) en lugar de descargar todos los registros. |
| `institution-staff-position-profiles` | Se utiliza para contar el personal activo en la institución mediante el mismo enfoque de paginación. |
| `institution-positions` | Proporciona el conteo de puestos vacantes en la institución. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Resolver la institución | `openemis_get` | Buscar la institución por nombre para obtener su id y perfil básico. |
| 2 | Contar estudiantes actuales | `openemis_get` | Obtener una fila de estudiante para leer el valor de last_page, que equivale a la matrícula actual total. |
| 3 | Contar personal activo | `openemis_get` | Obtener una fila de personal para leer el valor de last_page, que equivale al conteo total de personal activo. |
| 4 | Contar puestos vacantes | `openemis_get` | Obtener una fila de puesto filtrada por estado vacante para leer el conteo de last_page. |

### Notas de los pasos

**Paso 1 — Resolver la institución:** Llame a `institutions` filtrado por `name` (por ejemplo, "Avory Primary"), solicitando solo los campos `id`, `name` y `code`. Tome nota del `institution_id` — es la clave de filtro para todas las llamadas posteriores.

**Paso 2 — Contar estudiantes actuales:** Llame a `institution-students` con `institution_id`, `student_status_id=1` y `limit=1`. El campo `last_page` de la respuesta (o el total de paginación equivalente) es igual al número total de estudiantes actualmente matriculados. No necesita paginar a través de todos los registros.

**Paso 3 — Contar personal activo:** Llame a `institution-staff` con `institution_id`, `status_id=1` y `limit=1`. Lea `last_page` para obtener el conteo total de personal activo.

**Paso 4 — Contar puestos vacantes:** Llame a `institution-positions` con `institution_id`, `status='vacant'` y `limit=1`. Lea `last_page` para obtener el conteo total de puestos vacantes.

---

## Ejemplo de consulta

> "Déme un resumen de la Escuela Primaria Avory — ¿cuántos estudiantes, personal y puestos vacantes?"

El agente hará:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar este playbook
2. Seguir los pasos anteriores
3. Devolver la respuesta en lenguaje sencillo