import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CursoDetalle = () => {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMateriales = async () => {
      const token = localStorage.getItem("token");

      try {
        const [resVideos, resDocs] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/cursos/${id}/videos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/cursos/${id}/documentos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setVideos(resVideos.data.videos);
        setDocumentos(resDocs.data.documentos);
      } catch (error) {
        console.error("❌ Error al cargar materiales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMateriales();
  }, [id]);

  if (loading) return <p className="text-center">Cargando materiales...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pink-800">Videos</h2>
      <ul className="space-y-3">
        {videos.map((video) => (
          <li key={video.id} className="border p-4 rounded shadow">
            <h3 className="font-semibold text-pink-700">{video.titulo}</h3>
            {video.es_gratuito ? (
              <a href={video.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                Ver video
              </a>
            ) : (
              <p className="text-gray-500 italic">Contenido exclusivo para miembros</p>
            )}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-pink-800">Documentos</h2>
      <ul className="space-y-3">
        {documentos.map((doc) => (
          <li key={doc.id} className="border p-4 rounded shadow">
            <h3 className="font-semibold text-pink-700">{doc.titulo}</h3>
            <a href={doc.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              Ver documento ({doc.tipo})
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CursoDetalle;