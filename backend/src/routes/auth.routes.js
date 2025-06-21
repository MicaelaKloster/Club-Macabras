import { Router } from 'express';
import { loginUsuario } from '../controllers/auth.controller.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Limitar a 5 intentos por IP cada 10 minutos
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos de login. Intentalo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Ruta: POST /auth/login
router.post('/login', loginLimiter, loginUsuario);

export default router;
