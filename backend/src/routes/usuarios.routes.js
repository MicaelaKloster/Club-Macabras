// import db from '../config/db.js';
import { Router } from 'express';
import { registrarUsuario, listarUsuarios } from '../controllers/usuarios.controller.js';
import { validarRegistroUsuario } from '../validations/usuarios.validation.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';

const router = Router();

// GET /usuarios
router.get('/', listarUsuarios);

// POST /usuarios
router.post(
  '/',
  validarRegistroUsuario, // Validaciones con express-validator
  validarCampos,          // Middleware para devolver errores
  registrarUsuario        // Controlador final
);

export default router;
