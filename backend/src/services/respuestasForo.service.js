import db from '../config/db.js';

export const crearRespuestaEnTema = async (temaId, usuarioId, contenido) =>{
    await db.promise().query(
        'INSERT INTO respuestas (tema_id, usuario_id, contenido) VALUES (?, ?, ?)',
        [temaId, usuarioId, contenido]
    );
};