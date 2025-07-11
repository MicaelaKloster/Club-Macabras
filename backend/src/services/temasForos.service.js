import db from '../config/db.js';

export const crearTemaForo = async (usuarioId, tema, contenido) => {
    await db.promise().query(
        'iNSERT INTO temas_foro (usuario_id, tema, contenido) VALUES (?, ?, ?)',
        [usuarioId, tema, contenido]
    );
};

export const obtenerTodosLosTemas = async () => {
    const [rows] = await db.promise().query(
        `SELECT t.id, t.tema, t.contenido, t.fecha, u.nombre
        FROM temas_foro t
        JOIN usuarios u ON t.usuario_id = u.id
        ORDER BY t.fecha DESC`
    );
    
    return rows;
};

export const obtenerTemasConRespuestas = async (temaId) => {
    // Obtener el tema
    const [temaRows] = await db.promise().query(
        `SELECT t.id, t.tema, t.contenido, t.fecha, u.nombre
        FROM temas_foro t
        JOIN usuarios u ON t.usuario_id = u.id
        WHERE t.id = ?`,
        [temaId]
    );

    // Si no existe el tema
    if (temaRows.length === 0) return null;

    // Obtener las respuestas
    const [respuestas] = await db.promise().query(
        `SELECT r.id, r.contenido, r.fecha, u.nombre
        FROM respuestas r
        JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.tema_id = ?
        ORDER BY r.fecha ASC`,
        [temaId]
    );

    return {
        ...temaRows[0],
        respuestas
    };
};