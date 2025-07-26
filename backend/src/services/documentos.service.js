import db from '../config/db.js';

export const agregarDocumentoACurso = async (curso_id, titulo, url, tipo) => {
    await db.promise().query(
        'INSERT INTO documentos (curso_id, titulo, url, tipo) VALUES (?, ?, ?, ?)',
        [curso_id, titulo, url, tipo]
    );
};

export const obtenerDocumentosDeCurso = async (cursoId) => {
  const [rows] = await db.promise().query(
    `SELECT id, titulo, url, tipo FROM documentos WHERE curso_id = ?`,
    [cursoId]
  );
  return rows;
};