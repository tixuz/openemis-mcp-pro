# Agregar Equipos o Activos a una Institución

**Dominio:** Infraestructura  
**Audiencia:** administrador, contador, instalaciones  
**ID del Playbook:** `add-institution-asset`

## Descripción

Registre equipos o activos recién adquiridos en una institución — computadoras, escritorios, proyectores, muebles o cualquier artículo de inventario físico. Una fila = un artículo físico; para agregar múltiples unidades idénticas, publique un registro por artículo con `code` y `serial_number` distintos. `purchase_order` y `cost` deben incluirse en cada escritura (están presentes en todos los ejemplos documentados — trátelos como obligatorios incluso si no son formalmente anulables).

---

## Preguntas que Hacer Primero

Antes de escribir nada, el agente debe recopilar:

| Pregunta | Campo | Notas |
|---|---|---|
| ¿Qué tipo de activo? (ej. laptop, silla, proyector) | `description` | Texto libre — sea descriptivo |
| ¿Cuántas unidades? | (conteo de bucle) | Un POST por unidad |
| ¿Cuál es el código del activo / etiqueta de inventario? | `code` | Debe ser único en todo el sistema, ej. `AST-2025-001` |
| ¿Número(s) de serie? | `serial_number` | Uno por unidad; debe ser único |
| ¿Marca / fabricante? | `asset_make_id` | Búsqueda vía `asset-makes`; omita si se desconoce |
| ¿Modelo? | `asset_model_id` | Búsqueda vía `asset-models`; omita si se desconoce |
| ¿Número de orden de compra? | `purchase_order` | Referencia de OC, ej. `PO/2025/045` |
| ¿Costo unitario? | `cost` | Numérico, ej. `1250.00` |

---

## Recursos Utilizados

| Recurso | Propósito |
|---|---|
| `asset-makes` | Búsqueda: lista de fabricantes (Dell, HP, etc.) |
| `asset-models` | Búsqueda: lista de modelos (opcional) |
| `institution-assets` | Escritura: crear un registro por unidad física |

---

## Pasos

| Paso | Acción | Recurso | Propósito |
|---|---|---|---|
| 1 | `openemis_get` | `asset-makes` | Resolver nombre de marca → `asset_make_id` (omitir si la marca es desconocida) |
| 2 | `openemis_get` | `asset-models` | Resolver nombre de modelo → `asset_model_id` (omitir si el modelo es desconocido) |
| 3 | `openemis_create` × N | `institution-assets` | Publicar un registro por unidad física |

---

## Notas de los Pasos

**Pasos 1–2 — Búsquedas (Opcionales)**  
Solo ejecute si el usuario proporciona una marca o modelo. Filtre por nombre: `GET /api/v5/asset-makes?name=Dell`. Si no hay coincidencia, proceda sin la FK — ambos campos son opcionales. Un `asset_make_id` inválido será rechazado con 422, así que solo envíelo cuando tenga un ID válido.

**Paso 3 — Crear Registros de Activos**

Cuerpo POST por unidad:
```json
{
  "code":           "AST-2025-001",
  "description":    "Dell OptiPlex 3090 Desktop Computer",
  "serial_number":  "SN-DELL-9988776655",
  "purchase_order": "PO/2025/045",
  "cost":           1250.00,
  "asset_make_id":  12,
  "asset_model_id": 45
}
```

Para N unidades, repita con `code` único (ej. `AST-2025-001`, `AST-2025-002`) y `serial_number` único.

> ⚠️ **PUT requiere la carga útil completa.** Si actualiza un activo existente, obtenga primero el registro actual, combine los cambios y luego haga PUT del objeto completo. Omitir cualquier campo lo establece en nulo.

---

## Errores Comunes Clave

- **Una fila = un artículo físico.** No hay campo `quantity`. "Compramos 5 computadoras" = 5 llamadas POST.
- **`code` debe ser único en todo el sistema.** Una colisión devuelve 409. Sugiera un esquema como `{CÓDIGO_INSTITUCIÓN}-{AÑO}-{SECUENCIA}` si el usuario no tiene una convención existente.
- **`purchase_order` y `cost` están presentes en cada ejemplo documentado** — inclúyalos en cada escritura.
- **`asset_make_id` y `asset_model_id` son opcionales** pero deben ser IDs válidos si se envían — un valor inválido causa un 422, no una omisión silenciosa.
- **No hay `academic_period_id`** en este recurso — no lo envíe.

---

## Ejemplo de Consulta

> *"Compramos 2 laptops Dell para la biblioteca — números de serie SN-001 y SN-002, costo 1,100 cada una, PO/2025/071."*

1. `openemis_get { resource: "asset-makes", params: { name: "Dell" } }` → id: 12
2. `openemis_create { resource: "institution-assets", body: { code: "LIB-2025-001", description: "Dell Laptop", serial_number: "SN-001", purchase_order: "PO/2025/071", cost: 1100.00, asset_make_id: 12 } }`
3. `openemis_create { resource: "institution-assets", body: { code: "LIB-2025-002", description: "Dell Laptop", serial_number: "SN-002", purchase_order: "PO/2025/071", cost: 1100.00, asset_make_id: 12 } }`