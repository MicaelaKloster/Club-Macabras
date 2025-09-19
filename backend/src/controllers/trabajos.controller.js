import { subirTrabajo, obtenerTrabajosDeCurso, obtenerTrabajoPorId, actualizarTrabajo, eliminarTrabajo } from "../services/trabajos.service.js";

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

// Agregar estas funciones a tu trabajos.controller.js

export const editarTrabajo = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;
    const usuarioId = req.usuario.id;

    // Verificar que el trabajo existe
    const trabajo = await obtenerTrabajoPorId(id);
    if (!trabajo) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }

    // Verificar que es el propietario (a menos que sea admin)
    if (trabajo.usuario_id !== usuarioId && req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para editar este trabajo' });
    }

    const actualizado = await actualizarTrabajo(id, descripcion);
    
    if (!actualizado) {
      return res.status(500).json({ error: 'Error al actualizar el trabajo' });
    }

    console.log(`📝 Trabajo ${id} editado por usuario ${usuarioId}`);
    res.status(200).json({ mensaje: 'Trabajo actualizado correctamente' });

  } catch (error) {
    console.error('❌ Error al editar trabajo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const borrarTrabajo = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    // Verificar que el trabajo existe
    const trabajo = await obtenerTrabajoPorId(id);
    if (!trabajo) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }

    // Verificar permisos: propietario o admin
    if (trabajo.usuario_id !== usuarioId && req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para eliminar este trabajo' });
    }

    const eliminado = await eliminarTrabajo(id);
    
    if (!eliminado) {
      return res.status(500).json({ error: 'Error al eliminar el trabajo' });
    }

    console.log(`🗑️ Trabajo ${id} eliminado por usuario ${usuarioId} (${req.usuario.rol})`);
    res.status(200).json({ mensaje: 'Trabajo eliminado correctamente' });

  } catch (error) {
    console.error('❌ Error al eliminar trabajo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};