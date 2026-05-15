---
title: Generar informe PDF de estadísticas de la institución en OpenEMIS
description: Este playbook de OpenEMIS explica cómo compilar datos y descargar un informe PDF de estadísticas de la institución del sistema de gestión escolar.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
---

# Generar Informe PDF de Estadísticas de la Institución en OpenEMIS


**Dominio:** Reporte · **Audiencia:** admin

Un administrador solicita un PDF resumen para una institución que cubra estadísticas de matrícula, personal y asistencia. Este manual describe los pasos de búsqueda de datos; el PDF real se genera dentro de la aplicación OpenEMIS.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `institutions` | Proporciona el id y perfil de la institución: el ancla para todas las consultas estadísticas. |
| `report-card-processes` | Registros de procesos a nivel del sistema para trabajos de generación de informes: utilizados para rastrear el estado de un trabajo de generación de estadísticas si se activa. |
| `institution-report-card-processes` | Registros de procesos específicos de la institución que rastrean el estado de generación del PDF para esta institución en particular. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Identificar la plantilla del informe | `openemis_get` | Buscar la plantilla de informe personalizada configurada para las estadísticas institucionales. |
| 2 | Iniciar la generación | `openemis_create` | POST a report-card-processes con el id de la plantilla y el id de la institución para iniciar la generación del PDF. |
| 3 | Consultar y descargar | `openemis_get` | Verificar el estado del proceso periódicamente hasta que este alcance "completado", y luego recuperar el enlace de descarga. |

### Notas del paso

**Paso 1 — Identificar la plantilla del informe:** Tenga en cuenta que `custom-reports` no está disponible a través de la API REST v5. La generación del PDF estadístico utiliza el motor de informes dentro de la propia aplicación OpenEMIS. Este paso debe implicar verificar `report-card-processes` o `institution-report-card-processes` en busca de plantillas disponibles configuradas en esta institución.

**Paso 2 — Iniciar la generación:** Si la plantilla es accesible a través de la API v5, POST a `report-card-processes` con el id de la plantilla, el id de la institución y cualquier parámetro de rango de fechas. Si la plantilla no es accesible a través de v5, dirija al usuario a activar el PDF desde la interfaz gráfica de la aplicación.

**Paso 3 — Consultar y descargar:** Una vez obtenido un id de proceso, llame a `institution-report-card-processes` con el id del proceso para verificar su estado. Cuando el estado alcance "completed", la respuesta incluirá una URL o ruta de archivo para el PDF generado.

---

## Consulta de ejemplo

> "Generar el PDF estadístico anual para Lincoln Primary School."

El agente hará lo siguiente:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar este manual de procedimientos.
2. Seguir los pasos anteriores.
3. Devolver la respuesta en lenguaje sencillo.

---

## Notas

NOTA: `custom-reports` no está disponible a través de la API REST v5. La generación del PDF estadístico utiliza el motor de informes dentro de la aplicación. Este manual de procedimientos cubre únicamente la búsqueda de datos: active el PDF desde la interfaz gráfica de la aplicación.