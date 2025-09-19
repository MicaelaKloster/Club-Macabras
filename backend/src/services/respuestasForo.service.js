import db from '../config/db.js';

export const crearRespuestaEnTema = async (temaId, usuarioId, contenido) => {
    await db.query(
        'INSERT INTO respuestas (tema_id, usuario_id, contenido) VALUES ($1, $2, $3)',
        [temaId, usuarioId, contenido]
    );
};

// NUEVAS FUNCIONES AGREGADAS (18/09)

// Obtener una respuesta específica por ID
export const obtenerRespuestaPorId = async (id) => {
  const result = await db.query(
    `SELECT 
      r.id,
      r.contenido,
      r.fecha,
      r.tema_id,
      r.usuario_id,
      u.nombre AS usuario
    FROM respuestas r
    JOIN usuarios u ON r.usuario_id = u.id
    WHERE r.id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

// Editar respuesta (solo el usuario que la creó)
export const editarRespuesta = async (id, usuarioId, nuevoContenido) => {
  const result = await db.query(
    `UPDATE respuestas 
     SET contenido = $1 
     WHERE id = $2 AND usuario_id = $3 
     RETURNING *`,
    [nuevoContenido, id, usuarioId]
  );

  return result.rows[0] || null;
};

// Eliminar respuesta (usuario propietario o admin)
export const eliminarRespuesta = async (id, usuarioId = null, esAdmin = false) => {
  let query;
  let params;

  if (esAdmin) {
    // Admin puede eliminar cualquier respuesta
    query = 'DELETE FROM respuestas WHERE id = $1 RETURNING *';
    params = [id];
  } else {
    // Usuario solo puede eliminar sus propias respuestas
    query = 'DELETE FROM respuestas WHERE id = $1 AND usuario_id = $2 RETURNING *';
    params = [id, usuarioId];
  }

  const result = await db.query(query, params);
  return result.rows[0] || null;
};