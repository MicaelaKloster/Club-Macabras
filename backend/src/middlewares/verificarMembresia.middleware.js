import { obtenerMembresiaActivaPorUsuario } from "../services/membresias.service.js";
export const verificarMembresiaActiva = async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id;
        const rolUsuario = req.usuario.rol; 

        if (rolUsuario === 'admin') {
            console.log(`✅ Admin ${usuarioId} tiene acceso sin membresía`);
            return next();
        }

        // Solo validar membresía para usuarios regulares
        const membresia = await obtenerMembresiaActivaPorUsuario(usuarioId);

        if (!membresia) {
            console.log(`❌ Usuario ${usuarioId} bloqueado: sin membresía activa`);
            return res.status(403).json({
                mensaje: 'Acceso restringido: se requiere una membresía activa',
                usuario_id: usuarioId,
                rol: rolUsuario
            });
        }

        console.log(`✅ Usuario ${usuarioId} desbloqueado: tiene membresía activa`);
        next();

    } catch (error) {
        console.error('❌ Error al verificar membresía: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};