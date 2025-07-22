import { subirTrabajo, obtenerTrabajosDeCurso } from "../services/trabajos.service.js";

export const crearTrabajo = async (req, res) => {
    try{
        const usuarioId = req.usuario.id; // ID del usuario autenticado
        const { curso_id, descripcion } = req.body; 

        // Si no hay archivo, error
        if (!req.file) {
          return res.status(400).json({ error: 'La imagen es obligatoria' });
        }

        // Ruta pública a la imagen
        const imagen_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        await subirTrabajo(usuarioId, curso_id, imagen_url, descripcion);
        console.log(`👜 Trabajo subido por usuario ${usuarioId} en curso ${curso_id}`);

        res.status(201).json({ mensaje: 'Trabajo publicado correctamente' });

    }catch (error) {
        console.error('❌ Error al subir trabajo: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const listarTrabajosPorCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const usuarioId = req.usuario?.id || 0; // Por si no hay token

    const trabajos = await obtenerTrabajosDeCurso(cursoId, usuarioId);

    res.status(200).json(trabajos);

  } catch (error) {
    console.error('❌ Error al obtener trabajos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};