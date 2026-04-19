# Ver el Perfil de Riesgo y Casos de Bienestar de un Estudiante

**Dominio:** Estudiante  
**Audiencia:** administrador, consejero, profesor  
**ID del Playbook:** `view-student-risks`

## Descripción

Vea la puntuación de riesgo calculada de un estudiante, los criterios de riesgo individuales que contribuyeron a ella y cualquier caso de bienestar o protección abierto para ese estudiante. `institution-risks` tiene una PK compuesta — no tiene un `id` entero. `institution-cases` está controlado por flujo de trabajo — GET siempre es seguro, pero las escrituras deben realizarse a través de la aplicación OpenEMIS.

---

## Recursos Utilizados

| Recurso | Propósito |
|---|---|
| `institution-student-risks` | Puntuación de riesgo general del estudiante para el período académico |
| `risks` | Definiciones maestras de riesgos — nombres y lo que mide cada riesgo |
| `risk-criterias` | Umbral y peso para cada criterio dentro de un riesgo |
| `student-risks-criterias` | Puntuaciones por criterio para este registro de riesgo del estudiante |
| `institution-cases` | Casos de bienestar/protección abiertos para este estudiante |
| `case-types` | Búsqueda global: etiquetas de tipo de caso |
| `case-priorities` | Búsqueda global: etiquetas de prioridad |

---

## Pasos

| Paso | Acción | Recurso | Propósito |
|---|---|---|---|
| 1 | `openemis_get` | `institution-student-risks` | Obtener la puntuación total de riesgo del estudiante |
| 2 | `openemis_get` | `risks` | Resolver nombres y definiciones de riesgos |
| 3 | `openemis_get` | `student-risks-criterias` | Desglosar la puntuación por criterio |
| 4 | `openemis_get` | `institution-cases` | Listar casos de bienestar abiertos para este estudiante |

---

## Notas de los Pasos

**Paso 1 — Puntuación de Riesgo del Estudiante**  
Filtre por `institution_id` Y `academic_period_id` Y `student_id` (`security_user_id` del estudiante). Tanto `institution_id` como `academic_period_id` son obligatorios — omitir cualquiera devuelve resultados globales sin ámbito, de todas las instituciones y períodos. El campo `total_risk` es el agregado calculado. Capture el campo `id` para el paso 3.

**Paso 2 — Definiciones de Riesgo**  
Filtre por `academic_period_id` — **obligatorio, no puede estar vacío** (validado a nivel de API). La tabla `risks` es la definición maestra de lo que mide cada tipo de riesgo para un período dado. Resuelva aquí el `risk_id` del paso 1. Obtenga `risk-criterias` filtrado por `risk_id` para obtener el `risk_value` (rango 1–99) y el `threshold` para cada criterio.

**Paso 3 — Desglose por Criterio**  
Filtre por `institution_student_risk_id` (el `id` del paso 1). Esta es una tabla de unión con PK compuesta (`institution_student_risk_id` + `risk_criteria_id`) — **NO tiene un `id` entero independiente**. NO consulte con un parámetro simple `id=`. El campo `value` contiene la puntuación evaluada para cada criterio. Resuelva `risk_criteria_id` a través de `risk-criterias` para mostrar etiquetas y umbrales.

**Paso 4 — Casos de Bienestar**  
Filtre por `institution_id`. `institution-cases` está **controlado por flujo de trabajo** — `status_id` hace referencia a `workflow_steps`, no es un enum simple. GET siempre es seguro.

> ⚠️ Para crear o actualizar casos, use la aplicación OpenEMIS — las escrituras directas por API omiten la cadena de aprobación y auditoría.

`case_number` se genera automáticamente como `{institution_code}-{date}-{id}`. Resuelva `case_type_id` a través de `case-types` y `case_priority_id` a través de `case-priorities` — ambos son búsquedas globales de FieldOption sin filtro de `institution_id` o `academic_period_id`.

---

## Advertencias Clave

- **`institution-student-risks`** requiere tanto `institution_id` COMO `academic_period_id` — ambos son obligatorios.
- **`risks`** requiere `academic_period_id` como campo obligatorio.
- **`student-risks-criterias` es una tabla de unión con PK compuesta** — no tiene `id` entero. Filtre solo por `institution_student_risk_id`.
- **`institution-cases` está controlado por flujo de trabajo.** GET es seguro. Las escrituras deben realizarse a través de la aplicación.
- **Nombres de FK:** `case_priority_id` (no `priority_id`), `case_type_id` (no `type_id`).

---

## Consulta de Ejemplo

> *"¿Cuál es el nivel de riesgo de Ahmad este año y hay algún caso de bienestar abierto para él?"*

1. `openemis_get { resource: "institution-student-risks", params: { institution_id: 6, academic_period_id: 1, student_id: 102 } }` → total_risk: 72, id: 445
2. `openemis_get { resource: "risks", params: { academic_period_id: 1 } }` → "Riesgo de Asistencia", "Riesgo Académico"
3. `openemis_get { resource: "student-risks-criterias", params: { institution_student_risk_id: 445 } }` → criterio de ausencia: 85, criterio de calificaciones: 60
4. `openemis_get { resource: "institution-cases", params: { institution_id: 6 } }` → 1 caso abierto, Prioridad: Alta, Tipo: Bienestar