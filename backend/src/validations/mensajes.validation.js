import { body } from 'express-validator';

export const validarEnvioMensaje = [
  body('usuario_destino')
    .notEmpty().withMessage('El ID del destinatario es obligatorio')
    .isInt().withMessage('Debe ser un número entero'),

  body('contenido')
    .notEmpty().withMessage('El mensaje no puede estar vacío')
    .isString().withMessage('Debe ser texto válido')
];