import {crearTemaForo, obtenerTodosLosTemas, obtenerTemasConRespuestas} from '../services/temasForos.service.js';

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

export const listarTemas = async (req, res) =>{
    try{
        const temas = await obtenerTodosLosTemas();
        res.status(200).json(temas);

    }catch (error){
        console.error('❌ Error al listar temas del foro: ', error);
        res.status(500).json({ error: 'Error interno del servidor'});
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