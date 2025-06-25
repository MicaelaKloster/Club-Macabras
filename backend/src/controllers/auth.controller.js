import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { enviarCorreoRecuperacion } from '../utils/mailer.js';
import { buscarUsuarioPorEmailConTodo, actualizarContraseñaPorId } from '../services/auth.service.js';

dotenv.config();

// Controlador para login de usuario
export const loginUsuario = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const usuario = await buscarUsuarioPorEmailConTodo(email);

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`✅ Login exitoso para: ${email}`);
    res.status(200).json({ mensaje: 'Login exitoso', token });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const recuperarPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const usuario = await buscarUsuarioPorEmailConTodo(email);
    if (!usuario) {
      return res.status(404).json({ error: 'No hay ningún usuario registrado con ese email' });
    }

    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    await enviarCorreoRecuperacion(email, token);

    res.status(200).json({ mensaje: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error('❌ Error al enviar correo de recuperación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const restablecerPassword = async (req, res) => {
  try {
    const { token, nuevaContraseña } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hash = await bcrypt.hash(nuevaContraseña, 10);
    await actualizarContraseñaPorId(decoded.id, hash);

    res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('❌ Error al restablecer contraseña:', error);
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
};