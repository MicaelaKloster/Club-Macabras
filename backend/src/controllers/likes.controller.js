import { darLikeATrabajo, quitarLikeATrabajo } from '../services/likes.service.js';

export const likeATrabajo = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { id: trabajoId } = req.params;

    await darLikeATrabajo(usuarioId, trabajoId);

    res.status(201).json({ mensaje: 'Like registrado correctamente' });

  } catch (error) {
    console.error('❌ Error al dar like:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const dislikeATrabajo = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { id: trabajoId } = req.params;

    await quitarLikeATrabajo(usuarioId, trabajoId);

    res.status(200).json({ mensaje: 'Like quitado correctamente' });

  } catch (error) {
    console.error('❌ Error al quitar like:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};