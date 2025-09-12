import db from '../config/db.js';

export const agregarVideoCurso = async (cursoId, titulo, url, esGratuito) => {
    await db.query(
        'INSERT INTO videos (curso_id, titulo, url, es_gratuito) VALUES ($1, $2, $3, $4)',
        [cursoId, titulo, url, esGratuito]
    );
};

export const obtenerVideosPorCurso = async (cursoId) => {
  const result = await db.query(
    "SELECT id, titulo, url, es_gratuito FROM videos WHERE curso_id = $1",
    [cursoId]
  );
  return result.rows;
};