import db from '../config/db.js';

// Obtiene todos los usuarios de la base de datos
export const obtenerTodosLosUsuarios = async () => {
  const [rows] = await db.promise().query(
    'SELECT id, nombre, email, provincia, ciudad, rol, estado FROM usuarios'
  );
  return rows;
};

// Busca usuarios en la base de datos por email
export const buscarUsuariosPorEmail = async (email) => {
    // Realiza una consulta SQL para buscar usuarios con el email proporcionado
    const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
    // Retorna los usuarios encontrados (puede ser un array vacío si no hay coincidencias)
    return rows;
};

// Busca un usuario específico por ID
export const buscarUsuarioPorId = async (id) => {
    const [rows] = await db.promise().query(
        'SELECT id, nombre, email, provincia, ciudad, rol, estado FROM usuarios WHERE id = ?', 
        [id]
    );
    // Retorna el primer usuario encontrado o null si no existe
    return rows.length > 0 ? rows[0] : null;
};

// Inserta un nuevo usuario en la base de datos
export const insertarUsuario = async ({nombre, email, contraseña, provincia, ciudad, rol}) => {
    // Ejecuta una consulta SQL para insertar un nuevo usuario con los datos proporcionados
    await db.promise().query(
        'INSERT INTO usuarios (nombre, email, contraseña, provincia, ciudad, rol, estado) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [nombre, email, contraseña, provincia, ciudad, rol || 'usuario']
    );
};

// Actualiza el rol de un usuario específico
export const actualizarRolUsuario = async (id, nuevoRol) => {
    const [result] = await db.promise().query(
        'UPDATE usuarios SET rol = ? WHERE id = ?',
        [nuevoRol, id]
    );
    
    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
        throw new Error('Usuario no encontrado o no se pudo actualizar');
    }
    
    return result;
};

// Cambiar estado del usuario
export const actualizarEstadoUsuario = async (id, estado) => {
    const [result] = await db.execute(
        'UPDATE usuarios SET estado = ? WHERE id = ?',
        [estado, id]
    );
    return result.affectedRows > 0;
};

// Obtener datos básicos del usuario (opcional)
export const obtenerDatosBasicosUsuario = async (id) => {
    const [rows] = await db.execute(
        'SELECT id, nombre, email, rol, estado FROM usuarios WHERE id = ?',
        [id]
    );
    return rows[0] || null;
};

// NUEVAS FUNCIONES PARA SINCRONIZACIÓN CON MEMBRESÍAS

// Verificar si un usuario tiene membresía activa
export const verificarMembresiaActiva = async (usuarioId) => {
    const [rows] = await db.promise().query(
        `SELECT id FROM membresias 
         WHERE usuario_id = ? AND estado = 1 AND fecha_vencimiento >= CURDATE()
         LIMIT 1`,
        [usuarioId]
    );
    return rows.length > 0;
};

// Verificar y actualizar estado de usuario basado en membresía
export const verificarYActualizarEstadoUsuario = async (usuarioId) => {
    try {
        // Solo verificar usuarios con rol 'usuario', no admins
        const usuario = await buscarUsuarioPorId(usuarioId);
        if (!usuario || usuario.rol === 'admin') {
            return usuario ? usuario.estado : null;
        }

        // Verificar si tiene membresía activa
        const tieneMembresiaActiva = await verificarMembresiaActiva(usuarioId);
        
        // Determinar el nuevo estado: 1 si tiene membresía activa, 0 si no
        const nuevoEstado = tieneMembresiaActiva ? 1 : 0;
        
        // Solo actualizar si el estado cambió
        if (usuario.estado !== nuevoEstado) {
            await actualizarEstadoUsuario(usuarioId, nuevoEstado);
            console.log(`🔄 Estado actualizado para usuario ID ${usuarioId}: ${nuevoEstado === 1 ? 'Activo' : 'Inactivo'} (basado en membresía)`);
        }
        
        return nuevoEstado;
    } catch (error) {
        console.error(`❌ Error al verificar estado del usuario ${usuarioId}:`, error);
        throw error;
    }
};

// Sincronizar todos los estados de usuarios con sus membresías
export const sincronizarTodosLosEstadosConMembresias = async () => {
    try {
        // Actualizar todos los usuarios (excepto admins) basándose en sus membresías
        const [result] = await db.promise().query(`
            UPDATE usuarios u 
            LEFT JOIN membresias m ON u.id = m.usuario_id 
                AND m.estado = 1 
                AND m.fecha_vencimiento >= CURDATE()
            SET u.estado = CASE 
                WHEN u.rol = 'admin' THEN u.estado -- Mantener estado actual de admins
                WHEN m.id IS NOT NULL THEN 1        -- Usuario con membresía activa
                ELSE 0                              -- Usuario sin membresía activa
            END
            WHERE u.rol = 'usuario'
        `);
        
        console.log(`🔄 Sincronización masiva completada: ${result.affectedRows} usuarios actualizados`);
        return result.affectedRows;
    } catch (error) {
        console.error('❌ Error en sincronización masiva:', error);
        throw error;
    }
};

// Obtener usuarios con estados desactualizados (para debugging)
export const obtenerUsuariosDesactualizados = async () => {
    const [rows] = await db.promise().query(`
        SELECT 
            u.id, 
            u.nombre, 
            u.email, 
            u.estado as estado_usuario,
            CASE 
                WHEN m.id IS NOT NULL THEN 1 
                ELSE 0 
            END as estado_membresia,
            m.fecha_vencimiento
        FROM usuarios u
        LEFT JOIN membresias m ON u.id = m.usuario_id 
            AND m.estado = 1 
            AND m.fecha_vencimiento >= CURDATE()
        WHERE u.rol = 'usuario'
        AND u.estado != CASE 
            WHEN m.id IS NOT NULL THEN 1 
            ELSE 0 
        END
    `);
    
    return rows;
};