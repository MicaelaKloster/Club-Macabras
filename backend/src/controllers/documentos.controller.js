import { agregarDocumentoACurso, obtenerDocumentosDeCurso } from "../services/documentos.service.js";

export const crearNuevoDocumento = async (req, res) => {
    try{
        const { curso_id, titulo, url, tipo } = req.body;

        await agregarDocumentoACurso(curso_id, titulo, url, tipo || null);
        console.log(`✅ Documento agregado al curso ${curso_id}: ${titulo}`);

        res.status(201).json({ mensaje: 'Documento agregado correctamente' });

    }catch (error){
        console.error('❌ Error al agregar documento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const listarDocumentosPorCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const documentos = await obtenerDocumentosDeCurso(cursoId);
    res.status(200).json({ documentos });
  } catch (error) {
    console.error("❌ Error al obtener documentos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};