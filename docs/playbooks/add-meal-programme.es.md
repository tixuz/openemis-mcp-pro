# Agregar un nuevo programa de alimentación a una institución

**Dominio:** Alimentación  
**Audiencia:** administrador, contador, nutricionista  
**ID del playbook:** `add-meal-programme`

## Descripción

Cree una nueva definición de programa de alimentación y asígnela a una institución. El flujo es de dos pasos: primero cree el registro global del programa (`meal-programmes`), luego registre la asignación de entrega a nivel de institución (`institution-meal-programmes`). No hay un plugin de flujo de trabajo involucrado — ambas escrituras son directas e inmediatas. Opcionalmente, vincule objetivos nutricionales e inscriba estudiantes específicos.

> ⚠️ **Trampa de alias FK:** `type` y `targeting` en `meal-programmes` son **valores de enumeración de cadenas**, no IDs enteros. Envíe la cadena (por ejemplo, `"Lunch"`, `"All Students"`) — no un ID de una búsqueda.  
> ⚠️ **Nombre FK en plural:** La FK a `meal-programmes` tanto en `institution-meal-programmes` como en `meal-nutritional-records` es **`meal_programmes_id`** (con la `s` final) — no `meal_programme_id`. Usar la forma singular causa fallos silenciosos o error 422.

---

## Preguntas para hacer primero

| Pregunta | Campo | Recurso | Notas |
|---|---|---|---|
| ¿Nombre del programa? | `name` | meal-programmes | Ej. "Programa de Almuerzo Gubernamental 2025" |
| ¿Código corto? | `code` | meal-programmes | Único, ej. `GLP-2025` |
| ¿Tipo de comida? (Desayuno / Almuerzo / Merienda / Cena) | `type` | meal-programmes | Valor de cadena — obtenga de `meal-programme-types` para ver opciones válidas |
| ¿Quién lo recibe? (Todos los estudiantes / Vulnerables / Grados primarios…) | `targeting` | meal-programmes | Valor de cadena — obtenga de `meal-target-types` |
| ¿Fecha de inicio? | `start_date` | meal-programmes | YYYY-MM-DD |
| ¿Fecha de fin? | `end_date` | meal-programmes | YYYY-MM-DD, debe ser ≥ start_date |
| ¿Período académico? | `academic_period_id` | meal-programmes | Resuelva mediante `academic-periods` |
| ¿Fecha de entrega en esta escuela? | `date_received` | institution-meal-programmes | YYYY-MM-DD — cuando el programa llega por primera vez a la escuela |
| ¿Cantidad esperada / número de estudiantes? | `quantity_received` | institution-meal-programmes | Entero |

---

## Recursos utilizados

| Recurso | Propósito |
|---|---|
| `academic-periods` | Búsqueda: ID del período académico activo |
| `meal-programme-types` | Búsqueda: valores de cadena válidos para el campo `type` |
| `meal-target-types` | Búsqueda: valores de cadena válidos para el campo `targeting` |
| `meal-implementers` | Búsqueda: nombre del implementador → ID (para `institution-meal-programmes`) |
| `meal-programmes` | Escritura: crear definición global del programa |
| `institution-meal-programmes` | Escritura: asignar / registrar entrega en la institución |
| `meal-nutritional-records` | Escritura (opcional): vincular objetivos nutricionales al programa |

---

## Pasos

| Paso | Acción | Recurso | Propósito |
|---|---|---|---|
| 1 | `openemis_get` | `academic-periods` | Resolver `academic_period_id` activo |
| 2 | `openemis_get` | `meal-programme-types` | Listar valores de cadena válidos para `type` |
| 3 | `openemis_get` | `meal-target-types` | Listar valores de cadena válidos para `targeting` |
| 4 | `openemis_create` | `meal-programmes` | Crear el registro global del programa |
| 5 | `openemis_create` | `institution-meal-programmes` | Asignar / registrar entrega en esta institución |
| 6 | `openemis_create` (opcional) | `meal-nutritional-records` | Vincular cada objetivo nutricional |

---

## Notas de los pasos

**Pasos 1–3 — Búsquedas**  
Obtenga el período académico filtrado por `current = 1` o selecciónelo por nombre. Para `meal-programme-types` y `meal-target-types`, liste todos los valores — muestre las cadenas `name` al usuario y use la cadena seleccionada en el cuerpo del POST (no el ID).

**Paso 4 — Crear Programa Global**

```json
POST /api/v5/meal-programmes
{
  "academic_period_id": 12,
  "name":               "Government Lunch Programme 2025",
  "code":               "GLP-2025",
  "type":               "Lunch",
  "targeting":          "All Students",
  "start_date":         "2025-01-06",
  "end_date":           "2025-11-28"
}
```

Respuesta: captura el `id` como `meal_programmes_id` para el siguiente paso.

**Paso 5 — Asignar a la Institución**

```json
POST /api/v5/institution-meal-programmes
{
  "academic_period_id":  12,
  "meal_programmes_id":  1047,
  "institution_id":      6,
  "date_received":       "2025-01-06",
  "quantity_received":   420
}
```

> ⚠️ Restricción única en `(institution_id, date_received, meal_programmes_id)` — entregas duplicadas para la misma escuela + fecha + programa devuelven 409 Conflicto.

**Paso 6 — Vincular Objetivos Nutricionales (Opcional)**

```json
POST /api/v5/meal-nutritional-records
{
  "meal_programmes_id":     1047,
  "nutritional_content_id": 10
}
```

Repita para cada componente nutricional. Resuelva `nutritional_content_id` mediante `GET /api/v5/meal-nutritions`.

---

## Errores comunes clave

- **`type` y `targeting` son valores de cadena**, no IDs enteros — use la cadena de nombre de `meal-programme-types` / `meal-target-types`, no el `id` de la tabla de búsqueda.
- **`meal_programmes_id` con la `s` final** — el nombre del campo FK en `institution-meal-programmes` y `meal-nutritional-records`. Usar `meal_programme_id` (sin la `s`) falla silenciosamente o devuelve 422.
- **`nutritional_content_id`** (no `meal_nutrition_id` o `nutrition_id`) — trampa FK confirmada desde el playbook de lectura, verificada en la superficie de escritura.
- **`meal-implementers` tiene campos FieldOption** (`visible`, `order`, `default`) — inclúyalos en PUT para evitar restablecimiento a nulo.
- **Sin plugin de flujo de trabajo** — las escrituras de alimentación son directas y no requieren aprobación o pasos de flujo de trabajo.
- **409 en entrega duplicada** — la restricción única es `(institution_id, date_received, meal_programmes_id)`, no basada en período.

---

## Ejemplo de consulta

> *"Agregar un programa gubernamental de almuerzo para todos los estudiantes en Avory Primary, comenzando en enero de 2025, código GLP-2025."*

1. `openemis_get { resource: "academic-periods", params: { current: 1 } }` → id: 12
2. `openemis_get { resource: "meal-programme-types" }` → "Breakfast", "Lunch", "Snack"
3. `openemis_get { resource: "meal-target-types" }` → "All Students", "Vulnerable", "Primary"
4. `openemis_create { resource: "meal-programmes", body: { academic_period_id: 12, name: "Government Lunch Programme 2025", code: "GLP-2025", type: "Lunch", targeting: "All Students", start_date: "2025-01-06", end_date: "2025-11-28" } }` → id: 1047
5. `openemis_create { resource: "institution-meal-programmes", body: { academic_period_id: 12, meal_programmes_id: 1047, institution_id: 6, date_received: "2025-01-06", quantity_received: 420 } }`