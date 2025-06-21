import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // El token debe venir como: "Bearer eyJhbGci..."
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // ahora tenés acceso a req.usuario en controladores
    next();
  } catch (error) {
    console.error('❌ Token inválido:', error);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};
