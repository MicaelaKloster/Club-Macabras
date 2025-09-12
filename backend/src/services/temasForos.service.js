import db from '../config/db.js';

export const crearTemaForo = async (usuarioId, tema, contenido) => {
    await db.query(
        'INSERT INTO temas_foro (usuario_id, tema, contenido) VALUES ($1, $2, $3)',
        [usuarioId, tema, contenido]
    );
};

export const obtenerTemasPaginados = async (page = 1, limite = 10, desde, hasta) => {
  const offset = (page - 1) * limite;
  const filtros = [];
  const params = [];
  let paramIndex = 1;

  if (desde) {
    filtros.push(`t.fecha >= $${paramIndex}`);
    params.push(desde);
    paramIndex++;
  }

  if (hasta) {
    filtros.push(`t.fecha <= $${paramIndex}`);
    params.push(hasta);
    paramIndex++;
  }

  const whereClause = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';

  const result = await db.query(
    `
    SELECT 
      t.id, t.tema, t.fecha, t.contenido,
      u.nombre,
      (SELECT COUNT(*) FROM respuestas r WHERE r.tema_id = t.id) AS cantidad_respuestas
    FROM temas_foro t
    JOIN usuarios u ON t.usuario_id = u.id
    ${whereClause}
    ORDER BY t.fecha DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `,
    [...params, parseInt(limite), parseInt(offset)]
  );

  return result.rows;
};

export const obtenerTemasConRespuestas = async (temaId) => {
    // Obtener el tema
    const temaResult = await db.query(
        `SELECT t.id, t.tema, t.contenido, t.fecha, u.nombre
        FROM temas_foro t
        JOIN usuarios u ON t.usuario_id = u.id
        WHERE t.id = $1`,
        [temaId]
    );

    // Si no existe el tema
    if (temaResult.rows.length === 0) return null;

    // Obtener las respuestas
    const respuestasResult = await db.query(
        `SELECT r.id, r.contenido, r.fecha, u.nombre
        FROM respuestas r
        JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.tema_id = $1
        ORDER BY r.fecha ASC`,
        [temaId]
    );

    return {
        ...temaResult.rows[0],
        respuestas: respuestasResult.rows
    };
};