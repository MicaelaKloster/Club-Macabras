import db from '../config/db.js';

export const darLikeATrabajo = async (usuarioId, trabajoId) => {
  await db.promise().query(
    `INSERT IGNORE INTO likes_trabajos (usuario_id, trabajo_id) VALUES (?, ?)`,
    [usuarioId, trabajoId]
  );
};

export const quitarLikeATrabajo = async (usuarioId, trabajoId) => {
  await db.promise().query(
    `DELETE FROM likes_trabajos WHERE usuario_id = ? AND trabajo_id = ?`,
    [usuarioId, trabajoId]
  );
};