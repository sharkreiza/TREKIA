 # TREKIA

| Recurso | Enlace |
|---|---|
| Repositorio | [github.com/sharkreiza/TREKIA](https://github.com/sharkreiza/TREKIA) |
| Prototipo en Figma | [Ver prototipo](https://www.figma.com/design/2TYPZLo0IrNCWRyVobiGK7/Sin-t%C3%ADtulo) |
| Informe EP1 | [Ver informe](docs/Informe-EP1.pdf) |


## Integrantes y responsabilidades

| Integrante | Responsabilidades |
|---|---|
| Antonia Albar | _parte 1.1 y 1.2_ |
| Vicente Girardin | _EP1: Figma · EP 2.6: validación de usuarios y manejo de sesiones · EF: cambio de contraseña (formulario, endpoint y pruebas)_ |
| Camila Ramirez | _1.4,1.5,1.6 · EP 2.4 y 2.5: integración con la API, sesión con JWT y roles · EF: notificaciones, almacenamiento local, clima, filtros de grupos, configuración de la cuenta, optimización y Docker_ |

## Descripción del sistema

Trekia reúne en un solo lugar la información de rutas de trekking y a las personas que las recorren. Los usuarios pueden ver las rutas en un mapa, revisar su dificultad, distancia y duración, leer comentarios de otras personas, crear grupos para salir acompañados y proponer rutas que todavía no aparecen en la plataforma.

El sistema tiene dos roles:

- **Usuario:** explora rutas, comenta, crea y se une a grupos, agrega amigos, gestiona su perfil y propone rutas nuevas.
- **Administrador:** revisa las rutas propuestas por los usuarios y decide si se publican o se rechazan.


## Problema que aborda

Las personas interesadas en hacer trekking tienen dificultades para encontrar información suficiente y centralizada sobre algunas rutas, evaluar si son adecuadas para su nivel y encontrar compañeros con quienes salir de forma organizada.

El problema se divide en tres partes:

- **Falta de información:** muchas rutas conocidas por gente con experiencia no tienen presencia digital suficiente, o su información está dispersa en distintas plataformas.
- **Seguridad:** SENAPRED recomienda planificar las salidas a la montaña y no hacerlas en solitario, pero no siempre es fácil encontrar con quién ir.
- **Componente social:** alguien puede querer hacer una ruta y no tener amigos disponibles, o sentirse inseguro saliendo con desconocidos sin ningún control sobre quién participa.

## Objetivos

**Objetivo general:** desarrollar una plataforma web y móvil que centralice información de rutas de trekking y facilite la organización de salidas grupales.

**Objetivos específicos:**

- Mostrar las rutas en un mapa interactivo con su información detallada.
- Permitir buscar y filtrar rutas según dificultad, ubicación y distancia.
- Facilitar la creación de grupos, con control del creador sobre quién participa.
- Permitir que la comunidad proponga rutas nuevas, revisadas por un administrador antes de publicarse.
- Ofrecer una experiencia coherente tanto en computador como en celular.


## Principales funcionalidades

- Mapa interactivo con marcadores de rutas y filtros.
- Ficha de cada ruta con dificultad, distancia, duración y comentarios.
- Creación y búsqueda de grupos de trekking, con solicitudes de participación.
- Comunidad con publicaciones, grupos, eventos y solicitudes de amistad.
- Propuesta de rutas nuevas.
- Cuenta con perfil, estadísticas y configuración.
- Panel de administrador para aprobar o rechazar rutas propuestas.
- Notificaciones dentro de la app cuando alguien pide unirse a tu grupo, responde tu solicitud, te agrega como amigo o se revisa tu propuesta.
- Pronóstico del tiempo de cada ruta y del día de salida de cada grupo, obtenido de Open-Meteo.
- Uso sin conexión: las rutas y grupos vistos se guardan en el dispositivo y se muestran si se pierde la conexión.


## Requerimientos funcionales

| ID | Nombre | Rol | Descripción |
|---|---|---|---|
| RF-01 | Visualización de rutas en mapa interactivo | Usuario | El sistema deberá permitir visualizar las rutas de trekking disponibles mediante marcadores en un mapa interactivo. |
| RF-02 | Consulta detallada de una ruta | Usuario | El sistema deberá permitir seleccionar una ruta y consultar su nombre, ubicación, descripción, dificultad, distancia, desnivel, duración estimada y recorrido. |
| RF-03 | Búsqueda y filtrado de rutas | Usuario | El sistema deberá permitir buscar y filtrar rutas según dificultad, ubicación, distancia y otras características. |
| RF-04 | Publicación de experiencias y comentarios | Usuario | El sistema deberá permitir publicar comentarios asociados a una ruta para compartir experiencias, recomendaciones y advertencias. |
| RF-05 | Creación de grupos de trekking | Usuario | El sistema deberá permitir crear grupos indicando ruta, fecha, hora, cantidad de participantes y descripción de la actividad. |
| RF-06 | Búsqueda y filtrado de grupos | Usuario | El sistema deberá permitir consultar los grupos disponibles y filtrarlos por fecha, ruta, horario y cantidad de participantes. |
| RF-07 | Gestión de participación en grupos | Usuario | El sistema deberá permitir solicitar la participación en un grupo y ver si la solicitud está pendiente, aceptada o rechazada. |
| RF-08 | Creación de perfil | Usuario | El sistema deberá permitir gestionar la información pública del perfil, que podrá ser consultada por otros usuarios. |
| RF-09 | Propuesta de nuevas rutas | Usuario | El sistema deberá permitir proponer rutas nuevas con su nombre, ubicación, descripción, dificultad y recorrido, las que quedarán en revisión antes de publicarse. |
| RF-10 | Moderación | Administrador | El sistema deberá permitir al administrador revisar, aprobar o rechazar las rutas propuestas por los usuarios. |
| RF-11 | Añadir amigos | Usuario | El sistema deberá permitir enviar solicitudes de amistad a otros usuarios desde sus perfiles. |
| RF-12 | Gestión de lista de amigos y solicitudes | Usuario | El sistema deberá permitir ver la lista de amigos y aceptar o rechazar las solicitudes de amistad recibidas. |
| RF-13 | Configuración de la cuenta | Usuario | El sistema deberá permitir modificar los datos de la cuenta, agregar un correo adicional, seleccionar la zona horaria y cambiar la contraseña. |
| RF-14 | Notificaciones | Usuario y administrador | El sistema deberá avisar al usuario cuando alguien solicite unirse a su grupo, cuando respondan su solicitud, cuando se cancele un grupo al que pertenece, cuando reciba o le acepten una solicitud de amistad y cuando se revise su propuesta de ruta. |
| RF-15 | Pronóstico del clima | Usuario | El sistema deberá mostrar el pronóstico del tiempo de cada ruta y el del día de salida de cada grupo, obtenido de un servicio externo. |

## Requerimientos no funcionales

| ID | Nombre | Categoría | Descripción |
|---|---|---|---|
| RNF-01 | Rendimiento | Rendimiento | Las vistas principales deberán cargar en un máximo de 3 segundos bajo condiciones normales de conexión. |
| RNF-02 | Seguridad de la información | Seguridad | Las funcionalidades protegidas deberán validar la autenticación y los permisos del usuario antes de permitir el acceso. |
| RNF-03 | Protección de credenciales | Seguridad | Las contraseñas no deberán almacenarse en texto plano; se guardarán con un algoritmo de hash seguro como bcrypt. |
| RNF-04 | Usabilidad | Usabilidad | La navegación deberá ser clara y consistente, de modo que las funcionalidades principales se identifiquen fácilmente. |
| RNF-05 | Diseño responsivo y compatibilidad | Compatibilidad | La aplicación deberá adaptarse a celulares y computadores, manteniendo su funcionalidad y legibilidad. |
| RNF-06 | Accesibilidad | Accesibilidad | La interfaz deberá usar tamaños de texto, contrastes y etiquetas que faciliten la lectura y la navegación. |
| RNF-07 | Disponibilidad e integridad de datos | Confiabilidad | Las operaciones de modificación y eliminación de datos deberán estar restringidas según el rol y los permisos del usuario. |
| RNF-08 | Funcionamiento sin conexión | Confiabilidad | Si se pierde la conexión, la aplicación deberá mostrar los últimos datos de rutas y grupos guardados en el dispositivo (hasta 72 horas) e indicar que no están actualizados. |


## Tecnologías y herramientas

| Área | Tecnología |
|---|---|
| Frontend | Ionic 9, React 19, TypeScript |
| Navegación | React Router 6 (`@ionic/react-router`) |
| Mapa | Leaflet con mapas de OpenStreetMap |
| Conexión con la API | Axios, con interceptores para el token JWT y el manejo de errores |
| Servicio externo | [Open-Meteo](https://open-meteo.com/) (pronóstico del tiempo, a través del backend) |
| Almacenamiento local | `localStorage` (sesión, filtros y datos para usar sin conexión) |
| Móvil | Capacitor |
| Build | Vite, con carga diferida de páginas |
| Pruebas | Vitest y Testing Library (unitarias), Cypress (de punta a punta) |
| Despliegue | Docker (build con Node y servidor nginx) |
| Diseño | Figma |
| Control de versiones | Git y GitHub |

## Instalación y configuración

### Requisitos previos

- [Node.js](https://nodejs.org/) (versión LTS)
- [Git](https://git-scm.com/)
- Ionic CLI:

```bash
npm install -g @ionic/cli
```

### Pasos

1. Clonar el repositorio y cambiarse a la rama `frontend`:

```bash
git clone https://github.com/sharkreiza/TREKIA.git
cd TREKIA
git checkout frontend
```

2. Entrar a la carpeta del proyecto e instalar las dependencias:

```bash
cd frontend
npm install
```

3. (Opcional) Si la API no está en `http://localhost:3000/api`, crear el archivo `.env` a partir del ejemplo y cambiar la dirección:

```bash
cp .env.example .env
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | Dirección de la API del backend | `http://localhost:3000/api` |

## Ejecución y uso

La aplicación usa los datos reales de la API, así que **primero hay que levantar el backend** (rama [`Backend`](https://github.com/sharkreiza/TREKIA/tree/Backend), con la base de datos creada y `npm run dev`). Luego, para levantar la aplicación en modo desarrollo:

```bash
ionic serve
```

Se abrirá en el navegador en `http://localhost:8100`. Para ver la versión móvil, achicar la ventana o usar el modo de dispositivo del navegador (F12).

### Usuarios de prueba

Vienen en `datos_prueba.sql` del backend. También se puede crear una cuenta nueva desde **Registro**, que queda guardada en la base de datos.

| Rol | Correo | Contraseña |
|---|---|---|
| Usuario | `usuario@gmail.com` | `Trekia123` |
| Administrador | `admin@gmail.com` | `Admin123` |
| Usuario | `sofia@gmail.com` / `matias@gmail.com` | `Trekia123` |

### Qué probar

- Entrar sin sesión a `/app/inicio` redirige a `/login`.
- Iniciar sesión con una contraseña incorrecta muestra el error que responde la API.
- Entrar como usuario a `/admin/propuestas` redirige a `/app/inicio`.
- En **Inicio**, tocar un marcador del mapa o una categoría.
- En **Explorar rutas**, usar el botón **Filtros**; en el detalle de una ruta, dejar un comentario.
- En **Grupos**, crear un grupo; con otra cuenta, solicitar unirse; con la cuenta creadora, aceptar la solicitud.
- En **Comunidad**, publicar algo y aceptar o rechazar una solicitud de amistad.
- En **Proponer ruta**, enviar una ruta; como administrador, aprobarla en **Rutas propuestas** y verla publicada en Explorar rutas.
- En **Cuenta → Configuración**, cambiar la ubicación, agregar un correo adicional y elegir otra zona horaria (por ejemplo, Isla de Pascua): las horas de los grupos se muestran en esa zona.
- Con `sofia@gmail.com`, pedir unirse a un grupo de `usuario@gmail.com`; al entrar con `usuario@gmail.com`, la campana muestra la notificación y al tocarla lleva al grupo.
- En **Grupos**, filtrar por horario (mañana, tarde o noche), fechas, ruta, tamaño del grupo y cupos disponibles.
- En el detalle de una ruta, revisar el pronóstico de los próximos 7 días; en el detalle de un grupo que sale en menos de 16 días, el clima de ese día.
- Abrir Explorar rutas, activar **Sin conexión** en las herramientas del navegador (F12 → Network → Offline) y recargar la pantalla: se muestran las rutas guardadas con un aviso.

## Conexión con el backend (EP 2.4 y 2.5)

Todas las pantallas leen y guardan los datos en la API REST del backend.

**Consumo de la API (`src/services/api.ts`).** Se usa una instancia de Axios con la dirección de `VITE_API_URL` y dos interceptores:

- **De petición:** agrega el header `Authorization: Bearer <token>` a todas las peticiones cuando hay sesión.
- **De respuesta:** convierte cualquier error en un `ErrorApi` con el mensaje que manda el backend y los errores de cada campo, para mostrarlos en pantalla. Si no hay conexión, muestra un aviso. Si el backend responde 401 teniendo sesión (token vencido o inválido), cierra la sesión y la app vuelve a `/login`.

Cada sección tiene su servicio (`authService`, `rutasService`, `gruposService`, `propuestasService`, `comunidadService`), que llama a la API y adapta las respuestas a lo que usan las pantallas. Las pantallas cargan los datos con el hook `useDatos` (`src/hooks/useDatos.ts`), que maneja el estado de carga y los errores, y vuelve a pedir los datos cada vez que se entra a la pantalla. El componente `Estado` muestra el indicador de carga o el error con un botón para reintentar.

**Autenticación con JWT y roles.**

- **Registro e inicio de sesión:** los formularios llaman a `/auth/register` y `/auth/login`, y muestran los errores de validación que responde el backend en el campo correspondiente.
- **Token:** el JWT que devuelve el login se guarda junto con los datos del usuario (`AuthContext`). Al abrir la app se comprueba con `/auth/me` que el token siga siendo válido.
- **Rutas protegidas:** `RutaPrivada` (`src/routes/Proteccion.tsx`) no deja entrar a `/app` sin sesión, ni a `/admin` sin el rol `administrador`. El menú solo muestra la sección de administración a ese rol.
- **Roles en la interfaz:** solo el creador de un grupo ve y responde sus solicitudes; solo el autor (o un administrador) puede eliminar sus comentarios y publicaciones.

Las capturas de los flujos funcionando con la API están en `docs/capturas-ep2/`.

---

## Entrega Final

| Requisito | Qué se hizo | Dónde está |
|---|---|---|
| EF 1: funcionalidades completas | CRUD completo de rutas, grupos, solicitudes, comentarios, publicaciones, propuestas, amistades y notificaciones. Se implementaron RF-06 y RF-13, que estaban definidos pero no programados. Notificaciones dentro de la app y almacenamiento local para usar sin conexión | `pages/notificaciones/`, `context/NotificacionesContext.tsx`, `utils/almacenLocal.ts`, `hooks/useDatos.ts`, `pages/grupos/Grupos.tsx`, `pages/cuenta/Cuenta.tsx` |
| EF 2: UI/UX y rendimiento | Campana con contador en el encabezado y en el menú, aviso cuando se trabaja sin conexión, filtros de grupos, validación del correo adicional. Las páginas se cargan por separado (`React.lazy`): el archivo principal bajó de 1.647 kB a 1.415 kB y Leaflet solo se descarga al abrir Inicio. La imagen de portada pasó de 1,4 MB (PNG) a 155 kB (JPG) y se eliminó una imagen sin uso de 640 kB. nginx comprime con gzip y guarda en caché las imágenes por 30 días | `routes/paginaDiferida.tsx`, `nginx.conf`, `public/assets/` |
| EF 3: seguridad | Además de lo de la EP2 (JWT, rutas protegidas, roles), el backend quita el HTML de todos los textos (XSS) y el perfil de otros usuarios ya no muestra su correo. nginx agrega los headers `X-Content-Type-Options`, `X-Frame-Options` y `Referrer-Policy`. Al cerrar sesión se borran los datos guardados en el dispositivo | Rama `Backend`, `nginx.conf`, `context/AuthContext.tsx` |
| EF 4: consultas eficientes | Índices en la base de datos, paginación en comentarios, publicaciones y notificaciones, y conteo de participantes con un solo `JOIN LATERAL`. El contador de la campana usa un endpoint que solo devuelve el número | Rama `Backend` |
| EF 5: servicio externo | Pronóstico del tiempo de [Open-Meteo](https://open-meteo.com/). El backend lo consulta, lo guarda 30 minutos en caché y responde 503 si el servicio no está disponible; la app muestra el error sin afectar el resto de la pantalla | `components/Clima.tsx`, `services/climaService.ts` |
| EF 6: Docker | `Dockerfile` en dos etapas (build con Node, servidor nginx) y `docker-compose.yml` en la rama `main` que levanta la base de datos, la API y el frontend | `Dockerfile`, `nginx.conf` |

### Notificaciones

El backend crea una notificación cada vez que pasa algo que le interesa al usuario (ver RF-14). La campana del encabezado consulta cada 60 segundos cuántas hay sin leer (solo mientras la pestaña está visible) y muestra un aviso cuando llega una nueva. En la página **Notificaciones** se pueden filtrar las no leídas, marcarlas como leídas (todas o una al tocarla, lo que además lleva a la pantalla correspondiente) y eliminarlas.

### Almacenamiento local

| Qué se guarda | Para qué | Cuánto dura |
|---|---|---|
| Token y datos del usuario | Mantener la sesión al cerrar el navegador | Hasta cerrar sesión o que el token expire |
| Filtros de Explorar rutas y de Grupos | Que al volver a la pantalla se mantengan los últimos filtros | Hasta cerrar sesión |
| Últimas rutas, grupos y detalles vistos | Mostrarlos si no hay conexión, con un aviso | 72 horas |

Todo se guarda con el prefijo `trekia:` y se borra al cerrar sesión.

## Matriz de trazabilidad

Cada requerimiento funcional con la pantalla que lo implementa, el servicio del frontend, el endpoint del backend y la prueba que lo verifica. Las pruebas de Postman están en `backend/docs/Trekia.postman_collection.json` (rama `Backend`) y las de Cypress en `cypress/e2e/trekia.cy.ts`.

| RF | Pantalla | Servicio | Endpoint | Prueba |
|---|---|---|---|---|
| RF-01 Mapa de rutas | Inicio (`pages/inicio/Inicio.tsx`) | `rutasService.obtenerRutas` | `GET /rutas` | Postman 3: Listar rutas |
| RF-02 Detalle de ruta | Detalle de ruta (`pages/rutas/DetalleRuta.tsx`) | `rutasService.obtenerRuta` | `GET /rutas/:id` | Postman 3: Detalle de una ruta · Cypress: detalle de una ruta |
| RF-03 Buscar y filtrar rutas | Explorar rutas (`pages/rutas/ExplorarRutas.tsx`) | `rutasService.obtenerRutas` | `GET /rutas?busqueda=&dificultad=...` | Postman 3: Filtrar y ordenar rutas, Intento de inyección SQL en la búsqueda |
| RF-04 Comentarios | Detalle de ruta | `rutasService.comentar`, `eliminarComentario` | `GET/POST /rutas/:id/comentarios`, `PATCH/DELETE /comentarios/:id` | Postman 4: Comentarios · Postman 12: Comentarios paginados |
| RF-05 Crear grupos | Crear grupo (`pages/grupos/CrearGrupo.tsx`) | `gruposService.crearGrupo` | `POST /grupos` | Postman 5: Crear grupo, Crear grupo con fecha pasada y cupo inválido |
| RF-06 Buscar y filtrar grupos | Grupos (`pages/grupos/Grupos.tsx`) | `gruposService.obtenerGrupos` | `GET /grupos?horario=&desde=&hasta=&cupoMax=&conCupos=` | Postman 12: Filtrar grupos con cupos y tamaño máximo, por horario y rango de fechas |
| RF-07 Participación en grupos | Detalle de grupo (`pages/grupos/DetalleGrupo.tsx`) | `solicitarParticipacion`, `responderSolicitud`, `obtenerMisSolicitudes` | `POST/GET/PATCH /grupos/:id/solicitudes`, `GET /solicitudes` | Postman 6: Solicitudes a grupos |
| RF-08 Perfil | Cuenta (`pages/cuenta/Cuenta.tsx`) | `authService.obtenerUsuario`, `actualizarPerfil` | `GET /usuarios/:id`, `PATCH /usuarios/me` | Postman 2: Usuarios · Postman 12: Perfil de otro usuario no expone correos |
| RF-09 Proponer rutas | Proponer ruta (`pages/rutas/ProponerRuta.tsx`) | `propuestasService` | `POST /propuestas` | Postman 7: Proponer una ruta |
| RF-10 Moderación | Rutas propuestas (`pages/admin/`) | `propuestasService` | `GET /propuestas`, `PATCH /propuestas/:id/revision` | Postman 7: Aprobar propuesta, Revisar propuesta sin ser administrador · Cypress: el administrador entra al panel |
| RF-11 Añadir amigos | Perfil de otro usuario (`pages/cuenta/Cuenta.tsx`) | `comunidadService.enviarSolicitudAmistad` | `POST /amistades` | Postman 9: Enviar solicitud de amistad |
| RF-12 Amigos y solicitudes | Comunidad (`pages/comunidad/Comunidad.tsx`) | `comunidadService` | `GET /amistades`, `GET /amistades/solicitudes`, `PATCH/DELETE /amistades/:id` | Postman 9: Amistades |
| RF-13 Configuración de la cuenta | Cuenta → Configuración | `authService.actualizarPerfil` | `PATCH /usuarios/me` (`correoAdicional`, `zonaHoraria`) | Postman 12: Configurar correo adicional y zona horaria, datos inválidos, correo igual al principal · Vitest: `formatos.test.ts` |
| RF-14 Notificaciones | Notificaciones (`pages/notificaciones/`) y campana (`components/AppHeader.tsx`) | `notificacionesService` | `GET /notificaciones`, `GET /notificaciones/no-leidas`, `PATCH /notificaciones/:id`, `PATCH /notificaciones/leidas`, `DELETE /notificaciones/:id` | Postman 12: Notificaciones · Cypress: el usuario ve sus notificaciones |
| RF-15 Pronóstico del clima | Detalle de ruta y de grupo (`components/Clima.tsx`) | `climaService.obtenerClima` | `GET /rutas/:id/clima` | Postman 12: Clima de una ruta, días fuera de rango, ruta que no existe · Cypress: detalle de una ruta |

| RNF | Cómo se cumple | Prueba |
|---|---|---|
| RNF-01 Rendimiento | Carga diferida de páginas, imágenes optimizadas, gzip, índices y paginación | Lighthouse o pestaña Network del navegador |
| RNF-02 Seguridad | `RutaPrivada` en el frontend y `requireAuth` / `requireRol` en el backend | Cypress: sin sesión redirige, el usuario no entra a administración · Postman: casos 401 y 403 |
| RNF-03 Credenciales | bcrypt en el backend | Postman 1: Registrar usuario nuevo |
| RNF-04 Usabilidad | Menú lateral fijo en web, menú desplegable en móvil, campana siempre visible | Revisión manual |
| RNF-05 Responsivo | `IonSplitPane` y CSS con grilla adaptable | Revisión en modo dispositivo |
| RNF-06 Accesibilidad | Etiquetas en los campos, `aria-label` en la campana y en los botones con solo ícono | Revisión manual |
| RNF-07 Integridad | Permisos por dueño o administrador en cada endpoint | Postman: casos 403 |
| RNF-08 Sin conexión | `useDatos` con caché en `localStorage` | Vitest: `almacenLocal.test.ts` |

## Progreso entre entregas

| | EP1 | EP2 | Entrega Final |
|---|---|---|---|
| Frontend | Prototipo en Figma y pantallas en Ionic con datos de ejemplo, rutas protegidas y navegación | Todas las pantallas conectadas a la API, JWT, roles, interceptores y manejo de errores | Notificaciones, clima, filtros de grupos, configuración de la cuenta, uso sin conexión, carga diferida |
| Backend | — | Express, PostgreSQL, API REST con CRUD, bcrypt, validaciones y protección contra inyección SQL | Notificaciones, integración con Open-Meteo, sanitización XSS, índices y paginación |
| Pruebas | — | 92 peticiones y 203 verificaciones en Postman | 120 peticiones y 276 verificaciones en Postman, pruebas unitarias con Vitest y de punta a punta con Cypress |
| Despliegue | — | Ejecución local con `npm` | Docker y docker-compose |

Correcciones respecto de la EP2:

- RF-06 (filtrar grupos por horario y cantidad de participantes) y RF-13 (correo adicional y zona horaria) estaban en los requerimientos pero no estaban programados.
- El perfil de otro usuario mostraba su correo; ahora solo muestra los datos públicos.
- Los grupos de prueba tenían fechas que ya habían pasado.
- La prueba de Cypress era la de la plantilla de Ionic y fallaba.
- `capacitor.config.ts` tenía el `appId` y el nombre de la plantilla (`io.ionic.starter`, `frontend`).

## Pruebas

```bash
cd frontend
npm run test.unit          # Vitest: render de la app, formatos y zona horaria, almacenamiento local
npm run test.e2e           # Cypress: necesita el backend y la app levantados
```

Cypress usa `http://localhost:5173` (`npm run dev`). Para probar contra Docker: `CYPRESS_BASE_URL=http://localhost:8080 npm run test.e2e`.

## Ejecución con Docker

El frontend tiene su `Dockerfile`: compila la app con Node y la sirve con nginx, que devuelve `index.html` en cualquier ruta para que funcione la navegación de React. La dirección de la API se define al construir la imagen, porque Vite la incrusta en el código:

```bash
cd frontend
docker build --build-arg VITE_API_URL=http://localhost:3000/api -t trekia-frontend .
docker run -p 8080:80 trekia-frontend
```

Para levantar todo el sistema (base de datos, API y frontend) con un solo comando, usar el `docker-compose.yml` de la rama `main`; las instrucciones están en su README.

---

## Estructura del proyecto

```
frontend/
├── Dockerfile             Build con Node y servidor nginx
├── nginx.conf             Rutas de React, gzip, caché y headers de seguridad
├── cypress/e2e/           Pruebas de punta a punta
├── public/
│   └── assets/            Imágenes
└── src/
    ├── components/        Componentes reutilizables (encabezado con campana, menú lateral, estado de carga, clima)
    ├── context/           Sesión y token (AuthContext) y contador de notificaciones (NotificacionesContext)
    ├── hooks/             useDatos: carga de datos desde la API, con caché para usar sin conexión
    ├── pages/             Pantallas agrupadas por sección
    │   ├── admin/
    │   ├── auth/
    │   ├── comunidad/
    │   ├── cuenta/
    │   ├── grupos/
    │   ├── inicio/
    │   ├── notificaciones/
    │   └── rutas/
    ├── routes/            Rutas, pestañas, rutas protegidas y carga diferida de páginas
    ├── services/          Conexión con la API (api.ts) y servicios por sección
    ├── theme/             Colores y tipografías
    ├── utils/             Formato de fechas según la zona horaria y almacenamiento local
    └── App.tsx
```

---

## Arquitectura de navegación

### Rutas

**Públicas**

| Ruta | Vista |
|---|---|
| `/login` | Inicio de sesión |
| `/registro` | Registro de usuario |

**Protegidas: Usuario**

| Ruta | Vista |
|---|---|
| `/app/inicio` | Inicio, con mapa, rutas destacadas y próximos grupos |
| `/app/rutas` | Explorar rutas, con buscador y filtros |
| `/app/rutas/:id` | Detalle de una ruta |
| `/app/grupos` | Listado de grupos |
| `/app/grupos/nuevo` | Crear grupo |
| `/app/grupos/:id` | Detalle de un grupo |
| `/app/comunidad` | Comunidad, publicaciones y solicitudes de amistad |
| `/app/propuesta` | Proponer una ruta |
| `/app/notificaciones` | Notificaciones |
| `/app/cuenta` | Cuenta, perfil y configuración |
| `/app/cuenta/:userId` | Perfil de otro usuario |

**Protegidas: Administrador**

| Ruta | Vista |
|---|---|
| `/admin/propuestas` | Rutas propuestas pendientes |
| `/admin/propuestas/:id` | Revisar una propuesta |

### Árbol de rutas

![Árbol de rutas](docs/diagramas/arbol-rutas.png)

### Acceso según rol

- Si alguien sin sesión intenta entrar a `/app` o `/admin`, se le redirige a `/login`.
- Si un usuario que no es administrador intenta entrar a `/admin`, se le redirige a `/app/inicio`.
- Si alguien con sesión entra a `/login` o `/registro`, se le lleva a su pantalla de inicio.

![Redirecciones](docs/diagramas/redirecciones.png) 

### Navegación en móvil y web

- **Móvil:** barra inferior con Inicio, Rutas, Grupos, Comunidad y Cuenta. Proponer ruta y cerrar sesión están en el menú desplegable.
- **Web:** menú lateral fijo con todas las opciones y el botón Proponer ruta.

### Task flows

**Participar en un grupo**

![Task flow participar en un grupo](docs/diagramas/taskflow-grupo.png)

**Proponer una ruta**

![Task flow proponer una ruta](docs/diagramas/taskflow-proponer.png)

**Consultar una ruta**

![Task flow consultar una ruta](docs/diagramas/taskflow-consultar.png)


## Capturas

| Pantalla | Web |
|---|---|---|
| Inicio de sesión | ![Login web](docs/capturas/login-web.png) | 
| Registro | ![Registro web](docs/capturas/registro-web.png) | 
| Inicio | ![Inicio web](docs/capturas/inicio-web.png) |
| Explorar rutas | ![Rutas web](docs/capturas/rutas-web.png) | 
| Comunidad | ![Comunidad web](docs/capturas/comunidad-web.png) | 
| Cuenta | ![Cuenta web](docs/capturas/cuenta-web.png) | 

---

## Recursos externos

- **Mapas:** © colaboradores de [OpenStreetMap](https://www.openstreetmap.org/copyright).
- **Íconos:** [Ionicons](https://ionic.io/ionicons).
- **Tipografías:** [Roboto](https://fonts.google.com/specimen/Roboto) y [Outfit](https://fonts.google.com/specimen/Outfit), de Google Fonts.
- **Pronóstico del tiempo:** datos de [Open-Meteo](https://open-meteo.com/) ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)).
- **Fotografía de las portadas (`fondo_trekking_2.jpg`):** _completar con el autor y la fuente de la imagen_.
- **Fuentes del problema:** [SENAPRED](https://senapred.cl/), [CONAF](https://www.conaf.cl/) y [AllTrails](https://www.alltrails.com/).
