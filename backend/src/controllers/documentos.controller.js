import { agregarDocumentoACurso } from "../services/documentos.service.js";

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