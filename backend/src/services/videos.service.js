import db from '../config/db.js';

export const agregarVideoCurso = async (cursoId, titulo, url, esGratuito) => {
    await db.promise().query(
        'INSERT INTO videos (curso_id, titulo, url, es_gratuito) VALUES (?, ?, ?, ?)',
        [cursoId, titulo, url, esGratuito]
    );
};

export const obtenerVideosPorCurso = async (cursoId) => {
  const [rows] = await db.promise().query(
    "SELECT id, titulo, url, es_gratuito FROM videos WHERE curso_id = ?",
    [cursoId]
  );
  return rows;
};