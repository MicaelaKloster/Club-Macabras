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