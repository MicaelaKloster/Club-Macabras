import {
    obtenerHistorialPagosUsuario,
    obtenerTodosLosPagos,
    obtenerEstadisticasPagos
} from '../services/historialPagos.service.js';

// Obtener historial del usuario autenticado
export const obtenerMiHistorialPagos = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;
        const limite = parseInt(req.query.limite) || 10;
        
        const historial = await obtenerHistorialPagosUsuario(usuario_id, limite);
        
        res.json({
            historial,
            total: historial.length
        });
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener todos los pagos (solo admin)
export const obtenerTodoElHistorial = async (req, res) => {
    try {
        const limite = parseInt(req.query.limite) || 50;
        const pagina = parseInt(req.query.pagina) || 1;
        const offset = (pagina - 1) * limite;
        
        const pagos = await obtenerTodosLosPagos(limite, offset);
        const estadisticas = await obtenerEstadisticasPagos();
        
        res.json({
            pagos,
            estadisticas,
            pagina,
            limite
        });
    } catch (error) {
        console.error('Error al obtener historial completo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};