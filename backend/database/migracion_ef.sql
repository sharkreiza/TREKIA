--
-- Cambios de la Entrega Final sobre una base de datos creada con el esquema de la EP2.
-- Si la base se crea desde cero con trekia_schema.sql no hace falta ejecutar este archivo.
--
-- Uso:  psql -U postgres -d trekia -f database/migracion_ef.sql
--

BEGIN;

ALTER TABLE public.usuarios
    ADD COLUMN IF NOT EXISTS correo_adicional character varying(150),
    ADD COLUMN IF NOT EXISTS zona_horaria character varying(60) DEFAULT 'America/Santiago'::character varying NOT NULL;

ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS chk_correo_adicional_distinto;
ALTER TABLE public.usuarios
    ADD CONSTRAINT chk_correo_adicional_distinto CHECK (((correo_adicional IS NULL) OR ((correo_adicional)::text <> (correo)::text)));

CREATE TABLE IF NOT EXISTS public.notificaciones (
    id_notificacion integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id integer NOT NULL REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
    tipo character varying(30) NOT NULL,
    mensaje character varying(300) NOT NULL,
    enlace character varying(200),
    leida boolean DEFAULT false NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_tipo_notificacion CHECK (((tipo)::text = ANY ((ARRAY['solicitud_grupo'::character varying, 'respuesta_grupo'::character varying, 'grupo_cancelado'::character varying, 'amistad'::character varying, 'respuesta_amistad'::character varying, 'propuesta'::character varying])::text[])))
);

CREATE INDEX IF NOT EXISTS idx_amistades_destinatario_estado ON public.amistades USING btree (destinatario_id, estado);
CREATE INDEX IF NOT EXISTS idx_comentarios_ruta_fecha ON public.comentarios USING btree (ruta_id, fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_grupos_fecha_salida ON public.grupos_trekking USING btree (fecha_salida);
CREATE INDEX IF NOT EXISTS idx_grupos_ruta ON public.grupos_trekking USING btree (ruta_id);
CREATE INDEX IF NOT EXISTS idx_grupos_creador ON public.grupos_trekking USING btree (creador_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario_fecha ON public.notificaciones USING btree (usuario_id, fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_notificaciones_no_leidas ON public.notificaciones USING btree (usuario_id) WHERE (leida = false);
CREATE INDEX IF NOT EXISTS idx_propuestas_usuario ON public.propuestas_ruta USING btree (usuario_id);
CREATE INDEX IF NOT EXISTS idx_propuestas_estado ON public.propuestas_ruta USING btree (estado);
CREATE INDEX IF NOT EXISTS idx_publicaciones_fecha ON public.publicaciones USING btree (fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_rutas_visibilidad_region ON public.rutas USING btree (visibilidad, region);
CREATE INDEX IF NOT EXISTS idx_solicitudes_usuario ON public.solicitudes_grupo USING btree (usuario_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_grupo_estado ON public.solicitudes_grupo USING btree (grupo_id, estado);

COMMIT;
