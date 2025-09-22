import { body } from 'express-validator';

export const validarCreacionCurso = [
    body('titulo')
        .trim()
        .notEmpty().withMessage('El título es obligatorio'),

    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser texto'),
    
    body('categoria')
        .optional()
        .isString().withMessage('La categoría debe ser texto'),
    
    body('imagen_portada')
        .optional()
        .isURL()
        .withMessage('La imagen de portada debe ser una URL válida')
];