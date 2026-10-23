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
| Camila Ramirez | _EP 2.1: servidor backend_ |

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

La base de datos se crea con el esquema de `backend/database/trekia_schema.sql`:

```bash
createdb -U postgres trekia
psql -U postgres -d trekia -f database/trekia_schema.sql
```

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
├── database/trekia_schema.sql   Esquema de la base de datos
├── docs/EP2.6-informe.md        Explicación de la EP 2.6 y pruebas en Postman
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

| Método | Endpoint | Descripción | Respuestas |
|---|---|---|---|
| GET | `/api/salud` | Comprueba que el servidor funciona | 200 |
| POST | `/api/auth/register` | Registra un usuario (siempre con rol `usuario`) | 201, 400, 409, 429 |
| POST | `/api/auth/login` | Inicia sesión y devuelve un JWT | 200, 400, 401, 429 |
| GET | `/api/auth/me` | Usuario de la sesión actual (requiere token) | 200, 401 |
| GET | `/api/usuarios/:id` | Perfil público de un usuario (requiere token) | 200, 400, 401, 404 |
| GET | `/api/rutas` | Lista las rutas públicas. Filtros: `busqueda`, `region`, `comuna`, `dificultad`, `tipoRecorrido`, `distanciaMin`, `distanciaMax`, `duracionMax`. Orden: `orden`, `direccion`. Paginación: `limite`, `pagina` | 200, 400 |
| GET | `/api/rutas/:id` | Detalle de una ruta pública | 200, 400, 404 |
| PATCH | `/api/rutas/:id` | Modifica una ruta (solo `administrador`) | 200, 400, 401, 403, 404 |

Ejemplo: `GET http://localhost:3000/api/rutas?dificultad=baja&orden=distancia&direccion=desc`

Las rutas protegidas necesitan el header `Authorization: Bearer <token>`.

Todas las respuestas son JSON con el formato `{ "ok", "data", "message", "errors" }`. Cuando falla la validación, `errors` es una lista de `{ "campo", "mensaje" }`.
