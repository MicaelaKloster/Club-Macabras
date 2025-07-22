import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TemaDetalle = () => {
  const { id } = useParams();
  const [tema, setTema] = useState(null);
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTema = async () => {
    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/temas-foro/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTema(data);
    } catch (error) {
      console.error("❌ Error al obtener el tema:", error);
      setError("Error al cargar el tema.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTema();
  }, [id]);

  const handleRespuestaSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/temas-foro/${id}/respuestas`,
        { contenido: respuesta },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRespuesta("");
      await fetchTema(); // Recargamos el tema con las respuestas actualizadas
    } catch (err) {
      console.error("❌ Error al enviar respuesta:", err);
      setError("No se pudo enviar la respuesta.");
    }
  };

  if (loading) return <p className="text-center">Cargando tema...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!tema) return <p className="text-center">Tema no encontrado.</p>;

  return (
    <div className="space-y-6">
        <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:underline mb-2"
        >
            ← Volver atrás
        </button>

      <h2 className="text-2xl font-bold text-pink-800">{tema.tema}</h2>
      <p className="text-sm text-gray-600">
        Creado por: {tema.nombre || "Desconocido"} | {new Date(tema.fecha).toLocaleDateString()}
      </p>
      <p className="text-gray-800">{tema.contenido}</p>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-pink-700 mb-2">💬 Respuestas</h3>
        {tema.respuestas.length === 0 ? (
          <p className="text-gray-600 italic">Aún no hay respuestas.</p>
        ) : (
          <ul className="space-y-4">
            {tema.respuestas.map((resp) => (
              <li key={resp.id} className="border p-4 rounded shadow">
                <p className="text-sm text-gray-600">
                  {resp.nombre} | {new Date(resp.fecha).toLocaleDateString()}
                </p>
                <p className="text-gray-800 mt-2">{resp.contenido}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleRespuestaSubmit} className="mt-6 space-y-4">
        <h4 className="text-lg font-semibold">Responder al tema</h4>
        <textarea
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          rows={4}
          required
        ></textarea>
        <button
          type="submit"
          className="bg-pink-700 text-white px-6 py-2 rounded hover:bg-pink-800"
        >
          Enviar respuesta
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default TemaDetalle;
