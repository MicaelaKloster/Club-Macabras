import { Router } from 'express';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { obtenerPerfil } from '../controllers/perfil.controller.js';

const router = Router();

// GET /api/v1/perfil
router.get('/', verificarToken, obtenerPerfil);

export default router;
