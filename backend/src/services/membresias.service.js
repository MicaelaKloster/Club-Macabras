import db from '../config/db.js';

export const crearMembresia = async (usuarioId, fechaInicio, fechaVencimiento, metodoPago, estado = 1) => {
    await db.query(
        'INSERT INTO membresias (usuario_id, fecha_inicio, fecha_vencimiento, metodo_pago, estado) VALUES ($1, $2, $3, $4, $5)',
        [usuarioId, fechaInicio, fechaVencimiento, metodoPago, estado]
    );
};

export const obtenerMembresiaActivaPorUsuario = async (usuarioId) => {
    const result = await db.query(
        `SELECT * FROM membresias
        WHERE usuario_id = $1 AND estado = 1 AND fecha_vencimiento >= CURRENT_DATE
        ORDER BY fecha_vencimiento DESC LIMIT 1`,
        [usuarioId]
    );

    return result.rows[0]; // Devuelve undefined si no hay membresía activa
};

export const desactivarMembresiasVencidas = async () => {
    const result = await db.query(
        `UPDATE membresias
        SET estado = 0
        WHERE estado = 1
        AND fecha_vencimiento + INTERVAL '10 days' < CURRENT_DATE`
    );

    console.log(`🔄 Membresías desactivadas automáticamente: ${result.rowCount}`);
};

// Actualizar estado de membresía
export const actualizarEstadoMembresia = async (id, estado) => {
    const result = await db.query(
        'UPDATE membresias SET estado = $1 WHERE id = $2',
        [estado, id]
    );
    return result.rowCount > 0;
};

// Obtener membresía por ID
export const obtenerMembresiaPorId = async (id) => {
    const result = await db.query(
        'SELECT * FROM membresias WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
};