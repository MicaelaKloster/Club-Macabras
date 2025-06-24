import bcrypt from 'bcrypt';
import {
  obtenerTodosLosUsuarios,
  buscarUsuarioPorEmail,
  insertarUsuario
} from '../services/usuarios.service.js';

// Controlador para registrar un nuevo usuario
export const registrarUsuario = async (req, res) => {
  try {
    // Extrae los datos enviados en el cuerpo de la petición
    const { nombre, email, contraseña, provincia, ciudad } = req.body;

    // Verifica que todos los campos obligatorios estén presentes
    if (!nombre || !email || !contraseña || !provincia || !ciudad) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Busca si ya existe un usuario registrado con el mismo email
    const existente = await buscarUsuarioPorEmail(email);
    if (existente.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    // Genera un salt y hashea la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const contraseñaHasheada = await bcrypt.hash(contraseña, salt);

    // Inserta el nuevo usuario en la base de datos
    await insertarUsuario({ nombre, email, contraseña: contraseñaHasheada, provincia, ciudad });

    // Muestra en consola que el usuario fue registrado correctamente
    console.log(`✅ Usuario registrado: ${email}`);
    // Responde con éxito al cliente
    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });

  } catch (error) {
    // Maneja cualquier error inesperado y responde con error de servidor
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await obtenerTodosLosUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
