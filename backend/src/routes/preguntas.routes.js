import { Router } from 'express';
import { 
    hacerPregunta, 
    listarPreguntasPorCurso, 
    responderPreguntaPorId, 
    listarTodasLasPreguntas,
    obtenerPregunta,
    editarPreguntaControlador,
    editarRespuestaControlador,
    eliminarPreguntaControlador
} from '../controllers/preguntas.controller.js';
import { validarPregunta, validarEdicionPregunta, validarRespuesta } from '../validations/preguntas.validation.js';
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

// ⚠️ IMPORTANTE: Las rutas específicas van ANTES que las rutas con parámetros

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

// ✅ NUEVAS RUTAS AGREGADAS

/**
 * @swagger
 * /preguntas/curso/{cursoId}:
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
router.get('/curso/:cursoId', listarPreguntasPorCurso);

/**
 * @swagger
 * /preguntas/{id}:
 *   get:
 *     summary: Obtener una pregunta específica
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
 *     responses:
 *       200:
 *         description: Pregunta obtenida
 *       404:
 *         description: Pregunta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/:id',
  verificarToken,
  obtenerPregunta
);

/**
 * @swagger
 * /preguntas/{id}/editar:
 *   put:
 *     summary: Editar una pregunta (solo el autor)
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
 *               - pregunta
 *             properties:
 *               pregunta:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pregunta actualizada correctamente
 *       403:
 *         description: No tienes permisos para editar esta pregunta
 *       404:
 *         description: Pregunta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put(
  '/:id/editar',
  verificarToken,
  validarEdicionPregunta,
  validarCampos,
  editarPreguntaControlador
);

/**
 * @swagger
 * /preguntas/{id}/responder:
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
  '/:id/responder',
  verificarToken,
  permitirSoloRol('admin'),
  validarRespuesta,
  validarCampos,
  responderPreguntaPorId
);

/**
 * @swagger
 * /preguntas/{id}/editar-respuesta:
 *   put:
 *     summary: Editar respuesta de una pregunta (solo admin)
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
 *         description: Respuesta actualizada correctamente
 *       404:
 *         description: Pregunta no encontrada
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error interno
 */
router.put(
  '/:id/editar-respuesta',
  verificarToken,
  permitirSoloRol('admin'),
  validarRespuesta,
  validarCampos,
  editarRespuestaControlador
);

/**
 * @swagger
 * /preguntas/{id}:
 *   delete:
 *     summary: Eliminar una pregunta (autor o admin)
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
 *     responses:
 *       200:
 *         description: Pregunta eliminada correctamente
 *       403:
 *         description: No tienes permisos para eliminar esta pregunta
 *       404:
 *         description: Pregunta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete(
  '/:id',
  verificarToken,
  eliminarPreguntaControlador
);

export default router;