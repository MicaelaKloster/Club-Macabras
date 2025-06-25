import db from '../config/db.js';

export const obtenerPerfilPorId = async (usuarioId) => {
  const [rows] = await db.promise().query(
    'SELECT id, nombre, email, provincia, ciudad, rol FROM usuarios WHERE id = ?',
    [usuarioId]
  );
  return rows;
};

export const actualizarPerfil = async (usuarioId, nombre, provincia, ciudad) => {
  await db.promise().query(
    'UPDATE usuarios SET nombre = ?, provincia = ?, ciudad = ? WHERE id = ?',
    [nombre, provincia, ciudad, usuarioId]
  );
};

export const actualizarContraseña = async (usuarioId, nuevaContraseñaHasheada) => {
  await db.promise().query(
    'UPDATE usuarios SET contraseña = ? WHERE id = ?',
    [nuevaContraseñaHasheada, usuarioId]
  );
};

export const obtenerContraseñaActual = async (usuarioId) => {
  const [rows] = await db.promise().query(
    'SELECT contraseña FROM usuarios WHERE id = ?',
    [usuarioId]
  );
  return rows[0]?.contraseña;
};

export const desactivarUsuario = async (usuarioId) => {
  await db.promise().query(
    'UPDATE usuarios SET estado = 0 WHERE id = ?',
    [usuarioId]
  );
};