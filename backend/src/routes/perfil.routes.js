import { Router } from 'express';
import { verificarToken } from '../middlewares/auth.middleware.js';
import db from '../config/db.js';

const router = Router();

// GET /api/v1/perfil
router.get('/', verificarToken, async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query('SELECT id, nombre, email, provincia, ciudad, rol FROM usuarios WHERE id = ?', [req.usuario.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('❌ Error al obtener perfil:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
