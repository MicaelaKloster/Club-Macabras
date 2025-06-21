import db from '../config/db.js';
import bcrypt from 'bcrypt';

// Crear un nuevo usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, contraseña, provincia, ciudad } = req.body;

    // Validar campos básicos
    if (!nombre || !email || !contraseña || !provincia || !ciudad) {
      console.error('❌ Campos incompletos en el registro');
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Verificar si ya existe un usuario con ese email
    const [existente] = await db.promise().query('SELECT id FROM usuarios WHERE email = ?', [email]);

    if (existente.length > 0) {
      console.warn(`⚠️ Ya existe un usuario con el email: ${email}`);
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñaHasheada = await bcrypt.hash(contraseña, salt);

    // Insertar nuevo usuario
    await db.promise().query(
      'INSERT INTO usuarios (nombre, email, contraseña, provincia, ciudad, rol, estado) VALUES (?, ?, ?, ?, ?, "usuario", 1)',
      [nombre, email, contraseñaHasheada, provincia, ciudad]
    );

    console.log(`✅ Usuario registrado: ${email}`);
    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });

  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
