import db from '../config/db.js';

export const agregarVideoCurso = async (cursoId, titulo, url, esGratuito) => {
    await db.promise().query(
        'INSERT INTO videos (curso_id, titulo, url, es_gratuito) VALUES (?, ?, ?, ?)',
        [cursoId, titulo, url, esGratuito]
    );
};