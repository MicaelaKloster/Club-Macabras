import { Router } from 'express';
import { crearNuevoCurso, listarCursos } from '../controllers/cursos.controller.js';
import { validarCreacionCurso } from '../validations/cursos.validation.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { permitirSoloRol } from '../middlewares/rol.middleware.js';

const router = Router();

// * Ruta para crear un nuevo curso
/**
 * @swagger
 * tags:
 *   name: Cursos
 *   description: Gestión de capacitaciones
 */

/**
 * @swagger
 * /cursos:
 *   post:
 *     summary: Crear un nuevo curso (solo admins)
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               categoria:
 *                 type: string
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no enviado o inválido
 *       403:
 *         description: Acceso denegado - solo admin
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/',
  verificarToken,
  permitirSoloRol('admin'),
  validarCreacionCurso,
  validarCampos,
  crearNuevoCurso
);

// * Ruta para listar cursos con paginación
/**
 * @swagger
 * /cursos:
 *   get:
 *     summary: Listar cursos con paginación
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página (opcional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de cursos por página (opcional)
 *     responses:
 *       200:
 *         description: Lista de cursos
 *       401:
 *         description: Token no enviado o inválido
 *       500:
 *         description: Error interno del servidor
 */

router.get(
  '/',
  verificarToken,
  listarCursos
);

export default router;