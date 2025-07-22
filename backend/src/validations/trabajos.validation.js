import { body } from 'express-validator';

export const validarTrabajo = [
  body('curso_id')
    .notEmpty().withMessage('El ID del curso es obligatorio')
    .isInt().withMessage('Debe ser un número entero'),

  body('descripcion')
    .optional()
    .isString().withMessage('Debe ser un texto válido')
];