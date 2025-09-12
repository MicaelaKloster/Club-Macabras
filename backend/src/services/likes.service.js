import db from '../config/db.js';

export const darLikeATrabajo = async (usuarioId, trabajoId) => {
  await db.query(
    `INSERT INTO likes_trabajos (usuario_id, trabajo_id) VALUES ($1, $2) 
     ON CONFLICT (usuario_id, trabajo_id) DO NOTHING`,
    [usuarioId, trabajoId]
  );
};

export const quitarLikeATrabajo = async (usuarioId, trabajoId) => {
  await db.query(
    `DELETE FROM likes_trabajos WHERE usuario_id = $1 AND trabajo_id = $2`,
    [usuarioId, trabajoId]
  );
};