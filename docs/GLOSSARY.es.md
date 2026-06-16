---
title: OpenEMIS MCP Pro — Glosario de términos de gestión escolar
description: Definiciones de los términos clave de OpenEMIS y gestión educativa usados en la documentación del servidor MCP de lectura y escritura openemis-mcp-pro.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
  - asistencia de estudiantes
  - riesgos de estudiantes
  - MCP
---

# OpenEMIS MCP Pro — Glosario de términos de gestión escolar

Este glosario define los términos principales usados en la documentación de openemis-mcp-pro. Cada entrada explica el concepto, cómo aparece en OpenEMIS y enlaza al playbook o recurso correspondiente.

---

### OpenEMIS

OpenEMIS es un sistema de gestión escolar gratuito y de código abierto desarrollado por UNESCO y KORDIT. Gestiona la administración diaria de instituciones educativas en todos los niveles — desde jardines de infancia hasta escuelas primarias, secundarias, instituciones de formación profesional y universidades — en países miembros de la UNESCO. Más información: [openemis.org](https://www.openemis.org) y la [Referencia de Recursos](resources.es.md).

### OpenEMIS Core

OpenEMIS Core es la capa de aplicación principal basada en CakePHP con una API REST versionada (`/api/v5/`). Core 5.13.0 es la línea base de esta distribución, con 678 recursos y 3361 endpoints. También son compatibles las versiones 5.7–5.9. Documentación: [api.openemis.org/core](https://api.openemis.org/core).

### MCP (Model Context Protocol)

MCP es un protocolo abierto que permite a los asistentes de IA (Claude, ChatGPT, Cursor, Cline) llamar a herramientas externas como llamadas a funciones estructuradas. openemis-mcp-pro implementa MCP sobre stdio (subproceso local) y HTTP (servidor remoto), exponiendo nueve herramientas para acceso de lectura y escritura a cualquier instancia de OpenEMIS.

### Sistema de gestión escolar

Un sistema de gestión escolar centraliza los registros administrativos de una institución educativa — matrícula de estudiantes, asistencia, evaluación, personal, infraestructura y reportes. OpenEMIS es el sistema de gestión escolar respaldado por UNESCO; openemis-mcp-pro es el puente de IA que proporciona acceso en lenguaje natural a sus datos.

### Gestión educativa

La gestión educativa abarca la administración, planificación y supervisión de instituciones y sistemas educativos — desde escuelas individuales hasta reportes ministeriales. OpenEMIS apoya la gestión educativa en todos estos niveles.

### Asistencia de estudiantes

La asistencia de estudiantes en OpenEMIS se registra con el modelo de ausencia por omisión: solo los estudiantes no presentes (ausentes, tardanza, excusados) generan filas en `student-attendance-marked-records`. Un estudiante sin fila en un día marcado se considera presente. Ver [Registrar Asistencia de Estudiantes](playbooks/mark-student-attendance.es.md) y [Ver la asistencia de estudiantes más reciente](playbooks/view-latest-attendance.es.md).

### Asistencia del personal

La asistencia del personal cubre dos flujos separados en OpenEMIS: un registro simple de presencia en `institution-staff-attendances` y una solicitud de licencia en `institution-staff-leave` (controlada por workflow, requiere aprobación). Las tablas están desacopladas. Ver [Registrar asistencia del personal](playbooks/mark-staff-attendance.es.md).

### Riesgos de estudiantes / alerta temprana

OpenEMIS calcula puntuaciones de riesgo por estudiante basadas en criterios configurables (tasa de asistencia, rendimiento académico, incidentes de conducta). Las puntuaciones que superan un umbral activan reglas de alerta. Los datos de riesgo se almacenan en `institution-student-risks` y `student-risks-criterias`. Ver [Ver perfil de riesgo del estudiante](playbooks/view-student-risks.es.md) y [Ver resumen de riesgos institucionales](playbooks/view-institution-risks.es.md).

### Incidente de conducta

Un incidente de conducta es un evento disciplinario o de bienestar registrado para un estudiante: categoría (acoso, alteración, preocupación de bienestar), gravedad, fecha y acción de seguimiento. Se escribe en `institution-student-behavior-records` a través de [Registrar un incidente de conducta estudiantil](playbooks/record-behavior-incident.es.md).

### Workflow / cola de admisión / cola de matrícula

OpenEMIS usa el plugin CakePHP Workflow para gestionar procesos de aprobación de varios pasos. El workflow más común es admisión → matrícula. Los recursos controlados por workflow no pueden escribirse directamente vía API; use el playbook apropiado o la interfaz de la aplicación OpenEMIS. Consulte `openemis_get_playbook({ id: "explain-workflow-system" })`.

### Institución (jardín de infancia, primaria, secundaria, vocacional, universidad)

Una institución en OpenEMIS es cualquier establecimiento educativo — jardines de infancia, escuelas primarias, secundarias, instituciones de formación profesional, institutos técnicos y universidades — modelados como `institutions` con un `institution_type_id`. El demo público [demo.openemis.org](https://demo.openemis.org/core) incluye 24 instituciones de múltiples tipos.

### Período académico

Un período académico es un intervalo de tiempo nombrado (año escolar, semestre, trimestre) que delimita la mayoría de los datos en OpenEMIS. Período actual: `GET /api/v5/academic-periods?current=1`.

### Grado educativo

Un grado educativo (p. ej. Grado 1, Grado 10) representa un nivel dentro de un sistema educativo. Los grados se definen en `education-grades` y se vinculan a un `education_system_id`.

### Sección / clase

Una sección o clase (`institution-classes`) es la unidad de instrucción — tiene un tutor, un grado, una lista de estudiantes matriculados y un conjunto de materias. Ver [Ver el perfil completo de la clase](playbooks/view-class-profile.es.md).

### Calificación de examen / boletín de calificaciones

Una calificación de examen es una puntuación numérica registrada en `assessment-item-results` para un estudiante, un elemento de evaluación y un período académico. Ver [Ingresar calificaciones de examen](playbooks/submit-exam-marks.es.md) y [Generar el boletín de calificaciones PDF](playbooks/generate-student-report-card-pdf.es.md).

### Materia / currículo

Una materia (`education-subjects`) es una disciplina enseñada (Matemáticas, Ciencias, Lengua). Las materias se vinculan a grados a través del currículo; el conjunto de materias activas de una clase está en `institution-class-subjects`.

### Playbook

Un playbook en openemis-mcp-pro es una guía paso a paso curada que indica al agente de IA qué recursos llamar, en qué orden y con qué parámetros para completar una tarea de gestión escolar. Esta distribución tiene 40 playbooks — 26 de lectura y 14 de escritura/auth. Cargar un playbook: `openemis_get_playbook({ id: "id-del-playbook" })`.

### Recurso (en términos de MCP)

En openemis-mcp-pro, un recurso es un identificador en kebab-case que corresponde a una familia de endpoints de la API de OpenEMIS: por ejemplo `institution-students` o `student-attendance-marked-records`. Se pasa como parámetro `resource` a `openemis_get`, `openemis_create`, `openemis_update` o `openemis_delete`. La lista completa de 678 recursos está en [resources.es.md](resources.es.md).

---

**Documentos relacionados:** [Preguntas frecuentes](FAQ.es.md) · [Playbooks](playbooks/) · [Referencia de Recursos](resources.es.md) · [Guía para Docentes de ChatGPT](CHATGPT-TEACHER-GUIDE.md)
