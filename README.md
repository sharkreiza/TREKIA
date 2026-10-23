# TREKIA — Backend

API REST de Trekia, construida con **Node.js + Express**. La interfaz en Ionic con React está en la rama [`frontend`](https://github.com/sharkreiza/TREKIA/tree/frontend), junto con la descripción completa del proyecto y sus requerimientos.

| Recurso | Enlace |
|---|---|
| Repositorio | [github.com/sharkreiza/TREKIA](https://github.com/sharkreiza/TREKIA) |
| Rama frontend | [frontend](https://github.com/sharkreiza/TREKIA/tree/frontend) |
| Prototipo en Figma | [Ver prototipo](https://www.figma.com/design/2TYPZLo0IrNCWRyVobiGK7/Sin-t%C3%ADtulo) |

## Integrantes y responsabilidades

| Integrante | Responsabilidades (EP2) |
|---|---|
| Antonia Albar | _por definir_ |
| Vicente Girardin | _por definir_ |
| Camila Ramirez | _EP 2.1: servidor backend_ |

## Tecnologías

| Área | Tecnología |
|---|---|
| Entorno de ejecución | Node.js 20 o superior |
| Framework | Express 5 |
| Variables de entorno | dotenv |
| Acceso desde el frontend | cors |

## Instalación

Requisitos: [Node.js](https://nodejs.org/) 20 o superior y [Git](https://git-scm.com/).

```bash
git clone https://github.com/sharkreiza/TREKIA.git
cd TREKIA
git checkout backend
cd backend
npm install
cp .env.example .env
```

En Windows (PowerShell), el último paso es `Copy-Item .env.example .env`.

### Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto donde escucha la API | `3000` |
| `CORS_ORIGIN` | Dirección del frontend que puede llamar a la API | `http://localhost:8100` |

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
└── src/
    ├── server.js          Levanta el servidor en el puerto
    ├── app.js             Configura Express (CORS, JSON, rutas, errores)
    ├── config/env.js      Lee las variables de entorno
    ├── routes/            Asocian cada URL con un controlador
    ├── controllers/       Leen la petición y responden
    ├── services/          Lógica y acceso a los datos
    ├── middlewares/       Respuestas 404 y 500
    └── data/              Datos de prueba (se reemplazan por la BD en EP 2.2)
```

Una petición pasa por: **ruta → controlador → servicio → datos**. Como el servicio es el único que toca los datos, al conectar la base de datos solo cambia esa capa.

## Endpoints

| Método | Endpoint | Descripción | Respuestas |
|---|---|---|---|
| GET | `/api/salud` | Comprueba que el servidor funciona | 200 |
| GET | `/api/rutas` | Lista las rutas. Filtros opcionales: `busqueda`, `region`, `dificultad` | 200 |
| GET | `/api/rutas/:id` | Detalle de una ruta | 200, 400, 404 |

Ejemplo: `GET http://localhost:3000/api/rutas?dificultad=Baja`

Todas las respuestas son JSON: `{ "ok": true, "data": ... }` si todo sale bien, o `{ "ok": false, "error": "mensaje" }` si hay un error.
