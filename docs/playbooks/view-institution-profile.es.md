# Ver perfil completo de la institución

**Dominio:** Institución  
**Audiencia:** administrador, padre, público  
**ID del playbook:** `view-institution-profile`

## Descripción

Ver información detallada sobre una institución: registro principal, grados activos, localidad y personas de contacto. Los pasos siguen el orden canónico — primero se obtiene la institución principal, luego los grados, luego se resuelve la localidad y finalmente los contactos.

---

## Recursos utilizados

| Recurso | Propósito |
|---|---|
| `institutions` | Registro principal: nombre, código, dirección, teléfono, locality_id, tipo de institución |
| `institution-grades` | Niveles de grado ofrecidos por la institución en el período académico activo |
| `institution-localities` | Tabla de referencia global: resolver locality_id a un nombre legible |
| `institution-contact-persons` | Personas de contacto designadas con cargo, teléfono, móvil y correo electrónico |

---

## Pasos

| Paso | Acción | Recurso | Propósito |
|---|---|---|---|
| 1 | `openemis_get` | `institutions` | Obtener el registro principal de la institución por id, nombre o código |
| 2 | `openemis_get` | `institution-grades` | Listar los niveles de grado activos para esta institución y período académico |
| 3 | `openemis_get` | `institution-localities` | Resolver locality_id a un nombre de localidad legible |
| 4 | `openemis_get` | `institution-contact-persons` | Listar las personas de contacto designadas para la institución |

---

## Notas de los pasos

**Paso 1 — Registro principal de la institución**  
Filtrar por `id`, `name` o `code`. Siempre agregue `?is_deleted=0` para excluir registros eliminados lógicamente — `DELETE` en el endpoint de instituciones establece `is_deleted=1`; la fila permanece en la base de datos. El entero `locality_id` de la respuesta se resolverá en el paso 3. `GET /api/v5/institutions/{id}` devuelve más detalles que el endpoint de lista; prefiera la obtención de un solo registro una vez que tenga el id.

**Paso 2 — Grados activos ofrecidos**  
Filtrar por `institution_id` (del paso 1) y `academic_period_id`. Sin ambos filtros, el endpoint devuelve un volcado global. Devuelve un arreglo vacío si no hay grados configurados — eso es válido para instituciones nuevas. Use `?_fields=id,education_grade_id,start_date,end_date` para recortar la carga útil.

**Paso 3 — Resolver el nombre de la localidad**  
`institution-localities` es una **lista maestra de referencia GLOBAL** — **NO** tiene parámetro de filtro `institution_id`. Obtenga todas las entradas (o almacénelas en caché una vez por sesión), luego haga coincidir el `locality_id` de la institución con la fila correcta. NO intente `?institution_id=...` — ese parámetro no es compatible con este recurso y devolverá un resultado vacío o sin filtrar.

**Paso 4 — Personas de contacto**  
Filtrar por `institution_id`. Un registro con `preferred=1` es el contacto principal (`preferred` se almacena como tinyint 0/1, conviértalo a booleano para mostrar). Un resultado vacío es válido — algunas instituciones no tienen contactos separados más allá del campo `contact_person` en el registro de instituciones en sí.

---

## Advertencias clave

- **`is_deleted=0` es esencial** en la obtención de instituciones — las escuelas eliminadas lógicamente permanecen en la base de datos y aparecerán en los resultados de la lista sin este filtro.
- **`institution-localities` NO tiene filtro específico por institución.** Es una tabla de referencia independiente. Para encontrar a qué localidad pertenece una institución, lea `locality_id` del registro de instituciones y búsquelo en esta tabla.
- **`contact_person` en el registro de instituciones es una cadena de texto libre**, NO una FK a `security_users`. Los registros de contacto separados y más completos están en `institution-contact-persons` filtrados por `institution_id`.
- **El orden de los pasos es intencional:** primero el registro principal (proporciona `locality_id` e `institution_id` para pasos posteriores), luego los grados (depende de `institution_id`), luego la localidad (búsqueda global que solo necesita `locality_id` del paso 1), luego los contactos (depende de `institution_id`).

---

## Ejemplo de consulta

> *"Muéstreme el perfil completo de Avory Primary School — grados ofrecidos, localidad y a quién llamar."*

1. `openemis_get { resource: "institutions", params: { name: "Avory Primary", is_deleted: 0 } }` → id=6, locality_id=2
2. `openemis_get { resource: "institution-grades", params: { institution_id: 6, academic_period_id: 1 } }` → grados 1–6
3. `openemis_get { resource: "institution-localities" }` → coincidir locality_id=2 → "Selangor"
4. `openemis_get { resource: "institution-contact-persons", params: { institution_id: 6 } }` → Jane Doe, Directora