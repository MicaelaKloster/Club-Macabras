import { Router } from 'express';
import { crearPreferenciaPago } from '../controllers/pago.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/crear', verificarToken, crearPreferenciaPago);

export default router;