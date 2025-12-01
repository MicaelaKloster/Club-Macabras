import bcrypt from 'bcrypt';
import {
  obtenerTodosLosUsuarios,
  buscarUsuariosPorEmail,
  insertarUsuario,
  buscarUsuarioPorId,
  actualizarRolUsuario,
  actualizarEstadoUsuario,
  verificarYActualizarEstadoUsuario,
  sincronizarTodosLosEstadosConMembresias,
  obtenerUsuariosDesactualizados
} from '../services/usuarios.service.js';
import { enviarCorreoBienvenida } from '../utils/mailer.js';

// Controlador para registrar un nuevo usuario
export const registrarUsuario = async (req, res) => {
  try {
    // Extrae los datos enviados en el cuerpo de la petición
    const { nombre, email, contraseña, provincia, ciudad, rol } = req.body;

    // Verifica que todos los campos obligatorios estén presentes
    if (!nombre || !email || !contraseña || !provincia || !ciudad) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Busca si ya existe un usuario registrado con el mismo email
    const existente = await buscarUsuariosPorEmail(email);
    if (existente.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }
  
    // Si intenta crear un admin, verificar que quien hace la petición sea admin
    if (rol === 'admin') {
      if (!req.usuario || req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Solo un administrador puede crear otros administradores' });
      }
    }

    // Genera un salt y hashea la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const contraseñaHasheada = await bcrypt.hash(contraseña, salt);

    // Inserta el nuevo usuario en la base de datos
    await insertarUsuario({ nombre, email, contraseña: contraseñaHasheada, provincia, ciudad,  rol: rol || 'usuario' });
   
    // Envía un correo de bienvenida al nuevo usuario
    await enviarCorreoBienvenida(email, nombre);

    // Muestra en consola que el usuario fue registrado correctamente
    console.log(`✅ Usuario registrado: ${email} - Rol: ${rol || 'usuario'}`);
    // Responde con éxito al cliente
    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });

  } catch (error) {
    // Maneja cualquier error inesperado y responde con error de servidor
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador mejorado para listar usuarios (con sincronización automática)
export const listarUsuarios = async (req, res) => {
  try {
    // NUEVO: Sincronizar estados antes de obtener la lista
    // await sincronizarTodosLosEstadosConMembresias();
    
    // Obtener usuarios actualizados
    const usuarios = await obtenerTodosLosUsuarios();
    
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para cambiar el rol de un usuario
export const cambiarRolUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    // Verificar que el ID sea un número válido
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    // Verificar que el rol sea válido
    if (!rol || !['admin', 'usuario'].includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido. Debe ser "admin" o "usuario"' });
    }

    // Verificar que el usuario existe
    const usuarioExistente = await buscarUsuarioPorId(id);
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar que no se está intentando cambiar el propio rol
    if (req.usuario.id == id) {
      return res.status(400).json({ error: 'No puedes cambiar tu propio rol' });
    }

    // Verificar que el rol actual sea diferente al nuevo rol
    if (usuarioExistente.rol === rol) {
      return res.status(400).json({ error: `El usuario ya tiene el rol "${rol}"` });
    }

    // Actualizar el rol en la base de datos
    await actualizarRolUsuario(id, rol);

    // NUEVO: Si se cambia a usuario, verificar su estado basado en membresía
    // if (rol === 'usuario') {
    //   await verificarYActualizarEstadoUsuario(id);
    // }

    // Log del cambio
    console.log(`✅ Rol actualizado - Usuario ID: ${id} | Nuevo rol: ${rol} | Cambiado por: ${req.usuario.email}`);

    // Responder con éxito
    res.status(200).json({ 
      mensaje: 'Rol actualizado con éxito',
      usuario: {
        id: parseInt(id),
        rol: rol
      }
    });

  } catch (error) {
    console.error('❌ Error al cambiar rol de usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ✅ VERSIÓN CORRECTA (sin verificar membresía)
export const cambiarEstadoUsuario = async (req, res) => {
    try {
        console.log('=== DEBUG CAMBIAR ESTADO ===');
        console.log('Params:', req.params);
        console.log('Body:', req.body);
        
        const { id } = req.params;
        const { estado } = req.body;

        if (estado !== 0 && estado !== 1) {
            return res.status(400).json({
                error: 'El estado debe ser 0 (inactivo) o 1 (activo)'
            });
        }

        const usuario = await buscarUsuarioPorId(id);
        
        if (!usuario) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }
        
        // ✅ SOLO cambiar el estado, SIN verificar membresía
        const actualizado = await actualizarEstadoUsuario(id, estado);

        if (!actualizado) {
            return res.status(500).json({
                error: 'No se pudo actualizar el estado del usuario'
            });
        }

        console.log(`✅ Usuario ${id} ${estado === 1 ? 'activado' : 'desactivado'}`);

        res.json({
            mensaje: `Usuario ${estado === 1 ? 'activado' : 'desactivado'} exitosamente`,
            usuario_id: parseInt(id),
            nuevo_estado: estado
        });

    } catch (error) {
        console.error('Error al cambiar estado del usuario:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};