import { crearCurso, obtenerCursosPaginados, obtenerMaterialesDelCurso, buscarCursoPorId } from "../services/cursos.service.js";

export const crearNuevoCurso = async (req, res) => {
    try{
        const { titulo, descripcion, categoria } = req.body;

        await crearCurso(titulo, descripcion, categoria);
        console.log(`✅ Curso creado: ${titulo}`);

        res.status(201).json({ mensaje: 'Curso creado exitosamente', titulo });
    }catch (error) {
        console.error('❌ Error al crear curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

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