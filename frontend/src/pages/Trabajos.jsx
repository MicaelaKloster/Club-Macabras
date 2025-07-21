import { useEffect, useState } from "react";
import axios from "axios";

const Trabajos = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerTrabajos = async () => {
      const token = localStorage.getItem("token");

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/trabajos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTrabajos(data.trabajos);
      } catch (error) {
        console.error("❌ Error al obtener trabajos:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerTrabajos();
  }, []);

  if (loading) return <p className="text-center">Cargando trabajos...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pink-800">Trabajos publicados</h2>

      <div className="grid gap-6">
        {trabajos.map((trabajo) => (
          <div key={trabajo.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold text-pink-700">
              {trabajo.titulo}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Publicado por: {trabajo.usuario?.nombre || "Desconocido"}
            </p>
            <p className="text-gray-800 mb-3">{trabajo.descripcion}</p>
            {trabajo.imagen && (
              <img
                src={trabajo.imagen}
                alt={`Imagen de ${trabajo.titulo}`}
                className="w-full max-w-xs rounded"
              />
            )}
            <p className="mt-2 text-sm text-gray-500">
              ❤️ {trabajo.likes || 0} Me gusta
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trabajos;