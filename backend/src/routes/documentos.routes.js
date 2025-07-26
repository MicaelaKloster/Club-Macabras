import { Router } from "express";
import { crearNuevoDocumento, listarDocumentosPorCurso } from "../controllers/documentos.controller.js";
import { validarNuevoDocumento } from "../validations/documentos.validation.js";
import { validarCampos } from "../middlewares/validarCampos.middleware.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { permitirSoloRol } from "../middlewares/rol.middleware.js";

const router = Router();

// Rutas de documentos

/**
 * @swagger
 * tags:
 *   name: Documentos
 *   description: Materiales complementarios de los cursos
 */


/**
 * @swagger
 * /documentos:
 *   post:
 *     summary: Agregar un nuevo documento a un curso (solo admin)
 *     tags: [Documentos]
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
 *               tipo:
 *                 type: string
 *                 example: PDF
 *     responses:
 *       201:
 *         description: Documento agregado correctamente
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
  validarNuevoDocumento,
  validarCampos,
  crearNuevoDocumento
);

/**
 * @swagger
 * /api/v1/documentos/{cursoId}:
 *   get:
 *     summary: Obtener documentos de un curso
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Lista de documentos del curso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documentos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       titulo:
 *                         type: string
 *                       url:
 *                         type: string
 *                       tipo:
 *                         type: string
 *       401:
 *         description: Token no válido o no proporcionado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:cursoId", verificarToken, listarDocumentosPorCurso);

export default router;