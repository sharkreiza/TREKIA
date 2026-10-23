# EP 2.6 — Validación de usuarios y manejo de sesiones

**Stack:** Node.js ≥ 18, Express 5 (compatible con Express 4), PostgreSQL con `pg` (sin ORM), módulos **CommonJS**.

```
npm i express pg bcrypt jsonwebtoken express-validator helmet cors express-rate-limit dotenv
npm i -D nodemon
```

## Base de datos

El esquema está en `database/trekia_schema.sql` (dump de PostgreSQL 18). El backend se basa en él y no lo modifica:

- En `usuarios`, `id_usuario` es `GENERATED ALWAYS AS IDENTITY`, `rol` tiene `DEFAULT 'usuario'`, `fecha_creacion` tiene `DEFAULT CURRENT_TIMESTAMP` y `correo` tiene la restricción `usuarios_correo_key UNIQUE`. Los correos que ya estén guardados deberían estar en minúsculas, porque el backend los normaliza así antes de buscar.
- De `rutas` se usan `id_ruta, creador_id, nombre, descripcion, region, comuna, latitud, longitud, dificultad (baja|moderada|alta), distancia_km, desnivel_positivo_m, desnivel_negativo_m, duracion_minutos, tipo_ruta, tipo_recorrido (solo_ida|ida_vuelta), visibilidad, fecha_creacion`. Todos los nombres de columna que se usan en SQL dinámico están concentrados en `src/db/columnas.js`.
- `GET /rutas` y `GET /rutas/:id` muestran solo las rutas con `visibilidad = 'publico'`.
- Los `numeric` (distancia, latitud y longitud) se devuelven como `number` gracias a `types.setTypeParser` en `src/db/pool.js`.

## Relación de requisitos con el código

**(a) Validación de entradas.** Las reglas se definen con express-validator en `src/validators/`. En `auth.validator.js`, el registro exige un nombre de 2 a 100 caracteres, un correo válido de máximo 150 caracteres (normalizado con `trim` y `toLowerCase`) y una contraseña de 8 a 72 caracteres que contenga al menos una letra y un número. Además se comprueba que la contraseña no supere 72 bytes con `Buffer.byteLength`, porque bcrypt ignora todo lo que venga después del byte 72. El login exige correo y contraseña. Los límites de largo coinciden con las columnas de la BD (`nombre varchar(100)`, `correo varchar(150)`). El middleware `src/middlewares/validate.js` responde 400 con `{ ok:false, message, errors:[{campo, mensaje}] }` y guarda en `req.valid` únicamente los campos validados (`matchedData`). Por eso un campo extra como `rol` nunca llega al controlador. `comun.validator.js` (`idParam`) exige que cada `:id` de la URL sea un entero positivo y lo convierte a número.

**(b) Contraseñas.** `auth.controller.js` usa `bcrypt.hash` al registrar y `bcrypt.compare` al iniciar sesión. El costo se lee de `BCRYPT_ROUNDS`. `src/db/columnas.js` define la lista fija `USUARIO_COLUMNAS_PUBLICAS` sin `password_hash`, y todos los `SELECT` y `RETURNING` de `usuarios.repo.js` la usan (no hay `SELECT *`). Solo `buscarCredenciales` lee el hash, y el login lo quita del objeto antes de responder.

**(c) Secretos, sesiones y endurecimiento.**
- `src/config/env.js` carga `.env` con dotenv. Si falta alguna variable crítica (`DB_*`, `JWT_SECRET`, `CORS_ORIGINS`), muestra solo su nombre y termina el proceso. `.env` está en `.gitignore` y `.env.example` no contiene valores reales.
- La sesión usa un JWT HS256 firmado con `JWT_SECRET` que expira según `JWT_EXPIRES_IN`. `middlewares/auth.js` contiene `requireAuth` (header `Authorization: Bearer`, con el algoritmo fijado al verificar) y `requireRol`.
- El login responde siempre 401 "Credenciales inválidas". Si el correo no existe, igual se ejecuta `bcrypt.compare` contra un hash ficticio del mismo costo, para que el tiempo de respuesta no revele qué correos están registrados.
- El rol no se lee del body: `usuarios.repo.js#crear` inserta siempre `'usuario'`.
- `app.js` aplica `helmet()` y CORS con una lista blanca tomada de `CORS_ORIGINS` (`config/cors.js`): ionic serve `http://localhost:8100`, Vite `http://localhost:5173`, Capacitor iOS `capacitor://localhost` / `ionic://localhost` y Android `http://localhost` / `https://localhost`. `middlewares/rateLimit.js` limita `/auth/login` a 10 intentos cada 15 minutos y `/auth/register` a 5 por hora, y al superar el límite responde 429 con el mismo formato JSON.
- `middlewares/errorHandler.js` es el manejador global. Nunca devuelve el stack y traduce los errores de PostgreSQL: `23505` → 409 (por ejemplo, "El correo ya está registrado" para `usuarios_correo_key`), `23503` → 409 y `23514` → 400 (por ejemplo, `chk_distancia_positiva`). También traduce `22P02` (valor inválido para un ENUM), `22001` y `22003` a 400. Los errores 500 se registran solo con `console.error` y el cliente recibe "Error interno del servidor". `utils/asyncHandler.js` envuelve los controladores async para que sus errores lleguen a este manejador tanto en Express 4 como en Express 5.

**(d) Inyección SQL.** Todas las consultas de `src/repositories/` usan parámetros `$1, $2…`. En las consultas dinámicas de `rutas.repo.js` (filtros de `GET /rutas`, `ORDER BY` y el `UPDATE` parcial de `PATCH /rutas/:id`), los nombres de columna salen únicamente de las listas blancas de `db/columnas.js` (`RUTA_FILTROS_IGUALDAD`, `RUTA_ORDEN`, `RUTA_ACTUALIZABLES`). Los valores siempre van como parámetros, la dirección del orden solo puede ser `ASC` o `DESC`, y el validador rechaza cualquier clave que no esté en la lista. `src/seguridad/ejemplo-inyeccion-sql.js` muestra comentada una consulta vulnerable (concatenación con `' OR '1'='1`) junto a su versión segura parametrizada, y el mismo contraste para `ORDER BY`.

## Pruebas en Postman

Base: `http://localhost:3000/api`, con header `Content-Type: application/json`.

| # | Petición | Cuerpo / detalle | Respuesta esperada |
|---|----------|------------------|--------------------|
| 1 | `POST /auth/register` | `{"nombre":"Ana","correo":"  ANA@Mail.com ","password":"Trekia123","rol":"administrador"}` | 201, `data.usuario.correo = "ana@mail.com"`, `rol = "usuario"`, sin `password_hash`, con `data.token` |
| 2 | Repetir la 1 | igual | 409 `"El correo ya está registrado"` |
| 3 | `POST /auth/register` | `{"nombre":"A","correo":"malo","password":"abcdefgh"}` | 400, `errors` con `nombre`, `correo` y `password` |
| 4 | `POST /auth/register` | password de 30 "ñ" (30 caracteres, 60 bytes) es válida; 40 "ñ" (80 bytes) | 400 "máximo 72 bytes" |
| 5 | `POST /auth/login` | correo existente + password incorrecta | 401 `"Credenciales inválidas"` |
| 6 | `POST /auth/login` | correo inexistente | 401 con el mismo mensaje y un tiempo similar al de la 5 |
| 7 | `POST /auth/login` | credenciales correctas | 200, `data.token` y `data.usuario` sin hash |
| 8 | `GET /auth/me` | header `Authorization: Bearer <token>` / sin header | 200 con el usuario / 401 |
| 9 | `GET /usuarios/abc` (con token) | `/usuarios/-1`, `/usuarios/1.5` | 400 `errors[0].campo = "id"` |
| 10 | `POST /auth/login` 11 veces seguidas | cualquier cuerpo | la 11.ª responde 429 en formato JSON |
| 11 | `GET /rutas?region=Valparaíso&dificultad=baja&orden=distancia&direccion=desc` | — | 200, lista filtrada y ordenada |
| 12 | `GET /rutas?orden=nombre;DROP TABLE rutas` | — | 400, `orden` no permitido |
| 13 | `GET /rutas?busqueda=' OR '1'='1` | — | 200 con `data: []` (se trata como texto) |
| 14 | `PATCH /rutas/1` con token de usuario normal | `{"nombre":"X"}` | 403 |
| 15 | `PATCH /rutas/1` con token de administrador | `{"nombre":"Nuevo","id_ruta":99,"creador_id":2}` | 200, solo cambia `nombre` (el resto se ignora) |
| 15b | `PATCH /rutas/1` con token de administrador | `{"dificultad":"extrema"}` / `{"distancia":0}` | 400, el validador rechaza valores fuera del ENUM o del CHECK `chk_distancia_positiva` |
| 16 | `POST /auth/login` con cuerpo `{"correo":` (JSON roto) | — | 400 "no es un JSON válido", sin stack |
| 17 | Arrancar sin `JWT_SECRET` en `.env` | `npm start` | la consola muestra `- JWT_SECRET` y el proceso termina |
| 18 | Petición con header `Origin: http://evil.com` | cualquier ruta | 403 "Origen no permitido por CORS" |

Antes de las pruebas:

- Las pruebas 14 y 15 necesitan un administrador. Se crea registrando un usuario normal y ejecutando en la BD `UPDATE usuarios SET rol = 'administrador' WHERE correo = '...';`. Después hay que volver a hacer login para obtener un token con el rol nuevo.
- Para las pruebas de rutas debe existir al menos una ruta, que se puede insertar en la BD:
  ```sql
  INSERT INTO rutas (creador_id, nombre, descripcion, region, comuna, latitud, longitud,
                     dificultad, distancia_km, desnivel_positivo_m, duracion_minutos, tipo_ruta)
  VALUES (1, 'Parque La Campana', 'Sendero entre palmas chilenas', 'Valparaíso', 'Olmué',
          -32.957, -71.129, 'baja', 6, 400, 180, 'Circuito');
  ```
