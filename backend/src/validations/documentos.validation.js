import { body } from 'express-validator';

export const validarNuevoDocumento = [
  body('curso_id')
    .notEmpty().withMessage('El ID del curso es obligatorio')
    .isInt().withMessage('El ID del curso debe ser un número entero'),

  body('titulo')
    .trim()
    .notEmpty().withMessage('El título es obligatorio'),

  body('url')
    .trim()
    .notEmpty().withMessage('La URL del documento es obligatoria'),

  body('tipo')
    .optional()
    .isString().withMessage('El tipo debe ser texto (ej: PDF, ficha, guía)')
];