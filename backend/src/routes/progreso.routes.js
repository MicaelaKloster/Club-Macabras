import { Router } from "express";
import { listarVideosVistos, marcarVideoComoVisto } from "../controllers/progreso.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /usuarios/{usuarioId}/progreso/{cursoId}:
 *   get:
 *     summary: Obtener los videos vistos por un usuario en un curso
 *     tags: [Progreso]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *       - in: path
 *         name: cursoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Lista de videos vistos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/usuarios/:usuarioId/progreso/:cursoId', verificarToken, listarVideosVistos);


/**
 * @swagger
 * /api/v1/progreso:
 *   post:
 *     summary: Marcar un video como visto por el usuario
 *     tags: [Progreso]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - video_id
 *               - curso_id
 *             properties:
 *               video_id:
 *                 type: integer
 *               curso_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Progreso actualizado correctamente
 *       401:
 *         description: Token no enviado o inválido
 *       500:
 *         description: Error interno del servidor
 */
router.post("/progreso", verificarToken, marcarVideoComoVisto);

export default router;