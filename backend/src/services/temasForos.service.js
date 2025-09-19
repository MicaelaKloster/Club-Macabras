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
      t.id, t.tema, t.fecha, t.contenido, t.usuario_id,
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
        `SELECT t.id, t.tema, t.contenido, t.fecha, t.usuario_id, u.nombre
        FROM temas_foro t
        JOIN usuarios u ON t.usuario_id = u.id
        WHERE t.id = $1`,
        [temaId]
    );

    // Si no existe el tema
    if (temaResult.rows.length === 0) return null;

    // Obtener las respuestas
    const respuestasResult = await db.query(
        `SELECT r.id, r.contenido, r.fecha, r.usuario_id, u.nombre
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

// NUEVAS FUNCIONES AGREGADAS (18/09)

// Obtener un tema específico por ID
export const obtenerTemaPorId = async (id) => {
  const result = await db.query(
    `SELECT 
      t.id,
      t.tema,
      t.contenido,
      t.fecha,
      t.usuario_id,
      u.nombre AS usuario
    FROM temas_foro t
    JOIN usuarios u ON t.usuario_id = u.id
    WHERE t.id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

// Editar tema del foro (solo el usuario que lo creó)
export const editarTemaForo = async (id, usuarioId, nuevoTema, nuevoContenido) => {
  const result = await db.query(
    `UPDATE temas_foro 
     SET tema = $1, contenido = $2 
     WHERE id = $3 AND usuario_id = $4 
     RETURNING *`,
    [nuevoTema, nuevoContenido, id, usuarioId]
  );

  return result.rows[0] || null;
};

// Eliminar tema del foro (usuario propietario o admin)
export const eliminarTemaForo = async (id, usuarioId = null, esAdmin = false) => {
  // Iniciar transacción para eliminar tema y sus respuestas
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    let temaQuery;
    let temaParams;

    if (esAdmin) {
      // Admin puede eliminar cualquier tema
      temaQuery = 'SELECT * FROM temas_foro WHERE id = $1';
      temaParams = [id];
    } else {
      // Usuario solo puede eliminar sus propios temas
      temaQuery = 'SELECT * FROM temas_foro WHERE id = $1 AND usuario_id = $2';
      temaParams = [id, usuarioId];
    }

    // Verificar si el tema existe y si el usuario tiene permisos
    const temaResult = await client.query(temaQuery, temaParams);
    
    if (temaResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    // Eliminar todas las respuestas del tema primero
    await client.query('DELETE FROM respuestas WHERE tema_id = $1', [id]);
    
    // Eliminar el tema
    const deleteResult = await client.query(
      'DELETE FROM temas_foro WHERE id = $1 RETURNING *',
      [id]
    );

    await client.query('COMMIT');
    return deleteResult.rows[0];
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};