import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const CursoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [videos, setVideos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membresiaActiva, setMembresiaActiva] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchMateriales = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/cursos/${id}/materiales`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setVideos(res.data.videos || []);
        setDocumentos(res.data.documentos || []);
      } catch (error) {
        console.error("❌ Error al cargar materiales:", error.response?.data || error.message);
        setVideos([]);      // Evita el "cursos.map is not a function"
        setDocumentos([]); 
      } finally {
        setLoading(false);
      }
    };

    const verificarMembresia = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/membresias/${usuario.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMembresiaActiva(res.data.activa);

      } catch (error) {
        console.error("❌ Error al verificar membresía:", error);
        setMembresiaActiva(false);
      }
    };

    if (usuario) {
      fetchMateriales();
      verificarMembresia();
    }
  }, [id, usuario]);

  if (loading) return <p className="text-center">Cargando materiales...</p>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/cursos")}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
      >
        ← Volver a cursos
      </button>

      <div className="text-sm text-gray-700">
        {membresiaActiva ? (
          <p className="text-green-600">✅ Tenés una membresía activa</p>
        ) : (
          <p className="text-red-500">❌ No tenés una membresía activa</p>
        )}
      </div>

      {membresiaActiva && (
        <button
          className="bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-800"
          onClick={() => alert("¡Curso comenzado!")}
        >
          Comenzar curso
        </button>
      )}

      <h2 className="text-2xl font-bold text-pink-800">Videos</h2>
      <ul className="space-y-3">
        {videos.map((video) => {
          const obtenerUrlEmbed = (url) => {
            const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/;
            const match = url.match(regex);
            return match ? `https://www.youtube.com/embed/${match[1]}` : null;
          };

          const urlEmbed = obtenerUrlEmbed(video.url);

          return (
            <li key={video.id} className="border p-4 rounded shadow space-y-2">
              <h3 className="font-semibold text-pink-700">{video.titulo}</h3>
              {video.es_gratuito || membresiaActiva ? (
                urlEmbed ? (
                  <div className="aspect-video">
                    <iframe
                      src={urlEmbed}
                      title={video.titulo}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded"
                    />
                  </div>
                ) : (
                  <p className="text-red-500">❌ URL de video no válida</p>
                )
              ) : (
                <p className="text-gray-500 italic">
                  Contenido exclusivo para miembros
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <h2 className="text-2xl font-bold text-pink-800">Documentos</h2>
      <ul className="space-y-3">
        {documentos.map((doc) => (
          <li key={doc.id} className="border p-4 rounded shadow">
            <h3 className="font-semibold text-pink-700">{doc.titulo}</h3>
            <a
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="text-pink-600 underline"
            >
              Ver documento ({doc.tipo})
            </a>
          </li>
        ))}
      </ul>

      <Link
        to={`/cursos/${id}/trabajos`}
        className="inline-block mt-4 text-sm text-pink-600 hover:underline"
      >
        Ver trabajos del curso
      </Link>
    </div>
  );
};

export default CursoDetalle;