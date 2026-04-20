# Ver perfil completo de la clase

**Dominio:** Estudiante  
**Audiencia:** docente, administrador  
**ID del playbook:** `view-class-profile`

## Descripción

Ver el perfil de una clase: asignación de nivel de grado, lista de estudiantes matriculados, materias activas, resumen mensual de asistencia y la lista completa de docentes (docente titular + docentes secundarios + docentes de materias). El recurso de asistencia utiliza una clave primaria compuesta — no hay un campo entero `id`; siempre use filtros de tipo lista para obtenerlo. La lista de docentes está distribuida en tres tablas y requiere una expansión (fan-out) y deduplicación.

---

## Recursos utilizados

| Recurso | Propósito |
|---|---|
| `institution-classes` | La fila de la clase en sí — contiene `staff_id` (la FK del docente titular) |
| `institution-class-grades` | Resolver a qué nivel de grado educativo pertenece esta clase |
| `institution-class-students` | Todos los estudiantes actualmente matriculados en la clase |
| `institution-class-subjects` | Materias impartidas activamente en esta clase |
| `institution-subjects` | Resolver nombres de materias a partir de `institution_subject_id` |
| `institution-class-attendance-records` | Resumen mensual de asistencia (conteos diarios de estudiantes presentes) |
| `institution-classes-secondary-staff` | Docentes co-instructores / personal secundario asignado a la clase |
| `institution-subject-staff` | Docentes de materias — una fila por par (materia, docente) |

---

## Pasos

| Paso | Acción | Recurso | Propósito |
|---|---|---|---|
| 1 | `openemis_get` | `institution-class-grades` | Resolver el nivel de grado para esta clase |
| 2 | `openemis_get` | `institution-class-students` | Listar estudiantes matriculados |
| 3 | `openemis_get` | `institution-class-subjects` | Listar materias activas |
| 4 | `openemis_get` | `institution-class-attendance-records` | Resumen mensual de asistencia |
| 5 | `openemis_get` × 3 | `institution-classes` · `institution-classes-secondary-staff` · `institution-subject-staff` | Lista de docentes (expandir, unir, deduplicar por `staff_id`) |

---

## Notas de los pasos

**Paso 1 — Asignación de grado de la clase**  
Filtre por `institution_class_id`. Devuelve el `education_grade_id` — una tabla de mapeo (clase ↔ grado). Típicamente una fila por clase, pero las configuraciones multi-grado son válidas.

**Paso 2 — Estudiantes matriculados**  
Filtre por `institution_class_id` y `academic_period_id`. Establezca `student_status_id=1` para devolver solo estudiantes actualmente matriculados. Esta es una tabla de unión — el campo `id` aquí es el id del registro de matrícula, no el id del estudiante. `student_id` es la FK a `security_users`.

**Paso 3 — Materias activas**  
Filtre por `institution_class_id` y `status=1` para devolver solo materias activas. Los nombres de las materias no están incluidos — solo la FK `institution_subject_id`. Resuelva los nombres por separado a través de `institution-subjects` si es necesario.

**Paso 4 — Resumen mensual de asistencia**  
> ⚠️ **CRÍTICO:** `institution-class-attendance-records` **NO tiene un campo entero `id`**. Su clave primaria es compuesta: `(institution_class_id, academic_period_id, year, month)`. **NUNCA** pase un parámetro `id=` — devolverá vacío o un error.

Use solo filtros de lista:
```
?institution_class_id={id}&academic_period_id={period}&year={year}&month={month}
```
Alternativamente, use la ruta de clave compuesta:
```
GET /institution-class-attendance-records/institution_class_id/{X}/academic_period_id/{Y}/year/{Z}/month/{M}
```
Los campos `day_1` a `day_31` contienen el conteo diario de presentes; `null` significa que la asistencia aún no fue enviada para ese día.

**Paso 5 — Lista de docentes**  
No hay un solo endpoint que devuelva la lista completa de docentes para una clase. Expanda a través de tres tablas y únalas por `staff_id`:

**(a) Docente titular** — en la fila de la clase misma:
```
openemis_get { resource: "institution-classes", id: 42 }
→ row.staff_id  (una sola FK a security_users; puede ser null)
```

**(b) Docentes secundarios / co-instructores** — tabla de unión dedicada (PK compuesta, sin `id` entero):
```
openemis_get { resource: "institution-classes-secondary-staff",
               params: { institution_class_id: 42 } }
→ filas con secondary_staff_id (FK a security_users)
```

**(c) Docentes de materias** — una fila por par (materia, docente). NO es filtrable directamente por `institution_class_id`; expanda sobre la lista de `institution_subject_id` del paso 3:
```
para cada institution_subject_id en el paso 3:
  openemis_get { resource: "institution-subject-staff",
                 params: { institution_subject_id: subjId } }
→ filas con staff_id
```

**Deduplicación + resolución de nombres.** Una persona puede aparecer en múltiples listas (el docente titular a menudo también enseña una materia). Una por `staff_id`, luego resuelva los nombres en una llamada:
```
openemis_get { resource: "security-users",
               params: { ids: "13,42,99" } }
```

---

## Advertencias clave

- **PK compuesta — sin id entero.** La clave primaria de `institution-class-attendance-records` es `(institution_class_id, academic_period_id, year, month)`. Cualquier llamada que use un filtro `id=` numérico fallará silenciosamente o devolverá datos incorrectos.
- **Solo agregados mensuales.** Este recurso contiene conteos de presentes por día. NO es el registro de ausencias por estudiante — para ausencias individuales use `student-attendance-marked-records`.
- **Campos `day_X` con `null` ≠ cero.** Los campos `day_X` devuelven `null` para los días en que no se envió la asistencia — trátelo como `Pendiente`, no como `0 ausentes`.
- **La lista de docentes está fragmentada.** El titular está en `institution-classes.staff_id`, los co-instructores en `institution-classes-secondary-staff`, los docentes de materias en `institution-subject-staff`. No hay un solo endpoint que los una — expanda y deduplique.
- **PK compuesta de `institution-classes-secondary-staff`.** `(institution_class_id, secondary_staff_id)`. Use filtros de lista — no pase un `id=` numérico.
- **`institution-subject-staff` no es filtrable por clase.** Filtre solo por `institution_subject_id`; itere sobre los IDs de materias de la clase del paso 3.
- **La visibilidad basada en roles es una preocupación del cliente actualmente.** Los directores, subdirectores y administradores necesitan ver *todas* las clases en su institución, pero la API aún no proporciona un endpoint de "clases que puedo ver". La consulta inversa ("¿qué clases puede ver este `staff_id`?") requiere la misma expansión de 3 tablas más una verificación de rol — un endpoint central dedicado está en la hoja de ruta de OpenEMIS.

---

## Ejemplo de consulta

> *"Muéstreme el perfil de la clase 8A para el período académico actual."*

1. `openemis_get { resource: "institution-class-grades", params: { institution_class_id: 42 } }` → grado 8
2. `openemis_get { resource: "institution-class-students", params: { institution_class_id: 42, academic_period_id: 1, student_status_id: 1 } }` → 28 estudiantes
3. `openemis_get { resource: "institution-class-subjects", params: { institution_class_id: 42, status: 1 } }` → 7 materias (IDs `[101, 102, …, 107]`)
4. `openemis_get { resource: "institution-class-attendance-records", params: { institution_class_id: 42, academic_period_id: 1, year: 2024, month: 3 } }` → conteos diarios de marzo 2024
5. Lista de docentes:
   - `openemis_get { resource: "institution-classes", id: 42 }` → docente titular `staff_id=7`
   - `openemis_get { resource: "institution-classes-secondary-staff", params: { institution_class_id: 42 } }` → co-instructores `[12, 19]`
   - `openemis_get { resource: "institution-subject-staff", params: { institution_subject_id: 101 } }` × 7 → docentes de materias `[7, 23, 41, 58, …]`
   - Unión + deduplicación → `{7, 12, 19, 23, 41, 58, …}`
   - `openemis_get { resource: "security-users", params: { ids: "7,12,19,23,41,58" } }` → nombres en una llamada