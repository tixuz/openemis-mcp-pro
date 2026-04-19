# Registrar un Incidente de Conducta Estudiantil

> 📖 **Servidor de solo lectura.** Los Playbooks que crean o actualizan registros requieren **[openemis-mcp-pro](https://github.com/tixuz/openemis-mcp-pro)**.

**Dominio:** Estudiante · **Audiencia:** profesor, administrador

Registre un incidente de conducta contra un estudiante: busque las categorías y clasificaciones de gravedad, luego escriba el registro del incidente con una descripción y una acción de seguimiento. Disponible en las herramientas de escritura v0.3.0.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `student-behaviour-categories` | Lista de referencia de tipos de incidente (p. ej., Acoso, Retrasos, Vandalismo) — proporciona el id de categoría para adjuntar al registro del incidente. |
| `student-behaviour-classifications` | Lista de referencia de niveles de gravedad (Menor, Mayor, Crítico) — proporciona el id de clasificación que indica cuán grave fue el incidente. |
| `student-behaviours` | El objetivo de escritura — el registro del incidente vinculado al estudiante, institución y período académico, incluyendo la descripción y cualquier acción de seguimiento. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Listar categorías de conducta | `openemis_get` | Obtener el id para la categoría que coincide con el incidente (p. ej., Acoso, Retrasos). |
| 2 | Listar clasificaciones de gravedad | `openemis_get` | Obtener el id para el nivel de gravedad (Menor, Mayor, Crítico). |
| 3 | Escribir el registro del incidente | `openemis_create` | Crear el registro de conducta vinculado al estudiante, institución y período académico. |

### Notas del paso

**Paso 1 — Listar categorías de conducta:** Obtenga todas las filas de `student-behaviour-categories`. Revise los nombres y anote el `category_id` que mejor coincida con el tipo de incidente que se está registrando. Este id es necesario en el paso 3.

**Paso 2 — Listar clasificaciones de gravedad:** Obtenga todas las filas de `student-behaviour-classifications`. Anote el `classification_id` para el nivel de gravedad apropiado (Menor, Mayor o Crítico). Este id es necesario en el paso 3.

**Paso 3 — Escribir el registro del incidente:** Envíe a `student-behaviours` con los siguientes campos requeridos: `student_id`, `institution_id`, `academic_period_id`, `date_of_behaviour` (AAAA-MM-DD), `description` (narrativa de lo sucedido), `student_behaviour_category_id` (del paso 1) y `student_behaviour_classification_id` (del paso 2). Campos opcionales: `action_taken` (lo que hizo el profesor o administrador en respuesta) y `follow_up_date` (si hay un seguimiento programado).

---

## Consulta de ejemplo

> "Registrar un incidente menor de acoso para el estudiante James el 15 de abril — estaba molestando a un compañero durante el recreo."

El agente hará lo siguiente:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar este playbook
2. Seguir los pasos anteriores
3. Devolver la respuesta en lenguaje sencillo