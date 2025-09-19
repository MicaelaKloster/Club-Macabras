import { 
    crearRespuestaEnTema,
    obtenerRespuestaPorId,
    editarRespuesta,
    eliminarRespuesta
} from "../services/respuestasForo.service.js";

export const responderATema = async (req, res) => {
    try{
        const { id: temaId } = req.params;
        const usuarioId = req.usuario.id; // Asumiendo que el ID del usuario está en req.usuario
        const { contenido } = req.body;

        await crearRespuestaEnTema(temaId, usuarioId, contenido);
        console.log(`💬 Respuesta agregada al tema ${temaId} por el usuario ${usuarioId}`);

        res.status(201).json({ mensaje: 'Respuesta publicada correctamente'});

    }catch(error){
        console.error('❌ Error al publicar respuesta: ', error);
        res.status(500).json({ mensaje: 'Error interno del servidor'});
    }
};

// NUEVOS CONTROLADORES AGREGADOS (18/09)

export const obtenerRespuesta = async (req, res) => {
    try {
        const { id } = req.params;

        const respuesta = await obtenerRespuestaPorId(id);

        if (!respuesta) {
            return res.status(404).json({ error: 'Respuesta no encontrada' });
        }

        res.status(200).json(respuesta);

    } catch (error) {
        console.error('❌ Error al obtener respuesta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const editarRespuestaControlador = async (req, res) => {
    try {
        const { id } = req.params;
        const { contenido: nuevoContenido } = req.body;
        const usuarioId = req.usuario.id;

        // Verificar que la respuesta existe y pertenece al usuario
        const respuestaExistente = await obtenerRespuestaPorId(id);
        
        if (!respuestaExistente) {
            return res.status(404).json({ error: 'Respuesta no encontrada' });
        }

        if (respuestaExistente.usuario_id !== usuarioId) {
            return res.status(403).json({ error: 'No tienes permisos para editar esta respuesta' });
        }

        const respuestaActualizada = await editarRespuesta(id, usuarioId, nuevoContenido);

        if (!respuestaActualizada) {
            return res.status(400).json({ error: 'No se pudo actualizar la respuesta' });
        }

        console.log(`✏️ Usuario ${usuarioId} editó respuesta ${id}`);
        res.status(200).json({ 
            mensaje: 'Respuesta actualizada correctamente',
            respuesta: respuestaActualizada
        });

    } catch (error) {
        console.error('❌ Error al editar respuesta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const eliminarRespuestaControlador = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario.id;
        const esAdmin = req.usuario.rol === 'admin';

        // Verificar que la respuesta existe
        const respuesta = await obtenerRespuestaPorId(id);
        
        if (!respuesta) {
            return res.status(404).json({ error: 'Respuesta no encontrada' });
        }

        // Si no es admin, verificar que es el propietario
        if (!esAdmin && respuesta.usuario_id !== usuarioId) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar esta respuesta' });
        }

        const respuestaEliminada = await eliminarRespuesta(id, usuarioId, esAdmin);

        if (!respuestaEliminada) {
            return res.status(400).json({ error: 'No se pudo eliminar la respuesta' });
        }

        console.log(`🗑️ ${esAdmin ? 'Admin' : `Usuario ${usuarioId}`} eliminó respuesta ${id}`);
        res.status(200).json({ mensaje: 'Respuesta eliminada correctamente' });

    } catch (error) {
        console.error('❌ Error al eliminar respuesta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};