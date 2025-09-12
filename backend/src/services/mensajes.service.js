import db from '../config/db.js';

export const enviarMensaje = async (usuarioOrigen, usuarioDestino, contenido) => {
    await db.query(
        `INSERT INTO mensajes (usuario_origen, usuario_destino, contenido) VALUES ($1, $2, $3)`,
        [usuarioOrigen, usuarioDestino, contenido]
    );
};

export const obtenerMensajesConUsuario = async (usuarioLogueadoId, otroUsuarioId) => {
  const result = await db.query(
    `
    SELECT 
      m.id,
      m.usuario_origen,
      m.usuario_destino,
      m.contenido,
      m.fecha,
      u_origen.nombre AS nombre_origen,
      u_destino.nombre AS nombre_destino
    FROM mensajes m
    JOIN usuarios u_origen ON m.usuario_origen = u_origen.id
    JOIN usuarios u_destino ON m.usuario_destino = u_destino.id
    WHERE 
      (m.usuario_origen = $1 AND m.usuario_destino = $2)
      OR
      (m.usuario_origen = $3 AND m.usuario_destino = $4)
    ORDER BY m.fecha ASC
    `,
    [usuarioLogueadoId, otroUsuarioId, otroUsuarioId, usuarioLogueadoId]
  );

  return result.rows;
};

export const obtenerInboxUsuario = async (usuarioId) => {
  const result = await db.query(
    `
    SELECT m1.*
    FROM mensajes m1
    INNER JOIN (
      SELECT 
        LEAST(usuario_origen, usuario_destino) AS u1,
        GREATEST(usuario_origen, usuario_destino) AS u2,
        MAX(fecha) AS ultima_fecha
      FROM mensajes
      WHERE usuario_origen = $1 OR usuario_destino = $2
      GROUP BY u1, u2
    ) m2
    ON (
      LEAST(m1.usuario_origen, m1.usuario_destino) = m2.u1 AND
      GREATEST(m1.usuario_origen, m1.usuario_destino) = m2.u2 AND
      m1.fecha = m2.ultima_fecha
    )
    ORDER BY m1.fecha DESC
    `,
    [usuarioId, usuarioId]
  );

  // Enriquecer con el nombre del contacto
  const enriched = await Promise.all(result.rows.map(async (msg) => {
    const contactoId = msg.usuario_origen === usuarioId ? msg.usuario_destino : msg.usuario_origen;

    const contactoResult = await db.query(
      'SELECT nombre FROM usuarios WHERE id = $1',
      [contactoId]
    );

    return {
      ...msg,
      nombre_contacto: contactoResult.rows[0]?.nombre || '',
      id_contacto: contactoId
    };
  }));

  return enriched;
};