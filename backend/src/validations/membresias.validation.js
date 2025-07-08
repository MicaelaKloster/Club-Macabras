import { body } from 'express-validator';

export const validarCreacionMembresia = [
  body('usuario_id')
    .notEmpty().withMessage('El ID del usuario es obligatorio')
    .isInt().withMessage('Debe ser un número entero'),

  body('fecha_inicio')
    .notEmpty().withMessage('La fecha de inicio es obligatoria')
    .isISO8601().withMessage('Debe ser una fecha válida (formato YYYY-MM-DD)'),

  body('fecha_vencimiento')
    .notEmpty().withMessage('La fecha de fin es obligatoria')
    .isISO8601().withMessage('Debe ser una fecha válida (formato YYYY-MM-DD)'),

  body('metodo_pago')
    .notEmpty().withMessage('El método de pago es obligatorio')
    .isString().withMessage('Debe ser un texto válido'),

  body('estado')
    .optional()
    .isIn([0, 1]).withMessage('El estado debe ser 0 o 1')    
];