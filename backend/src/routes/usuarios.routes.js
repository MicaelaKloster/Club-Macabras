// import db from '../config/db.js';
import { Router } from 'express';
import { registrarUsuario, listarUsuarios } from '../controllers/usuarios.controller.js';
import { validarRegistroUsuario } from '../validations/usuarios.validation.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';

const router = Router();
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
 *     summary: Obtener la lista de todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       500:
 *         description: Error del servidor
 */
router.get('/', listarUsuarios);

// POST /usuarios
/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Registra un nuevo usuario
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
  validarRegistroUsuario, // Validaciones con express-validator
  validarCampos,          // Middleware para devolver errores
  registrarUsuario        // Controlador final
);

export default router;
