import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { buscarUsuarioPorEmailConTodo } from '../services/auth.service.js';

dotenv.config();

// Controlador para login de usuario
export const loginUsuario = async (req, res) => {
  try {
    // Extrae email y contraseña del cuerpo de la petición
    const { email, contraseña } = req.body;

    // Verifica que ambos campos estén presentes
    if (!email || !contraseña) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    // Busca el usuario en la base de datos por email
    const usuario = await buscarUsuarioPorEmailConTodo(email);

    // Si no existe el usuario, responde con error de credenciales
    if (usuario.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = usuario[0];
    // Compara la contraseña ingresada con la almacenada (hasheada)
    const passwordMatch = await bcrypt.compare(contraseña, user.contraseña);

    // Si la contraseña no coincide, responde con error de credenciales
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Genera un token JWT con los datos del usuario
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Muestra en consola el login exitoso
    console.log(`✅ Login exitoso para: ${email}`);
    // Responde con el token al cliente
    res.status(200).json({ mensaje: 'Login exitoso', token });

  } catch (error) {
    // Maneja errores inesperados y responde con error de servidor
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
