---
title: Matricular a un nuevo estudiante en OpenEMIS
description: Este playbook de OpenEMIS explica cómo matricular a un nuevo estudiante en una institución usando las herramientas de escritura del sistema de gestión escolar.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
---

# Matricular a un Nuevo Estudiante en una Institución OpenEMIS


**Dominio:** Estudiante · **Audiencia:** administrador, registrador

MODO DEBYPASS SOLAMENTE: la matrícula directa solo funciona cuando la configuración del sistema tiene habilitado "bypass enrolment workflow". Si el flujo de trabajo de admisión → matrícula está activo, utilice la aplicación OpenEMIS — el flujo de trabajo requiere la aprobación del supervisor en cada etapa y no puede gestionarse únicamente mediante API.

> ⚠️ **Puerta del flujo de trabajo:** Este playbook solo funciona cuando se habilita en la configuración del sistema: Administración → Configuración del sistema → Estudiante → Bypass Enrolment Workflow. Utilice los formularios oficiales de Admisión y Matrícula en su lugar.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `security-users` | Crea la cuenta de usuario base para el estudiante — todos los usuarios de OpenEMIS (estudiantes, personal, padres) comparten esta tabla. |
| `user-identities` | Opcionalmente vincula un ID nacional, pasaporte u otro documento de identidad al registro de usuario del nuevo estudiante. |
| `student-guardians` | Opcionalmente vincula un registro de padre o tutor al estudiante después de la matrícula. |
| `education-grades` | Tabla de referencia utilizada para resolver el nombre del grado objetivo (p. ej., "Grado 5") a su id para el registro de matrícula. |
| `academic-periods` | Proporciona el id del período académico actual — un campo requerido en cada registro de matrícula y la primera verificación de que la API es accesible. |
| `institution-students` | El objetivo de escritura — el registro de matrícula que vincula la cuenta de usuario del estudiante con la institución, el grado y el período académico. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Confirmar que el modo bypass está activo | `openemis_get` | Obtener el id del período académico actual — confirma que la API es accesible antes de intentar cualquier escritura. |
| 2 | Buscar el grado educativo objetivo | `openemis_get` | Resolver el education_grade_id para el grado al que se une el estudiante. |
| 3 | Crear la cuenta de usuario del estudiante | `openemis_create` | Crea el registro base de usuario con los detalles personales del estudiante. |
| 4 | Adjuntar documento de identidad (opcional) | `openemis_create` | Vincula un ID nacional o número de pasaporte al registro del estudiante. |
| 5 | Matricular al estudiante en la institución | `openemis_create` | Crea el registro de matrícula que vincula al estudiante con la institución, el grado y el período. |
| 6 | Vincular contacto del tutor (opcional) | `openemis_create` | Asocia un registro de tutor o padre con el estudiante. |

### Notas del paso

**Paso 1 — Confirmar que el modo bypass está activo:** Verifique con el administrador que el flujo de trabajo de matrícula por bypass esté habilitado en la configuración del sistema antes de proceder con cualquier escritura. Llame a `academic-periods` con `_conditions=current:1` o seleccione el período activo por fecha. Anote el `academic_period_id` — es requerido en los pasos 5 y 6.

**Paso 2 — Buscar el grado educativo objetivo:** Filtre `education-grades` por nombre que coincida con el grado al que se une el estudiante (p. ej., filtre para "Grado 5"). Anote el `education_grade_id` para usarlo en el paso 5.

**Paso 3 — Crear la cuenta de usuario del estudiante:** Envíe una solicitud POST a `security-users` con los campos requeridos: `first_name`, `last_name`, `date_of_birth` y `gender_id`. La respuesta devuelve el nuevo id de usuario — guárdelo como `student_id` para el paso 5.

**Paso 4 — Adjuntar documento de identidad (opcional):** Envíe una solicitud POST a `user-identities` con `user_id` (del paso 3), `identity_type_id` y `number`. Omita este paso si no se proporciona ningún documento de identidad.

**Paso 5 — Matricular al estudiante en la institución:** Envíe una solicitud POST a `institution-students` con `student_id` (del paso 3), `institution_id`, `education_grade_id` (del paso 2), `academic_period_id` (del paso 1) y `student_status_id: 1` (Actual). `start_date` por defecto es hoy si no se proporciona.

**Paso 6 — Vincular contacto del tutor (opcional):** Envíe una solicitud POST a `student-guardians` con `student_id`, `guardian_id` (el id de usuario preexistente del tutor) y `guardian_relation_id`. Omita este paso si no se proporciona información del tutor.

---

## Consulta de ejemplo

> "Matricular a la nueva estudiante Alina Ivanova, nacida el 2014-03-15, hembra, en Grado 4 en Avory Primary School."

El agente hará lo siguiente:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar este playbook
2. Seguir los pasos anteriores
3. Devolver la respuesta en lenguaje sencillo