import { crearInfoExtra, obtenerInfoExtra, actualizarInfoExtra, eliminarInfoExtra, obtenerPrecioMembresia, actualizarPrecioMembresia } from '../services/infoExtra.service.js';

export const crearNuevaInfoExtra = async (req, res) => {
    try {
        const { titulo, descripcion, url } = req.body;

        const id = await crearInfoExtra(titulo, descripcion, url);
        console.log(`✅ Info Extra creada: ${titulo}`);

        res.status(201).json({ 
            mensaje: 'Información extra creada exitosamente',
            id 
        });

    } catch (error) {
        console.error('❌ Error al crear info extra:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const obtenerInfoExtraActual = async (req, res) => {
    try {
        const infoExtra = await obtenerInfoExtra();

        if (!infoExtra) {
            return res.status(404).json({ 
                mensaje: 'No hay información extra configurada' 
            });
        }

        res.status(200).json(infoExtra);

    } catch (error) {
        console.error('❌ Error al obtener info extra:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const editarInfoExtra = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, url } = req.body;

        const actualizada = await actualizarInfoExtra(id, titulo, descripcion, url);

        if (!actualizada) {
            return res.status(404).json({ error: 'Información extra no encontrada' });
        }

        console.log(`✅ Info Extra actualizada: ${titulo}`);
        res.status(200).json({ mensaje: 'Información extra actualizada exitosamente' });

    } catch (error) {
        console.error('❌ Error al actualizar info extra:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const eliminarInfoExtraControlador = async (req, res) => {
    try {
        const { id } = req.params;

        const eliminada = await eliminarInfoExtra(id);

        if (!eliminada) {
            return res.status(404).json({ error: 'Información extra no encontrada' });
        }

        console.log(`✅ Info Extra eliminada: ID ${id}`);
        res.status(200).json({ mensaje: 'Información extra eliminada exitosamente' });

    } catch (error) {
        console.error('❌ Error al eliminar info extra:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Controladores para configuración de precios
export const obtenerConfiguraciones = async (req, res) => {
    try {
        const precioMembresia = await obtenerPrecioMembresia();

        res.status(200).json({
            precio_membresia: precioMembresia
        });

    } catch (error) {
        console.error('❌ Error al obtener configuraciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const actualizarConfiguraciones = async (req, res) => {
    try {
        const { precio_membresia } = req.body;

        if (!precio_membresia || precio_membresia <= 0) {
            return res.status(400).json({ 
                error: 'El precio debe ser un número mayor a 0' 
            });
        }

        const actualizada = await actualizarPrecioMembresia(precio_membresia);

        if (!actualizada) {
            return res.status(500).json({ 
                error: 'No se pudo actualizar el precio' 
            });
        }

        console.log(`✅ Precio de membresía actualizado: $${precio_membresia}`);
        res.status(200).json({ 
            mensaje: 'Precio de membresía actualizado exitosamente',
            nuevo_precio: precio_membresia
        });

    } catch (error) {
        console.error('❌ Error al actualizar precio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const obtenerSoloPrecioMembresia = async (req, res) => {
  try {
    const precio = await obtenerPrecioMembresia();
    res.status(200).json({ precio_membresia: precio });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};