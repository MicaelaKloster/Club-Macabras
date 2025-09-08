import { body, param } from 'express-validator';

// Middleware de validación para el registro de usuario
export const validarRegistroUsuario = [
  // Valida el campo 'nombre'
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),

  // Valida el campo 'email'
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido'),

  // Valida el campo 'contraseña'
  body('contraseña')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  // Valida el campo 'provincia'
  body('provincia')
    .trim()
    .notEmpty().withMessage('La provincia es obligatoria'),

  // Valida el campo 'ciudad'
  body('ciudad')
    .trim()
    .notEmpty().withMessage('La ciudad es obligatoria'),

  // Valida el campo 'rol'
  body('rol')
    .optional()
    .isIn(['admin', 'usuario']).withMessage('El rol solo puede ser "admin" o "usuario"')
];

// Middleware de validación para el cambio de rol
export const validarCambioRol = [
  // Valida el parámetro 'id'
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
    
  // Valida el campo 'rol'
  body('rol')
    .trim()
    .notEmpty().withMessage('El rol es obligatorio')
    .isIn(['admin', 'usuario']).withMessage('El rol solo puede ser "admin" o "usuario"')
];