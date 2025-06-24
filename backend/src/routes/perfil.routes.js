import { Router } from 'express';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { editarPerfil, obtenerPerfil } from '../controllers/perfil.controller.js';
import { validarEdicionPerfil } from '../validations/perfil.validation.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Perfil
 *   description: Información del usuario autenticado
 */


// GET /api/v1/perfil
/**
 * @swagger
 * /perfil:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil
 *       401:
 *         description: Token no enviado
 *       403:
 *         description: Token inválido o expirado
 */
router.get('/', verificarToken, obtenerPerfil);

// PUT /api/v1/perfil
/**
 * @swagger
 * /perfil:
 *   put:
 *     summary: Edita el perfil del usuario autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - provincia
 *               - ciudad
 *             properties:
 *               nombre:
 *                 type: string
 *               provincia:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               contraseña_actual:
 *                 type: string
 *               contraseña_nueva:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Contraseña incorrecta
 */
router.put('/', verificarToken, validarEdicionPerfil, validarCampos, editarPerfil);

export default router;
