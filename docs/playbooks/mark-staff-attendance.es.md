# Registrar Asistencia del Personal (Presente) O Solicitar Licencia (Ausente)

> 📖 **Servidor de solo lectura.** Los Playbooks que crean o actualizan registros requieren **[openemis-mcp-pro](https://github.com/tixuz/openemis-mcp-pro)**.

**Dominio:** Personal · **Audiencia:** admin, hr, profesor

Dos flujos distintos — no los mezcle. El estado **PRESENTE** es un registro rápido de entrada con la opción de registrar hora de entrada/salida mediante `institution-staff-attendances` (clave primaria simple, no se requiere aprobación). **AUSENTE** significa una solicitud de licencia con un tipo de licencia, registrada mediante `institution-staff-leave`, la cual está controlada por flujo de trabajo y requiere la aprobación del supervisor antes de entrar en vigor. Estos escriben en tablas diferentes y siguen procesos completamente distintos.

---

## Recursos

| Recurso | Rol en este flujo de trabajo |
|---|---|
| `institution-staff-position-profiles` | Se utiliza para buscar la asignación actual de un miembro del personal y confirmar que está activo en la institución antes de registrar la asistencia. |
| `institution-staff-attendances` | El destino de escritura para los registros de presencia — registra la fecha, hora de entrada, hora de salida opcional y cualquier comentario. No se requiere cadena de aprobación. |
| `institution-staff-leave` | El destino de escritura para las solicitudes de licencia — requiere un tipo de licencia y pasa por la cadena de aprobación del flujo de trabajo. Las operaciones de lectura siempre son seguras. |
| `staff-leave-types` | Catálogo de referencia de tipos de licencia (Vacaciones Anuales, Enfermedad, etc.) — utilizado para identificar el id correcto del tipo de licencia cuando se prepara una solicitud de licencia. |
| `absence-types` | Tabla de referencia para códigos de ausencia — útil al registrar una nota opcional de ausencia junto con un registro de asistencia del personal. |

---

## Pasos

| # | Título | Herramienta | Propósito |
|---|---|---|---|
| 1 | Confirmar endpoint v5 solamente | — | Los registros de presencia van a POST /api/v5/institution-staff-attendances; las solicitudes de licencia a POST /api/v5/institution-staff-leave. Nunca utilice rutas legadas v4. |
| 2 | Listar personal activo en la institución | `openemis_get` | Obtener el personal filtrado por institution_id y status_id=1 para confirmar el id del miembro del personal. |
| 3 | Registrar presencia | `openemis_create` | POST a institution-staff-attendances con staff_id, institution_id, academic_period_id, date y time_in. |
| 4 | Manejar solicitud de licencia (ausente) | — | Para ausencia/licencia, NO cree a través de MCP — institution-staff-leave está controlado por flujo de trabajo y requiere aprobación humana. Redirija al usuario a la aplicación oficial de OpenEMIS. |

### Notas sobre los pasos

**Paso 3 — Registrar presencia:** El cuerpo requiere `staff_id`, `institution_id`, `academic_period_id`, `date` (AAAA-MM-DD) y `time_in` (HH:MM:SS). `time_out` y `comment` son opcionales. Esto escribe directamente en `institution-staff-attendances` sin ningún paso de aprobación.

**Paso 4 — Manejar solicitud de licencia:** Cuando un usuario solicita marcar a un miembro del personal como ausente por licencia, NO intente crear un registro en `institution-staff-leave` a través del MCP. La licencia está controlada por flujo de trabajo: un POST nuevo aterriza en el estado inicial del flujo de trabajo configurado y requiere la aprobación del supervisor a través de la aplicación. Responda con: "Este proceso involucra flujo de trabajo y asignación para aprobación. Por favor, utilice la aplicación o sitio web oficial de OpenEMIS para enviar y aprobar la licencia." Usted puede leer `staff-leave-types` de forma segura para mostrar al usuario sus opciones de tipo de licencia.

---

## Consulta de ejemplo

> "Marcar a la Sra. Ashton como presente hoy a las 8:30 AM."

El agente hará lo siguiente:
1. Llamar a `openemis_discover` o `openemis_list_playbooks` para encontrar este playbook
2. Seguir los pasos anteriores
3. Devolver la respuesta en lenguaje sencillo

---

## Notas

- No existe el alias v5 `staff-leaves` — utilice `institution-staff-leave` (singular, prefijado por institución).
- LICENCIA Y ASISTENCIA ESTÁN TOTALMENTE DESACOPLADOS: crear una fila de licencia NO inserta automáticamente una fila de "ausente" en institution-staff-attendances, y publicar un registro de asistencia NO comprueba licencias superpuestas. Antes de publicar la asistencia, verifique institution-staff-leave para esa fecha para evitar conflictos.
- Para leer el panorama completo de asistencia de un miembro del personal, debe unir `institution-staff-attendances` e `institution-staff-leave` en el lado del cliente — el backend no los une.
- Para registros de licencia históricos o migrados, consulte `historical-staff-leave` e `institution-staff-leave-archived` — estos son recursos de referencia de solo lectura.
- ADVERTENCIA DE ESCRITURA DEL FLUJO DE TRABAJO: institution-staff-leave está controlado por flujo de trabajo. El MCP NO debe crear, actualizar o eliminar solicitudes de licencia. Leer licencias mediante `openemis_get` siempre es seguro.