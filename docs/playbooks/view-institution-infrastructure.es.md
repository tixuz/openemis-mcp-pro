---
title: Ver la infraestructura de la institución en OpenEMIS
description: Este playbook de OpenEMIS explica cómo recuperar datos de terrenos, edificios, servicios públicos y WASH de una institución del sistema de gestión escolar.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
---

# Ver la Infraestructura de la Institución en OpenEMIS (Terrenos, Edificios, Servicios Públicos, WASH)

**Dominio:** Institución  
**Audiencia:** admin, instalaciones  
**ID del Playbook:** `view-institution-infrastructure`

## Descripción

Ver la infraestructura física de una institución: parcelas de terreno, edificios por terreno, servicios públicos (electricidad) y registros WASH (agua y saneamiento). **Los terrenos y edificios NO están delimitados por `academic_period_id`** — ese campo fue eliminado en POCOR-8037. Los servicios públicos y WASH SÍ están delimitados por `academic_period_id`.

---

## Recursos Utilizados

| Recurso | Propósito |
|---|---|
| `institution-lands` | Parcelas de terreno registradas a la institución (sin alcance de período académico) |
| `institution-buildings` | Edificios anidados bajo cada parcela de terreno (sin alcance de período académico) |
| `infrastructure-statuses` | Búsqueda global: códigos de estado IN_USE, END_OF_USAGE, CHANGE_IN_TYPE |
| `infrastructure-conditions` | Búsqueda global: etiquetas de condición (Bueno, Regular, Deficiente, etc.) |
| `land-types` | Búsqueda global: etiquetas de tipo de terreno |
| `building-types` | Búsqueda global: etiquetas de tipo de edificio |
| `infrastructure-utility-electricities` | Registros de servicio público de electricidad (delimitados por institución + período académico) |
| `infrastructure-wash-waters` | Registros de suministro y calidad de agua (delimitados por institución + período académico) |
| `infrastructure-wash-sanitations` | Conteos de instalaciones de saneamiento por género y funcionalidad |

---

## Pasos

| Paso | Acción | Recurso | Propósito |
|---|---|---|---|
| 1 | `openemis_get` | `institution-lands` | Listar parcelas de terreno activas |
| 2 | `openemis_get` | `institution-buildings` | Listar edificios por parcela de terreno |
| 3 | `openemis_get` | `infrastructure-statuses` + tablas de referencia | Resolver IDs de condición, estado, tipo (en paralelo) |
| 4 | `openemis_get` | `infrastructure-utility-electricities` | Registros de servicio público de electricidad |
| 5 | `openemis_get` | `infrastructure-wash-waters` | Registros WASH de agua |
| 6 | `openemis_get` | `infrastructure-wash-sanitations` | Conteos WASH de saneamiento |

---

## Notas de los Pasos

**Paso 1 — Parcelas de Terreno Activas**  
Filtrar por `institution_id`. **NO** pase `academic_period_id` — fue eliminado de este recurso en POCOR-8037 y no hará nada o causará errores silenciosamente. Para obtener solo parcelas activas, también filtre `land_status_id` que coincida con el código `IN_USE` de `infrastructure-statuses`. El `land_type_id` y `infrastructure_condition_id` de cada registro se resuelven en el paso 3.

**Paso 2 — Edificios por Terreno**  
Filtrar por `institution_id` (todos los edificios) o `institution_land_id` (edificios de un terreno). Misma regla: **sin `academic_period_id`**. Filtrar por `building_status_id` para registros `IN_USE`. El `building_type_id` y `infrastructure_condition_id` de cada edificio se resuelven en el paso 3. El área del edificio debe ser menor que el área del terreno padre (aplicado por la API).

**Paso 3 — Resolver Tablas de Referencia** *(se puede ejecutar en paralelo)*  
Obtenga `infrastructure-statuses`, `infrastructure-conditions`, `land-types` y `building-types` simultáneamente — todas son listas de referencia globales sin filtro de `institution_id` o `academic_period_id`.

> ⚠️ **La nomenclatura de FK de estado es específica del nivel:** `land_status_id` para terrenos, `building_status_id` para edificios — ambos apuntan a la misma tabla `infrastructure_statuses`. No mezcle estos nombres de FK.

**Paso 4 — Servicio Público de Electricidad**  
Filtrar por `institution_id` Y `academic_period_id` (ambos requeridos — a diferencia de terrenos/edificios, los servicios públicos SÍ están delimitados por período). También filtrar `is_current=1` para excluir registros eliminados lógicamente (bandera agregada en POCOR-9475). Resuelva `utility_electricity_type_id` mediante `/api/v5/utility-electricity-types`.

**Paso 5 — WASH Agua**  
Filtrar por `institution_id` Y `academic_period_id`. Todas las columnas FK siguen el patrón `infrastructure_wash_water_*_id` (tipo, funcionalidad, proximidad, cantidad, calidad, accesibilidad). Resuelva cada una mediante el endpoint de referencia correspondiente `/api/v5/infrastructure-wash-water-*`.

**Paso 6 — WASH Saneamiento**  
Filtrar por `institution_id` Y `academic_period_id`. Campos de conteo: `infrastructure_wash_sanitation_{gender}_{status}` — ej. `male_functional`, `female_nonfunctional`, `mixed_functional`. Las columnas `total_male`, `total_female`, `total_mixed` son **calculadas automáticamente por el backend** en `beforeSave` — NO intente escribir en ellas. Los pasos 4–6 se pueden obtener en paralelo una vez que se conozcan `institution_id` y `academic_period_id`.

---

## Advertencias Clave

- **`institution-lands` e `institution-buildings` NO tienen filtro `academic_period_id`** — eliminado en POCOR-8037. Nunca lo pase para estos dos recursos.
- **La FK de estado varía por nivel:** `land_status_id` para terrenos, `building_status_id` para edificios — misma tabla `infrastructure_statuses`, diferentes nombres de columna.
- **`infrastructure_ownership_id`** es el nombre correcto de la FK tanto en terrenos como en edificios (no `ownership_id`).
- **Los servicios públicos y WASH requieren `academic_period_id`** — a diferencia de la infraestructura principal.
- **Los totales de saneamiento son de solo lectura** — son calculados automáticamente por el backend.

---

## Ejemplo de Consulta

> *"Muéstreme la infraestructura física de la Escuela Primaria Avory — terrenos, edificios, electricidad y agua."*

1. `openemis_get { resource: "institution-lands", params: { institution_id: 6 } }` → 2 parcelas de terreno (land_status_id → IN_USE)
2. `openemis_get { resource: "institution-buildings", params: { institution_id: 6 } }` → 4 edificios
3. Obtenga `infrastructure-statuses`, `infrastructure-conditions`, `land-types`, `building-types` en paralelo → resuelva todos los IDs
4. `openemis_get { resource: "infrastructure-utility-electricities", params: { institution_id: 6, academic_period_id: 1, is_current: 1 } }` → electricidad de red, buena condición
5. `openemis_get { resource: "infrastructure-wash-waters", params: { institution_id: 6, academic_period_id: 1 } }` → agua entubada, funcional
6. `openemis_get { resource: "infrastructure-wash-sanitations", params: { institution_id: 6, academic_period_id: 1 } }` → 4 inodoros masculinos, 4 femeninos funcionales