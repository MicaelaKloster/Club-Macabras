import { body } from 'express-validator';

export const validarNuevaRespuesta = [
  body('contenido')
    .trim()
    .notEmpty().withMessage('El contenido de la respuesta es obligatorio')
];