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

// Inserta un nuevo usuario en la base de datos
export const insertarUsuario = async ({nombre, email, contrasenia, provincia, ciudad}) => {
    // Ejecuta una consulta SQL para insertar un nuevo usuario con los datos proporcionados
    await db.promise().query(
        'INSERT INTO usuarios (nombre, email, contrasenia, provincia, ciudad, rol, estado) VALUES (?, ?, ?, ?, ?, "usuario", 1)',
        [nombre, email, contrasenia, provincia, ciudad]
    );
};