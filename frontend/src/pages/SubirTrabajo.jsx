import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SubirTrabajo = () => {
    const { cursoId } = useParams();
    const navigate = useNavigate();
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    const [descripcion, setDescripcion] = useState("");
    const [error, setError] = useState("");
    const [subiendo, setSubiendo] = useState(false);

    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        setImagen(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubiendo(true);

        const token = localStorage.getItem("token");

        try{
            const formData = new FormData();
            formData.append("imagen", imagen);
            formData.append("descripcion", descripcion);
            formData.append("curso_id", cursoId);

            await axios.post(`${import.meta.env.VITE_API_URL}/trabajos`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate(`/cursos/${cursoId}/trabajos`);
        
        }catch (err) {
            console.error("❌ Error al subir trabajo:", err);
            setError("Error al subir el trabajo. Inténtalo de nuevo.");
        }finally{
            setSubiendo(false);
        }
    };

     return (
    <div className="max-w-xl mx-auto p-6 border rounded shadow bg-white space-y-6">
      <h2 className="text-2xl font-bold text-pink-800">Subir nuevo trabajo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
            required
          />
          {preview && (
            <img
              src={preview}
              alt="Previsualización"
              className="mt-2 w-full max-w-xs rounded"
            />
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={4}
            required
          ></textarea>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={subiendo}
          className="bg-pink-700 text-white px-6 py-2 rounded hover:bg-pink-800 disabled:opacity-50"
        >
          {subiendo ? "Subiendo..." : "Publicar trabajo"}
        </button>
      </form>
    </div>
  );
};

export default SubirTrabajo;