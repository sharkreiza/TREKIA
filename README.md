# TREKIA — Backend

API REST de Trekia, construida con **Node.js + Express** y **PostgreSQL**. La interfaz en Ionic con React está en la rama [`frontend`](https://github.com/sharkreiza/TREKIA/tree/frontend), junto con la descripción completa del proyecto y sus requerimientos.

| Recurso | Enlace |
|---|---|
| Repositorio | [github.com/sharkreiza/TREKIA](https://github.com/sharkreiza/TREKIA) |
| Rama frontend | [frontend](https://github.com/sharkreiza/TREKIA/tree/frontend) |
| Prototipo en Figma | [Ver prototipo](https://www.figma.com/design/2TYPZLo0IrNCWRyVobiGK7/Sin-t%C3%ADtulo) |

## Integrantes y responsabilidades

| Integrante | Responsabilidades (EP2) |
|---|---|
| Antonia Albar | _por definir_ |
| Vicente Girardin | _EP 2.6: validación de usuarios y manejo de sesiones_ |
| Camila Ramirez | _EP 2.1: servidor backend · EP 2.3: API REST y CRUD · EP 2.7: pruebas en Postman y documentación de endpoints_ |

## Tecnologías

| Área | Tecnología |
|---|---|
| Entorno de ejecución | Node.js 18 o superior (CommonJS) |
| Framework | Express 5 (compatible con Express 4) |
| Base de datos | PostgreSQL con el driver `pg` (sin ORM) |
| Validación | express-validator |
| Contraseñas | bcrypt |
| Sesiones | JWT (jsonwebtoken) |
| Seguridad HTTP | helmet, cors, express-rate-limit |
| Variables de entorno | dotenv |

## Instalación

Requisitos: [Node.js](https://nodejs.org/) 18 o superior, [PostgreSQL](https://www.postgresql.org/) y [Git](https://git-scm.com/).

```bash
git clone https://github.com/sharkreiza/TREKIA.git
cd TREKIA
git checkout backend
cd backend
npm install
cp .env.example .env
```

En Windows (PowerShell), el último paso es `Copy-Item .env.example .env`.

La base de datos se crea con el esquema de `backend/database/trekia_schema.sql` y se llena con los datos de prueba de `backend/database/datos_prueba.sql`:

```bash
createdb -U postgres trekia
psql -U postgres -d trekia -f database/trekia_schema.sql
psql -U postgres -d trekia -f database/datos_prueba.sql
```

Usuarios de prueba:

| Rol | Correo | Contraseña |
|---|---|---|
| Usuario | `usuario@gmail.com` | `Trekia123` |
| Administrador | `admin@gmail.com` | `Admin123` |
| Usuario | `sofia@gmail.com` / `matias@gmail.com` | `Trekia123` |

### Variables de entorno

Si falta una variable obligatoria, el servidor no arranca y muestra solo su nombre.

| Variable | Descripción | Obligatoria |
|---|---|---|
| `PORT` | Puerto donde escucha la API (por defecto `3000`) | No |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Conexión a PostgreSQL | Sí |
| `JWT_SECRET` | Clave para firmar los tokens, de al menos 32 caracteres | Sí |
| `JWT_EXPIRES_IN` | Duración de la sesión (por defecto `2h`) | No |
| `BCRYPT_ROUNDS` | Costo de bcrypt (por defecto `12`) | No |
| `CORS_ORIGINS` | Orígenes del frontend permitidos, separados por coma | Sí |

El archivo `.env` no se sube al repositorio; solo se versiona `.env.example`.

## Ejecución

```bash
npm run dev     # se reinicia solo al guardar cambios
npm start       # modo normal
```

Para comprobar que funciona, abrir `http://localhost:3000/api/salud` en el navegador.

## Estructura

```
backend/
├── .env.example
├── package.json
├── database/
│   ├── trekia_schema.sql        Esquema de la base de datos
│   └── datos_prueba.sql         Usuarios, rutas, grupos, propuestas, publicaciones y amistades de prueba
├── docs/
│   ├── EP2.6-informe.md         Explicación de la EP 2.6 (seguridad y sesiones)
│   ├── endpoints.md             Documentación completa de los endpoints
│   ├── EP2.7-pruebas.md         Cómo ejecutar las pruebas y resultados
│   ├── Trekia.postman_collection.json   Colección de Postman
│   └── evidencia/               Reporte y captura de la ejecución de las pruebas
└── src/
    ├── server.js          Levanta el servidor en el puerto
    ├── app.js             Configura Express (helmet, CORS, JSON, rutas, errores)
    ├── config/            Variables de entorno y CORS
    ├── db/                Conexión a PostgreSQL y listas blancas de columnas
    ├── routes/            Asocian cada URL con sus validaciones y controlador
    ├── validators/        Reglas de express-validator
    ├── controllers/       Leen la petición y responden
    ├── repositories/      Consultas SQL parametrizadas
    ├── middlewares/       Validación, JWT, rate limit y errores
    ├── utils/             Formato de respuesta y utilidades
    └── seguridad/         Ejemplo de inyección SQL (para el informe)
```

Una petición pasa por: **ruta → validación → controlador → repositorio → base de datos**. Solo los repositorios escriben SQL.

## Endpoints

La documentación completa (parámetros, cuerpo, permisos, respuestas y errores de cada endpoint) está en [`backend/docs/endpoints.md`](backend/docs/endpoints.md).

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/salud` | Comprueba que el servidor funciona | Público |
| POST | `/api/auth/register` | Registra un usuario (siempre con rol `usuario`) | Público |
| POST | `/api/auth/login` | Inicia sesión y devuelve un JWT | Público |
| GET | `/api/auth/me` | Usuario de la sesión actual | Con sesión |
| GET | `/api/usuarios/:id` | Perfil público de un usuario | Con sesión |
| PATCH | `/api/usuarios/me` | Edita el perfil propio | Con sesión |
| GET | `/api/rutas` | Lista las rutas públicas, con filtros, orden y paginación | Público |
| GET | `/api/rutas/:id` | Detalle de una ruta | Público |
| POST | `/api/rutas` | Crea una ruta | Administrador |
| PATCH | `/api/rutas/:id` | Modifica una ruta | Administrador |
| DELETE | `/api/rutas/:id` | Elimina una ruta sin grupos ni comentarios | Administrador |
| GET | `/api/rutas/:id/comentarios` | Comentarios de una ruta | Público |
| POST | `/api/rutas/:id/comentarios` | Comenta una ruta | Con sesión |
| PATCH | `/api/comentarios/:id` | Edita un comentario | Autor |
| DELETE | `/api/comentarios/:id` | Elimina un comentario | Autor o administrador |
| GET | `/api/grupos` | Lista los grupos, con filtros y paginación | Público |
| GET | `/api/grupos/:id` | Detalle de un grupo con sus participantes | Público |
| POST | `/api/grupos` | Crea un grupo | Con sesión |
| PATCH | `/api/grupos/:id` | Modifica un grupo | Creador o administrador |
| DELETE | `/api/grupos/:id` | Elimina un grupo y sus solicitudes | Creador o administrador |
| GET | `/api/grupos/:id/solicitudes` | Solicitudes recibidas por un grupo | Creador o administrador |
| POST | `/api/grupos/:id/solicitudes` | Solicita unirse a un grupo | Con sesión |
| PATCH | `/api/grupos/:id/solicitudes/:solicitudId` | Acepta o rechaza una solicitud | Creador o administrador |
| DELETE | `/api/grupos/:id/solicitudes/:solicitudId` | Cancela una solicitud o sale del grupo | Solicitante, creador o administrador |
| GET | `/api/solicitudes` | Solicitudes enviadas por el usuario y su estado | Con sesión |
| GET | `/api/propuestas` | Propuestas propias (el administrador ve todas) | Con sesión |
| GET | `/api/propuestas/:id` | Detalle de una propuesta | Autor o administrador |
| POST | `/api/propuestas` | Propone una ruta nueva | Con sesión |
| PATCH | `/api/propuestas/:id/revision` | Aprueba o rechaza una propuesta; si se aprueba, se publica como ruta | Administrador |
| DELETE | `/api/propuestas/:id` | Elimina una propuesta (el autor, solo si está pendiente) | Autor o administrador |
| GET | `/api/publicaciones` | Publicaciones de la comunidad | Con sesión |
| POST | `/api/publicaciones` | Publica en la comunidad | Con sesión |
| DELETE | `/api/publicaciones/:id` | Elimina una publicación | Autor o administrador |
| GET | `/api/amistades` | Lista de amigos | Con sesión |
| GET | `/api/amistades/solicitudes` | Solicitudes de amistad recibidas | Con sesión |
| POST | `/api/amistades` | Envía una solicitud de amistad | Con sesión |
| PATCH | `/api/amistades/:id` | Acepta o rechaza una solicitud recibida | Destinatario |
| DELETE | `/api/amistades/:id` | Cancela una solicitud o elimina una amistad | Cualquiera de los dos |

Las rutas con sesión necesitan el header `Authorization: Bearer <token>`.

Todas las respuestas son JSON con el formato `{ "ok", "data", "message", "errors" }`. Cuando falla la validación, `errors` es una lista de `{ "campo", "mensaje" }`.

## Pruebas

La colección [`backend/docs/Trekia.postman_collection.json`](backend/docs/Trekia.postman_collection.json) tiene 92 peticiones con 203 verificaciones, que cubren todos los endpoints y sus casos de error. Se importa en Postman y se ejecuta en orden con el Collection Runner, con el servidor encendido y la base de datos recién cargada con `datos_prueba.sql`.

También se puede ejecutar desde la terminal:

```bash
npx newman run docs/Trekia.postman_collection.json
```

Los pasos y los resultados están en [`backend/docs/EP2.7-pruebas.md`](backend/docs/EP2.7-pruebas.md), y la evidencia de la ejecución en [`backend/docs/evidencia/`](backend/docs/evidencia/).
