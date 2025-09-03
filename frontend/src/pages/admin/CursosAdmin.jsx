import { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";

const CursosAdmin = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoCurso, setEditandoCurso] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/cursos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCursos(data.cursos || []);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicion = (curso) => {
    setEditandoCurso(curso.id);
    setFormData({
      titulo: curso.titulo,
      descripcion: curso.descripcion || '',
      categoria: curso.categoria || ''
    });
  };

  const cancelarEdicion = () => {
    setEditandoCurso(null);
    setFormData({ titulo: '', descripcion: '', categoria: '' });
  };

  const guardarCambios = async (cursoId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/cursos/${cursoId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar la lista local
      setCursos(cursos.map(curso => 
        curso.id === cursoId 
          ? { ...curso, ...formData }
          : curso
      ));

      setEditandoCurso(null);
      setFormData({ titulo: '', descripcion: '', categoria: '' });
    } catch (error) {
      console.error("Error al actualizar curso:", error);
      alert("Error al guardar los cambios");
    }
  };

  const eliminarCurso = async (cursoId, titulo) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el curso "${titulo}"?`)) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/cursos/${cursoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remover de la lista local
      setCursos(cursos.filter(curso => curso.id !== cursoId));
    } catch (error) {
      console.error("Error al eliminar curso:", error);
      alert("Error al eliminar el curso");
    }
  };

  if (loading) return <p className="text-center">Cargando cursos...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-pink-800">Gestión de Cursos</h2>
        <div className="flex gap-4">
          <button
              onClick={() => navigate(-1)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
              Volver
          </button>
          <Link
            to="/admin/cursos/nuevo"
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
          >
            Crear nuevo curso
          </Link>
        </div>
      </div>

      {cursos.length === 0 ? (
        <p className="text-gray-600">No hay cursos aún.</p>
      ) : (
        <div className="grid gap-4">
          {cursos.map((curso) => (
            <div key={curso.id} className="border p-4 rounded shadow bg-white">
              {editandoCurso === curso.id ? (
                // Modo edición
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">Título</label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">Descripción</label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      rows={3}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">Categoría</label>
                    <input
                      type="text"
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => guardarCambios(curso.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelarEdicion}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo visualización
                <>
                  <h3 className="text-lg font-semibold text-pink-700">{curso.titulo}</h3>
                  <p className="text-gray-700 mb-2">{curso.descripcion}</p>
                  <p className="text-sm text-gray-500">
                    Categoría: {curso.categoria || "Sin categoría"} |{" "}
                    Creado el: {new Date(curso.creado_en).toLocaleDateString()}
                  </p>

                  <div className="mt-3 flex gap-2 flex-wrap">
                    <button
                      onClick={() => navigate(`/admin/materiales/${curso.id}`)}
                      className="text-pink-600 hover:underline text-sm"
                    >
                      Gestionar materiales
                    </button>
                    
                    <button
                      onClick={() => iniciarEdicion(curso)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    
                    <button
                      onClick={() => eliminarCurso(curso.id, curso.titulo)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CursosAdmin;