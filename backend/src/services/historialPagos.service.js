import db from '../config/db.js';

// Registrar un nuevo pago en el historial
export const registrarPagoEnHistorial = async ({
    usuario_id,
    monto,
    metodo_pago,
    estado,
    payment_id,
    preference_id,
    descripcion = 'Membresía Club Macabras'
}) => {
    const result = await db.query(`
        INSERT INTO historial_pagos 
        (usuario_id, monto, metodo_pago, estado, payment_id, preference_id, descripcion)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `, [usuario_id, monto, metodo_pago, estado, payment_id, preference_id, descripcion]);
    
    return result.rows[0];
};

// Obtener historial de pagos de un usuario
export const obtenerHistorialPagosUsuario = async (usuario_id, limite = 10) => {
    const result = await db.query(`
        SELECT * FROM historial_pagos 
        WHERE usuario_id = $1 
        ORDER BY fecha_pago DESC 
        LIMIT $2
    `, [usuario_id, limite]);
    
    return result.rows;
};

// Obtener todos los pagos (para admin)
export const obtenerTodosLosPagos = async (limite = 50, offset = 0) => {
    const result = await db.query(`
        SELECT 
            hp.*,
            u.nombre as nombre_usuario,
            u.email as email_usuario
        FROM historial_pagos hp
        JOIN usuarios u ON hp.usuario_id = u.id
        ORDER BY hp.fecha_pago DESC
        LIMIT $1 OFFSET $2
    `, [limite, offset]);
    
    return result.rows;
};

// Obtener estadísticas de pagos
export const obtenerEstadisticasPagos = async () => {
    const result = await db.query(`
        SELECT 
            COUNT(*) as total_pagos,
            SUM(monto) as ingresos_totales,
            COUNT(*) FILTER (WHERE estado = 'approved') as pagos_aprobados,
            COUNT(*) FILTER (WHERE estado = 'rejected') as pagos_rechazados,
            COUNT(*) FILTER (WHERE DATE(fecha_pago) = CURRENT_DATE) as pagos_hoy,
            SUM(monto) FILTER (WHERE DATE(fecha_pago) >= DATE_TRUNC('month', CURRENT_DATE)) as ingresos_mes_actual
        FROM historial_pagos
    `);
    
    return result.rows[0];
};

// Obtener pago por payment_id
export const obtenerPagoPorPaymentId = async (payment_id) => {
    const result = await db.query(
        'SELECT * FROM historial_pagos WHERE payment_id = $1 LIMIT 1',
        [payment_id]
    );
    
    return result.rows[0] || null;
};