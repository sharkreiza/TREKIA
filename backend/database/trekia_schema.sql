--
-- PostgreSQL database dump (esquema de Trekia)
-- Dumped from database version 18.6 / pg_dump 18.6 (2026-10-20)
--
-- Se quitaron las líneas \restrict / \unrestrict del dump original para que
-- el script también pueda ejecutarse desde pgAdmin, no solo desde psql 18.
--
-- Uso:  createdb trekia
--       psql -U postgres -d trekia -f database/trekia_schema.sql
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Tipos ENUM
--

CREATE TYPE public.dificultad_ruta AS ENUM (
    'baja',
    'moderada',
    'alta'
);

ALTER TYPE public.dificultad_ruta OWNER TO postgres;

CREATE TYPE public.estado_grupo AS ENUM (
    'abierto',
    'completo',
    'cancelado',
    'finalizado'
);

ALTER TYPE public.estado_grupo OWNER TO postgres;

CREATE TYPE public.estado_propuesta AS ENUM (
    'pendiente',
    'aprobada',
    'rechazada'
);

ALTER TYPE public.estado_propuesta OWNER TO postgres;

CREATE TYPE public.estado_solicitud AS ENUM (
    'pendiente',
    'aceptada',
    'rechazada'
);

ALTER TYPE public.estado_solicitud OWNER TO postgres;

CREATE TYPE public.rol_usuario AS ENUM (
    'usuario',
    'administrador'
);

ALTER TYPE public.rol_usuario OWNER TO postgres;

CREATE TYPE public.tipo_recorrido AS ENUM (
    'solo_ida',
    'ida_vuelta'
);

ALTER TYPE public.tipo_recorrido OWNER TO postgres;

CREATE TYPE public.visibilidad_contenido AS ENUM (
    'publico',
    'solo_amigos',
    'privado'
);

ALTER TYPE public.visibilidad_contenido OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Tablas
--

CREATE TABLE public.amistades (
    id_amistad integer NOT NULL,
    solicitante_id integer NOT NULL,
    destinatario_id integer NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    fecha_solicitud timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_amistad_distinta CHECK ((solicitante_id <> destinatario_id)),
    CONSTRAINT chk_estado_amistad CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'aceptada'::character varying, 'rechazada'::character varying])::text[])))
);

ALTER TABLE public.amistades OWNER TO postgres;

ALTER TABLE public.amistades ALTER COLUMN id_amistad ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.amistades_id_amistad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.comentarios (
    id_comentario integer NOT NULL,
    usuario_id integer NOT NULL,
    ruta_id integer NOT NULL,
    contenido text NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_comentario_no_vacio CHECK ((length(TRIM(BOTH FROM contenido)) > 0))
);

ALTER TABLE public.comentarios OWNER TO postgres;

ALTER TABLE public.comentarios ALTER COLUMN id_comentario ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comentarios_id_comentario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.fotos_publicacion (
    id_foto integer NOT NULL,
    publicacion_id integer NOT NULL,
    url_foto text NOT NULL
);

ALTER TABLE public.fotos_publicacion OWNER TO postgres;

ALTER TABLE public.fotos_publicacion ALTER COLUMN id_foto ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.fotos_publicacion_id_foto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.fotos_ruta (
    id_foto integer NOT NULL,
    ruta_id integer NOT NULL,
    url_foto text NOT NULL,
    descripcion character varying(200)
);

ALTER TABLE public.fotos_ruta OWNER TO postgres;

ALTER TABLE public.fotos_ruta ALTER COLUMN id_foto ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.fotos_ruta_id_foto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.grupos_trekking (
    id_grupo integer NOT NULL,
    creador_id integer NOT NULL,
    ruta_id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    fecha_salida timestamp without time zone NOT NULL,
    cupo_maximo integer NOT NULL,
    dificultad public.dificultad_ruta NOT NULL,
    estado character varying(20) DEFAULT 'abierto'::character varying NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_cupo_positivo CHECK ((cupo_maximo > 0)),
    CONSTRAINT chk_estado_grupo CHECK (((estado)::text = ANY ((ARRAY['abierto'::character varying, 'cerrado'::character varying, 'cancelado'::character varying])::text[])))
);

ALTER TABLE public.grupos_trekking OWNER TO postgres;

ALTER TABLE public.grupos_trekking ALTER COLUMN id_grupo ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.grupos_trekking_id_grupo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.propuestas_ruta (
    id_propuesta integer NOT NULL,
    usuario_id integer NOT NULL,
    revisado_por integer,
    ruta_aprobada_id integer,
    nombre character varying(150) NOT NULL,
    descripcion text NOT NULL,
    region character varying(100),
    comuna character varying(100),
    latitud numeric(10,7),
    longitud numeric(10,7),
    dificultad public.dificultad_ruta NOT NULL,
    distancia_km numeric(7,2),
    desnivel_positivo_m integer,
    desnivel_negativo_m integer,
    duracion_minutos integer,
    tipo_ruta public.tipo_recorrido NOT NULL,
    visibilidad public.visibilidad_contenido DEFAULT 'publico'::public.visibilidad_contenido NOT NULL,
    estado public.estado_propuesta DEFAULT 'pendiente'::public.estado_propuesta NOT NULL,
    observaciones_admin text,
    fecha_propuesta timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_revision timestamp without time zone
);

ALTER TABLE public.propuestas_ruta OWNER TO postgres;

ALTER TABLE public.propuestas_ruta ALTER COLUMN id_propuesta ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.propuestas_ruta_id_propuesta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.publicaciones (
    id_publicacion integer NOT NULL,
    usuario_id integer NOT NULL,
    contenido text NOT NULL,
    tipo character varying(30) DEFAULT 'experiencia'::character varying NOT NULL,
    visibilidad public.visibilidad_contenido DEFAULT 'publico'::public.visibilidad_contenido NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_publicacion_no_vacia CHECK ((length(TRIM(BOTH FROM contenido)) > 0)),
    CONSTRAINT chk_tipo_publicacion CHECK (((tipo)::text = ANY ((ARRAY['experiencia'::character varying, 'consejo'::character varying, 'foto'::character varying, 'otro'::character varying])::text[])))
);

ALTER TABLE public.publicaciones OWNER TO postgres;

ALTER TABLE public.publicaciones ALTER COLUMN id_publicacion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.publicaciones_id_publicacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.rutas (
    id_ruta integer NOT NULL,
    creador_id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text NOT NULL,
    region character varying(100) NOT NULL,
    comuna character varying(100) NOT NULL,
    latitud numeric(10,7),
    longitud numeric(10,7),
    dificultad public.dificultad_ruta NOT NULL,
    distancia_km numeric(7,2),
    desnivel_positivo_m integer,
    desnivel_negativo_m integer,
    duracion_minutos integer,
    tipo_ruta character varying(30) NOT NULL,
    visibilidad public.visibilidad_contenido DEFAULT 'publico'::public.visibilidad_contenido NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tipo_recorrido public.tipo_recorrido DEFAULT 'ida_vuelta'::public.tipo_recorrido NOT NULL,
    CONSTRAINT chk_distancia_positiva CHECK (((distancia_km IS NULL) OR (distancia_km > (0)::numeric))),
    CONSTRAINT chk_duracion_positiva CHECK (((duracion_minutos IS NULL) OR (duracion_minutos > 0)))
);

ALTER TABLE public.rutas OWNER TO postgres;

CREATE TABLE public.rutas_guardadas (
    usuario_id integer NOT NULL,
    ruta_id integer NOT NULL,
    fecha_guardado timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE public.rutas_guardadas OWNER TO postgres;

ALTER TABLE public.rutas ALTER COLUMN id_ruta ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rutas_id_ruta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.solicitudes_grupo (
    id_solicitud integer NOT NULL,
    grupo_id integer NOT NULL,
    usuario_id integer NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    fecha_solicitud timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_respuesta timestamp without time zone,
    CONSTRAINT chk_estado_solicitud CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'aceptada'::character varying, 'rechazada'::character varying])::text[])))
);

ALTER TABLE public.solicitudes_grupo OWNER TO postgres;

ALTER TABLE public.solicitudes_grupo ALTER COLUMN id_solicitud ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.solicitudes_grupo_id_solicitud_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nombre character varying(100) NOT NULL,
    correo character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol public.rol_usuario DEFAULT 'usuario'::public.rol_usuario NOT NULL,
    ubicacion character varying(120),
    biografia text,
    foto_perfil_url text,
    foto_portada_url text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE public.usuarios OWNER TO postgres;

ALTER TABLE public.usuarios ALTER COLUMN id_usuario ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usuarios_id_usuario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Claves primarias y UNIQUE
--

ALTER TABLE ONLY public.amistades
    ADD CONSTRAINT amistades_pkey PRIMARY KEY (id_amistad);

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT comentarios_pkey PRIMARY KEY (id_comentario);

ALTER TABLE ONLY public.fotos_publicacion
    ADD CONSTRAINT fotos_publicacion_pkey PRIMARY KEY (id_foto);

ALTER TABLE ONLY public.fotos_ruta
    ADD CONSTRAINT fotos_ruta_pkey PRIMARY KEY (id_foto);

ALTER TABLE ONLY public.grupos_trekking
    ADD CONSTRAINT grupos_trekking_pkey PRIMARY KEY (id_grupo);

ALTER TABLE ONLY public.rutas_guardadas
    ADD CONSTRAINT pk_rutas_guardadas PRIMARY KEY (usuario_id, ruta_id);

ALTER TABLE ONLY public.propuestas_ruta
    ADD CONSTRAINT propuestas_ruta_pkey PRIMARY KEY (id_propuesta);

ALTER TABLE ONLY public.publicaciones
    ADD CONSTRAINT publicaciones_pkey PRIMARY KEY (id_publicacion);

ALTER TABLE ONLY public.rutas
    ADD CONSTRAINT rutas_pkey PRIMARY KEY (id_ruta);

ALTER TABLE ONLY public.solicitudes_grupo
    ADD CONSTRAINT solicitudes_grupo_pkey PRIMARY KEY (id_solicitud);

ALTER TABLE ONLY public.amistades
    ADD CONSTRAINT uq_amistad_usuarios UNIQUE (solicitante_id, destinatario_id);

ALTER TABLE ONLY public.solicitudes_grupo
    ADD CONSTRAINT uq_solicitud_usuario_grupo UNIQUE (grupo_id, usuario_id);

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);

CREATE UNIQUE INDEX uq_amistad_par_unico ON public.amistades USING btree (LEAST(solicitante_id, destinatario_id), GREATEST(solicitante_id, destinatario_id));

--
-- Claves foráneas
--

ALTER TABLE ONLY public.amistades
    ADD CONSTRAINT fk_amistades_destinatario FOREIGN KEY (destinatario_id) REFERENCES public.usuarios(id_usuario);

ALTER TABLE ONLY public.amistades
    ADD CONSTRAINT fk_amistades_solicitante FOREIGN KEY (solicitante_id) REFERENCES public.usuarios(id_usuario);

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT fk_comentarios_ruta FOREIGN KEY (ruta_id) REFERENCES public.rutas(id_ruta);

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT fk_comentarios_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id_usuario);

ALTER TABLE ONLY public.fotos_publicacion
    ADD CONSTRAINT fk_fotos_publicacion_publicacion FOREIGN KEY (publicacion_id) REFERENCES public.publicaciones(id_publicacion) ON DELETE CASCADE;

ALTER TABLE ONLY public.fotos_ruta
    ADD CONSTRAINT fk_fotos_ruta_ruta FOREIGN KEY (ruta_id) REFERENCES public.rutas(id_ruta) ON DELETE CASCADE;

ALTER TABLE ONLY public.grupos_trekking
    ADD CONSTRAINT fk_grupos_creador FOREIGN KEY (creador_id) REFERENCES public.usuarios(id_usuario);

ALTER TABLE ONLY public.grupos_trekking
    ADD CONSTRAINT fk_grupos_ruta FOREIGN KEY (ruta_id) REFERENCES public.rutas(id_ruta);

ALTER TABLE ONLY public.propuestas_ruta
    ADD CONSTRAINT fk_propuesta_revisor FOREIGN KEY (revisado_por) REFERENCES public.usuarios(id_usuario);

ALTER TABLE ONLY public.propuestas_ruta
    ADD CONSTRAINT fk_propuesta_ruta_aprobada FOREIGN KEY (ruta_aprobada_id) REFERENCES public.rutas(id_ruta);

ALTER TABLE ONLY public.propuestas_ruta
    ADD CONSTRAINT fk_propuesta_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id_usuario);

ALTER TABLE ONLY public.publicaciones
    ADD CONSTRAINT fk_publicaciones_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id_usuario);

ALTER TABLE ONLY public.rutas
    ADD CONSTRAINT fk_rutas_creador FOREIGN KEY (creador_id) REFERENCES public.usuarios(id_usuario);

ALTER TABLE ONLY public.rutas_guardadas
    ADD CONSTRAINT fk_rutas_guardadas_ruta FOREIGN KEY (ruta_id) REFERENCES public.rutas(id_ruta) ON DELETE CASCADE;

ALTER TABLE ONLY public.rutas_guardadas
    ADD CONSTRAINT fk_rutas_guardadas_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;

ALTER TABLE ONLY public.solicitudes_grupo
    ADD CONSTRAINT fk_solicitud_grupo FOREIGN KEY (grupo_id) REFERENCES public.grupos_trekking(id_grupo);

ALTER TABLE ONLY public.solicitudes_grupo
    ADD CONSTRAINT fk_solicitud_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id_usuario);
