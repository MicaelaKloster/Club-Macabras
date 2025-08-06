import { Router } from 'express';
import { hacerPregunta, listarPreguntasPorCurso, responderPreguntaPorId } from '../controllers/preguntas.controller.js';
import { validarPregunta, validarRespuesta } from '../validations/preguntas.validation.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';
import { permitirSoloRol } from '../middlewares/rol.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Preguntas
 *   description: Preguntas relacionadas a cursos
 */

/**
 * @swagger
 * /preguntas:
 *   post:
 *     summary: Realizar una pregunta sobre un curso
 *     tags: [Preguntas]
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
 *               - pregunta
 *             properties:
 *               curso_id:
 *                 type: integer
 *               pregunta:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pregunta enviada correctamente
 *       400:
 *         description: Validación fallida
 *       401:
 *         description: Token requerido
 *       500:
 *         description: Error del servidor
 */

router.post(
  '/',
  verificarToken,
  validarPregunta,
  validarCampos,
  hacerPregunta
);

/**
 * @swagger
 * /preguntas/{cursoId}:
 *   get:
 *     summary: Obtener preguntas y respuestas de un curso
 *     tags: [Preguntas]
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Lista de preguntas
 *       500:
 *         description: Error del servidor
 */
router.get('/:cursoId', listarPreguntasPorCurso);

/**
 * @swagger
 * /preguntas/{id}:
 *   put:
 *     summary: Responder una pregunta (solo admin)
 *     tags: [Preguntas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pregunta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - respuesta
 *             properties:
 *               respuesta:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta registrada correctamente
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error interno
 */
router.put(
    '/:id',
    verificarToken,
    permitirSoloRol('admin'),
    validarRespuesta,
    validarCampos,
    responderPreguntaPorId
);

/**
 * @swagger
 * /preguntas:
 *   get:
 *     summary: Listar todas las preguntas agrupadas por curso (solo admin)
 *     tags: [Preguntas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista agrupada de preguntas
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/',
  verificarToken,
  permitirSoloRol('admin'),
  listarTodasLasPreguntas
);


export default router;