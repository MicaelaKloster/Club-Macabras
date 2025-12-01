import db from '../config/db.js';

// Obtiene todos los usuarios de la base de datos
export const obtenerTodosLosUsuarios = async () => {
  const result = await db.query(
    'SELECT id, nombre, email, provincia, ciudad, rol, estado FROM usuarios'
  );
  return result.rows;
};

// Busca usuarios en la base de datos por email
export const buscarUsuariosPorEmail = async (email) => {
    // Realiza una consulta SQL para buscar usuarios con el email proporcionado
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    // Retorna los usuarios encontrados (puede ser un array vacío si no hay coincidencias)
    return result.rows;
};

// Busca un usuario específico por ID
export const buscarUsuarioPorId = async (id) => {
    const result = await db.query(
        'SELECT id, nombre, email, provincia, ciudad, rol, estado FROM usuarios WHERE id = $1', 
        [id]
    );
    // Retorna el primer usuario encontrado o null si no existe
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Inserta un nuevo usuario en la base de datos
export const insertarUsuario = async ({nombre, email, contraseña, provincia, ciudad, rol}) => {
    // Ejecuta una consulta SQL para insertar un nuevo usuario con los datos proporcionados
    await db.query(
        'INSERT INTO usuarios (nombre, email, contraseña, provincia, ciudad, rol, estado) VALUES ($1, $2, $3, $4, $5, $6, 1)',
        [nombre, email, contraseña, provincia, ciudad, rol || 'usuario']
    );
};

// Actualiza el rol de un usuario específico
export const actualizarRolUsuario = async (id, nuevoRol) => {
    const result = await db.query(
        'UPDATE usuarios SET rol = $1 WHERE id = $2',
        [nuevoRol, id]
    );
    
    // Verificar si se actualizó algún registro
    if (result.rowCount === 0) {
        throw new Error('Usuario no encontrado o no se pudo actualizar');
    }
    
    return result;
};

// Cambiar estado del usuario (SOLO para admin)
export const actualizarEstadoUsuario = async (id, estado) => {
    const result = await db.query(
        'UPDATE usuarios SET estado = $1 WHERE id = $2',
        [estado, id]
    );
    return result.rowCount > 0;
};

// Obtener datos básicos del usuario (opcional)
export const obtenerDatosBasicosUsuario = async (id) => {
    const result = await db.query(
        'SELECT id, nombre, email, rol, estado FROM usuarios WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
};

// NUEVAS FUNCIONES PARA SINCRONIZACIÓN CON MEMBRESÍAS

// Verificar si un usuario tiene membresía activa
export const verificarMembresiaActiva = async (usuarioId) => {
    const result = await db.query(
        `SELECT id FROM membresias 
         WHERE usuario_id = $1 AND estado = 1 AND fecha_vencimiento >= CURRENT_DATE
         LIMIT 1`,
        [usuarioId]
    );
    return result.rows.length > 0;
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
        const result = await db.query(`
            UPDATE usuarios 
            SET estado = CASE 
                WHEN usuarios.rol = 'admin' THEN usuarios.estado -- Mantener estado actual de admins
                WHEN membresias.id IS NOT NULL THEN 1        -- Usuario con membresía activa
                ELSE 0                                       -- Usuario sin membresía activa
            END
            FROM (
                SELECT DISTINCT usuario_id, id 
                FROM membresias 
                WHERE estado = 1 AND fecha_vencimiento >= CURRENT_DATE
            ) AS membresias
            WHERE usuarios.id = membresias.usuario_id OR usuarios.rol = 'usuario'
        `);
        
        console.log(`🔄 Sincronización masiva completada: ${result.rowCount} usuarios actualizados`);
        return result.rowCount;
    } catch (error) {
        console.error('❌ Error en sincronización masiva:', error);
        throw error;
    }
};

// Obtener usuarios con estados desactualizados (para debugging)
export const obtenerUsuariosDesactualizados = async () => {
    const result = await db.query(`
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
            AND m.fecha_vencimiento >= CURRENT_DATE
        WHERE u.rol = 'usuario'
        AND u.estado != CASE 
            WHEN m.id IS NOT NULL THEN 1 
            ELSE 0 
        END
    `);
    
    return result.rows;
};

// Obtener info de membresía (solo lectura)
export const obtenerInfoMembresia = async (usuarioId) => {
    const result = await db.query(
        `SELECT 
            id,
            usuario_id,
            estado,
            fecha_inicio,
            fecha_vencimiento
         FROM membresias 
         WHERE usuario_id = $1 
         ORDER BY fecha_vencimiento DESC 
         LIMIT 1`,
        [usuarioId]
    );
    return result.rows[0] || null;
};