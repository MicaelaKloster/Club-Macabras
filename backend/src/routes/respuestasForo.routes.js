import { Router } from 'express';
import { responderATema } from '../controllers/respuestasForo.controller.js';
import { validarNuevaRespuesta } from '../validations/respuestasForo.validation.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';

const router = Router();

/**
 * @swagger
 * /temas-foro/{id}/respuestas:
 *   post:
 *     summary: Agregar una respuesta a un tema del foro
 *     tags: [Foro]
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

export default router;