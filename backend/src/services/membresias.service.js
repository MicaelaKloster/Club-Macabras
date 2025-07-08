import db from '../config/db.js';

export const crearMembresia = async (usuarioId, fechaInicio, fechaVencimiento, metodoPago, estado = 1) => {
    await db.promise().query(
        'INSERT INTO membresias (usuario_id, fecha_inicio, fecha_vencimiento, metodo_pago, estado) VALUES (?,?,?,?,?)',
        [usuarioId, fechaInicio, fechaVencimiento, metodoPago, estado]
    );
};

export const obtenerMembresiaActivaPorUsuario = async (usuarioId) => {
    const [rows] = await db.promise().query(
        `SELECT * FROM membresias
        WHERE usuario_id = ? AND estado = 1 AND fecha_vencimiento >= CURDATE()
        ORDER BY fecha_vencimiento DESC LIMIT 1`,
        [usuarioId]
    );

    return rows[0]; // Devuelve undefined si no hay membresía activa
};