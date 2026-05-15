---
title: Ver el resumen de riesgos institucionales en OpenEMIS
description: Este playbook de OpenEMIS explica cómo recuperar el resumen de riesgos de estudiantes a nivel de institución y la configuración de reglas de alerta del sistema de gestión escolar.
keywords:
  - OpenEMIS
  - riesgos de estudiantes
  - sistema de gestión escolar
  - gestión educativa
---

# Ver el Resumen de Riesgos Institucionales en OpenEMIS y Reglas de Alerta

**Dominio:** Institución  
**Audiencia:** administrador, ministerio  
**ID del Playbook:** `view-institution-risks`

## Descripción

Vea qué riesgos están configurados para una institución, las reglas de alerta que se activan cuando se cruzan los umbrales y los registros recientes de entrega de alertas. `institution-risks` tiene una PK compuesta (`risk_id` + `institution_id`) — no tiene un campo entero `id`. Las alertas se vinculan a AlertRules mediante un **enlace de nombre de cadena↔característica**, no una FK entera.

---

## Recursos Utilizados

| Recurso | Propósito |
|---|---|
| `institution-risks` | Qué tipos de riesgo están configurados para esta institución (PK compuesta) |
| `risks` | Definiciones maestras de riesgos con nombres y alcance de período académico |
| `risk-criterias` | Valores de umbral y pesos para cada criterio |
| `alerts` | Definiciones de alertas — qué eventos activan notificaciones |
| `alert-rules` | Reglas de notificación — habilitado/deshabilitado, método, umbral, roles de destinatario |
| `alert-logs` | Historial reciente de entrega de alertas con estado de éxito/fallo |

---

## Pasos

| Paso | Acción | Recurso | Propósito |
|---|---|---|---|
| 1 | `openemis_get` | `institution-risks` | Listar los tipos de riesgo configurados para esta institución |
| 2 | `openemis_get` | `risks` + `risk-criterias` | Resolver nombres de riesgo y criterios de umbral |
| 3 | `openemis_get` | `alerts` | Listar definiciones de alertas |
| 4 | `openemis_get` | `alert-rules` | Ver reglas de notificación y estado de habilitación |
| 5 | `openemis_get` | `alert-logs` | Verificar historial reciente de entrega de alertas |

---

## Notas de los Pasos

**Paso 1 — Configuración de Riesgos de la Institución**  
Filtre por `institution_id`.

> ⚠️ **PK compuesta:** `institution-risks` **no tiene una columna entera `id`**. La clave primaria es (`risk_id` + `institution_id`). Nunca consulte con un parámetro `id=` solo — devolverá resultados vacíos o incorrectos.

`academic_period_id` no se almacena en esta tabla — el alcance del período se realiza a través de la tabla maestra `risks`. Resuelva `risk_id` en el paso 2.

**Paso 2 — Definiciones de Riesgo y Criterios**  
Filtre `risks` por `academic_period_id` — **obligatorio, no puede estar vacío**. Luego obtenga `risk-criterias` filtrado por `risk_id` para obtener `risk_value` (rango 1–99, validado) y `threshold`. El campo `threshold` utiliza un validador personalizado `checkCriteriaThresholdRange()` — texto o numérico dependiendo del tipo de riesgo.

**Paso 3 — Definiciones de Alerta**  
No hay filtro `institution_id` o `academic_period_id` en `alerts`.

> ⚠️ **Unión no estándar:** `alerts.name` ↔ `alert_rules.feature` es una **coincidencia de cadena**, no una FK entera. No intente `?alert_rule_id=...` en el endpoint de alertas — ese parámetro no existe. Obtenga `alert-rules` por separado y únalos haciendo coincidir `alerts.name` con `alert_rules.feature`.

**Paso 4 — Reglas de Alerta**  
No hay filtro `institution_id` o `academic_period_id`. Campos clave:
- `enabled` (0/1) — si esta regla está activa
- `method` — método de notificación (ej. "Email")
- `feature` — clave de unión de regreso a `alerts.name`
- `threshold` — el valor de condición que activa la alerta
- `security_roles` — poblado a través de la tabla de unión `alerts-roles` (PK compuesta: `alert_rule_id` + `security_role_id`, sin `id` entero)

**Paso 5 — Registros de Entrega de Alertas**  
No hay filtro `institution_id` o `academic_period_id`. Filtre por `feature` para limitar a un tipo de alerta específico, o `status=-1` para encontrar entregas fallidas. Valores de estado: `0` = Pendiente, `1` = Éxito, `-1` = Fallido. El campo `checksum` se utiliza para deduplicación.

---

## Advertencias Clave

- **PK compuesta de `institution-risks`: (`risk_id` + `institution_id`)** — sin `id` entero. Nunca use `id=` en este recurso.
- **`alerts-roles` también tiene PK compuesta** (`alert_rule_id` + `security_role_id`) — sin `id` entero.
- **La unión alerts↔alert-rules es por cadena:** `alerts.name` = `alert_rules.feature`. Esta es la relación menos obvia en este dominio.
- **`risks.academic_period_id` es obligatorio** — el recurso valida que no puede estar vacío.
- **Valores de `alert-logs.status`:** 0 = Pendiente, 1 = Éxito, −1 = Fallido.

---

## Consulta de Ejemplo

> *"¿Para qué riesgos está configurada la Escuela Primaria Avory, y se han activado alertas recientemente?"*

1. `openemis_get { resource: "institution-risks", params: { institution_id: 6 } }` → risk_id: 1, risk_id: 2
2. `openemis_get { resource: "risks", params: { academic_period_id: 1 } }` → "Riesgo de Asistencia", "Riesgo de Rendimiento Académico"
3. `openemis_get { resource: "alerts" }` → 3 definiciones de alerta (nombres: "LowAttendance", "HighAbsence", "FailingGrade")
4. `openemis_get { resource: "alert-rules", params: { } }` → regla "LowAttendance": enabled=1, method=Email, threshold=75
5. `openemis_get { resource: "alert-logs", params: { feature: "LowAttendance" } }` → 4 correos enviados (status=1), 1 fallido (status=-1) la semana pasada