import { validationResult } from 'express-validator';

// Middleware para manejar los errores de validación de express-validator
export const validarCampos = (req, res, next) => {
  // Obtiene los errores de validación de la request
  const errores = validationResult(req);
  // Si hay errores, responde con un status 400 y el detalle de los errores
  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array().map(err => ({
        campo: err.param,      // Nombre del campo con error
        mensaje: err.msg       // Mensaje de error asociado
      }))
    });
  }
  // Si no hay errores, pasa al siguiente middleware/controlador
  next();
};
