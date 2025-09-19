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
      t.usuario_id,
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

export const obtenerTrabajoPorId = async (trabajoId) => {
  const result = await db.query(
    'SELECT * FROM trabajos_usuarios WHERE id = $1',
    [trabajoId]
  );
  return result.rows[0];
};

export const actualizarTrabajo = async (trabajoId, descripcion) => {
  const result = await db.query(
    'UPDATE trabajos_usuarios SET descripcion = $1 WHERE id = $2',
    [descripcion, trabajoId]
  );
  return result.rowCount > 0;
};

export const eliminarTrabajo = async (trabajoId) => {
  // Primero eliminar likes relacionados
  await db.query('DELETE FROM likes_trabajos WHERE trabajo_id = $1', [trabajoId]);
  
  // Luego eliminar el trabajo
  const result = await db.query(
    'DELETE FROM trabajos_usuarios WHERE id = $1',
    [trabajoId]
  );
  return result.rowCount > 0;
};