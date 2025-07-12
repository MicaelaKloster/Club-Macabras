import db from '../config/db.js';

export const enviarMensaje = async (usuarioOrigen, usuarioDestino, contenido) => {
    await db.promise().query(
        `INSERT INTO mensajes (usuario_origen, usuario_destino, contenido) VALUES (?, ?, ?)`,
        [usuarioOrigen, usuarioDestino, contenido]
    );
};

export const obtenerMensajesConUsuario = async (usuarioLogueadoId, otroUsuarioId) => {
  const [rows] = await db.promise().query(
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
      (m.usuario_origen = ? AND m.usuario_destino = ?)
      OR
      (m.usuario_origen = ? AND m.usuario_destino = ?)
    ORDER BY m.fecha ASC
    `,
    [usuarioLogueadoId, otroUsuarioId, otroUsuarioId, usuarioLogueadoId]
  );

  return rows;
};

export const obtenerInboxUsuario = async (usuarioId) => {
  const [rows] = await db.promise().query(
    `
    SELECT m1.*
    FROM mensajes m1
    INNER JOIN (
      SELECT 
        LEAST(usuario_origen, usuario_destino) AS u1,
        GREATEST(usuario_origen, usuario_destino) AS u2,
        MAX(fecha) AS ultima_fecha
      FROM mensajes
      WHERE usuario_origen = ? OR usuario_destino = ?
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
  const enriched = await Promise.all(rows.map(async (msg) => {
    const contactoId = msg.usuario_origen === usuarioId ? msg.usuario_destino : msg.usuario_origen;

    const [contacto] = await db.promise().query(
      'SELECT nombre FROM usuarios WHERE id = ?',
      [contactoId]
    );

    return {
      ...msg,
      nombre_contacto: contacto[0]?.nombre || '',
      id_contacto: contactoId
    };
  }));

  return enriched;
};