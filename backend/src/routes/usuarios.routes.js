import { Router } from 'express';
import db from '../config/db.js';
import { registrarUsuario } from '../controllers/usuarios.controller.js';

const router = Router();

// GET /usuarios
router.get('/', (req, res) => {
  const sql = 'SELECT id, nombre, email, provincia, ciudad, rol, estado FROM usuarios';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('❌ Error al obtener usuarios:', err); // 🛑 visible en terminal
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }

    console.log('✅ Usuarios obtenidos correctamente'); // 👀 confirmación visual
    res.status(200).json(result);
  });
});

// POST /usuarios
router.post('/', registrarUsuario);

export default router;
