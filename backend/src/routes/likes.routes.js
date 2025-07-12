import { Router } from 'express';
import { likeATrabajo, dislikeATrabajo } from '../controllers/likes.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /trabajos/{id}/like:
 *   post:
 *     summary: Dar like a un trabajo
 *     tags: [Trabajos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo
 *     responses:
 *       201:
 *         description: Like registrado correctamente
 *       500:
 *         description: Error del servidor
 */

router.post('/trabajos/:id/like', verificarToken, likeATrabajo);

/**
 * @swagger
 * /trabajos/{id}/like:
 *   delete:
 *     summary: Quitar like de un trabajo
 *     tags: [Trabajos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo
 *     responses:
 *       200:
 *         description: Like quitado correctamente
 *       500:
 *         description: Error del servidor
 */
router.delete('/trabajos/:id/like', verificarToken, dislikeATrabajo);

export default router;