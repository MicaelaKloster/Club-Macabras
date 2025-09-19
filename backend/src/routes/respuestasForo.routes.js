import { Router } from 'express';
import { 
    responderATema,
    obtenerRespuesta,
    editarRespuestaControlador,
    eliminarRespuestaControlador
} from '../controllers/respuestasForo.controller.js';
import { validarNuevaRespuesta } from '../validations/respuestasForo.validation.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';
import { body } from 'express-validator';

const router = Router();

// Validación para editar respuesta
const validarEdicionRespuesta = [
    body('contenido')
        .notEmpty()
        .withMessage('El contenido es obligatorio')
        .isLength({ min: 5, max: 2000 })
        .withMessage('El contenido debe tener entre 5 y 2000 caracteres')
];

/**
 * @swagger
 * tags:
 *   name: RespuestasForo
 *   description: Gestión de respuestas del foro
 */

/**
 * @swagger
 * /temas-foro/{id}/respuestas:
 *   post:
 *     summary: Agregar una respuesta a un tema del foro
 *     tags: [RespuestasForo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contenido
 *             properties:
 *               contenido:
 *                 type: string
 *     responses:
 *       201:
 *         description: Respuesta publicada correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error interno
 */
router.post(
  '/:id/respuestas',
  verificarToken,
  validarNuevaRespuesta,
  validarCampos,
  responderATema
);

// ✅ NUEVAS RUTAS AGREGADAS

/**
 * @swagger
 * /respuestas/{id}:
 *   get:
 *     summary: Obtener una respuesta específica
 *     tags: [RespuestasForo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la respuesta
 *     responses:
 *       200:
 *         description: Respuesta obtenida
 *       404:
 *         description: Respuesta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/:id',
  verificarToken,
  obtenerRespuesta
);

/**
 * @swagger
 * /respuestas/{id}:
 *   put:
 *     summary: Editar una respuesta (solo el autor)
 *     tags: [RespuestasForo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la respuesta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contenido
 *             properties:
 *               contenido:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta actualizada correctamente
 *       403:
 *         description: No tienes permisos para editar esta respuesta
 *       404:
 *         description: Respuesta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put(
  '/:id',
  verificarToken,
  validarEdicionRespuesta,
  validarCampos,
  editarRespuestaControlador
);

/**
 * @swagger
 * /respuestas/{id}:
 *   delete:
 *     summary: Eliminar una respuesta (autor o admin)
 *     tags: [RespuestasForo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la respuesta
 *     responses:
 *       200:
 *         description: Respuesta eliminada correctamente
 *       403:
 *         description: No tienes permisos para eliminar esta respuesta
 *       404:
 *         description: Respuesta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete(
  '/:id',
  verificarToken,
  eliminarRespuestaControlador
);

export default router;