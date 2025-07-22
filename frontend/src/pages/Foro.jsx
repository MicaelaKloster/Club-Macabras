import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Foro = () => {
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTemas = async () => {
    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/temas-foro`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTemas(data.temas);
    } catch (error) {
      console.error("❌ Error al obtener temas del foro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemas();
  }, []);

  if (loading) return <p className="text-center">Cargando temas del foro...</p>;

  return (
    <div className="space-y-10">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline mb-2"
        >
          ← Volver atrás
        </button>

        <h2 className="text-2xl font-bold text-pink-800 mb-4">Foro de la comunidad</h2>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/foro/nuevo")}
            className="bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-800"
          >
            + Nuevo Tema
          </button>
        </div>

        <div className="grid gap-6">
          {temas.map((tema) => (
            <div key={tema.id} className="border p-4 rounded shadow">
              <Link
                to={`/foro/${tema.id}`}
                className="text-lg font-semibold text-pink-700 hover:underline"
              >
                {tema.tema}
              </Link>

              <p className="text-sm text-gray-600 mb-1">
                Creado por: {tema.nombre || "Desconocido"} |{" "}
                {new Date(tema.fecha).toLocaleDateString()}
              </p>
              <p className="text-gray-800 mb-2">{tema.contenido}</p>
              <p className="text-sm text-gray-500">
                💬 {tema.cantidad_respuestas || 0} respuestas
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Foro;