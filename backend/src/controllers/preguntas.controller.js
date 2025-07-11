import { crearPregunta, obtenerPreguntasPorCurso, responderPregunta } from '../services/preguntas.service.js';

export const hacerPregunta = async (req, res) => {
    try{
        const usuarioId = req.usuario.id;
        const { curso_id, pregunta } = req.body;

        await crearPregunta(usuarioId, curso_id, pregunta);
        console.log(`❓ Usuario ${usuarioId} preguntó sobre curso ${curso_id}`);

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