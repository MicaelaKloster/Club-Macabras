import { body } from 'express-validator';

export const validarNuevoVideo = [
  body('curso_id')
    .notEmpty().withMessage('El ID del curso es obligatorio')
    .isInt().withMessage('El ID del curso debe ser un número entero'),

  body('titulo')
    .trim()
    .notEmpty().withMessage('El título es obligatorio'),

  body('url')
    .trim()
    .notEmpty().withMessage('La URL del video es obligatoria'),

  body('es_gratuito')
    .optional()
    .isIn([0, 1]).withMessage('El campo es_gratuito debe ser 0 o 1')
];