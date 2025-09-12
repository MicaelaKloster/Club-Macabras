import db from '../config/db.js';

export const subirTrabajo = async (usuarioId, cursoId, imagen_url, descripcion) => {
  await db.query(
    `INSERT INTO trabajos_usuarios (usuario_id, curso_id, imagen_url, descripcion) VALUES ($1, $2, $3, $4)`,
    [usuarioId, cursoId, imagen_url, descripcion]
  );
};

export const obtenerTrabajosDeCurso = async (cursoId, usuarioLogueadoId) => {
  const result = await db.query(
    `
    SELECT 
      t.id,
      t.imagen_url,
      t.descripcion,
      t.fecha,
      u.nombre AS autor,
      (
        SELECT COUNT(*) 
        FROM likes_trabajos l 
        WHERE l.trabajo_id = t.id
      ) AS cantidad_likes,
      (
        SELECT COUNT(*) 
        FROM likes_trabajos l 
        WHERE l.trabajo_id = t.id AND l.usuario_id = $1
      ) AS dado_like
    FROM trabajos_usuarios t
    JOIN usuarios u ON t.usuario_id = u.id
    WHERE t.curso_id = $2
    ORDER BY t.fecha DESC
    `,
    [usuarioLogueadoId, cursoId]
  );

  // Convertimos el campo `dado_like` en booleano
  return result.rows.map(trabajo => ({
    ...trabajo,
    dado_like: !!trabajo.dado_like
  }));
};