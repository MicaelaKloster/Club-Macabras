import db from "../config/db.js";

export const obtenerVideosVistosPorUsuario = async (usuarioId, cursoId) => {
  const [rows] = await db.promise().query(
    'SELECT video_id FROM progreso_usuarios WHERE usuario_id = ? AND curso_id = ?',
    [usuarioId, cursoId]
  );
  return rows;
};

export const registrarVideoVisto = async (usuario_id, curso_id, video_id) => {
  const [existe] = await db.promise().query(
    "SELECT id FROM progreso_usuarios WHERE usuario_id = ? AND video_id = ?",
    [usuario_id, video_id]
  );

  if (existe.length > 0) {
    // Ya está registrado, actualizamos por si acaso
    await db.promise().query(
      "UPDATE progreso_usuarios SET visto = 1, fecha_visto = CURRENT_TIMESTAMP WHERE usuario_id = ? AND video_id = ?",
      [usuario_id, video_id]
    );
  } else {
    // No existe, insertamos nuevo registro
    await db.promise().query(
      "INSERT INTO progreso_usuarios (usuario_id, curso_id, video_id, visto) VALUES (?, ?, ?, 1)",
      [usuario_id, curso_id, video_id]
    );
  }
};