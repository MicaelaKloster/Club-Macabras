import { body } from 'express-validator';

export const validarPregunta = [
  body('curso_id')
    .notEmpty().withMessage('El ID del curso es obligatorio')
    .isInt().withMessage('Debe ser un número entero'),

  body('pregunta')
    .notEmpty().withMessage('La pregunta no puede estar vacía')
    .isString().withMessage('Debe ser un texto'),
];

export const validarRespuesta = [
  body('respuesta')
    .notEmpty().withMessage('La respuesta no puede estar vacía')
    .isString().withMessage('Debe ser texto válido')
];