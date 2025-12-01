import { 
    crearMembresia, 
    obtenerMembresiaActivaPorUsuario,
    actualizarEstadoMembresia,
    obtenerMembresiaPorId,
    obtenerMembresiaCompletaPorUsuario,
    obtenerTodasLasMembresias
} from "../services/membresias.service.js";
// import { verificarYActualizarEstadoUsuario } from "../services/usuarios.service.js";
import { enviarCorreoCancelacionMembresia } from '../utils/mailer.js';

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

// ✅ VERSIÓN CORRECTA - Crear membresía manual
export const crearMembresiaManual = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_inicio, fecha_vencimiento, metodo_pago } = req.body;
        
        console.log(`📝 Creando membresía para usuario ID: ${id}`);
        
        // ✅ SOLO crear membresía, NO tocar estado del usuario
        await crearMembresia(parseInt(id), fecha_inicio, fecha_vencimiento, metodo_pago, 1);
        
        console.log(`✅ Membresía creada exitosamente`);
        
        res.json({
            mensaje: 'Membresía creada exitosamente',
            usuario_id: parseInt(id),
            fecha_inicio: fecha_inicio,
            fecha_vencimiento: fecha_vencimiento,
            nota: 'El usuario ahora puede acceder a videos premium'
        });
        
    } catch (error) {
        console.error('Error al crear membresía manual:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const cambiarEstadoMembresiaAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        console.log(`📝 Cambiando estado de membresía ${id} a ${estado}`);
        
        if (estado !== 0 && estado !== 1) {
            return res.status(400).json({
                error: 'El estado debe ser 0 (inactivo) o 1 (activo)'
            });
        }
        
        // ✅ NUEVO: Si está activando, extender la fecha automáticamente
        if (estado === 1) {
            // Obtener la membresía actual
            const membresia = await obtenerMembresiaPorId(parseInt(id));
            
            if (!membresia) {
                return res.status(404).json({ error: 'Membresía no encontrada' });
            }
            
            // Verificar si está vencida
            const fechaVencimiento = new Date(membresia.fecha_vencimiento);
            const hoy = new Date();
            const estaVencida = fechaVencimiento < hoy;
            
            if (estaVencida) {
                console.log(`⚠️ Membresía ${id} estaba vencida, extendiendo fecha...`);
                
                // Extender 30 días desde HOY
                const nuevaFecha = new Date();
                nuevaFecha.setDate(nuevaFecha.getDate() + 30);
                const nuevaFechaISO = nuevaFecha.toISOString().split('T')[0];
                
                await db.query(
                    'UPDATE membresias SET estado = $1, fecha_vencimiento = $2 WHERE id = $3',
                    [1, nuevaFechaISO, parseInt(id)]
                );
                
                console.log(`✅ Membresía ${id} activada y extendida hasta ${nuevaFechaISO}`);
                
                return res.json({
                    mensaje: 'Membresía activada y extendida exitosamente',
                    membresia_id: parseInt(id),
                    nuevo_estado: 1,
                    fecha_vencimiento: nuevaFechaISO,
                    nota: '✅ El usuario puede acceder a videos premium por 30 días más'
                });
            }
        }
        
        // Si no estaba vencida, solo cambiar estado
        const actualizado = await actualizarEstadoMembresia(parseInt(id), estado);
        
        if (!actualizado) {
            return res.status(404).json({ error: 'Membresía no encontrada' });
        }
        
        console.log(`✅ Estado de membresía ${id} cambiado a ${estado === 1 ? 'activa' : 'inactiva'}`);
        
        res.json({
            mensaje: `Membresía ${estado === 1 ? 'activada' : 'desactivada'} exitosamente`,
            membresia_id: parseInt(id),
            nuevo_estado: estado
        });
        
    } catch (error) {
        console.error('❌ Error al cambiar estado de membresía:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Cancelación de membresía
export const cancelarMiMembresia = async (req, res) => {
    try {
        const usuarioId = req.usuario.id; // Viene del middleware verificarToken
        
        // Obtener la membresía activa del usuario
        const membresia = await obtenerMembresiaCompletaPorUsuario(usuarioId);
        
        if (!membresia) {
            return res.status(404).json({ 
                error: 'No tienes una membresía activa para cancelar' 
            });
        }
        
        // Cancelar la membresía (cambiar estado a 0)
        const cancelada = await actualizarEstadoMembresia(membresia.id, 0);
        
        if (!cancelada) {
            return res.status(500).json({ 
                error: 'No se pudo cancelar la membresía' 
            });
        }
        
        // Enviar email de confirmación de cancelación
        await enviarCorreoCancelacionMembresia(req.usuario.email, req.usuario.nombre);
        
        console.log(`🚫 Usuario ${usuarioId} canceló su membresía`);
        
        res.json({
            mensaje: 'Membresía cancelada exitosamente',
            fecha_cancelacion: new Date().toISOString(),
            membresia_cancelada: {
                id: membresia.id,
                fecha_vencimiento_original: membresia.fecha_vencimiento
            }
        });
        
    } catch (error) {
        console.error('Error al cancelar membresía:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
};

export const listarTodasLasMembresias = async (req, res) => {
  try {
    const membresias = await obtenerTodasLasMembresias();
    res.status(200).json(membresias);
  } catch (error) {
    console.error('Error al obtener membresías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
