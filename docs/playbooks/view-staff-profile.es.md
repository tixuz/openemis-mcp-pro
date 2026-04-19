# Ver el perfil completo de un miembro del personal

**Dominio:** Personal  
**Audiencia:** administrador, recursos humanos  
**ID del playbook:** `view-staff-profile`

## Descripción

Vea los perfiles de posición actuales e históricos, el historial de licencias, las posiciones históricas y los datos de contacto directo de un miembro del personal. Combina cuatro recursos utilizando las claves de filtro correctas para cada uno — existen dos campos de identidad del personal distintos (`staff_id` vs `institution_staff_id`) que no deben confundirse.

---

## Recursos utilizados

| Recurso | Propósito |
|---|---|
| `institution-staff-position-profiles` | ETC, estado e historial de asignación de posición en la institución |
| `institution-staff-leave` | Registros de licencia (aprobados o pendientes) ordenados del más reciente primero |
| `historical-staff-positions` | Historial de títulos de posición archivados en instituciones anteriores |
| `user-contacts` | Números de teléfono y direcciones de correo electrónico (tabla global de usuarios) |

---

## Pasos

| Paso | Acción | Recurso | Propósito |
|---|---|---|---|
| 1 | `openemis_get` | `institution-staff-position-profiles` | Obtener perfiles de posición actuales y pasados |
| 2 | `openemis_get` | `institution-staff-leave` | Obtener historial de licencias |
| 3 | `openemis_get` | `historical-staff-positions` | Obtener títulos de posición históricos |
| 4 | `openemis_get` | `user-contacts` | Obtener detalles de contacto (teléfono/correo) |

---

## Notas de los pasos

**Paso 1 — Perfiles de posición**  
Filtre por `institution_staff_id` (el ID de asignación específico de la escuela, **NO** el `staff_id` global). Para encontrar el registro activo, también filtre `status_id=1` y busque `end_date=null`. Ordene por `start_date desc`.  
> ⚠️ El campo `FTE` está en **mayúsculas** en la respuesta de la API (`FTE`, no `fte`). Analícelo como float: `parseFloat(row.FTE)`. `end_date=null` significa actualmente activo — trate `null` como "en curso", no como cadena vacía.

**Paso 2 — Historial de licencias**  
Filtre por `staff_id` — este es el **ID global de la persona** (FK a `security_users`), **NO** `institution_staff_id`. Usar `institution_staff_id` aquí devolverá resultados vacíos. Agregue `?orderby=date_from&order=desc`.  
> ⚠️ `institution-staff-leave` está **controlado por flujo de trabajo** (status_id → WorkflowSteps). GET es seguro; CREATE/UPDATE/DELETE debe realizarse a través de la aplicación oficial.

**Paso 3 — Posiciones históricas**  
Filtre por `institution_id` para limitar al historial de la institución actual. `historical-staff-positions` rastrea títulos de posición en instituciones anteriores; es distinto de `institution-staff-position-profiles` que rastrea cambios de ETC/estado.

**Paso 4 — Datos de contacto**  
Filtre por `security_user_id` — este es el ID global de usuario del miembro del personal (la misma FK usada en el paso 2 como `staff_id`). NO filtre por `institution_staff_id` — `user-contacts` es una tabla global de usuarios no limitada por institución. Resuelva `contact_type_id` contra `/api/v5/contact-types` para mostrar etiquetas legibles (ej. "Móvil", "Correo electrónico").

---

## Errores comunes clave

- **Dos campos de identidad del personal:**
  - `staff_id` = persona global en todas las escuelas (FK a `security_users`) — úselo para licencias (paso 2) y contactos (paso 4)
  - `institution_staff_id` = asignación de esa persona en una escuela específica — úselo para perfiles de posición (paso 1)
- **`FTE` está en mayúsculas** en la respuesta de la API: `row.FTE` no `row.fte`. Analícelo como float antes de mostrar o calcular.
- **`institution-staff-leave` está controlado por flujo de trabajo.** GET siempre es seguro. Para CREATE/UPDATE/DELETE, dirija al usuario a la aplicación oficial de OpenEMIS.
- **`user-contacts` cubre tanto teléfono como correo electrónico** en un solo endpoint. `contact_type_id` debe resolverse a través de `/api/v5/contact-types` para obtener etiquetas legibles.

---

## Ejemplo de consulta

> *"Muéstreme todo sobre la maestra Sarah Lee — su posición, las licencias tomadas este año y cómo contactarla."*

1. `openemis_get { resource: "institution-staff-position-profiles", params: { institution_staff_id: 15, status_id: 1 } }` → ETC 1.0, Maestra Grado 3
2. `openemis_get { resource: "institution-staff-leave", params: { staff_id: 88, orderby: "date_from", order: "desc" } }` → 3 registros de licencia
3. `openemis_get { resource: "historical-staff-positions", params: { institution_id: 6 } }` → 2 posiciones pasadas
4. `openemis_get { resource: "user-contacts", params: { security_user_id: 88 } }` → móvil +60-12-345-6789