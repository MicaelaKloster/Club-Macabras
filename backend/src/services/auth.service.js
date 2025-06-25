import db from '../config/db.js';

// Función para buscar un usuario por email y traer toda su información, incluyendo provincia y ciudad
export const buscarUsuarioPorEmailConTodo = async (email) => {
    // Realiza una consulta SQL para obtener los datos del usuario y su provincia/ciudad
    const [rows] = await db.promise().query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
    );
    // Retorna el primer usuario encontrado (o undefined si no hay resultados)
    return rows[0];
};

// Función para actualizar la contraseña de un usuario por su ID
// Esta función recibe el ID del usuario y la nueva contraseña hasheada
export const actualizarContraseñaPorId = async (usuarioId, nuevaContraseñaHasheada) => {
  await db.promise().query(
    'UPDATE usuarios SET contraseña = ? WHERE id = ?',
    [nuevaContraseñaHasheada, usuarioId]
  );
};