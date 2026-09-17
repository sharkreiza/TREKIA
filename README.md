 # TREKIA

| Recurso | Enlace |
|---|---|
| Repositorio | [github.com/sharkreiza/TREKIA](https://github.com/sharkreiza/TREKIA) |
| Prototipo en Figma | [Ver prototipo](https://www.figma.com/design/WMb2Anjua4phaU07XYjBcN/Sin-t%C3%ADtulo) |
| Informe EP1 | [Ver informe](docs/Informe-EP1.pdf) |


## Integrantes y responsabilidades

| Integrante | Responsabilidades |
| Antonia Albar | _parte 1.1 y 1.2_ |
| Vicente Girardin | _figma_ |
| Camila Ramirez | _1.4,1.5,1.6_ |

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
- Perfil de usuario y lista de amigos con solicitudes de amistad.
- Propuesta de rutas nuevas.
- Configuración de la cuenta.
- Panel de administrador para aprobar o rechazar rutas propuestas.


## Requerimientos funcionales

| ID | Nombre | Rol | Descripción |
|---|---|---|---|
| RF-01 | Visualización de rutas en mapa interactivo | Usuario | El sistema deberá permitir visualizar las rutas de trekking disponibles mediante marcadores en un mapa interactivo. |
| RF-02 | Consulta detallada de una ruta | Usuario | El sistema deberá permitir seleccionar una ruta y consultar su nombre, ubicación, descripción, dificultad, distancia, inclinación, duración estimada y recorrido. |
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
| RF-13 | Configuración de la cuenta | Usuario | El sistema deberá permitir modificar los datos de la cuenta, agregar un correo adicional y seleccionar la zona horaria. |

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


## Tecnologías y herramientas

| Área | Tecnología |
| Frontend | Ionic 9, React 19, TypeScript |
| Navegación | React Router 6 (`@ionic/react-router`) |
| Mapa | Leaflet con mapas de OpenStreetMap |
| Móvil | Capacitor |
| Build | Vite |
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

## Ejecución y uso

Para levantar la aplicación en modo desarrollo:

```bash
ionic serve
```

Se abrirá en el navegador en `http://localhost:8100`. Para ver la versión móvil, achicar la ventana o usar el modo de dispositivo del navegador (F12).

### Usuarios de prueba

Por ahora el frontend usa datos de prueba, porque el backend se implementará en la Entrega Parcial 2.

| Rol | Correo | Contraseña |
|---|---|---|
| Usuario | `usuario@gmail.com` | `Trekia123` |
| Administrador | `admin@gmail.com` | `Admin123` |

También se puede crear una cuenta nueva desde **Registro**, aunque se borra al recargar la página.

### Qué probar

- Entrar sin sesión a `/app/mapa` redirige a `/login`.
- Entrar como usuario a `/admin/propuestas` redirige a `/app/mapa`.
- En el **Mapa**, usar el botón **Filtros** y tocar un marcador para ver la ruta.
- En **Amigos**, aceptar o rechazar una solicitud.

---

## Estructura del proyecto

```
frontend/
├── public/
│   └── assets/            Imágenes
└── src/
    ├── components/        Componentes reutilizables (encabezado, menú lateral)
    ├── context/           Manejo de la sesión (AuthContext)
    ├── pages/             Pantallas agrupadas por sección
    │   ├── admin/
    │   ├── amigos/
    │   ├── auth/
    │   ├── configuracion/
    │   ├── grupos/
    │   ├── perfil/
    │   └── rutas/
    ├── routes/            Rutas, pestañas y rutas protegidas
    ├── services/          Datos de rutas, amigos y autenticación
    ├── theme/             Colores y tipografías
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
| `/app/mapa` | Mapa de rutas |
| `/app/mapa/ruta/:id` | Detalle de una ruta |
| `/app/grupos` | Listado de grupos |
| `/app/grupos/nuevo` | Crear grupo |
| `/app/grupos/:id` | Detalle de un grupo |
| `/app/amigos` | Amigos y solicitudes |
| `/app/propuesta` | Proponer una ruta |
| `/app/perfil` | Perfil propio |
| `/app/perfil/:userId` | Perfil de otro usuario |
| `/app/configuracion` | Configuración de la cuenta |

**Protegidas: Administrador**

| Ruta | Vista |
|---|---|
| `/admin/propuestas` | Rutas propuestas pendientes |
| `/admin/propuestas/:id` | Revisar una propuesta |

### Árbol de rutas

Árbol de rutas : docs/diagramas/arbol-rutas.png

### Acceso según rol

- Si alguien sin sesión intenta entrar a `/app` o `/admin`, se le redirige a `/login`.
- Si un usuario que no es administrador intenta entrar a `/admin`, se le redirige a `/app/mapa`.
- Si alguien con sesión entra a `/login` o `/registro`, se le lleva a su pantalla de inicio.

Redirecciones : docs/diagramas/redirecciones.png 

### Navegación en móvil y web

- **Móvil:** barra inferior con Mapa, Grupos, Amigos y Perfil. El resto de las opciones está en el menú desplegable.
- **Web:** menú lateral fijo con todas las opciones.

### Task flows

**Participar en un grupo**

Task flow participar en un grupo : docs/diagramas/taskflow-grupo.png

**Proponer una ruta**

Task flow proponer una ruta : docs/diagramas/taskflow-proponer.png

**Consultar una ruta**

Task flow consultar una ruta : docs/diagramas/taskflow-consultar.png


## Capturas

| Pantalla | Web | Móvil |
|---|---|---|
| Inicio de sesión | ![Login web](docs/capturas/login-web.png) | ![Login móvil](docs/capturas/login-movil.png) |
| Registro | ![Registro web](docs/capturas/registro-web.png) | ![Registro móvil](docs/capturas/registro-movil.png) |
| Mapa | ![Mapa web](docs/capturas/mapa-web.png) | ![Mapa móvil](docs/capturas/mapa-movil.png) |
| Amigos | ![Amigos web](docs/capturas/amigos-web.png) | ![Amigos móvil](docs/capturas/amigos-movil.png) |
| Configuración | ![Configuración web](docs/capturas/configuracion-web.png) | ![Configuración móvil](docs/capturas/configuracion-movil.png) |

---

## Recursos externos

- **Mapas:** © colaboradores de [OpenStreetMap](https://www.openstreetmap.org/copyright).
- **Íconos:** [Ionicons](https://ionic.io/ionicons).
- **Tipografías:** [Poppins](https://fonts.google.com/specimen/Poppins) y [Rationale](https://fonts.google.com/specimen/Rationale), de Google Fonts.
- **Fotografía de la pantalla de inicio de sesión:** _completar con el autor y la fuente de la imagen_.
- **Fuentes del problema:** [SENAPRED](https://senapred.cl/), [CONAF](https://www.conaf.cl/) y [AllTrails](https://www.alltrails.com/).
