import { crearMembresia, obtenerMembresiaActivaPorUsuario } from "../services/membresias.service.js";

export const registrarMembresia = async (req, res) => {
    try{
        const { usuario_id, fecha_inicio, fecha_vencimiento, metodo_pago, estado = 1 } = req.body;

        await crearMembresia(usuario_id, fecha_inicio, fecha_vencimiento, metodo_pago, estado);
        console.log(`✅ Membresía creada para el usuario ID ${usuario_id}`);

        res.status(201).json({
            mensaje: 'Membresía registrada correctamente'
        })

    }catch (error){
        console.error('❌ Error al registrar membresía:', error);
        res.status(500).json({ error: 'Error interno del servidor'});
    }
};

export const obtenerMembresiaDeUsuario = async (req, res) => {
    try{
        const { usuarioId } = req.params;

        const membresia = await obtenerMembresiaActivaPorUsuario(usuarioId);

        if(!membresia){
            return res.status(200).json({
                activa: false,
                mensaje: 'El usuario no tiene una membresía activa'
            });
        }

        res.status(200).json({
            activa: true,
            fecha_inicio: membresia.fecha_inicio,
            fecha_vencimiento: membresia.fecha_vencimiento,
            metodo_pago: membresia.metodo_pago
        });

    }catch (error){
        console.error('❌ Error al obtener membresía:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};