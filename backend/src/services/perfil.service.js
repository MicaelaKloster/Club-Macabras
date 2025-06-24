import db from '../config/db.js';

export const obtenerPerfilPorId = async (usuarioId) => {
  const [rows] = await db.promise().query(
    'SELECT id, nombre, email, provincia, ciudad, rol FROM usuarios WHERE id = ?',
    [usuarioId]
  );
  return rows;
};
