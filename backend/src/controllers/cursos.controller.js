import { crearCurso, obtenerCursosPaginados, obtenerMaterialesDelCurso, buscarCursoPorId, actualizarCurso, eliminarCursoLogico } from "../services/cursos.service.js";

// Función para crear nuevo curso
export const crearNuevoCurso = async (req, res) => {
    try{
        const { titulo, descripcion, categoria, imagen_portada } = req.body;

        await crearCurso(titulo, descripcion, categoria, imagen_portada);
        console.log(`✅ Curso creado: ${titulo}`);

        res.status(201).json({ mensaje: 'Curso creado exitosamente', titulo });
    }catch (error) {
        console.error('❌ Error al crear curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Función para listar cursos con paginación
export const listarCursos = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { cursos, total } = await obtenerCursosPaginados(limit, offset);

        const totalPaginas = Math.ceil(total / limit);

        res.status(200).json({
            total,
            paginaActual: page,
            totalPaginas,
            cursos
        });

    }catch (error) {
        console.error('❌ Error al listar cursos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Función para listar materiales de un curso
export const listarMaterialesDelCurso = async (req, res) => {
    try {
        const cursoId = req.params.id;

        const { videos, documentos } = await obtenerMaterialesDelCurso(cursoId);

        res.status(200).json({
            cursoId: cursoId,
            videos,
            documentos
        });

    }catch (error){
        console.error('❌ Error al listar materiales:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Función para obtener curso por id
export const obtenerCursoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const curso = await buscarCursoPorId(id);

    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.status(200).json(curso);
  } catch (error) {
    console.error('❌ Error al obtener curso por ID: ', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para actualizar curso
export const editarCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, categoria, imagen_portada } = req.body;

        // Debug: verifica qué datos llegan
        console.log('Datos recibidos para edición:', {
            id, titulo, descripcion, categoria, imagen_portada
        });

        const actualizado = await actualizarCurso(id, titulo, descripcion, categoria, imagen_portada);

        if (!actualizado) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        console.log(`✅ Curso actualizado: ${titulo}`);
        res.status(200).json({ mensaje: 'Curso actualizado exitosamente' });

    } catch (error) {
        console.error('❌ Error al actualizar curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Función para eliminar curso (lógico)
export const eliminarCurso = async (req, res) => {
    try {
        const { id } = req.params;

        const eliminado = await eliminarCursoLogico(id);

        if (!eliminado) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        console.log(`🗑️ Curso eliminado (lógico): ID ${id}`);
        res.status(200).json({ mensaje: 'Curso eliminado exitosamente' });

    } catch (error) {
        console.error('❌ Error al eliminar curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};