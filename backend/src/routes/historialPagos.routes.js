import { Router } from 'express';
import { 
    obtenerMiHistorialPagos, 
    obtenerTodoElHistorial 
} from '../controllers/historialPagos.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { permitirSoloRol } from '../middlewares/rol.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Historial Pagos
 *   description: Gestión del historial de pagos
 */

/**
 * @swagger
 * /historial-pagos/mis-pagos:
 *   get:
 *     summary: Obtener mi historial de pagos
 *     tags: [Historial Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de pagos a retornar
 *     responses:
 *       200:
 *         description: Historial de pagos del usuario
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/mis-pagos', verificarToken, obtenerMiHistorialPagos);

/**
 * @swagger
 * /historial-pagos/admin/todos:
 *   get:
 *     summary: Obtener todos los pagos (solo admin)
 *     tags: [Historial Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Historial completo de pagos con estadísticas
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Se requiere rol de administrador
 *       500:
 *         description: Error del servidor
 */
router.get('/admin/todos', verificarToken, permitirSoloRol('admin'), obtenerTodoElHistorial);

export default router;