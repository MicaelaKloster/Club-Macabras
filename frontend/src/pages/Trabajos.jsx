import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Trabajos = () => {
  const { cursoId } = useParams(); 
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerTrabajos = async () => {
      const token = localStorage.getItem("token");

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/trabajos/${cursoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTrabajos(data);
      } catch (error) {
        console.error("❌ Error al obtener trabajos:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerTrabajos();
  }, [cursoId]);

  if (loading) return <p className="text-center">Cargando trabajos...</p>;

  const manejarLike = async (trabajoId) => {
  const token = localStorage.getItem("token");

  try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/trabajos/${trabajoId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

        // Actualizar estado local después de dar/quitar like
        setTrabajos((prev) =>
          prev.map((t) =>
            t.id === trabajoId
              ? {
                  ...t,
                  dado_like: !t.dado_like,
                  cantidad_likes: t.dado_like
                    ? t.cantidad_likes - 1
                    : t.cantidad_likes + 1,
                }
              : t
          )
        );
    } catch (error) {
      console.error("❌ Error al dar/quitar like:", error);
    }
  };


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pink-800">Trabajos publicados</h2>

      <div className="grid gap-6">
        {trabajos.map((trabajo) => (
          <div key={trabajo.id} className="border p-4 rounded shadow">
            <p className="text-sm text-gray-600 mb-1">
              Publicado por: {trabajo.autor}
            </p>
            <p className="text-gray-800 mb-3">{trabajo.descripcion}</p>
            <img
              src={trabajo.imagen_url}
              alt={`Trabajo de ${trabajo.autor}`}
              className="w-full max-w-xs rounded"
            />
            <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
              <button
                onClick={() => manejarLike(trabajo.id)}
                className={`text-lg ${
                  trabajo.dado_like ? "text-red-600" : "text-gray-400"
                }`}
                title={trabajo.dado_like ? "Quitar me gusta" : "Dar me gusta"}
              >
                ❤️
              </button>
              {trabajo.cantidad_likes} me gusta
            </p>
          </div>
        ))}
      </div>

      <Link 
        to={`/cursos/${cursoId}/trabajos/nuevo`}
        className="inline-block mt-4 bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-800"
      >
        Subir nuevo trabajo
      </Link>
    </div>
  );
};

export default Trabajos;