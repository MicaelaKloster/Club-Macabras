import { obtenerMembresiaActivaPorUsuario } from "../services/membresias.service.js";

export const verificarMembresiaActiva = async (req, res, next) => {
    try{
        const usuarioId = req.usuario.id;

        const membresia = await obtenerMembresiaActivaPorUsuario(usuarioId);

        if(!membresia){
            return res.status(403).json({
                mensaje: 'Acceso restringido: se requiere una membresía activa'
            });
        }

        // Si tiene membresía activa, continua
        next();

    }catch (error) {
        console.error('❌ Error al verificar membresía: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};