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