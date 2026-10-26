# Documentación de endpoints — Trekia API

URL base: `http://localhost:3000/api`

## Formato de las respuestas

Todas las respuestas son JSON con la misma forma:

```json
{ "ok": true, "data": { }, "message": "OK", "errors": null }
```

Cuando hay un error, `ok` es `false` y `data` es `null`. Si el error es de validación, `errors` trae un mensaje por campo:

```json
{
  "ok": false,
  "data": null,
  "message": "Datos inválidos",
  "errors": [{ "campo": "correo", "mensaje": "El correo no es válido" }]
}
```

## Autenticación

Los endpoints marcados **Con sesión** necesitan el token que devuelven `/auth/login` o `/auth/register`, en el header:

```
Authorization: Bearer <token>
```

El token dura lo que indique `JWT_EXPIRES_IN` (2 horas por defecto). El rol (`usuario` o `administrador`) va dentro del token y define qué puede hacer cada persona.

## Códigos HTTP

| Código | Cuándo se usa |
|---|---|
| 200 | Consulta, modificación o eliminación correcta |
| 201 | Recurso creado |
| 400 | Datos inválidos, id no numérico, JSON mal escrito o dato que no cumple las restricciones de la base de datos |
| 401 | Falta el token, es inválido, expiró o las credenciales son incorrectas |
| 403 | Hay sesión, pero no se tienen permisos para la acción |
| 404 | El recurso o el endpoint no existe |
| 409 | Conflicto: registro repetido, se intenta eliminar algo que otros registros usan, o la acción ya no se puede hacer (solicitud ya respondida, grupo completo, propuesta ya revisada) |
| 413 | El cuerpo de la petición supera los 10 kB |
| 429 | Demasiados intentos de inicio de sesión o registro |
| 500 | Error interno; el detalle solo queda en la consola del servidor |

Todo `:id` de la URL debe ser un entero positivo; si no, se responde 400.

---

## Salud

### `GET /salud`
Comprueba que el servidor está funcionando. **Público.**

Respuesta `200`: `{ "ok": true, "data": null, "message": "Servidor funcionando" }`

---

## Autenticación

### `POST /auth/register`
Registra un usuario. **Público.** Máximo 5 registros por hora desde una misma IP.

| Campo | Tipo | Reglas |
|---|---|---|
| `nombre` | texto | Obligatorio, entre 2 y 100 caracteres |
| `correo` | texto | Obligatorio, correo válido, máximo 150 caracteres. Se guarda en minúsculas |
| `password` | texto | Obligatorio, entre 8 y 72 caracteres, con al menos una letra y un número |

Si se envía `rol`, se ignora: todo registro queda como `usuario`.

```json
{ "nombre": "Ana Pérez", "correo": "ana@gmail.com", "password": "Trekia123" }
```

| Respuesta | Caso |
|---|---|
| `201` | Devuelve `data.token` y `data.usuario` (sin la contraseña) |
| `400` | Datos inválidos |
| `409` | El correo ya está registrado |
| `429` | Demasiados registros |

### `POST /auth/login`
Inicia sesión. **Público.** Máximo 10 intentos cada 15 minutos desde una misma IP.

```json
{ "correo": "usuario@gmail.com", "password": "Trekia123" }
```

| Respuesta | Caso |
|---|---|
| `200` | Devuelve `data.token` y `data.usuario` |
| `400` | Falta el correo o la contraseña |
| `401` | Credenciales inválidas (el mismo mensaje si el correo no existe o la contraseña es incorrecta) |
| `429` | Demasiados intentos |

### `GET /auth/me`
Datos del usuario de la sesión. **Con sesión.**

| Respuesta | Caso |
|---|---|
| `200` | Devuelve el usuario |
| `401` | Sin token, token inválido o expirado |

---

## Usuarios

### `GET /usuarios/:id`
Perfil público de un usuario. **Con sesión.**

| Respuesta | Caso |
|---|---|
| `200` | Devuelve `id_usuario`, `nombre`, `correo`, `rol`, `ubicacion`, `biografia`, fotos y `fecha_creacion` |
| `400` | Id inválido |
| `401` | Sin sesión |
| `404` | El usuario no existe |

### `PATCH /usuarios/me`
Edita el perfil del usuario de la sesión. **Con sesión.** Todos los campos son opcionales; solo cambia lo que se envía.

| Campo | Tipo | Reglas |
|---|---|---|
| `nombre` | texto | Entre 2 y 100 caracteres |
| `ubicacion` | texto | Máximo 120 caracteres |
| `biografia` | texto | Máximo 500 caracteres |

```json
{ "ubicacion": "Valparaíso, Chile", "biografia": "Me gustan las rutas de cordillera." }
```

| Respuesta | Caso |
|---|---|
| `200` | Devuelve el perfil actualizado |
| `400` | Datos inválidos o no se envió ningún campo |
| `401` | Sin sesión |

---

## Rutas

Solo se muestran las rutas con visibilidad `publico`.

### `GET /rutas`
Lista las rutas. **Público.**

| Parámetro | Ejemplo | Descripción |
|---|---|---|
| `busqueda` | `cerro` | Busca en nombre, región y comuna |
| `region` | `Valparaíso` | Región exacta |
| `comuna` | `Olmué` | Comuna exacta |
| `dificultad` | `baja` | `baja`, `moderada` o `alta` |
| `tipoRecorrido` | `ida_vuelta` | `solo_ida` o `ida_vuelta` |
| `distanciaMin` / `distanciaMax` | `5` / `12` | Rango de distancia en km |
| `duracionMax` | `240` | Duración máxima en minutos |
| `orden` | `distancia` | `nombre`, `distancia`, `desnivel`, `duracion` o `fecha` |
| `direccion` | `desc` | `asc` (por defecto) o `desc` |
| `limite` | `20` | Entre 1 y 100 (por defecto 20) |
| `pagina` | `1` | Página de resultados |

Ejemplo: `GET /rutas?dificultad=baja&orden=distancia&direccion=desc`

| Respuesta | Caso |
|---|---|
| `200` | Lista de rutas |
| `400` | Algún parámetro tiene un valor no permitido |

### `GET /rutas/:id`
Detalle de una ruta. **Público.**

| Respuesta | Caso |
|---|---|
| `200` | Devuelve la ruta |
| `400` | Id inválido |
| `404` | La ruta no existe o no es pública |

### `POST /rutas`
Crea una ruta. **Administrador.** El creador es el usuario de la sesión.

| Campo | Tipo | Reglas |
|---|---|---|
| `nombre` | texto | Obligatorio, máximo 150 caracteres |
| `descripcion` | texto | Obligatorio, máximo 5000 caracteres |
| `region` | texto | Obligatorio, máximo 100 caracteres |
| `comuna` | texto | Obligatorio, máximo 100 caracteres |
| `dificultad` | texto | Obligatorio: `baja`, `moderada` o `alta` |
| `tipoRuta` | texto | Obligatorio, máximo 30 caracteres (por ejemplo `cumbre`, `laguna`) |
| `tipoRecorrido` | texto | `solo_ida` o `ida_vuelta` (por defecto `ida_vuelta`) |
| `distancia` | número | Kilómetros, mayor que 0 |
| `duracion` | entero | Minutos, entre 1 y 20160 |
| `desnivelPositivo` / `desnivelNegativo` | entero | Metros, entre 0 y 9000 |
| `latitud` / `longitud` | número | Entre -90 y 90 / entre -180 y 180 |
| `visibilidad` | texto | `publico`, `solo_amigos` o `privado` (por defecto `publico`) |

```json
{
  "nombre": "Cascada Las Ánimas",
  "descripcion": "Sendero junto al río con pozones y una cascada al final.",
  "region": "Metropolitana",
  "comuna": "San José de Maipo",
  "dificultad": "moderada",
  "tipoRuta": "cascada",
  "distancia": 8,
  "duracion": 240
}
```

| Respuesta | Caso |
|---|---|
| `201` | Devuelve la ruta creada |
| `400` | Datos inválidos o incompletos |
| `401` | Sin sesión |
| `403` | El usuario no es administrador |

### `PATCH /rutas/:id`
Modifica una ruta. **Administrador.** Acepta los mismos campos que `POST`, todos opcionales; solo cambia lo que se envía.

| Respuesta | Caso |
|---|---|
| `200` | Devuelve la ruta actualizada |
| `400` | Datos inválidos o no se envió ningún campo |
| `401` / `403` | Sin sesión / no es administrador |
| `404` | La ruta no existe |

### `DELETE /rutas/:id`
Elimina una ruta. **Administrador.**

| Respuesta | Caso |
|---|---|
| `200` | Ruta eliminada |
| `401` / `403` | Sin sesión / no es administrador |
| `404` | La ruta no existe |
| `409` | La ruta tiene grupos, comentarios o una propuesta asociada |

---

## Comentarios

### `GET /rutas/:id/comentarios`
Comentarios de una ruta, del más nuevo al más antiguo. **Público.** Cada comentario trae el nombre del `autor`.

| Respuesta | Caso |
|---|---|
| `200` | Lista de comentarios |
| `404` | La ruta no existe |

### `POST /rutas/:id/comentarios`
Comenta una ruta. **Con sesión.**

```json
{ "contenido": "Muy buena ruta, el último tramo tiene harta piedra suelta." }
```

`contenido` es obligatorio, entre 1 y 1000 caracteres (sin contar espacios al inicio y al final).

| Respuesta | Caso |
|---|---|
| `201` | Devuelve el comentario |
| `400` | Comentario vacío o demasiado largo |
| `401` | Sin sesión |
| `404` | La ruta no existe |

### `PATCH /comentarios/:id`
Edita un comentario. **Solo el autor.** Mismo cuerpo que al comentar.

| Respuesta | Caso |
|---|---|
| `200` | Devuelve el comentario editado |
| `400` | Comentario vacío o demasiado largo |
| `401` / `403` | Sin sesión / no es el autor |
| `404` | El comentario no existe |

### `DELETE /comentarios/:id`
Elimina un comentario. **El autor o un administrador.**

| Respuesta | Caso |
|---|---|
| `200` | Comentario eliminado |
| `401` / `403` | Sin sesión / sin permisos |
| `404` | El comentario no existe |

---

## Grupos

Cada grupo trae `ruta_nombre` y `participantes` (el creador más las solicitudes aceptadas).

### `GET /grupos`
Lista los grupos, ordenados por fecha de salida. **Público.**

| Parámetro | Ejemplo | Descripción |
|---|---|---|
| `rutaId` | `2` | Grupos de una ruta |
| `creadorId` | `1` | Grupos creados por un usuario |
| `estado` | `abierto` | `abierto`, `cerrado` o `cancelado` |
| `desde` | `2026-11-01` | Grupos que salen desde esa fecha |
| `limite` / `pagina` | `20` / `1` | Paginación |

| Respuesta | Caso |
|---|---|
| `200` | Lista de grupos |
| `400` | Algún parámetro es inválido |

### `GET /grupos/:id`
Detalle de un grupo. **Público.**

| Respuesta | Caso |
|---|---|
| `200` | Devuelve el grupo |
| `404` | El grupo no existe |

### `POST /grupos`
Crea un grupo. **Con sesión.** El creador es el usuario de la sesión, la dificultad se copia de la ruta y el estado parte en `abierto`.

| Campo | Tipo | Reglas |
|---|---|---|
| `rutaId` | entero | Obligatorio, de una ruta pública existente |
| `nombre` | texto | Obligatorio, entre 3 y 150 caracteres |
| `fechaSalida` | fecha | Obligatorio, fecha futura con formato `AAAA-MM-DDTHH:MM` |
| `cupoMaximo` | entero | Obligatorio, entre 2 y 50 |
| `descripcion` | texto | Máximo 2000 caracteres |

```json
{
  "rutaId": 4,
  "nombre": "Vuelta al lago",
  "descripcion": "Salida tranquila para principiantes.",
  "fechaSalida": "2026-12-05T09:00",
  "cupoMaximo": 6
}
```

| Respuesta | Caso |
|---|---|
| `201` | Devuelve el grupo creado |
| `400` | Datos inválidos o la ruta no existe |
| `401` | Sin sesión |

### `PATCH /grupos/:id`
Modifica un grupo. **El creador o un administrador.** Acepta `nombre`, `descripcion`, `fechaSalida`, `cupoMaximo` y `estado` (`abierto`, `cerrado` o `cancelado`), todos opcionales. La ruta no se puede cambiar.

| Respuesta | Caso |
|---|---|
| `200` | Devuelve el grupo actualizado |
| `400` | Datos inválidos, no se envió ningún campo, o el cupo quedaría por debajo de los participantes actuales |
| `401` / `403` | Sin sesión / no es el creador |
| `404` | El grupo no existe |

### `DELETE /grupos/:id`
Elimina un grupo y sus solicitudes. **El creador o un administrador.**

| Respuesta | Caso |
|---|---|
| `200` | Grupo eliminado |
| `401` / `403` | Sin sesión / no es el creador |
| `404` | El grupo no existe |

---

## Solicitudes a grupos

### `POST /grupos/:id/solicitudes`
Solicita unirse a un grupo. **Con sesión.** No lleva cuerpo. La solicitud queda `pendiente`.

| Respuesta | Caso |
|---|---|
| `201` | Devuelve la solicitud |
| `400` | El usuario es el creador del grupo |
| `401` | Sin sesión |
| `404` | El grupo no existe |
| `409` | Ya envió una solicitud, el grupo no está abierto o está completo |

### `GET /grupos/:id/solicitudes`
Solicitudes recibidas por un grupo, con el nombre de cada `usuario`. **El creador o un administrador.**

| Respuesta | Caso |
|---|---|
| `200` | Lista de solicitudes |
| `401` / `403` | Sin sesión / no es el creador |
| `404` | El grupo no existe |

### `PATCH /grupos/:id/solicitudes/:solicitudId`
Acepta o rechaza una solicitud. **El creador o un administrador.**

```json
{ "estado": "aceptada" }
```

`estado` es obligatorio: `aceptada` o `rechazada`.

| Respuesta | Caso |
|---|---|
| `200` | Devuelve la solicitud con su `fecha_respuesta` |
| `400` | Estado inválido |
| `401` / `403` | Sin sesión / no es el creador |
| `404` | El grupo o la solicitud no existen, o la solicitud es de otro grupo |
| `409` | La solicitud ya fue respondida, o el grupo está completo |

### `DELETE /grupos/:id/solicitudes/:solicitudId`
Elimina una solicitud: el solicitante la cancela o sale del grupo, o el creador lo saca. **El solicitante, el creador o un administrador.**

| Respuesta | Caso |
|---|---|
| `200` | Solicitud eliminada |
| `401` / `403` | Sin sesión / sin permisos |
| `404` | El grupo o la solicitud no existen |

### `GET /solicitudes`
Solicitudes enviadas por el usuario de la sesión, con el grupo, la ruta, la fecha de salida y el estado. **Con sesión.**

| Respuesta | Caso |
|---|---|
| `200` | Lista de solicitudes |
| `401` | Sin sesión |

---

## Propuestas de rutas

Los usuarios proponen rutas nuevas y un administrador las revisa. Al aprobarse, la propuesta se publica como ruta.

### `POST /propuestas`
Propone una ruta. **Con sesión.** La propuesta queda `pendiente`.

Obligatorios: `nombre`, `descripcion`, `region`, `comuna`, `dificultad` y `tipoRecorrido` (`solo_ida` o `ida_vuelta`). Opcionales: `distancia`, `duracion`, `desnivelPositivo`, `desnivelNegativo`, `latitud`, `longitud` y `visibilidad`, con las mismas reglas que en las rutas.

```json
{
  "nombre": "Mirador Cerro Pochoco",
  "descripcion": "Subida corta con vista a Santiago, ideal al atardecer.",
  "region": "Metropolitana",
  "comuna": "Lo Barnechea",
  "dificultad": "moderada",
  "tipoRecorrido": "ida_vuelta",
  "distancia": 7,
  "duracion": 210
}
```

| Respuesta | Caso |
|---|---|
| `201` | Devuelve la propuesta |
| `400` | Datos inválidos o incompletos |
| `401` | Sin sesión |

### `GET /propuestas`
Lista de propuestas. **Con sesión.** Un usuario ve solo las suyas; el administrador ve todas. Filtro opcional: `estado` (`pendiente`, `aprobada` o `rechazada`).

| Respuesta | Caso |
|---|---|
| `200` | Lista de propuestas, con el nombre del `autor` |
| `400` | Estado inválido |
| `401` | Sin sesión |

### `GET /propuestas/:id`
Detalle de una propuesta. **El autor o un administrador.**

| Respuesta | Caso |
|---|---|
| `200` | Devuelve la propuesta |
| `401` | Sin sesión |
| `404` | No existe o es de otra persona |

### `PATCH /propuestas/:id/revision`
Aprueba o rechaza una propuesta pendiente. **Administrador.**

| Campo | Tipo | Reglas |
|---|---|---|
| `estado` | texto | Obligatorio: `aprobada` o `rechazada` |
| `observaciones` | texto | Comentario para el autor, máximo 2000 caracteres |
| `tipoRuta` | texto | Tipo de la ruta que se publica (por defecto `sendero`) |

```json
{ "estado": "aprobada", "tipoRuta": "mirador", "observaciones": "Bien documentada." }
```

Si se aprueba, se crea la ruta con los datos de la propuesta y su id queda en `ruta_aprobada_id`. Todo ocurre en una sola transacción.

| Respuesta | Caso |
|---|---|
| `200` | Devuelve la propuesta revisada |
| `400` | Datos inválidos |
| `401` / `403` | Sin sesión / no es administrador |
| `404` | La propuesta no existe |
| `409` | La propuesta ya fue revisada |

### `DELETE /propuestas/:id`
Elimina una propuesta. **El autor (solo si está pendiente) o un administrador.**

| Respuesta | Caso |
|---|---|
| `200` | Propuesta eliminada |
| `401` | Sin sesión |
| `404` | No existe o es de otra persona |
| `409` | El autor intenta eliminar una propuesta ya revisada |

---

## Publicaciones

### `GET /publicaciones`
Últimas 50 publicaciones públicas de la comunidad (y las propias), de la más nueva a la más antigua, con el nombre del `autor`. **Con sesión.**

| Respuesta | Caso |
|---|---|
| `200` | Lista de publicaciones |
| `401` | Sin sesión |

### `POST /publicaciones`
Publica en la comunidad. **Con sesión.**

| Campo | Tipo | Reglas |
|---|---|---|
| `contenido` | texto | Obligatorio, entre 1 y 2000 caracteres |
| `tipo` | texto | `experiencia` (por defecto), `consejo`, `foto` u `otro` |

```json
{ "contenido": "Hoy hicimos La Campana con el grupo, muy recomendable.", "tipo": "experiencia" }
```

| Respuesta | Caso |
|---|---|
| `201` | Devuelve la publicación |
| `400` | Publicación vacía, demasiado larga o tipo inválido |
| `401` | Sin sesión |

### `DELETE /publicaciones/:id`
Elimina una publicación. **El autor o un administrador.**

| Respuesta | Caso |
|---|---|
| `200` | Publicación eliminada |
| `401` / `403` | Sin sesión / no es el autor |
| `404` | La publicación no existe |

---

## Amistades

### `GET /amistades`
Lista de amigos del usuario de la sesión (solicitudes aceptadas). **Con sesión.**

| Respuesta | Caso |
|---|---|
| `200` | Lista con `id_amistad`, `id_usuario`, `nombre` y `ubicacion` de cada amigo |
| `401` | Sin sesión |

### `GET /amistades/solicitudes`
Solicitudes de amistad recibidas que están pendientes, con el nombre del `solicitante`. **Con sesión.**

| Respuesta | Caso |
|---|---|
| `200` | Lista de solicitudes |
| `401` | Sin sesión |

### `POST /amistades`
Envía una solicitud de amistad. **Con sesión.**

```json
{ "usuarioId": 3 }
```

| Respuesta | Caso |
|---|---|
| `201` | Devuelve la solicitud, en estado `pendiente` |
| `400` | Falta `usuarioId` o es uno mismo |
| `401` | Sin sesión |
| `404` | El usuario no existe |
| `409` | Ya existe una solicitud o amistad entre ambos usuarios |

### `PATCH /amistades/:id`
Acepta o rechaza una solicitud recibida. **Solo el destinatario.**

```json
{ "estado": "aceptada" }
```

| Respuesta | Caso |
|---|---|
| `200` | Devuelve la solicitud respondida |
| `400` | Estado inválido |
| `401` | Sin sesión |
| `404` | La solicitud no existe o no fue enviada a este usuario |
| `409` | La solicitud ya fue respondida |

### `DELETE /amistades/:id`
Cancela una solicitud o elimina una amistad. **Cualquiera de los dos usuarios.**

| Respuesta | Caso |
|---|---|
| `200` | Amistad eliminada |
| `401` | Sin sesión |
| `404` | No existe o el usuario no participa en ella |
