import { crearRespuestaEnTema } from "../services/respuestasForo.service.js";

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