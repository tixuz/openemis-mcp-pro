---
title: Ver los programas de alimentación institucionales en OpenEMIS
description: Este playbook de OpenEMIS explica cómo recuperar información sobre programas de alimentación y participación de estudiantes en una institución del sistema de gestión escolar.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
---

# Ver Programas de Alimentación Institucionales en OpenEMIS y Participación Estudiantil

**Dominio:** Institución  
**Audiencia:** administrador, nutricionista, padre/madre  
**ID del Playbook:** `view-institution-meals`

## Descripción

Vea los programas de alimentación que una institución ejecuta, su contenido nutricional y qué estudiantes están inscritos. Delimitado por `institution_id` y `academic_period_id`. Advertencia clave: en `meal-nutritional-records` la FK a la tabla `meal_nutritions` es `nutritional_content_id` — **no** `meal_nutrition_id`.

---

## Recursos Utilizados

| Recurso | Propósito |
|---|---|
| `institution-meal-programmes` | Programas de alimentación que la institución ejecuta en el período académico actual |
| `meal-programme-types` | Tabla de referencia global: etiquetas de tipos de programa |
| `meal-implementers` | Tabla de referencia global: organizaciones implementadoras |
| `meal-nutritional-records` | Tabla de unión que vincula programas con contenido nutricional |
| `meal-benefits` | Tabla de referencia global: etiquetas de tipos de beneficio |
| `institution-meal-students` | Registros de participación estudiantil en comidas por día |

---

## Pasos

| Paso | Acción | Recurso | Propósito |
|---|---|---|---|
| 1 | `openemis_get` | `institution-meal-programmes` | Listar programas de alimentación activos para esta institución/período |
| 2 | `openemis_get` | `meal-programme-types` + tablas de referencia | Resolver IDs de tipo, implementador, beneficio (en paralelo) |
| 3 | `openemis_get` | `meal-nutritional-records` | Obtener contenido nutricional por programa |
| 4 | `openemis_get` | `institution-meal-students` | Listar registros de participación estudiantil |

---

## Notas de los Pasos

**Paso 1 — Programas de Alimentación Institucionales**  
Filtre por `institution_id` Y `academic_period_id`. La tabla subyacente es `meal_institution_programmes` (no `institution_meal_programmes`). Cada registro se vincula a un `meal_programme_id` — capture este valor para el paso 3.

> ⚠️ **Alias de FK no estándar:** La asociación para el tipo de programa, grupo objetivo e implementador puede aparecer en las respuestas de la API como `type`, `targeting` e `implementer` en lugar de los sufijos habituales `_type_id`. Inspeccione las claves reales de la respuesta antes de construir filtros adicionales.

**Paso 2 — Resolver Tablas de Referencia** *(ejecutar en paralelo)*  
Obtenga `meal-programme-types`, `meal-implementers` y `meal-benefits` simultáneamente — todas son listas de referencia globales.  
> Nota: `meal-implementers` **no** utiliza el comportamiento FieldOption. Solo tiene `id` y `name` — no tiene campos `visible`, `order` o `default`.

**Paso 3 — Registros Nutricionales**  
Filtre por `meal_programme_id` (obtenido en el paso 1).

> ⚠️ **Trampa crítica de FK:** La FK a la tabla `meal_nutritions` en este recurso es `nutritional_content_id` — **NO** `meal_nutrition_id`. Usar el nombre incorrecto devolverá resultados vacíos en silencio. Resuelva `nutritional_content_id` mediante `/api/v5/meal-nutritions` para obtener el nombre del nutriente (ej. Proteína, Carbohidratos, Calorías, Grasa).

`meal-nutritional-records` actúa como una tabla de unión (belongsToMany entre programas y nutrientes). Puede tener una PK compuesta (`meal_programme_id` + `nutritional_content_id`) sin un `id` entero independiente — no lo consulte por un id numérico simple.

**Paso 4 — Participación Estudiantil**  
El recurso de la API `institution-meal-students` se mapea a la tabla `student_meal_marked_records` — estos son registros de asistencia a comidas **por día**, no una lista de inscripción estática. Filtre por `institution_id`, `academic_period_id` y opcionalmente `institution_class_id` o `meal_programme_id`. El campo `date` registra la fecha específica de participación. `meal_benefit_id` indica el tipo de beneficio — resuélvalo mediante `meal-benefits` del paso 2.

---

## Advertencias Clave

- **`nutritional_content_id`** es la FK a `meal_nutritions` en `meal-nutritional-records` — no `meal_nutrition_id`. Esta es la trampa más común de fallo silencioso.
- **`institution-meal-students` contiene datos por día**, no una lista de inscripción. Filtre por `date` para obtener el conteo de participación de un día específico.
- **`meal-implementers` no tiene campos FieldOption** (los campos `visible`, `order`, `default` no existen en este recurso).
- **Ambigüedad de alias de FK** en `institution-meal-programmes`: las asociaciones de tipo de programa, objetivo e implementador pueden usar claves de alias cortas (`type`, `targeting`, `implementer`) en lugar de sufijos `_type_id` en las respuestas de la API.
- Tanto `institution_id` como `academic_period_id` son obligatorios para `institution-meal-programmes` e `institution-meal-students`.

---

## Ejemplo de Consulta

> *"¿Qué programas de alimentación ejecuta la Escuela Primaria Avory este año y qué contenido nutricional proporcionan?"*

1. `openemis_get { resource: "institution-meal-programmes", params: { institution_id: 6, academic_period_id: 1 } }` → 2 programas (alimentación escolar, suplementario)
2. Obtenga `meal-programme-types`, `meal-implementers`, `meal-benefits` en paralelo → resuelva etiquetas
3. `openemis_get { resource: "meal-nutritional-records", params: { meal_programme_id: 3 } }` → proteína 15g, carbohidratos 45g, calorías 280kcal (usando nutritional_content_id para resolver nombres)
4. `openemis_get { resource: "institution-meal-students", params: { institution_id: 6, academic_period_id: 1, meal_programme_id: 3 } }` → 312 registros de estudiante-día este período