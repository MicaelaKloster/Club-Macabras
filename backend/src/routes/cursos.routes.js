import { Router } from 'express';
import { crearNuevoCurso, listarCursos, listarMaterialesDelCurso, obtenerCursoPorId } from '../controllers/cursos.controller.js';
import { validarCreacionCurso } from '../validations/cursos.validation.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { permitirSoloRol } from '../middlewares/rol.middleware.js';
import { verificarMembresiaActiva } from '../middlewares/verificarMembresia.middleware.js';

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

/**
 * @swagger
 * /cursos/{id}/materiales:
 *   get:
 *     summary: Obtener todos los videos y documentos de un curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Lista de materiales del curso
 *       401:
 *         description: Token no enviado o inválido
 *       404:
 *         description: Curso no encontrado
 *       500:
 *         description: Error interno del servidor
 */

router.get(
  '/:id/materiales',
  verificarToken,
  verificarMembresiaActiva, // Sólo miembros activos ven los materiales
  listarMaterialesDelCurso
);

/**
 * @swagger
 * /cursos/{id}:
 *   get:
 *     summary: Obtener información de un curso por su ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Información del curso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 titulo:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *                 categoria:
 *                   type: string
 *                 materiales:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Curso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', verificarToken, obtenerCursoPorId);

export default router;