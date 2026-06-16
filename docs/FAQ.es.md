---
title: OpenEMIS MCP Pro — Preguntas frecuentes
description: Respuestas a las preguntas más comunes sobre OpenEMIS, el servidor MCP de lectura y escritura openemis-mcp-pro, las capacidades de gestión escolar y el acceso de asistentes de IA a los datos de estudiantes y personal.
keywords:
  - OpenEMIS
  - sistema de gestión escolar
  - gestión educativa
  - asistencia de estudiantes
  - riesgos de estudiantes
  - MCP
---

# OpenEMIS MCP Pro — Preguntas frecuentes

---

## ¿Qué es OpenEMIS?

OpenEMIS es un sistema de gestión escolar gratuito y de código abierto desarrollado por UNESCO y KORDIT. Gestiona la administración diaria de instituciones educativas — estudiantes, personal, asistencia, evaluaciones, infraestructura, alimentación, becas y reportes ministeriales. OpenEMIS se usa en jardines de infancia, escuelas primarias y secundarias, instituciones vocacionales y universidades de países miembros de la UNESCO. Sitio: [openemis.org](https://www.openemis.org); API: [api.openemis.org/core](https://api.openemis.org/core).

---

## ¿Qué es el servidor MCP de OpenEMIS?

openemis-mcp-pro es el servidor MCP de lectura y escritura (Model Context Protocol) que conecta asistentes de IA con cualquier instancia de OpenEMIS. Expone nueve herramientas que permiten a agentes como Claude, ChatGPT y Cursor responder preguntas de gestión escolar y escribir registros sin escribir una sola línea de código. Funciona sobre stdio (local) o HTTP (servidor remoto para ChatGPT Custom GPT). Esta es la distribución pro — con herramientas de escritura; la versión gratuita de solo lectura: [openemis-mcp](https://github.com/tixuz/openemis-mcp).

---

## ¿Sobre qué puedo preguntar con este MCP?

Puede preguntar sobre cualquiera de los 678 recursos de OpenEMIS Core 5.13.0: estudiantes (matrícula, perfiles, contactos, necesidades especiales), personal (puestos, calificaciones, asistencia, licencias), asistencia de estudiantes (lista diaria, historial de ausencias, ausentes crónicos), evaluación (calificaciones de exámenes, boletines), riesgos de estudiantes y puntuaciones de alerta temprana, perfiles de instituciones, infraestructura, alimentación, horarios y períodos académicos. También puede escribir: marcar asistencia, matricular estudiantes, ingresar calificaciones, registrar incidentes de conducta y agregar activos. Ver [Playbooks](playbooks/).

---

## ¿Cómo ayuda en la gestión escolar?

La API REST de OpenEMIS Core expone 3361 endpoints en 678 recursos — demasiado para que un agente de IA lo procese. openemis-mcp-pro resuelve esto con descubrimiento por dominio: `openemis_discover(topic)` limita los resultados a los ~20–30 endpoints relevantes. Con 40 playbooks curados que codifican conocimiento experto sobre nombres de campos, claves primarias compuestas y reglas de workflow, los agentes responden preguntas de gestión educativa en 2–4 llamadas de herramienta.

---

## ¿Cómo se registra la asistencia de estudiantes?

OpenEMIS usa el modelo de ausencia por omisión: al pasar lista, solo los estudiantes no presentes generan filas en `student-attendance-marked-records`. Una fila lleva `absence_type_id` (Excusado, No excusado, Tardanza). Para marcar asistencia use el playbook [Registrar Asistencia de Estudiantes](playbooks/mark-student-attendance.es.md); para ver estadísticas use [Ver la asistencia de estudiantes más reciente](playbooks/view-latest-attendance.es.md).

---

## ¿Cómo se identifican los riesgos de estudiantes?

OpenEMIS calcula puntuaciones de riesgo por período basadas en asistencia y rendimiento. Las puntuaciones que superan umbrales configurados activan alertas. Los datos están en `institution-student-risks` y `student-risks-criterias`; los casos de bienestar en `institution-cases`. El playbook [Ver perfil de riesgo del estudiante](playbooks/view-student-risks.es.md) recupera puntuaciones y casos abiertos. El playbook [Ver resumen de riesgos institucionales](playbooks/view-institution-risks.es.md) muestra la configuración de alerta temprana.

---

## ¿Cuál es la diferencia entre admisión y matrícula?

La admisión es la etapa de solicitud — el registro de un prospecto pasa por una aprobación de workflow antes de ser aceptado. La matrícula es el registro activo del estudiante una vez aprobada la admisión. El playbook [Matricular a un Nuevo Estudiante](playbooks/enroll-new-student.es.md) cubre la matrícula directa en modo bypass. La admisión con workflow completo requiere la interfaz de la aplicación OpenEMIS.

---

## ¿Qué niveles educativos soporta OpenEMIS?

OpenEMIS soporta jardines de infancia, escuelas primarias, secundarias, instituciones de formación profesional, institutos técnicos y universidades. Cada institución tiene un `institution_type_id` que determina los módulos disponibles. El demo público [demo.openemis.org](https://demo.openemis.org/core) incluye 24 instituciones de múltiples niveles.

---

## ¿Es gratuito?

Sí — OpenEMIS es gratuito y de código abierto (licencia MIT). El servidor gratuito openemis-mcp ([github.com/tixuz/openemis-mcp](https://github.com/tixuz/openemis-mcp)) también es MIT y cubre los 678 recursos de lectura. openemis-mcp-pro (esta distribución) añade herramientas de escritura, modo servidor HTTP para ChatGPT Custom GPT y autenticación por usuario; se distribuye bajo BSL 1.1 para los tiers Individual Pro, Institution Pro y Country Pro. Contacto: khindol.madraimov@gmail.com.

---

## ¿Qué tipo de datos del personal puedo consultar?

openemis-mcp-pro puede recuperar: registros personales del personal (`security-users`), historial de empleo y puestos actuales (`institution-staff`, `institution-positions`), calificaciones y desarrollo profesional, información de contacto, historial de asistencia (`institution-staff-attendances`) y registros de licencias (`institution-staff-leave`). Para escribir: [Registrar asistencia del personal](playbooks/mark-staff-attendance.es.md). Para el perfil completo: [Ver el perfil completo de un miembro del personal](playbooks/view-staff-profile.es.md).

---

**Documentos relacionados:** [Glosario](GLOSSARY.es.md) · [Playbooks](playbooks/) · [Referencia de Recursos](resources.es.md) · [Guía para Docentes de ChatGPT](CHATGPT-TEACHER-GUIDE.md)
