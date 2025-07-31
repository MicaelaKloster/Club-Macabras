import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardAdmin = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-pink-800">Panel del Administrador</h1>
      <p className="text-gray-600">¡Hola {usuario?.nombre}! Elegí qué querés gestionar:</p>

      <div className="grid gap-4">
        <button
          onClick={() => navigate("/admin/usuarios")}
          className="bg-pink-700 text-white px-6 py-3 rounded hover:bg-pink-800"
        >
          👤 Gestión de Usuarios
        </button>

        <button
          onClick={() => navigate("/admin/cursos")}
          className="bg-pink-700 text-white px-6 py-3 rounded hover:bg-pink-800"
        >
          📚 Gestión de Cursos
        </button>

        <button
          onClick={() => navigate("/admin/preguntas")}
          className="bg-pink-700 text-white px-6 py-3 rounded hover:bg-pink-800"
        >
          ❓ Preguntas Pendientes
        </button>
      </div>
    </div>
  );

};

export default DashboardAdmin;