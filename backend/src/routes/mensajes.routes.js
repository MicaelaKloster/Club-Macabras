import { Router } from 'express';
import { enviarMensajePrivado, verConversacionConUsuario, verInbox } from '../controllers/mensajes.controller.js';
import { validarEnvioMensaje } from '../validations/mensajes.validation.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Mensajes
 *   description: Mensajes privados entre usuarios
 */

/**
 * @swagger
 * /mensajes:
 *   post:
 *     summary: Enviar mensaje privado a otro usuario
 *     tags: [Mensajes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_destino
 *               - contenido
 *             properties:
 *               usuario_destino:
 *                 type: integer
 *               contenido:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mensaje enviado correctamente
 *       400:
 *         description: Validación fallida
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error del servidor
 */
router.post(
    '/',
    verificarToken,
    validarEnvioMensaje,
    validarCampos,
    enviarMensajePrivado
);


/**
 * @swagger
 * /mensajes/{usuarioId}:
 *   get:
 *     summary: Ver conversación con otro usuario
 *     tags: [Mensajes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del otro usuario
 *     responses:
 *       200:
 *         description: Lista de mensajes
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/:usuarioId', verificarToken, verConversacionConUsuario);

/**
 * @swagger
 * /mensajes:
 *   get:
 *     summary: Ver inbox del usuario logueado
 *     tags: [Mensajes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de últimas conversaciones
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/', verificarToken, verInbox);

export default router;