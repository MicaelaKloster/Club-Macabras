import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const verificarToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verifica que el usuario siga activo
    const [rows] = await db.promise().query(
      'SELECT id, nombre, email, rol, estado FROM usuarios WHERE id = ?',
      [decoded.id]
    );

    const usuario = rows[0];

    if (!usuario || usuario.estado !== 1) {
      return res.status(403).json({ error: 'Usuario inactivo o no encontrado' });
    }

    // Se guarda el usuario completo en la request
    req.usuario = usuario;
    next();

  } catch (error) {
    console.error('❌ Token inválido:', error);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};