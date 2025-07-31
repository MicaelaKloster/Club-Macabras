import { obtenerVideosVistosPorUsuario, registrarVideoVisto } from "../services/progreso.service.js";

export const listarVideosVistos = async (req, res) => {
  try {
    const { usuarioId, cursoId } = req.params;
    const rows = await obtenerVideosVistosPorUsuario(usuarioId, cursoId);

    const vistos = rows.map((r) => r.video_id);
    res.status(200).json({ vistos });
  } catch (error) {
    console.error('❌ Error al obtener progreso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const marcarVideoComoVisto = async (req, res) => {
  try {
    const { video_id, curso_id } = req.body;
    const usuario_id = req.usuario.id;

    await registrarVideoVisto(usuario_id, curso_id, video_id);

    res.status(200).json({ mensaje: "Progreso actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al registrar progreso:", error);
    res.status(500).json({ error: "Error al actualizar progreso" });
  }
};