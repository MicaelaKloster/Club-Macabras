import { obtenerMembresiaActivaPorUsuario } from "../services/membresias.service.js";
import db from '../config/db.js';

export const verificarAccesoVideo = async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id;
        const rolUsuario = req.usuario.rol;
        const videoId = req.params.videoId || req.query.videoId; // Depende de cómo lo pases

        // ✅ ADMINS tienen acceso a TODO
        if (rolUsuario === 'admin') {
            console.log(`✅ Admin ${usuarioId} acceso completo`);
            return next();
        }

        // Si no se especifica videoId, dejar pasar
        // (el controlador luego filtrará por es_gratuito si es necesario)
        if (!videoId) {
            console.log(`ℹ️ Sin videoId específico, permitiendo acceso`);
            return next();
        }

        // ✅ Obtener info del video
        const videoResult = await db.query(
            'SELECT id, es_gratuito FROM videos WHERE id = $1',
            [videoId]
        );

        if (videoResult.rows.length === 0) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }

        const video = videoResult.rows[0];

        // ✅ Si el video es GRATUITO, cualquier usuario puede verlo
        if (video.es_gratuito === 1) {
            console.log(`✅ Video ${videoId} gratuito - acceso permitido`);
            return next();
        }

        // ❌ Si el video es PREMIUM, verificar membresía
        const membresia = await obtenerMembresiaActivaPorUsuario(usuarioId);

        if (!membresia) {
            console.log(`❌ Usuario ${usuarioId} sin membresía - video premium bloqueado`);
            return res.status(403).json({
                mensaje: 'Este video requiere una membresía activa',
                video_id: videoId,
                es_gratuito: false,
                sugerencia: 'Adquiere una membresía para acceder a este contenido'
            });
        }

        console.log(`✅ Usuario ${usuarioId} con membresía - video premium permitido`);
        next();

    } catch (error) {
        console.error('❌ Error al verificar acceso a video:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// ============================================
// ALTERNATIVA: Si necesitas filtrar a nivel de LISTA de videos
// (Devuelve solo los que el usuario puede ver)
// ============================================

export const filtrarVideosSegunAcceso = async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id;
        const rolUsuario = req.usuario.rol;

        // ✅ ADMINS ven TODOS los videos
        if (rolUsuario === 'admin') {
            req.filtroVideos = null; // Sin filtro
            return next();
        }

        // ✅ Verificar si tiene membresía
        const membresia = await obtenerMembresiaActivaPorUsuario(usuarioId);

        if (membresia) {
            // Con membresía: ver TODOS (gratuitos + premium)
            req.filtroVideos = null;
            console.log(`✅ Usuario ${usuarioId} puede ver todos los videos`);
        } else {
            // Sin membresía: ver SOLO gratuitos
            req.filtroVideos = { es_gratuito: 1 };
            console.log(`ℹ️ Usuario ${usuarioId} puede ver solo videos gratuitos`);
        }

        next();

    } catch (error) {
        console.error('❌ Error al filtrar videos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};