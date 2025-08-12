import { Router } from "express";
import { crearPreferencia, recibirWebhook } from "../controllers/mercadoPago.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: MercadoPago
 *   description: Endpoints para pagos con Mercado Pago
 */

/**
 * @swagger
 * /mercadopago/preferencia:
 *   post:
 *     summary: Crear una preferencia de pago en Mercado Pago
 *     tags: [MercadoPago]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - precio
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               precio:
 *                 type: number
 *     responses:
 *       200:
 *         description: Devuelve el ID de la preferencia
 */
router.post("/preferencia", verificarToken, crearPreferencia);

/**
 * @swagger
 * /mercadopago/webhook:
 *   post:
 *     summary: Recibe notificaciones de pagos aprobados y registra membresías
 *     tags: [MercadoPago]
 *     responses:
 *       200:
 *         description: Notificación procesada
 */
router.post("/webhook", recibirWebhook);

export default router;