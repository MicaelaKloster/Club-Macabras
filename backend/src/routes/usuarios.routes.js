// import db from '../config/db.js';
import { Router } from 'express';
import { registrarUsuario, listarUsuarios } from '../controllers/usuarios.controller.js';
import { validarRegistroUsuario } from '../validations/usuarios.validation.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { permitirSoloRol } from '../middlewares/rol.middleware.js';

const router = Router();

// Middleware condicional: solo exige token si alguien intenta crear un admin
const protegerSiEsAdmin = (req, res, next) => {
  if (req.body.rol === 'admin') {
    return verificarToken(req, res, next);
  }
  next();
};

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Operaciones relacionadas con usuarios
 */


// GET /usuarios
/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener la lista de todos los usuarios (solo admins)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado se requiere rol de administrador
 *       500:
 *         description: Error del servidor
 */
router.get('/', verificarToken, permitirSoloRol('admin'), listarUsuarios);

// POST /usuarios
/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Registra un nuevo usuario o un administrador (solo admins pueden crear admins)
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - contraseña
 *               - provincia
 *               - ciudad
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               contraseña:
 *                 type: string
 *               provincia:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [admin, usuario]
 *                 description: Solo los admins autenticados pueden crear otros admins
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito
 *       400:
 *         description: Error de validación
 *       409:
 *         description: El correo ya está registrado
 */
router.post(
  '/',
  protegerSiEsAdmin,     // Middleware condicional para verificar token solo si se crea un admin
  validarRegistroUsuario, // Validaciones con express-validator
  validarCampos,          // Middleware para devolver errores
  registrarUsuario        // Controlador final
);

export default router;
