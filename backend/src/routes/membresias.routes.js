import { Router } from "express";
import { 
    registrarMembresia, 
    obtenerMembresiaDeUsuario,
    obtenerMembresiaUsuarioAdmin,
    crearMembresiaManual,
    cambiarEstadoMembresiaAdmin
} from "../controllers/membresias.controller.js";
import { validarCreacionMembresia } from "../validations/membresias.validation.js";
import { validarCampos } from "../middlewares/validarCampos.middleware.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { permitirSoloRol } from "../middlewares/rol.middleware.js";

const router = Router();

// Registrar membresía
/**
 * @swagger
 * tags:
 *   name: Membresías
 *   description: Gestión de membresías de usuarios
 */

/**
 * @swagger
 * /membresias:
 *   post:
 *     summary: Registrar una nueva membresía (solo admin)
 *     tags: [Membresías]
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
 *               - fecha_inicio
 *               - fecha_fin
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Membresía registrada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

router.post(
    '/',
    verificarToken,
    permitirSoloRol('admin'),
    validarCreacionMembresia,
    validarCampos,
    registrarMembresia
);

/**
 * @swagger
 * /membresias/{usuarioId}:
 *   get:
 *     summary: Consultar la membresía activa de un usuario
 *     tags: [Membresías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Datos de la membresía (si existe)
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error del servidor
 */

router.get(
  '/:usuarioId',
  verificarToken,
  obtenerMembresiaDeUsuario
);

// Nuevas rutas para administración
router.get(
    '/usuarios/:id/membresias',
    verificarToken,
    permitirSoloRol('admin'),
    obtenerMembresiaUsuarioAdmin
);

router.post(
    '/usuarios/:id/membresias',
    verificarToken,
    permitirSoloRol('admin'),
    crearMembresiaManual
);

router.put(
    '/membresias/:id/estado',
    verificarToken,
    permitirSoloRol('admin'),
    cambiarEstadoMembresiaAdmin
);

export default router;