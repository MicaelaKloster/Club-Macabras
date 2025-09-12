import db from '../config/db.js';

export const obtenerPerfilPorId = async (usuarioId) => {
  const result = await db.query(
    'SELECT id, nombre, email, provincia, ciudad, rol FROM usuarios WHERE id = $1',
    [usuarioId]
  );
  return result.rows;
};

export const actualizarPerfil = async (usuarioId, nombre, provincia, ciudad) => {
  await db.query(
    'UPDATE usuarios SET nombre = $1, provincia = $2, ciudad = $3 WHERE id = $4',
    [nombre, provincia, ciudad, usuarioId]
  );
};

export const actualizarContraseña = async (usuarioId, nuevaContraseñaHasheada) => {
  await db.query(
    'UPDATE usuarios SET contraseña = $1 WHERE id = $2',
    [nuevaContraseñaHasheada, usuarioId]
  );
};

export const obtenerContraseñaActual = async (usuarioId) => {
  const result = await db.query(
    'SELECT contraseña FROM usuarios WHERE id = $1',
    [usuarioId]
  );
  return result.rows[0]?.contraseña;
};

export const desactivarUsuario = async (usuarioId) => {
  await db.query(
    'UPDATE usuarios SET estado = 0 WHERE id = $1',
    [usuarioId]
  );
};