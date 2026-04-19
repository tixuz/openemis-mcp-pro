# Ver perfil completo de la clase

**Dominio:** Estudiante  
**Audiencia:** docente, administrador  
**ID del playbook:** `view-class-profile`

## Descripción

Ver el perfil de una clase: asignación de nivel de grado, lista de estudiantes matriculados, materias activas y resumen mensual de asistencia. El recurso de asistencia utiliza una clave primaria compuesta — no hay un campo entero `id`; siempre utilice filtros de tipo lista para obtenerlo.

---

## Recursos utilizados

| Recurso | Propósito |
|---|---|
| `institution-class-grades` | Determinar a qué nivel de grado educativo pertenece esta clase |
| `institution-class-students` | Todos los estudiantes actualmente matriculados en la clase |
| `institution-class-subjects` | Materias que se imparten activamente en esta clase |
| `institution-class-attendance-records` | Resumen mensual de asistencia (conteos diarios de estudiantes presentes) |

---

## Pasos

| Paso | Acción | Recurso | Propósito |
|---|---|---|---|
| 1 | `openemis_get` | `institution-class-grades` | Determinar el nivel de grado para esta clase |
| 2 | `openemis_get` | `institution-class-students` | Listar estudiantes matriculados |
| 3 | `openemis_get` | `institution-class-subjects` | Listar materias activas |
| 4 | `openemis_get` | `institution-class-attendance-records` | Resumen mensual de asistencia |

---

## Notas de los pasos

**Paso 1 — Asignación de grado de la clase**  
Filtre por `institution_class_id`. Devuelve el `education_grade_id` — una tabla de mapeo (clase ↔ grado). Típicamente una fila por clase, pero las configuraciones multigrado son válidas.

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
Los campos `day_1` a `day_31` contienen el conteo diario de presentes; `null` significa que la asistencia aún no se envió para ese día.

---

## Principales dificultades

- **PK compuesta — sin id entero.** La clave primaria de `institution-class-attendance-records` es `(institution_class_id, academic_period_id, year, month)`. Cualquier llamada que use un filtro `id=` numérico simple fallará silenciosamente o devolverá datos incorrectos.
- **Solo agregados mensuales.** Este recurso contiene conteos de presentes por día. NO es el registro de ausencias por estudiante — para ausencias individuales use `student-attendance-marked-records`.
- **Campos `null` para días ≠ cero.** Los campos `day_X` devuelven `null` para los días en que no se envió la asistencia — trátelos como `Pendiente`, no como `0 ausentes`.

---

## Consulta de ejemplo

> *"Muéstreme el perfil de la clase 8A para el período académico actual."*

1. `openemis_get { resource: "institution-class-grades", params: { institution_class_id: 42 } }` → grado 8
2. `openemis_get { resource: "institution-class-students", params: { institution_class_id: 42, academic_period_id: 1, student_status_id: 1 } }` → 28 estudiantes
3. `openemis_get { resource: "institution-class-subjects", params: { institution_class_id: 42, status: 1 } }` → 7 materias
4. `openemis_get { resource: "institution-class-attendance-records", params: { institution_class_id: 42, academic_period_id: 1, year: 2024, month: 3 } }` → conteos diarios de marzo de 2024