import { crearCurso, obtenerCursosPaginados } from "../services/cursos.service.js";

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