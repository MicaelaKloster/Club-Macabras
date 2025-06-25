import bcrypt from 'bcrypt';
import { 
  actualizarPerfil,
  actualizarContraseña,
  obtenerContraseñaActual,
  obtenerPerfilPorId,
  desactivarUsuario 
} from '../services/perfil.service.js';

export const obtenerPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const perfil = await obtenerPerfilPorId(usuarioId);

    if (perfil.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(perfil[0]);
  } catch (err) {
    console.error('❌ Error al obtener perfil:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const editarPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { nombre, provincia, ciudad, contraseña_actual, contraseña_nueva } = req.body;

    // Actualizar nombre, provincia y ciudad
    await actualizarPerfil(usuarioId, nombre, provincia, ciudad);

    // Si se quiere cambiar la contraseña
    if (contraseña_actual && contraseña_nueva) {
      const contraseñaEnBD = await obtenerContraseñaActual(usuarioId);
      const coincide = await bcrypt.compare(contraseña_actual, contraseñaEnBD);

      if (!coincide) {
        return res.status(401).json({ error: 'La contraseña actual no es correcta' });
      }

      const hash = await bcrypt.hash(contraseña_nueva, 10);
      await actualizarContraseña(usuarioId, hash);
    }

    res.status(200).json({ mensaje: 'Perfil actualizado correctamente' });

  } catch (error) {
    console.error('❌ Error al editar perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const eliminarPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    await desactivarUsuario(usuarioId);
    res.status(200).json({ mensaje: 'Cuenta desactivada correctamente' });
  } catch (error) {
    console.error('❌ Error al desactivar cuenta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};