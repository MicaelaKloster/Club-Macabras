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

export const obtenerMaterialesDelCurso = async (cursoId) => {
    const [videos] = await db.promise().query(
        'SELECT id, titulo, url, es_gratuito FROM videos WHERE curso_id = ?',
        [cursoId]
    );

    const [documentos] = await db.promise().query(
        'SELECT id, titulo, url, tipo FROM documentos WHERE curso_id = ?',
        [cursoId]
    );

    return {
        videos,
        documentos
    };
};

export const buscarCursoPorId = async (id) => {
  const [rows] = await db.promise().query(
    'SELECT id, titulo, descripcion, categoria FROM cursos WHERE id = ?',
    [id]
  );
  return rows[0];
};