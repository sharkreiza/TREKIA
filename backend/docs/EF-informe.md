# Entrega Final — Backend

## EF 1: Funcionalidades nuevas

### Notificaciones (RF-14)

Tabla `notificaciones` con `usuario_id`, `tipo`, `mensaje`, `enlace` (la pantalla de la app a la que lleva), `leida` y `fecha_creacion`. Se borran solas si se elimina el usuario (`ON DELETE CASCADE`).

Las notificaciones se crean en los controladores, después de que la acción principal ya se guardó, con `utils/notificar.js`:

| Acción | Controlador | Notificación |
|---|---|---|
| Pedir unirse a un grupo | `solicitudes.controller.crear` | Al creador: "Matías Rojas quiere unirse a tu grupo …" |
| Aceptar o rechazar una solicitud | `solicitudes.controller.responder` | Al solicitante: "Tu solicitud para unirte a … fue aceptada" |
| Cancelar un grupo | `grupos.controller.actualizar` | A cada participante aceptado: "El grupo … fue cancelado" |
| Enviar una solicitud de amistad | `amistades.controller.crear` | Al destinatario |
| Aceptar una solicitud de amistad | `amistades.controller.responder` | A quien la envió |
| Revisar una propuesta | `propuestas.controller.revisar` | Al autor, con el enlace a la ruta publicada si se aprobó |

Si guardar la notificación falla, el error se registra en la consola y la respuesta no cambia, porque la acción principal ya se realizó. Para varios destinatarios se usa un solo `INSERT ... SELECT unnest($1::int[])`.

Cada usuario solo puede ver, marcar o eliminar sus propias notificaciones: todas las consultas filtran por `usuario_id = req.usuario.id`, así que la notificación de otra persona responde 404, igual que una que no existe.

### Configuración de la cuenta (RF-13)

Columnas nuevas en `usuarios`: `correo_adicional` (opcional) y `zona_horaria` (por defecto `America/Santiago`). `PATCH /usuarios/me` valida que el correo adicional sea un correo válido y distinto del principal, y que la zona horaria exista en la lista IANA de Node (`Intl.supportedValuesOf('timeZone')`). Enviar `""` como correo adicional lo elimina. La base de datos también lo controla con el `CHECK chk_correo_adicional_distinto`.

### Filtros de grupos (RF-06)

`GET /grupos` acepta además `hasta` (fecha), `horario` (`manana`, `tarde` o `noche`), `cupoMax` (grupos de hasta N personas) y `conCupos=true` (solo grupos con lugar). Los rangos de horario están en la lista blanca `GRUPO_HORARIOS` de `db/columnas.js`, así que el texto SQL nunca incluye lo que envía el usuario.

## EF 3: Seguridad

Lo que ya existía desde la EP2: contraseñas con bcrypt, JWT con algoritmo fijo y expiración, roles, CORS limitado a `CORS_ORIGINS`, helmet, límite de intentos de login y registro, consultas parametrizadas, listas blancas de columnas y errores sin detalles internos.

Lo nuevo en la Entrega Final:

- **Protección contra XSS almacenado.** `middlewares/sanitizar.js` se ejecuta antes de todas las rutas y quita las etiquetas HTML y los caracteres de control de todos los textos del cuerpo (también dentro de objetos y listas). La contraseña no se modifica porque se guarda como hash. React ya escapa lo que muestra, pero así la API tampoco guarda ni entrega HTML que otro cliente pueda ejecutar.

  | Se envía | Se guarda |
  |---|---|
  | `Hola <script>alert(1)</script>` | `Hola alert(1)` |
  | `<img src=x onerror=alert(2)> mundo, 3 < 5` | ` mundo, 3 < 5` |
  | `<b></b>` | `""` (y la validación responde que el campo es obligatorio) |

- **Sin datos de más.** `GET /usuarios/:id` usa una lista de columnas aparte (`USUARIO_COLUMNAS_PERFIL`) sin `correo`, `correo_adicional` ni `zona_horaria`. Antes mostraba el correo de cualquier usuario a quien tuviera sesión.
- **Errores del servicio externo.** Si Open-Meteo no responde se devuelve 503, y si responde mal 502, con un mensaje genérico. El detalle queda solo en la consola del servidor.

## EF 4: Consultas eficientes

Índices nuevos (en `trekia_schema.sql` y en `migracion_ef.sql`):

| Índice | Consulta que acelera |
|---|---|
| `idx_comentarios_ruta_fecha (ruta_id, fecha_creacion DESC)` | Comentarios de una ruta, ya ordenados |
| `idx_grupos_fecha_salida`, `idx_grupos_ruta`, `idx_grupos_creador` | Listado de grupos por fecha, por ruta y "Mis grupos" |
| `idx_solicitudes_grupo_estado (grupo_id, estado)` | Conteo de participantes aceptados de cada grupo |
| `idx_solicitudes_usuario` | "Mis solicitudes" |
| `idx_amistades_destinatario_estado` | Solicitudes de amistad recibidas pendientes |
| `idx_propuestas_usuario`, `idx_propuestas_estado` | "Mis propuestas" y propuestas pendientes del administrador |
| `idx_publicaciones_fecha` | Publicaciones de la comunidad, de la más nueva a la más antigua |
| `idx_rutas_visibilidad_region` | Rutas públicas filtradas por región |
| `idx_notificaciones_usuario_fecha` | Notificaciones del usuario ordenadas |
| `idx_notificaciones_no_leidas` (índice parcial `WHERE leida = false`) | Contador de la campana, que la app consulta cada minuto |

Otros cambios:

- **Paginación** (`limite` y `pagina`) en comentarios, publicaciones y notificaciones. Antes los comentarios se devolvían todos y las publicaciones tenían un `LIMIT 50` fijo.
- **Participantes de un grupo con `JOIN LATERAL`.** El conteo se calcula una vez por grupo y se puede usar en el `WHERE` (filtro `conCupos`) sin repetir la subconsulta.
- **Contador liviano.** `GET /notificaciones/no-leidas` devuelve solo `{ total }`, para que la campana no descargue la lista completa cada minuto.
- **Caché del clima.** El pronóstico de cada ruta se guarda 30 minutos en memoria, así varias personas viendo la misma ruta generan una sola llamada a Open-Meteo.

## EF 5: Integración con Open-Meteo

[Open-Meteo](https://open-meteo.com/) es un servicio gratuito de pronóstico del tiempo que no necesita API key. Se eligió porque el problema de Trekia incluye la seguridad en la montaña, y SENAPRED recomienda revisar el pronóstico antes de salir.

- **Dónde:** `src/integraciones/openMeteo.js`, usado por `GET /rutas/:id/clima`.
- **Qué pide:** con la latitud y longitud de la ruta, el pronóstico diario (código del tiempo, temperatura máxima y mínima, probabilidad de lluvia y viento máximo) en la zona horaria de la ruta (`timezone=auto`).
- **Qué devuelve:** los datos en español y con nombres propios de la API (`descripcion`, `temperatura_max`, `probabilidad_lluvia`...), sin depender del formato de Open-Meteo en el frontend.
- **Configuración:** `CLIMA_API_URL`, `CLIMA_TIMEOUT_MS` y `CLIMA_CACHE_MINUTOS` en `.env`. Si Open-Meteo pidiera una clave en el futuro, se agregaría como otra variable de entorno.
- **Errores:** sin conexión o pasado el tiempo máximo → 503; respuesta con error o formato inesperado → 502; ruta sin coordenadas → 404. En la app, la sección del clima muestra el mensaje y un botón para reintentar sin afectar el resto de la pantalla.
- **Uso en la app:** pronóstico de 7 días en el detalle de cada ruta y, en el detalle de un grupo, el clima del día de la salida (si faltan 16 días o menos), con un aviso si la probabilidad de lluvia es de 50 % o más.

## EF 6: Docker

`backend/Dockerfile` usa `node:22-slim` (no Alpine, por el módulo nativo de bcrypt), instala solo las dependencias de producción con `npm ci --omit=dev`, ejecuta la API con el usuario `node` (sin permisos de administrador) y fija `TZ=America/Santiago`, porque las fechas de la base de datos se guardan sin zona horaria. El `docker-compose.yml` que levanta la base de datos, la API y el frontend está en la rama `main`.

## Pruebas

La colección de Postman tiene ahora 113 peticiones y 258 verificaciones. La carpeta **12. Entrega Final** prueba:

- Notificaciones: sin sesión (401), lista del usuario, contador, marcar una, marcar la de otra persona (404), filtro inválido (400), marcar todas, eliminar.
- RF-13: guardar correo adicional y zona horaria, valores inválidos (400), correo igual al principal (400), perfil de otra persona sin correos.
- RF-06: filtros por cupos, tamaño, horario y fechas, horario inválido (400).
- XSS: una publicación con `<script>` y `<img onerror>` se guarda sin etiquetas.
- Paginación de comentarios.
- Clima: pronóstico de 3 días (200, o 503 si no hay conexión a internet), días fuera de rango (400), ruta inexistente (404).

Para ejecutarla y guardar la evidencia, con la base de datos recién creada y el servidor encendido:

```bash
npx -p newman -p newman-reporter-htmlextra newman run docs/Trekia.postman_collection.json \
  -r cli,htmlextra --reporter-htmlextra-export docs/evidencia/reporte-newman-ef.html \
  | tee docs/evidencia/resultado-newman-ef.txt
```
