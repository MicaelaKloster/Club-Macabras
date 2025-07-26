import { agregarVideoCurso, obtenerVideosPorCurso } from "../services/videos.service.js";

export const crearNuevoVideo = async (req, res) => {
    try{
        const { curso_id, titulo, url, es_gratuito } = req.body;

        await agregarVideoCurso(curso_id, titulo, url, es_gratuito || 0);
        console.log(`✅ Video agregado al curso ${curso_id}: ${titulo}`);

        res.status(201).json({ mensaje: 'Video agregado correctamente' });

    }catch (error){
        console.error('❌ Error al agregar video:', error);
        res.status(500).json({ error: 'Error interno del servidor al agregar el video' });
    }
};

export const listarVideosPorCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const videos = await obtenerVideosPorCurso(cursoId);
    res.status(200).json({ videos });
  } catch (error) {
    console.error("❌ Error al obtener videos:", error);
    res.status(500).json({ error: "Error al obtener videos" });
  }
};