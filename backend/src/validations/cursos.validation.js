import { body } from 'express-validator';

export const validarCreacionCurso = [
    body('titulo')
        .notEmpty()
        .withMessage('El título es obligatorio')
        .isLength({ min: 3, max: 255 })
        .withMessage('El título debe tener entre 3 y 255 caracteres'),
    body('descripcion')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede exceder 1000 caracteres'),
    body('categoria')
        .optional()
        .isLength({ max: 50 })
        .withMessage('La categoría no puede exceder 100 caracteres'),
    body('imagen_portada')
        .optional()
        .custom((value) => {
            if (!value) return true; // Si está vacío, es válido (opcional)
            if (!value.startsWith('http')) {
                throw new Error('La imagen debe ser una URL válida');
            }
            return true;
        })
];