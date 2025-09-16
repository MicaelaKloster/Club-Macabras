import { 
    crearMembresia, 
    obtenerMembresiaActivaPorUsuario,
    actualizarEstadoMembresia,
    obtenerMembresiaPorId
} from "../services/membresias.service.js";
import { verificarYActualizarEstadoUsuario } from "../services/usuarios.service.js";

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

// Nuevo: Obtener membresía para admin (formato específico para la tabla)
export const obtenerMembresiaUsuarioAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        
        const membresia = await obtenerMembresiaActivaPorUsuario(parseInt(id));
        
        if (!membresia) {
            return res.json(null);
        }
        
        res.json(membresia);
    } catch (error) {
        console.error('Error al obtener membresía:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Nuevo: Crear membresía manual desde admin
export const crearMembresiaManual = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_inicio, fecha_vencimiento, metodo_pago } = req.body;
        
        await crearMembresia(parseInt(id), fecha_inicio, fecha_vencimiento, metodo_pago, 1);
        
        // Actualizar automáticamente el estado del usuario
        await verificarYActualizarEstadoUsuario(parseInt(id));
        
        console.log(`✅ Membresía manual creada para usuario ID ${id}`);
        
        res.json({
            mensaje: 'Membresía creada exitosamente',
            usuario_id: parseInt(id)
        });
    } catch (error) {
        console.error('Error al crear membresía manual:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Nuevo: Cambiar estado de membresía
export const cambiarEstadoMembresiaAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        // Validar que el estado sea 0 o 1
        if (estado !== 0 && estado !== 1) {
            return res.status(400).json({
                error: 'El estado debe ser 0 (inactivo) o 1 (activo)'
            });
        }
        
        const actualizado = await actualizarEstadoMembresia(parseInt(id), estado);
        
        if (!actualizado) {
            return res.status(404).json({ error: 'Membresía no encontrada' });
        }
        
        console.log(`✅ Estado de membresía ${id} cambiado a ${estado === 1 ? 'activa' : 'inactiva'}`);
        
        res.json({
            mensaje: `Membresía ${estado === 1 ? 'activada' : 'desactivada'} exitosamente`,
            membresia_id: parseInt(id)
        });
    } catch (error) {
        console.error('Error al cambiar estado de membresía:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};