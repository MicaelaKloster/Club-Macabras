import db from '../config/db.js';

// Obtiene todos los usuarios de la base de datos
export const obtenerTodosLosUsuarios = async () => {
  const [rows] = await db.promise().query(
    'SELECT id, nombre, email, provincia, ciudad, rol, estado FROM usuarios'
  );
  return rows;
};

// Busca usuarios en la base de datos por email
export const buscarUsuariosPorEmail = async (email) => {
    // Realiza una consulta SQL para buscar usuarios con el email proporcionado
    const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
    // Retorna los usuarios encontrados (puede ser un array vacío si no hay coincidencias)
    return rows;
};

// Busca un usuario específico por ID
export const buscarUsuarioPorId = async (id) => {
    const [rows] = await db.promise().query(
        'SELECT id, nombre, email, provincia, ciudad, rol, estado FROM usuarios WHERE id = ?', 
        [id]
    );
    // Retorna el primer usuario encontrado o null si no existe
    return rows.length > 0 ? rows[0] : null;
};

// Inserta un nuevo usuario en la base de datos
export const insertarUsuario = async ({nombre, email, contraseña, provincia, ciudad, rol}) => {
    // Ejecuta una consulta SQL para insertar un nuevo usuario con los datos proporcionados
    await db.promise().query(
        'INSERT INTO usuarios (nombre, email, contraseña, provincia, ciudad, rol, estado) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [nombre, email, contraseña, provincia, ciudad, rol || 'usuario']
    );
};

// Actualiza el rol de un usuario específico
export const actualizarRolUsuario = async (id, nuevoRol) => {
    const [result] = await db.promise().query(
        'UPDATE usuarios SET rol = ? WHERE id = ?',
        [nuevoRol, id]
    );
    
    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
        throw new Error('Usuario no encontrado o no se pudo actualizar');
    }
    
    return result;
};