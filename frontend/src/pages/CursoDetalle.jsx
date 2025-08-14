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
  const [cursoInfo, setCursoInfo] = useState({ titulo: "", categoria: ""});
  const [videosVistos, setVideosVistos] = useState([]);
  const [porcentajeAvance, setPorcentajeAvance] = useState(0);
  const [preguntas, setPreguntas] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState("");

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

    const obtenerCurso = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/cursos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCursoInfo({
          titulo: res.data.titulo,
          categoria: res.data.categoria || "Sin categoría",
        });

      } catch (error) {
        console.error("❌ Error al obtener datos del curso:", error);
        setCursoInfo({ titulo: "Curso no encontrado", categoria: "" });
      }
    };

    const obtenerProgreso = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/usuarios/${usuario.id}/progreso/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setVideosVistos(res.data.vistos || []);
      } catch (error) {
        console.error("❌ Error al obtener progreso:", error);
        setVideosVistos([]);
      }
    };

    if (videos.length > 0 && videosVistos.length > 0) {
      const vistos = videos.filter((v) => videosVistos.includes(v.id)).length;
      const porcentaje = Math.round((vistos / videos.length) * 100);
      setPorcentajeAvance(porcentaje);
    }else{
      setPorcentajeAvance(0);
    }

    


    if (usuario) {
      fetchMateriales();
      verificarMembresia();
      obtenerCurso();
      obtenerProgreso();
      fetchPreguntas();
    }

  }, [id, usuario, videos, videosVistos]);

  const marcarComoVisto = async (videoId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/progreso`,
        {
          video_id: videoId,
          curso_id: id
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualizamos localmente el progreso
      setVideosVistos((prev) => [...prev, videoId]);

    } catch (error) {
      console.error("❌ Error al marcar como visto:", error);
    }
  };

  const fetchPreguntas = async () => {
    const token = localStorage.getItem("token");

    try{
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/preguntas/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPreguntas(res.data || []);
        
    }catch (error) {
      console.error("❌ Error al obtener preguntas: ", error);
    }

  };

    const enviarPregunta = async () => {
    const token = localStorage.getItem("token");

    if(!nuevaPregunta.trim()) return;

    try{
      await axios.post(
        `${import.meta.env.VITE_API_URL}/preguntas`,
        {
          curso_id: id,
          pregunta: nuevaPregunta.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNuevaPregunta("");
      fetchPreguntas(); // Refresca la lista de preguntas
    }catch (error){
      console.error("❌ Error al enviar pregunta: ", error.response?.data || error.message);
    }

  };

  if (loading) return <p className="text-center">Cargando materiales...</p>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
      >
        ← Volver a cursos
      </button>

      <div className="space-y-1 mb-4">
        <h1 className="text-3xl font-bold text-pink-800">{cursoInfo.titulo}</h1>
        <p className="text-sm text-gray-600">📂 Categoría: {cursoInfo.categoria}</p>
      </div>

      <div className="text-sm text-gray-700">
        {membresiaActiva ? (
          <p className="text-green-600">✅ Tenés una membresía activa</p>
        ) : (
          <div>
            <p className="text-red-500">❌ No tenés una membresía activa</p>
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/mercadopago/preferencia`,
                    {
                      usuario_id: usuario.id,
                      precio: 1500 // 🔹 Fijo por ahora, pero editable en backend solo por admin
                    },
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  
                  // Redirigir al checkout de Mercado Pago
                  window.location.href = `https://www.mercadopago.com/checkout/v1/redirect?pref_id=${res.data.id}`;
                } catch (error) {
                  console.error("❌ Error al iniciar pago:", error.response?.data || error.message);
                  alert("Ocurrió un error al iniciar el pago. Intenta nuevamente.");
                }
              }}
              className="bg-pink-700 hover:bg-pink-800 text-white px-4 py-2 rounded"
            >
              Comprar Membresía
            </button>
          </div>
        )}
      </div>

      {membresiaActiva && (
        <button
          className={`px-4 py-2 rounded text-white ${
            videosVistos.length > 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-pink-700 hover:bg-pink-800'
          }`}
          onClick={()=> {
            if(videosVistos.length === 0){
              alert("¡Curso comenzado!");
            }
          }}
          disabled={videosVistos.length > 0}
        >
          {videosVistos.length > 0 ? 'Curso en progreso' : 'Comenzar Curso'}
        </button>
      )}

      {(videos.length > 0 && membresiaActiva) && (
        <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
          <div
            className="bg-green-500 h-4 rounded-full text-xs text-white text-center"
            style={{ width: `${porcentajeAvance}%` }}
          >
            {porcentajeAvance}%
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-pink-800">Videos</h2>
        {videos.length === 0 ? (
          <p className="text-gray-500 italic">No hay videos disponibles para este curso.</p>
        ): (

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
                  {(video.es_gratuito || membresiaActiva) && urlEmbed ? (
                    <>
                      <div className="aspect-video">
                        <iframe
                          src={urlEmbed}
                          title={video.titulo}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full rounded"
                        />
                      </div>

                      <div className="mt-2">
                        {videosVistos.includes(video.id) ? (
                          <p className="text-green-600 font-semibold">✅ Ya marcado como visto</p>
                        ) : (
                          <button
                            onClick={() => marcarComoVisto(video.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                          >
                            Marcar como visto
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">
                      Contenido exclusivo para miembros
                    </p>
                  )}

                </li>
              );
            })}
          </ul>
        )}

      <h2 className="text-2xl font-bold text-pink-800">Documentos</h2>
      {documentos.length === 0 ? (
        <p className="text-gray-500 italic">No hay documentos disponibles para este curso.</p>
      ) : (
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
      )}

      <Link
        to={`/cursos/${id}/trabajos`}
        className="inline-block mt-4 text-sm text-pink-600 hover:underline"
      >
        Ver trabajos del curso
      </Link>

      {/* Preguntas y respuestas */}
      <h2 className="text-2xl font-bold text-pink-800">Preguntas del curso</h2>
      
      {usuario?.rol !== 'admin' && (
        <p className="text-sm text-gray-500 italic mb-2">
          * Solo los administradores pueden responder las preguntas.
        </p>
      )}

      <div className="space-y-4">
        {preguntas.length === 0 ? (
          <p className="text-gray-600 italic">Todavía no hay preguntas.</p>
        ) : (
          preguntas.map((pregunta) => (
            <div
              key={pregunta.id}
              className="border border-pink-200 rounded p-4 bg-pink-50"
            >
              <p className="text-sm text-gray-700">
                <strong>{pregunta.usuario}</strong> preguntó el{" "}
                {new Date(pregunta.fecha).toLocaleDateString()}
              </p>
              <p className="text-pink-800 font-medium">{pregunta.pregunta}</p>

              {pregunta.respuesta ? (
                <div className="mt-2 p-2 bg-white border-l-4 border-green-500 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Respuesta:</strong> {pregunta.respuesta}
                  </p>
                </div>
              ) : (
                <p className="text-sm italic text-gray-500 mt-2">
                  Aún sin respuesta.
                </p>
              )}

              {usuario?.rol === 'admin' && !pregunta.respuesta && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target;
                    const respuesta = form.respuesta.value.trim();
                    if (!respuesta) return;

                    const responder = async () => {
                      try{
                        const token = localStorage.getItem("token");
                        await axios.put(
                          `${import.meta.env.VITE_API_URL}/preguntas/${pregunta.id}`,
                          { respuesta },
                          {
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );
                        form.reset();
                        fetchPreguntas(); // refresca la lista

                      }catch (error){
                        console.error("❌ Error al responder pregunta: ", error);
                      }
                    };

                    responder();
                  }}
                  className="mt-2 space-y-2"
                >
                  <textarea
                    name="respuesta"
                    rows="2"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Escribí tu respuesta..."
                  />
                  <button
                    type="submit"
                    className="bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-800 text-sm"
                  >
                    Responder
                  </button>
                </form>
              )}
              
            </div>
          ))
        )}
      </div>

      {/* Formulario para hacer pregunta */}
      <div className="mt-6">
        <textarea
          value={nuevaPregunta}
          onChange={(e) => setNuevaPregunta(e.target.value)}
          placeholder="Escribí tu pregunta..."
          className="w-full p-2 border border-gray-300 rounded mb-2"
          rows={3}
        />
        <button
          onClick={enviarPregunta}
          className="bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-800"
        >
          Enviar pregunta
        </button>
      </div>

    </div>
  );
};

export default CursoDetalle;