import db from '../config/db.js';

export const crearPregunta = async (usuarioId, cursoId, pregunta) => {
    await db.query(
        'INSERT INTO preguntas_respuestas (usuario_id, curso_id, pregunta) VALUES ($1, $2, $3)',
        [usuarioId, cursoId, pregunta]
    );
};

export const obtenerPreguntasPorCurso = async (cursoId) => {
    const result = await db.query(
        `SELECT 
        p.id,
        p.pregunta,
        p.respuesta,
        p.fecha,
        p.usuario_id,
        u.nombre AS usuario,
        CASE WHEN p.respuesta IS NULL OR p.respuesta = '' THEN false ELSE true END AS respondida
        FROM preguntas_respuestas p
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.curso_id = $1
        ORDER BY p.fecha DESC`,
        [cursoId]
    );

    return result.rows;
};

export const responderPregunta = async (id, respuesta) => {
  await db.query(
    `UPDATE preguntas_respuestas SET respuesta = $1 WHERE id = $2`,
    [respuesta, id]
  );
};

export const obtenerTodasLasPreguntas = async () => {
  const result = await db.query(
    `SELECT 
      p.id,
      p.pregunta,
      p.respuesta,
      p.fecha,
      p.curso_id,
      p.usuario_id,
      u.nombre AS usuario,
      c.titulo AS curso,
      CASE WHEN p.respuesta IS NULL OR p.respuesta = '' THEN false ELSE true END AS respondida
    FROM preguntas_respuestas p
    JOIN usuarios u ON p.usuario_id = u.id
    JOIN cursos c ON p.curso_id = c.id
    ORDER BY p.fecha DESC`
  );

  return result.rows;
};

// NUEVAS FUNCIONES AGREGADAS (18/09)

// Obtener una pregunta específica por ID
export const obtenerPreguntaPorId = async (id) => {
  const result = await db.query(
    `SELECT 
      p.id,
      p.pregunta,
      p.respuesta,
      p.fecha,
      p.curso_id,
      p.usuario_id,
      u.nombre AS usuario,
      c.titulo AS curso
    FROM preguntas_respuestas p
    JOIN usuarios u ON p.usuario_id = u.id
    JOIN cursos c ON p.curso_id = c.id
    WHERE p.id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

// Editar pregunta (solo el usuario que la creó)
export const editarPregunta = async (id, usuarioId, nuevaPregunta) => {
  const result = await db.query(
    `UPDATE preguntas_respuestas 
     SET pregunta = $1 
     WHERE id = $2 AND usuario_id = $3 
     RETURNING *`,
    [nuevaPregunta, id, usuarioId]
  );

  return result.rows[0] || null;
};

// Editar respuesta (solo admin)
export const editarRespuesta = async (id, nuevaRespuesta) => {
  const result = await db.query(
    `UPDATE preguntas_respuestas 
     SET respuesta = $1 
     WHERE id = $2 
     RETURNING *`,
    [nuevaRespuesta, id]
  );

  return result.rows[0] || null;
};

// Eliminar pregunta (usuario propietario o admin)
export const eliminarPregunta = async (id, usuarioId = null, esAdmin = false) => {
  let query;
  let params;

  if (esAdmin) {
    // Admin puede eliminar cualquier pregunta
    query = 'DELETE FROM preguntas_respuestas WHERE id = $1 RETURNING *';
    params = [id];
  } else {
    // Usuario solo puede eliminar sus propias preguntas
    query = 'DELETE FROM preguntas_respuestas WHERE id = $1 AND usuario_id = $2 RETURNING *';
    params = [id, usuarioId];
  }

  const result = await db.query(query, params);
  return result.rows[0] || null;
};