import db from '../config/db.js';

// Función para buscar un usuario por email y traer toda su información, incluyendo provincia y ciudad
export const buscarUsuarioPorEmailConTodo = async (email) => {
    // Realiza una consulta SQL para obtener los datos del usuario y su provincia/ciudad
    const [rows] = await db.promise().query(
        `SELECT u.*, p.provincia, p.ciudad
         FROM usuarios u
         LEFT JOIN provincias p ON u.provincia = p.id
         WHERE u.email = ?`,
        [email]
    );
    // Retorna el primer usuario encontrado (o undefined si no hay resultados)
    return rows[0];
};