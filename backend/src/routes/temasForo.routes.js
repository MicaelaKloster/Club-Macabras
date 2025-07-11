import { Router } from 'express';
import { crearNuevoTema, listarTemas, verTemaConRespuestas } from '../controllers/temasForo.controller.js';
import { validarNuevoTema } from '../validations/temasForo.validation.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Foro
 *   description: Gestión de temas del foro
 */

/**
 * @swagger
 * /temas-foro:
 *   post:
 *     summary: Crear un nuevo tema en el foro
 *     tags: [Foro]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tema
 *               - contenido
 *             properties:
 *               tema:
 *                 type: string
 *               contenido:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tema creado correctamente
 *       400:
 *         description: Validación fallida
 *       401:
 *         description: Token no enviado o inválido
 *       500:
 *         description: Error del servidor
 */

router.post(
  '/',
  verificarToken,
  validarNuevoTema,
  validarCampos,
  crearNuevoTema
);

/**
 * @swagger
 * /temas-foro:
 *   get:
 *     summary: Listar todos los temas del foro
 *     tags: [Foro]
 *     responses:
 *       200:
 *         description: Lista de temas
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/',
  listarTemas
);

/**
 * @swagger
 * /temas-foro/{id}:
 *   get:
 *     summary: Obtener un tema del foro con sus respuestas
 *     tags: [Foro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tema
 *     responses:
 *       200:
 *         description: Tema con sus respuestas
 *       404:
 *         description: Tema no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', verTemaConRespuestas);

export default router;