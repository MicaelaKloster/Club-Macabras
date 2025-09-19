import { Router } from 'express';
import { 
    crearNuevoTema, 
    listarTemas, 
    verTemaConRespuestas,
    obtenerTema,
    editarTemaControlador,
    eliminarTemaControlador
} from '../controllers/temasForo.controller.js';
import { validarNuevoTema } from '../validations/temasForo.validation.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';
import { body } from 'express-validator';

const router = Router();

// Validación para editar tema
const validarEdicionTema = [
    body('tema')
        .notEmpty()
        .withMessage('El título del tema es obligatorio')
        .isLength({ min: 5, max: 200 })
        .withMessage('El título debe tener entre 5 y 200 caracteres'),
    body('contenido')
        .notEmpty()
        .withMessage('El contenido es obligatorio')
        .isLength({ min: 10, max: 2000 })
        .withMessage('El contenido debe tener entre 10 y 2000 caracteres')
];

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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página (por defecto 1)
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *         description: Cantidad de resultados por página (por defecto 10)
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha mínima (YYYY-MM-DD)
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha máxima (YYYY-MM-DD)
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

// ✅ NUEVAS RUTAS AGREGADAS

/**
 * @swagger
 * /temas-foro/{id}/detalle:
 *   get:
 *     summary: Obtener un tema específico sin respuestas
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
 *     responses:
 *       200:
 *         description: Tema obtenido
 *       404:
 *         description: Tema no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/:id/detalle',
  verificarToken,
  obtenerTema
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

/**
 * @swagger
 * /temas-foro/{id}:
 *   put:
 *     summary: Editar un tema del foro (solo el autor)
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
 *               - tema
 *               - contenido
 *             properties:
 *               tema:
 *                 type: string
 *               contenido:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tema actualizado correctamente
 *       403:
 *         description: No tienes permisos para editar este tema
 *       404:
 *         description: Tema no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put(
  '/:id',
  verificarToken,
  validarEdicionTema,
  validarCampos,
  editarTemaControlador
);

/**
 * @swagger
 * /temas-foro/{id}:
 *   delete:
 *     summary: Eliminar un tema del foro (autor o admin)
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
 *     responses:
 *       200:
 *         description: Tema eliminado correctamente (incluye todas las respuestas)
 *       403:
 *         description: No tienes permisos para eliminar este tema
 *       404:
 *         description: Tema no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  '/:id',
  verificarToken,
  eliminarTemaControlador
);

export default router;