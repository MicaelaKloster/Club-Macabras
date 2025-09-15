import { Router } from 'express';
import { 
  registrarUsuario, 
  listarUsuarios, 
  cambiarRolUsuario, 
  cambiarEstadoUsuario,
  sincronizarEstados,
  verificarEstadoUsuario,
  obtenerEstadosDesactualizados
} from '../controllers/usuarios.controller.js';
import { validarRegistroUsuario, validarCambioRol } from '../validations/usuarios.validation.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { permitirSoloRol } from '../middlewares/rol.middleware.js';

const router = Router();

// Middleware condicional: solo exige token si alguien intenta crear un admin
const protegerSiEsAdmin = (req, res, next) => {
  if (req.body.rol === 'admin') {
    return verificarToken(req, res, next);
  }
  next();
};

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Operaciones relacionadas con usuarios
 */

// GET /usuarios
/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener la lista de todos los usuarios (solo admins) - Con sincronización automática
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios con estados sincronizados
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado se requiere rol de administrador
 *       500:
 *         description: Error del servidor
 */
router.get('/', verificarToken, permitirSoloRol('admin'), listarUsuarios);

// POST /usuarios
/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Registra un nuevo usuario o un administrador (solo admins pueden crear admins)
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - contraseña
 *               - provincia
 *               - ciudad
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               contraseña:
 *                 type: string
 *               provincia:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [admin, usuario]
 *                 description: Solo los admins autenticados pueden crear otros admins
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito
 *       400:
 *         description: Error de validación
 *       409:
 *         description: El correo ya está registrado
 */
router.post(
  '/',
  protegerSiEsAdmin,     // Middleware condicional para verificar token solo si se crea un admin
  validarRegistroUsuario, // Validaciones con express-validator
  validarCampos,          // Middleware para devolver errores
  registrarUsuario        // Controlador final
);

// PUT /usuarios/:id/rol
/**
 * @swagger
 * /usuarios/{id}/rol:
 *   put:
 *     summary: Cambiar el rol de un usuario (solo admins)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a modificar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rol
 *             properties:
 *               rol:
 *                 type: string
 *                 enum: [admin, usuario]
 *                 description: Nuevo rol para el usuario
 *     responses:
 *       200:
 *         description: Rol cambiado con éxito
 *       400:
 *         description: Error de validación
 *       403:
 *         description: Acceso denegado, se requiere rol de administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put(
  '/:id/rol',
  verificarToken,         // Verificar que tenga token válido
  permitirSoloRol('admin'), // Solo admins pueden cambiar roles
  validarCambioRol,       // Validaciones específicas para cambio de rol
  validarCampos,          // Middleware para devolver errores
  cambiarRolUsuario       // Controlador final
);

// PUT /usuarios/:id/estado
/**
 * @swagger
 * /usuarios/{id}/estado:
 *   put:
 *     summary: Cambiar el estado de un usuario (activo/inactivo) - solo admins - Con validación de membresía
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a modificar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: Nuevo estado para el usuario (0=inactivo, 1=activo)
 *     responses:
 *       200:
 *         description: Estado cambiado con éxito
 *       400:
 *         description: Error de validación o usuario sin membresía activa
 *       403:
 *         description: Acceso denegado, se requiere rol de administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put(
  '/:id/estado',
  verificarToken,
  permitirSoloRol('admin'),
  validarCambioRol, 
  validarCampos,
  cambiarEstadoUsuario
);

// NUEVAS RUTAS PARA SINCRONIZACIÓN

// POST /usuarios/sincronizar
/**
 * @swagger
 * /usuarios/sincronizar:
 *   post:
 *     summary: Sincronizar manualmente todos los estados de usuarios con sus membresías
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sincronización completada exitosamente
 *       403:
 *         description: Acceso denegado, se requiere rol de administrador
 *       500:
 *         description: Error del servidor
 */
router.post(
  '/sincronizar',
  verificarToken,
  permitirSoloRol('admin'),
  sincronizarEstados
);

// GET /usuarios/:id/verificar-estado
/**
 * @swagger
 * /usuarios/{id}/verificar-estado:
 *   get:
 *     summary: Verificar y actualizar el estado de un usuario específico basado en su membresía
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a verificar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estado verificado y actualizado
 *       403:
 *         description: Acceso denegado, se requiere rol de administrador
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/:id/verificar-estado',
  verificarToken,
  permitirSoloRol('admin'),
  verificarEstadoUsuario
);

// GET /usuarios/estados-desactualizados
/**
 * @swagger
 * /usuarios/estados-desactualizados:
 *   get:
 *     summary: Obtener lista de usuarios con estados desactualizados (para debugging)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios con estados desactualizados
 *       403:
 *         description: Acceso denegado, se requiere rol de administrador
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/estados-desactualizados',
  verificarToken,
  permitirSoloRol('admin'),
  obtenerEstadosDesactualizados
);

export default router;