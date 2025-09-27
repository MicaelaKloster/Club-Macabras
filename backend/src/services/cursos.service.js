import db from '../config/db.js';

export const crearCurso = async (titulo, descripcion, categoria, imagen_portada) => {
    await db.query(
        'INSERT INTO cursos (titulo, descripcion, categoria, imagen_portada) VALUES ($1, $2, $3, $4)',
        [titulo, descripcion, categoria, imagen_portada]
    );
};

export const obtenerCursosPaginados = async (limite, offset) => {
    const cursosResult = await db.query(
        'SELECT id, titulo, descripcion, categoria, imagen_portada, creado_en FROM cursos WHERE estado = 1 ORDER BY creado_en DESC LIMIT $1 OFFSET $2',
        [limite, offset]
    );
    
    // Debug: verifica qué está devolviendo la base de datos
    console.log('Datos de cursos desde DB:', cursosResult.rows);
    
    const totalResult = await db.query(
        'SELECT COUNT(*) as total FROM cursos WHERE estado = 1'
    );

    return {
        cursos: cursosResult.rows,
        total: totalResult.rows[0].total
    };
};

export const obtenerMaterialesDelCurso = async (cursoId) => {
    const videosResult = await db.query(
        'SELECT id, titulo, url, es_gratuito FROM videos WHERE curso_id = $1',
        [cursoId]
    );

    const documentosResult = await db.query(
        'SELECT id, titulo, url, tipo FROM documentos WHERE curso_id = $1',
        [cursoId]
    );

    return {
        videos: videosResult.rows,
        documentos: documentosResult.rows
    };
};

export const buscarCursoPorId = async (id) => {
  const result = await db.query(
    'SELECT id, titulo, descripcion, categoria, imagen_portada FROM cursos WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const actualizarCurso = async (id, titulo, descripcion, categoria, imagen_portada = null) => {
    // Debug: verifica qué valor llega
    console.log('Actualizando curso con imagen_portada:', imagen_portada);
    
    const result = await db.query(
        'UPDATE cursos SET titulo = $1, descripcion = $2, categoria = $3, imagen_portada = $4 WHERE id = $5',
        [titulo, descripcion, categoria, imagen_portada, id]
    );
    return result.rowCount > 0;
};

export const eliminarCursoLogico = async (id) => {
    const result = await db.query(
        'UPDATE cursos SET estado = 0 WHERE id = $1',
        [id]
    );
    return result.rowCount > 0;
};