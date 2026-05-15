---
title: Resolver mi identidad en OpenEMIS
description: Este playbook de OpenEMIS explica cómo resolver la identidad del usuario autenticado actual en el sistema de gestión escolar, vinculando el login con un registro de personal.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
---

# Resolver Mi Identidad en OpenEMIS (¿Quién Soy en OpenEMIS?)

**Dominio:** Autenticación
**Audiencia:** docente, administrador, personal
**ID del Playbook:** `resolve-my-identity`

## Descripción

Después de que un usuario inicie sesión con `openemis_login({username, password})`, determine quién es en términos de OpenEMIS: su `security_users.id`, su nombre completo, a qué instituciones está asignado y qué roles/clases tiene. Este es el puente entre "acabo de autenticarme" y "muéstrame mis cosas" — sin él, un agente conoce la cadena del nombre de usuario pero nada sobre lo que ese usuario puede ver, enseñar o gestionar.

Ejecute esto justo después de `openemis_login` (o al inicio de cualquier sesión donde el usuario se refiera a "mi", "mío", "yo"). Almacene en caché el ID de usuario resuelto para el resto de la conversación — no lo vuelva a resolver en cada turno.

---

## Recursos Utilizados

| Recurso | Propósito |
|---|---|
| `security-users` | Resolver nombre de usuario → ID de usuario, nombre/apellido, correo |
| `institution-staff` | Instituciones donde este usuario es miembro activo del personal + FTE + cargo |
| `institution-positions` | Resolver `staff_position_title_id` → título legible (docente, director, RRHH, …) |
| `institutions` | Resolver nombres de instituciones a partir de `institution_id` |
| `institution-classes` | Clases de grupo para este usuario (`staff_id = user.id`) |
| `institution-classes-secondary-staff` | Clases secundarias/co-impartidas |
| `institution-subject-staff` | Materias que este usuario enseña (una fila por (clase, materia, personal)) |
| `security-group-users` | Pertenencia a grupos administrativos (área, región, roles del sistema) |

---

## Pasos

| Paso | Acción | Recurso | Propósito |
|---|---|---|---|
| 1 | `openemis_whoami` | — | Leer el nombre de usuario de la sesión actual |
| 2 | `openemis_get` | `security-users` | Nombre de usuario → ID de usuario + nombre/apellido |
| 3 | `openemis_get` | `institution-staff` | ¿En qué instituciones soy personal? |
| 4 | `openemis_get` | `institution-positions` | Resolver mi título de cargo por institución |
| 5 | `openemis_get` × 3 | `institution-classes` · `institution-classes-secondary-staff` · `institution-subject-staff` | Clases que imparto (grupo + secundarias + materia) |
| 6 | Componer | — | Devolver un resumen de un párrafo "quién es usted" |

---

## Notas de los Pasos

**Paso 1 — Verificación de sesión**
Llame a `openemis_whoami` sin argumentos. Si el resultado tiene `mode: "env-default"`, el usuario NO ha llamado a `openemis_login` aún — la identidad efectiva es el usuario .env del servidor, que puede ser admin/admin en instancias de demostración. Advierta antes de tratar eso como la identidad "real". Para sesiones por usuario, la respuesta incluye `username`.

**Paso 2 — Nombre de usuario → ID de usuario**
`openemis_get('security-users', params: { _conditions: 'username:<username>', _fields: 'id,username,first_name,last_name,email,gender_id' })`. Devuelve exactamente una fila en una instancia de OpenEMIS bien formada (el nombre de usuario es único). Guarde el `id` — lo usará en todas partes a continuación. Si no devuelve filas, el JWT de inicio de sesión es válido pero el registro de usuario fue eliminado — muestre esto como un error.

**Paso 3 — Asignaciones de institución**
`openemis_get('institution-staff', params: { _conditions: 'staff_id:<user_id>;staff_status_id:1', _fields: 'id,institution_id,institution_position_id,FTE,start_date,end_date', limit: 200 })`. `staff_status_id=1` filtra a Asignado/Activo. Un docente activo típicamente tiene una o dos filas (institución principal + asignación secundaria opcional). FTE es una cadena decimal ("1.00", "0.50"); convierta a float si necesita sumar. Sin filas = el usuario tiene un inicio de sesión pero no está asignado como personal en ningún lado — a menudo el caso para cuentas de administrador.

**Paso 4 — Título del cargo**
Para cada `institution_position_id` distinto del paso 3, obtenga la fila del cargo para obtener su `staff_position_title_id`. Luego resuelva eso contra `staff-position-titles` para obtener una etiqueta como "Docente", "Director", "RRHH". Almacene en caché el mapeo de títulos por sesión — rara vez cambia. Agrupe con `?ids=`:
`openemis_get('institution-positions', params: { ids: '<csv de ids de cargos>' })`.

**Paso 5 — Clases que imparto (despliegue triple)**
Las clases que involucran a este usuario están distribuidas en tres tablas (misma forma que `view-class-profile` paso 5):

(a) **Grupo** — `openemis_get('institution-classes', params: { _conditions: 'staff_id:<user_id>;academic_period_id:<current>', _fields: 'id,name,institution_id,education_grade_id,academic_period_id' })`. `staff_id` aquí es la FK del docente del grupo.

(b) **Secundario/co-docente** — `openemis_get('institution-classes-secondary-staff', params: { _conditions: 'security_user_id:<user_id>', _fields: 'id,institution_class_id' })`. Luego obtenga las filas referenciadas de `institution-classes` con `?ids=`.

(c) **Docente de materia** — `openemis_get('institution-subject-staff', params: { _conditions: 'security_user_id:<user_id>', _fields: 'id,institution_class_id,institution_subject_id' })`. Despliegue para resolver nombres de clase + nombres de materia con dos llamadas por lotes `?ids=`.

Una los tres conjuntos y elimine duplicados por `institution_class_id`. Una clase donde el usuario es TANTO docente del grupo COMO docente de materia debe aparecer una vez, con ambos roles listados.

**Paso 6 — Resumen**
Componga una respuesta de un párrafo como:

> Usted es **{first_name} {last_name}** (ID de usuario {id}). Está asignado como **{position_title}** en **{institution_name}**{, y también en X si es multi-institución}. Este período académico tiene **{N}** clases: {class_1} (grupo), {class_2} (materia: Matemáticas), {class_3} (co-docente), …

Use este resumen como el contexto implícito para cualquier pregunta de seguimiento que diga "mis estudiantes", "mis clases", "mi institución", etc. — no vuelva a obtener estos datos en cada turno.

---

## Ejemplo de Secuencia de Llamadas

```
1. openemis_login({ username: "teacher", password: "teacher" })
   → { ok: true, username: "teacher" }

2. openemis_whoami()
   → { mode: "per-user", username: "teacher", baseUrl: "https://demo.openemis.org/core" }

3. openemis_get("security-users", {
     params: { _conditions: "username:teacher", _fields: "id,first_name,last_name,email" }
   })
   → data: [{ id: 42, first_name: "Demo", last_name: "Teacher", email: "…" }]

4. openemis_get("institution-staff", {
     params: { _conditions: "staff_id:42;staff_status_id:1",
               _fields: "institution_id,institution_position_id,FTE" }
   })
   → data: [{ institution_id: 12, institution_position_id: 57, FTE: "1.00" }]

5. openemis_get("institution-classes", {
     params: { _conditions: "staff_id:42;academic_period_id:<current>",
               _fields: "id,name,education_grade_id" }
   })
   → data: [{ id: 203, name: "Grade 4 — Section A", education_grade_id: 8 }]
```

---

## Advertencias y Notas

- **Identidad por defecto del entorno.** Si el usuario omitió `openemis_login`, `openemis_whoami` devuelve `mode: "env-default"`. NO obtenga un perfil de estudiante y diga "este es su hijo" en ese caso — son las credenciales de administrador/demostración del servidor, no las del usuario real. Pídale que llame a `openemis_login` primero.

- **Sensibilidad a mayúsculas del nombre de usuario.** `security_users.username` de OpenEMIS distingue entre mayúsculas y minúsculas según la intercalación predeterminada de MySQL en la mayoría de las instalaciones. Pase la cadena exacta de `openemis_whoami`, no una copia en minúsculas.

- **Usuarios multi-institución.** Directores asignados a un clúster, o docentes con doble asignación, tienen >1 filas en `institution-staff`. Todas las preguntas posteriores ("mis estudiantes", "mis clases") se vuelven ambiguas — pregunte al usuario a qué institución se refiere, o liste todo agrupado por institución.

- **Administradores y personal no docente.** Usuarios cuyo título de cargo es "Director", "RRHH" o "Registrador" típicamente tendrán cero filas en las tablas de nivel de clase (paso 5). Eso es esperado — su alcance es toda la institución, no una clase específica. El resumen debe decir "Usted es el Director de X" sin lista de clases.

- **Período académico actual.** El paso 5 filtra por `academic_period_id:<current>` — resuelva `<current>` mediante `GET academic-periods?current=1` una vez por sesión y almacénelo en caché.

- **Caducidad del JWT.** Si cualquier paso devuelve HTTP 401, el JWT almacenado ha caducado — el MCP mostrará un error "por favor llame a openemis_login de nuevo". Esto puede suceder después de largos períodos de inactividad; pida al usuario que se vuelva a autenticar.

- **Privacidad.** El resumen que compone se convierte en contexto implícito. Manténgalo conciso (nombre + cargo + institución + cantidad de clases) — no vuelque correo, género o fecha de contratación en la conversación a menos que el usuario lo pida explícitamente.