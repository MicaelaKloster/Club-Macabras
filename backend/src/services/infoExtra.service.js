import db from '../config/db.js';

export const crearInfoExtra = async (titulo, descripcion, url) => {
    const result = await db.query(
        'INSERT INTO info_extra (titulo, descripcion, url) VALUES ($1, $2, $3) RETURNING id',
        [titulo, descripcion, url]
    );
    return result.rows[0].id;
};

export const obtenerInfoExtra = async () => {
    const result = await db.query(
        'SELECT * FROM info_extra ORDER BY actualizado_en DESC LIMIT 1'
    );
    return result.rows[0];
};

export const actualizarInfoExtra = async (id, titulo, descripcion, url) => {
    const result = await db.query(
        'UPDATE info_extra SET titulo = $1, descripcion = $2, url = $3 WHERE id = $4',
        [titulo, descripcion, url, id]
    );
    return result.rowCount > 0;
};

export const eliminarInfoExtra = async (id) => {
    const result = await db.query(
        'DELETE FROM info_extra WHERE id = $1',
        [id]
    );
    return result.rowCount > 0;
};

// Servicios para configuraciones
export const obtenerPrecioMembresia = async () => {
    const result = await db.query(
        'SELECT valor FROM configuraciones WHERE clave = $1',
        ['precio_membresia']
    );
    return result.rows[0] ? parseInt(result.rows[0].valor) : 2000; // valor por defecto
};

export const actualizarPrecioMembresia = async (nuevoPrecio) => {
    const result = await db.query(
        'UPDATE configuraciones SET valor = $1 WHERE clave = $2',
        [nuevoPrecio.toString(), 'precio_membresia']
    );
    return result.rowCount > 0;
};