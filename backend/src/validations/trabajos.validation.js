import { body } from 'express-validator';

export const validarTrabajo = [
  body('curso_id')
    .notEmpty().withMessage('El ID del curso es obligatorio')
    .isInt().withMessage('Debe ser un número entero'),

  body('imagen_url')
    .notEmpty().withMessage('La URL de la imagen es obligatoria')
    .isURL().withMessage('Debe ser una URL válida'),

  body('descripcion')
    .optional()
    .isString().withMessage('Debe ser un texto válido')
];