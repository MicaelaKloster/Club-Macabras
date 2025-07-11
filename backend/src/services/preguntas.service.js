import db from '../config/db.js';

export const crearPregunta = async (usuarioId, cursoId, pregunta) => {
    await db.promise().query(
        'INSERT INTO preguntas_respuestas (usuario_id, curso_id, pregunta) VALUES (?, ?, ?)',
        [usuarioId, cursoId, pregunta]
    );
};

export const obtenerPreguntasPorCurso = async (cursoId) => {
    const [rows] = await db.promise().query(
        `SELECT 
        p.id,
        p.pregunta,
        p.respuesta,
        p.fecha,
        u.nombre AS usuario,
        CASE WHEN p.respuesta IS NULL OR p.respuesta = '' THEN false ELSE true END AS respondida
        FROM preguntas_respuestas p
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.curso_id = ?
        ORDER BY p.fecha DESC`,
        [cursoId]
    );

    return rows;
};

export const responderPregunta = async (id, respuesta) => {
  await db.promise().query(
    `UPDATE preguntas_respuestas SET respuesta = ? WHERE id = ?`,
    [respuesta, id]
  );
};