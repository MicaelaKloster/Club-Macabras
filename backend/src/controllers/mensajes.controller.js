import { enviarMensaje, obtenerMensajesConUsuario, obtenerInboxUsuario } from '../services/mensajes.service.js';

export const enviarMensajePrivado = async (req, res) => {
    try{
        const usuarioOrigen = req.usuario.id;
        const { usuario_destino, contenido } = req.body;

        await enviarMensaje(usuarioOrigen, usuario_destino, contenido);
        console.log(`📨 Mensaje enviado de ${usuarioOrigen} a ${usuario_destino}`);

        res.status(201).json({ message: 'Mensaje enviado correctamente' });

    }catch (error) {
        console.error('❌ Error al enviar mensaje: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const verConversacionConUsuario = async (req, res) => {
    try{
        const usuarioLogueado = req.usuario.id;
        const { usuarioId } = req.params;

        const mensajes = await obtenerMensajesConUsuario(usuarioLogueado, usuarioId);
        
        res.status(200).json(mensajes);

    }catch (error) {
        console.error('❌ Error al obtener conversación: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const verInbox = async (req, res) => {
    try{
        const usuarioId = req.usuario.id;

        const inbox = await obtenerInboxUsuario(usuarioId);
        
        res.status(200).json(inbox);

    }catch (error){
        console.error('❌ Error al obtener inbox: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};