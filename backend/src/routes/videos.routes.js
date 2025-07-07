import { Router } from "express";
import { crearNuevoVideo } from "../controllers/videos.controller.js";
import { validarNuevoVideo } from "../validations/videos.validation.js";
import { validarCampos } from "../middlewares/validarCampos.middleware.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { permitirSoloRol } from "../middlewares/rol.middleware.js";

const router = Router();

// Rutas de videos
/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: Gestión de videos por curso
 */

/**
 * @swagger
 * /videos:
 *   post:
 *     summary: Agregar un nuevo video a un curso (solo admin)
 *     tags: [Videos]
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
 *               - titulo
 *               - url
 *             properties:
 *               curso_id:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               url:
 *                 type: string
 *               es_gratuito:
 *                 type: integer
 *                 enum: [0, 1]
 *     responses:
 *       201:
 *         description: Video agregado correctamente
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
  validarNuevoVideo,
  validarCampos,
  crearNuevoVideo
);

export default router;