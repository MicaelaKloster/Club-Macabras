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