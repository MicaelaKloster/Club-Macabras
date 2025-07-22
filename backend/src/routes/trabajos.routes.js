import { Router } from 'express';
import { crearTrabajo, listarTrabajosPorCurso } from '../controllers/trabajos.controller.js';
import { validarTrabajo } from '../validations/trabajos.validation.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Trabajos
 *   description: Publicaciones de trabajos realizados por usuarios
 */

/**
 * @swagger
 * /trabajos:
 *   post:
 *     summary: Publicar un trabajo vinculado a un curso
 *     tags: [Trabajos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - curso_id
 *               - imagen_url
 *             properties:
 *               curso_id:
 *                 type: integer
 *               imagen_url:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Trabajo publicado correctamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post(
    '/',
    verificarToken,
    upload.single('imagen'),
    validarTrabajo,
    validarCampos,
    crearTrabajo
);

/**
 * @swagger
 * /trabajos/{cursoId}:
 *   get:
 *     summary: Obtener trabajos subidos por curso
 *     tags: [Trabajos]
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Lista de trabajos
 *       500:
 *         description: Error del servidor
 */
router.get('/:cursoId', listarTrabajosPorCurso);

export default router;