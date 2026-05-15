---
title: Registrar una reparación de infraestructura en OpenEMIS
description: Este playbook de OpenEMIS explica cómo registrar una reparación o restauración de infraestructura en una institución usando las herramientas de escritura del sistema de gestión escolar.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
---

# Registrar una Reparación o Restauración de Infraestructura en OpenEMIS

**Dominio:** Infraestructura  
**Audiencia:** administrador, contador, mantenimiento  
**ID de guía:** `record-infrastructure-repair`

## Descripción

Registre un proyecto de reparación, restauración o mantenimiento completado o en curso en una institución — sanitarios restaurados, techo reparado, aula repintada, bomba de agua reemplazada. El registro se guarda en `infrastructure-needs`, que rastrea el ciclo de vida completo: cuándo se identificó el problema, cuándo comenzó el trabajo y cuándo se completó. NO envíe el campo `code` — es generado automáticamente por el servidor de forma asíncrona (vuelva a obtener el registro después de la creación para recuperarlo).

---

## Preguntas para hacer primero

| Pregunta | Campo | Notas |
|---|---|---|
| ¿Qué se reparó / restauró? | `name` | Título breve, ej. "Bloque Sanitario A — 2 Sanitarios Restaurados" |
| Describa el trabajo realizado | `description` | Detalle: qué se reemplazó, contratista, alcance |
| ¿Cuándo se identificó por primera vez el problema? | `date_determined` | YYYY-MM-DD, obligatorio — no puede ser una fecha futura |
| ¿Cuándo comenzó el trabajo? | `date_started` | YYYY-MM-DD, opcional |
| ¿Cuándo se completó? | `date_completed` | YYYY-MM-DD, opcional (deje nulo si aún está en curso) |
| ¿Hay un informe o nombre de archivo de documento? | `file_name` | Cadena de referencia opcional, ej. `restoration_report.pdf` |

---

## Recursos utilizados

| Recurso | Propósito |
|---|---|
| `institution-buildings` | Lectura: encontrar el registro del edificio relevante para referencia (opcional) |
| `infrastructure-needs` | Escritura: crear la entrada del registro de reparación/restauración |

---

## Pasos

| Paso | Acción | Recurso | Propósito |
|---|---|---|---|
| 1 | `openemis_get` | `institution-buildings` | Encontrar el ID del edificio para referencia narrativa (opcional) |
| 2 | `openemis_create` | `infrastructure-needs` | Registrar la reparación con todos los campos de fecha |

---

## Notas de los pasos

**Paso 1 — Búsqueda de edificio (Opcional)**  
Filtre por `institution_id` para listar los edificios. Este paso es solo para contexto narrativo — `infrastructure-needs` no tiene una FK directa a `institution-buildings` en el conjunto de campos documentado. Use el nombre del edificio en los campos `name` y `description` para que el registro sea rastreable.

**Paso 2 — Crear registro de reparación**

Cuerpo POST:
```json
{
  "name":            "Bloque Sanitario A — 2 Sanitarios Restaurados",
  "description":     "Se reemplazaron cisternas y accesorios dañados en 2 sanitarios femeninos. Contratista: City Plumbers Ltd. Inspección final aprobada.",
  "date_determined": "2025-04-01",
  "date_started":    "2025-04-10",
  "date_completed":  "2025-04-15",
  "file_name":       "toilet_restoration_final_report.pdf"
}
```

Para una **reparación en curso** (trabajo aún no completado), omita `date_completed`:
```json
{
  "name":            "Reparación de techo — Bloque Principal",
  "description":     "Techo con goteras sobre aulas 3–5. Reparación de emergencia en progreso.",
  "date_determined": "2025-04-18",
  "date_started":    "2025-04-19"
}
```

Para **cerrar** un registro en progreso, use PUT con el payload completo:
```json
PUT /institution-needs/{id}
{
  "name":            "Reparación de techo — Bloque Principal",
  "description":     "...(texto original)...",
  "date_determined": "2025-04-18",
  "date_started":    "2025-04-19",
  "date_completed":  "2025-04-25",
  "file_name":       "roof_inspection_final.pdf"
}
```

> ⚠️ **Nunca envíe `code` en el cuerpo POST.** El servidor lo genera asíncronamente. La respuesta POST puede devolver `code: null` — vuelva a obtenerlo con GET para recuperar el código generado.

> ⚠️ **PUT requiere el payload completo.** Siempre obtenga el registro actual, combine los nuevos campos y luego haga PUT del objeto completo. Omitir un campo lo establece como nulo.

---

## Errores comunes clave

- **`date_determined` es obligatorio y no debe ser una fecha futura** — una fecha futura causa error 422.
- **`code` es generado automáticamente** — no lo envíe en POST. Vuelva a obtenerlo después de la creación si necesita mostrarlo.
- **No hay actualización de FK de condición en edificios documentada.** La tabla de búsqueda infrastructure-conditions existe, pero el endpoint `institution-buildings` no expone `infrastructure_condition_id` en su superficie de escritura documentada. No intente hacer PUT de actualizaciones de condición en edificios — el campo será ignorado silenciosamente o causará error 422.
- **No hay `academic_period_id`** en este recurso.

---

## Ejemplo de consulta

> *"Restauramos 2 sanitarios en el bloque de niñas. El trabajo comenzó el 10 de abril, finalizó el 15 de abril."*

1. `openemis_get { resource: "institution-buildings", params: { institution_id: 6 } }` → "Bloque Sanitario de Niñas" (id: 14)
2. `openemis_create { resource: "infrastructure-needs", body: { name: "Bloque Sanitario de Niñas — 2 Sanitarios Restaurados", description: "Se reemplazaron cisternas y accesorios de descarga en 2 sanitarios femeninos. Bloque identificado como Edificio 14.", date_determined: "2025-04-01", date_started: "2025-04-10", date_completed: "2025-04-15" } }`