---
title: Generar el boletín de calificaciones del estudiante en OpenEMIS (PDF)
description: Este playbook de OpenEMIS explica cómo iniciar la generación de un boletín de calificaciones PDF y obtener el enlace de descarga del sistema de gestión escolar.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
---

# Generar el boletín de calificaciones del estudiante en OpenEMIS (PDF)


**Dominio:** Informe · **Audiencia:** profesor, administrador

Desencadena el generador de boletines de calificaciones asíncrono para un estudiante. Devuelve un identificador de proceso que el llamante consulta hasta que el PDF esté listo para descargar. Este es un flujo de trabajo de dos fases: iniciar la generación y luego esperar que el estado sea "completado" antes de obtener el enlace de descarga.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `institution-students-report-cards` | Contiene el registro final del boletín de calificaciones una vez que se completa la generación, incluida la URL de descarga del PDF. |
| `institution-report-cards` | Enumera las plantillas de boletines de calificaciones configuradas para la institución y el período académico, que es el punto de partida para identificar qué plantilla generar. |
| `institution-report-card-processes` | El objetivo de escritura para activar la generación y el objetivo de sondeo para verificar el estado; cada fila rastrea un trabajo de generación. |
| `report-card-processes` | Registros de proceso a nivel del sistema para los trabajos de generación del boletín de calificaciones, utilizados como un endpoint alternativo o complementario de estado. |
| `report-card-email-processes` | Rastrea los trabajos de entrega de correo electrónico si el boletín de calificaciones está configurado para ser enviado a los tutores después de la generación. |
| `report-card-subjects` | Enumera qué asignaturas se incluyen en la plantilla del boletín de calificaciones; contexto útil antes de activar la generación. |
| `report-card-comment-codes` | Referencia para los códigos de comentarios que pueden aparecer en el boletín de calificaciones generado (por ejemplo, códigos narrativos del profesor). |
| `institution-students-report-cards-comments` | Almacena los comentarios del profesor adjuntos al boletín de calificaciones de este estudiante, incluidos en la salida PDF. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Identificar el boletín de calificaciones configurado | `openemis_get` | Encontrar la plantilla del boletín de calificaciones para esta institución y período académico para obtener el `report_card_id`. |
| 2 | Iniciar la generación | `openemis_create` | POST a `institution-report-card-processes` para comenzar el trabajo de generación asíncrona del PDF. |
| 3 | Consultar la finalización | `openemis_get` | Verificar el estado del proceso periódicamente hasta que alcance "completado". |
| 4 | Obtener la URL del PDF | `openemis_get` | Una vez completado, recuperar el enlace de descarga desde `institution-students-report-cards`. |

### Notas del paso

**Paso 1 — Identificar el boletín de calificaciones configurado:** Llame a `institution-report-cards` filtrando por `institution_id` y `academic_period_id`. Si existen múltiples plantillas para el mismo período (por ejemplo, una por grado), acote por `education_grade_id` o pregunte al usuario cuál usar. Anote el `report_card_id`; es necesario tanto para la llamada de generación como para la obtención final.

**Paso 2 — Iniciar la generación:** POST a `institution-report-card-processes` con `institution_id`, `student_id` y `report_card_id` en el cuerpo. La respuesta incluye un identificador de proceso; guárdelo para el paso de sondeo.

**Paso 3 — Consultar la finalización:** Llame a `institution-report-card-processes` con el identificador de proceso para verificar el campo de estado. La generación es asíncrona; consulte a un intervalo razonable (por ejemplo, cada pocos segundos) hasta que el estado sea "completado" o se devuelva un estado de error.

**Paso 4 — Obtener la URL del PDF:** Llame a `institution-students-report-cards` filtrando por `student_id` y `report_card_id`. El registro completado contendrá la URL o la ruta del archivo para descargar el PDF generado.

---

## Consulta de ejemplo

> "Genere un boletín de calificaciones en PDF para la estudiante Mariam del trimestre actual."

El agente hará lo siguiente:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar este playbook
2. Seguir los pasos anteriores
3. Devolver la respuesta en lenguaje sencillo