import db from '../config/db.js';

export const agregarDocumentoACurso = async (curso_id, titulo, url, tipo) => {
    await db.promise().query(
        'INSERT INTO documentos (curso_id, titulo, url, tipo) VALUES (?, ?, ?, ?)',
        [curso_id, titulo, url, tipo]
    );
};