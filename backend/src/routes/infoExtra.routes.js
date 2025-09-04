import { Router } from 'express';
import { crearNuevaInfoExtra, obtenerInfoExtraActual, editarInfoExtra, obtenerConfiguraciones, actualizarConfiguraciones } from '../controllers/infoExtra.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { permitirSoloRol } from '../middlewares/rol.middleware.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';
import { body } from 'express-validator';

const router = Router();

// Validaciones
const validarInfoExtra = [
    body('titulo').notEmpty().withMessage('El título es obligatorio'),
    body('url').isURL().withMessage('Debe ser una URL válida')
];

const validarPrecio = [
    body('precio_membresia')
        .isNumeric()
        .withMessage('El precio debe ser numérico')
        .custom(value => {
            if (value <= 0) {
                throw new Error('El precio debe ser mayor a 0');
            }
            return true;
        })
];

/**
 * @swagger
 * tags:
 *   name: InfoExtra
 *   description: Gestión de información extra del sistema
 */

// GET /info-extra - Obtener información extra actual (usuarios)
/**
 * @swagger
 * /info-extra:
 *   get:
 *     summary: Obtener la información extra actual
 *     tags: [InfoExtra]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información extra obtenida
 *       404:
 *         description: No hay información configurada
 */
router.get('/', verificarToken, obtenerInfoExtraActual);

// POST /info-extra - Crear información extra (solo admin)
/**
 * @swagger
 * /info-extra:
 *   post:
 *     summary: Crear información extra (solo admin)
 *     tags: [InfoExtra]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - url
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               url:
 *                 type: string
 */
router.post(
    '/',
    verificarToken,
    permitirSoloRol('admin'),
    validarInfoExtra,
    validarCampos,
    crearNuevaInfoExtra
);

// PUT /info-extra/:id - Actualizar información extra (solo admin)
/**
 * @swagger
 * /info-extra/{id}:
 *   put:
 *     summary: Actualizar información extra (solo admin)
 *     tags: [InfoExtra]
 *     security:
 *       - bearerAuth: []
 */
router.put(
    '/:id',
    verificarToken,
    permitirSoloRol('admin'),
    validarInfoExtra,
    validarCampos,
    editarInfoExtra
);

// Rutas para configuraciones del sistema
// GET /configuraciones - Obtener configuraciones (solo admin)
/**
 * @swagger
 * /configuraciones:
 *   get:
 *     summary: Obtener configuraciones del sistema (solo admin)
 *     tags: [InfoExtra]
 */
router.get(
    '/configuraciones',
    verificarToken,
    permitirSoloRol('admin'),
    obtenerConfiguraciones
);

// PUT /configuraciones - Actualizar configuraciones (solo admin)
/**
 * @swagger
 * /configuraciones:
 *   put:
 *     summary: Actualizar configuraciones del sistema (solo admin)
 *     tags: [InfoExtra]
 */
router.put(
    '/configuraciones',
    verificarToken,
    permitirSoloRol('admin'),
    validarPrecio,
    validarCampos,
    actualizarConfiguraciones
);

export default router;