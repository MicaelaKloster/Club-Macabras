import { body } from 'express-validator';

export const validarEdicionPerfil = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio'),
  body('provincia')
    .trim()
    .notEmpty().withMessage('La provincia es obligatoria'),
  body('ciudad')
    .trim()
    .notEmpty().withMessage('La ciudad es obligatoria'),

  // Contraseña nueva debe tener mínimo 6 caracteres si se envía
  body('contraseña_nueva')
    .optional()
    .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),

  body('contraseña_actual')
    .custom((value, { req }) => {
      if (req.body.contraseña_nueva && !value) {
        throw new Error('Debe ingresar la contraseña actual para cambiarla');
      }
      return true;
    })
];