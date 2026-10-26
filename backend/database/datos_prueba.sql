INSERT INTO usuarios (nombre, correo, password_hash, rol, ubicacion) VALUES
  ('usuario_trekia', 'usuario@gmail.com', '$2b$10$K7MeDU903P6QcCl8B2aW7.MuSvoBW4xtBwMTWoskr.nfG5pIrPHbG', 'usuario', 'Santiago'),
  ('admin_trekia', 'admin@gmail.com', '$2b$10$z7yuy3eCROjt4Rz8H7x84OOSUKFr3N7HxHcHbmDjTvDAQyYi4d1Ki', 'administrador', 'Valparaíso'),
  ('Sofía Torres', 'sofia@gmail.com', '$2b$10$K7MeDU903P6QcCl8B2aW7.MuSvoBW4xtBwMTWoskr.nfG5pIrPHbG', 'usuario', 'Viña del Mar'),
  ('Matías Rojas', 'matias@gmail.com', '$2b$10$K7MeDU903P6QcCl8B2aW7.MuSvoBW4xtBwMTWoskr.nfG5pIrPHbG', 'usuario', 'Santiago');

INSERT INTO rutas (creador_id, nombre, descripcion, region, comuna, latitud, longitud, dificultad,
                   distancia_km, desnivel_positivo_m, duracion_minutos, tipo_ruta, tipo_recorrido) VALUES
  (2, 'Laguna El Yeso', 'Recorrido junto al embalse, con vistas a la cordillera y agua turquesa.',
   'Metropolitana', 'San José de Maipo', -33.667, -70.083, 'moderada', 12, 900, 300, 'laguna', 'ida_vuelta'),
  (2, 'Cerro Provincia', 'Subida exigente y muy expuesta al sol, con vista completa a Santiago.',
   'Metropolitana', 'Lo Barnechea', -33.36, -70.48, 'alta', 16, 1600, 480, 'cumbre', 'ida_vuelta'),
  (2, 'Parque La Campana', 'Sendero entre palmas chilenas, con sombra y agua en el camino.',
   'Valparaíso', 'Olmué', -32.957, -71.129, 'baja', 6, 400, 180, 'parque', 'ida_vuelta'),
  (2, 'Lago Peñuelas', 'Sendero plano alrededor del lago, ideal para empezar.',
   'Valparaíso', 'Valparaíso', -33.147, -71.544, 'baja', 4, 150, 90, 'lago', 'ida_vuelta'),
  (2, 'Cerro Mauco', 'Subida constante con vista al río Aconcagua y a la costa.',
   'Valparaíso', 'Concón', -32.87, -71.455, 'moderada', 6, 700, 180, 'cumbre', 'ida_vuelta');

INSERT INTO comentarios (usuario_id, ruta_id, contenido) VALUES
  (1, 1, 'El camino de tierra al final es angosto, conviene ir temprano.'),
  (1, 2, 'Llevar mínimo 3 litros de agua, no hay donde recargar.');

INSERT INTO grupos_trekking (creador_id, ruta_id, nombre, descripcion, fecha_salida, cupo_maximo, dificultad) VALUES
  (1, 2, 'Ascenso Cerro Provincia', 'Salida de día completo. Llevar 3 litros de agua y bloqueador.', '2026-11-15 07:00', 8, 'alta'),
  (1, 3, 'Ruta a Parque La Campana', 'Caminata tranquila, apta para principiantes.', '2026-11-08 11:00', 10, 'baja'),
  (2, 1, 'Salida fotográfica Laguna El Yeso', 'Nos juntamos temprano para aprovechar la luz de la mañana.', '2026-11-30 08:30', 12, 'moderada');

INSERT INTO solicitudes_grupo (grupo_id, usuario_id, estado) VALUES
  (1, 2, 'aceptada'),
  (3, 1, 'pendiente');

INSERT INTO propuestas_ruta (usuario_id, nombre, descripcion, region, comuna, dificultad, distancia_km,
                             duracion_minutos, tipo_ruta) VALUES
  (1, 'Salto del Apoquindo', 'Ruta larga que termina en una cascada. Conviene salir muy temprano.',
   'Metropolitana', 'Las Condes', 'alta', 18, 540, 'ida_vuelta'),
  (1, 'Sendero Quebrada Verde', 'Circuito corto con bosque nativo y vista al mar.',
   'Valparaíso', 'Valparaíso', 'baja', 5, 120, 'ida_vuelta');

INSERT INTO publicaciones (usuario_id, contenido, tipo) VALUES
  (3, '¡Increíbles vistas en el Cerro Provincia! La vista en la cumbre vale totalmente el esfuerzo. Si alguien quiere sumarse a la próxima, avisen.', 'experiencia'),
  (4, '¿Alguien tiene recomendaciones de chaquetas impermeables para trekking en la zona central? Busco algo liviano que aguante bien la lluvia.', 'consejo');

INSERT INTO amistades (solicitante_id, destinatario_id, estado) VALUES
  (3, 1, 'pendiente'),
  (4, 1, 'aceptada');
