import db from '../config/db.js';

export const agregarDocumentoACurso = async (curso_id, titulo, url, tipo) => {
    await db.query(
        'INSERT INTO documentos (curso_id, titulo, url, tipo) VALUES ($1, $2, $3, $4)',
        [curso_id, titulo, url, tipo]
    );
};

export const obtenerDocumentosDeCurso = async (cursoId) => {
  const result = await db.query(
    `SELECT id, titulo, url, tipo FROM documentos WHERE curso_id = $1`,
    [cursoId]
  );
  return result.rows;
};