import { body } from 'express-validator';

export const validarNuevoTema = [
  body('tema')
    .trim()
    .notEmpty().withMessage('El título del tema es obligatorio'),

  body('contenido')
    .trim()
    .notEmpty().withMessage('El contenido no puede estar vacío')
];