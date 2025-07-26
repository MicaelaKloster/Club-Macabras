import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminMateriales = () => {
  const { cursoId } = useParams();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerMateriales = async () => {
      const token = localStorage.getItem('token');

      try {
        // Obtener videos
        const resVideos = await axios.get(
          `${import.meta.env.VITE_API_URL}/videos/${cursoId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setVideos(resVideos.data.videos || resVideos.data || []);

        // Obtener documentos
        const resDocs = await axios.get(
          `${import.meta.env.VITE_API_URL}/documentos/${cursoId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDocumentos(resDocs.data.documentos || resDocs.data || []);

      } catch (error) {
        console.error('❌ Error al obtener materiales: ', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerMateriales();
  }, [cursoId]);

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-pink-800">📂 Gestión de Materiales</h2>
        <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
        >
            ← Volver
        </button>
      {/* Sección de Videos */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-pink-700">🎥 Videos del curso</h3>
          <button
            onClick={() => navigate(`/admin/materiales/${cursoId}/video/nuevo`)}
            className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700"
          >
            ➕ Agregar video
          </button>
        </div>

        {loading ? (
          <p>Cargando videos...</p>
        ) : videos.length === 0 ? (
          <p className="text-gray-600">No hay videos cargados.</p>
        ) : (
          <ul className="space-y-4">
            {videos.map((video) => (
              <li key={video.id} className="border p-4 rounded shadow bg-white">
                <h4 className="text-lg font-semibold text-pink-700">{video.titulo}</h4>
                <p className="text-sm text-gray-600">
                  Tipo: {video.es_gratuito ? 'Gratuito' : 'Requiere membresía'}
                </p>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:underline"
                >
                  Ver video
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Sección de Documentos */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-pink-700">📄 Documentos del curso</h3>
          <button
            onClick={() => navigate(`/admin/materiales/${cursoId}/documento/nuevo`)}
            className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700"
          >
            ➕ Agregar documento
          </button>
        </div>

        {loading ? (
          <p>Cargando documentos...</p>
        ) : documentos.length === 0 ? (
          <p className="text-gray-600">No hay documentos cargados.</p>
        ) : (
          <ul className="space-y-4">
            {documentos.map((doc) => (
              <li key={doc.id} className="border p-4 rounded shadow bg-white">
                <h4 className="text-lg font-semibold text-pink-700">{doc.titulo}</h4>
                <p className="text-sm text-gray-600">Tipo: {doc.tipo}</p>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:underline"
                >
                  Ver documento
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminMateriales;