import { obtenerPerfilPorId } from '../services/perfil.service.js';

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
