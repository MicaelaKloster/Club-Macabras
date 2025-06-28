import db from '../config/db.js';

export const crearCurso = async (titulo, descripcion, categoria) => {
    await db.promise().query(
        'INSERT INTO cursos (titulo, descripcion, categoria) VALUES (?, ?, ?)',
        [titulo, descripcion, categoria]
    );
};

export const obtenerCursosPaginados = async (limite, offset) => {
    const [cursos] = await db.promise().query(
        'SELECT * FROM cursos ORDER BY creado_en DESC LIMIT ? OFFSET ?',
        [limite, offset]
    );
    
    const [totalRows] = await db.promise().query(
        'SELECT COUNT(*) as total FROM cursos'
    );

    return {
        cursos,
        total: totalRows[0].total
    };
};