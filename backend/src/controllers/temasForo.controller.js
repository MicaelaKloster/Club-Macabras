import {
    crearTemaForo, 
    obtenerTemasPaginados, 
    obtenerTemasConRespuestas,
    obtenerTemaPorId,
    editarTemaForo,
    eliminarTemaForo
} from '../services/temasForos.service.js';

export const crearNuevoTema = async (req, res) => {
    try{
        const { tema, contenido } = req.body;
        const usuarioId = req.usuario.id; // Obtenido del token

        await crearTemaForo(usuarioId, tema, contenido);
        console.log(`🧵 Nuevo tema creado por usuario ${usuarioId}: ${tema}`);

        res.status(201).json({ mensaje: 'Tema creado correctamente' });

    }catch(error){
        console.error('❌ Error al crear tema: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const listarTemas = async (req, res) => {
  try {
    const { page = 1, limite = 10, desde, hasta } = req.query;

    const temas = await obtenerTemasPaginados(page, limite, desde, hasta);

    res.status(200).json({
      pagina: parseInt(page),
      cantidad: temas.length,
      temas
    });

  } catch (error) {
    console.error('❌ Error al listar temas del foro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const verTemaConRespuestas = async (req, res) => {
    try{
        const { id } = req.params;

        const tema = await obtenerTemasConRespuestas(id);

        if (!tema) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }

        res.status(200).json(tema);

    }catch (error){
        console.error('❌ Error al obtener tema con respuestas: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });  
    }
};

// ✅ NUEVOS CONTROLADORES AGREGADOS

export const obtenerTema = async (req, res) => {
    try {
        const { id } = req.params;

        const tema = await obtenerTemaPorId(id);

        if (!tema) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }

        res.status(200).json(tema);

    } catch (error) {
        console.error('❌ Error al obtener tema:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const editarTemaControlador = async (req, res) => {
    try {
        const { id } = req.params;
        const { tema: nuevoTema, contenido: nuevoContenido } = req.body;
        const usuarioId = req.usuario.id;

        // Verificar que el tema existe y pertenece al usuario
        const temaExistente = await obtenerTemaPorId(id);
        
        if (!temaExistente) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }

        if (temaExistente.usuario_id !== usuarioId) {
            return res.status(403).json({ error: 'No tienes permisos para editar este tema' });
        }

        const temaActualizado = await editarTemaForo(id, usuarioId, nuevoTema, nuevoContenido);

        if (!temaActualizado) {
            return res.status(400).json({ error: 'No se pudo actualizar el tema' });
        }

        console.log(`✏️ Usuario ${usuarioId} editó tema ${id}`);
        res.status(200).json({ 
            mensaje: 'Tema actualizado correctamente',
            tema: temaActualizado
        });

    } catch (error) {
        console.error('❌ Error al editar tema:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const eliminarTemaControlador = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario.id;
        const esAdmin = req.usuario.rol === 'admin';

        // Verificar que el tema existe
        const tema = await obtenerTemaPorId(id);
        
        if (!tema) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }

        // Si no es admin, verificar que es el propietario
        if (!esAdmin && tema.usuario_id !== usuarioId) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar este tema' });
        }

        const temaEliminado = await eliminarTemaForo(id, usuarioId, esAdmin);

        if (!temaEliminado) {
            return res.status(400).json({ error: 'No se pudo eliminar el tema' });
        }

        console.log(`🗑️ ${esAdmin ? 'Admin' : `Usuario ${usuarioId}`} eliminó tema ${id} y sus respuestas`);
        res.status(200).json({ mensaje: 'Tema eliminado correctamente' });

    } catch (error) {
        console.error('❌ Error al eliminar tema:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};