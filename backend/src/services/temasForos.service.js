import db from '../config/db.js';

export const crearTemaForo = async (usuarioId, tema, contenido) => {
    await db.promise().query(
        'iNSERT INTO temas_foro (usuario_id, tema, contenido) VALUES (?, ?, ?)',
        [usuarioId, tema, contenido]
    );
};

export const obtenerTemasPaginados = async (page = 1, limite = 10, desde, hasta) => {
  const offset = (page - 1) * limite;
  const filtros = [];
  const params = [];

  if (desde) {
    filtros.push('t.fecha >= ?');
    params.push(desde);
  }

  if (hasta) {
    filtros.push('t.fecha <= ?');
    params.push(hasta);
  }

  const whereClause = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';

  const [rows] = await db.promise().query(
    `
    SELECT 
      t.id, t.tema, t.fecha, t.contenido,
      u.nombre,
      (SELECT COUNT(*) FROM respuestas r WHERE r.tema_id = t.id) AS cantidad_respuestas
    FROM temas_foro t
    JOIN usuarios u ON t.usuario_id = u.id
    ${whereClause}
    ORDER BY t.fecha DESC
    LIMIT ? OFFSET ?
    `,
    [...params, parseInt(limite), parseInt(offset)]
  );

  return rows;
};

export const obtenerTemasConRespuestas = async (temaId) => {
    // Obtener el tema
    const [temaRows] = await db.promise().query(
        `SELECT t.id, t.tema, t.contenido, t.fecha, u.nombre
        FROM temas_foro t
        JOIN usuarios u ON t.usuario_id = u.id
        WHERE t.id = ?`,
        [temaId]
    );

    // Si no existe el tema
    if (temaRows.length === 0) return null;

    // Obtener las respuestas
    const [respuestas] = await db.promise().query(
        `SELECT r.id, r.contenido, r.fecha, u.nombre
        FROM respuestas r
        JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.tema_id = ?
        ORDER BY r.fecha ASC`,
        [temaId]
    );

    return {
        ...temaRows[0],
        respuestas
    };
};