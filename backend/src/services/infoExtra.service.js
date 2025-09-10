import db from '../config/db.js';

export const crearInfoExtra = async (titulo, descripcion, url) => {
    const [result] = await db.promise().query(
        'INSERT INTO info_extra (titulo, descripcion, url) VALUES (?, ?, ?)',
        [titulo, descripcion, url]
    );
    return result.insertId;
};

export const obtenerInfoExtra = async () => {
    const [rows] = await db.promise().query(
        'SELECT * FROM info_extra ORDER BY actualizado_en DESC LIMIT 1'
    );
    return rows[0];
};

export const actualizarInfoExtra = async (id, titulo, descripcion, url) => {
    const [result] = await db.promise().query(
        'UPDATE info_extra SET titulo = ?, descripcion = ?, url = ? WHERE id = ?',
        [titulo, descripcion, url, id]
    );
    return result.affectedRows > 0;
};

export const eliminarInfoExtra = async (id) => {
    const [result] = await db.promise().query(
        'DELETE FROM info_extra WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
};

// Servicios para configuraciones
export const obtenerPrecioMembresia = async () => {
    const [rows] = await db.promise().query(
        'SELECT valor FROM configuraciones WHERE clave = "precio_membresia"'
    );
    return rows[0] ? parseInt(rows[0].valor) : 2000; // valor por defecto
};

export const actualizarPrecioMembresia = async (nuevoPrecio) => {
    const [result] = await db.promise().query(
        'UPDATE configuraciones SET valor = ? WHERE clave = "precio_membresia"',
        [nuevoPrecio.toString()]
    );
    return result.affectedRows > 0;
};