import { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";

const CursosAdmin = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCursos = async () => {
      const token = localStorage.getItem("token");

      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/cursos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCursos(data.cursos || []);
      } catch (error) {
        console.error("❌ Error al obtener cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  if (loading) return <p className="text-center">Cargando cursos...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-pink-800">Gestión de Cursos</h2>
        <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
        >
            ← Volver
        </button>
        <Link
          to="/admin/cursos/nuevo"
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          ➕ Crear nuevo curso
        </Link>
      </div>

      {cursos.length === 0 ? (
        <p className="text-gray-600">No hay cursos aún.</p>
      ) : (
        <div className="grid gap-4">
          {cursos.map((curso) => (
            <div key={curso.id} className="border p-4 rounded shadow bg-white">
              <h3 className="text-lg font-semibold text-pink-700">{curso.titulo}</h3>
              <p className="text-gray-700 mb-2">{curso.descripcion}</p>
              <p className="text-sm text-gray-500">
                Categoría: {curso.categoria || "Sin categoría"} |{" "}
                Creado el: {new Date(curso.creado_en).toLocaleDateString()}
              </p>

              <button
                onClick={() => navigate(`/admin/materiales/${curso.id}`)}
                className="mt-2 inline-block text-pink-600 hover:underline"
              >
               📂 Gestionar materiales
              </button> 
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CursosAdmin;