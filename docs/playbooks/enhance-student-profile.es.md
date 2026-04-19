# Ampliar el Perfil del Estudiante con Contactos, Nacionalidad y Necesidades Especiales


**Dominio:** Estudiante  
**Audiencia:** profesor, administrador, consejero  
**ID del Manual de Procedimientos:** `enhance-student-profile`

## Descripción

Amplíe la vista del perfil de un estudiante existente recuperando detalles de contacto directo, asignaciones de nacionalidad, evaluaciones de necesidades especiales y planes de necesidades especiales. Los cuatro recursos de mejora filtran por `security_user_id` (el ID de usuario global del estudiante desde `security_users`), **NO** por `student_id` (la clave foránea de matrícula). Los resultados vacíos para las necesidades especiales son válidos: la mayoría de los estudiantes no tienen registros.

---

## Recursos Utilizados

| Recurso | Propósito |
|---|---|
| `institution-students` | Confirmar la matrícula activa y resolver `security_user_id` |
| `user-contacts` | Números de teléfono y direcciones de correo electrónico |
| `user-nationalities` | Asignaciones de nacionalidad (soporta doble ciudadanía) |
| `user-special-needs-assessments` | Evaluaciones de necesidades educativas especiales (NEE) |
| `user-special-needs-plans` | Planes de Educación Individualizados (PEI) o planes similares |

---

## Pasos

| Paso | Acción | Recurso | Propósito |
|---|---|---|---|
| 1 | `openemis_get` | `institution-students` | Confirmar matrícula activa; capturar `security_user_id` |
| 2 | `openemis_get` | `user-contacts` | Recuperar detalles de contacto (teléfono/correo electrónico) |
| 3 | `openemis_get` | `user-nationalities` | Recuperar asignaciones de nacionalidad |
| 4 | `openemis_get` | `user-special-needs-assessments` | Recuperar evaluaciones de NEE |
| 5 | `openemis_get` | `user-special-needs-plans` | Recuperar planes de NEE / PEI |

---

## Notas del Paso

**Paso 1 — Confirmar Matrícula y Resolver `security_user_id`**  
Filtre por `student_id` y `student_status_id=1`. El campo `student_id` en `institution-students` **ES** el `security_user_id` (clave foránea a `security_users`). Cápturlo: los pasos 2 a 5 filtran todos por `security_user_id`.

**Paso 2 — Detalles de Contacto**  
Filtre por `security_user_id`, es decir, el ID de usuario global del paso 1. NO filtre solo por `student_id`: `user-contacts` es una tabla de usuario global y la clave foránea es `security_user_id`. Resuelva `contact_type_id` a través de `/api/v5/contact-types` para obtener etiquetas legibles por humanos (p. ej., "Móvil", "Correo electrónico"). `preferred=true/1` marca el contacto principal de cada tipo.

**Paso 3 — Asignaciones de Nacionalidad**  
Filtre por `security_user_id`. Múltiples filas son válidas (doble ciudadanía). Use `preferred=true` para identificar la nacionalidad principal. Resuelva `nationality_id` a través de `/api/v5/nationalities` para obtener el nombre del país.

**Paso 4 — Evaluaciones de NEE**  
Filtre por `security_user_id`. Un **resultado vacío es válido y común**: la mayoría de los estudiantes no tienen evaluaciones de NEE. Resuelva `special_need_type_id` a través de `/api/v5/special-need-types` y `special_need_difficulty_id` a través de `/api/v5/special-need-difficulties` para obtener etiquetas legibles por humanos. `file_content` siempre es `null` en las respuestas de lista: llame a `GET /{id}` si se necesita el archivo.

**Paso 5 — Planes de NEE**  
Filtre por `security_user_id` y opcionalmente por `academic_period_id`.  
> ⚠️ **ORTOGRAFÍA:** El campo clave foránea en este recurso es `special_needs_plan_types_id` (plural "needs"), **NO** `special_need_plan_type_id` (singular). Usar la ortografía incorrecta fallará silenciosamente. Un resultado vacío es válido: la mayoría de los estudiantes no tienen planes. `file_content` siempre es `null` en las respuestas de lista.

---

## Puntos Clave (Gotchas)

- **Los cuatro recursos de mejora utilizan `security_user_id`** como clave de filtro: la clave foránea global del estudiante a `security_users`. La columna `institution-students.student_id` ES ese mismo `security_user_id`.
- **Se esperan y son válidos los resultados vacíos** para los recursos de necesidades especiales. NO considere un array vacío como un error: la mayoría de los estudiantes no tienen evaluaciones ni planes de NEE.
- **Ortografía de la clave foránea `user-special-needs-plans`:** `special_needs_plan_types_id` (plural). Resuelva a través de `/api/v5/special-needs-plan-types`.
- **`file_content` siempre es `null` en las respuestas de lista** para ambos recursos de NEE, para ahorrar ancho de banda. Llame a `GET /{id}` sobre un registro específico para recuperar el archivo base64.
- **Los pasos 2 al 5 se pueden obtener en paralelo** una vez que se conoce el `security_user_id` del paso 1.

---

## Consulta de Ejemplo

> *"Dame el perfil completo del estudiante Ahmad: contactos, nacionalidad y cualquier registro de necesidades especiales."*

1. `openemis_get { resource: "institution-students", params: { student_id: 102, student_status_id: 1 } }` → security_user_id=102
2. `openemis_get { resource: "user-contacts", params: { security_user_id: 102 } }` → móvil +60-11-222-3333
3. `openemis_get { resource: "user-nationalities", params: { security_user_id: 102 } }` → Malasio (preferido)
4. `openemis_get { resource: "user-special-needs-assessments", params: { security_user_id: 102 } }` → [] (ninguno)
5. `openemis_get { resource: "user-special-needs-plans", params: { security_user_id: 102 } }` → [] (ninguno)