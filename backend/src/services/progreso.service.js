import db from "../config/db.js";

export const obtenerVideosVistosPorUsuario = async (usuarioId, cursoId) => {
  const result = await db.query(
    'SELECT video_id FROM progreso_usuarios WHERE usuario_id = $1 AND curso_id = $2',
    [usuarioId, cursoId]
  );
  return result.rows;
};

export const registrarVideoVisto = async (usuario_id, curso_id, video_id) => {
  const existeResult = await db.query(
    "SELECT id FROM progreso_usuarios WHERE usuario_id = $1 AND video_id = $2",
    [usuario_id, video_id]
  );

  if (existeResult.rows.length > 0) {
    // Ya está registrado, actualizamos por si acaso
    await db.query(
      "UPDATE progreso_usuarios SET visto = 1, fecha_visto = CURRENT_TIMESTAMP WHERE usuario_id = $1 AND video_id = $2",
      [usuario_id, video_id]
    );
  } else {
    // No existe, insertamos nuevo registro
    await db.query(
      "INSERT INTO progreso_usuarios (usuario_id, curso_id, video_id, visto) VALUES ($1, $2, $3, 1)",
      [usuario_id, curso_id, video_id]
    );
  }
};