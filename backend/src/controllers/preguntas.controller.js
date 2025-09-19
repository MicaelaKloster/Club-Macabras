import { 
    crearPregunta, 
    obtenerPreguntasPorCurso, 
    responderPregunta, 
    obtenerTodasLasPreguntas,
    obtenerPreguntaPorId,
    editarPregunta,
    editarRespuesta,
    eliminarPregunta
} from '../services/preguntas.service.js';

export const hacerPregunta = async (req, res) => {
    try{
        const usuarioId = req.usuario.id;
        const { curso_id, pregunta } = req.body;

        await crearPregunta(usuarioId, curso_id, pregunta);
        console.log(`📝 Usuario ${usuarioId} preguntó sobre curso ${curso_id}`);

        res.status(201).json({ mensaje: 'Pregunta enviada correctamente' });

    }catch (error) {
        console.error('❌ Error al hacer pregunta: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const listarPreguntasPorCurso = async (req, res) => {
    try{
        const { cursoId } = req.params;

        const preguntas = await obtenerPreguntasPorCurso(cursoId);

        res.status(200).json(preguntas);
        console.log(`📋 Listando preguntas para curso ${cursoId}`);

    }catch (error){
        console.error('❌ Error al listar preguntas del curso: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const responderPreguntaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;

    await responderPregunta(id, respuesta);
    console.log(`✅ Pregunta ${id} respondida`);

    res.status(200).json({ mensaje: 'Respuesta registrada correctamente' });

  } catch (error) {
    console.error('❌ Error al responder pregunta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const listarTodasLasPreguntas = async (req, res) => {
  try{
    const preguntas = await obtenerTodasLasPreguntas();
    res.status(200).json(preguntas);
    console.log("📋 Listando todas las preguntas")
  }catch (error){
    console.error('❌ Error al listar todas las preguntas: ', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// NUEVOS CONTROLADORES AGREGADOS (18/09)

export const obtenerPregunta = async (req, res) => {
    try {
        const { id } = req.params;

        const pregunta = await obtenerPreguntaPorId(id);

        if (!pregunta) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        res.status(200).json(pregunta);

    } catch (error) {
        console.error('❌ Error al obtener pregunta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const editarPreguntaControlador = async (req, res) => {
    try {
        const { id } = req.params;
        const { pregunta: nuevaPregunta } = req.body;
        const usuarioId = req.usuario.id;

        // Verificar que la pregunta existe y pertenece al usuario
        const preguntaExistente = await obtenerPreguntaPorId(id);
        
        if (!preguntaExistente) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        if (preguntaExistente.usuario_id !== usuarioId) {
            return res.status(403).json({ error: 'No tienes permisos para editar esta pregunta' });
        }

        // No permitir editar si ya tiene respuesta
        if (preguntaExistente.respuesta && preguntaExistente.respuesta.trim() !== '') {
            return res.status(400).json({ error: 'No puedes editar una pregunta que ya tiene respuesta' });
        }

        const preguntaActualizada = await editarPregunta(id, usuarioId, nuevaPregunta);

        if (!preguntaActualizada) {
            return res.status(400).json({ error: 'No se pudo actualizar la pregunta' });
        }

        console.log(`✏️ Usuario ${usuarioId} editó pregunta ${id}`);
        res.status(200).json({ 
            mensaje: 'Pregunta actualizada correctamente',
            pregunta: preguntaActualizada
        });

    } catch (error) {
        console.error('❌ Error al editar pregunta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const editarRespuestaControlador = async (req, res) => {
    try {
        const { id } = req.params;
        const { respuesta: nuevaRespuesta } = req.body;

        // Verificar que la pregunta existe
        const pregunta = await obtenerPreguntaPorId(id);
        
        if (!pregunta) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        const respuestaActualizada = await editarRespuesta(id, nuevaRespuesta);

        if (!respuestaActualizada) {
            return res.status(400).json({ error: 'No se pudo actualizar la respuesta' });
        }

        console.log(`✏️ Admin editó respuesta de pregunta ${id}`);
        res.status(200).json({ 
            mensaje: 'Respuesta actualizada correctamente',
            pregunta: respuestaActualizada
        });

    } catch (error) {
        console.error('❌ Error al editar respuesta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const eliminarPreguntaControlador = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario.id;
        const esAdmin = req.usuario.rol === 'admin';

        // Verificar que la pregunta existe
        const pregunta = await obtenerPreguntaPorId(id);
        
        if (!pregunta) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        // Si no es admin, verificar que es el propietario
        if (!esAdmin && pregunta.usuario_id !== usuarioId) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar esta pregunta' });
        }

        const preguntaEliminada = await eliminarPregunta(id, usuarioId, esAdmin);

        if (!preguntaEliminada) {
            return res.status(400).json({ error: 'No se pudo eliminar la pregunta' });
        }

        console.log(`🗑️ ${esAdmin ? 'Admin' : `Usuario ${usuarioId}`} eliminó pregunta ${id}`);
        res.status(200).json({ mensaje: 'Pregunta eliminada correctamente' });

    } catch (error) {
        console.error('❌ Error al eliminar pregunta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};