import { Router } from 'express';
import { loginUsuario } from '../controllers/auth.controller.js';
import rateLimit from 'express-rate-limit';
import { validarLogin } from '../validations/auth.validation.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Login y gestión de tokens
 */


const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos de login. Intentalo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión en el sistema
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - contraseña
 *             properties:
 *               email:
 *                 type: string
 *               contraseña:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso con token JWT
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Credenciales inválidas
 *       429:
 *         description: Demasiados intentos, vuelve más tarde
 */
router.post('/login',
  loginLimiter,
  validarLogin,       // Validación de datos
  validarCampos,      // Captura de errores
  loginUsuario        // Lógica de login
);

export default router;
