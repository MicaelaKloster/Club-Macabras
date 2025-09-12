import db from '../config/db.js';

export const crearRespuestaEnTema = async (temaId, usuarioId, contenido) => {
    await db.query(
        'INSERT INTO respuestas (tema_id, usuario_id, contenido) VALUES ($1, $2, $3)',
        [temaId, usuarioId, contenido]
    );
};